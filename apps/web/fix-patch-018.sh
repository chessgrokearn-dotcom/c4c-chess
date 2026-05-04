#!/bin/bash
# 🔥 FIX: Конвертирует config-patch-018.ts под wagmi v2

FILE="/workspaces/c4c-chess/apps/web/src/lib/config-patch-018.ts"

if [ ! -f "$FILE" ]; then
  echo "❌ Файл не найден: $FILE"
  exit 1
fi

# 🔹 Исправляем useApproveC4C
sed -i 's/const { writeContract,  txHash,/const { writeContract,  txHash,/g' "$FILE"
sed -i 's/const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash: txHash as `0x\${string}` });/const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash: txHash as `0x\${string}` });/g' "$FILE"

# 🔹 Исправляем useCreateTokenGame
sed -i '/export function useCreateTokenGame/,/^}/s/const { writeContract,  txHash,/const { writeContract,  txHash,/g' "$FILE"

# 🔹 Исправляем useJoinTokenGame, useClaimWinnings аналогично
sed -i '/export function useJoinTokenGame/,/^}/s/const { writeContract,  txHash,/const { writeContract,  txHash,/g' "$FILE"
sed -i '/export function useClaimWinnings/,/^}/s/const { writeContract,  txHash,/const { writeContract,  txHash,/g' "$FILE"

# 🔹 Исправляем useGameBalance (безопасная индексация)
sed -i '/export function useGameBalance/,/^}/s/return { balance: data?.\[5\] ? fromWei(data\[5\] as bigint) : .*/  const dataAsArray = data as any;\n  const balanceValue = dataAsArray?.[6] as bigint | undefined;\n  return { balance: fromWei(balanceValue), isLoading };/' "$FILE"

echo "✅ config-patch-018.ts обновлён под wagmi v2"
