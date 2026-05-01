// apps/web/src/lib/game-store.ts
import { create } from 'zustand';

interface Match {
  id: string;
  fen: string;
  white: string;
  black: string;
  stake: number;
}

interface GameState {
  activeRoom: Match | null;
  setActiveRoom: (room: Match | null | ((prev: Match | null) => Match | null)) => void;
  
  isPlayerTurn: boolean;
  setIsPlayerTurn: (turn: boolean) => void;
  
  userAddress: string | null;
  setUserAddress: (address: string | null) => void;

  // Поля для формы создания игры
  nickname: string;
  setNickname: (name: string) => void;
  
  matchType: 'ranked' | 'friendly';
  setMatchType: (type: 'ranked' | 'friendly') => void;
  
  stakeAmount: number;
  setStakeAmount: (amount: number) => void;
  
  timeControl: number; // в секундах
  setTimeControl: (time: number) => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  activeRoom: null,
  userAddress: null,
  isPlayerTurn: false,
  
  // Начальные значения для формы
  nickname: '',
  matchType: 'ranked',
  stakeAmount: 50000,
  timeControl: 600, // 10 минут по умолчанию

  setActiveRoom: (room) => {
    set((state) => {
      const newRoom = typeof room === 'function' ? room(state.activeRoom) : room;
      
      let isTurn = false;
      if (newRoom && state.userAddress) {
        const isWhiteTurn = newRoom.fen.split(' ')[1] === 'w';
        const amIWhite = newRoom.white?.toLowerCase() === state.userAddress.toLowerCase();
        isTurn = (isWhiteTurn && amIWhite) || (!isWhiteTurn && !amIWhite);
      }

      return {
        activeRoom: newRoom,
        isPlayerTurn: isTurn
      };
    });
  },

  setIsPlayerTurn: (turn) => set({ isPlayerTurn: turn }),
  setUserAddress: (address) => set({ userAddress: address }),
  
  setNickname: (name) => set({ nickname: name }),
  setMatchType: (type) => set({ matchType: type }),
  setStakeAmount: (amount) => set({ stakeAmount: amount }),
  setTimeControl: (time) => set({ timeControl: time }),
}));