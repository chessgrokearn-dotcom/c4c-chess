import { CONFIG_BASE } from './config-base';
import { PATCH_026 } from './config-patch-026';

export const CONFIG = { ...CONFIG_BASE, ...PATCH_026 };

// 🔹 БАЗА
export const APP_NAME = CONFIG.APP_NAME;
export const C4C_TOKEN_ADDRESS = CONFIG.C4C_ADDR || CONFIG.C4C_TOKEN;
export const GAME_CONTRACT_ADDRESS = CONFIG.GAME_ADDR || CONFIG.GAME_CONTRACT;
export const CHAIN_ID = CONFIG.CHAIN_ID;
export const C4C_BUY_URL = CONFIG.C4C_BUY_URL;
export const C4C_EXCHANGE_URL = CONFIG.C4C_EXCHANGE_URL;
export const YOUTUBE_URL = CONFIG.YOUTUBE_URL;
export const YOUTUBE_BUTTON_TEXT = CONFIG.YOUTUBE_BUTTON_TEXT;
export const YOUTUBE_SECTION_DESCRIPTION = CONFIG.YOUTUBE_SECTION_DESCRIPTION;
export const SOCIAL_SECTION_TITLE = CONFIG.SOCIAL_SECTION_TITLE;
export const SOCIAL_LINKS = CONFIG.SOCIAL_LINKS;
export const SECTIONS = CONFIG.SECTIONS;

// 🔹 ОПЦИИ ИГРЫ
export const TIME_OPTIONS = CONFIG.TIME_CONTROLS || CONFIG.TIME_OPTIONS;
export const STAKE_OPTIONS = CONFIG.STAKE_LEVELS || CONFIG.ALLOWED_STAKES;
export const MIN_STAKE = CONFIG.MIN_STAKE;
export const TIME_CONTROLS = CONFIG.TIME_CONTROLS;
export const STAKE_LEVELS = CONFIG.STAKE_LEVELS;

// 🔹 ФОРМАТИРОВАНИЕ
export const formatTime = CONFIG.formatTime || CONFIG.formatClock;
export const formatC4C = CONFIG.formatC4C || CONFIG.fromWei;
export const formatPrizePool = CONFIG.formatPrizePool;
export const formatClock = CONFIG.formatClock || CONFIG.formatClockExtended;

// 🔹 ВАЛИДАЦИЯ
export const validateStake = CONFIG.validateStake;
export const validateGameConfig = CONFIG.validateGameConfig;

// 🔹 UI / ТЕМЫ / ЯЗЫКИ
export const UI_THEMES = CONFIG.UI_THEMES || CONFIG.CLASSIC_THEMES;
export const UI_LANGS = CONFIG.UI_LANGS || CONFIG.LANGUAGES;
export const UI_BOARDS = CONFIG.UI_BOARDS || CONFIG.SAFE_BOARD_THEMES;
export const UI_TRANSLATE = CONFIG.UI_TRANSLATE || CONFIG.t;
export const EXTENDED_BOARD_THEMES = CONFIG.EXTENDED_BOARD_THEMES;
export const PIECE_STYLES = CONFIG.PIECE_STYLES;

// 🔹 ПРОФИЛЬ / СОХРАНЕНИЕ
export const saveProfileToStorage = CONFIG.saveProfileToStorage;
export const loadProfileFromStorage = CONFIG.loadProfileFromStorage;
export const getFriends = CONFIG.getFriends;
export const addFriend = CONFIG.addFriend;

// 🔹 ПОДКЛЮЧЕНИЕ / WAGMI
export const createWagmiConfig = CONFIG.createWagmiConfig;
export const canConnectToMetaMask = CONFIG.canConnectToMetaMask;
export const canConnectToWalletConnect = CONFIG.canConnectToWalletConnect;
export const resetConnectionStates = CONFIG.resetConnectionStates;

// 🔹 СТИЛИ / CSS
export const FIXED_CSS = CONFIG.FIXED_CSS;
export const injectGlobalStyles = CONFIG.injectGlobalStyles;

