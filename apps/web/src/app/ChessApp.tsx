'use client'

import { useState, useEffect, ChangeEvent } from 'react'
import { useAccount, useConnect, useDisconnect, useConnectors, useBalance } from 'wagmi'
import { Chess } from 'chess.js'
import {
  APP_NAME, C4C_BUY_URL, TIME_OPTIONS, STAKE_OPTIONS, UI_THEMES, UI_LANGS, UI_BOARDS, UI_TRANSLATE,
  formatTime, formatC4C, getBotMove, saveProfileToStorage, loadProfileFromStorage,
  resetConnectionStates, getFriends, addFriend, processPayout,
  FIXED_CSS, injectGlobalStyles, validateStake, formatPrizePool, formatClock,
  useApproveC4C, useCreateTokenGame, useJoinTokenGame,
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
  const [notifications, setNotifications] = useState<GameNotification[]>([])
  const [notificationFilter, setNotificationFilter] = useState<'all' | 'unread'>('all')

  const { approve, isPending: isApproving } = useApproveC4C()
  const { create: createTokenGame, isPending: isCreating } = useCreateTokenGame()
  const { join: joinTokenGame, isPending: isJoining } = useJoinTokenGame()
  
  // 🔹 Эффекты
  useEffect(() => { if (FIXED_CSS) injectGlobalStyles(FIXED_CSS) }, [])
  useEffect(() => { 
    const saved = loadProfileFromStorage()
    if (saved && address) setProfile({ ...saved, id: address })
    else if (address) setProfile((p:any) => ({ ...p, id: address, name: p.name || `Player_${address?.slice(2,8)}` }))
    setGames(getLobbyGames())
    setFriends(getFriends())
    setNotifications(getNotifications(notificationFilter))
  }, [address])
  useEffect(() => { 
    setNotifications(getNotifications(notificationFilter))
  }, [notificationFilter])
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
  
  // 🔹 Heartbeat система — обновляем онлайн-статус каждые 5 сек
  useEffect(() => {
    if (!address || !isConnected) return
    
    const heartbeat = setInterval(() => {
      updatePlayerPresence(address)
    }, 5000)
    
    // Первоначальное обновление
    updatePlayerPresence(address)
    
    return () => clearInterval(heartbeat)
  }, [address, isConnected])
  
  // 🔹 Проверка старта игр каждые 30 сек
  useEffect(() => {
    if (!address || !isConnected) return
    
    const checkGames = setInterval(() => {
      games.forEach(async (game) => {
        if (game.players?.length === 2 && game.status === 'starting') {
          const canStart = await checkAndStartGame(game.id)
          if (canStart) {
            // Определяем цвета
            const presence = JSON.parse(localStorage.getItem('c4c_presence') || '{}')
            const now = Date.now()
            const p1 = presence[game.players[0]] || 0
            const p2 = presence[game.players[1]] || 0
            
            let myColor: 'w' | 'b' = 'w'
            if (Math.abs(p1 - p2) < 2000) {
              // Оба онлайн одновременно — случайный выбор
              myColor = Math.random() < 0.5 ? 'w' : 'b'
            } else {
              // Первый онлайн получает белые
              myColor = (p1 < p2) ? 'w' : 'b'
            }
            
            // Создаём уведомление о старте
            createNotification({
              id: `start_${game.id}`,
              type: 'game_started',
              title: '🎮 Игра началась!',
              message: `Вы играете ${myColor === 'w' ? '⚪ Белыми' : '⚫ Чёрными'} против ${game.players.find((p: string) => p !== address)?.slice(0,6)}...`,
              gameId: game.id,
              read: false,
              createdAt: Date.now()
            })
            
            // Воспроизводим звук
            playStartSound()
            
            // Показываем визуальное оповещение
            showVisualAlert(game.id, myColor, game.players.find((p: string) => p !== address)?.slice(0,6) + '...')
            
            // Обновляем статус игры
            setGames(prev => prev.map(g => 
              g.id === game.id ? {...g, status: 'active', myColor} : g
            ))
            
            // Переходим к доске
            setCurrentGame({...game, status: 'active', myColor})
            setTab('board')
          }
        }
      })
    }, 30000)
    
    return () => clearInterval(checkGames)
  }, [address, isConnected, games])
  
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
          {['profile','create','lobby','notifications','friends','youtube','social'].map((t:any) => (
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
               t==='notifications' ? '🔔 Оповещ.' : 
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
        
        {/* Раздел создания игры */}
        {tab === 'create' && (
          <div style={{background:'var(--card)', padding:20, borderRadius:16}}>
            <h3 style={{marginBottom:12}}>🎯 Создать игру на токены C4C</h3>
            <p style={{opacity:0.7, marginBottom:16}}>
              Выберите время и ставку, внесите токены в баланс игры. Игра опубликуется в лобби и начнётся через 15 минут после присоединения второго игрока.
            </p>
            
            {/* Выбор времени */}
            <div style={{marginBottom:16}}>
              <label style={{display:'block', marginBottom:8, fontWeight:600}}>⏱️ Время на игру:</label>
              <select 
                value={timeCtrl} 
                onChange={(e:any) => setTimeCtrl(Number(e.target.value))}
                style={{width:'100%', padding:10, borderRadius:8, background:'var(--bg)', color:'var(--text)', border:'1px solid var(--border)'}}
              >
                {TIME_OPTIONS.map((opt:any) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            
            {/* Выбор ставки */}
            <div style={{marginBottom:16}}>
              <label style={{display:'block', marginBottom:8, fontWeight:600}}>💰 Ставка (C4C):</label>
              <select 
                value={stake} 
                onChange={(e:any) => setStake(Number(e.target.value))}
                style={{width:'100%', padding:10, borderRadius:8, background:'var(--bg)', color:'var(--text)', border:'1px solid var(--border)'}}
              >
                {STAKE_OPTIONS.map((opt:any) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <p style={{fontSize:12, opacity:0.6, marginTop:4}}>
                🏆 Призовой фонд: {formatPrizePool(stake)} | 💰 Ваш баланс: {balance ? formatC4C(balance.value) : 'Загрузка...'}
              </p>
            </div>
            
            {/* Кнопка создания */}
            <button 
              onClick={async () => {
                if (!address) return alert('Подключите кошелёк!')
                if (!validateStake(stake)) return alert('Неверная ставка!')
                
                if (!confirm(`🎮 Создать игру на токены?\n💰 Ставка: ${formatC4C(stake)} C4C\n🏆 Фонд: ${formatPrizePool(stake)}\n⚠️ Токены спишутся с вашего кошелька в баланс игры.`)) return;
                
                try {
                  const gameId = `game_${Date.now()}_${Math.random().toString(36).slice(2,9)}`;
                  const invite = generateGameInvite(gameId, `Игра ${gameId.slice(-8)}`, stake, timeCtrl);
                  const gameData = {
                    id: gameId,
                    creator: address,
                    stake,
                    timeCtrl,
                    status: 'waiting',
                    balance: stake,
                    createdAt: Date.now(),
                    players: [address],
                    startAt: 0
                  };

                  publishGameToLobby(gameData);
                  setGames(prev => [...prev, gameData]);
                  setNotifications(getNotifications(notificationFilter));

                  createNotification({
                    type: 'game_created',
                    title: '🎮 Игра создана!',
                    message: `Ожидаем второго игрока. Ссылка: ${invite.link}`,
                    gameId,
                    read: false,
                    createdAt: Date.now()
                  });
                  setNotifications(getNotifications(notificationFilter));

                  if (!isApproving) {
                    await approve(stake);
                  }
                  if (!isCreating) {
                    await createTokenGame(timeCtrl, stake);
                  }

                  alert('✅ Игра создана! Игра опубликована в лобби.');
                  setTab('lobby');
                  
                } catch (error) {
                  console.error('Ошибка создания игры:', error);
                  alert('❌ Ошибка создания игры');
                }
              }}
              disabled={!balance || balance.value < BigInt(stake) || isApproving || isCreating}
              style={{
                width:'100%', 
                padding:14, 
                background: (!balance || balance.value < BigInt(stake) || isApproving || isCreating) ? '#6b7280' : 'var(--success)', 
                color:'#fff', 
                borderRadius:8, 
                fontWeight:600, 
                border:'none', 
                cursor: (!balance || balance.value < BigInt(stake) || isApproving || isCreating) ? 'not-allowed' : 'pointer',
                marginBottom: 12
              }}
            >
              🎮 Создать игру на токены
            </button>
            
            {/* Ссылка на покупку токенов */}
            <p style={{textAlign:'center', fontSize:12, opacity:0.6}}>
              Недостаточно C4C? <a href={C4C_BUY_URL} target="_blank" style={{color:'var(--accent)'}}>Купить токены</a>
            </p>
          </div>
        )}
        
        {tab === 'lobby' && (
          <div style={{background:'var(--card)', padding:20, borderRadius:16}}>
            <h3 style={{marginBottom:12}}>🎲 Лобби</h3>
            {games.length === 0 ? (
              <p style={{opacity:0.7}}>Нет активных игр</p>
            ) : (
              games.map((g:any) => (
                <div key={g.id} style={{padding:12, background:'var(--bg)', borderRadius:8, marginBottom:8, border: g.creator === address ? '2px solid var(--accent)' : '1px solid var(--border)'}}>
                  <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                    <div>
                      <p style={{fontWeight:600}}>🎮 {g.id.slice(0,12)}...</p>
                      <p style={{fontSize:12, opacity:0.6}}>
                        💰 Баланс: {g.balance?.toLocaleString() || '0'} C4C | 🏆 Фонд: {formatPrizePool(g.stake || 0)} | ⏱️ {formatTime(g.timeCtrl)}
                      </p>
                      <p style={{fontSize:11, opacity:0.5}}>
                        👤 {g.creator === address ? 'Вы создали' : `Создатель: ${g.creator?.slice(0,6)}...${g.creator?.slice(-4)}`}
                      </p>
                    </div>
                    <div style={{display:'flex', flexDirection:'column', gap:4}}>
                      {g.creator !== address && (
                        <button 
                          onClick={() => {
                            const invite = generateGameInvite(g.id, `Игра ${g.id.slice(-8)}`, g.stake, g.timeCtrl);
                            navigator.clipboard.writeText(invite.link);
                            alert('📋 Ссылка скопирована!');
                          }}
                          style={{padding:'4px 8px', background:'#3b82f6', color:'#fff', borderRadius:6, border:'none', cursor:'pointer', fontSize:11}}
                        >
                          📩
                        </button>
                      )}
                      <button 
                        onClick={async () => {
                          if (g.creator === address) return alert('Это ваша игра!');
                          
                          if (!confirm(`▶️ Присоединиться к игре?\n💰 Ставка: ${formatC4C(g.stake)} C4C\n🏆 Фонд: ${formatPrizePool(g.stake)}`)) return;
                          
                          try {
                            const updatedGame = {
                              ...g,
                              players: [...(g.players || []), address],
                              status: 'starting',
                              startAt: Date.now() + 15 * 60 * 1000
                            };

                            publishGameToLobby(updatedGame);
                            setGames(prev => prev.map(game => game.id === g.id ? updatedGame : game));
                            setNotifications(getNotifications(notificationFilter));

                            createNotification({
                              type: 'game_joined',
                              title: '🎮 Игрок присоединился!',
                              message: `Игра стартует через 15 минут. Соперник: ${g.creator?.slice(0,6)}...`,
                              gameId: g.id,
                              read: false,
                              createdAt: Date.now()
                            });
                            setNotifications(getNotifications(notificationFilter));

                            if (!isApproving) {
                              await approve(g.stake);
                            }
                            if (!isJoining) {
                              await joinTokenGame(g.id);
                            }

                            alert('✅ Вы присоединились! Игра будет запущена через 15 минут.');
                          } catch (error) {
                            console.error('Ошибка присоединения:', error);
                            alert('❌ Ошибка присоединения к игре');
                          }
                        }}
                        style={{padding:'6px 12px', background:'var(--success)', color:'#fff', borderRadius:6, border:'none', cursor:'pointer', fontSize:12}}
                      >
                        ▶️ Играть
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
        
        {/* Раздел оповещений */}
        {tab === 'notifications' && (
          <div style={{background:'var(--card)', padding:20, borderRadius:16}}>
            <h3 style={{marginBottom:12}}>🔔 Оповещения</h3>
            
            {/* Фильтры */}
            <div style={{display:'flex', gap:8, marginBottom:16}}>
              <button 
                onClick={() => setNotificationFilter('all')}
                style={{
                  padding:'8px 16px', 
                  background: notificationFilter === 'all' ? 'var(--accent)' : 'var(--bg)', 
                  color: notificationFilter === 'all' ? '#fff' : 'var(--text)', 
                  borderRadius:8, 
                  border:'none', 
                  cursor:'pointer'
                }}
              >
                Все
              </button>
              <button 
                onClick={() => setNotificationFilter('unread')}
                style={{
                  padding:'8px 16px', 
                  background: notificationFilter === 'unread' ? 'var(--accent)' : 'var(--bg)', 
                  color: notificationFilter === 'unread' ? '#fff' : 'var(--text)', 
                  borderRadius:8, 
                  border:'none', 
                  cursor:'pointer'
                }}
              >
                Непрочитанные
              </button>
            </div>
            
            {/* Список оповещений */}
            {notifications.length === 0 ? (
              <p style={{opacity:0.7}}>Нет оповещений</p>
            ) : (
              notifications.map((n: GameNotification) => (
                <div 
                  key={n.id}
                  onClick={() => {
                    markNotificationRead(n.id);
                    setNotifications(getNotifications(notificationFilter));
                    if (n.gameId) {
                      setCurrentGame(games.find(g => g.id === n.gameId));
                      setTab('board');
                    }
                  }}
                  style={{
                    padding:12, 
                    background:'var(--bg)', 
                    borderRadius:8, 
                    marginBottom:8, 
                    border: n.read ? '1px solid var(--border)' : '2px solid var(--success)',
                    cursor:'pointer',
                    position:'relative'
                  }}
                >
                  {!n.read && (
                    <div style={{
                      position:'absolute', 
                      top:8, 
                      right:8, 
                      width:8, 
                      height:8, 
                      background:'var(--success)', 
                      borderRadius:'50%'
                    }}></div>
                  )}
                  <p style={{fontWeight: n.read ? 400 : 600, marginBottom:4}}>{n.title}</p>
                  <p style={{fontSize:12, opacity:0.7, marginBottom:4}}>{n.message}</p>
                  <p style={{fontSize:10, opacity:0.5}}>
                    {new Date(n.createdAt || n.timestamp).toLocaleString('ru-RU')}
                  </p>
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
