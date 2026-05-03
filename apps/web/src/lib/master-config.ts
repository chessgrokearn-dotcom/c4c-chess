// apps/web/src/lib/master-config.ts
// 🔹 ЦЕНТРАЛЬНЫЙ ХАБ: импортирует базу + патчи, экспортирует единый API
// ✅ ВСЕ ИСПРАВЛЕНИЯ ДЕЛАЮТСЯ ТОЛЬКО ЗДЕСЬ или через новые патч-файлы

// 🔹 Импорт базы
import { CONFIG_BASE } from './config-base';

// 🔹 Импорт патчей
import { PATCH_001 } from './config-patch-001';
import { PATCH_002_TYPES } from './config-patch-002';

// 🔹 Экспорт типов (из патча 2)
export type { BoardThemeId, ProfileThemeId, LanguageCode, PlayerProfile, Game, Friend, GameInvite } from './config-base';

// 🔹 Объединённый CONFIG: база + переопределения из патчей
export const CONFIG = {
  ...CONFIG_BASE,
  // 🔥 Переопределяем функции из патча 1
  createWagmiConfig: PATCH_001.createWagmiConfig,
  canConnectToMetaMask: PATCH_001.canConnectToMetaMask,
  canConnectToWalletConnect: PATCH_001.canConnectToWalletConnect,
  resetConnectionStates: PATCH_001.resetConnectionStates,
  // 🔥 Патч 2 не добавляет значений, только типы
} as const;

// 🔹 Прямой экспорт всех констант и функций для удобства
export const {
  C4C_TOKEN_ADDRESS, GAME_CONTRACT_ADDRESS, C4C_BUY_URL,
  CHAIN_ID, CHAIN_NAME, RPC_URL,
  APP_NAME, APP_DESCRIPTION, WALLETCONNECT_PROJECT_ID, HOW_TO_PLAY,
  TIME_OPTIONS, STAKE_OPTIONS, BOARD_THEMES, PROFILE_THEMES, LANGUAGES,
  formatTime, formatC4C, getBotMove, getBoardThemeForProfile,
  saveProfileToStorage, loadProfileFromStorage,
  createWagmiConfig, canConnectToMetaMask, canConnectToWalletConnect, resetConnectionStates,
  getPieceStyle, PIECE_SYMBOLS,
} = CONFIG;IPTION,WALLETCONNECT_PROJECT_ID,HOW_TO_PLAY,TIME_OPTIONS,STAKE_OPTIONS,BOARD_THEMES,PROFILE_THEMES,LANGUAGES,formatTime,formatC4C,getBotMove,getBoardThemeForProfile,saveProfileToStorage:saveProfile,loadProfileFromStorage:loadProfile,createWagmiConfig,canConnectToMetaMask:canConnectMeta,canConnectToWalletConnect:canConnectMeta,resetConnectionStates:resetConn,getPieceStyle,PIECE_SYMBOLS,} as const;
