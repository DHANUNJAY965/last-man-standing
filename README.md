# Last Man Standing DApp 🎯

## Overview

**Last Man Standing** is a decentralized application (DApp) built for Base Sepolia testnet that implements a competitive pot game where players deposit ETH, and the last depositor wins the entire pot if no one deposits within 24 hours. The game features verifiable randomness through VRF and time-locked encryption using Blocklock for transparent bonus distributions.

## 🎮 Game Mechanics

### Core Rules
- **Base Deposit**: 0.01 ETH + (pot * 0.5%)
- **Timer**: 24-hour countdown resets with each deposit
- **Winner**: Last depositor when timer expires
- **Bonus System**: Every 10th depositor gets 1-5% random bonus
- **Rounds**: Continuous gameplay with round increments

### Bonus System
- Every 10th depositor (10th, 20th, 30th, etc.) gets a random bonus
- Bonus percentage (1-5%) is encrypted using **Blocklock** and revealed after delay
- Bonus amount is calculated on pot balance at deposit time
- Reserved bonus amounts are deducted from active pot display
- All bonuses are paid before the main winner

## 🔧 Technology Stack

### Smart Contracts
- **Solidity**: ^0.8.19
- **Foundry**: Smart contract development framework
- **OpenZeppelin**: Security and utility contracts
- **Randamu Solidity**: Verifiable randomness integration
- **Blocklock Solidity**: Time-locked encryption

### Frontend
- **Next.js**: 14.x React framework
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Wagmi**: React hooks for Ethereum
- **Viem**: TypeScript interface for Ethereum

### External Services
- **Randamu VRF**: Verifiable Random Function
- **Blocklock**: Time-locked encryption protocol
- **Base Sepolia**: Ethereum L2 testnet

## 🚀 Quick Start

### Prerequisites
```bash
# Required versions
Node.js >= 18.0.0
npm >= 8.0.0
Git
```

### 1. Clone Repository
```bash
git clone https://github.com/DHANUNJAY965/last-man-standing.git
cd last-man-standing
```

### 2. Smart Contract Setup

#### Install Foundry
```bash
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

#### Setup Contract Environment
```bash
cd contracts
forge init --force .

# Install dependencies
forge install OpenZeppelin/openzeppelin-contracts
forge install randa-mu/randamu-solidity
forge install randa-mu/blocklock-solidity
```

#### Configure Environment Variables
Create `contracts/.env`:
```env
PRIVATE_KEY=your_private_key_here
RPC_URL=YOUR_RPC_URL_HERE
RANDAMU_CONTRACT=0x5C210eF41CD1a72de73bF76eC39637bB0d3d7BEE
BLOCKLOCK_CONTRACT=0x1234567890123456789012345678901234567890
```

#### Deploy Contract
```bash
# Build contracts
forge build

# Test contracts
forge test

# Deploy to Base Sepolia
forge script script/Deploy.s.sol --rpc-url base_sepolia --broadcast --verify

# Note the deployed contract address
```

### 3. Frontend Setup

#### Install Dependencies
```bash
cd ../frontend
npx create-next-app@14 . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"

# Install additional packages
npm install viem wagmi @wagmi/core @wagmi/connectors @tanstack/react-query
npm install lucide-react
npm install ethers@^5.7.2
npm install blocklock-js
npm install @randamu/randamu-js
```

#### Configure Environment Variables
Create `frontend/.env.local`:
```env
NEXT_PUBLIC_CONTRACT_ADDRESS=0xYourDeployedContractAddress
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_wallet_connect_project_id
```

#### Run Development Server
```bash
npm run dev
```

Visit `http://localhost:3000`

## 📁 Project Structure

```
last-man-standing/
├── contracts/                     # Smart contract code
│   ├── src/
│   │   ├── LastManStanding.sol    # Main game contract
│   ├── script/
│   │   └── Deploy.s.sol           # Deployment script
│   ├── test/
│   │   └── LastManStanding.t.sol  # Contract tests
│   ├── foundry.toml               # Foundry configuration
│   └── .env                       # Environment variables
├── frontend/                      # Next.js application
│   ├── src/
│   │   ├── app/                   # App router pages
│   │   │   ├── layout.tsx         # Root layout
│   │   │   ├── page.tsx           # Home page
│   │   │   └── providers.tsx      # Web3 providers
│   │   ├── components/            # React components
│   │   │   ├── PotAnimation.tsx  # Main game UI
│   │   │   ├── TutorialModal.tsx  # Game tutorial
│   │   ├── hooks/                 # Custom React hooks
│   │   │   ├── useGameState.ts    # Game state management
│   │   ├── utils/                   # Utilities
│   │   │   ├── wagmi.ts          # App configuration
│   │   │   ├── contractabi.ts             # Contract ABI
│   ├── public/                    # Static assets
│   ├── package.json               # Dependencies
│   ├── tailwind.config.js         # Tailwind configuration
│   └── next.config.js             # Next.js configuration
└── README.md                      # This file
```

