// apps/web/src/app/page.tsx
'use client';

import { useState, useEffect, type CSSProperties } from 'react';
import { useAccount, useConnect, useDisconnect, useConnectors, useBalance, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseAbi } from 'viem';
import { Chess, type Square, type Piece } from 'chess.js';
import { CONFIG, STAKE_CONFIG, TIME_CONFIG, BSC_CHAIN_ID } from '@/lib/config';

// 🔥 КОНТРАКТ ДЛЯ ИГРЫ (заполни после деплоя)
const CHESS_GAME_ABI = parseAbi([
  "function makeMove(string gameId, string moveNotation) external",
  "function getGameMoves(string gameId) external view returns (string[])"
]);
const CHESS_GAME_ADDRESS = '0x0000000000000000000000000000000000000000' as const;

// 🔹 КОМПОНЕНТ ШАХМАТНОЙ ДОСКИ
function ChessBoard() {
  const [game] = useState(() => new Chess());
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [possibleMoves, setPossibleMoves] = useState<Square[]>([]);
  const [moveHistory, setMoveHistory] = useState<string[]>([]);
  const [pendingMove, setPendingMove] = useState<string | null>(null);
  const { address } = useAccount();
  
  // ✅ wagmi v2: data содержит хеш транзакции
  const { writeContract, data: txHash, isPending: isTxPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isTxSuccess } = useWaitForTransactionReceipt({ hash: txHash });

  // 🔥 ИСПРАВЛЕНО: всегда возвращаем валидный CSSProperties
  const getPieceStyle = (piece: Piece | undefined | null): CSSProperties => {
    // Если фигуры нет — возвращаем скрытый, но валидный стиль
    if (!piece) return { visibility: 'hidden' as const, width: '44px', display: 'inline-block' };
    
    const isWhite = piece.color === 'w';
    return {
      fontSize: '44px',
      fontWeight: 900,
      color: isWhite ? '#ffffff' : '#111827',
      textShadow: isWhite ? '0 2px 4px rgba(0,0,0,0.6)' : '0 2px 4px rgba(255,255,255,0.3)',
      filter: isWhite ? 'drop-shadow(0 1px 2px rgba(0,0,0,0.8))' : 'drop-shadow(0 1px 2px rgba(255,255,255,0.4))',
      userSelect: 'none' as const,
      lineHeight: 1,
    };
  };

  const getPieceSymbol = (piece: Piece | undefined | null) => {
    if (!piece) return '';
    const symbols: Record<string, Record<'w' | 'b', string>> = {
      p: { w: '♙', b: '♟' }, n: { w: '♘', b: '♞' }, b: { w: '♗', b: '♝' },
      r: { w: '♖', b: '♜' }, q: { w: '♕', b: '♛' }, k: { w: '♔', b: '♚' },
    };
    return symbols[piece.type]?.[piece.color] || '';
  };
  
  const handleSquareClick = (square: string) => {
    const sq = square as Square;
    if (selectedSquare === sq) { setSelectedSquare(null); setPossibleMoves([]); return; }
    if (selectedSquare) {
      try {
        const move = game.move({ from: selectedSquare, to: sq, promotion: 'q' });
        if (move) {
          const notation = `${move.from}-${move.to}${move.promotion ? `=${move.promotion.toUpperCase()}` : ''}`;
          setMoveHistory(prev => [...prev, notation]);
          setPendingMove(notation);
          setSelectedSquare(null);
          setPossibleMoves([]);
          return;
        }
      } catch (e) {}
    }
    const piece = game.get(sq);
    if (piece && piece.color === game.turn()) {
      setSelectedSquare(sq);
      const moves = game.moves({ square: sq, verbose: true });
      setPossibleMoves(moves.map(m => m.to as Square));
    } else { setSelectedSquare(null); setPossibleMoves([]); }
  };

  const handleSendToBlockchain = () => {
    if (!pendingMove || !address) return;
    const gameId = `game_${address.slice(2, 10)}_${Date.now()}`;
    writeContract({
      address: CHESS_GAME_ADDRESS,
      abi: CHESS_GAME_ABI,
      functionName: 'makeMove',
      args: [gameId, pendingMove],
    });
  };

  useEffect(() => {
    if (isTxSuccess && pendingMove) {
      console.log(`✅ Move ${pendingMove} saved on chain! Hash: ${txHash}`);
      setPendingMove(null);
    }
  }, [isTxSuccess, txHash, pendingMove]);
  
  const getSquareColor = (fi: number, ri: number) => (fi + ri) % 2 === 0 ? '#eeeed2' : '#769656';
  const isPossibleMove = (sq: Square) => possibleMoves.includes(sq);
  const isSelected = (sq: Square) => selectedSquare === sq;

  return (
    <div style={{ marginTop: '24px', padding: '20px', background: '#1f2937', borderRadius: '16px', border: '1px solid #374151' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'white' }}>♟️ Игровая доска</h3>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <span style={{ fontSize: '14px', color: '#9ca3af' }}>Ход: {game.turn() === 'w' ? '⚪ Белые' : '⚫ Чёрные'}</span>
          {pendingMove && (
            <button
              onClick={handleSendToBlockchain}
              disabled={isTxPending || isConfirming || CHESS_GAME_ADDRESS === '0x0000000000000000000000000000000000000000'}
              style={{
                padding: '6px 12px',
                background: isTxPending || isConfirming ? '#6b7280' : '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '12px',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {isTxPending ? '⏳ Подписание...' : isConfirming ? '⛓️ Подтверждение...' : '📡 В блокчейн'}
            </button>
          )}
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: '1px', background: '#374151', border: '2px solid #374151', borderRadius: '8px', maxWidth: '450px', margin: '0 auto' }}>
        {['8','7','6','5','4','3','2','1'].map((rank, ri) => 
          ['a','b','c','d','e','f','g','h'].map((file, fi) => {
            const square = `${file}${rank}` as Square;
            const piece = game.get(square);
            return (
              <div key={square} onClick={() => handleSquareClick(square)} style={{
                aspectRatio: '1', background: getSquareColor(fi, ri), display: 'flex', alignItems: 'center',
                justifyContent: 'center', cursor: piece || isPossibleMove(square) ? 'pointer' : 'default',
                position: 'relative',
                border: isSelected(square) ? '3px solid #f59e0b' : isPossibleMove(square) ? '3px solid #3b82f6' : 'none',
                borderRadius: isSelected(square) || isPossibleMove(square) ? '6px' : '0'
              }}>
                <span style={getPieceStyle(piece)}>{getPieceSymbol(piece)}</span>
                {isPossibleMove(square) && !piece && (
                  <div style={{ position: 'absolute', width: '22px', height: '22px', background: 'rgba(59, 130, 246, 0.5)', borderRadius: '50%' }} />
                )}
              </div>
            );
          })
        )}
      </div>
      <div style={{ marginTop: '16px', background: '#111827', padding: '12px', borderRadius: '8px', border: '1px solid #374151', maxHeight: '120px', overflowY: 'auto' }}>
        <p style={{ fontSize: '13px', color: '#9ca3af', marginBottom: '6px' }}>📜 История ходов:</p>
        {moveHistory.length === 0 ? (
          <p style={{ fontSize: '12px', color: '#6b7280', fontStyle: 'italic' }}>Пока нет ходов...</p>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {moveHistory.map((m, i) => (
              <span key={i} style={{ background: '#374151', padding: '4px 8px', borderRadius: '4px', fontSize: '13px', color: '#e5e7eb' }}>
                {Math.floor(i/2)+1}{i%2===0 ? '.' : '...'} {m}
              </span>
            ))}
          </div>
        )}
      </div>
      <div style={{ textAlign: 'center', marginTop: '16px', minHeight: '36px' }}>
        {game.isCheckmate() && <p style={{ color: '#ef4444', fontWeight: 'bold' }}>♔ Шах и мат!</p>}
        {game.isDraw() && <p style={{ color: '#f59e0b', fontWeight: 'bold' }}>🤝 Ничья</p>}
        {game.inCheck() && !game.isCheckmate() && <p style={{ color: '#fbbf24' }}>⚠️ Шах!</p>}
      </div>
      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '16px' }}>
        <button onClick={() => { game.reset(); setMoveHistory([]); setPendingMove(null); setSelectedSquare(null); setPossibleMoves([]); }} style={{ padding: '10px 20px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' }}>Новая игра</button>
      </div>
    </div>
  );
}

