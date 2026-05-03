'use client';
import{useState,useEffect}from'react';
import{useAccount,useConnect,useDisconnect,useConnectors,useBalance}from'wagmi';
import{Chess}from'chess.js';
import{C4C_TOKEN_ADDRESS,CHAIN_ID,APP_NAME,APP_DESCRIPTION,WALLETCONNECT_PROJECT_ID,C4C_BUY_URL,TIME_OPTIONS,STAKE_OPTIONS,BOARD_THEMES,formatTime,formatC4C,getBotMove,PIECE_SYMBOLS,canConnectToMetaMask,canConnectToWalletConnect,resetConnectionStates,type BoardThemeId}from'@/lib/config';

function getPieceColor(c:'white'|'black'){return c==='white'?'#fff':'#111';}

function ChessApp(){
  const{address,isConnected,chain}=useAccount();
  const{connect,isPending}=useConnect();
  const{disconnect}=useDisconnect();
  const connectors=useConnectors();
  const[showModal,setShowModal]=useState(false);
  const[isClient,setIsClient]=useState(false);
  const[fen,setFen]=useState<string>(()=>new Chess().fen());
  const[selected,setSelected]=useState<any>(null);
  const[possible,setPossible]=useState<any[]>([]);
  const[mode,setMode]=useState<'bot'|'pvp'>('bot');
  const[timeCtrl,setTimeCtrl]=useState(900);
  const[wTime,setWTime]=useState(900);
  const[bTime,setBTime]=useState(900);
  const[over,setOver]=useState<string|null>(null);
  const[boardTheme,setBoardTheme]=useState<BoardThemeId>('classic');
  
  const balanceResult=useBalance({address,token:C4C_TOKEN_ADDRESS as`0x${string}`,query:{enabled:!!address&&!!chain?.id&&chain.id===CHAIN_ID}});
  const balance=balanceResult.data;
  const balanceStatus=balanceResult.status;
  
  useEffect(()=>{setIsClient(true);},[]);
  useEffect(()=>{setWTime(timeCtrl);setBTime(timeCtrl);setOver(null);},[timeCtrl]);
  useEffect(()=>{if(over)return;const g=new Chess(fen);const isW=g.turn()==='w';if((isW?wTime:bTime)<=0){setOver(isW?'⚪ Время вышло!':'⚫ Время вышло!');return;}const t=setInterval(()=>{isW?setWTime(p=>Math.max(0,p-1)):setBTime(p=>Math.max(0,p-1));},1000);return()=>clearInterval(t);},[fen,wTime,bTime,over]);
  useEffect(()=>{if(mode==='bot'&&!over){const g=new Chess(fen);if(g.turn()==='b'&&!g.isGameOver()){const t=setTimeout(()=>{const moves=g.moves({verbose:true});const mv=getBotMove(moves);if(mv){g.move(mv);setFen(g.fen());setBTime(p=>Math.max(0,p-4));if(g.isCheckmate())setOver('⚫ Бот победил!');}},4000);return()=>clearTimeout(t);}}},[fen,mode,over]);
  
  // 🔥 ПРОСТОЙ вход: как в Фазе 1
  const handleConnect=async(connector:any)=>{
    try{
      await connect({connector});
      setShowModal(false);
    }catch(e:any){
      console.error('Connect error:',e);
      alert('❌ Ошибка подключения. Попробуйте снова.');
      resetConnectionStates();
    }
  };
  
  const click=(sq:string)=>{
    if(over)return;
    const s=sq as any;
    if(selected===s){setSelected(null);setPossible([]);return;}
    const g=new Chess(fen);
    if(selected){try{const m=g.move({from:selected,to:s,promotion:'q'});if(m){setFen(g.fen());setSelected(null);setPossible([]);if(mode==='bot')setWTime(p=>Math.max(0,p-1));if(g.isCheckmate())setOver('⚪ Вы победили!');return;}}catch{}}
    const piece=g.get(s);
    if(piece&&piece.color===g.turn()&&(mode==='pvp'||piece.color==='w')){setSelected(s);setPossible(g.moves({square:s,verbose:true}).map((m:any)=>m.to));}
    else{setSelected(null);setPossible([]);}
  };
  
  const reset=()=>{setFen(new Chess().fen());setSelected(null);setPossible([]);setWTime(timeCtrl);setBTime(timeCtrl);setOver(null);};
  const g=new Chess(fen);
  
  const getPieceSymbol=(p:any)=>{if(!p||!p.type||!p.color)return'';return(PIECE_SYMBOLS as any)[p.type]?.[p.color]||'';};
  
  if(!isClient)return<main style={{minHeight:'100vh',background:'var(--bg)',color:'var(--text)',display:'flex',alignItems:'center',justifyContent:'center'}}><p>⏳ Загрузка...</p></main>;
  
  // 🔥 ЭКРАН ВХОДА КАК В ФАЗЕ 1
  if(!isConnected)return(<main style={{minHeight:'100vh',background:'var(--bg)',color:'var(--text)',padding:20,display:'flex',flexDirection:'column',alignItems:'center',textAlign:'center'}}>
    <h1 style={{fontSize:36,marginBottom:16}}>♟️{APP_NAME}</h1>
    <p style={{marginBottom:24,opacity:0.8}}>{APP_DESCRIPTION}</p>
    
    <button onClick={()=>setShowModal(true)}disabled={isPending}style={{padding:'16px 48px',background:isPending?'#6b7280':'var(--accent)',borderRadius:12,fontSize:18,fontWeight:600}}>
      {isPending?'⏳ Подключение...':'🔗 Войти в приложение'}
    </button>
    
    {showModal&&<div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.85)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000}}onClick={()=>setShowModal(false)}>
      <div style={{background:'var(--card)',padding:24,borderRadius:16,maxWidth:360,width:'100%'}}onClick={e=>e.stopPropagation()}>
        <h3 style={{textAlign:'center',marginBottom:20,fontSize:20}}>Выберите кошелёк</h3>
        
        {/* 🔥 MetaMask: открывается расширение в браузере */}
        <button onClick={()=>{
          const mm=connectors.find((c:any)=>c.type==='metaMask'||c.id?.includes('metamask'));
          if(mm)handleConnect(mm);
        }}disabled={isPending}style={{width:'100%',padding:14,margin:'8px 0',background:'#f59e0b',borderRadius:10,fontSize:16,fontWeight:600}}>
          🦊 MetaMask (браузер)
        </button>
        
        {/* 🔥 WalletConnect: показывает QR-код для телефона */}
        <button onClick={()=>{
          const wc=connectors.find((c:any)=>c.type==='walletConnect');
          if(wc)handleConnect(wc);
        }}disabled={isPending}style={{width:'100%',padding:14,margin:'8px 0',background:'#3b82f6',borderRadius:10,fontSize:16,fontWeight:600}}>
          📱 WalletConnect (QR-код)
        </button>
        
        <button onClick={()=>setShowModal(false)}style={{width:'100%',padding:12,marginTop:16,background:'var(--border)',borderRadius:8}}>
          Закрыть
        </button>
      </div>
    </div>}
  </main>);
  
  // 🔥 ГЛАВНЫЙ ЭКРАН (после входа)
  return(<main style={{minHeight:'100vh',background:'var(--bg)',color:'var(--text)',padding:20}}>
    <div style={{maxWidth:640,margin:'0 auto'}}>
      <header style={{display:'flex',justifyContent:'space-between',alignItems:'center',paddingBottom:20,borderBottom:'1px solid var(--border)'}}>
        <h1>♟️{APP_NAME}</h1>
        <button onClick={()=>disconnect()}style={{background:'var(--error)',padding:'8px 16px',borderRadius:6}}>Выйти</button>
      </header>
      
      <section style={{padding:24,background:'var(--card)',borderRadius:16,marginBottom:16}}>
        <p style={{fontSize:13,opacity:0.7}}>Адрес кошелька</p>
        <p style={{fontFamily:'monospace',fontSize:14,color:'#22c55e',wordBreak:'break-all',margin:'8px 0'}}>{address}</p>
        <p style={{fontSize:13,opacity:0.7,marginTop:16}}>Баланс {APP_NAME}</p>
        <p style={{fontSize:28,fontWeight:'bold',color:'var(--accent)'}}>{balanceStatus==='success'&&balance?formatC4C(balance.value):'0.00'} C4C</p>
        <a href={C4C_BUY_URL}target="_blank"rel="noopener noreferrer"style={{display:'inline-block',marginTop:12,padding:'10px 20px',background:'linear-gradient(135deg,#ec4899,#db2777)',color:'#fff',textDecoration:'none',borderRadius:10,fontSize:14}}>🛒 Купить C4C на Pink.Meme</a>
      </section>
      
      <section style={{padding:20,background:'var(--card)',borderRadius:16}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
          <h3 style={{fontSize:18}}>♟️ Доска</h3>
          <div style={{display:'flex',gap:8}}>
            <select value={mode}onChange={e=>{setMode(e.target.value as any);reset();}}style={{padding:8,borderRadius:6}}><option value="bot">🤖 Бот</option><option value="pvp">👥 PvP</option></select>
            <select value={timeCtrl}onChange={e=>{setTimeCtrl(Number(e.target.value));reset();}}style={{padding:8,borderRadius:6}}>{TIME_OPTIONS.map(o=><option key={o.value}value={o.value}>{o.label}</option>)}</select>
          </div>
        </div>
        
        <div style={{display:'flex',justifyContent:'space-between',padding:12,background:'var(--bg)',borderRadius:8,marginBottom:16}}>
          <div><span style={{fontSize:12,opacity:0.7}}>⚪ Белые</span><p style={{fontSize:20,fontWeight:'bold',margin:0}}>{formatTime(wTime)}</p></div>
          <div style={{textAlign:'right'}}><span style={{fontSize:12,opacity:0.7}}>⚫ Чёрные</span><p style={{fontSize:20,fontWeight:'bold',margin:0}}>{formatTime(bTime)}</p></div>
        </div>
        
        <div style={{display:'grid',gridTemplateColumns:'repeat(8,1fr)',gap:1,background:'var(--border)',borderRadius:8,maxWidth:320,margin:'0 auto'}}>
          {['8','7','6','5','4','3','2','1'].map((r,ri)=>['a','b','c','d','e','f','g','h'].map((f,fi)=>{
            const sq=`${f}${r}`as any;const p=g.get(sq);const theme=BOARD_THEMES[boardTheme];const bg=(fi+ri)%2===0?theme.light:theme.dark;const pc=p?.color==='w'?'white':'black';const sym=getPieceSymbol(p);
            return(<div key={sq}onClick={()=>click(sq)}style={{aspectRatio:1,background:bg,display:'flex',alignItems:'center',justifyContent:'center',cursor:p?'pointer':'default',fontSize:40,color:getPieceColor(pc),position:'relative',border:selected===sq?'3px solid var(--accent)':'none'}}>{sym}</div>);
          }))}
        </div>
        
        <div style={{textAlign:'center',marginTop:16}}>
          {over&&<p style={{color:'var(--error)',fontWeight:'bold',marginBottom:8}}>{over}</p>}
          <button onClick={reset}style={{padding:'10px 24px',background:'#3b82f6',borderRadius:8}}>🔄 Новая игра</button>
        </div>
      </section>
    </div>
  </main>);
}

export default function Page(){return<ChessApp/>;}
