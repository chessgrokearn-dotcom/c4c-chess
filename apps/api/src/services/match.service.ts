// apps/api/src/services/match.service.ts
import { v4 as uuidv4 } from 'uuid';

interface Player {
  address: string;
  socketId: string;
  nickname: string;
}

interface Room {
  id: string;
  white: Player | null;
  black: Player | null;
  stake: number;
  timeControl: number;
  fen: string;
  status: 'waiting' | 'active' | 'finished';
  createdAt: number;
  moves: string[];
}

export class MatchService {
  private rooms: Map<string, Room> = new Map();
  private playerToRoom: Map<string, string> = new Map(); // Maps socket ID to room ID
  private waitingQueues: Map<number, Player[]> = new Map(); // Queue by stake

  createRoom(data: any): Room {
    const roomId = uuidv4();
    const room: Room = {
      id: roomId,
      white: data.address ? {
        address: data.address,
        socketId: data.socketId,
        nickname: data.nickname || 'Player1'
      } : null,
      black: null,
      stake: data.stake || 50000,
      timeControl: data.timeControl || 600,
      fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
      status: 'waiting',
      createdAt: Date.now(),
      moves: []
    };
    this.rooms.set(roomId, room);
    if (data.socketId) {
      this.playerToRoom.set(data.socketId, roomId);
    }
    console.log(`[MatchService] Room created: ${roomId} by ${data.address}`);
    return room;
  }

  joinRoom(roomId: string, player: Player): Room {
    const room = this.rooms.get(roomId);
    if (!room) throw new Error('Room not found');
    if (room.black) throw new Error('Room is full');
    if (room.white?.address === player.address) throw new Error('Cannot join own room');

    room.black = player;
    this.playerToRoom.set(player.socketId, roomId);
    room.status = 'active';
    this.rooms.set(roomId, room);
    
    console.log(`[MatchService] Player ${player.address} joined room ${roomId}`);
    return room;
  }

  handleMove(roomId: string, moveData: any): { success: boolean; fen: string; move: string } {
    const room = this.rooms.get(roomId);
    if (!room) return { success: false, fen: '', move: '' };

    try {
      // TODO: Validate move using chess.js in real implementation
      room.fen = moveData.fen;
      room.moves.push(moveData.move);
      this.rooms.set(roomId, room);
      
      return { success: true, fen: room.fen, move: moveData.move };
    } catch (error) {
      console.error(`[MatchService] Error handling move:`, error);
      return { success: false, fen: room.fen, move: '' };
    }
  }

  getAvailableRooms(): any[] {
    const available: any[] = [];
    this.rooms.forEach((room) => {
      if (room.status === 'waiting' && !room.black) {
        available.push({
          id: room.id,
          white: room.white?.nickname,
          whiteAddress: room.white?.address,
          stake: room.stake,
          timeControl: room.timeControl,
          createdAt: room.createdAt
        });
      }
    });
    return available;
  }

  getRoomInfo(roomId: string): Room | null {
    return this.rooms.get(roomId) || null;
  }

  leaveRoom(socketId: string): void {
    const roomId = this.playerToRoom.get(socketId);
    if (!roomId) return;

    const room = this.rooms.get(roomId);
    if (!room) return;

    if (room.white?.socketId === socketId) {
      room.white = null;
    }
    if (room.black?.socketId === socketId) {
      room.black = null;
    }

    // Если комната пуста или только 1 игрок, помечаем как завершённую
    if (!room.white && !room.black) {
      room.status = 'finished';
    }

    this.playerToRoom.delete(socketId);
    this.rooms.set(roomId, room);
    console.log(`[MatchService] Player left room ${roomId}`);
  }

  finishGame(roomId: string, winner: string | null, isDraw: boolean = false): boolean {
    const room = this.rooms.get(roomId);
    if (!room) return false;

    room.status = 'finished';
    this.rooms.set(roomId, room);
    
    console.log(`[MatchService] Game finished: roomId=${roomId}, winner=${winner}, draw=${isDraw}`);
    return true;
  }

  getAllRooms(): Room[] {
    return Array.from(this.rooms.values());
  }
}

export const matchService = new MatchService();