'use client';
import { LANGUAGES, type LanguageCode } from '@/types';

export function LanguageSelector({ value, onChange }: { value: LanguageCode; onChange: (l: LanguageCode) => void }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value as LanguageCode)}
      style={{ width: '100%', padding: '10px', background: '#374151', color: 'white', border: '1px solid #4b5563', borderRadius: '8px' }}>
      {(Object.entries(LANGUAGES) as [LanguageCode, typeof LANGUAGES[LanguageCode]][]).map(([c, l]) => (
        <option key={c} value={c}>{l.flag} {l.name}</option>
      ))}
    </select>
  );
}