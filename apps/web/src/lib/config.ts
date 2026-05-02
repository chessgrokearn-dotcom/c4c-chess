// apps/web/src/lib/config.ts
export const C4C_TOKEN_ADDRESS = "0xaac20575371de01b4d10c4e7566d5453d72d56e7" as const;
export const GAME_CONTRACT_ADDRESS = "0xCf5E5d01ADd5e2Ba62B2f6747E5CFC43e36D5005" as const;
export const STAKE_CONFIG = { 
  MIN: 50_000n, 
  MAX: 1_000_000n, 
  STEP: 50_000n 
} as const;
export const BSC_CHAIN_ID = 56;
export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "https://your-render-app.onrender.com";