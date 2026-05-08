# Deployment Guide - C4C Chess

Complete guide to deploy C4C Chess to production.

## Pre-Deployment Checklist

- [ ] All environment variables configured
- [ ] Smart contract verified on BSC
- [ ] Backend and frontend built successfully
- [ ] Security audit completed
- [ ] Rate limiting configured
- [ ] HTTPS enabled
- [ ] CORS properly configured
- [ ] Database backups established
- [ ] Monitoring and logging set up

## Backend Deployment

### Option 1: Railway (Recommended for Speed)

1. **Sign Up**
   - Go to https://railway.app
   - Sign up with GitHub
   - Connect GitHub repository

2. **Create Project**
   - Click "Start New Project"
   - Select "Deploy from GitHub repo"
   - Choose `c4c-chess` repository

3. **Configure Variables**
   ```
   PORT=10000
   NODE_ENV=production
   RPC_URL_BSC=https://bsc-dataseed.binance.org/
   CONTRACT_ADDRESS=0xCf5E5d01ADd5e2Ba62B2f6747E5CFC43e36D5005
   TOKEN_ADDRESS=0xaac20575371de01b4d10c4e7566d5453d72d56e7
   ```

4. **Deploy**
   - Select `apps/api` as root directory
   - Click "Deploy"
   - Wait for build completion

### Option 2: Heroku

1. **Install Heroku CLI**
   ```bash
   npm install -g heroku
   heroku login
   ```

2. **Create App**
   ```bash
   heroku create c4c-chess-api
   ```

3. **Set Environment Variables**
   ```bash
   heroku config:set PORT=10000
   heroku config:set NODE_ENV=production
   heroku config:set RPC_URL_BSC=https://bsc-dataseed.binance.org/
   heroku config:set CONTRACT_ADDRESS=0xCf5E5d01ADd5e2Ba62B2f6747E5CFC43e36D5005
   heroku config:set TOKEN_ADDRESS=0xaac20575371de01b4d10c4e7566d5453d72d56e7
   ```

4. **Deploy**
   ```bash
   git push heroku main
   ```

### Option 3: Fly.io

1. **Install Fly CLI**
   ```bash
   curl -L https://fly.io/install.sh | sh
   fly auth login
   ```

2. **Create App**
   ```bash
   cd apps/api
   fly launch
   ```

3. **Configure fly.toml**
   ```toml
   [env]
   PORT = "10000"
   NODE_ENV = "production"
   RPC_URL_BSC = "https://bsc-dataseed.binance.org/"
   ```

4. **Deploy**
   ```bash
   fly deploy
   ```

## Frontend Deployment

### Option 1: Vercel (Recommended)

1. **Sign Up**
   - Go to https://vercel.com
   - Sign up with GitHub
   - Connect GitHub repository

2. **Create Project**
   - Click "New Project"
   - Select `c4c-chess` repository
   - Select "Next.js" framework
   - Set root directory to `apps/web`

3. **Configure Environment**
   ```
   NEXT_PUBLIC_SOCKET_URL=https://your-api.fly.dev
   NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_id
   NEXT_PUBLIC_GAME_CONTRACT=0xCf5E5d01ADd5e2Ba62B2f6747E5CFC43e36D5005
   NEXT_PUBLIC_C4C_TOKEN=0xaac20575371de01b4d10c4e7566d5453d72d56e7
   NEXT_PUBLIC_RPC_URL_BSC=https://bsc-dataseed.binance.org/
   NEXT_PUBLIC_CHAIN_ID=56
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait for build and deployment

### Option 2: Netlify

1. **Sign Up**
   - Go to https://netlify.com
   - Sign up with GitHub

2. **Connect Repository**
   - Click "Add new site"
   - Connect GitHub repo
   - Select `c4c-chess` repository

3. **Configure Build**
   - Build command: `npm run build --workspace apps/web`
   - Publish directory: `apps/web/.next`
   - Base directory: `./`

4. **Environment Variables**
   - Add same variables as Vercel

5. **Deploy**
   - Click "Deploy site"

### Option 3: Self-Hosted (Docker)

1. **Create Dockerfile**
   ```dockerfile
   FROM node:20-alpine

   WORKDIR /app

   COPY package*.json ./
   RUN npm ci

   COPY . .

   RUN npm run build --workspace apps/web

   EXPOSE 3000

   CMD ["npm", "start", "--workspace", "apps/web"]
   ```

2. **Build and Push**
   ```bash
   docker build -t c4c-chess-web .
   docker push your-registry/c4c-chess-web:latest
   ```

3. **Deploy to Server**
   ```bash
   docker run -p 3000:3000 \
     -e NEXT_PUBLIC_SOCKET_URL=https://your-api.com \
     -e NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_id \
     c4c-chess-web
   ```

## Database Setup

### MongoDB Atlas

1. **Create Cluster**
   - Go to https://www.mongodb.com/cloud/atlas
   - Sign up / log in
   - Create free cluster

2. **Get Connection String**
   - Click "Connect"
   - Copy connection string
   - Replace `<password>` and `<database>`

3. **Add to Backend .env**
   ```env
   MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/c4c
   ```

### PostgreSQL (Neon.tech)

1. **Create Project**
   - Go to https://console.neon.tech
   - Create new project

2. **Get Connection String**
   - Click "Connection string"
   - Copy Prisma format

3. **Add to Backend .env**
   ```env
   DATABASE_URL=postgresql://user:pass@host/database
   ```

## Domain Configuration

### DNS Setup

1. **Buy Domain**
   - Namecheap, GoDaddy, Route53, etc.

2. **Point to Vercel/Netlify**
   - Add CNAME record: `_vercel.your-domain.com`
   - Wait for DNS propagation (24-48h)

3. **Configure for Custom Domain**
   - Vercel: Add domain in project settings
   - Netlify: Add custom domain in Site settings

### HTTPS Certificate

- Automatically provided by Vercel/Netlify
- For self-hosted, use Let's Encrypt

## Security Configuration

### API Rate Limiting

Add to `apps/api/src/main.ts`:
```typescript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});

