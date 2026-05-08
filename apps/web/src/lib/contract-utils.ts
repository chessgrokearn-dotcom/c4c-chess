// apps/web/src/lib/contract-utils.ts

/**
 * Конфигурация ставок (синхронизирована с backend)
 */
export const STAKE_CONFIG = {
  MIN_STAKE: 50000,
  MAX_STAKE: 1000000,
  STAKE_STEP: 50000,
  TOKEN_ADDRESS: '0xaac20575371de01b4d10c4e7566d5453d72d56e7',
  GAME_CONTRACT_ADDRESS: '0xCf5E5d01ADd5e2Ba62B2f6747E5CFC43e36D5005'
};

/**
 * Валидирует размер ставки согласно конфигу
 */
export function isValidStake(amount: number): boolean {
  if (amount < STAKE_CONFIG.MIN_STAKE || amount > STAKE_CONFIG.MAX_STAKE) {
    return false;
  }
  return (amount - STAKE_CONFIG.MIN_STAKE) % STAKE_CONFIG.STAKE_STEP === 0;
}

/**
 * Возвращает массив допустимых ставок
 */
export function getValidStakes(): number[] {
  const stakes: number[] = [];
  for (let i = STAKE_CONFIG.MIN_STAKE; i <= STAKE_CONFIG.MAX_STAKE; i += STAKE_CONFIG.STAKE_STEP) {
    stakes.push(i);
  }
  return stakes;
}

/**
 * Форматирует ставку в строку для отображения
 */
export function formatStake(amount: number): string {
  return amount.toLocaleString('en-US');
}

/**
 * Форматирует C4C токены с разделителями
 */
export function formatC4C(value: bigint): string {
  const decimal = 18; // C4C имеет 18 decimals
  const divisor = BigInt(10) ** BigInt(decimal);
  const wholePart = value / divisor;
  const fractionalPart = value % divisor;
  
  const fractionalStr = fractionalPart
    .toString()
    .padStart(decimal, '0')
    .replace(/0+$/, '');
  
  if (fractionalStr) {
    return `${wholePart.toString()}.${fractionalStr}`;
  }
  return wholePart.toString();
}

/**
 * Конвертирует строку в wei (для отправки на контракт)
 */
export function parseC4C(amount: string): bigint {
  const decimal = 18;
  const divisor = BigInt(10) ** BigInt(decimal);
  
  const parts = amount.split('.');
  const wholePart = BigInt(parts[0] || '0');
  const fractionalPart = parts[1]?.padEnd(decimal, '0') || '0'.padEnd(decimal, '0');
  
  return wholePart * divisor + BigInt(fractionalPart.substring(0, decimal));
}

/**
 * Получает минимальный размер ставки
 */
export function getMinStake(): number {
  return STAKE_CONFIG.MIN_STAKE;
}

/**
 * Получает максимальный размер ставки
 */
export function getMaxStake(): number {
  return STAKE_CONFIG.MAX_STAKE;
}

/**
 * Получает шаг ставки
 */
export function getStakeStep(): number {
  return STAKE_CONFIG.STAKE_STEP;
}

/**
 * Проверяет, достаточно ли баланса для ставки
 */
export function canAffordStake(balance: bigint, stake: number): boolean {
  const stakeWei = parseC4C(stake.toString());
  return balance >= stakeWei;
}

/**
 * Форматирует адрес кошелька (сокращённо)
 */
export function formatAddress(address: string, chars: number = 4): string {
  if (!address || address.length < 2 * chars + 2) {
    return address;
  }
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

/**
 * Валидирует адрес кошелька
 */
export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * ABI для C4C токена (ERC20)
 */
export const C4C_TOKEN_ABI = [
  {
    constant: true,
    inputs: [{ name: '_owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: 'balance', type: 'uint256' }],
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      { name: '_spender', type: 'address' },
      { name: '_value', type: 'uint256' }
    ],
    name: 'approve',
    outputs: [{ name: '', type: 'bool' }],
    type: 'function'
  },
  {
    constant: true,
    inputs: [
      { name: '_owner', type: 'address' },
      { name: '_spender', type: 'address' }
    ],
    name: 'allowance',
    outputs: [{ name: '', type: 'uint256' }],
    type: 'function'
  }
] as const;

/**
 * ABI для Game контракта (минимальный)
 */
export const GAME_CONTRACT_ABI = [
  {
    inputs: [
      { internalType: 'bytes32', name: 'gameId', type: 'bytes32' },
      { internalType: 'uint256', name: 'stake', type: 'uint256' },
      { internalType: 'uint256', name: 'timeLimit', type: 'uint256' }
    ],
    name: 'createGame',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'bytes32', name: 'gameId', type: 'bytes32' }],
    name: 'depositStake',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'bytes32', name: 'gameId', type: 'bytes32' },
      { internalType: 'address', name: 'winner', type: 'address' },
      { internalType: 'bool', name: 'isDraw', type: 'bool' }
    ],
    name: 'finishGame',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  }
] as const;

