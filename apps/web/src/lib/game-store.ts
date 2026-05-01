// apps/web/src/lib/game-store.ts
import { create } from 'zustand';
import { GameState, MatchDetails, RoomSummary } from './types';

export const useGameStore = create<GameState>((set) => ({
  activeRoom: null,
  userAddress: null,
  isPlayerTurn: false,
  nickname: '',
  matchType: 'ranked',
  stakeAmount: 50000,
  timeControl: 600, // 10 минут по умолчанию
  rooms: [],

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
  setRooms: (rooms) => set({ rooms }),
}));