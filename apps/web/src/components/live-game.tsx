// apps/web/src/components/live-game.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Chess } from 'chess.js';
import { Chessboard } from 'react-chessboard';
import { getSocket } from '@/lib/socket';
import { useGameStore } from '@/lib/game-store';

export default function LiveGame() {
  const { activeRoom, setActiveRoom, isPlayerTurn } = useGameStore();
  const [game, setGame] = useState<Chess | null>(null);
  const [socket, setSocket] = useState<any>(null);

  useEffect(() => {
    setGame(new Chess());
    const s = getSocket();
    setSocket(s);

    s.on('opponentMove', (move: any) => {
      if (game) {
        game.move(move);
        setGame(new Chess(game.fen()));
        setActiveRoom((prev) => prev ? { ...prev, fen: game.fen() } : null);
      }
    });

    return () => { s.off('opponentMove'); };
  }, [game, setActiveRoom]);

  const onDrop = (sourceSquare: string, targetSquare: string, piece: any) => {
    if (!game || !isPlayerTurn) return false;
    try {
      const move = game.move({ from: sourceSquare, to: targetSquare, promotion: 'q' });
      if (move === null) return false;
      if (socket && activeRoom?.id) {
        socket.emit('makeMove', { matchId: activeRoom.id, move: { from: sourceSquare, to: targetSquare, promotion: 'q' } });
      }
      setGame(new Chess(game.fen()));
      setActiveRoom((prev) => prev ? { ...prev, fen: game.fen() } : null);
      return true;
    } catch (error) { return false; }
  };

  if (!activeRoom) return <div className="p-4 text-center text-white">Нет активной партии</div>;

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <h2 className="text-2xl font-bold mb-4 text-white">Партия #{activeRoom.id.slice(0, 8)}</h2>
      <div className="border-4 border-gray-700 rounded-lg overflow-hidden">
        <Chessboard position={activeRoom.fen || 'start'} onPieceDrop={onDrop} boardWidth={500} />
      </div>
      <div className="mt-4 text-lg text-white">
        {isPlayerTurn ? <span className="text-green-500 font-bold">Ваш ход!</span> : <span>Ход соперника...</span>}
      </div>
    </div>
  );
}