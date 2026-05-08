// apps/api/src/services/contract.service.ts
import { STAKE_CONFIG } from '../config/stake.config';

export class ContractService {
  /**
   * Проверяет, есть ли у пользователя достаточно средств и аппрувов для ставки.
   * Валидирует формат адреса и размер ставки.
   */
  async verifyStake(userAddress: string, amount: number): Promise<boolean> {
    console.log(`[ContractService] Verifying stake for ${userAddress}: ${amount} C4C`);
    
    try {
      // Валидация адреса
      if (!userAddress || !userAddress.match(/^0x[a-fA-F0-9]{40}$/)) {
        console.error(`[ContractService] Invalid address format: ${userAddress}`);
        return false;
      }
      
      // Валидация суммы ставки
      if (amount < STAKE_CONFIG.MIN_STAKE || amount > STAKE_CONFIG.MAX_STAKE) {
        console.error(`[ContractService] Stake ${amount} is out of range [${STAKE_CONFIG.MIN_STAKE}, ${STAKE_CONFIG.MAX_STAKE}]`);
        return false;
      }
      
      if ((amount - STAKE_CONFIG.MIN_STAKE) % STAKE_CONFIG.STAKE_STEP !== 0) {
        console.error(`[ContractService] Stake ${amount} does not match step ${STAKE_CONFIG.STAKE_STEP}`);
        return false;
      }
      
      // TODO: Добавить реальную проверку баланса и allowance через RPC ноду (viem)
      // Пока работает в режиме заглушки для тестирования
      console.log(`[ContractService] ✅ Stake verification passed (mock mode)`);
      return true;
    } catch (error) {
      console.error(`[ContractService] Error verifying stake:`, error);
      return false;
    }
  }

  /**
   * Записывает результат игры.
   * В продакшене вызвать метод смарт-контракта finishGame().
   */
  async recordGameResult(
    gameId: string, 
    winner: string, 
    loser: string, 
    stake: number
  ): Promise<boolean> {
    console.log(`[ContractService] Recording game result: Winner ${winner}, Loser ${loser}, Stake ${stake}`);
    
    try {
      // Валидация адресов
      if (!winner?.match(/^0x[a-fA-F0-9]{40}$/) || !loser?.match(/^0x[a-fA-F0-9]{40}$/)) {
        console.error(`[ContractService] Invalid winner or loser address`);
        return false;
      }
      
      // TODO: Вызов метода смарт-контракта finishGame(gameId, winner, false)
      // const tx = await gameContract.finishGame(gameId, winner, false);
      // await tx.wait();
      
      console.log(`[ContractService] ✅ Game result recorded (mock mode)`);
      return true;
    } catch (error) {
      console.error(`[ContractService] Error recording game result:`, error);
      return false;
    }
  }

  /**
   * Получает информацию об игре из контракта.
   */
  async getGameInfo(gameId: string): Promise<any> {
    console.log(`[ContractService] Getting game info for gameId: ${gameId}`);
    
    // TODO: Вызвать getGame(gameId) из смарт-контракта
    return {
      creator: '',
      challenger: '',
      stake: 0,
      finished: false,
      winner: null
    };
  }
}

// Экспортируем единственный экземпляр сервиса (Singleton)
export const contractService = new ContractService();