// apps/web/src/components/chat-box.tsx
'use client';

import { useState, useEffect, useRef } from 'react';

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

export function ChatBox({ playerId, opponentId }: ChatBoxProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 🔥 Загрузка только на клиенте (предотвращает ошибку гидратации)
  useEffect(() => {
    if (opponentId) {
      const chatKey = `chat_${[playerId, opponentId].sort().join('_')}`;
      const saved = localStorage.getItem(chatKey);
      if (saved) {
        try { setMessages(JSON.parse(saved)); } catch {}
      }
    }
  }, [playerId, opponentId]);

  // Сохранение при изменении
  useEffect(() => {
    if (messages.length > 0 && opponentId) {
      const chatKey = `chat_${[playerId, opponentId].sort().join('_')}`;
      localStorage.setItem(chatKey, JSON.stringify(messages));
    }
  }, [messages, playerId, opponentId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    const newMessage: ChatMessage = {
      id: `${Date.now()}_${Math.random().toString(36).slice(2)}`,
      sender: playerId,
      text: input.trim(),
      timestamp: Date.now(),
    };
    setMessages(prev => [...prev, newMessage]);
    setInput('');
  };

  const formatTime = (ts: number) => new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  if (!isOpen) {
    return (
      <button onClick={() => setIsOpen(true)} style={{ position: 'fixed', bottom: '20px', right: '20px', padding: '12px 20px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(59,130,246,0.4)', zIndex: 1000 }}>
        💬 Чат {opponentId && <span style={{ background: '#ef4444', padding: '2px 8px', borderRadius: '10px', fontSize: '12px' }}>●</span>}
      </button>
    );
  }

  return (
    <div style={{ position: 'fixed', bottom: '20px', right: '20px', width: '320px', height: '400px', background: '#1f2937', border: '1px solid #374151', borderRadius: '16px', display: 'flex', flexDirection: 'column', boxShadow: '0 8px 32px rgba(0,0,0,0.4)', zIndex: 1000, fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ padding: '12px 16px', background: '#111827', borderBottom: '1px solid #374151', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderRadius: '16px 16px 0 0' }}>
        <span style={{ fontWeight: 600, color: 'white' }}>💬 Чат {opponentId ? `с ${opponentId.slice(0,6)}...` : '(гость)'}</span>
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
        <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} placeholder="Введите сообщение..." style={{ flex: 1, padding: '10px 14px', background: '#1f2937', border: '1px solid #374151', borderRadius: '8px', color: 'white', fontSize: '14px', outline: 'none' }} />
        <button onClick={handleSend} disabled={!input.trim()} style={{ padding: '10px 16px', background: input.trim() ? '#10b981' : '#6b7280', color: 'white', border: 'none', borderRadius: '8px', cursor: input.trim() ? 'pointer' : 'not-allowed', fontWeight: 600 }}>➤</button>
      </div>
    </div>
  );
}