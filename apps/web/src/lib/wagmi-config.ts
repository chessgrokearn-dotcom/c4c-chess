// apps/web/src/lib/wagmi-config.ts
import { http, createConfig } from 'wagmi';
import { bsc } from 'wagmi/chains';
import { metaMask, walletConnect } from 'wagmi/connectors';

export const config = createConfig({
  chains: [bsc],
  connectors: [
    metaMask(),
    walletConnect({ 
      projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_ID || 'demo' 
    }),
  ],
  transports: {
    [bsc.id]: http(),
  },
});