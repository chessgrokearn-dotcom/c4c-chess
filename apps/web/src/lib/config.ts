// apps/web/src/lib/config.ts
// 🔥 ЕДИНЫЙ ИСТОЧНИК: поменял здесь → обновилось везде

export const CONFIG = {
  APP_NAME: 'C4C Chess',
  APP_DESCRIPTION: 'Play chess, earn C4C tokens on BSC',
  C4C_TOKEN_ADDRESS: '0xaac20575371de01b4d10c4e7566d5453d72d56e7',
  GAME_CONTRACT_ADDRESS: '0xCf5E5d01ADd5e2Ba62B2f6747E5CFC43e36D5005',
  CHAIN_ID: 56,
  CHAIN_NAME: 'Binance Smart Chain',
  WALLETCONNECT_PROJECT_ID: process.env.NEXT_PUBLIC_WALLETCONNECT_ID || '286f8aa9e630099f05763481672dcdc5',
} as const;