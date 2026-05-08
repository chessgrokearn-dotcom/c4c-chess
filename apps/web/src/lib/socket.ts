// apps/web/src/lib/socket.ts
import io, { Socket } from 'socket.io-client';

const SOCKET_SERVER_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:10000';

let socket: Socket | null = null;

/**
 * Инициализирует подключение к WebSocket серверу
 */
export function initializeSocket(): Socket {
  if (socket?.connected) {
    return socket;
  }

  socket = io(SOCKET_SERVER_URL, {
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5,
    transports: ['websocket', 'polling']
  });

  socket.on('connect', () => {
    console.log('[Socket] Connected to game server');
  });

  socket.on('disconnect', () => {
    console.log('[Socket] Disconnected from game server');
  });

  socket.on('error', (error: any) => {
    console.error('[Socket] Error:', error);
  });

  return socket;
}

/**
 * Получает текущее подключение
 */
export function getSocket(): Socket | null {
  return socket;
}

/**
 * Закрывает подключение
 */
export function closeSocket(): void {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

/**
 * Посылает событие создания комнаты на сервер
 */
export async function createRoom(data: {
  address: string;
  nickname: string;
  stake: number;
  timeControl: number;
}): Promise<any> {
  return new Promise((resolve, reject) => {
    const sock = initializeSocket();
    
    sock.emit('createRoom', data, (response: any) => {
      if (response?.error) {
        reject(new Error(response.error));
      } else {
        resolve(response);
      }
    });

    // Слушаем ответ на события
    sock.once('roomCreated', resolve);
    sock.once('error', reject);
  });
}

/**
 * Присоединяется к комнате
 */
export async function joinRoom(data: {
  roomId: string;
  address: string;
  nickname: string;
}): Promise<any> {
  return new Promise((resolve, reject) => {
    const sock = initializeSocket();
    
    sock.emit('joinRoom', data, (response: any) => {
      if (response?.error) {
        reject(new Error(response.error));
      } else {
        resolve(response);
      }
    });

    sock.once('roomJoined', resolve);
    sock.once('gameStarted', resolve);
    sock.once('error', reject);
  });
}

/**
 * Получает список доступных комнат (Лобби)
 */
export async function getLobby(): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const sock = initializeSocket();
    
    sock.emit('getLobby', {});
    
    sock.once('lobbyList', resolve);
    sock.once('error', reject);
  });
}

/**
 * Делает ход в игре
 */
export function makeMove(roomId: string, moveData: {
  fen: string;
  move: string;
}): void {
  const sock = getSocket();
  if (sock?.connected) {
    sock.emit('makeMove', {
      roomId,
      ...moveData
    });
  } else {
    console.error('[Socket] Not connected to server');
  }
}

/**
 * Слушает ходы противника
 */
export function onOpponentMove(callback: (data: any) => void): void {
  const sock = getSocket();
  if (sock) {
    sock.on('opponentMove', callback);
  }
}

/**
 * Удаляет слушатель ходов противника
 */
export function offOpponentMove(callback: (data: any) => void): void {
  const sock = getSocket();
  if (sock) {
    sock.off('opponentMove', callback);
  }
}

/**
 * Слушает начало игры
 */
export function onGameStarted(callback: (data: any) => void): void {
  const sock = getSocket();
  if (sock) {
    sock.on('gameStarted', callback);
  }
}

/**
 * Удаляет слушатель начала игры
 */
export function offGameStarted(callback: (data: any) => void): void {
  const sock = getSocket();
  if (sock) {
    sock.off('gameStarted', callback);
  }
}

/**
 * Слушает завершение игры
 */
export function onGameFinished(callback: (data: any) => void): void {
  const sock = getSocket();
  if (sock) {
    sock.on('gameFinished', callback);
  }
}

/**
 * Удаляет слушатель завершения игры
 */
export function offGameFinished(callback: (data: any) => void): void {
  const sock = getSocket();
  if (sock) {
    sock.off('gameFinished', callback);
  }
}

/**
 * Слушает обновления лобби
 */
export function onLobbyUpdated(callback: (data: any[]) => void): void {
  const sock = getSocket();
  if (sock) {
    sock.on('lobbyUpdated', callback);
  }
}

/**
 * Удаляет слушатель обновлений лобби
 */
export function offLobbyUpdated(callback: (data: any[]) => void): void {
  const sock = getSocket();
  if (sock) {
    sock.off('lobbyUpdated', callback);
  }
}

/**
 * Завершает игру
 */
export function finishGame(roomId: string, data: {
  winner?: string;
  isDraw: boolean;
  reason?: string;
}): void {
  const sock = getSocket();
  if (sock?.connected) {
    sock.emit('finishGame', {
      roomId,
      ...data
    });
  }
}

/**
 * Слушает ошибки от сервера
 */
export function onError(callback: (data: any) => void): void {
  const sock = getSocket();
  if (sock) {
    sock.on('error', callback);
  }
}
