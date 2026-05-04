// 🔹 ПАТЧ 027: Исправление форматирования баланса C4C с разделителями тысяч и ставки
export function formatC4CFixed(a: any): string {
  if (!a) return '0.00';
  // C4C имеет 12 decimals. Делим на 10^12
  const decimals = 12;
  const value = typeof a === 'bigint' ? a : BigInt(a.toString());
  const factor = 10n ** BigInt(decimals);
  const whole = value / factor;
  const frac = value % factor;
  const fracStr = frac.toString().padStart(decimals, '0').slice(0, 2);
  const number = parseFloat(`${whole}.${fracStr}`);
  // Форматируем с разделителями тысяч для русского языка
  return number.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export const STAKE_OPTIONS_FIXED = [
  { label: '10k', value: 10000 },
  { label: '20k', value: 20000 },
  { label: '30k', value: 30000 },
  { label: '40k', value: 40000 },
  { label: '50k', value: 50000 },
  { label: '60k', value: 60000 },
  { label: '70k', value: 70000 },
  { label: '80k', value: 80000 },
  { label: '90k', value: 90000 },
  { label: '100k', value: 100000 },
  { label: '200k', value: 200000 },
  { label: '300k', value: 300000 },
  { label: '400k', value: 400000 },
  { label: '500k', value: 500000 },
  { label: '600k', value: 600000 },
  { label: '700k', value: 700000 },
  { label: '800k', value: 800000 },
  { label: '900k', value: 900000 },
  { label: '1M', value: 1000000 }
] as const;

export const PATCH_027 = { formatC4C: formatC4CFixed, STAKE_OPTIONS: STAKE_OPTIONS_FIXED };