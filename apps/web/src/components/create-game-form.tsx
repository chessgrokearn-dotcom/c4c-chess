// apps/web/src/components/create-game-form.tsx
'use client';

import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import { parseAbi } from 'viem';
import { useGameStore } from '@/lib/game-store';
import { BoardSelector } from './board-selector';
import { LanguageSelector } from './language-selector';
import { STAKE_OPTIONS, type BoardThemeId, type LanguageCode } from '@/types';
import { CONFIG } from '@/lib/config';

const DEPOSIT_ABI = parseAbi(['function depositStake(string gameId, uint256 amount) external']);

export function CreateGameForm({ onClose }: { onClose: () => void }) {
  const { address } = useAccount();
  const { addGame, updatePlayer, currentPlayer } = useGameStore();
  const [time, setTime] = useState(300);
  const [stake, setStake] = useState(50000);
  const [board, setBoard] = useState<BoardThemeId>('classic');
  const [lang, setLang] = useState<LanguageCode>('ru');

  const depRes = useWriteContract();

  const handleCreate = () => {
    if (!address) return;
    const gameId = `g_${Date.now()}_${Math.random().toString(36).slice(2,6)}`;
    addGame({ id: gameId, creatorId: address, whitePlayer: address, timeControl: time, boardTheme: board, stake, status: 'staked', createdAt: Date.now() });
    if (currentPlayer) updatePlayer({ boardTheme: board, language: lang });

    // 🔥 ИСПРАВЛЕНО: конвертируем number → bigint для контракта
    depRes.writeContract({
      address: CONFIG.GAME_CONTRACT_ADDRESS,
      abi: DEPOSIT_ABI,
      functionName: 'depositStake',
      args: [gameId, BigInt(stake)]
    });
  };

  if (depRes.isSuccess) return (
    <div style={{ textAlign: 'center', padding: '40px', color: '#22c55e' }}>
      <h2>✅ Игра создана! Ставка {stake} C4C заблокирована.</h2>
      <button onClick={onClose} style={{ marginTop: '16px', padding: '10px 20px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px' }}>Начать</button>
    </div>
  );

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={onClose}>
      <div style={{ background: '#1f2937', borderRadius: '16px', padding: '24px', maxWidth: '480px', width: '100%' }} onClick={e => e.stopPropagation()}>
        <h3 style={{ marginBottom: '16px', color: 'white' }}>🎮 Создать игру со ставкой</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ color: '#9ca3af', fontSize: '13px' }}>⏱️ Время на партию</label>
            <select value={time} onChange={e => setTime(Number(e.target.value))} style={{ width: '100%', padding: '10px', background: '#374151', color: 'white', border: '1px solid #4b5563', borderRadius: '8px' }}>
              <option value={300}>5 мин</option><option value={900}>15 мин</option><option value={1800}>30 мин</option><option value={3600}>1 час</option>
            </select>
          </div>
          <div>
            <label style={{ color: '#9ca3af', fontSize: '13px' }}>💰 Ставка (от 50 000 до 1 000 000)</label>
            <select value={stake} onChange={e => setStake(Number(e.target.value))} style={{ width: '100%', padding: '10px', background: '#374151', color: 'white', border: '1px solid #4b5563', borderRadius: '8px' }}>
              {STAKE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
          <BoardSelector value={board} onChange={setBoard} />
          <LanguageSelector value={lang} onChange={setLang} />
          <button onClick={handleCreate} disabled={!address || depRes.isPending}
            style={{ padding: '14px', background: '#10b981', color: 'white', border: 'none', borderRadius: '10px', fontWeight: '600', cursor: 'pointer' }}>
            {depRes.isPending ? '⏳ Депозит...' : `🔒 Внести ${stake.toLocaleString()} и начать`}
          </button>
          <button onClick={onClose} style={{ padding: '12px', background: '#6b7280', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>Отмена</button>
        </div>
      </div>
    </div>
  );
}