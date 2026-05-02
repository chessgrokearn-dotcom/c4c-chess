// apps/web/src/components/create-game-form.tsx
'use client';

import React, { useState } from 'react';
import { useAccount } from 'wagmi';
import { useGameStore } from '@/lib/game-store';

interface CreateGameFormProps {
  onCreateGame: ( any) => Promise<void> | void;
}

export default function CreateGameForm({ onCreateGame }: CreateGameFormProps) {
  const { address } = useAccount();
  const { 
    nickname, setNickname, 
    matchType, setMatchType, 
    stakeAmount, setStakeAmount, 
    timeControl, setTimeControl,
    setActiveRoom 
  } = useGameStore();

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const finalStake = matchType === "ranked" ? stakeAmount : 0;

      await onCreateGame({
        nickname,
        matchType,
        stakeAmount: finalStake,
        timeControl,
      });

      setActiveRoom({
        id: 'waiting-for-opponent',
        fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        white: address || '',
        black: '',
        stake: finalStake,
        timeControl: timeControl
      });

    } catch (cause) {
      console.error(cause);
      setError(cause instanceof Error ? cause.message : "Failed to create room");
      setActiveRoom(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-gray-800 rounded-lg shadow-xl max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-white mb-6 text-center">Создать игру</h2>
      {error && <div className="mb-4 p-3 bg-red-500/20 border border-red-500 text-red-200 rounded text-sm">{error}</div>}
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Никнейм</label>
          <input type="text" value={nickname} onChange={(e) => setNickname(e.target.value)} className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white" required />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Тип матча</label>
          <select value={matchType} onChange={(e) => setMatchType(e.target.value as 'ranked' | 'friendly')} className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white">
            <option value="ranked">Рейтинговый (со ставкой)</option>
            <option value="friendly">Дружеский</option>
          </select>
        </div>

        {matchType === 'ranked' && (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Ставка (C4C)</label>
            <input type="number" value={stakeAmount} onChange={(e) => setStakeAmount(Number(e.target.value))} className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white" min="50000" step="50000" />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Время (мин)</label>
          <select value={timeControl / 60} onChange={(e) => setTimeControl(Number(e.target.value) * 60)} className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white">
            <option value={5}>5 мин</option>
            <option value={10}>10 мин</option>
            <option value={15}>15 мин</option>
          </select>
        </div>

        <button type="submit" disabled={isSubmitting} className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded font-bold text-white">
          {isSubmitting ? 'Поиск...' : 'Начать игру'}
        </button>
      </div>
    </form>
  );
}