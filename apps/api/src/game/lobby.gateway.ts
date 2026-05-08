// apps/api/src/game/lobby.gateway.ts
import { Server, Socket } from 'socket.io';
import { MatchService } from '../services/match.service';
import { ContractService } from '../services/contract.service';
import { isValidStake } from '../config/stake.config';

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
      console.log(`[LobbyGateway] User connected: ${socket.id}`);

      // Создание новой игровой комнаты
      socket.on('createRoom', async (data) => {
        try {
          console.log(`[LobbyGateway] createRoom event:`, data);

          // Валидация ставки
          if (!isValidStake(data.stake)) {
            return socket.emit('error', { message: 'Invalid stake amount' });
          }

          // Проверка баланса и аппрува
          const verified = await this.contractService.verifyStake(data.address, data.stake);
          if (!verified) {
            return socket.emit('error', { message: 'Insufficient balance or allowance' });
          }

          const room = this.matchService.createRoom({
            address: data.address,
            socketId: socket.id,
            nickname: data.nickname,
            stake: data.stake,
            timeControl: data.timeControl
          });

          socket.join(room.id);
          socket.emit('roomCreated', {
            roomId: room.id,
            white: room.white?.nickname,
            stake: room.stake,
            timeControl: room.timeControl
          });

          this.broadcastLobby();
        } catch (error) {
          console.error(`[LobbyGateway] Error in createRoom:`, error);
          socket.emit('error', { message: 'Failed to create room' });
        }
      });

      // Присоединение к комнате
      socket.on('joinRoom', async (data) => {
        try {
          console.log(`[LobbyGateway] joinRoom event:`, data);

          const room = this.matchService.getRoomInfo(data.roomId);
          if (!room) {
            return socket.emit('error', { message: 'Room not found' });
          }

          // Валидация ставки
          if (!isValidStake(room.stake)) {
            return socket.emit('error', { message: 'Invalid room stake' });
          }

          // Проверка баланса
          const verified = await this.contractService.verifyStake(data.address, room.stake);
          if (!verified) {
            return socket.emit('error', { message: 'Insufficient balance' });
          }

          const updatedRoom = this.matchService.joinRoom(data.roomId, {
            address: data.address,
            socketId: socket.id,
            nickname: data.nickname
          });

          socket.join(data.roomId);
          socket.emit('roomJoined', {
            roomId: updatedRoom.id,
            white: updatedRoom.white?.nickname,
            black: updatedRoom.black?.nickname,
            stake: updatedRoom.stake,
            timeControl: updatedRoom.timeControl,
            status: updatedRoom.status
          });

          // Отправляем уведомление обоим игрокам о начале игры
          this.io.to(data.roomId).emit('gameStarted', {
            roomId: updatedRoom.id,
            whiteAddress: updatedRoom.white?.address,
            blackAddress: updatedRoom.black?.address,
            whiteNickname: updatedRoom.white?.nickname,
            blackNickname: updatedRoom.black?.nickname,
            fen: updatedRoom.fen,
            stake: updatedRoom.stake,
            timeControl: updatedRoom.timeControl
          });

          this.broadcastLobby();
        } catch (error) {
          console.error(`[LobbyGateway] Error in joinRoom:`, error);
          socket.emit('error', { message: 'Failed to join room' });
        }
      });

      // Ход в игре
      socket.on('makeMove', (data) => {
        try {
          const result = this.matchService.handleMove(data.roomId, {
            fen: data.fen,
            move: data.move
          });

          if (result.success) {
            // Отправляем ход противнику
            socket.to(data.roomId).emit('opponentMove', {
              fen: result.fen,
              move: result.move
            });
          } else {
            socket.emit('error', { message: 'Invalid move' });
          }
        } catch (error) {
          console.error(`[LobbyGateway] Error in makeMove:`, error);
          socket.emit('error', { message: 'Failed to make move' });
        }
      });

      // Завершение игры
      socket.on('finishGame', async (data) => {
        try {
          const room = this.matchService.getRoomInfo(data.roomId);
          if (!room) return;

          // Записываем результат в контракт
          if (data.winner) {
            const loser = data.winner === room.white?.address ? room.black?.address : room.white?.address;
            await this.contractService.recordGameResult(data.roomId, data.winner, loser || '', room.stake);
          }

          this.matchService.finishGame(data.roomId, data.winner, data.isDraw);

          // Отправляем результат обоим игрокам
          this.io.to(data.roomId).emit('gameFinished', {
            roomId: data.roomId,
            winner: data.winner,
            isDraw: data.isDraw,
            reason: data.reason
          });

          this.broadcastLobby();
        } catch (error) {
          console.error(`[LobbyGateway] Error in finishGame:`, error);
          socket.emit('error', { message: 'Failed to finish game' });
        }
      });

      // Запрос списка доступных комнат (Лобби)
      socket.on('getLobby', () => {
        const rooms = this.matchService.getAvailableRooms();
        socket.emit('lobbyList', rooms);
      });

      // Отключение игрока
      socket.on('disconnect', () => {
        console.log(`[LobbyGateway] User disconnected: ${socket.id}`);
        this.matchService.leaveRoom(socket.id);
        this.broadcastLobby();
      });
    });
  }

  private broadcastLobby() {
    const rooms = this.matchService.getAvailableRooms();
    this.io.emit('lobbyUpdated', rooms);
  }
}