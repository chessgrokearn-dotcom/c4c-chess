// apps/web/src/lib/wagmi-config.ts
import { createConfig, http } from 'wagmi';
import { bsc } from 'wagmi/chains';
import { walletConnect, metaMask } from 'wagmi/connectors';
import { CONFIG } from './config';

export const config = createConfig({
  chains: [bsc],
  connectors: [
    // 🔹 MetaMask (браузерное расширение)
    metaMask({ shimDisconnect: true }),
    // 🔹 WalletConnect (QR-код для мобильных)
    walletConnect({ 
      projectId: CONFIG.WALLETCONNECT_PROJECT_ID,
      showQrModal: false, // Мы покажем своё модальное окно
    }),
  ],
  transports: {
    [bsc.id]: http(),
  },
});