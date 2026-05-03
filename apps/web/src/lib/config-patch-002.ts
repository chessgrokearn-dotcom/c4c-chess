// apps/web/src/lib/config-patch-002.ts
// 🔹 ПАТЧ 2: Исправление экспорта типов (GameInvite и др.)

// 🔥 Правильный экспорт типов (не как значения!)
export type { BoardThemeId, ProfileThemeId, LanguageCode, PlayerProfile, Game, Friend, GameInvite } from './config-base';

// 🔥 Пустой объект для совместимости (типы не могут быть в CONFIG)
export const PATCH_002_TYPES = {};