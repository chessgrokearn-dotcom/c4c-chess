// 🔹 ПАТЧ 10: Создание игр, валидация ставок/времени, запись ходов
export const VALID_STAKES = [50000, 100000, 250000, 500000, 1000000] as const;
export const VALID_TIMES = [300, 900, 1800, 3600, 86400] as const;

export function validateGameConfig(stake: number, time: number): boolean {
  return (VALID_STAKES as readonly number[]).includes(stake) && (VALID_TIMES as readonly number[]).includes(time);
}

export function createTokenGameSession(creator: string, stake: number, time: number) {
  if (typeof window === 'undefined') return null;
  const session = {
    id: `g_${Date.now()}`,
    creator, opponent: '', stake, timeControl: time,
    status: 'waiting', pgn: '', moves: [], createdAt: Date.now()
  };
  const games = JSON.parse(localStorage.getItem('c4c-active-games') || '[]');
  games.push(session);
  localStorage.setItem('c4c-active-games', JSON.stringify(games));
  return session;
}

export function recordGameMove(gameId: string, moveSan: string, pgnHistory: string) {
  if (typeof window === 'undefined') return;
  const games = JSON.parse(localStorage.getItem('c4c-active-games') || '[]');
  const idx = games.findIndex((g: any) => g.id === gameId);
  if (idx !== -1) {
    games[idx].moves.push(moveSan);
    games[idx].pgn = pgnHistory;
    localStorage.setItem('c4c-active-games', JSON.stringify(games));
  }
}

export function getMyActiveGames(address: string) {
  if (typeof window === 'undefined') return [];
  const games = JSON.parse(localStorage.getItem('c4c-active-games') || '[]');
  return games.filter((g: any) => g.creator === address || g.opponent === address);
}

export const PATCH_010 = { VALID_STAKES, VALID_TIMES, validateGameConfig, createTokenGameSession, recordGameMove, getMyActiveGames };
