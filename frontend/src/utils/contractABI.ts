export const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;

// Complete ABI with all necessary functions
export const CONTRACT_ABI = [
  // Constants
  {
    "inputs": [],
    "name": "GAME_DURATION",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "BASE_DEPOSIT",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "POT_PERCENTAGE",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "BONUS_INTERVAL",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  
  // State variables
  {
    "inputs": [],
    "name": "currentRoundId",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "stateMutability": "view",
    "type": "function"
  },

  // View functions
  {
    "inputs": [],
    "name": "getCurrentRound",
    "outputs": [
      {
        "components": [
          { "internalType": "uint256", "name": "roundId", "type": "uint256" },
          { "internalType": "uint256", "name": "potAmount", "type": "uint256" },
          { "internalType": "uint256", "name": "reservedBonus", "type": "uint256" },
          { "internalType": "uint256", "name": "depositCount", "type": "uint256" },
          { "internalType": "address", "name": "lastDepositor", "type": "address" },
          { "internalType": "uint256", "name": "lastDepositTime", "type": "uint256" },
          { "internalType": "uint256", "name": "nextDepositAmount", "type": "uint256" },
          { "internalType": "bool", "name": "isActive", "type": "bool" },
          { "internalType": "bool", "name": "hasWinner", "type": "bool" },
          { "internalType": "address", "name": "winner", "type": "address" },
          { "internalType": "uint256", "name": "startTime", "type": "uint256" }
        ],
        "internalType": "struct LastManStanding.Round",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "roundId", "type": "uint256" }],
    "name": "getRound",
    "outputs": [
      {
        "components": [
          { "internalType": "uint256", "name": "roundId", "type": "uint256" },
          { "internalType": "uint256", "name": "potAmount", "type": "uint256" },
          { "internalType": "uint256", "name": "reservedBonus", "type": "uint256" },
          { "internalType": "uint256", "name": "depositCount", "type": "uint256" },
          { "internalType": "address", "name": "lastDepositor", "type": "address" },
          { "internalType": "uint256", "name": "lastDepositTime", "type": "uint256" },
          { "internalType": "uint256", "name": "nextDepositAmount", "type": "uint256" },
          { "internalType": "bool", "name": "isActive", "type": "bool" },
          { "internalType": "bool", "name": "hasWinner", "type": "bool" },
          { "internalType": "address", "name": "winner", "type": "address" },
          { "internalType": "uint256", "name": "startTime", "type": "uint256" }
        ],
        "internalType": "struct LastManStanding.Round",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "roundId", "type": "uint256" }],
    "name": "getRoundBonusWinners",
    "outputs": [
      {
        "components": [
          { "internalType": "address", "name": "depositor", "type": "address" },
          { "internalType": "uint256", "name": "bonusAmount", "type": "uint256" },
          { "internalType": "uint256", "name": "depositNumber", "type": "uint256" },
          { "internalType": "uint256", "name": "roundId", "type": "uint256" },
          { "internalType": "uint256", "name": "bonusPercentage", "type": "uint256" },
          { "internalType": "bool", "name": "paid", "type": "bool" },
          { "internalType": "bool", "name": "revealed", "type": "bool" }
        ],
        "internalType": "struct LastManStanding.BonusWinner[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getTimeUntilTimeout",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getAvailablePot",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getTotalPotDisplay",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },

  // Write functions
  {
    "inputs": [],
    "name": "deposit",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "checkTimeoutAndEndRound",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "roundId", "type": "uint256" }],
    "name": "claimWinnings",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },

  // Oracle functions (for external oracles)
  {
    "inputs": [
      { "internalType": "uint256", "name": "requestId", "type": "uint256" },
      { "internalType": "bytes32", "name": "randomValue", "type": "bytes32" }
    ],
    "name": "fulfillRandomness",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "requestId", "type": "uint256" },
      { "internalType": "bytes", "name": "decryptionKey", "type": "bytes" }
    ],
    "name": "fulfillBlocklock",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },

  // Testing functions (remove in production)
  {
    "inputs": [
      { "internalType": "uint256", "name": "counter", "type": "uint256" },
      { "internalType": "bytes32", "name": "randomValue", "type": "bytes32" }
    ],
    "name": "testTriggerRandomness",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "requestId", "type": "uint256" },
      { "internalType": "uint256", "name": "percentage", "type": "uint256" }
    ],
    "name": "testRevealBonus",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },

  // Constructor (for reference)
  {
    "inputs": [
      { "internalType": "address", "name": "_randomnessSender", "type": "address" },
      { "internalType": "address", "name": "_blocklockSender", "type": "address" }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },

  // Receive function
  {
    "stateMutability": "payable",
    "type": "receive"
  },

  // Events
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "uint256", "name": "roundId", "type": "uint256" },
      { "indexed": false, "internalType": "uint256", "name": "startTime", "type": "uint256" }
    ],
    "name": "RoundStarted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "uint256", "name": "roundId", "type": "uint256" },
      { "indexed": true, "internalType": "address", "name": "depositor", "type": "address" },
      { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" },
      { "indexed": false, "internalType": "uint256", "name": "depositNumber", "type": "uint256" },
      { "indexed": false, "internalType": "uint256", "name": "newPotAmount", "type": "uint256" },
      { "indexed": false, "internalType": "uint256", "name": "nextDepositAmount", "type": "uint256" },
      { "indexed": false, "internalType": "uint256", "name": "deadline", "type": "uint256" }
    ],
    "name": "DepositMade",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "uint256", "name": "roundId", "type": "uint256" },
      { "indexed": true, "internalType": "uint256", "name": "depositNumber", "type": "uint256" },
      { "indexed": true, "internalType": "address", "name": "depositor", "type": "address" },
      { "indexed": false, "internalType": "uint256", "name": "requestId", "type": "uint256" },
      { "indexed": false, "internalType": "uint256", "name": "potAtTime", "type": "uint256" }
    ],
    "name": "BonusRandomnessRequested",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "uint256", "name": "roundId", "type": "uint256" },
      { "indexed": true, "internalType": "uint256", "name": "depositNumber", "type": "uint256" },
      { "indexed": false, "internalType": "uint256", "name": "blocklockRequestId", "type": "uint256" },
      { "indexed": false, "internalType": "uint256", "name": "unlockBlock", "type": "uint256" }
    ],
    "name": "BonusPercentageEncrypted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "uint256", "name": "roundId", "type": "uint256" },
      { "indexed": true, "internalType": "uint256", "name": "depositNumber", "type": "uint256" },
      { "indexed": true, "internalType": "address", "name": "depositor", "type": "address" },
      { "indexed": false, "internalType": "uint256", "name": "bonusPercentage", "type": "uint256" },
      { "indexed": false, "internalType": "uint256", "name": "bonusAmount", "type": "uint256" }
    ],
    "name": "BonusWinnerDetermined",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "uint256", "name": "roundId", "type": "uint256" },
      { "indexed": true, "internalType": "uint256", "name": "depositNumber", "type": "uint256" },
      { "indexed": false, "internalType": "uint256", "name": "bonusPercentage", "type": "uint256" }
    ],
    "name": "BonusPercentageRevealed",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "uint256", "name": "roundId", "type": "uint256" },
      { "indexed": true, "internalType": "address", "name": "winner", "type": "address" },
      { "indexed": false, "internalType": "uint256", "name": "potAmount", "type": "uint256" },
      { "indexed": false, "internalType": "uint256", "name": "endTime", "type": "uint256" }
    ],
    "name": "RoundEnded",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "uint256", "name": "roundId", "type": "uint256" },
      { "indexed": true, "internalType": "address", "name": "winner", "type": "address" },
      { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" },
      { "indexed": false, "internalType": "uint256", "name": "depositNumber", "type": "uint256" }
    ],
    "name": "BonusPaid",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "uint256", "name": "roundId", "type": "uint256" },
      { "indexed": true, "internalType": "address", "name": "winner", "type": "address" },
      { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }
    ],
    "name": "WinnerPaid",
    "type": "event"
  }
] as const;