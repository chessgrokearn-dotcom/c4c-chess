// apps/web/src/components/chat-box-dynamic.tsx
'use client';

import dynamic from 'next/dynamic';

// 🔥 Загружаем чат ТОЛЬКО на клиенте (предотвращает гидратацию)
const ChatBoxWithNoSSR = dynamic(() => import('./chat-box').then(mod => mod.ChatBox), {
  ssr: false,
  loading: () => null,
});

export function ChatBoxDynamic(props: { playerId: string; opponentId?: string }) {
  // 🔥 Отключаем чат в продакшене, если нет URL чат-сервера
  if (typeof window !== 'undefined') {
    const isVercel = window.location.hostname.includes('vercel.app');
    const hasChatServer = process.env.NEXT_PUBLIC_CHAT_SERVER_URL;
    
    // Если на Vercel и нет чат-сервера — не рендерим чат
    if (isVercel && !hasChatServer) return null;
    
    // Если в Codespaces — тоже не рендерим (нет доступа к localhost:3001)
    const isCodespaces = window.location.hostname.includes('github.dev');
    if (isCodespaces) return null;
  }
  
  return <ChatBoxWithNoSSR {...props} />;
}