'use client'

import { useState, useEffect, ChangeEvent } from 'react'
import { useAccount, useConnect, useDisconnect, useConnectors, useBalance } from 'wagmi'
import { Chess } from 'chess.js'
import {
  APP_NAME, C4C_BUY_URL, TIME_OPTIONS, STAKE_OPTIONS, UI_THEMES, UI_LANGS, UI_BOARDS, UI_TRANSLATE,
  formatTime, formatC4C, getBotMove, saveProfileToStorage, loadProfileFromStorage,
  resetConnectionStates, getFriends, addFriend, processPayout,
  FIXED_CSS, injectGlobalStyles, validateStake, formatPrizePool, formatClock,
  publishGameToLobby, getLobbyGames, generateGameInvite, sendInviteToChat, canJoinGame,
  initClock, tickClock, makeMove,
  SECTIONS, YOUTUBE_URL, YOUTUBE_BUTTON_TEXT, C4C_EXCHANGE_URL, SOCIAL_SECTION_TITLE, SOCIAL_LINKS, YOUTUBE_SECTION_DESCRIPTION,
  EXTENDED_BOARD_THEMES, PIECE_STYLES,
  createNotification, getNotifications, markNotificationRead, playStartSound, showVisualAlert, checkAndStartGame, updatePlayerPresence, areBothPlayersOnline
} from '@/lib/config'
import type { GameNotification } from '@/lib/config'

// 🔹 Константы для баланса
const C4C_TOKEN = '0xaac20575371de01b4d10c4e7566d5453d72d56e7' as `0x${string}`
const CHAIN_ID = 56

const PIECES: any = { p:{w:'♙',b:'♟'}, n:{w:'♘',b:'♞'}, b:{w:'♗',b:'♝'}, r:{w:'♖',b:'♜'}, q:{w:'♕',b:'♛'}, k:{w:'♔',b:'♚'} }
const getPieceSymbol = (p: any) => (!p || !p.type || !p.color) ? '' : PIECES[p.type]?.[p.color] || ''

