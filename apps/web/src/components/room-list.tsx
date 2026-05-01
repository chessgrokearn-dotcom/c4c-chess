// apps/web/src/components/room-list.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { useGameStore } from '@/lib/game-store';
import { getSocket } from '@/lib/socket';
import { RoomSummary } from '@/lib/types';

export function RoomList() {
  const { address } = useAccount();
  const { nickname, rooms, setRooms, setActiveRoom } = useGameStore();
  const [error, setError] = useState("");

  useEffect(() => {
    const socket = getSocket();

    function onRoomsList(nextRooms: RoomSummary[]) {
      setRooms(nextRooms);
    }

    socket.on("rooms:list", onRoomsList);

    return () => {
      socket.off("rooms:list", onRoomsList);
    };
  }, [setRooms]);

  const joinRoom = (roomId: string) => {
    if (!nickname) {
      setError("Пожалуйста, укажите никнейм в настройках или форме создания.");
      return;
    }
    
    const socket = getSocket();
    socket.emit("joinRoom", { roomId, nickname, address });
    
    // Локально переключаемся в режим ожидания (детали комнаты придут от сервера)
    setActiveRoom({
      id: roomId,
      fen: 'start',
      white: address || '',
      black: '',
      stake: 0,
      timeControl: 600
    });
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-4 text-white">Список игр</h2>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      
      <div className="space-y-2">
        {rooms.length === 0 ? (
          <p className="text-gray-400">Нет активных игр. Создайте новую!</p>
        ) : (
          rooms.map((room) => (
            <div key={room.id} className="flex justify-between items-center p-3 bg-gray-800 rounded border border-gray-700">
              <div>
                <span className="font-mono text-blue-400">{room.id.slice(0, 8)}...</span>
                <span className="ml-2 text-sm text-gray-300">Stake: {room.stake}</span>
              </div>
              <button 
                onClick={() => joinRoom(room.id)}
                className="px-4 py-1 bg-green-600 hover:bg-green-700 rounded text-white text-sm"
              >
                Join
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}