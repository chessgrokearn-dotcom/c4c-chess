// apps/web/src/components/create-game-form.tsx
'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { useGameStore } from '@/lib/game-store';
import { STAKE_CONFIG, TIME_CONFIG, BSC_CHAIN_ID } from '@/lib/config'; // 🔥 ДОБАВЛЕНО

export function CreateGameForm() {
  const { address } = useAccount();
  const { 
    nickname, setNickname, 
    draftStake, setDraftStake, 
    draftTimeLimit, setDraftTimeLimit 
  } = useGameStore();
  
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async () => {
    if (!address) {
      setError('Please connect wallet first');
      return;
    }
    if (!nickname.trim()) {
      setError('Please enter a nickname');
      return;
    }
    
    setIsCreating(true);
    setError(null);
    
    try {
      // 🔥 Здесь будет вызов смарт-контракта
      console.log('Creating game:', { 
        creator: address,
        nickname: nickname.trim(),
        stake: draftStake,
        timeLimit: draftTimeLimit,
        chainId: BSC_CHAIN_ID, // 🔥 Теперь работает
      });
      
      // Имитация задержки (удалить при интеграции контракта)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      alert('Game created successfully! (demo)');
    } catch (err: any) {
      console.error('Create error:', err);
      setError(err?.message || 'Failed to create game');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="p-6 bg-gray-800 rounded-xl border border-gray-700 space-y-6">
      <h2 className="text-xl font-bold text-white">Create Ranked Game</h2>
      
      {/* Никнейм */}
      <div>
        <label className="block text-sm text-gray-300 mb-2">Your Nickname</label>
        <input 
          className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 outline-none text-white placeholder-gray-400"
          placeholder="Enter your chess name" 
          value={nickname} 
          onChange={e => setNickname(e.target.value)} 
          maxLength={20}
        />
        <p className="text-xs text-gray-500 mt-1">{nickname.length}/20</p>
      </div>
      
      {/* Ставка */}
      <div>
        <label className="block text-sm text-gray-300 mb-2">Stake (C4C Tokens)</label>
        
        {/* Быстрые кнопки */}
        <div className="flex flex-wrap gap-2 mb-3">
          {STAKE_CONFIG.OPTIONS.map(amount => (
            <button
              key={amount}
              type="button"
              onClick={() => setDraftStake(amount)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                draftStake === amount 
                  ? 'bg-yellow-600 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {(amount / 1000).toFixed(0)}K
            </button>
          ))}
        </div>
        
        {/* Слайдер */}
        <input
          type="range"
          min={STAKE_CONFIG.MIN}
          max={STAKE_CONFIG.MAX}
          step={STAKE_CONFIG.STEP}
          value={draftStake}
          onChange={(e) => setDraftStake(Number(e.target.value))}
          className="w-full accent-yellow-500 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
        />
        
        {/* Отображение значения */}
        <p className="text-center text-yellow-400 font-bold text-lg mt-2">
          {(draftStake / 1000).toFixed(1)}K C4C
        </p>
      </div>
      
      {/* Время */}
      <div>
        <label className="block text-sm text-gray-300 mb-2">Time Control</label>
        <div className="grid grid-cols-3 gap-3">
          {TIME_CONFIG.OPTIONS.map(seconds => (
            <button
              key={seconds}
              type="button"
              onClick={() => setDraftTimeLimit(seconds)}
              className={`py-2.5 px-3 rounded-lg text-sm font-medium transition ${
                draftTimeLimit === seconds 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {seconds / 60} min
            </button>
          ))}
        </div>
      </div>
      
      {/* Ошибка */}
      {error && (
        <p className="text-red-400 text-sm bg-red-900/30 p-3 rounded-lg">
          {error}
        </p>
      )}
      
      {/* Кнопка создания */}
      <button
        onClick={handleCreate}
        disabled={isCreating || !address || !nickname.trim()}
        className="w-full py-3.5 bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-500 hover:to-yellow-600 disabled:from-gray-600 disabled:to-gray-700 rounded-lg font-bold text-white transition-all flex items-center justify-center gap-2"
      >
        {isCreating ? (
          <>
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Creating...
          </>
        ) : (
          'Create Ranked Game'
        )}
      </button>
    </div>
  );
}