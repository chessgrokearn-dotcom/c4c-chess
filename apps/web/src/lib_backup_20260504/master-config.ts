import { CONFIG_BASE } from './config-base';
import { PATCH_026 } from './config-patch-026';

export const CONFIG = { ...CONFIG_BASE, ...PATCH_026 };
const C: any = CONFIG; // 🔹 Алиас для безопасного доступа

// 🔹 БАЗА
export const APP_NAME = C.APP_NAME;
export const C4C_TOKEN_ADDRESS = C.C4C_ADDR || C.C4C_TOKEN || C.C4C_TOKEN_ADDRESS;
export const GAME_CONTRACT_ADDRESS = C.GAME_ADDR || C.GAME_CONTRACT || C.GAME_CONTRACT_ADDRESS;
export const CHAIN_ID = C.CHAIN_ID;
export const C4C_BUY_URL = C.C4C_BUY_URL;
export const C4C_EXCHANGE_URL = C.C4C_EXCHANGE_URL;
export const YOUTUBE_URL = C.YOUTUBE_URL;
export const YOUTUBE_BUTTON_TEXT = C.YOUTUBE_BUTTON_TEXT;
export const YOUTUBE_SECTION_DESCRIPTION = C.YOUTUBE_SECTION_DESCRIPTION;
export const SOCIAL_SECTION_TITLE = C.SOCIAL_SECTION_TITLE;
export const SOCIAL_LINKS = C.SOCIAL_LINKS;
export const SECTIONS = C.SECTIONS;

// 🔹 ОПЦИИ ИГРЫ
export const TIME_OPTIONS = C.TIME_CONTROLS || C.TIME_OPTIONS;
export const STAKE_OPTIONS = C.STAKE_LEVELS || C.ALLOWED_STAKES || C.STAKE_OPTIONS;
export const MIN_STAKE = C.MIN_STAKE;
export const TIME_CONTROLS = C.TIME_CONTROLS;
export const STAKE_LEVELS = C.STAKE_LEVELS;

// 🔹 ФОРМАТИРОВАНИЕ
export const formatTime = C.formatTime || C.formatClock;
export const formatC4C = C.formatC4C || C.fromWei;
export const formatPrizePool = C.formatPrizePool;
export const formatClock = C.formatClock || C.formatClockExtended;

// 🔹 ВАЛИДАЦИЯ
export const validateStake = C.validateStake;
export const validateGameConfig = C.validateGameConfig;

// 🔹 UI / ТЕМЫ / ЯЗЫКИ
export const UI_THEMES = C.UI_THEMES || C.CLASSIC_THEMES;
export const UI_LANGS = C.UI_LANGS || C.LANGUAGES;
export const UI_BOARDS = C.UI_BOARDS || C.SAFE_BOARD_THEMES;
export const UI_TRANSLATE = C.UI_TRANSLATE || C.t;
export const EXTENDED_BOARD_THEMES = C.EXTENDED_BOARD_THEMES;
export const PIECE_STYLES = C.PIECE_STYLES;

// 🔹 ПРОФИЛЬ / СОХРАНЕНИЕ
export const saveProfileToStorage = C.saveProfileToStorage;
export const loadProfileFromStorage = C.loadProfileFromStorage;
export const getFriends = C.getFriends;
export const addFriend = C.addFriend;

// 🔹 ПОДКЛЮЧЕНИЕ / WAGMI
export const createWagmiConfig = C.createWagmiConfig;
export const canConnectToMetaMask = C.canConnectToMetaMask;
export const canConnectToWalletConnect = C.canConnectToWalletConnect;
export const resetConnectionStates = C.resetConnectionStates;

// 🔹 СТИЛИ / CSS
export const FIXED_CSS = C.FIXED_CSS;
export const injectGlobalStyles = C.injectGlobalStyles;

// 🔹 КОНТРАКТЫ / УТИЛИТЫ
export const C4C_ABI = C.C4C_ABI;
export const GAME_ABI = C.GAME_ABI;
export const toWei = C.toWei;
export const fromWei = C.fromWei;
export const toContractUnits = C.toContractUnits || C.toWei;
export const fromContractUnits = C.fromContractUnits || C.fromWei;

// 🔹 ХУКИ КОНТРАКТОВ
export const useApproveC4C = C.useApproveC4C;
export const useCreateTokenGame = C.useCreateTokenGame || C.useCreateGame;
export const useJoinTokenGame = C.useJoinTokenGame || C.useJoinGame;
export const useClaimWinnings = C.useClaimWinnings || C.useClaim;
export const useGameBalance = C.useGameBalance || C.useGameBalanceManager;
export const useGameBalanceManager = C.useGameBalanceManager;

// 🔹 ИГРЫ / ЛОББИ
export const createTokenGameSession = C.createTokenGameSession;
export const createGameWithStake = C.createGameWithStake;
export const joinGameWithStake = C.joinGameWithStake;
export const publishGameToLobby = C.publishGameToLobby || C.publishGameToLobbyExtended;
export const publishGameToLobbyExtended = C.publishGameToLobbyExtended;
export const getLobbyGames = C.getLobbyGames || C.getLobbyGamesExtended;
export const getLobbyGamesExtended = C.getLobbyGamesExtended;
export const generateGameInvite = C.generateGameInvite || C.generateGameInviteExtended;
export const generateGameInviteExtended = C.generateGameInviteExtended;
export const sendInviteToChat = C.sendInviteToChat || C.sendInviteToChatExtended;
export const sendInviteToChatExtended = C.sendInviteToChatExtended;
export const canJoinGame = C.canJoinGame || C.canJoinGameExtended;
export const canJoinGameExtended = C.canJoinGameExtended;
export const processPayout = C.processPayout;
export const getBotMove = C.getBotMove;

// 🔹 ШАХМАТНЫЕ ЧАСЫ
export const initClock = C.initClock || C.initClockExtended;
export const initClockExtended = C.initClockExtended;
export const tickClock = C.tickClock || C.tickClockExtended;
export const tickClockExtended = C.tickClockExtended;
export const makeMove = C.makeMove || C.makeMoveExtended;
export const makeMoveExtended = C.makeMoveExtended;
export const formatClockExtended = C.formatClockExtended;
export const checkTimeWin = C.checkTimeWin;
export const processTimeWin = C.processTimeWin;

// 🔹 ОКНО БАЛАНСА ИГРЫ
export const GAME_BALANCE_WINDOW_TITLE = C.GAME_BALANCE_WINDOW_TITLE;
export const GAME_BALANCE_JOIN_BUTTON = C.GAME_BALANCE_JOIN_BUTTON;
export const GAME_BALANCE_CREATE_BUTTON = C.GAME_BALANCE_CREATE_BUTTON;
export const GAME_BALANCE_INVITE_BUTTON = C.GAME_BALANCE_INVITE_BUTTON;

// 🔹 ОПОВЕЩЕНИЯ
export const createNotification = C.createNotification;
export const getNotifications = C.getNotifications;
export const markNotificationRead = C.markNotificationRead;
export const playStartSound = C.playStartSound;
export const showVisualAlert = C.showVisualAlert;
export const checkAndStartGame = C.checkAndStartGame;
export const updatePlayerPresence = C.updatePlayerPresence;
export const areBothPlayersOnline = C.areBothPlayersOnline;

// 🔹 ТИПЫ
export type { GameNotification } from './config-patch-026';
