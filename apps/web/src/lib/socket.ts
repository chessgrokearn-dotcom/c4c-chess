// apps/web/src/lib/socket.ts
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export function getSocket() {
  if (!socket) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
    
    socket = io(apiUrl, {
      transports: ["websocket"],
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