'use client';
import { useWriteContract } from 'wagmi';
import { parseAbi } from 'viem';
import { CONFIG } from '@/lib/config';
import { formatC4C } from '@/lib/utils';

const CLAIM_ABI = parseAbi(['function claimWinnings(string gameId) external']);

export function ClaimWinnings({ gameId, stake }: { gameId: string; stake: number }) {
  const claimRes = useWriteContract();

  const handleClaim = () => {
    claimRes.writeContract({
      address: CONFIG.GAME_CONTRACT_ADDRESS,
      abi: CLAIM_ABI,
      functionName: 'claimWinnings',
      args: [gameId]
    });
  };

  if (claimRes.isSuccess) return <p style={{ color: '#22c55e', textAlign: 'center', fontWeight: 'bold', marginTop: '12px' }}>✅ Выигрыш выведен на кошелёк!</p>;

  return (
    <button onClick={handleClaim} disabled={claimRes.isPending}
      style={{ width: '100%', padding: '14px', background: '#f59e0b', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: claimRes.isPending ? 'not-allowed' : 'pointer', marginTop: '12px', fontSize: '16px' }}>
      {claimRes.isPending ? '⏳ Подтверждение...' : `💰 Вывести выигрыш (${formatC4C(stake * 2)} C4C)`}
    </button>
  );
}