// apps/web/src/lib/master-config.ts
// 🔥 ЕДИНЫЙ ИСТОЧНИК ИСТИНЫ + ФАБРИКИ + ИСПРАВЛЕНИЯ

import { createConfig, http } from 'wagmi';
import { bsc } from 'wagmi/chains';
import { walletConnect, metaMask } from 'wagmi/connectors';

// Адреса контрактов
export const C4C_TOKEN_ADDRESS = '0xaac20575371de01b4d10c4e7566d5453d72d56e7' as const;
export const GAME_CONTRACT_ADDRESS = '0xCf5E5d01ADd5e2Ba62B2f6747E5CFC43e36D5005' as const;
export const C4C_BUY_URL = 'https://www.pink.meme/token/bsc/0xaac20575371de01b4d10c4e7566d5453d72d56e7' as const;

// Сеть
export const CHAIN_ID = 56 as const;
export const CHAIN_NAME = 'Binance Smart Chain' as const;
export const RPC_URL = 'https://bsc-dataseed.binance.org/' as const;

// Приложение
export const APP_NAME = 'C4C Chess' as const;
export const APP_DESCRIPTION = 'Play chess, earn C4C tokens on BSC' as const;
export const WALLETCONNECT_PROJECT_ID = 
  (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_WALLETCONNECT_ID) || 
  '286f8aa9e630099f05763481672dcdc5';

export const HOW_TO_PLAY = `
🎮 Как играть:
1. Подключите кошелёк (MetaMask или WalletConnect)
2. Нажмите "🎮 Создать игру" или присоединитесь в "🎲 Лобби"
3. Выберите время (5м/15м/30м/1ч/24ч) и ставку (50к–1М C4C)
4. Играйте! Бот ходит через 4 секунды

💰 Как получить выигрыш:
• Победитель получает 2× ставку
• Выигрыш зачисляется автоматически
• Проверьте баланс в профиле

🛒 Где купить C4C: ${C4C_BUY_URL}
`;

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

export const BOARD_THEMES = {
  classic: { name: 'Классика', light: '#eeeed2', dark: '#769656', profileMatch: ['default', 'dark'] },
  green: { name: 'Зелёная', light: '#b5cf9e', dark: '#3a5f2a', profileMatch: ['forest'] },
  blue: { name: 'Синяя', light: '#c9e4f7', dark: '#2b5f8c', profileMatch: ['ocean'] },
  wood: { name: 'Дерево', light: '#f0d9b5', dark: '#b58863', profileMatch: ['default', 'royal'] },
  marble: { name: 'Мрамор', light: '#f8f8f8', dark: '#4a4a4a', profileMatch: ['light', 'cyber'] },
  neon: { name: 'Неон', light: '#00ffff', dark: '#ff00ff', profileMatch: ['cyber'] },
  minimal: { name: 'Минимал', light: '#ffffff', dark: '#000000', profileMatch: ['light', 'dark'] },
  retro: { name: 'Ретро', light: '#fff8dc', dark: '#8b4513', profileMatch: ['sunset', 'royal'] },
} as const;

export const PROFILE_THEMES = {
  default: { name: 'Классика', bg: '#111827', text: '#f9fafb', accent: '#f59e0b', card: '#1f2937', fallbackBoard: 'classic' },
  dark: { name: 'Тёмная', bg: '#030712', text: '#f3f4f6', accent: '#6366f1', card: '#1f2937', fallbackBoard: 'minimal' },
  light: { name: 'Светлая', bg: '#f9fafb', text: '#111827', accent: '#059669', card: '#ffffff', fallbackBoard: 'marble' },
  ocean: { name: 'Океан', bg: '#0c4a6e', text: '#f0f9ff', accent: '#38bdf8', card: '#1e3a5f', fallbackBoard: 'blue' },
  forest: { name: 'Лес', bg: '#064e3b', text: '#ecfdf5', accent: '#34d399', card: '#065f46', fallbackBoard: 'green' },
  sunset: { name: 'Закат', bg: '#7c2d12', text: '#fff7ed', accent: '#fb923c', card: '#9a3412', fallbackBoard: 'retro' },
  cyber: { name: 'Кибер', bg: '#0f0f23', text: '#e0e7ff', accent: '#a78bfa', card: '#1e1b4b', fallbackBoard: 'neon' },
  royal: { name: 'Королевская', bg: '#1e1b4b', text: '#fef3c7', accent: '#fbbf24', card: '#312e81', fallbackBoard: 'wood' },
} as const;

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

export function formatC4C(amount: number | undefined | null): string {
  if (amount == null) return '0.00';
  try {
    const value = parseFloat(amount.toString()) / 1_000_000;
    return value.toFixed(2);
  } catch {
    return '0.00';
  }
}

export function getBotMove(moves: any[]): any {
  if (moves.length === 0) return null;
  const captures = moves.filter((m: any) => m.captured);
  return (captures.length > 0 ? captures : moves)[
    Math.floor(Math.random() * (captures.length > 0 ? captures.length : moves.length))
  ];
}

export function getBoardThemeForProfile(profileTheme: keyof typeof PROFILE_THEMES): keyof typeof BOARD_THEMES {
  const profile = PROFILE_THEMES[profileTheme];
  for (const [boardId, board] of Object.entries(BOARD_THEMES) as [keyof typeof BOARD_THEMES, typeof BOARD_THEMES[keyof typeof BOARD_THEMES]][]) {
    if (board.profileMatch?.includes(profileTheme)) return boardId;
  }
  return profile.fallbackBoard as keyof typeof BOARD_THEMES;
}

