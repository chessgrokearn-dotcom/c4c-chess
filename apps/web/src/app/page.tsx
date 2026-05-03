// apps/web/src/app/page.tsx
// 🔹 ЭТОТ ФАЙЛ НЕ МЕНЯТЬ ПОСЛЕ СОЗДАНИЯ
// Все импорты — только из @/lib/config

import { useState, useEffect } from 'react';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAccount, useConnect, useDisconnect, useBalance } from 'wagmi';
import { Chess } from 'chess.js';

// 🔥 ИМПОРТ ТОЛЬКО ИЗ @/lib/config (через master-config.ts)
import {
  // Константы
  C4C_TOKEN_ADDRESS, CHAIN_ID, APP_NAME, APP_DESCRIPTION,
  WALLETCONNECT_PROJECT_ID, C4C_BUY_URL, HOW_TO_PLAY,
  TIME_OPTIONS, STAKE_OPTIONS, BOARD_THEMES, PROFILE_THEMES, LANGUAGES,
  // Утилиты
  formatTime, formatC4C, getBotMove, getBoardThemeForProfile,
  saveProfileToStorage, loadProfileFromStorage,
  // 🔥 Функции из патчей (через master-config)
  createWagmiConfig, canConnectToMetaMask, canConnectToWalletConnect, resetConnectionStates,
  // Стили
  getPieceStyle, PIECE_SYMBOLS,
  // Типы
  type BoardThemeId, type ProfileThemeId, type LanguageCode,
  type PlayerProfile, type Game, type Friend, type GameInvite,
} from '@/lib/config';

// 🔥 CONFIG создаётся через фабрику из master-config
const wagmiConfig = createWagmiConfig();
const queryClient = new QueryClient();

// ... остальной код page.tsx остаётся БЕЗ ИЗМЕНЕНИЙ ...
// Все функции подключения используют canConnectToMetaMask() и resetConnectionStates() из config

export default function Page() {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        {/* ... ваш ChessApp компонент ... */}
      </QueryClientProvider>
    </WagmiProvider>
  );
}