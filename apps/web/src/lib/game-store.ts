import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Player, Game, Friendship } from '@/types';

interface GameState {
  currentPlayer: Player | null;
  setCurrentPlayer: (player: Player | null) => void;
  updatePlayer: (updates: Partial<Player>) => void;
  games: Game[];
  addGame: (game: Game) => void;
  joinGame: (gameId: string, playerId: string, color: 'white' | 'black') => void;
  friends: Friendship[];
  addFriend: (playerId: string) => void;
  removeFriend: (playerId: string) => void;
}

export const useGameStore = create<GameState>()(
  persist(
    (set) => ({
      currentPlayer: null,
      setCurrentPlayer: (p) => set({ currentPlayer: p }),
      updatePlayer: (u) => set((s) => ({ currentPlayer: s.currentPlayer ? { ...s.currentPlayer, ...u } : null })),
      games: [],
      addGame: (g) => set((s) => ({ games: [...s.games, g] })),
      joinGame: (gid, pid, c) => set((s) => ({
        games: s.games.map(g => g.id === gid ? { ...g, [c==='white'?'whitePlayer':'blackPlayer']: pid, status: 'active' } : g)
      })),
      friends: [],
      addFriend: (pid) => set((s) => s.currentPlayer ? { friends: [...s.friends, { id: `${Date.now()}`, player1: s.currentPlayer!.id, player2: pid, status: 'pending', createdAt: Date.now() }] } : s),
      removeFriend: (pid) => set((s) => ({ friends: s.friends.filter(f => f.player1 !== pid && f.player2 !== pid) }))
    }),
    { name: 'c4c-store', partialize: (s) => ({ currentPlayer: s.currentPlayer, friends: s.friends }) }
  )
);