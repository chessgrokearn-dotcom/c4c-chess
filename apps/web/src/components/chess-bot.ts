// apps/web/src/components/chess-bot.ts
import { Chess, type Move } from 'chess.js';

// 🔹 Простой бот: приоритет взятий, затем случайный ход
export function getBotMove(game: Chess): Move | null {
  const moves = game.moves({ verbose: true });
  if (moves.length === 0) return null;

  const captures = moves.filter(m => m.captured);
  if (captures.length > 0) {
    return captures[Math.floor(Math.random() * captures.length)];
  }
  return moves[Math.floor(Math.random() * moves.length)];
}

export function isBotTurn(game: Chess): boolean {
  return game.turn() === 'b'; // бот играет за чёрных
}

export function startGameWithBot(): string {
  return new Chess().fen(); // Возвращаем начальную FEN строку
}