// apps/web/src/components/chat-box-dynamic.tsx
'use client';

import dynamic from 'next/dynamic';

// 🔥 Загружаем чат ТОЛЬКО на клиенте (предотвращает гидратацию)
const ChatBoxWithNoSSR = dynamic(() => import('./chat-box').then(mod => mod.ChatBox), {
  ssr: false,
  loading: () => null, // Не показывать ничего во время загрузки
});

export function ChatBoxDynamic(props: { playerId: string; opponentId?: string }) {
  // 🔥 Не рендерим чат в Codespaces preview (нет доступа к localhost:3001)
  if (typeof window !== 'undefined') {
    const isCodespaces = window.location.hostname.includes('github.dev');
    if (isCodespaces) return null;
  }
  
  return <ChatBoxWithNoSSR {...props} />;
}