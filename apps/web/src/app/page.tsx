// apps/web/src/app/page.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { useAccount, useConnect, useDisconnect, useConnectors, useBalance, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseAbi } from 'viem';
import { Chess, type Square, type Piece, type Move } from 'chess.js';
import { CONFIG } from '@/lib/config';
import { getBotMove, isBotTurn, startGameWithBot } from '@/components/chess-bot';
import { ChatBoxDynamic } from '@/components/chat-box-dynamic';

const CHESS_GAME_ABI = parseAbi([
  "function makeMove(string gameId, string moveNotation) external",
  "function getGameMoves(string gameId) external view returns (string[])"
]);

function formatTime(seconds: number): string {
  if (seconds >= 3600) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

const TIME_OPTIONS = [
  { label: '5 мин', value: 300 },
  { label: '15 мин', value: 900 },
  { label: '30 мин', value: 1800 },
  { label: '1 час', value: 3600 },
  { label: '24 часа', value: 86400 },
] as const;

function ChessBoard() {
  const [fen, setFen] = useState<string>(() => startGameWithBot());
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [possibleMoves, setPossibleMoves] = useState<Square[]>([]);
  const [moveHistory, setMoveHistory] = useState<string[]>([]);
  const [pendingMove, setPendingMove] = useState<string | null>(null);
  const [gameMode, setGameMode] = useState<'bot' | 'pvp'>('bot');
  const [timeControl, setTimeControl] = useState<number>(900);
  const [whiteTime, setWhiteTime] = useState<number>(900);
  const [blackTime, setBlackTime] = useState<number>(900);
  const [gameOver, setGameOver] = useState<string | null>(null);
  
  const { address, chain } = useAccount();
  
  // 🔥 🔥 🔥 РЕШЕНИЕ: используем .data напрямую, без алиасов 🔥 🔥 🔥
  const writeContractResult = useWriteContract();
  const txHash = writeContractResult.data;
  const isTxPending = writeContractResult.isPending;
  
  const waitForTxResult = useWaitForTransactionReceipt({ hash: txHash });
  const isConfirming = waitForTxResult.isLoading;
  const isTxSuccess = waitForTxResult.isSuccess;
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const botTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => { resetGame(); }, [timeControl, gameMode]);

  useEffect(() => {
    if (gameOver) { if (timerRef.current) clearInterval(timerRef.current); return; }
    const currentGame = new Chess(fen);
    const isWhiteTurn = currentGame.turn() === 'w';
    const timeLeft = isWhiteTurn ? whiteTime : blackTime;
    if (timeLeft <= 0) { setGameOver(isWhiteTurn ? '⚪ Белые просрочили время!' : '⚫ Чёрные просрочили время!'); return; }
    timerRef.current = setInterval(() => {
      if (isWhiteTurn) {
        setWhiteTime(prev => { if (prev <= 1) { setGameOver('⚪ Белые просрочили время!'); return 0; } return prev - 1; });
      } else {
        setBlackTime(prev => { if (prev <= 1) { setGameOver('⚫ Чёрные просрочили время!'); return 0; } return prev - 1; });
      }
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [fen, whiteTime, blackTime, gameOver]);

  useEffect(() => {
    if (gameMode === 'bot' && !gameOver) {
      const currentGame = new Chess(fen);
      if (isBotTurn(currentGame) && !currentGame.isGameOver()) {
        botTimerRef.current = setTimeout(() => {
          const botMove = getBotMove(currentGame);
          if (botMove) {
            currentGame.move(botMove);
            setFen(currentGame.fen());
            setMoveHistory(prev => [...prev, `${botMove.from}-${botMove.to}`]);
            setBlackTime(prev => Math.max(0, prev - 4));
          }
        }, 4000);
        return () => { if (botTimerRef.current) clearTimeout(botTimerRef.current); };
      }
    }
  }, [fen, gameMode, gameOver]);

  const getPieceStyle = (piece: Piece | undefined | null) => {
    if (!piece) return {} satisfies React.CSSProperties;
    const isWhite = piece.color === 'w';
    return {
      fontSize: '44px', fontWeight: 900, color: isWhite ? '#ffffff' : '#111827',
      textShadow: isWhite ? '0 2px 4px rgba(0,0,0,0.6)' : '0 2px 4px rgba(255,255,255,0.3)',
      filter: isWhite ? 'drop-shadow(0 1px 2px rgba(0,0,0,0.8))' : 'drop-shadow(0 1px 2px rgba(255,255,255,0.4))',
      userSelect: 'none', lineHeight: 1,
    } satisfies React.CSSProperties;
  };

  const getPieceSymbol = (piece: Piece | undefined | null) => {
    if (!piece) return '';
    const s: Record<string, Record<'w' | 'b', string>> = {
      p: { w: '♙', b: '♟' }, n: { w: '♘', b: '♞' }, b: { w: '♗', b: '♝' },
      r: { w: '♖', b: '♜' }, q: { w: '♕', b: '♛' }, k: { w: '♔', b: '♚' }
    };
    return s[piece.type]?.[piece.color] || '';
  };
  
  const handleSquareClick = (square: string) => {
    if (gameOver) return;
    const sq = square as Square;
    if (selectedSquare === sq) { setSelectedSquare(null); setPossibleMoves([]); return; }
    const currentGame = new Chess(fen);
    if (selectedSquare) {
      try {
        const move = currentGame.move({ from: selectedSquare, to: sq, promotion: 'q' });
        if (move) {
          setFen(currentGame.fen());
          const notation = `${move.from}-${move.to}${move.promotion ? `=${move.promotion.toUpperCase()}` : ''}`;
          setMoveHistory(p => [...p, notation]);
          setPendingMove(notation);
          setSelectedSquare(null);
          setPossibleMoves([]);
          if (gameMode === 'bot') setWhiteTime(prev => Math.max(0, prev - 1));
          return;
        }
      } catch {}
    }
    const piece = currentGame.get(sq);
    if (piece && piece.color === currentGame.turn() && (gameMode === 'pvp' || piece.color === 'w')) {
      setSelectedSquare(sq);
      const moves = currentGame.moves({ square: sq, verbose: true });
      setPossibleMoves(moves.map(m => m.to as Square));
    } else { setSelectedSquare(null); setPossibleMoves([]); }
  };

  const handleSendToBlockchain = () => {
    if (!pendingMove || !address || gameMode !== 'pvp') return;
    writeContractResult.writeContract({
      address: CONFIG.GAME_CONTRACT_ADDRESS,
      abi: CHESS_GAME_ABI,
      functionName: 'makeMove',
      args: [`game_${address.slice(2,10)}_${Date.now()}`, pendingMove],
    });
  };

  const resetGame = () => {
    setFen(startGameWithBot());
    setSelectedSquare(null); setPossibleMoves([]);
    setMoveHistory([]); setPendingMove(null);
    setWhiteTime(timeControl); setBlackTime(timeControl);
    setGameOver(null);
    if (timerRef.current) clearInterval(timerRef.current);
    if (botTimerRef.current) clearTimeout(botTimerRef.current);
  };

  useEffect(() => { if (isTxSuccess && pendingMove) { console.log('✅ Saved:', txHash); setPendingMove(null); } }, [isTxSuccess, txHash, pendingMove]);
  
  const getSquareColor = (fi: number, ri: number) => (fi + ri) % 2 === 0 ? '#eeeed2' : '#769656';
  const isPossibleMove = (sq: Square) => possibleMoves.includes(sq);
  const isSelected = (sq: Square) => selectedSquare === sq;
  const currentGame = new Chess(fen);
  const isWhiteTurn = currentGame.turn() === 'w';

  return (
    <div style={{ marginTop: '24px', padding: '20px', background: '#1f2937', borderRadius: '16px', border: '1px solid #374151' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'white' }}>♟️ Игровая доска</h3>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          <select value={gameMode} onChange={(e) => { setGameMode(e.target.value as 'bot' | 'pvp'); resetGame(); }} style={{ padding: '6px 12px', background: '#374151', color: 'white', border: '1px solid #4b5563', borderRadius: '6px', fontSize: '13px' }}>
            <option value="bot">🤖 Игра с ботом</option>
            <option value="pvp">👥 Игра с игроком</option>
          </select>
          <select value={timeControl} onChange={(e) => setTimeControl(Number(e.target.value))} style={{ padding: '6px 12px', background: '#374151', color: 'white', border: '1px solid #4b5563', borderRadius: '6px', fontSize: '13px' }}>
            {TIME_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', padding: '8px 12px', background: '#111827', borderRadius: '8px' }}>
        <div style={{ textAlign: 'left' }}>
          <span style={{ fontSize: '12px', color: '#9ca3af' }}>⚪ Белые</span>
          <p style={{ fontSize: '20px', fontWeight: 'bold', color: isWhiteTurn && !gameOver ? '#fbbf24' : '#22c55e', margin: 0 }}>{formatTime(whiteTime)}</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <span style={{ fontSize: '12px', color: '#9ca3af' }}>⚫ Чёрные {gameMode === 'bot' ? '(бот)' : ''}</span>
          <p style={{ fontSize: '20px', fontWeight: 'bold', color: !isWhiteTurn && !gameOver ? '#fbbf24' : '#22c55e', margin: 0 }}>{formatTime(blackTime)}</p>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: '1px', background: '#374151', border: '2px solid #374151', borderRadius: '8px', maxWidth: '450px', margin: '0 auto' }}>
        {['8','7','6','5','4','3','2','1'].map((rank, ri) => 
          ['a','b','c','d','e','f','g','h'].map((file, fi) => {
            const square = `${file}${rank}` as Square;
            const piece = currentGame.get(square);
            return (
              <div key={square} onClick={() => handleSquareClick(square)} style={{ aspectRatio: '1', background: getSquareColor(fi, ri), display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: piece || isPossibleMove(square) ? 'pointer' : 'default', position: 'relative', border: isSelected(square) ? '3px solid #f59e0b' : isPossibleMove(square) ? '3px solid #3b82f6' : 'none' }}>
                <span style={getPieceStyle(piece)}>{getPieceSymbol(piece)}</span>
                {isPossibleMove(square) && !piece && <div style={{ position: 'absolute', width: '22px', height: '22px', background: 'rgba(59,130,246,0.5)', borderRadius: '50%' }} />}
              </div>
            );
          })
        )}
      </div>
      <div style={{ textAlign: 'center', marginTop: '16px' }}>
        {gameOver && <p style={{ color: '#ef4444', fontWeight: 'bold', fontSize: '18px' }}>{gameOver}</p>}
        {currentGame.isCheckmate() && !gameOver && <p style={{ color: '#ef4444', fontWeight: 'bold' }}>♔ Шах и мат! Победили {currentGame.turn() === 'w' ? 'чёрные' : 'белые'}</p>}
        {currentGame.isDraw() && !gameOver && <p style={{ color: '#f59e0b', fontWeight: 'bold' }}>🤝 Ничья</p>}
        {currentGame.inCheck() && !currentGame.isCheckmate() && !gameOver && <p style={{ color: '#fbbf24' }}>⚠️ Шах!</p>}
        {gameMode === 'pvp' && pendingMove && !gameOver && (
          <button onClick={handleSendToBlockchain} disabled={isTxPending || isConfirming} style={{ marginTop: '12px', padding: '8px 16px', background: '#10b981', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
            {isTxPending ? '⏳ Подписание...' : '📡 В блокчейн'}
          </button>
        )}
        <button onClick={resetGame} style={{ marginTop: '12px', padding: '8px 16px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Новая игра</button>
      </div>
    </div>
  );
}

export default function App() {
  const { address, isConnected, chain } = useAccount();
  const { connect, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const connectors = useConnectors();
  const [showModal, setShowModal] = useState(false);
  
  // 🔥 🔥 🔥 РЕШЕНИЕ: используем .data напрямую, без алиасов 🔥 🔥 🔥
  const balanceResult = useBalance({
    address: address,
    token: CONFIG.C4C_TOKEN_ADDRESS as `0x${string}`,
    query: { enabled: !!address && !!chain?.id && chain.id === CONFIG.CHAIN_ID },
  });
  const balance = balanceResult.data;
  const balanceStatus = balanceResult.status;

  const metaMaskConnector = connectors.find(c => c.type === 'metaMask');
  const walletConnectConnector = connectors.find(c => c.type === 'walletConnect');

  const [playerId] = useState(() => {
    if (typeof window === 'undefined') return 'server';
    return address || `guest_${Math.random().toString(36).slice(2, 10)}`;
  });
  const [opponentId] = useState(() => {
    if (typeof window === 'undefined') return undefined;
    return address ? undefined : `bot_${playerId.slice(-6)}`;
  });

  if (!isConnected) {
    return (<>
      <main style={{ minHeight: '100vh', background: '#111827', color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '36px', marginBottom: '16px', fontWeight: 'bold' }}>♟️ {CONFIG.APP_NAME}</h1>
        <p style={{ color: '#9ca3af', marginBottom: '40px', maxWidth: '450px', lineHeight: 1.6, fontSize: '18px' }}>{CONFIG.APP_DESCRIPTION}</p>
        <button onClick={() => setShowModal(true)} style={{ padding: '16px 40px', background: '#f59e0b', color: 'white', border: 'none', borderRadius: '12px', fontSize: '20px', fontWeight: 'bold', cursor: 'pointer' }}>🔗 Войти в приложение</button>
      </main>
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }} onClick={() => setShowModal(false)}>
          <div style={{ background: '#1f2937', borderRadius: '16px', padding: '24px', maxWidth: '420px', width: '100%' }} onClick={e => e.stopPropagation()}>
            <button onClick={() => { if(metaMaskConnector) connect({ connector: metaMaskConnector }); setShowModal(false); }} style={{ width: '100%', padding: '14px', margin: '8px 0', background: '#f59e0b', border: 'none', borderRadius: '10px', color: 'white', cursor: 'pointer' }}>🦊 MetaMask</button>
            <button onClick={() => { if(walletConnectConnector) connect({ connector: walletConnectConnector }); setShowModal(false); }} style={{ width: '100%', padding: '14px', margin: '8px 0', background: '#3b82f6', border: 'none', borderRadius: '10px', color: 'white', cursor: 'pointer' }}>📱 WalletConnect QR</button>
            <button onClick={() => setShowModal(false)} style={{ width: '100%', padding: '14px', margin: '8px 0', background: '#374151', border: 'none', borderRadius: '10px', color: 'white', cursor: 'pointer' }}>Закрыть</button>
          </div>
        </div>
      )}
      <ChatBoxDynamic playerId={playerId} opponentId={opponentId} />
    </>);
  }

  return (
    <main style={{ minHeight: '100vh', background: '#111827', color: 'white', padding: '20px' }}>
      <div style={{ maxWidth: '640px', margin: '0 auto' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '20px', borderBottom: '1px solid #374151' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>♟️ {CONFIG.APP_NAME}</h1>
          <button onClick={() => { disconnect(); setShowModal(false); }} style={{ padding: '10px 20px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Выйти</button>
        </header>
        
        <section style={{ marginTop: '32px', padding: '28px', background: '#1f2937', borderRadius: '16px', border: '1px solid #374151' }}>
          <h2 style={{ fontSize: '20px', marginBottom: '20px', fontWeight: 600 }}>👤 Профиль</h2>
          <p style={{ fontSize: '13px', color: '#9ca3af', marginBottom: '8px' }}>Адрес кошелька</p>
          <p style={{ fontFamily: 'monospace', fontSize: '14px', color: '#22c55e', wordBreak: 'break-all', background: '#111827', padding: '12px', borderRadius: '8px' }}>{address}</p>
          <p style={{ marginTop: '20px', fontSize: '13px', color: '#9ca3af', marginBottom: '8px' }}>Баланс {CONFIG.APP_NAME}</p>
          <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#f59e0b' }}>
            {balanceStatus === 'pending' && '⏳ Загрузка...'}
            {balanceStatus === 'error' && '❌ Ошибка'}
            {balanceStatus === 'success' && balance?.formatted ? `${parseFloat(balance.formatted).toFixed(2)} C4C` : '0.00 C4C'}
          </p>
          <div style={{ marginTop: '24px', padding: '16px', background: 'linear-gradient(135deg, #ec4899, #db2777)', borderRadius: '12px', border: '1px solid #f472b6' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'white', marginBottom: '8px' }}>💰 Купить C4C Tokens</h3>
            <p style={{ fontSize: '13px', color: '#fff', opacity: 0.9, marginBottom: '12px', lineHeight: 1.4 }}>Приобретайте игровые токены на Pink.Meme для участия в рейтинговых играх.</p>
            <a href={CONFIG.C4C_BUY_URL} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: 'white', color: '#db2777', textDecoration: 'none', borderRadius: '8px', fontWeight: 600, fontSize: '14px' }}>
              <span>🛒</span> Купить на Pink.Meme
            </a>
          </div>
        </section>

        <ChessBoard />

        <footer style={{ marginTop: '48px', paddingTop: '24px', borderTop: '1px solid #374151', textAlign: 'center', fontSize: '12px', color: '#6b7280' }}>
          <p>Игровой контракт: <span style={{ fontFamily: 'monospace' }}>{CONFIG.GAME_CONTRACT_ADDRESS.slice(0, 10)}...{CONFIG.GAME_CONTRACT_ADDRESS.slice(-8)}</span></p>
          <p style={{ marginTop: '4px' }}>Сеть: {CONFIG.CHAIN_NAME} (ID: {CONFIG.CHAIN_ID})</p>
        </footer>
      </div>
      <ChatBoxDynamic playerId={playerId} opponentId={opponentId} />
    </main>
  );
}