export function formatTime(seconds: number): string {
  if (seconds >= 3600) return `${Math.floor(seconds/3600)}ч ${Math.floor((seconds%3600)/60)}м`;
  return `${Math.floor(seconds/60)}м ${(seconds%60).toString().padStart(2,'0')}с`;
}

export function formatC4C(amount: number): string {
  return (amount / 1_000_000).toFixed(6); // 6 знаков после запятой для C4C
}