// apps/web/src/app/page.tsx
'use client';

import { useState } from 'react';
import { useAccount, useConnect, useDisconnect, useConnectors, useBalance } from 'wagmi';
import { CONFIG } from '@/lib/config';

export default function App() {
  const { address, isConnected } = useAccount();
  const { connect, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const connectors = useConnectors();
  const [showModal, setShowModal] = useState(false);
  
  const {  balance } = useBalance({
    address: address,
    token: CONFIG.C4C_TOKEN_ADDRESS as `0x${string}`,
  });

  // 🔹 Находим коннекторы
  const metaMaskConnector = connectors.find(c => c.type === 'metaMask');
  const walletConnectConnector = connectors.find(c => c.type === 'walletConnect');

  // 🔹 МОДАЛЬНОЕ ОКНО ВЫБОРА КОШЕЛЬКА
  const ConnectModal = () => (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }} onClick={() => setShowModal(false)}>
      <div style={{
        background: '#1f2937',
        borderRadius: '16px',
        padding: '24px',
        maxWidth: '400px',
        width: '100%',
        border: '1px solid #374151'
      }} onClick={e => e.stopPropagation()}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 'bold' }}>Connect Wallet</h3>
          <button onClick={() => setShowModal(false)} style={{
            background: 'none', border: 'none', color: '#9ca3af', fontSize: '24px', cursor: 'pointer'
          }}>×</button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* 🦊 MetaMask / Browser Extension */}
          <button
            onClick={() => {
              if (metaMaskConnector) {
                connect({ connector: metaMaskConnector });
                setShowModal(false);
              }
            }}
            disabled={isPending || !metaMaskConnector}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '14px 16px',
              background: '#f59e0b',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontSize: '16px',
              fontWeight: '500',
              cursor: metaMaskConnector ? 'pointer' : 'not-allowed',
              opacity: metaMaskConnector ? 1 : 0.6,
              transition: 'background 0.2s'
            }}
            onMouseOver={(e) => metaMaskConnector && (e.currentTarget.style.background = '#d97706')}
            onMouseOut={(e) => metaMaskConnector && (e.currentTarget.style.background = '#f59e0b')}
          >
            <span style={{ fontSize: '20px' }}>🦊</span>
            <span>Connect via Browser (MetaMask)</span>
          </button>

          {/* 📱 WalletConnect / QR Code */}
          <button
            onClick={() => {
              if (walletConnectConnector) {
                connect({ connector: walletConnectConnector });
                setShowModal(false);
              }
            }}
            disabled={isPending || !walletConnectConnector}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '14px 16px',
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontSize: '16px',
              fontWeight: '500',
              cursor: walletConnectConnector ? 'pointer' : 'not-allowed',
              opacity: walletConnectConnector ? 1 : 0.6,
              transition: 'background 0.2s'
            }}
            onMouseOver={(e) => walletConnectConnector && (e.currentTarget.style.background = '#2563eb')}
            onMouseOut={(e) => walletConnectConnector && (e.currentTarget.style.background = '#3b82f6')}
          >
            <span style={{ fontSize: '20px' }}>📱</span>
            <span>Connect via QR Code (Mobile)</span>
          </button>
        </div>

        <p style={{ marginTop: '16px', fontSize: '12px', color: '#6b7280', textAlign: 'center' }}>
          Choose your preferred connection method
        </p>
      </div>
    </div>
  );

  // 🔹 СОСТОЯНИЕ 1: НЕ ПОДКЛЮЧЁН → ГЛАВНАЯ С КНОПКОЙ "ВОЙТИ"
  if (!isConnected) {
    return (
      <>
        <main style={{
          minHeight: '100vh',
          background: '#111827',
          color: 'white',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          textAlign: 'center',
          fontFamily: 'system-ui, sans-serif'
        }}>
          <h1 style={{ fontSize: '36px', marginBottom: '16px', fontWeight: 'bold' }}>
            ♟️ {CONFIG.APP_NAME}
          </h1>
          <p style={{ color: '#9ca3af', marginBottom: '40px', maxWidth: '450px', lineHeight: '1.6', fontSize: '18px' }}>
            {CONFIG.APP_DESCRIPTION}
          </p>
          
          {/* 🔥 КНОПКА "ВОЙТИ" */}
          <button
            onClick={() => setShowModal(true)}
            style={{
              padding: '16px 40px',
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '20px',
              fontWeight: 'bold',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(245, 158, 11, 0.4)',
              transition: 'transform 0.1s, box-shadow 0.2s'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(245, 158, 11, 0.6)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 14px rgba(245, 158, 11, 0.4)';
            }}
          >
            🔗 Войти в приложение
          </button>
          
          <p style={{ marginTop: '28px', fontSize: '14px', color: '#6b7280' }}>
            Поддерживается: MetaMask • WalletConnect • Coinbase
          </p>
        </main>

        {/* Модальное окно выбора */}
        {showModal && <ConnectModal />}
      </>
    );
  }

  // 🔹 СОСТОЯНИЕ 2: ПОДКЛЮЧЁН → ПРОФИЛЬ ИГРОКА
  return (
    <main style={{
      minHeight: '100vh',
      background: '#111827',
      color: 'white',
      padding: '20px',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <div style={{ maxWidth: '640px', margin: '0 auto' }}>
        
        {/* Хедер */}
        <header style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingBottom: '20px',
          borderBottom: '1px solid #374151'
        }}>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>♟️ {CONFIG.APP_NAME}</h1>
          <button
            onClick={() => {
              disconnect();
              setShowModal(false);
            }}
            style={{
              padding: '10px 20px',
              background: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'background 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.background = '#dc2626'}
            onMouseOut={(e) => e.currentTarget.style.background = '#ef4444'}
          >
            Выйти
          </button>
        </header>

        {/* Карточка профиля */}
        <section style={{
          marginTop: '32px',
          padding: '28px',
          background: '#1f2937',
          borderRadius: '16px',
          border: '1px solid #374151'
        }}>
          <h2 style={{ fontSize: '20px', marginBottom: '20px', fontWeight: '600' }}>👤 Профиль игрока</h2>
          
          <div style={{ marginBottom: '24px' }}>
            <p style={{ fontSize: '13px', color: '#9ca3af', marginBottom: '8px' }}>Адрес кошелька</p>
            <p style={{
              fontFamily: 'monospace',
              fontSize: '14px',
              color: '#22c55e',
              wordBreak: 'break-all',
              background: '#111827',
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid #374151'
            }}>
              {address}
            </p>
          </div>
          
          <div>
            <p style={{ fontSize: '13px', color: '#9ca3af', marginBottom: '8px' }}>
              Баланс {CONFIG.APP_NAME}
            </p>
            <p style={{
              fontSize: '28px',
              fontWeight: 'bold',
              color: '#f59e0b',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              {balance?.formatted 
                ? `${parseFloat(balance.formatted).toFixed(2)} C4C` 
                : <span style={{ fontSize: '16px', color: '#6b7280' }}>Загрузка...</span>}
            </p>
          </div>
        </section>

        {/* Блок создания игры (заглушка для Фазы 3) */}
        <section style={{
          marginTop: '24px',
          padding: '28px',
          background: '#1f2937/50',
          borderRadius: '16px',
          border: '1px dashed #374151',
          textAlign: 'center'
        }}>
          <h3 style={{ fontSize: '18px', marginBottom: '12px', fontWeight: '600' }}>🎮 Создать игру</h3>
          <p style={{ color: '#9ca3af', marginBottom: '16px', lineHeight: '1.5' }}>
            Настройка ставки, времени и доски будет доступна в следующем обновлении.
          </p>
          <button
            disabled
            style={{
              padding: '12px 28px',
              background: '#6b7280',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              cursor: 'not-allowed',
              fontSize: '15px',
              fontWeight: '500'
            }}
          >
            Создать игру (скоро)
          </button>
        </section>

        {/* Футер */}
        <footer style={{
          marginTop: '48px',
          paddingTop: '24px',
          borderTop: '1px solid #374151',
          textAlign: 'center',
          fontSize: '12px',
          color: '#6b7280'
        }}>
          <p>Токен: <span style={{ fontFamily: 'monospace', color: '#9ca3af' }}>{CONFIG.C4C_TOKEN_ADDRESS.slice(0, 10)}...{CONFIG.C4C_TOKEN_ADDRESS.slice(-8)}</span></p>
          <p style={{ marginTop: '8px' }}>
            Сеть: {CONFIG.CHAIN_NAME} (ID: {CONFIG.CHAIN_ID})
          </p>
        </footer>

      </div>
    </main>
  );
}