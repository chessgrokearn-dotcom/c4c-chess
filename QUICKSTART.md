# Quick Start - C4C Chess

Get up and running in 5 minutes!

## 1. Clone & Install

```bash
git clone https://github.com/chessgrokearn-dotcom/c4c-chess.git
cd c4c-chess
npm install
```

## 2. Setup Environment

```bash
# Backend
cd apps/api
cp .env.example .env
# Open .env and keep defaults

# Frontend
cd ../web
cp env.example .env.local
# Edit .env.local - add WALLETCONNECT_PROJECT_ID from https://cloud.walletconnect.com
```

## 3. Get WalletConnect ID (1 min)

1. Go to https://cloud.walletconnect.com
2. Sign up with email
3. Create new project
4. Copy Project ID
5. Paste into `apps/web/.env.local` as `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`

## 4. Start Dev Servers

### Terminal 1
```bash
npm run dev:api
# Should show: ✅ Game server is running on port 10000
```

### Terminal 2
```bash
npm run dev:web
# Should show: ▲ Next.js running on http://localhost:3000
```

## 5. Open Browser

1. Go to http://localhost:3000
2. Click "Connect Wallet"
3. Choose MetaMask or WalletConnect
4. Create a test game!

---

**Full guide**: See [SETUP.md](SETUP.md)  
**Architecture**: See [ARCHITECTURE.md](ARCHITECTURE.md)  
**Deploy**: See [DEPLOYMENT.md](DEPLOYMENT.md)
