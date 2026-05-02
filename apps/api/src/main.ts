// apps/api/src/main.ts
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { LobbyGateway } from './game/lobby.gateway';
import { matchService } from './services/match.service';
import { contractService } from './services/contract.service'; // Убедись, что этот файл существует

const app = express();
app.use(cors());
app.use(express.json());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*", // Разрешить подключения с любого источника (для тестов)
    methods: ["GET", "POST"]
  }
});

// Исправлено: передаем все 3 аргумента
new LobbyGateway(io, matchService, contractService);

const PORT = process.env.PORT || 10000;

httpServer.listen(PORT, () => {
  console.log(`✅ Game server is running on port ${PORT}`);
  console.log(`🔗 WebSocket ready for connections`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});