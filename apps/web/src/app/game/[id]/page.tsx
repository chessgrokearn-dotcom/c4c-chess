'use client'

import { formatTime } from '@/lib/config'

interface GamePageProps {
  params: { id: string }
}

export default function GamePage({ params }: GamePageProps) {
  return (
    <div style={{minHeight:'100vh',background:'var(--bg)',color:'var(--text)',padding:20}}>
      <div style={{maxWidth:700,margin:'0 auto',background:'var(--card)',padding:24,borderRadius:16}}>
        <h1 style={{marginBottom:12}}>♟️ Игра {params.id.slice(0, 8)}...</h1>
        <p style={{opacity:0.8,marginBottom:16}}>Вы перенаправлены на доску игры. Игра началась автоматически, когда оба игрока были онлайн.</p>
        <div style={{padding:16,background:'rgba(255,255,255,0.06)',borderRadius:12}}>
          <p style={{marginBottom:8}}>🕹️ Статус: Игра запущена</p>
          <p style={{marginBottom:8}}>⏱️ Таймконтроль: {formatTime(900)}</p>
          <p style={{marginBottom:8}}>💰 Ставка: 5 000 C4C</p>
          <p style={{marginBottom:0,fontSize:12,opacity:0.7}}>Здесь будет игровая доска и логика завершения партии.</p>
        </div>
      </div>
    </div>
  )
}
