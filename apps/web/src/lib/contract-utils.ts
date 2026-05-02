// apps/web/src/lib/contract-utils.ts
import { keccak256, toBytes } from "viem";

export function toGameId(roomId: string): string {
  // Простая хеш-функция для превращения ID комнаты в bytes32 для контракта
  return keccak256(toBytes(roomId));
}