import { CONFIG_BASE } from './config-base';
import { PATCH_001 } from './config-patch-001';
import { PATCH_002 } from './config-patch-002';
import { PATCH_003 } from './config-patch-003';
import { PATCH_004 } from './config-patch-004';
import { PATCH_005 } from './config-patch-005';
import { PATCH_006 } from './config-patch-006';
import { PATCH_007 } from './config-patch-007';
import { PATCH_008 } from './config-patch-008';
import { PATCH_009 } from './config-patch-009';
import { PATCH_010 } from './config-patch-010';
import { PATCH_011 } from './config-patch-011';

export const CONFIG = {
  ...CONFIG_BASE,
  ...PATCH_001, ...PATCH_002, ...PATCH_003, ...PATCH_004,
  ...PATCH_005, ...PATCH_006, ...PATCH_007, ...PATCH_008, ...PATCH_009, ...PATCH_010, ...PATCH_011
};

// 🔹 ЭКСПОРТЫ: Всё, что нужно page.tsx
export const APP_NAME = CONFIG.APP_NAME;
export const C4C_TOKEN_ADDRESS = CONFIG.C4C_TOKEN_ADDRESS;
export const CHAIN_ID = CONFIG.CHAIN_ID;
export const WALLETCONNECT_PROJECT_ID = CONFIG.WALLETCONNECT_PROJECT_ID;
export const C4C_BUY_URL = CONFIG.C4C_BUY_URL;
export const TIME_OPTIONS = CONFIG.TIME_OPTIONS;
export const STAKE_OPTIONS = CONFIG.STAKE_OPTIONS;

// Фазы 6 (Темы, Языки, Безопасные доски) — через Патч 011
export const UI_THEMES = CONFIG.UI_THEMES;
export const UI_LANGS = CONFIG.UI_LANGS;
export const UI_BOARDS = CONFIG.UI_BOARDS;
export const UI_TRANSLATE = CONFIG.UI_TRANSLATE;

// Фазы 7 (Игры, Ставки, Ходы) — через Патч 010
export const VALID_STAKES = CONFIG.VALID_STAKES;
export const VALID_TIMES = CONFIG.VALID_TIMES;
export const validateGameConfig = CONFIG.validateGameConfig;
export const createTokenGameSession = CONFIG.createTokenGameSession;
export const recordGameMove = CONFIG.recordGameMove;
export const getMyActiveGames = CONFIG.getMyActiveGames;

// Утилиты и Базовые функции
export const formatTime = CONFIG.formatTime;
export const formatC4C = CONFIG.formatC4C;
export const getBotMove = CONFIG.getBotMove;
export const saveProfileToStorage = CONFIG.saveProfileToStorage;
export const loadProfileFromStorage = CONFIG.loadProfileFromStorage;
export const createWagmiConfig = CONFIG.createWagmiConfig;
export const canConnectToMetaMask = CONFIG.canConnectToMetaMask;
export const canConnectToWalletConnect = CONFIG.canConnectToWalletConnect;
export const resetConnectionStates = CONFIG.resetConnectionStates;
export const FIXED_CSS = CONFIG.FIXED_CSS;
export const injectGlobalStyles = CONFIG.injectGlobalStyles;
export const getFriends = CONFIG.getFriends;
export const addFriend = CONFIG.addFriend;
export const processPayout = CONFIG.processPayout;
export const getOnlineGames = CONFIG.getOnlineGames;
