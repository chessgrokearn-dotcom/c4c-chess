// apps/web/src/components/stake-actions.tsx
'use client';

import { erc20Abi, parseUnits } from "viem";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { c4cGameAbi } from "@/lib/abi";
import { toGameId } from "@/lib/contract-utils";
import { OnChainGameState, RoomSummary } from "@/lib/types";

const C4C_TOKEN_ADDRESS = "0xaac20575371de01b4d10c4e7566d5453d72d56e7";
const GAME_CONTRACT_ADDRESS = "0xCf5E5d01ADd5e2Ba62B2f6747E5CFC43e36D5005";

interface StakeActionsProps {
  room: RoomSummary;
  onStakeSuccess: () => void;
}

export function StakeActions({ room, onStakeSuccess }: StakeActionsProps) {
  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();

  const handleApproveAndStake = async () => {
    if (!address) return;
    
    try {
      const stakeAmount = BigInt(room.stake);
      
      await writeContractAsync({
        address: C4C_TOKEN_ADDRESS,
        abi: erc20Abi,
        functionName: "approve",
        args: [GAME_CONTRACT_ADDRESS, stakeAmount],
      });

      await writeContractAsync({
        address: GAME_CONTRACT_ADDRESS,
        abi: c4cGameAbi,
        functionName: "stakeForGame",
        args: [toGameId(room.id), stakeAmount],
      });

      onStakeSuccess();
    } catch (error) {
      console.error("Staking failed:", error);
    }
  };

  return (
    <div className="p-4 bg-gray-800 rounded-lg mt-4">
      <h3 className="text-lg font-bold text-white mb-2">Ставка: {room.stake} C4C</h3>
      <button 
        onClick={handleApproveAndStake}
        className="w-full py-2 bg-yellow-600 hover:bg-yellow-700 rounded text-white font-bold"
      >
        Подтвердить ставку
      </button>
    </div>
  );
}