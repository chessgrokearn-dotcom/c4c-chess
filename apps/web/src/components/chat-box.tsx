// apps/web/src/components/chat-box.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { io, type Socket } from 'socket.io-client';

export interface ChatMessage {
  id: string;
  sender: string;
  text: string;
  timestamp: number;
}

interface ChatBoxProps {
  playerId: string;
  opponentId?: string;
}

// 🔥 URL сервера (берём из env или дефолт)
const SOCKET_URL = typeof window !== 'undefined' 
  ? (process.env.NEXT_PUBLIC_CHAT_SERVER_URL || 'http://localhost:3001')
  : '';

export function ChatBox({ playerId, opponentId }: ChatBoxProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);

  // 🔥 Подключение ТОЛЬКО на клиенте (в useEffect)
  useEffect(() => {
    if (typeof window === 'undefined' || !SOCKET_URL) return;
    
    const roomId = opponentId ? [playerId, opponentId].sort().join('_') : 'global-lobby';
    
    socketRef.current = io(SOCKET_URL, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionDelay: 1000,
    });

    const socket = socketRef.current;

    socket.on('connect', () => {
      setIsConnected(true);
      socket.emit('chat:join', { roomId, playerId });
    });

    socket.on('disconnect', () => setIsConnected(false));
    socket.on('chat:history', (history: ChatMessage[]) => setMessages(history));
    socket.on('chat:message', (msg: ChatMessage) => setMessages(prev => [...prev, msg]));

    return () => { socket.disconnect(); };
  }, [playerId, opponentId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim() || !socketRef.current) return;
    const roomId = opponentId ? [playerId, opponentId].sort().join('_') : 'global-lobby';
    socketRef.current.emit('chat:send', {
      roomId, sender: playerId, text: input.trim(), timestamp: Date.now()
    });
    setInput('');
  };

  const formatTime = (ts: number) => new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  if (!isOpen) {
    return (
      <button onClick={() => setIsOpen(true)} style={{ position: 'fixed', bottom: '20px', right: '20px', padding: '12px 20px', background: isConnected ? '#10b981' : '#6b7280', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.3)', zIndex: 1000 }}>
        💬 Чат <span style={{ background: isConnected ? '#22c55e' : '#ef4444', padding: '2px 8px', borderRadius: '10px', fontSize: '10px' }}>{isConnected ? '●' : '○'}</span>
      </button>
    );
  }

  return (
    <div style={{ position: 'fixed', bottom: '20px', right: '20px', width: '320px', height: '400px', background: '#1f2937', border: isConnected ? '1px solid #10b981' : '1px solid #6b7280', borderRadius: '16px', display: 'flex', flexDirection: 'column', boxShadow: '0 8px 32px rgba(0,0,0,0.4)', zIndex: 1000, fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ padding: '12px 16px', background: '#111827', borderBottom: '1px solid #374151', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderRadius: '16px 16px 0 0' }}>
        <span style={{ fontWeight: 600, color: 'white' }}>💬 Чат {isConnected ? '(онлайн)' : '(офлайн)'}</span>
        <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: '#9ca3af', fontSize: '20px', cursor: 'pointer' }}>×</button>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {messages.length === 0 ? <p style={{ color: '#6b7280', textAlign: 'center', fontSize: '13px', marginTop: '40px' }}>Нет сообщений. Начните диалог!</p> : messages.map(msg => (
          <div key={msg.id} style={{ alignSelf: msg.sender === playerId ? 'flex-end' : 'flex-start', background: msg.sender === playerId ? '#3b82f6' : '#374151', color: 'white', padding: '8px 12px', borderRadius: msg.sender === playerId ? '12px 12px 0 12px' : '12px 12px 12px 0', maxWidth: '80%', fontSize: '13px' }}>
            <p style={{ margin: 0, wordBreak: 'break-word' }}>{msg.text}</p>
            <span style={{ fontSize: '10px', opacity: 0.7, display: 'block', marginTop: '4px' }}>{formatTime(msg.timestamp)}</span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div style={{ padding: '12px', background: '#111827', borderTop: '1px solid #374151', display: 'flex', gap: '8px', borderRadius: '0 0 16px 16px' }}>
        <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} placeholder="Введите сообщение..." disabled={!isConnected} style={{ flex: 1, padding: '10px 14px', background: '#1f2937', border: '1px solid #374151', borderRadius: '8px', color: 'white', fontSize: '14px', outline: 'none', opacity: isConnected ? 1 : 0.6 }} />
        <button onClick={handleSend} disabled={!input.trim() || !isConnected} style={{ padding: '10px 16px', background: (input.trim() && isConnected) ? '#10b981' : '#6b7280', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>➤</button>
      </div>
    </div>
  );
}