export function saveProfileToStorage(profile: any): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('c4c-profile', JSON.stringify({ ...profile, savedAt: Date.now() }));
  } catch (e) { console.warn('Failed to save profile:', e); }
}

export function loadProfileFromStorage(): any | null {
  if (typeof window === 'undefined') return null;
  try {
    const saved = localStorage.getItem('c4c-profile');
    if (!saved) return null;
    const profile = JSON.parse(saved);
    if (Date.now() - profile.savedAt > 7 * 24 * 60 * 60 * 1000) {
      localStorage.removeItem('c4c-profile');
      return null;
    }
    return profile;
  } catch (e) { console.warn('Failed to load profile:', e); return null; }
}

export type BoardThemeId = keyof typeof BOARD_THEMES;
export type ProfileThemeId = keyof typeof PROFILE_THEMES;
export type LanguageCode = keyof typeof LANGUAGES;

export interface PlayerProfile {
  id: string; name: string; avatar?: string; description?: string;
  links?: [string, string][]; theme: ProfileThemeId; language: LanguageCode; boardTheme: BoardThemeId;
}
export interface Game {
  id: string; creatorId: string; whitePlayer?: string; blackPlayer?: string;
  timeControl: number; stake: number; boardTheme: BoardThemeId;
  status: 'waiting' | 'active' | 'finished'; winner?: string; createdAt: number;
}
export interface Friend {
  id: string; playerId: string; name: string; avatar?: string; status: 'online' | 'offline' | 'playing';
}
export interface GameInvite {
  id: string; gameId: string; fromPlayer: string; toPlayer: string;
  status: 'pending' | 'accepted' | 'declined'; createdAt: number;
}

export function createWagmiConfig() {
  return createConfig({
    chains: [bsc],
    connectors: [
      metaMask({ 
        dappMetadata: { 
          name: APP_NAME, 
          url: typeof window !== 'undefined' ? window.location.origin : 'https://c4c-chess.vercel.app' 
        },
        onConnectError: (error: Error) => {
          console.warn('MetaMask connection error:', error);
          if (typeof window !== 'undefined') (window as any).__c4c_metamask_pending = false;
        }
      }),
      walletConnect({
        projectId: WALLETCONNECT_PROJECT_ID,
        showQrModal: true,
        metadata: {
          name: APP_NAME,
          description: APP_DESCRIPTION,
          url: typeof window !== 'undefined' ? window.location.origin : 'https://c4c-chess.vercel.app',
          icons: ['https://avatars.githubusercontent.com/u/37784886'],
        },
        onConnectError: (error: Error) => {
          console.warn('WalletConnect error:', error);
          if (typeof window !== 'undefined') (window as any).__c4c_wc_pending = false;
        }
      }),
    ],
    transports: { [bsc.id]: http(RPC_URL) },
  });
}

export function canConnectToMetaMask(): boolean {
  if (typeof window === 'undefined') return true;
  const pending = (window as any).__c4c_metamask_pending;
  if (pending) { console.warn('MetaMask connection already pending'); return false; }
  (window as any).__c4c_metamask_pending = true;
  setTimeout(() => { (window as any).__c4c_metamask_pending = false; }, 30000);
  return true;
}

export function canConnectToWalletConnect(): boolean {
  if (typeof window === 'undefined') return true;
  const pending = (window as any).__c4c_wc_pending;
  if (pending) { console.warn('WalletConnect already pending'); return false; }
  (window as any).__c4c_wc_pending = true;
  setTimeout(() => { (window as any).__c4c_wc_pending = false; }, 30000);
  return true;
}

export function resetConnectionStates(): void {
  if (typeof window !== 'undefined') {
    (window as any).__c4c_metamask_pending = false;
    (window as any).__c4c_wc_pending = false;
  }
}

export function getPieceStyle(color: 'white' | 'black'): React.CSSProperties {
  return {
    fontSize: '40px', fontWeight: 900,
    color: color === 'white' ? '#fff' : '#111827',
    textShadow: color === 'white' ? '0 2px 4px rgba(0,0,0,0.3)' : '0 2px 4px rgba(255,255,255,0.3)',
    userSelect: 'none', lineHeight: 1,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    width: '100%', height: '100%',
  } satisfies React.CSSProperties;
}

export const PIECE_SYMBOLS: Record<string, Record<'w'|'b', string>> = {
  p: { w: '♙', b: '♟' }, n: { w: '♘', b: '♞' }, b: { w: '♗', b: '♝' },
  r: { w: '♖', b: '♜' }, q: { w: '♕', b: '♛' }, k: { w: '♔', b: '♚' }
} as const;

export const CONFIG = {
  C4C_TOKEN_ADDRESS, GAME_CONTRACT_ADDRESS, C4C_BUY_URL,
  CHAIN_ID, CHAIN_NAME, RPC_URL,
  APP_NAME, APP_DESCRIPTION, WALLETCONNECT_PROJECT_ID, HOW_TO_PLAY,
  TIME_OPTIONS, STAKE_OPTIONS, BOARD_THEMES, PROFILE_THEMES, LANGUAGES,
  formatTime, formatC4C, getBotMove, getBoardThemeForProfile,
  saveProfileToStorage, loadProfileFromStorage,
  createWagmiConfig, canConnectToMetaMask, canConnectToWalletConnect, resetConnectionStates,
  getPieceStyle, PIECE_SYMBOLS,
} as const;
