// apps/web/src/lib/config.ts
// 🔥 Все экспорты проверены на совместимость с TypeScript

export const C4C_TOKEN_ADDRESS = '0xaac20575371de01b4d10c4e7566d5453d72d56e7' as const;
export const GAME_CONTRACT_ADDRESS = '0xCf5E5d01ADd5e2Ba62B2f6747E5CFC43e36D5005' as const;

export const CHAIN_ID = 56 as const;
export const CHAIN_NAME = 'Binance Smart Chain' as const;
export const RPC_URL = 'https://bsc-dataseed.binance.org/' as const;
export const BSC_CHAIN_ID = 56 as const;

export const APP_NAME = 'C4C Chess' as const;
export const APP_DESCRIPTION = 'Play chess, earn C4C tokens on BSC' as const;

export const WALLETCONNECT_PROJECT_ID = 
  (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_WALLETCONNECT_ID) || '286f8aa9e630099f05763481672dcdc5';

export const STAKE_MIN = 50000 as const;
export const STAKE_MAX = 1000000 as const;
export const STAKE_STEP = 50000 as const;
export const STAKE_OPTIONS = [50000, 100000, 250000, 500000, 1000000] as const;
export const STAKE_CONFIG = { MIN: STAKE_MIN, MAX: STAKE_MAX, STEP: STAKE_STEP, OPTIONS: STAKE_OPTIONS } as const;

export const TIME_OPTIONS = [300, 600, 900] as const;
export const TIME_CONFIG = { OPTIONS: TIME_OPTIONS, DEFAULT: 600 } as const;

export const CONFIG = {
  C4C_TOKEN_ADDRESS, GAME_CONTRACT_ADDRESS, CHAIN_ID, CHAIN_NAME, RPC_URL, BSC_CHAIN_ID,
  WALLETCONNECT_PROJECT_ID, APP_NAME, APP_DESCRIPTION,
  STAKE_MIN, STAKE_MAX, STAKE_STEP, STAKE_OPTIONS, STAKE_CONFIG,
  TIME_OPTIONS, TIME_CONFIG,
} as const;