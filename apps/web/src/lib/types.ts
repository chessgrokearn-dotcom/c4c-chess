// apps/web/src/lib/types.ts

export interface RoomSummary {
  id: string;
  white: string;
  stake: number;
  timeControl: number; // Время в секундах
}

export interface MatchDetails extends RoomSummary {
  fen: string;
  black: string;
}

export interface GameState {
  activeRoom: MatchDetails | null;
  setActiveRoom: (room: MatchDetails | null | ((prev: MatchDetails | null) => MatchDetails | null)) => void;
  
  isPlayerTurn: boolean;
  setIsPlayerTurn: (turn: boolean) => void;
  
  userAddress: string | null;
  setUserAddress: (address: string | null) => void;

  nickname: string;
  setNickname: (name: string) => void;
  
  matchType: 'ranked' | 'friendly';
  setMatchType: (type: 'ranked' | 'friendly') => void;
  
  stakeAmount: number;
  setStakeAmount: (amount: number) => void;
  
  timeControl: number;
  setTimeControl: (time: number) => void;

  rooms: RoomSummary[];
  setRooms: (rooms: RoomSummary[]) => void;
}