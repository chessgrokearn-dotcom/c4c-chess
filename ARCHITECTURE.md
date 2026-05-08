# Architecture - C4C Chess

Technical architecture overview of the C4C Chess platform.

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     User's Browser                           │
│  ┌──────────────────────────────────────────────────────┐   │
│  │                   Next.js Frontend                    │   │
│  │  (React, Wagmi, Socket.IO, Chess.js)                │   │
│  └─────────────┬────────────────────┬──────────────────┘   │
└────────────────┼────────────────────┼──────────────────────┘
                 │                    │
         ┌───────▼──────┐      ┌──────▼────────┐
         │ WebSocket    │      │ HTTP/HTTPS   │
         │ Connection   │      │ (RPC Calls)  │
         │              │      │              │
         │ REAL-TIME    │      │ WEB3 ACTIONS │
         │ GAMEPLAY     │      │              │
         └───────┬──────┘      └──────┬────────┘
                 │                   │
                 │          ┌────────▼─────────┐
                 │          │  Blockchain RPC  │
                 │          │  (Binance Chain) │
                 │          │                  │
                 │          │ - Contract calls │
                 │          │ - Balance checks │
                 │          │ - Tx monitoring  │
                 │          └──────────────────┘
                 │
         ┌───────▼──────────────────────┐
         │   Express.js + Socket.IO     │
         │        Backend Server        │
         │                              │
         │  ┌────────────────────────┐  │
         │  │   Lobby Gateway        │  │
         │  │ - Room management      │  │
         │  │ - WebSocket events     │  │
         │  └────────────┬───────────┘  │
         │               │               │
         │  ┌────────────▼───────────┐  │
         │  │   Match Service        │  │
         │  │ - Game state           │  │
         │  │ - Move validation      │  │
         │  │ - Result calculation   │  │
         │  └────────────┬───────────┘  │
         │               │               │
         │  ┌────────────▼───────────┐  │
         │  │  Contract Service      │  │
         │  │ - Stake validation     │  │
         │  │ - Game recording       │  │
         │  │ - Fund distribution    │  │
         │  └────────────────────────┘  │
         │                              │
         └──────────────────────────────┘
```

## Technology Stack

### Frontend (`apps/web`)

**Framework & UI**
- Next.js 14 - React framework with SSR/SSG
- React 18 - UI component library
- Tailwind CSS - Utility-first styling
- TypeScript - Type-safe development

**Web3 Integration**
- Wagmi - React hooks for Ethereum
- Viem - Typescript Ethereum client
- Rainbow Kit (optional) - Wallet UI

**Game Engine**
- Chess.js - Chess logic and validation
- react-chessboard - Chess board component
- Socket.IO Client - Real-time communication

**State Management**
- React Hooks - Local component state
- React Query - Server state management
- LocalStorage - Persistent user data

### Backend (`apps/api`)

**Runtime & Framework**
- Node.js 20 - JavaScript runtime
- Express.js - HTTP server framework
- TypeScript - Type safety

**Real-time Communication**
- Socket.IO - WebSocket wrapper
- Event-driven architecture
- Pub/Sub for message broadcasting

**Web3 Integration**
- Viem - Ethereum client
- RPC provider for BSC node

**Data Persistence**
- In-memory (development)
- Database: MongoDB/PostgreSQL (production)

### Smart Contracts

**Blockchain Network**
- Binance Smart Chain (BSC)
- ERC-20 token (C4C)
- Game escrow contract

**Contract Methods**
- `createGame()` - Initiate game
- `depositStake()` - Join game
- `finishGame()` - Settle game
- `claimWin()` - Distribute rewards

## Data Flow

### Game Creation Flow

```
1. User clicks "Create Game"
   ↓
2. Frontend validates stake amount
   ↓
3. Frontend calls approve() on C4C token
   ↓
4. MetaMask asks for approval
   ↓
5. User confirms transaction
   ↓
6. Frontend calls createGame() on contract
   ↓
7. Backend receives WebSocket event: "createRoom"
   ↓
8. MatchService creates room entry
   ↓
9. LobbyGateway broadcasts updated rooms list
   ↓
10. All connected clients see new game in lobby
```

### Game Move Flow

```
1. User moves piece on board
   ↓
2. Chess.js validates move
   ↓
3. Frontend emits "makeMove" via WebSocket
   ↓
4. Backend MatchService processes move
   ↓
5. Backend validates move against game state
   ↓
6. Backend broadcasts "opponentMove" to other player
   ↓
7. Opponent's frontend updates board
   ↓
8. Back to step 1 for opponent's turn
```

### Game Settlement Flow

```
1. Game ends (checkmate, timeout, draw)
   ↓
2. Frontend calls finishGame() on contract
   ↓
3. Contract validates result
   ↓
4. Contract transfers funds:
   - Winner gets 2x stake (minus fees)
   - Loser loses stake
   - Draw: both get refund
   ↓
5. Contract emits GameFinished event
   ↓
6. Backend MatchService records result
   ↓
7. All players notified of settlement
```

## Component Architecture

### Frontend Components

```
App/
├── Layout
│   ├── Header
│   ├── Navigation
│   └── Sidebar
├── Pages
│   ├── Home/Lobby
│   ├── Game
│   ├── Profile
│   └── Notifications
├── Components
│   ├── ChessBoard
│   ├── GameTimer
│   ├── StakeSelector
│   ├── WalletConnect
│   └── GameHistory
└── Hooks
    ├── useSocket
    ├── useWallet
    ├── useGame
    └── useBalance
