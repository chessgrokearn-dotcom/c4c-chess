# C4C Chess - Full-Stack Blockchain Chess Platform

A next-generation online chess platform where players make stakes in C4C tokens on the Binance Smart Chain (BSC). Built with Next.js, Express.js + Socket.IO, and smart contracts.

## 🎮 Features

- **Real-time Multiplayer Chess**: WebSocket-based live gameplay with instant move synchronization
- **Token Wagering**: Bet C4C tokens (50k - 1M) with automatic smart contract settlement
- **Wallet Integration**: Seamless Web3 connection via Wagmi (MetaMask, WalletConnect, Trust Wallet)
- **Game Lobby**: Browse available games and quick matchmaking
- **Player Profiles**: Customizable themes, stats, and social features
- **BSC Integration**: Deploy on Binance Smart Chain for efficiency and low fees

## 🏗️ Project Structure

```
c4c-chess/
├── apps/
│   ├── api/              # Backend (Node.js + Express + Socket.IO)
│   └── web/              # Frontend (Next.js + React + Wagmi)
├── packages/
│   └── contracts/        # Smart contract ABIs
├── scripts/              # Utility scripts
└── docs/                 # Documentation
```

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- npm/yarn

### Installation

```bash
# Install dependencies (monorepo)
npm install

# Copy environment files
cp apps/api/.env.example apps/api/.env
cp apps/web/env.example apps/web/.env.local

# Update .env files with your configuration
# - WALLETCONNECT_PROJECT_ID (from https://cloud.walletconnect.com)
# - RPC_URL_BSC (if using custom RPC)
```

### Running Development

```bash
# Terminal 1: Start backend API
npm run dev:api
# Runs on http://localhost:10000

# Terminal 2: Start frontend
npm run dev:web
# Runs on http://localhost:3000
```

### Building for Production

```bash
# Build all packages
npm run build

# Backend: Build and prepare for deployment
cd apps/api && npm run build && npm run start

# Frontend: Build and prepare for deployment
cd apps/web && npm run build && npm run start
```

## 🔧 Configuration

### Backend (.env)
```env
PORT=10000
NODE_ENV=development
RPC_URL_BSC=https://bsc-dataseed.binance.org/
CONTRACT_ADDRESS=0xCf5E5d01ADd5e2Ba62B2f6747E5CFC43e36D5005
TOKEN_ADDRESS=0xaac20575371de01b4d10c4e7566d5453d72d56e7
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_SOCKET_URL=http://localhost:10000
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
NEXT_PUBLIC_CHAIN_ID=56
```

## 📋 Game Rules

- **Stake Range**: 50,000 - 1,000,000 C4C (step 50,000)
- **Time Controls**: 5 min, 15 min, 30 min, 1 hour, 24 hours
- **Fund Distribution**:
  - Winner receives 2x stake (if opponent forfeits, only opponent's stake)
  - Draw: both players get stake back
  - Platform fee: configurable (default 2.5%)

## 🔗 Smart Contract

**Address**: `0xCf5E5d01ADd5e2Ba62B2f6747E5CFC43e36D5005`  
**Network**: Binance Smart Chain (Chain ID: 56)  
**Token**: C4C (`0xaac20575371de01b4d10c4e7566d5453d72d56e7`)

### Key Methods

- `createGame(gameId, stake, timeLimit)`: Create new game
- `depositStake(gameId)`: Player joins game
- `finishGame(gameId, winner, isDraw)`: Settle game and distribute funds
- `getGame(gameId)`: Get game state

## 📝 API Endpoints

### WebSocket Events

**Client → Server**:
- `createRoom`: Create game with stake and time control
- `joinRoom`: Join existing game
- `makeMove`: Send chess move
- `finishGame`: End game with result
- `getLobby`: Request available games

**Server → Client**:
- `roomCreated`: Game created successfully
- `gameStarted`: Both players ready, game begins
- `opponentMove`: Opponent's move received
- `gameFinished`: Game ended with result
- `lobbyUpdated`: Available games list updated

## 🛠️ Development

### Tech Stack

**Backend**
- Node.js 20+
- Express.js
- Socket.IO
- TypeScript
- Viem (Web3 library)

**Frontend**
- Next.js 14
- React 18
- TypeScript
- Wagmi (Web3 React)
- Tailwind CSS
- Chess.js

## 🧪 Testing

```bash
# Run tests (when added)
npm run test

# Run linter
npm run lint

# Type checking
npm run check
```

## 🚢 Deployment

### Deploy Backend

**Supported Platforms**:
- Heroku, Railway, Fly.io, Render

```bash
cd apps/api
npm run build
npm start
```

### Deploy Frontend

**Supported Platforms**:
- Vercel, Netlify, GitHub Pages

```bash
cd apps/web
npm run build
npm start
```

## 🤝 Contributing

Guidelines for contributing to the project:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit changes (`git commit -m 'Add your feature'`)
4. Push to branch (`git push origin feature/your-feature`)
5. Open Pull Request

## ⚖️ Legal & Security

⚠️ **Important**: Token wagering may be subject to local regulations. Ensure compliance with gaming and financial laws in your jurisdiction before deployment.

### Security Checklist

- [ ] Verify smart contract ABI matches on-chain deployment
- [ ] Test escrow logic thoroughly before mainnet use
- [ ] Implement rate limiting on API endpoints
- [ ] Use HTTPS in production
- [ ] Configure CORS properly for WebSocket
- [ ] Audit smart contract security
- [ ] Enable transaction signing validation

## 📞 Support

- **Documentation**: Check `docs/` folder
- **Issues**: GitHub Issues
- **Discussions**: GitHub Discussions

## 📄 License

MIT License - see LICENSE file

## 🎯 Roadmap

- [ ] Advanced matchmaking algorithms
- [ ] ELO rating system
- [ ] Tournament mode
- [ ] Spectator mode
- [ ] Video commentary integration
- [ ] Mobile app (React Native)
- [ ] Multiple blockchain support
- [ ] DAO governance

---

**Version**: 1.0.0  
**Last Updated**: May 2026
