'use client';
import { useAccount } from 'wagmi';
import { useGameStore } from '@/lib/game-store';
import { formatTime } from '@/lib/utils';

export function GameLobby() {
  const { address } = useAccount();
  const { games, joinGame } = useGameStore();
  const available = games.filter(g => g.status === 'waiting' && g.creatorId !== address);

  if (available.length === 0) return <p style={{ color: '#6b7280', textAlign: 'center' }}>Нет открытых игр. Создайте свою!</p>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {available.map(g => (
        <div key={g.id} style={{ padding: '16px', background: '#1f2937', borderRadius: '12px', border: '1px solid #374151', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ fontWeight: '600', color: 'white' }}>#{g.id.slice(-6)}</p>
            <p style={{ fontSize: '13px', color: '#9ca3af' }}>⏱️ {formatTime(g.timeControl)} • 🎨 {g.boardTheme}</p>
          </div>
          <button onClick={() => joinGame(g.id, address || '', 'black')} disabled={!address}
            style={{ padding: '8px 16px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', cursor: address ? 'pointer' : 'not-allowed' }}>▶️</button>
        </div>
      ))}
    </div>
  );
}