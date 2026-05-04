// 🔹 ПАТЧ 027: Исправление форматирования баланса C4C с разделителями тысяч
export function formatC4CFixed(a: any): string {
  if (!a) return '0.00';
  // C4C имеет 6 decimals. Делим на 10^6
  const decimals = 6;
  const value = typeof a === 'bigint' ? a : BigInt(a.toString());
  const factor = 10n ** BigInt(decimals);
  const whole = value / factor;
  const frac = value % factor;
  const fracStr = frac.toString().padStart(decimals, '0').slice(0, 2);
  const number = parseFloat(`${whole}.${fracStr}`);
  // Форматируем с разделителями тысяч для русского языка
  return number.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export const PATCH_027 = { formatC4C: formatC4CFixed };