// apps/web/src/lib/master-config.ts
// 🔥 ЕДИНЫЙ ИСТОЧНИК ИСТИНЫ + ФАБРИКИ КОМПОНЕНТОВ
// Меняешь здесь → автоматически применяется во всех файлах

// ============================================================================
// 🔹 ИМПОРТЫ (только здесь, в master-config)
// ============================================================================
import { createConfig, http } from 'wagmi';
import { bsc } from 'wagmi/chains';
import { walletConnect, metaMask } from 'wagmi/connectors';

// ============================================================================
// 🔹 КОНСТАНТЫ (все настройки в одном месте)
// ============================================================================

// Адреса контрактов
export const C4C_TOKEN_ADDRESS = '0xaac20575371de01b4d10c4e7566d5453d72d56e7' as const;
export const GAME_CONTRACT_ADDRESS = '0xCf5E5d01ADd5e2Ba62B2f6747E5CFC43e36D5005' as const;

// Ссылки
export const C4C_BUY_URL = 'https://www.pink.meme/token/bsc/0xaac20575371de01b4d10c4e7566d5453d72d56e7' as const;

// Сеть
export const CHAIN_ID = 56 as const;
export const CHAIN_NAME = 'Binance Smart Chain' as const;
export const RPC_URL = 'https://bsc-dataseed.binance.org/' as const;

// Приложение
export const APP_NAME = 'C4C Chess' as const;
export const APP_DESCRIPTION = 'Play chess, earn C4C tokens on BSC' as const;

// 🔥 WalletConnect ID — МЕНЯТЬ ТОЛЬКО ЗДЕСЬ
export const WALLETCONNECT_PROJECT_ID = 
  (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_WALLETCONNECT_ID) || 
  '286f8aa9e630099f05763481672dcdc5';

// Описание
export const HOW_TO_PLAY = `
🎮 Как играть:
1. Подключите кошелёк (MetaMask или WalletConnect)
2. Нажмите "🎮 Создать игру" или присоединитесь в "🎲 Лобби"
3. Выберите время (5м/15м/30м/1ч/24ч) и ставку (50к–1М C4C)
4. Играйте! Бот ходит через 4 секунды, таймер переключается после хода

💰 Как получить выигрыш:
• Победитель получает 2× ставку (минус комиссия контракта)
• Выигрыш автоматически зачисляется на ваш кошелёк
• Проверьте баланс в профиле после завершения игры

🛒 Где купить C4C:
• Нажмите "🛒 Купить C4C" в профиле
• Или перейдите на Pink.Meme: ${C4C_BUY_URL}
`;

// Опции
export const TIME_OPTIONS = [
  { label: '5 мин', value: 300 },
  { label: '15 мин', value: 900 },
  { label: '30 мин', value: 1800 },
  { label: '1 час', value: 3600 },
  { label: '24 часа', value: 86400 },
] as const;

export const STAKE_OPTIONS = [
  { label: '50 000', value: 50000 },
  { label: '100 000', value: 100000 },
  { label: '250 000', value: 250000 },
  { label: '500 000', value: 500000 },
  { label: '1 000 000', value: 1000000 },
] as const;

// Темы доски
export const BOARD_THEMES = {
  classic: { name: 'Классика', light: '#eeeed2', dark: '#769656' },
  green: { name: 'Зелёная', light: '#b5cf9e', dark: '#3a5f2a' },
  blue: { name: 'Синяя', light: '#c9e4f7', dark: '#2b5f8c' },
  wood: { name: 'Дерево', light: '#f0d9b5', dark: '#b58863' },
  marble: { name: 'Мрамор', light: '#f8f8f8', dark: '#4a4a4a' },
  neon: { name: 'Неон', light: '#00ffff', dark: '#ff00ff' },
  minimal: { name: 'Минимал', light: '#ffffff', dark: '#000000' },
  retro: { name: 'Ретро', light: '#fff8dc', dark: '#8b4513' },
} as const;

// Темы профиля
export const PROFILE_THEMES = {
  default: { name: 'Классика', bg: '#111827', text: '#f9fafb', accent: '#f59e0b', card: '#1f2937' },
  dark: { name: 'Тёмная', bg: '#030712', text: '#f3f4f6', accent: '#6366f1', card: '#1f2937' },
  light: { name: 'Светлая', bg: '#f9fafb', text: '#111827', accent: '#059669', card: '#ffffff' },
  ocean: { name: 'Океан', bg: '#0c4a6e', text: '#f0f9ff', accent: '#38bdf8', card: '#1e3a5f' },
  forest: { name: 'Лес', bg: '#064e3b', text: '#ecfdf5', accent: '#34d399', card: '#065f46' },
  sunset: { name: 'Закат', bg: '#7c2d12', text: '#fff7ed', accent: '#fb923c', card: '#9a3412' },
  cyber: { name: 'Кибер', bg: '#0f0f23', text: '#e0e7ff', accent: '#a78bfa', card: '#1e1b4b' },
  royal: { name: 'Королевская', bg: '#1e1b4b', text: '#fef3c7', accent: '#fbbf24', card: '#312e81' },
} as const;