// 🔹 КОНТРАКТЫ / УТИЛИТЫ
export const C4C_ABI = CONFIG.C4C_ABI;
export const GAME_ABI = CONFIG.GAME_ABI;
export const toWei = CONFIG.toWei;
export const fromWei = CONFIG.fromWei;
export const toContractUnits = CONFIG.toContractUnits || CONFIG.toWei;
export const fromContractUnits = CONFIG.fromContractUnits || CONFIG.fromWei;

// 🔹 ХУКИ КОНТРАКТОВ
export const useApproveC4C = CONFIG.useApproveC4C;
export const useCreateTokenGame = CONFIG.useCreateTokenGame || CONFIG.useCreateGame;
export const useJoinTokenGame = CONFIG.useJoinTokenGame || CONFIG.useJoinGame;
export const useClaimWinnings = CONFIG.useClaimWinnings || CONFIG.useClaim;
export const useGameBalance = CONFIG.useGameBalance || CONFIG.useGameBalanceManager;
export const useGameBalanceManager = CONFIG.useGameBalanceManager;

// 🔹 ИГРЫ / ЛОББИ
export const createTokenGameSession = CONFIG.createTokenGameSession;
export const createGameWithStake = CONFIG.createGameWithStake;
export const joinGameWithStake = CONFIG.joinGameWithStake;
export const publishGameToLobby = CONFIG.publishGameToLobby || CONFIG.publishGameToLobbyExtended;
export const publishGameToLobbyExtended = CONFIG.publishGameToLobbyExtended;
export const getLobbyGames = CONFIG.getLobbyGames || CONFIG.getLobbyGamesExtended;
export const getLobbyGamesExtended = CONFIG.getLobbyGamesExtended;
export const generateGameInvite = CONFIG.generateGameInvite || CONFIG.generateGameInviteExtended;
export const generateGameInviteExtended = CONFIG.generateGameInviteExtended;
export const sendInviteToChat = CONFIG.sendInviteToChat || CONFIG.sendInviteToChatExtended;
export const sendInviteToChatExtended = CONFIG.sendInviteToChatExtended;
export const canJoinGame = CONFIG.canJoinGame || CONFIG.canJoinGameExtended;
export const canJoinGameExtended = CONFIG.canJoinGameExtended;
export const processPayout = CONFIG.processPayout;
export const getBotMove = CONFIG.getBotMove;

// 🔹 ШАХМАТНЫЕ ЧАСЫ
export const initClock = CONFIG.initClock || CONFIG.initClockExtended;
export const initClockExtended = CONFIG.initClockExtended;
export const tickClock = CONFIG.tickClock || CONFIG.tickClockExtended;
export const tickClockExtended = CONFIG.tickClockExtended;
export const makeMove = CONFIG.makeMove || CONFIG.makeMoveExtended;
export const makeMoveExtended = CONFIG.makeMoveExtended;
export const formatClockExtended = CONFIG.formatClockExtended;
export const checkTimeWin = CONFIG.checkTimeWin;
export const processTimeWin = CONFIG.processTimeWin;

// 🔹 ОКНО БАЛАНСА ИГРЫ
export const GAME_BALANCE_WINDOW_TITLE = CONFIG.GAME_BALANCE_WINDOW_TITLE;
export const GAME_BALANCE_JOIN_BUTTON = CONFIG.GAME_BALANCE_JOIN_BUTTON;
export const GAME_BALANCE_CREATE_BUTTON = CONFIG.GAME_BALANCE_CREATE_BUTTON;
export const GAME_BALANCE_INVITE_BUTTON = CONFIG.GAME_BALANCE_INVITE_BUTTON;

// 🔹 ОПОВЕЩЕНИЯ (из патча 026)
export const createNotification = CONFIG.createNotification;
export const getNotifications = CONFIG.getNotifications;
export const markNotificationRead = CONFIG.markNotificationRead;
export const playStartSound = CONFIG.playStartSound;
export const showVisualAlert = CONFIG.showVisualAlert;
export const checkAndStartGame = CONFIG.checkAndStartGame;
export const updatePlayerPresence = CONFIG.updatePlayerPresence;
export const areBothPlayersOnline = CONFIG.areBothPlayersOnline;

// 🔹 ТИПЫ
export type { GameNotification } from './config-patch-026';