app.use(limiter);
```

### CORS Configuration

Update `apps/api/src/main.ts`:
```typescript
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(','),
  credentials: true
}));
```

### Environment Security

Never commit `.env` files. Use platform secrets:
- Vercel: Project Settings > Environment Variables
- Railway: Environment > Raw Editor
- Heroku: Config Vars

### API Keys Protection

Store sensitive keys in encrypted vaults:
- AWS Secrets Manager
- HashiCorp Vault
- Azure Key Vault

## Database Backups

### MongoDB Backups

```bash
# Automated backups in MongoDB Atlas Settings
# Or manual backup:
mongodump --uri "mongodb+srv://..." --out ./backup
```

### PostgreSQL Backups

```bash
# Create backup
pg_dump -h host -U user database > backup.sql

# Restore
psql -h host -U user database < backup.sql
```

## Monitoring & Logging

### Backend Monitoring

Install monitoring tools:
```bash
npm install @sentry/node
```

Configure Sentry in `apps/api/src/main.ts`:
```typescript
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
});
```

### Frontend Monitoring

```bash
npm install @sentry/nextjs
```

Configure in `apps/web/next.config.js`

### Logging

Use structured logging:
```bash
npm install pino pino-pretty
```

Configure logger:
```typescript
import pino from 'pino';

const logger = pino({
  transport: {
    target: 'pino-pretty'
  }
});

logger.info('Server started');
```

## Performance Optimization

### Backend

1. **Enable Compression**
   ```typescript
   app.use(compression());
   ```

2. **Database Indexing**
   ```javascript
   db.games.createIndex({ createdAt: -1 });
   db.games.createIndex({ status: 1 });
   ```

3. **Connection Pooling**
   - Configure in database connection string

### Frontend

1. **Image Optimization**
   - Use Next.js Image component
   - Enable image optimization

2. **Code Splitting**
   - Next.js does this automatically

3. **Caching**
   - Configure cache headers in next.config.js

## Scaling

### Horizontal Scaling

Backend:
- Use load balancer (nginx, HAProxy)
- Sticky sessions for WebSocket (important!)
- Redis for session management

Frontend:
- CDN (Cloudflare, CloudFront)
- Vercel/Netlify handles automatically

### Database Scaling

- Connection pooling (PgBouncer for PostgreSQL)
- Read replicas for MongoDB
- Sharding for large datasets

## Rollback Strategy

### Vercel/Netlify

- Automatic rollback option in deployments
- Keep previous 100 deployments

### Manual Rollback

```bash
# Check previous commit
git log --oneline

# Revert to previous commit
git revert <commit-hash>
git push
```

## Monitoring Checklist

After deployment, verify:

```bash
# ✓ Backend API responds
curl https://your-api.com/health

# ✓ WebSocket connects
# Open browser console, check WS connection

# ✓ Frontend loads
# Open https://your-domain.com

# ✓ Wallet connection works
# Test MetaMask connection

# ✓ Game creation works
# Create test game

# ✓ Logs capture errors
# Check Sentry dashboard

# ✓ Database responding
# Monitor database metrics
```

## Post-Deployment

1. **Announce Release**
   - Social media posts
   - Community notifications

2. **Support**
   - Monitor error reports
   - Help users with setup

3. **Iterate**
   - Collect feedback
   - Plan next features

## Troubleshooting Deployment

### Build Fails on Vercel

```bash
# Clear build cache
vercel env pull .env.local
vercel build --prod
```

### WebSocket Fails

- Check CORS configuration
- Verify backend URL in frontend config
- Check firewall/proxy settings

### Contract Interaction Fails

- Verify contract address correct
- Check ABI matches on-chain
- Ensure network is BSC

## Support & Escalation

- Check platform docs (Vercel, Railway, etc.)
- Review error logs
- Contact support
- Post in community forums

---

**Last Updated**: May 2026