// Языки
export const LANGUAGES = {
  ru: { name: 'Русский', flag: '🇷🇺' },
  en: { name: 'English', flag: '🇬🇧' },
  es: { name: 'Español', flag: '🇪🇸' },
  fr: { name: 'Français', flag: '🇫🇷' },
  de: { name: 'Deutsch', flag: '🇩🇪' },
  pt: { name: 'Português', flag: '🇵🇹' },
  zh: { name: '中文', flag: '🇨🇳' },
  ja: { name: '日本語', flag: '🇯🇵' },
  ko: { name: '한국어', flag: '🇰🇷' },
  ar: { name: 'العربية', flag: '🇸🇦' },
} as const;

// ============================================================================
// 🔹 УТИЛИТЫ (экспортируются для использования в других файлах)
// ============================================================================

export function formatTime(seconds: number): string {
  if (seconds >= 3600) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return `${h}ч ${m}м`;
  }
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}м ${s.toString().padStart(2, '0')}с`;
}

export function formatC4C(amount: number): string {
  return (amount / 1_000_000).toFixed(2);
}

export function getBotMove(moves: any[]): any {
  if (moves.length === 0) return null;
  const captures = moves.filter((m: any) => m.captured);
  return (captures.length > 0 ? captures : moves)[
    Math.floor(Math.random() * (captures.length > 0 ? captures.length : moves.length))
  ];
}

// ============================================================================
// 🔹 ТИПЫ (экспортируются для использования в других файлах)
// ============================================================================

export type BoardThemeId = keyof typeof BOARD_THEMES;
export type ProfileThemeId = keyof typeof PROFILE_THEMES;
export type LanguageCode = keyof typeof LANGUAGES;

export interface PlayerProfile {
  id: string;
  name: string;
  avatar?: string;
  description?: string;
  links?: [string, string][];
  theme: ProfileThemeId;
  language: LanguageCode;
  boardTheme: BoardThemeId;
}

export interface Game {
  id: string;
  creatorId: string;
  whitePlayer?: string;
  blackPlayer?: string;
  timeControl: number;
  stake: number;
  boardTheme: BoardThemeId;
  status: 'waiting' | 'active' | 'finished';
  winner?: string;
  createdAt: number;
}

export interface Friend {
  id: string;
  playerId: string;
  name: string;
  avatar?: string;
  status: 'online' | 'offline' | 'playing';
}

export interface GameInvite {
  id: string;
  gameId: string;
  fromPlayer: string;
  toPlayer: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: number;
}

// ============================================================================
// 🔥 ФАБРИКА WAGMI CONFIG — ИСПРАВЛЕНО: правильные ключи с двоеточиями!
// ============================================================================

/**
 * Создаёт конфигурацию wagmi с правильными параметрами
 * Если возникает ошибка синтаксиса — исправляй только в этой функции!
 * 
 * 🔑 Ключевые моменты:
 * - metaMask использует `dappMetadata:` (с двоеточием!)
 * - walletConnect использует `metadata:` (с двоеточием!)
 */
export function createWagmiConfig() {
  return createConfig({
    chains: [bsc],
    connectors: [
      // 🔥 MetaMask — ИСПРАВЛЕНО: dappMetadata: с двоеточием
      metaMask({ 
        dappMetadata: { 
          name: APP_NAME, 
          url: typeof window !== 'undefined' ? window.location.origin : 'https://c4c-chess.vercel.app' 
        } 
      }),
      // 🔥 WalletConnect — ИСПРАВЛЕНО: metadata: с двоеточием
      walletConnect({
        projectId: WALLETCONNECT_PROJECT_ID,
        showQrModal: true,
        metadata: {
          name: APP_NAME,
          description: APP_DESCRIPTION,
          url: typeof window !== 'undefined' ? window.location.origin : 'https://c4c-chess.vercel.app',
          icons: ['https://avatars.githubusercontent.com/u/37784886'],
        },
      }),
    ],
    transports: { [bsc.id]: http(RPC_URL) },
  });
}

// ============================================================================
// 🔥 ЭКСПОРТ ВСЕГО В ОДНОМ ОБЪЕКТЕ (для удобства импорта)
// ============================================================================

export const CONFIG = {
  C4C_TOKEN_ADDRESS,
  GAME_CONTRACT_ADDRESS,
  C4C_BUY_URL,
  CHAIN_ID,
  CHAIN_NAME,
  RPC_URL,
  APP_NAME,
  APP_DESCRIPTION,
  WALLETCONNECT_PROJECT_ID,
  HOW_TO_PLAY,
  TIME_OPTIONS,
  STAKE_OPTIONS,
  BOARD_THEMES,
  PROFILE_THEMES,
  LANGUAGES,
  formatTime,
  formatC4C,
  getBotMove,
  createWagmiConfig,
} as const;