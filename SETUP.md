# Setup Guide - C4C Chess

Complete guide to set up the C4C Chess development environment.

## Prerequisites

- **Node.js**: v20.0.0 or higher
- **npm**: v10.0.0 or higher
- **Git**: Latest version
- **MetaMask or Web3 Wallet**: For testing web3 features

### Install Node.js

**macOS/Linux**:
```bash
curl -fsSL https://fnm.io/install | bash
fnm install 20
fnm use 20
```

**Windows**:
Download from [nodejs.org](https://nodejs.org) or use `choco install nodejs`

## Step 1: Clone Repository

```bash
git clone https://github.com/chessgrokearn-dotcom/c4c-chess.git
cd c4c-chess
```

## Step 2: Install Dependencies

```bash
# Install all dependencies (monorepo)
npm install

# This installs dependencies for:
# - apps/api
# - apps/web
# - packages/contracts
```

**Troubleshooting**:
```bash
# If you get peer dependency warnings, use:
npm install --legacy-peer-deps

# Clear npm cache if issues persist:
npm cache clean --force
npm install
```

## Step 3: Configure Environment Variables

### Backend Configuration

```bash
cd apps/api
cp .env.example .env
```

Edit `apps/api/.env`:
```env
PORT=10000
NODE_ENV=development
RPC_URL_BSC=https://bsc-dataseed.binance.org/
CONTRACT_ADDRESS=0xCf5E5d01ADd5e2Ba62B2f6747E5CFC43e36D5005
TOKEN_ADDRESS=0xaac20575371de01b4d10c4e7566d5453d72d56e7
```

### Frontend Configuration

```bash
cd apps/web
cp env.example .env.local
```

Edit `apps/web/.env.local`:
```env
# WalletConnect (get from https://cloud.walletconnect.com)
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here

# Socket connection
NEXT_PUBLIC_SOCKET_URL=http://localhost:10000

# Blockchain
NEXT_PUBLIC_CHAIN_ID=56
NEXT_PUBLIC_RPC_URL_BSC=https://bsc-dataseed.binance.org/

# Smart Contracts (don't change for BSC testnet)
NEXT_PUBLIC_GAME_CONTRACT=0xCf5E5d01ADd5e2Ba62B2f6747E5CFC43e36D5005
NEXT_PUBLIC_C4C_TOKEN=0xaac20575371de01b4d10c4e7566d5453d72d56e7
```

## Step 4: Get WalletConnect Project ID

1. Go to https://cloud.walletconnect.com
2. Sign up / log in
3. Create a new project
4. Copy the Project ID
5. Paste into `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` in `.env.local`

## Step 5: Start Development Servers

### Terminal 1 - Backend

```bash
npm run dev:api

# Output should show:
# ✅ Game server is running on port 10000
# 🔗 WebSocket ready for connections
```

### Terminal 2 - Frontend

```bash
npm run dev:web

# Output should show:
# ▲ Next.js X.X.X
# - Local: http://localhost:3000
```

## Step 6: Verify Installation

1. Open http://localhost:3000 in your browser
2. Click "Connect Wallet"
3. Install MetaMask if needed
4. Test creating a game room
5. Check console for any errors

## Development Workflows

### Adding a New Dependency

```bash
# Frontend
cd apps/web && npm install package-name

# Backend
cd apps/api && npm install package-name
```

### Building for Production

```bash
# Build everything
npm run build

# Build specific package
npm run build --workspace apps/web
npm run build --workspace apps/api

# Check for TypeScript errors
npm run check
```

### Running Linter

```bash
npm run lint
```

## Project Structure

```
c4c-chess/
├── apps/
│   ├── api/                    # Backend Express + Socket.IO
│   │   ├── src/
│   │   │   ├── main.ts        # Entry point
│   │   │   ├── config/
│   │   │   │   └── stake.config.ts
│   │   │   ├── services/
│   │   │   │   ├── contract.service.ts
│   │   │   │   └── match.service.ts
│   │   │   ├── game/
│   │   │   │   └── lobby.gateway.ts
│   │   │   └── types/
│   │   │       └── matchmaking.ts
│   │   ├── .env.example
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── web/                    # Frontend Next.js
│       ├── src/
│       │   ├── app/
│       │   │   ├── layout.tsx
│       │   │   └── page.tsx
│       │   └── lib/
│       │       ├── contract-utils.ts
│       │       ├── socket.ts
│       │       ├── config-base.ts
│       │       └── ...
│       ├── env.example
│       ├── package.json
│       └── next.config.js
│
├── packages/
│   └── contracts/              # Contract ABIs
│       └── c4cGameAbi.ts
│
├── scripts/                    # Utility scripts
└── package.json               # Root monorepo config
```

## Common Issues & Solutions

### Port Already in Use

```bash
# Find process using port 10000
lsof -i :10000

# Kill it
kill -9 <PID>
```

### WebSocket Connection Failed

- Check backend is running: `npm run dev:api`
- Verify `localhost:10000` is accessible
- Check CORS settings in `apps/api/src/main.ts`

### Wallet Connection Issues

- Clear browser cache
- Reinstall MetaMask extension
- Check correct network (BSC, Chain ID 56)
- Verify WalletConnect Project ID

### Build Errors

```bash
# Clean build artifacts
rm -rf apps/api/dist apps/web/.next

# Reinstall dependencies
rm -rf node_modules
npm install

# Rebuild
npm run build
```

## Database Setup (Optional)

If using database (MongoDB, PostgreSQL, etc.):

```bash
# For MongoDB Atlas:
# 1. Create cluster at https://www.mongodb.com/cloud/atlas
# 2. Get connection string
# 3. Add to .env: DATABASE_URL=mongodb+srv://...
```

## Testing Transaction Flow

### Manual Test

1. Connect wallet to BSC network
2. Create game with 50k C4C stake
3. Check MetaMask popup for approve transaction
4. Confirm transaction
5. Check contract interaction in explorer

### Using Testnet

For BSC testnet:
- Faucet: https://testnet.binance.org/faucet
- Explorer: https://testnet.bscscan.com
- RPC: https://data-seed-prebsc-1-s1.binance.org

## Debugging

### Enable Verbose Logging

Backend:
```env
DEBUG=*
LOG_LEVEL=debug
```

Frontend (browser console):
```js
localStorage.debug = '*'
```

### Check WebSocket Connection

```bash
# Monitor WebSocket in browser DevTools:
# 1. Open DevTools
# 2. Go to Network tab
# 3. Filter by WS
# 4. Look for socket connection
```

## Next Steps

1. **Read Code**: Explore backend service logic
2. **Test Features**: Create games, make moves
3. **Deploy**: Follow deployment guide
4. **Customize**: Modify themes, rules, UI

## Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Express.js Docs](https://expressjs.com/)
- [Socket.IO Docs](https://socket.io/docs/)
- [Wagmi Docs](https://wagmi.sh/)
- [Chess.js Docs](https://github.com/jhlywa/chess.js)
- [Viem Docs](https://viem.sh/)

## Support

If you encounter issues:

1. Check this setup guide
2. Review error logs in terminal
3. Check browser console errors
4. Search GitHub issues
5. Ask in discussions

---

**Last Updated**: May 2026