```

### Backend Services

```
Express App
├── Middleware
│   ├── CORS
│   ├── JSON Parser
│   └── Error Handler
├── Routes
│   ├── /health
│   ├── /api/games
│   └── /api/status
├── WebSocket (Socket.IO)
│   ├── LobbyGateway
│   ├── MatchService
│   └── ContractService
├── Services
│   ├── GameLogic
│   ├── Matchmaking
│   └── Blockchain
└── Database
    ├── Games Collection
    ├── Players Collection
    └── Transactions Log
```

## State Management

### Frontend State

**Local State (React Hooks)**
- Current game board FEN
- Selected pieces
- Available moves
- Player profile data

**Server State (React Query)**
- Lobby games list
- Player balance
- Game history
- Pending transactions

**Persistent State (LocalStorage)**
- User preferences (theme, language)
- Wallet address
- Saved games

### Backend State

**In-Memory State**
- Active game rooms
- Connected players
- Current moves

**Database State**
- Game outcomes
- Player statistics
- Transaction history
- Rankings

## WebSocket Event Architecture

### Namespace: `/` (Default)

**Client → Server Events**
```typescript
socket.emit('join_lobby', {});
socket.emit('create_room', { stake, timeControl });
socket.emit('join_room', { roomId });
socket.emit('make_move', { from, to, promotion });
socket.emit('finish_game', { winner, isDraw });
socket.emit('leave_game', { gameId });
```

**Server → Client Events**
```typescript
socket.emit('lobby_updated', rooms[]);
socket.emit('room_created', room);
socket.emit('game_started', gameState);
socket.emit('opponent_move', move);
socket.emit('game_finished', result);
socket.emit('error', errorMsg);
```

### Error Handling

```
Client disconnects
    ↓
Server detects disconnect
    ↓
MatchService calls leaveRoom()
    ↓
Room state updated
    ↓
Opponent notified
    ↓
Game marked as forfeited if active
    ↓
Opponent gets win
```

## Security Architecture

### Authentication
- No centralized auth (wallet address is identity)
- Message signing for critical operations
- Session management via Socket.IO

### Contract Interaction
- Client-side: Wagmi handles transaction security
- Server-side: Validates ALL moves before accepting
- On-chain: Contract enforces fund transfer rules

### Rate Limiting
- API: Express rate-limiter middleware
- WebSocket: Per-socket event throttling
- Database: Connection pooling

### Input Validation
- Frontend: Client-side validation (UX)
- Backend: Server-side validation (security)
- Contract: On-chain validation (trust)

## Deployment Architecture

### Production Deployment

```
┌─────────────────────────────────────────────────┐
│           CDN (Cloudflare/Netlify)              │
│         (Serves static assets)                  │
└────────────────────┬────────────────────────────┘
                     │
        ┌────────────▼────────────┐
        │  Frontend (Vercel/Fly)  │
        │   - Next.js app         │
        │   - SSR/SSG             │
        │   - Auto-scaling        │
        └────────────┬────────────┘
                     │
        ┌────────────▼────────────┐
        │  Backend (Railway/Fly)  │
        │   - Express app         │
        │   - Socket.IO cluster   │
        │   - Redis (sessions)    │
        └────────────┬────────────┘
                     │
        ┌────────────▼────────────┐
        │  Database               │
        │   - MongoDB/PostgreSQL  │
        │   - Backups             │
        │   - Monitoring          │
        └────────────┬────────────┘
                     │
        ┌────────────▼────────────┐
        │  Blockchain (BSC)       │
        │   - Smart contracts     │
        │   - RPC nodes           │
        │   - Event indexing      │
        └─────────────────────────┘
```

### Scaling Considerations

**Horizontal Scaling Backend**
- Multiple instances behind load balancer
- Sticky sessions for WebSocket
- Redis for shared state

**Database Scaling**
- Read replicas
- Connection pooling
- Sharding by playerAddress

**Frontend Scaling**
- CDN edge caching
- Image optimization
- Code splitting

## Key Design Patterns

### 1. Event-Driven Architecture
- Socket.IO for real-time events
- Decoupled services
- Async message processing

### 2. Singleton Pattern
- Single instances: MatchService, ContractService
- Shared state across connections

### 3. Service Layer Pattern
- Separation of concerns
- Business logic isolated
- Reusable services

### 4. Middleware Pattern
- Express middleware for cross-cutting concerns
- CORS, auth, error handling

### 5. Repository Pattern (proposed)
- Abstraction over database
- Easy to switch databases
- Consistent data access

## Performance Optimization

### Frontend
- Code splitting by route
- Image lazy loading
- CSS minification
- Tree shaking

### Backend
- Connection pooling
- Caching (Redis)
- Compression
- Database indexing

### Network
- WebSocket for low-latency
- Message batching
- Binary serialization (optional)

## Monitoring & Observability

### Metrics
- Request latency
- WebSocket connection count
- Game completion rate
- Transaction success rate

### Logging
- Structured JSON logging
- Log aggregation (ELK, Datadog)
- Error tracking (Sentry)

### Alerting
- Server down alert
- High error rate alert
- Unusual patterns alert

## Future Architecture Improvements

1. **Multi-chain Support**
   - Polygon, Ethereum, Arbitrum
   - Cross-chain token transfers

2. **Database Abstraction**
   - Repository pattern
   - Multiple DB support

3. **AI Opponent**
   - ML model for chess engine
   - Difficulty levels

4. **Mobile App**
   - React Native
   - Offline mode
   - Push notifications

5. **Microservices**
   - Separate services per domain
   - gRPC for inter-service communication

---

**Last Updated**: May 2026
