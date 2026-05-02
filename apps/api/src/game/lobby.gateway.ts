// apps/api/src/game/lobby.gateway.ts
import { Server, Socket } from 'socket.io';
import { MatchService } from '../services/match.service';
import { ContractService } from '../services/contract.service';

export class LobbyGateway {
  constructor(
    private io: Server,
    private matchService: MatchService,
    private contractService: ContractService
  ) {
    this.setupListeners();
  }

  private setupListeners() {
    this.io.on('connection', (socket: Socket) => {
      console.log(`User connected: ${socket.id}`);

      socket.on('createRoom', async (data) => {
        try {
          const room = this.matchService.createRoom(data);
          socket.join(room.id);
          socket.emit('roomCreated', room);
          this.broadcastLobby();
        } catch (error) {
          socket.emit('error', { message: 'Failed to create room' });
        }
      });

      socket.on('joinRoom', async (data) => {
        try {
          const room = this.matchService.joinRoom(data.roomId, data.nickname);
          socket.join(room.id);
          socket.emit('roomJoined', room);
          this.broadcastLobby();
          
          if (room.black) {
            this.startGame(room.id);
          }
        } catch (error) {
          socket.emit('error', { message: 'Failed to join room' });
        }
      });

      socket.on('makeMove', (data) => {
        this.matchService.handleMove(data.matchId, data.move, (fen: string) => {
          this.io.to(data.matchId).emit('opponentMove', { fen, move: data.move });
        });
      });

      socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
      });
    });
  }

  private broadcastLobby() {
    const rooms = this.matchService.getAvailableRooms();
    this.io.emit('rooms:list', rooms);
  }

  private startGame(roomId: string) {
    console.log(`Game started in room ${roomId}`);
  }
}