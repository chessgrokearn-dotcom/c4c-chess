// apps/api/src/main.ts
import { createServer } from 'http';
import { Server } from 'socket.io';
import { LobbyGateway } from './game/lobby.gateway';

const PORT = process.env.PORT || 3001;

const httpServer = createServer();

// Настройка WebSocket сервера
const io = new Server(httpServer, {
  cors: {
    // Разрешаем подключения с любого источника (для разработки и деплоя)
    // В продакшене лучше указать конкретный домен Vercel: origin: "https://your-app.vercel.app"
    origin: "*", 
    methods: ["GET", "POST"],
    credentials: true
  },
  pingTimeout: 60000, // Таймаут пинга для стабильности
  pingInterval: 25000
});

// Инициализируем гейтвей (логика игры)
new LobbyGateway(io);

httpServer.listen(PORT, () => {
  console.log(`✅ Game server is running on port ${PORT}`);
  console.log(`🔗 WebSocket ready for connections`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});