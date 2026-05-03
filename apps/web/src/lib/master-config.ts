import { createConfig, http } from 'wagmi';
import { bsc } from 'wagmi/chains';
import { walletConnect, metaMask } from 'wagmi/connectors';

export const C4C_TOKEN_ADDRESS = '0xaac20575371de01b4d10c4e7566d5453d72d56e7' as const;
export const GAME_CONTRACT_ADDRESS = '0xCf5E5d01ADd5e2Ba62B2f6747E5CFC43e36D5005' as const;
export const C4C_BUY_URL = 'https://www.pink.meme/token/bsc/0xaac20575371de01b4d10c4e7566d5453d72d56e7' as const;
export const CHAIN_ID = 56 as const;
export const CHAIN_NAME = 'Binance Smart Chain' as const;
export const RPC_URL = 'https://bsc-dataseed.binance.org/' as const;
export const APP_NAME = 'C4C Chess' as const;
export const APP_DESCRIPTION = 'Play chess, earn C4C tokens on BSC' as const;
export const WALLETCONNECT_PROJECT_ID = (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_WALLETCONNECT_ID) || '286f8aa9e630099f05763481672dcdc5';

export const HOW_TO_PLAY = "Как играть:\n1. Подключите кошелёк\n2. Создайте игру\n3. Играйте!\n\nВыигрыш зачисляется автоматически.";

export const TIME_OPTIONS = [{ label: '5 мин', value: 300 }, { label: '15 мин', value: 900 }, { label: '30 мин', value: 1800 }, { label: '1 час', value: 3600 }, { label: '24 часа', value: 86400 }] as const;
export const STAKE_OPTIONS = [{ label: '50k', value: 50000 }, { label: '100k', value: 100000 }, { label: '250k', value: 250000 }, { label: '500k', value: 500000 }, { label: '1M', value: 1000000 }] as const;

// 🔥 ИСПРАВЛЕНО: profileMatch как readonly array
export const BOARD_THEMES = {
  classic: { name: 'Классика', light: '#eeeed2', dark: '#769656', profileMatch: ['default', 'dark'] as const },
  green: { name: 'Зелёная', light: '#b5cf9e', dark: '#3a5f2a', profileMatch: ['forest'] as const },
  blue: { name: 'Синяя', light: '#c9e4f7', dark: '#2b5f8c', profileMatch: ['ocean'] as const },
  wood: { name: 'Дерево', light: '#f0d9b5', dark: '#b58863', profileMatch: ['default', 'royal'] as const },
  marble: { name: 'Мрамор', light: '#f8f8f8', dark: '#4a4a4a', profileMatch: ['light', 'cyber'] as const },
  neon: { name: 'Неон', light: '#00ffff', dark: '#ff00ff', profileMatch: ['cyber'] as const },
  minimal: { name: 'Минимал', light: '#ffffff', dark: '#000000', profileMatch: ['light', 'dark'] as const },
  retro: { name: 'Ретро', light: '#fff8dc', dark: '#8b4513', profileMatch: ['sunset', 'royal'] as const },
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

export const LANGUAGES = { ru: { name: 'Русский', flag: '🇷🇺' }, en: { name: 'English', flag: '🇬🇧' } } as const;

export function formatTime(s: number) { return `${Math.floor(s/60)}м ${(s%60).toString().padStart(2,'0')}с`; }
export function formatC4C(a: any) { return a ? (parseFloat(a.toString())/1e6).toFixed(2) : '0.00'; }
export function getBotMove(moves: any[]) { return moves.length ? moves[Math.floor(Math.random() * moves.length)] : null; }

// 🔥 ИСПРАВЛЕНО: явное приведение типов
export function getBoardThemeForProfile(theme: keyof typeof PROFILE_THEMES): keyof typeof BOARD_THEMES {
  for (const [id, board] of Object.entries(BOARD_THEMES)) {
    if ((board as any).profileMatch?.includes(theme)) return id as keyof typeof BOARD_THEMES;
  }
  return PROFILE_THEMES[theme].fallbackBoard as keyof typeof BOARD_THEMES;
}

export function saveProfile(p: any) { if(typeof window!=='undefined') localStorage.setItem('c4c-profile', JSON.stringify(p)); }
export function loadProfile(): any { if(typeof window!=='undefined') { const d=localStorage.getItem('c4c-profile'); return d?JSON.parse(d):null; } return null; }

export type BoardThemeId = keyof typeof BOARD_THEMES;
export type ProfileThemeId = keyof typeof PROFILE_THEMES;
export type LanguageCode = keyof typeof LANGUAGES;
export interface PlayerProfile { id: string; name: string; theme: ProfileThemeId; language: LanguageCode; boardTheme: BoardThemeId; [key:string]:any; }
export interface Game { id: string; creatorId: string; status: string; [key:string]:any; }
export interface Friend { id: string; name: string; [key:string]:any; }

export function createWagmiConfig() {
  return createConfig({
    chains: [bsc],
    connectors: [
      metaMask({ dappMeta { name: APP_NAME, url: 'https://c4c-chess.vercel.app' } }),
      walletConnect({ projectId: WALLETCONNECT_PROJECT_ID, showQrModal: true, meta { name: APP_NAME, description: APP_DESCRIPTION, url: 'https://c4c-chess.vercel.app', icons: [] } }),
    ],
    transports: { [bsc.id]: http(RPC_URL) },
  });
}

export function canConnectMeta(): boolean { if(typeof window==='undefined') return true; if((window as any).__mm_pending) return false; (window as any).__mm_pending=true; setTimeout(()=>(window as any).__mm_pending=false, 10000); return true; }
export function resetConn() { if(typeof window!=='undefined') { (window as any).__mm_pending=false; (window as any).__wc_pending=false; } }

export function getPieceStyle(c: 'white'|'black'): React.CSSProperties {
  return { fontSize:'40px', fontWeight:900, color:c==='white'?'#fff':'#111', display:'flex', alignItems:'center', justifyContent:'center', width:'100%', height:'100%' };
}
export const PIECE_SYMBOLS: Record<string, Record<'w'|'b', string>> = { p:{w:'♙',b:'♟'}, n:{w:'♘',b:'♞'}, b:{w:'♗',b:'♝'}, r:{w:'♖',b:'♜'}, q:{w:'♕',b:'♛'}, k:{w:'♔',b:'♚'} };
