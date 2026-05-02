// apps/web/src/lib/game-store.ts
import { create } from 'zustand';

interface GameState {
  // Профиль
  nickname: string;
  setNickname: (name: string) => void;
  
  // Настройки игры
  draftStake: number;
  setDraftStake: (amount: number) => void;
  draftTimeLimit: number;
  setDraftTimeLimit: (seconds: number) => void;
  selectedBoardTheme: string;
  setSelectedBoardTheme: (theme: string) => void;
  
  // Сброс
  resetDraft: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  // Профиль
  nickname: '',
  setNickname: (name) => set({ nickname: name }),
  
  // Настройки игры (значения по умолчанию)
  draftStake: 50000, // 50 C4C (токен имеет 6 децималей)
  setDraftStake: (amount) => set({ draftStake: amount }),
  
  draftTimeLimit: 600, // 10 минут
  setDraftTimeLimit: (seconds) => set({ draftTimeLimit: seconds }),
  
  selectedBoardTheme: 'classic',
  setSelectedBoardTheme: (theme) => set({ selectedBoardTheme: theme }),
  
  // Сброс настроек
  resetDraft: () => set({
    draftStake: 50000,
    draftTimeLimit: 600,
    selectedBoardTheme: 'classic',
  }),
}));