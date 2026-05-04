'use client'

import { createConfig, http, WagmiProvider } from 'wagmi'
import { metaMask, walletConnect } from '@wagmi/connectors'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactNode, useState } from 'react'

// 🔹 Константы
const C4C_TOKEN = '0xaac20575371de01b4d10c4e7566d5453d72d56e7' as `0x${string}`
const GAME_CONTRACT = '0xCf5E5d01ADd5e2Ba62B2f6747E5CFC43e36D5005' as `0x${string}`
const CHAIN_ID = 56 // BSC Mainnet

// 🔹 Создаём wagmi config
export const config = createConfig({
  chains: [
    {
      id: CHAIN_ID,
      name: 'BNB Smart Chain',
      nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: 18 },
      rpcUrls: { default: { http: ['https://bsc-dataseed.binance.org/'] } },
      blockExplorers: { default: { name: 'BscScan', url: 'https://bscscan.com' } },
    },
  ],
  connectors: [
    metaMask(),
    walletConnect({ 
      projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'YOUR_PROJECT_ID',
      metadata: {
        name: 'c4c-chess',
        description: 'Chess on blockchain with C4C tokens',
        url: 'https://c4c-chess.vercel.app',
        icons: ['https://c4c-chess.vercel.app/icon.png'],
      },
    }),
  ],
  transports: {
    [CHAIN_ID]: http(),
  },
})

// 🔹 Провайдер для всего приложения
export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())
  
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  )
}
