// apps/chat-server/index.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors({ origin: '*' }));

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

// Хранилище сообщений (в памяти). Для продакшена замени на MongoDB/PostgreSQL.
const chatRooms = new Map();

io.on('connection', (socket) => {
  console.log('✅ Клиент подключился:', socket.id);

  // 🔹 Присоединение к комнате
  socket.on('chat:join', ({ roomId, playerId }) => {
    socket.join(roomId);
    console.log(`👤 ${playerId} вошёл в комнату: ${roomId}`);
    const history = chatRooms.get(roomId) || [];
    socket.emit('chat:history', history);
  });

  // 🔹 Отправка сообщения
  socket.on('chat:send', ({ roomId, sender, text, timestamp }) => {
    const msg = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      sender,
      text: text.trim(),
      timestamp: timestamp || Date.now()
    };

    if (!chatRooms.has(roomId)) chatRooms.set(roomId, []);
    chatRooms.get(roomId).push(msg);

    // Отправляем всем в комнате
    io.to(roomId).emit('chat:message', msg);
  });

  socket.on('disconnect', () => {
    console.log('❌ Клиент отключился:', socket.id);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🚀 Чат-сервер запущен на http://localhost:${PORT}`);
});