import { CONFIG_BASE } from './config-base';
// 🔹 АКТИВНЫЕ ПАТЧИ (только рабочие)
import { PATCH_023 } from './config-patch-023';

// 🔹 КОНСТРУКТОР: Только то, что нужно
export const CONFIG = {
  ...CONFIG_BASE,
  ...PATCH_023
};

// 🔹 ЯВНЫЕ ЭКСПОРТЫ (всё из PATCH_023)
export const APP_NAME = CONFIG.APP_NAME;
export const C4C_TOKEN_ADDRESS = CONFIG.C4C_ADDR;
export const GAME_CONTRACT_ADDRESS = CONFIG.GAME_ADDR;
export const CHAIN_ID = CONFIG.CHAIN_ID;
export const C4C_BUY_URL = CONFIG.C4C_BUY_URL || 'https://www.pink.meme/token/bsc/0xaac20575371de01b4d10c4e7566d5453d72d56e7';
export const TIME_OPTIONS = CONFIG.TIME_CONTROLS;
export const STAKE_OPTIONS = CONFIG.STAKE_LEVELS;
export const MIN_STAKE = CONFIG.MIN_STAKE;
export const formatTime = CONFIG.formatClock;
export const formatC4C = CONFIG.fromWei;
export const formatPrizePool = CONFIG.formatPrizePool;
export const validateStake = CONFIG.validateStake;
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
export const getOnlineGames = CONFIG.getLobbyGames;
export const UI_THEMES = CONFIG.UI_THEMES;
export const UI_LANGS = CONFIG.UI_LANGS;
export const UI_BOARDS = CONFIG.UI_BOARDS;
export const UI_TRANSLATE = CONFIG.UI_TRANSLATE;

// 🔹 КОНТРАКТЫ / ХУКИ
export const C4C_ABI = CONFIG.C4C_ABI;
export const GAME_ABI = CONFIG.GAME_ABI;
export const toContractUnits = CONFIG.toWei;
export const useApproveC4C = CONFIG.useApproveC4C;
export const useCreateTokenGame = CONFIG.useCreateGame;
export const useJoinTokenGame = CONFIG.useJoinGame;
export const useClaimWinnings = CONFIG.useClaimWinnings;
export const useGameBalance = CONFIG.useGameBalance;

// 🔹 ИГРЫ / ЛОББИ
export const createTokenGameSession = CONFIG.createTokenGameSession;
export const publishGameToLobby = CONFIG.publishGameToLobby;
export const getLobbyGames = CONFIG.getLobbyGames;
export const generateGameInvite = CONFIG.generateGameInvite;
export const sendInviteToChat = CONFIG.sendInviteToChat;
export const canJoinGame = CONFIG.canJoinGame;

// 🔹 ШАХМАТНЫЕ ЧАСЫ
export const initClock = CONFIG.initClock;
export const tickClock = CONFIG.tickClock;
export const makeMove = CONFIG.makeMove;
export const formatClock = CONFIG.formatClock;
