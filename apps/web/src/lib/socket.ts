// apps/web/src/lib/socket.ts
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export function getSocket() {
  if (!socket) {
    // Берем адрес из переменных окружения или используем локальный для тестов
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
    
    // Socket.IO сам заменит http/https на ws/wss, но мы поможем ему явно
    socket = io(apiUrl, {
      transports: ["websocket"], // Принудительно используем WebSocket (быстрее и стабильнее для игр)
      autoConnect: true,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5
    });

    socket.on("connect", () => {
      console.log("✅ Connected to game server:", socket?.id);
    });

    socket.on("connect_error", (err) => {
      console.error("❌ Connection error:", err.message);
    });
  }

  return socket;
}