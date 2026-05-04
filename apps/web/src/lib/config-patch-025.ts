export const SECTIONS = [
  { key: 'profile', label: '👤 Профиль' },
  { key: 'create', label: '🎮 Создать игру' },
  { key: 'lobby', label: '🏟️ Лобби' },
  { key: 'friends', label: '👥 Друзья' },
  { key: 'notifications', label: '🔔 Оповещения' },
  { key: 'youtube', label: '▶️ YouTube' },
  { key: 'social', label: '🌐 Социальные сети' }
];

export const YOUTUBE_URL = 'https://youtube.com/@c4cchess';
export const YOUTUBE_BUTTON_TEXT = 'YouTube канал';
export const C4C_EXCHANGE_URL = 'https://www.pink.meme/token/bsc/0xaac20575371de01b4d10c4e7566d5453d72d56e7';

export const SOCIAL_SECTION_TITLE = 'Социальные сети';
export const SOCIAL_LINKS = [
  { name: 'Telegram', url: 'https://t.me/yourchannel' },
  { name: 'Twitter', url: 'https://twitter.com/yourhandle' },
  { name: 'Discord', url: 'https://discord.gg/yourinvite' }
];
export const YOUTUBE_SECTION_DESCRIPTION = 'Подпишитесь на наш YouTube, чтобы следить за турнирами, гайдами и анонсами.';

// 🔹 Расширенные темы досок
export const EXTENDED_BOARD_THEMES = {
  classic: { name: 'Классик', light: '#f0d9b5', dark: '#b58863' },
  blue: { name: 'Синяя', light: '#eff3f8', dark: '#5b7c99' },
  green: { name: 'Зелёная', light: '#f0f0d0', dark: '#6b8e23' },
  purple: { name: 'Фиолетовая', light: '#e8d5c4', dark: '#7b5c6e' },
  brown: { name: 'Коричневая', light: '#deb887', dark: '#8b6914' },
  marble: { name: 'Мрамор', light: '#f5f5f5', dark: '#708090' },
  wood: { name: 'Дерево', light: '#e8c59c', dark: '#6b4423' },
  ocean: { name: 'Океан', light: '#a6d5d8', dark: '#1b4965' },
  sunset: { name: 'Закат', light: '#ffd9a8', dark: '#ff6b35' },
  neon: { name: 'Неон', light: '#00d9ff', dark: '#ff006e' },
  retro: { name: 'Ретро', light: '#ffffcc', dark: '#996633' },
  chess_com: { name: 'Chess.com', light: '#f0d9b5', dark: '#baca44' }
};

export const PIECE_STYLES = {
  STANDARD: {
    fontSize: 48,
    textShadow: '2px 4px 6px rgba(0,0,0,0.5)',
    opacity: 1,
    userSelect: 'none'
  },
  LARGE: {
    fontSize: 56,
    textShadow: '3px 6px 8px rgba(0,0,0,0.6)',
    opacity: 1,
    userSelect: 'none'
  },
  EXTRA_LARGE: {
    fontSize: 64,
    textShadow: '4px 8px 10px rgba(0,0,0,0.7)',
    opacity: 1,
    userSelect: 'none'
  }
};

export const PATCH_025 = {
  SECTIONS,
  YOUTUBE_URL,
  YOUTUBE_BUTTON_TEXT,
  C4C_EXCHANGE_URL,
  SOCIAL_SECTION_TITLE,
  SOCIAL_LINKS,
  YOUTUBE_SECTION_DESCRIPTION,
  EXTENDED_BOARD_THEMES,
  PIECE_STYLES
};
