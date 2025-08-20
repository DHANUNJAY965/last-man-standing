// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/**
 * Minimal, production-safe core + a tiny test hook for local testing.
 * Uses the "RandomnessReceiverBase" style you pasted (constructor requires sender + owner).
 *
 * IMPORTANT:
 *  - In PRODUCTION you deploy with the real Dcipher RandomnessSender,
 *    and you will NOT use the __testFulfill() helper.
 *  - In LOCAL TESTS you can call __testFulfill() to simulate oracle callback.
 */

import {RandomnessReceiverBase} from "randomness-solidity/src/RandomnessReceiverBase.sol";

contract LastManStanding is RandomnessReceiverBase {
    // --- constants ---
    uint256 public constant INITIAL_DEPOSIT = 0.0003 ether;
    uint256 public constant ROUND_DURATION = 24 hours;

    // --- current round state ---
    uint256 public currentRoundId = 1;
    uint256 public depositCount;
    uint256 public currentRequiredAmount = INITIAL_DEPOSIT;
    uint256 public vaultBalance;
    address public lastDepositor;
    uint256 public lastDepositTime; // 0 until first deposit

    struct BonusInfo {
        address winner;
        uint256 amount;
        uint256 percentage; // 0..5
        uint256 depositNum; // 50, 100, 150...
    }
    BonusInfo public lastBonus; // for UI of current round

    struct PendingBonus {
        uint256 roundId;
        address depositor;
        uint256 vaultSnapshot;
        uint256 depositNum;
    }
    mapping(uint256 => PendingBonus) public pendingBonuses; // requestId => data

    struct RoundSummary {
        address winner;
        uint256 finalVault;
        uint256 totalDeposits;
        uint256 endedAt;
        BonusInfo lastBonus;
    }
    mapping(uint256 => RoundSummary) public roundSummaries;

    // events the backend will index
    event RoundStarted(uint256 indexed roundId, uint256 time);
    event DepositMade(
        uint256 indexed roundId,
        address indexed depositor,
        uint256 amount,
        uint256 depositNumber,
        uint256 newRequiredAmount,
        uint256 newDeadline
    );
    event BonusRequested(
        uint256 indexed roundId,
        uint256 indexed requestId,
        address indexed depositor,
        uint256 vaultSnapshot,
        uint256 depositNumber
    );
    event BonusPaid(
        uint256 indexed roundId,
        address indexed depositor,
        uint256 percentage,
        uint256 amount,
        uint256 depositNumber
    );
    event RoundEnded(
        uint256 indexed roundId,
        address indexed winner,
        uint256 finalVault,
        uint256 totalDeposits,
        uint256 endedAt
    );

    constructor(address randomnessSender, address owner)
        RandomnessReceiverBase(randomnessSender, owner)
    {
        emit RoundStarted(currentRoundId, block.timestamp);
    }

    // ------------ views ------------
    function currentDeadline() public view returns (uint256) {
        if (lastDepositTime == 0) return 0;
        return lastDepositTime + ROUND_DURATION;
    }

    function getCurrentRoundInfo()
        external
        view
        returns (
            uint256 roundId,
            uint256 _vaultBalance,
            uint256 _currentRequiredAmount,
            address _lastDepositor,
            uint256 _lastDepositTime,
            uint256 _deadline,
            uint256 _depositCount,
            BonusInfo memory _lastBonus
        )
    {
        return (
            currentRoundId,
            vaultBalance,
            currentRequiredAmount,
            lastDepositor,
            lastDepositTime,
            currentDeadline(),
            depositCount,
            lastBonus
        );
    }

    // ------------ core ------------
    function deposit() external payable {
        require(msg.value == currentRequiredAmount, "Incorrect amount");

        // start/reset 24h
        lastDepositTime = block.timestamp;

        // update balances
        vaultBalance += msg.value;
        lastDepositor = msg.sender;
        depositCount += 1;

        // every 50th deposit → randomness bonus (0..5)% of vaultSnapshot
        if (depositCount % 50 == 0) {
            // subscription path (no msg.value needed)
            uint32 callbackGasLimit = 500_000; // tune in prod
            uint256 requestID = _requestRandomnessWithSubscription(callbackGasLimit);
            pendingBonuses[requestID] = PendingBonus({
                roundId: currentRoundId,
                depositor: msg.sender,
                vaultSnapshot: vaultBalance,
                depositNum: depositCount
            });
            emit BonusRequested(currentRoundId, requestID, msg.sender, vaultBalance, depositCount);
        }

        // next required amount
        // step = floor(depositCount / 50) + 1
        uint256 step = (depositCount / 50) + 1;
        currentRequiredAmount = currentRequiredAmount + (INITIAL_DEPOSIT * step);

        emit DepositMade(
            currentRoundId,
            msg.sender,
            msg.value,
            depositCount,
            currentRequiredAmount,
            currentDeadline()
        );
    }

    function endRoundIfExpired() external {
        require(vaultBalance > 0, "No active funds");
        require(block.timestamp >= currentDeadline(), "Still active");

        uint256 payout = vaultBalance;
        address winner = lastDepositor;

        // snapshot summary
        roundSummaries[currentRoundId] = RoundSummary({
            winner: winner,
            finalVault: payout,
            totalDeposits: depositCount,
            endedAt: block.timestamp,
            lastBonus: lastBonus
        });
        emit RoundEnded(currentRoundId, winner, payout, depositCount, block.timestamp);

        // reset to next round
        currentRoundId += 1;
        depositCount = 0;
        currentRequiredAmount = INITIAL_DEPOSIT;
        vaultBalance = 0;
        lastDepositor = address(0);
        lastDepositTime = 0;
        delete lastBonus;

        emit RoundStarted(currentRoundId, block.timestamp);

        (bool ok, ) = winner.call{value: payout}("");
        require(ok, "Transfer failed");
    }

    // Dcipher callback
    function onRandomnessReceived(uint256 requestID, bytes32 _randomness) internal override {
        PendingBonus memory pb = pendingBonuses[requestID];
        require(pb.depositor != address(0), "Unknown request");

        uint256 pct = uint256(_randomness) % 6; // 0..5
        uint256 bonus = (pb.vaultSnapshot * pct) / 100;

        if (pb.roundId == currentRoundId) {
            lastBonus = BonusInfo({
                winner: pb.depositor,
                amount: bonus,
                percentage: pct,
                depositNum: pb.depositNum
            });
        }

        if (bonus > 0) {
            (bool ok, ) = pb.depositor.call{value: bonus}("");
            require(ok, "Bonus payout failed");
            vaultBalance -= bonus;
        }
        emit BonusPaid(pb.roundId, pb.depositor, pct, bonus, pb.depositNum);

        delete pendingBonuses[requestID];
    }

    // ============== LOCAL TEST HOOK ==============
    // DO NOT USE IN PRODUCTION. Only for local tests to simulate oracle fulfillment.
    function __testFulfill(uint256 requestID, bytes32 fakeRandomness) external onlyOwner {
        onRandomnessReceived(requestID, fakeRandomness);
    }

    // receive
    receive() external payable {}
}
