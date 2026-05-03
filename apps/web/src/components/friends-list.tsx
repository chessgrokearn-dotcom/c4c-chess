'use client';
import { useState } from 'react';
import { useAccount } from 'wagmi';
import { useGameStore } from '@/lib/game-store';

export function FriendsList() {
  const { address } = useAccount();
  const { friends, addFriend, removeFriend } = useGameStore();
  const [newId, setNewId] = useState('');
  
  const myFriends = friends.filter(f => f.player1 === address || f.player2 === address);
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{ display: 'flex', gap: '8px' }}>
        <input value={newId} onChange={e => setNewId(e.target.value)} placeholder="Адрес или ID друга" style={{ flex: 1, padding: '10px', background: '#374151', color: 'white', border: '1px solid #4b5563', borderRadius: '8px' }} />
        <button onClick={() => { if(newId) { addFriend(newId); setNewId(''); } }} style={{ padding: '10px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>➕</button>
      </div>
      {myFriends.length === 0 ? <p style={{ color: '#6b7280' }}>Друзей пока нет</p> :
        myFriends.map(f => {
          const fid = f.player1 === address ? f.player2 : f.player1;
          return (
            <div key={f.id} style={{ padding: '10px', background: '#1f2937', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: 'monospace', fontSize: '13px', color: '#22c55e' }}>{fid.slice(0,10)}...{fid.slice(-6)}</span>
              <button onClick={() => removeFriend(fid)} style={{ padding: '4px 8px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', fontSize: '12px', cursor: 'pointer' }}>Удалить</button>
            </div>
          )
        })}
    </div>
  );
}