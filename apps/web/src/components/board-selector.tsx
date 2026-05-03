'use client';
import { BOARD_THEMES, type BoardThemeId } from '@/types';

export function BoardSelector({ value, onChange }: { value: BoardThemeId; onChange: (t: BoardThemeId) => void }) {
  return (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      {(Object.entries(BOARD_THEMES) as [BoardThemeId, typeof BOARD_THEMES[BoardThemeId]][]).map(([id, t]) => (
        <button key={id} onClick={() => onChange(id)} title={t.name}
          style={{ width: '40px', height: '40px', background: `linear-gradient(135deg, ${t.light} 50%, ${t.dark} 50%)`,
            border: value === id ? '3px solid #f59e0b' : '2px solid #374151', borderRadius: '8px', cursor: 'pointer' }} />
      ))}
    </div>
  );
}