// 🔹 ОСНОВНОЙ КОМПОНЕНТ СТРАНИЦЫ
export default function App() {
  const { address, isConnected, chain } = useAccount();
  const { connect, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const connectors = useConnectors();
  const [showModal, setShowModal] = useState(false);
  
  // ✅ wagmi v2: data содержит баланс
  const { data: balance, status: balanceStatus } = useBalance({
    address: address,
    token: CONFIG.C4C_TOKEN_ADDRESS as `0x${string}`,
    query: { enabled: !!address && !!chain?.id && chain.id === CONFIG.CHAIN_ID },
  });

  const metaMaskConnector = connectors.find(c => c.type === 'metaMask');
  const walletConnectConnector = connectors.find(c => c.type === 'walletConnect');
  const isWrongNetwork = isConnected && chain?.id !== CONFIG.CHAIN_ID;

  const ConnectModal = () => (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }} onClick={() => setShowModal(false)}>
      <div style={{ background: '#1f2937', borderRadius: '16px', padding: '24px', maxWidth: '420px', width: '100%', border: '1px solid #374151' }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: 'white' }}>Connect Wallet</h3>
          <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: '#9ca3af', fontSize: '24px', cursor: 'pointer' }}>×</button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button onClick={() => { if (metaMaskConnector) { connect({ connector: metaMaskConnector }); setShowModal(false); } }} disabled={isPending || !metaMaskConnector} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px', background: metaMaskConnector ? '#f59e0b' : '#6b7280', color: 'white', border: 'none', borderRadius: '10px', fontSize: '16px', fontWeight: 500, cursor: metaMaskConnector ? 'pointer' : 'not-allowed' }}>
            <span style={{ fontSize: '20px' }}>🦊</span><span>MetaMask</span>
          </button>
          <button onClick={() => { if (walletConnectConnector) { connect({ connector: walletConnectConnector }); setShowModal(false); } }} disabled={isPending || !walletConnectConnector || CONFIG.WALLETCONNECT_PROJECT_ID === 'demo'} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px', background: (walletConnectConnector && CONFIG.WALLETCONNECT_PROJECT_ID !== 'demo') ? '#3b82f6' : '#6b7280', color: 'white', border: 'none', borderRadius: '10px', fontSize: '16px', fontWeight: 500, cursor: (walletConnectConnector && CONFIG.WALLETCONNECT_PROJECT_ID !== 'demo') ? 'pointer' : 'not-allowed' }}>
            <span style={{ fontSize: '20px' }}>📱</span><span>WalletConnect QR</span>
          </button>
        </div>
        {CONFIG.WALLETCONNECT_PROJECT_ID === 'demo' && <p style={{ marginTop: '12px', fontSize: '11px', color: '#fbbf24', textAlign: 'center' }}>⚠️ QR не работает с ключом 'demo'</p>}
      </div>
    </div>
  );

  // 🔹 НЕ ПОДКЛЮЧЁН
  if (!isConnected) {
    return (<>
      <main style={{ minHeight: '100vh', background: '#111827', color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px', textAlign: 'center', fontFamily: 'system-ui, sans-serif' }}>
        <h1 style={{ fontSize: '36px', marginBottom: '16px', fontWeight: 'bold' }}>♟️ {CONFIG.APP_NAME}</h1>
        <p style={{ color: '#9ca3af', marginBottom: '40px', maxWidth: '450px', lineHeight: 1.6, fontSize: '18px' }}>{CONFIG.APP_DESCRIPTION}</p>
        <button onClick={() => setShowModal(true)} style={{ padding: '16px 40px', background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: 'white', border: 'none', borderRadius: '12px', fontSize: '20px', fontWeight: 'bold', cursor: 'pointer' }}>🔗 Войти в приложение</button>
      </main>
      {showModal && <ConnectModal />}
    </>);
  }

  // 🔹 НЕВЕРНАЯ СЕТЬ
  if (isWrongNetwork) {
    return (<main style={{ minHeight: '100vh', background: '#111827', color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px', textAlign: 'center', fontFamily: 'system-ui, sans-serif' }}>
      <h1 style={{ fontSize: '28px', marginBottom: '20px' }}>⚠️ Неверная сеть</h1>
      <p style={{ color: '#fbbf24', marginBottom: '24px' }}>Переключите кошелёк на {CONFIG.CHAIN_NAME} (ID: {CONFIG.CHAIN_ID})</p>
      <button onClick={() => disconnect()} style={{ padding: '12px 28px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Отключить</button>
    </main>);
  }

  // 🔹 ПОДКЛЮЧЁН + ПРАВИЛЬНАЯ СЕТЬ → ПРОФИЛЬ + ДОСКА
  return (
    <main style={{ minHeight: '100vh', background: '#111827', color: 'white', padding: '20px', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ maxWidth: '640px', margin: '0 auto' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '20px', borderBottom: '1px solid #374151' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>♟️ {CONFIG.APP_NAME}</h1>
          <button onClick={() => { disconnect(); setShowModal(false); }} style={{ padding: '10px 20px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Выйти</button>
        </header>
        
        {/* Профиль */}
        <section style={{ marginTop: '32px', padding: '28px', background: '#1f2937', borderRadius: '16px', border: '1px solid #374151' }}>
          <h2 style={{ fontSize: '20px', marginBottom: '20px', fontWeight: 600 }}>👤 Профиль</h2>
          <div style={{ marginBottom: '24px' }}>
            <p style={{ fontSize: '13px', color: '#9ca3af', marginBottom: '8px' }}>Адрес кошелька</p>
            <p style={{ fontFamily: 'monospace', fontSize: '14px', color: '#22c55e', wordBreak: 'break-all', background: '#111827', padding: '12px', borderRadius: '8px' }}>{address}</p>
          </div>
          <div>
            <p style={{ fontSize: '13px', color: '#9ca3af', marginBottom: '8px' }}>Баланс {CONFIG.APP_NAME}</p>
            <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#f59e0b' }}>
              {balanceStatus === 'pending' && '⏳ Загрузка...'}
              {balanceStatus === 'error' && '❌ Ошибка'}
              {balanceStatus === 'success' && balance?.formatted ? `${parseFloat(balance.formatted).toFixed(2)} C4C` : balanceStatus === 'success' && '0.00 C4C'}
            </p>
          </div>
        </section>

        {/* Шахматная доска */}
        <ChessBoard />

        <footer style={{ marginTop: '48px', paddingTop: '24px', borderTop: '1px solid #374151', textAlign: 'center', fontSize: '12px', color: '#6b7280' }}>
          <p>Токен: <span style={{ fontFamily: 'monospace' }}>{CONFIG.C4C_TOKEN_ADDRESS.slice(0, 10)}...{CONFIG.C4C_TOKEN_ADDRESS.slice(-8)}</span></p>
        </footer>
      </div>
    </main>
  );
}