## 🎯 Features

### Core Gameplay
- ✅ Dynamic deposit amounts based on pot size
- ✅ 24-hour countdown timer with reset
- ✅ Automatic round progression
- ✅ Winner determination and payout
- ✅ Event logging for transparency

### Bonus System
- ✅ Every 10th depositor bonus eligibility
- ✅ VRF-based random percentage (1-5%)
- ✅ Blocklock encryption for percentage commitment
- ✅ Time-delayed reveal for fairness
- ✅ Automatic bonus distribution

### Frontend Interface
- ✅ Real-time pot display with animations
- ✅ Wallet connection with multiple providers
- ✅ Responsive design for mobile/desktop
- ✅ Tutorial modal explaining game rules
- ✅ Recent deposits and bonus winners display
- ✅ Countdown timer visualization
- ✅ Transaction status feedback

### Security & Transparency
- ✅ ReentrancyGuard protection
- ✅ Proper access controls
- ✅ Event emission for all actions
- ✅ Verifiable randomness through VRF
- ✅ Time-locked encryption for fairness
- ✅ Emergency withdrawal for admin

## 🔗 External Integrations

### Randamu VRF Integration
- **Purpose**: Verifiable random number generation
- **Usage**: Determines bonus percentages (1-5%)
- **Repository**: [randa-mu/vrf-example](https://github.com/randa-mu/vrf-example)
- **Implementation**: Request-callback pattern with on-chain verification

### Blocklock Integration
- **Purpose**: Time-locked encryption for bonus commitments
- **Usage**: Encrypts bonus percentages until reveal block
- **Repository**: [rk-rishikesh/blocklock-frontend-kit](https://github.com/rk-rishikesh/blocklock-frontend-kit)
- **Implementation**: Encrypt at deposit, decrypt after block delay

## 📋 Smart Contract Functions

### Write Functions
```solidity
function deposit() external payable              // Make a deposit
function processRandomRequest(uint256 requestId) // Process VRF callback
function checkTimeout() external                 // Check and end round if timeout
function claimBonus(uint256 roundId, uint256 depositNumber) // Claim bonus
```

### Read Functions
```solidity
function getCurrentRound() external view         // Get current round data
function getAvailablePot() external view        // Get pot minus reserved bonuses
function getRemainingTime() external view       // Get countdown remaining time
function getBonusWinner(uint256 roundId, uint256 depositNumber) // Get bonus data
function isBonusPosition(uint256 roundId, uint256 depositNumber) // Check bonus position
```

### Events
```solidity
event RoundStarted(uint256 indexed roundId)
event Deposited(uint256 indexed roundId, address indexed depositor, uint256 amount, uint256 depositNumber)
event BonusWinnerSelected(uint256 indexed roundId, address indexed depositor, uint256 depositNumber, uint256 percentage, uint256 bonusAmount)
event BonusRevealed(uint256 indexed roundId, uint256 depositNumber, uint256 percentage)
event RoundEnded(uint256 indexed roundId, address indexed winner, uint256 winningAmount)
event BonusClaimed(uint256 indexed roundId, address indexed winner, uint256 bonusAmount, uint256 depositNumber)
```

## 🧪 Testing

### Contract Tests
```bash
cd contracts
forge test                          # Run all tests
forge test -vv                      # Verbose output
forge test --match-test testDeposit # Run specific test
```

### Frontend Tests
```bash
cd frontend
npm test                            # Run Jest tests
npm run test:e2e                    # Run E2E tests (if configured)
```

## 🚀 Deployment

### Testnet Deployment (Base Sepolia)
```bash
# 1. Deploy contract
cd contracts
forge script script/Deploy.s.sol --rpc-url base_sepolia --broadcast --verify

# 2. Update frontend config with contract address
# 3. Deploy frontend
cd ../frontend
npm run build
npm run start
```

### Production Deployment
```bash
# Frontend deployment (Vercel/Netlify)
npm run build
npm run export  # For static export if needed

# Contract deployment to mainnet (when ready)
forge script script/Deploy.s.sol --rpc-url base --broadcast --verify
```

## 🔧 Configuration

### Network Configuration (Base Sepolia)
- **Chain ID**: 84532
- **RPC URL**: https://sepolia.base.org
- **Block Explorer**: https://sepolia.basescan.org
- **Faucet**: https://faucet.quicknode.com/base/sepolia

### Environment Variables
```env
# Contracts
PRIVATE_KEY=                        # Deployer private key
BASESCAN_API_KEY=                  # For contract verification
RANDAMU_CONTRACT=                  # Randamu VRF contract address
BLOCKLOCK_CONTRACT=                # Blocklock contract address

# Frontend
NEXT_PUBLIC_CONTRACT_ADDRESS=      # Deployed game contract
NEXT_PUBLIC_RANDAMU_CONTRACT=      # Randamu contract for frontend
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID= # WalletConnect project ID
```

## 🎨 UI/UX Features

### Visual Elements
- **Pot Animation**: Glowing effect with amount display
- **Countdown Timer**: Real-time countdown with visual feedback
- **Deposit Button**: Dynamic styling based on game state
- **Bonus Winners**: Scrolling list of recent bonus winners
- **Tutorial Modal**: Interactive game explanation
- **Wallet Status**: Connection state and balance display

### Responsive Design
- Mobile-first approach
- Touch-friendly interface
- Optimized for various screen sizes
- Progressive web app capabilities

## 🛡️ Security Considerations

### Smart Contract Security
- ReentrancyGuard on all external functions
- Access control with Ownable
- Input validation and error handling
- Emergency withdrawal mechanism
- Time-based access controls

### Frontend Security
- Environment variable protection
- XSS prevention
- CSRF protection
- Secure wallet connections
- Input sanitization

## 🐛 Troubleshooting

### Common Issues
1. **Transaction Fails**: Check if you have enough ETH and correct deposit amount
2. **Wallet Not Connecting**: Try refreshing page and reconnecting
3. **Contract Not Found**: Verify contract address in environment variables
4. **Random Request Pending**: Wait for VRF callback or process manually
5. **Bonus Not Revealed**: Wait for reveal block or process reveal

### Debug Commands
```bash
# Check contract deployment
cast call $CONTRACT_ADDRESS "getCurrentRound()" --rpc-url base_sepolia

# Check balance
cast balance $YOUR_ADDRESS --rpc-url base_sepolia

# Monitor events
cast logs --address $CONTRACT_ADDRESS --rpc-url base_sepolia
```

## 🤝 Contributing

### Development Setup
1. Fork the repository
2. Create feature branch: `git checkout -b feature/new-feature`
3. Make changes and test thoroughly
4. Submit pull request with detailed description

### Code Standards
- Use TypeScript for type safety
- Follow ESLint configuration
- Write tests for new features
- Document complex functions
- Use conventional commit messages

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Randamu**: For providing verifiable randomness solutions
- **Blocklock**: For time-locked encryption protocol
- **Base**: For the L2 infrastructure
- **OpenZeppelin**: For secure smart contract libraries
- **Foundry**: For excellent development tooling
- **Next.js & Vercel**: For frontend framework and hosting
- **RainbowKit**: For seamless wallet integration

## 📞 Support

- **Documentation**: Check inline comments and function documentation
- **Issues**: Report bugs via GitHub issues
- **Discussions**: Use GitHub discussions for questions
- **Discord**: Join Base and Ethereum development communities

## 🔮 Future Enhancements

### Planned Features
- [ ] Multi-token support (USDC, USDT)
- [ ] Leaderboard system
- [ ] NFT rewards for winners
- [ ] Governance token integration
- [ ] Cross-chain deployment
- [ ] Mobile app development
- [ ] Advanced analytics dashboard

### Technical Improvements
- [ ] Gas optimization
- [ ] Layer 2 scaling solutions
- [ ] Enhanced security audits
- [ ] Performance monitoring
- [ ] Automated testing pipeline
- [ ] Documentation improvements

---

**Made with ❤️ for the Base ecosystem**

For the latest updates and announcements, follow our social media channels and join our community discussions.

**Happy Gaming! 🎮🚀**