export default function ChessApp() {
  const { address, isConnected, chain } = useAccount()
  const { connect, isPending: walletPending } = useConnect()
  const { disconnect } = useDisconnect()
  const connectors = useConnectors()
  
  // 🔹 Баланс токенов — вызываем ТОЛЬКО если есть адрес и правильная сеть
  const { data: balance, isLoading: balanceLoading, refetch: refetchBalance } = useBalance({
    address: address,
    token: C4C_TOKEN,
    chainId: CHAIN_ID,
    query: { 
      enabled: !!address && chain?.id === CHAIN_ID,
      refetchInterval: 10000 // обновлять каждые 10 сек
    }
  })
  
  const [showModal, setShowModal] = useState(false)
  const [tab, setTab] = useState('profile')
  const [profile, setProfile] = useState<any>({ id:'', name:'', theme:'classic', boardTheme:'blue', description:'', avatar:'', link1Name:'', link1Url:'', link2Name:'', link2Url:'', lang:'ru' })
  const [fen, setFen] = useState(() => new Chess().fen())
  const [selected, setSelected] = useState<string|null>(null)
  const [possibleMoves, setPossibleMoves] = useState<string[]>([])
  const [over, setOver] = useState<string|null>(null)
  const [timeCtrl, setTimeCtrl] = useState(900)
  const [stake, setStake] = useState(5000)
  const [games, setGames] = useState<any[]>([])
  const [currentGame, setCurrentGame] = useState<any>(null)
  const [moveHistory, setMoveHistory] = useState<string[]>([])
  const [friends, setFriends] = useState<any[]>([])
  const [newFriendAddr, setNewFriendAddr] = useState('')
  const [clock, setClock] = useState<any>(null)
  
  // 🔹 Эффекты
  useEffect(() => { if (FIXED_CSS) injectGlobalStyles(FIXED_CSS) }, [])
  useEffect(() => { 
    const saved = loadProfileFromStorage()
    if (saved && address) setProfile({ ...saved, id: address })
    else if (address) setProfile((p:any) => ({ ...p, id: address, name: p.name || `Player_${address?.slice(2,8)}` }))
    setGames(getLobbyGames())
    setFriends(getFriends())
  }, [address])
  useEffect(() => { 
    if (profile.theme) { 
      const th = (UI_THEMES as any)[profile.theme]
      if (th) { 
        document.documentElement.style.setProperty('--bg', th.bg)
        document.documentElement.style.setProperty('--text', th.text)
        document.documentElement.style.setProperty('--accent', th.accent)
        document.documentElement.style.setProperty('--card', th.card)
      } 
    } 
  }, [profile.theme])
  useEffect(() => { 
    if (!clock || !clock.active || clock.finished) return
    const timer = setInterval(() => setClock((prev: any) => prev ? tickClock(prev) : prev), 1000)
    return () => clearInterval(timer)
  }, [clock?.active, clock?.finished])
  
  // 🔹 Функции профиля
  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => { 
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onloadend = () => updateProfile({ avatar: reader.result })
    reader.readAsDataURL(file)
  }
  const updateProfile = (updates: any) => { 
    const np = { ...profile, ...updates }
    setProfile(np)
    saveProfileToStorage(np)
  }
  const handleConnect = async (connector: any) => { 
    try { 
      await connect({ connector })
      setShowModal(false)
      // 🔹 После подключения — обновить баланс
      setTimeout(() => refetchBalance?.(), 1000)
    } catch { 
      resetConnectionStates() 
    } 
  }
  
  // 🔹 Рендер без подключения (кнопка входа)
  if (!isConnected) {
    return (
      <div style={{minHeight:'100vh', background:'var(--bg)', color:'var(--text)', padding:20, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', textAlign:'center'}}>
        <h1 style={{fontSize:36, marginBottom:16}}>♟️ {APP_NAME}</h1>
        <p style={{marginBottom:24, opacity:0.8}}>Подключи кошелёк, чтобы играть на токены C4C</p>
        
        <button 
          onClick={() => setShowModal(true)} 
          disabled={walletPending} 
          style={{
            padding:'16px 48px', 
            background: walletPending ? '#6b7280' : 'var(--accent)', 
            borderRadius:12, 
            fontSize:18, 
            color:'#fff',
            border:'none',
            cursor: walletPending ? 'not-allowed' : 'pointer'
          }}
        >
          {walletPending ? '⏳ Подключение...' : '🔗 Войти через кошелёк'}
        </button>
        
        {/* Модальное окно выбора кошелька */}
        {showModal && (
          <div style={{position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', display:'flex', alignItems:'center', justifyContent:'center'}} onClick={() => setShowModal(false)}>
            <div style={{background:'var(--card)', padding:24, borderRadius:16, maxWidth:360, width:'100%'}} onClick={(e:any) => e.stopPropagation()}>
              <h3 style={{textAlign:'center', marginBottom:20}}>Выберите кошелёк</h3>
              {connectors.map((c:any) => (
                <button 
                  key={c.id} 
                  onClick={() => handleConnect(c)} 
                  disabled={walletPending} 
                  style={{
                    width:'100%', 
                    padding:14, 
                    margin:'8px 0', 
                    background:'#3b82f6', 
                    color:'#fff', 
                    borderRadius:10,
                    border:'none',
                    cursor:'pointer',
                    display:'flex',
                    alignItems:'center',
                    gap:10
                  }}
                >
                  <span>{c.icon ? <img src={c.icon} style={{width:24,height:24}}/> : '🦊'}</span>
                  <span>{c.name}</span>
                </button>
              ))}
              <button 
                onClick={() => setShowModal(false)} 
                style={{width:'100%', padding:12, marginTop:16, background:'var(--border)', borderRadius:8, border:'none', cursor:'pointer'}}
              >
                Закрыть
              </button>
            </div>
          </div>
        )}
        
        <p style={{marginTop:32, fontSize:13, opacity:0.6}}>
          Поддерживаются: MetaMask, WalletConnect, Trust Wallet
        </p>
      </div>
    )
  }
  
  // 🔹 Основной интерфейс (после подключения)
  const balanceDisplay = balanceLoading ? '⏳' : formatC4C(balance?.value)
  
  return (
    <div style={{minHeight:'100vh', background:'var(--bg)', color:'var(--text)', padding:20}}>
      <div style={{maxWidth:700, margin:'0 auto'}}>
        
        {/* Хедер */}
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16}}>
          <h1 style={{display:'flex', alignItems:'center', gap:8}}>
            {profile.avatar ? (
              <img src={profile.avatar} style={{width:32, height:32, borderRadius:'50%', border:'2px solid var(--accent)'}}/>
            ) : '♟️'} 
            {APP_NAME}
          </h1>
          <button 
            onClick={() => disconnect()} 
            style={{background:'var(--error)', padding:'8px 16px', borderRadius:6, color:'#fff', border:'none', cursor:'pointer'}}
          >
            Выйти
          </button>
        </div>
        
        {/* Навигация */}
        <div style={{display:'flex', gap:8, marginBottom:16, flexWrap:'wrap'}}>
          {['profile','create','lobby','friends','youtube','social'].map((t:any) => (
            <button 
              key={t} 
              onClick={() => setTab(t)} 
              style={{
                flex:1, 
                minWidth:100,
                padding:10, 
                background: tab===t ? 'var(--accent)' : 'var(--card)', 
                borderRadius:8, 
                color: tab===t ? '#000' : 'var(--text)',
                border:'none',
                cursor:'pointer',
                fontWeight: tab===t ? 600 : 400
              }}
            >
              {t==='profile' ? '👤 Профиль' : 
               t==='create' ? '🎮 Создать' : 
               t==='lobby' ? '🎲 Лобби' : 
               t==='friends' ? '👥 Друзья' : 
               t==='youtube' ? '▶️ YouTube' : '🌐 Соцсети'}
            </button>
          ))}
        </div>
        
        {/* Вкладка: Профиль */}
        {tab === 'profile' && (
          <div style={{background:'var(--card)', padding:20, borderRadius:16}}>
            <div style={{display:'flex', gap:16, alignItems:'flex-start', marginBottom:16}}>
              {/* Аватар */}
              <label style={{width:80, height:80, borderRadius:'50%', background:'var(--bg)', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', overflow:'hidden', border:'3px solid var(--accent)'}}>
                {profile.avatar ? (
                  <img src={profile.avatar} style={{width:'100%', height:'100%', objectFit:'cover'}}/>
                ) : (
                  <span style={{fontSize:28}}>📷</span>
                )}
                <input type="file" accept="image/*" onChange={handleImageUpload} style={{display:'none'}}/>
              </label>
              
              {/* Инфо */}
              <div style={{flex:1}}>
                <input 
                  value={profile.name} 
                  onChange={(e:any) => updateProfile({name: e.target.value})} 
                  placeholder="Ваше имя" 
                  style={{padding:10, fontWeight:600, marginBottom:6, width:'100%', background:'var(--bg)', border:'1px solid var(--border)', borderRadius:6, color:'var(--text)'}}
                />
                <p style={{fontSize:13, opacity:0.7, marginBottom:4}}>
                  Адрес: <span style={{fontSize:11}}>{address?.slice(0,6)}...{address?.slice(-4)}</span>
                </p>
                <p style={{fontSize:13, opacity:0.7, marginBottom:8}}>
                  Сеть: <span style={{color: chain?.id === CHAIN_ID ? '#22c55e' : '#ef4444'}}>
                    {chain?.id === CHAIN_ID ? '✅ BSC' : `❌ ${chain?.name || 'Неизвестная'}`}
                  </span>
                </p>
                <p style={{fontSize:14}}>
                  Баланс: <span style={{fontSize:18, fontWeight:'bold', color:'var(--accent)'}}>
                    {balanceDisplay} C4C
                  </span>
                </p>
                <a 
                  href={C4C_BUY_URL} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  style={{display:'inline-block', marginTop:8, padding:'8px 16px', background:'linear-gradient(135deg,#ec4899,#db2777)', color:'#fff', textDecoration:'none', borderRadius:8, fontSize:13}}
                >
                  🛒 Купить C4C
                </a>
              </div>
            </div>
            
            {/* Настройки игры */}
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginTop:16}}>
              <div>
                <label style={{fontSize:12, opacity:0.7}}>⏱️ Время</label>
                <select 
                  value={timeCtrl} 
                  onChange={(e:any) => setTimeCtrl(Number(e.target.value))} 
                  style={{width:'100%', padding:8, marginTop:4, borderRadius:6, background:'var(--bg)', border:'1px solid var(--border)', color:'var(--text)'}}
                >
                  {TIME_OPTIONS.map((o:any) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
              <div>
                <label style={{fontSize:12, opacity:0.7}}>💰 Ставка</label>
                <select 
                  value={stake} 
                  onChange={(e:any) => setStake(Number(e.target.value))} 
                  style={{width:'100%', padding:8, marginTop:4, borderRadius:6, background:'var(--bg)', border:'1px solid var(--border)', color:'var(--text)'}}
                >
                  {(STAKE_OPTIONS as readonly number[]).map((val:any) => <option key={val} value={val}>{val.toLocaleString()} C4C</option>)}
                </select>
              </div>
            </div>
            <p style={{fontSize:14, marginTop:8}}>
              🏆 Призовой фонд: <span style={{color:'var(--accent)'}}>{formatPrizePool(stake)}</span>
            </p>
          </div>
        )}
        
        {/* Остальные вкладки (упрощённо) */}
        {tab === 'create' && (
          <div style={{background:'var(--card)', padding:20, borderRadius:16}}>
            <h3 style={{marginBottom:12}}>🎮 Создать новую игру</h3>
            <p style={{opacity:0.7, marginBottom:16}}>Настройте параметры и внесите ставку в C4C</p>
            {/* Форма аналогична профилю */}
            <button 
              style={{width:'100%', padding:12, background:'var(--success)', color:'#fff', borderRadius:8, fontWeight:600, border:'none', cursor:'pointer'}}
            >
              🎮 Создать игру
            </button>
          </div>
        )}
        
        {tab === 'lobby' && (
          <div style={{background:'var(--card)', padding:20, borderRadius:16}}>
            <h3 style={{marginBottom:12}}>🎲 Лобби</h3>
            {games.length === 0 ? (
              <p style={{opacity:0.7}}>Нет активных игр</p>
            ) : (
              games.map((g:any) => (
                <div key={g.id} style={{padding:12, background:'var(--bg)', borderRadius:8, marginBottom:8}}>
                  <p style={{fontWeight:600}}>🎮 {g.id.slice(0,12)}...</p>
                  <p style={{fontSize:12, opacity:0.6}}>💰 {g.balance?.toLocaleString() || '0'} C4C | ⏱️ {g.timeCtrl/60}м</p>
                </div>
              ))
            )}
          </div>
        )}
        
        {/* Шахматная доска (упрощённо) */}
        <div style={{marginTop:16, background:'var(--card)', padding:16, borderRadius:16}}>
          <div style={{textAlign:'center', padding:40, opacity:0.7}}>
            ♟️ Шахматная доска загружается...
          </div>
        </div>
        
      </div>
    </div>
  )
}
