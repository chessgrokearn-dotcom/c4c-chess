// apps/api/src/services/match.service.ts
import { v4 as uuidv4 } from 'uuid';

interface Room {
  id: string;
  white: string; // nickname
  black: string | null;
  stake: number;
  timeControl: number;
  fen: string;
}

class MatchService {
  private rooms: Map<string, Room> = new Map();

  createRoom(data: any): Room {
    const roomId = uuidv4();
    const room: Room = {
      id: roomId,
      white: data.nickname || 'Player1',
      black: null,
      stake: data.stakeAmount || 0,
      timeControl: data.timeControl || 600,
      fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
    };
    this.rooms.set(roomId, room);
    return room;
  }

  joinRoom(roomId: string, nickname: string): Room {
    const room = this.rooms.get(roomId);
    if (!room) throw new Error('Room not found');
    if (room.black) throw new Error('Room is full');

    room.black = nickname;
    this.rooms.set(roomId, room);
    return room;
  }

  handleMove(roomId: string, move: any, callback: (fen: string) => void) {
    const room = this.rooms.get(roomId);
    if (!room) return;

    // Здесь должна быть логика chess.js для валидации хода
    // Для простоты просто возвращаем тот же FEN или обновляем его
    // В реальном проекте здесь: game.move(move); callback(game.fen());
    
    console.log(`Move in room ${roomId}:`, move);
    callback(room.fen); 
  }

  getAvailableRooms() {
    const available: any[] = [];
    this.rooms.forEach((room) => {
      if (!room.black) {
        available.push({
          id: room.id,
          white: room.white,
          stake: room.stake,
          timeControl: room.timeControl
        });
      }
    });
    return available;
  }
}

export const matchService = new MatchService();