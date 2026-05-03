export type ThemeId = 'default' | 'dark' | 'light' | 'ocean' | 'forest' | 'sunset' | 'cyber' | 'royal';
export const THEMES: Record<ThemeId, { name: string; colors: { bg: string; text: string; accent: string } }> = {
  default: { name: 'Классика', colors: { bg: '#111827', text: '#f9fafb', accent: '#f59e0b' } },
  dark:    { name: 'Тёмная',  colors: { bg: '#030712', text: '#f3f4f6', accent: '#6366f1' } },
  light:   { name: 'Светлая', colors: { bg: '#f9fafb', text: '#111827', accent: '#059669' } },
  ocean:   { name: 'Океан',   colors: { bg: '#0c4a6e', text: '#f0f9ff', accent: '#38bdf8' } },
  forest:  { name: 'Лес',     colors: { bg: '#064e3b', text: '#ecfdf5', accent: '#34d399' } },
  sunset:  { name: 'Закат',   colors: { bg: '#7c2d12', text: '#fff7ed', accent: '#fb923c' } },
  cyber:   { name: 'Кибер',   colors: { bg: '#0f0f23', text: '#e0e7ff', accent: '#a78bfa' } },
  royal:   { name: 'Королевская', colors: { bg: '#1e1b4b', text: '#fef3c7', accent: '#fbbf24' } },
};

export type BoardThemeId = 'classic' | 'green' | 'blue' | 'wood' | 'marble' | 'neon' | 'minimal' | 'retro';
export const BOARD_THEMES: Record<BoardThemeId, { name: string; light: string; dark: string }> = {
  classic: { name: 'Классика', light: '#eeeed2', dark: '#769656' },
  green:   { name: 'Зелёная', light: '#b5cf9e', dark: '#3a5f2a' },
  blue:    { name: 'Синяя',   light: '#c9e4f7', dark: '#2b5f8c' },
  wood:    { name: 'Дерево',  light: '#f0d9b5', dark: '#b58863' },
  marble:  { name: 'Мрамор',  light: '#f8f8f8', dark: '#4a4a4a' },
  neon:    { name: 'Неон',    light: '#00ffff', dark: '#ff00ff' },
  minimal: { name: 'Минимал', light: '#ffffff', dark: '#000000' },
  retro:   { name: 'Ретро',   light: '#fff8dc', dark: '#8b4513' },
};

export type LanguageCode = 'en' | 'ru' | 'es' | 'fr' | 'de' | 'pt' | 'zh' | 'ja' | 'ko' | 'ar';
export const LANGUAGES: Record<LanguageCode, { name: string; flag: string }> = {
  en: { name: 'English', flag: '🇬🇧' }, ru: { name: 'Русский', flag: '🇷🇺' }, es: { name: 'Español', flag: '🇪🇸' },
  fr: { name: 'Français', flag: '🇫🇷' }, de: { name: 'Deutsch', flag: '🇩🇪' }, pt: { name: 'Português', flag: '🇵🇹' },
  zh: { name: '中文', flag: '🇨🇳' }, ja: { name: '日本語', flag: '🇯🇵' }, ko: { name: '한국어', flag: '🇰🇷' }, ar: { name: 'العربية', flag: '🇸🇦' },
};

export const STAKE_OPTIONS = [
  { label: '0.05 C4C', value: 50000 },
  { label: '0.1 C4C',  value: 100000 },
  { label: '0.25 C4C', value: 250000 },
  { label: '0.5 C4C',  value: 500000 },
  { label: '1.0 C4C',  value: 1000000 },
] as const;

export interface Player {
  id: string; name: string; avatar?: string; description?: string;
  links?: [string, string]; theme: ThemeId; language: LanguageCode; boardTheme: BoardThemeId; createdAt: number;
}

export interface Game {
  id: string; creatorId: string; whitePlayer?: string; blackPlayer?: string;
  timeControl: number; boardTheme: BoardThemeId; stake: number;
  status: 'waiting' | 'staked' | 'active' | 'finished';
  winner?: string; createdAt: number;
}

export interface Friendship {
  id: string; player1: string; player2: string; status: 'pending' | 'accepted'; createdAt: number;
}