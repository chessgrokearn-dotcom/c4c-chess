// apps/web/src/lib/wagmi-config.ts
import { createConfig, http } from 'wagmi';
import { bsc } from 'wagmi/chains';
import { walletConnect, metaMask } from 'wagmi/connectors';
import { CONFIG } from './config';

export const config = createConfig({
  chains: [bsc],
  connectors: [
    metaMask(),
    walletConnect({ 
      projectId: CONFIG.WALLETCONNECT_PROJECT_ID,
      showQrModal: true,
      metadata: { // ✅ ИСПРАВЛЕНО: было meta {, стало metadata: {
        name: CONFIG.APP_NAME,
        description: CONFIG.APP_DESCRIPTION,
        url: 'https://c4c-chess.vercel.app',
        icons: ['https://avatars.githubusercontent.com/u/37784886'],
      },
    }),
  ],
  transports: { [bsc.id]: http(CONFIG.RPC_URL) },
});