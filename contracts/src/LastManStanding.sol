// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "openzeppelin-contracts/contracts/utils/ReentrancyGuard.sol";

interface IRandomnessSender {
    function requestRandomness() external returns (uint256);
}

interface IBlocklockSender {
    function requestBlocklock(bytes memory data, bytes memory condition) external returns (uint256);
}

contract LastManStanding is ReentrancyGuard {
    struct Round {
        uint256 roundId;
        uint256 potAmount;
        uint256 reservedBonus;
        uint256 depositCount;
        address lastDepositor;
        uint256 lastDepositTime;
        uint256 nextDepositAmount;
        bool isActive;
        bool hasWinner;
        address winner;
        uint256 startTime;
    }

    struct BonusWinner {
        address depositor;
        uint256 bonusAmount;
        uint256 depositNumber;
        uint256 roundId;
        uint256 bonusPercentage;
        bool paid;
        bool revealed;
    }

    struct PendingRandomness {
        uint256 roundId;
        uint256 depositNumber;
        address depositor;
        uint256 potAtTime;
        bool fulfilled;
    }

    struct PendingBlocklock {
        uint256 roundId;
        uint256 depositNumber;
        uint256 bonusPercentage;
        bytes encryptedData;
        bool revealed;
    }

    // Constants
    uint256 public constant GAME_DURATION = 24 hours;
    uint256 public constant BASE_DEPOSIT = 0.01 ether;
    uint256 public constant POT_PERCENTAGE = 50; // 0.5% = 50/10000
    uint256 public constant BONUS_INTERVAL = 10;
    uint256 public constant MIN_BONUS_PERCENTAGE = 1;
    uint256 public constant MAX_BONUS_PERCENTAGE = 5;

    // External contract interfaces
    IRandomnessSender public randomnessSender;
    IBlocklockSender public blocklockSender;

    // State variables
    uint256 public currentRoundId;
    mapping(uint256 => Round) public rounds;
    mapping(uint256 => BonusWinner[]) public roundBonusWinners;
    mapping(uint256 => uint256) private requestIdToCounter; // VRF requestId to our counter
    mapping(uint256 => PendingRandomness) public pendingRandomness;
    mapping(uint256 => PendingBlocklock) public pendingBlocklock;
    
    // VRF and Blocklock tracking
    uint256 private randomnessRequestCounter;
    uint256 private blocklockRequestCounter;

    // Admin
    address public owner;

    // Events
    event RoundStarted(uint256 indexed roundId, uint256 startTime);
    event DepositMade(
        uint256 indexed roundId,
        address indexed depositor,
        uint256 amount,
        uint256 depositNumber,
        uint256 newPotAmount,
        uint256 nextDepositAmount,
        uint256 deadline
    );
    event BonusRandomnessRequested(
        uint256 indexed roundId,
        uint256 indexed depositNumber,
        address indexed depositor,
        uint256 requestId,
        uint256 potAtTime
    );
    event BonusPercentageEncrypted(
        uint256 indexed roundId,
        uint256 indexed depositNumber,
        uint256 blocklockRequestId,
        uint256 unlockBlock
    );
    event BonusWinnerDetermined(
        uint256 indexed roundId,
        uint256 indexed depositNumber,
        address indexed depositor,
        uint256 bonusPercentage,
        uint256 bonusAmount
    );
    event BonusPercentageRevealed(
        uint256 indexed roundId,
        uint256 indexed depositNumber,
        uint256 bonusPercentage
    );
    event RoundEnded(
        uint256 indexed roundId,
        address indexed winner,
        uint256 potAmount,
        uint256 endTime
    );
    event BonusPaid(
        uint256 indexed roundId,
        address indexed winner,
        uint256 amount,
        uint256 depositNumber
    );
    event WinnerPaid(uint256 indexed roundId, address indexed winner, uint256 amount);

    modifier onlyRandomnessSender() {
        require(msg.sender == address(randomnessSender), "Only randomness sender");
        _;
    }

    modifier onlyBlocklockSender() {
        require(msg.sender == address(blocklockSender), "Only blocklock sender");
        _;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }

    constructor(
        address _randomnessSender,
        address _blocklockSender
    ) {
        randomnessSender = IRandomnessSender(_randomnessSender);
        blocklockSender = IBlocklockSender(_blocklockSender);
        owner = msg.sender;
        _startNewRound();
    }

    function _startNewRound() internal {
        currentRoundId++;
        Round storage newRound = rounds[currentRoundId];
        newRound.roundId = currentRoundId;
        newRound.potAmount = 0;
        newRound.reservedBonus = 0;
        newRound.depositCount = 0;
        newRound.lastDepositor = address(0);
        newRound.lastDepositTime = 0;
        newRound.nextDepositAmount = BASE_DEPOSIT;
        newRound.isActive = true;
        newRound.hasWinner = false;
        newRound.winner = address(0);
        newRound.startTime = block.timestamp;

        emit RoundStarted(currentRoundId, block.timestamp);
    }

    function deposit() external payable nonReentrant {
        require(msg.value > 0, "Must send ETH");
        
        Round storage round = rounds[currentRoundId];
        require(round.isActive, "Round not active");
        require(msg.value >= round.nextDepositAmount, "Insufficient deposit amount");

        // Check if previous round timed out
        if (round.depositCount > 0 && block.timestamp >= round.lastDepositTime + GAME_DURATION) {
            _endRound();
            round = rounds[currentRoundId]; // Get new round
        }

        // Update round state
        round.potAmount += msg.value;
        round.depositCount++;
        round.lastDepositor = msg.sender;
        round.lastDepositTime = block.timestamp;
        
        // Calculate next deposit amount: 0.01 ETH + (pot * 0.5%)
        round.nextDepositAmount = BASE_DEPOSIT + (round.potAmount * POT_PERCENTAGE) / 10000;

        emit DepositMade(
            currentRoundId,
            msg.sender,
            msg.value,
            round.depositCount,
            round.potAmount,
            round.nextDepositAmount,
            block.timestamp + GAME_DURATION
        );

        // Check for bonus eligibility (every 10th depositor)
        if (round.depositCount % BONUS_INTERVAL == 0) {
            _handleBonusDepositor(round.depositCount, msg.sender, round.potAmount);
        }
    }

    function _handleBonusDepositor(uint256 depositNumber, address depositor, uint256 potAtTime) internal {
        // Request randomness for bonus percentage
        randomnessRequestCounter++;
        
        // Store pending randomness before making the request
        pendingRandomness[randomnessRequestCounter] = PendingRandomness({
            roundId: currentRoundId,
            depositNumber: depositNumber,
            depositor: depositor,
            potAtTime: potAtTime,
            fulfilled: false
        });

        // Make VRF request to dcipher randomness contract
        try randomnessSender.requestRandomness() returns (uint256 requestId) {
            requestIdToCounter[requestId] = randomnessRequestCounter;
            
            emit BonusRandomnessRequested(
                currentRoundId,
                depositNumber,
                depositor,
                requestId,
                potAtTime
            );
        } catch {
            // Fallback: use pseudo-randomness
            _handleRandomnessFulfilled(randomnessRequestCounter, keccak256(abi.encode(block.timestamp, block.prevrandao, depositor)));
        }
    }

    // This function will be called by the dcipher randomness oracle
    function fulfillRandomness(uint256 requestId, bytes32 randomValue) external onlyRandomnessSender {
        uint256 counter = requestIdToCounter[requestId];
        _handleRandomnessFulfilled(counter, randomValue);
    }

    function _handleRandomnessFulfilled(uint256 counter, bytes32 randomValue) internal {
        PendingRandomness storage pending = pendingRandomness[counter];
        require(!pending.fulfilled, "Randomness already fulfilled");
        
        pending.fulfilled = true;

        // Generate bonus percentage (1-5%) using VRF randomness
        uint256 bonusPercentage = (uint256(randomValue) % MAX_BONUS_PERCENTAGE) + MIN_BONUS_PERCENTAGE;
        
        // Calculate bonus amount from pot at the time of deposit
        uint256 bonusAmount = (pending.potAtTime * bonusPercentage) / 100;
        
        // Reserve the bonus amount
        Round storage round = rounds[pending.roundId];
        round.reservedBonus += bonusAmount;

        // Encrypt the bonus percentage using Blocklock
        _encryptBonusPercentage(pending.roundId, pending.depositNumber, bonusPercentage, bonusAmount, pending.depositor);

        emit BonusWinnerDetermined(
            pending.roundId,
            pending.depositNumber,
            pending.depositor,
            bonusPercentage,
            bonusAmount
        );
    }

    function _encryptBonusPercentage(
        uint256 roundId,
        uint256 depositNumber,
        uint256 bonusPercentage,
        uint256 bonusAmount,
        address depositor
    ) internal {
        // Create blocklock condition - unlock after round ends (estimated 1 day from now)
        uint256 unlockBlock = block.number + 7200; // ~24 hours assuming 12s block time
        
        // Encode the bonus percentage for encryption
        bytes memory data = abi.encode(bonusPercentage);
        bytes memory condition = abi.encode(unlockBlock);
        
        // Create the blocklock request
        blocklockRequestCounter++;
        
        // Store pending blocklock
        pendingBlocklock[blocklockRequestCounter] = PendingBlocklock({
            roundId: roundId,
            depositNumber: depositNumber,
            bonusPercentage: bonusPercentage,
            encryptedData: data,
            revealed: false
        });

        // Store bonus winner (but don't reveal percentage until blocklock unlocks)
        BonusWinner memory bonusWinner = BonusWinner({
            depositor: depositor,
            bonusAmount: bonusAmount,
            depositNumber: depositNumber,
            roundId: roundId,
            bonusPercentage: 0, // Hidden until revealed
            paid: false,
            revealed: false
        });
        
        roundBonusWinners[roundId].push(bonusWinner);

        // Request blocklock encryption to dcipher
        try blocklockSender.requestBlocklock(data, condition) returns (uint256 blocklockRequestId) {
            emit BonusPercentageEncrypted(roundId, depositNumber, blocklockRequestId, unlockBlock);
        } catch {
            // Fallback: reveal immediately for testing
            _revealBonusPercentage(blocklockRequestCounter, bonusPercentage);
        }
    }

    // This function will be called by the dcipher blocklock oracle when data can be revealed
    function fulfillBlocklock(uint256 requestId, bytes calldata decryptionKey) external onlyBlocklockSender {
        PendingBlocklock storage pending = pendingBlocklock[requestId];
        require(!pending.revealed, "Already revealed");
        
        _revealBonusPercentage(requestId, pending.bonusPercentage);
    }

    function _revealBonusPercentage(uint256 requestId, uint256 revealedPercentage) internal {
        PendingBlocklock storage pending = pendingBlocklock[requestId];
        pending.revealed = true;

        // Update the bonus winner with revealed percentage
        BonusWinner[] storage bonusWinners = roundBonusWinners[pending.roundId];
        for (uint256 i = 0; i < bonusWinners.length; i++) {
            if (bonusWinners[i].depositNumber == pending.depositNumber) {
                bonusWinners[i].bonusPercentage = revealedPercentage;
                bonusWinners[i].revealed = true;
                break;
            }
        }

        emit BonusPercentageRevealed(pending.roundId, pending.depositNumber, revealedPercentage);
    }

    function checkTimeoutAndEndRound() external {
        Round storage round = rounds[currentRoundId];
        require(round.isActive, "Round not active");
        require(round.depositCount > 0, "No deposits in round");
        require(block.timestamp >= round.lastDepositTime + GAME_DURATION, "Timeout not reached");
        
        _endRound();
    }

    function _endRound() internal {
        Round storage round = rounds[currentRoundId];
        require(round.isActive, "Round already ended");
        
        round.isActive = false;
        round.hasWinner = true;
        round.winner = round.lastDepositor;

        emit RoundEnded(currentRoundId, round.winner, round.potAmount, block.timestamp);

        // Start new round
        _startNewRound();
    }

    function claimWinnings(uint256 roundId) external nonReentrant {
        Round storage round = rounds[roundId];
        require(!round.isActive && round.hasWinner, "Round not ended or no winner");
        
        bool claimed = false;
        
        // Check if caller is a bonus winner
        BonusWinner[] storage bonusWinners = roundBonusWinners[roundId];
        
        for (uint256 i = 0; i < bonusWinners.length; i++) {
            BonusWinner storage bonus = bonusWinners[i];
            if (bonus.depositor == msg.sender && !bonus.paid && bonus.bonusAmount <= address(this).balance) {
                bonus.paid = true;
                round.reservedBonus -= bonus.bonusAmount;
                claimed = true;
                
                (bool success, ) = payable(msg.sender).call{value: bonus.bonusAmount}("");
                require(success, "Bonus payment failed");
                
                emit BonusPaid(roundId, msg.sender, bonus.bonusAmount, bonus.depositNumber);
                break;
            }
        }
        
        // Pay main winner
        if (round.winner == msg.sender && round.potAmount > round.reservedBonus) {
            uint256 winnerAmount = round.potAmount - round.reservedBonus;
            round.potAmount = round.reservedBonus; // Keep only reserved bonus
            claimed = true;
            
            (bool success, ) = payable(msg.sender).call{value: winnerAmount}("");
            require(success, "Winner payment failed");
            
            emit WinnerPaid(roundId, msg.sender, winnerAmount);
        }
        
        require(claimed, "No winnings to claim");
    }

    // View functions
    function getCurrentRound() external view returns (Round memory) {
        return rounds[currentRoundId];
    }

    function getRound(uint256 roundId) external view returns (Round memory) {
        return rounds[roundId];
    }

    function getRoundBonusWinners(uint256 roundId) external view returns (BonusWinner[] memory) {
        return roundBonusWinners[roundId];
    }

    function getTimeUntilTimeout() external view returns (uint256) {
        Round storage round = rounds[currentRoundId];
        if (!round.isActive || round.depositCount == 0) {
            return 0;
        }
        
        uint256 deadline = round.lastDepositTime + GAME_DURATION;
        if (block.timestamp >= deadline) {
            return 0;
        }
        
        return deadline - block.timestamp;
    }

    function getAvailablePot() external view returns (uint256) {
        Round storage round = rounds[currentRoundId];
        return round.potAmount - round.reservedBonus;
    }

    function getTotalPotDisplay() external view returns (uint256) {
        Round storage round = rounds[currentRoundId];
        return round.potAmount; // Show full pot for UI display
    }

    receive() external payable {
        // Allow contract to receive ETH
    }
}