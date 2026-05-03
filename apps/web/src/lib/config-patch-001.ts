// apps/web/src/lib/config-patch-001.ts
// 🔹 ПАТЧ 1: Исправление "already pending" + авто-сброс состояния
// Применяется поверх config-base.ts через master-config.ts

// 🔥 Исправленная фабрика wagmi с обработкой ошибок
export function createWagmiConfigPatched(){
  const { createConfig, http } = require('wagmi');
  const { bsc } = require('wagmi/chains');
  const { walletConnect, metaMask } = require('wagmi/connectors');
  
  // Импортируем константы из базы
  const { APP_NAME, APP_DESCRIPTION, WALLETCONNECT_PROJECT_ID, RPC_URL } = require('./config-base');
  
  return createConfig({
    chains:[bsc],
    connectors:[
      metaMask({
        dappMeta:{name:APP_NAME,url:'https://c4c-chess.vercel.app'},
        async onConnectError(error:any){
          console.warn('MetaMask error:',error);
          if(typeof window!=='undefined'){
            (window as any).__c4c_mm_pending = false;
            (window as any).__c4c_mm_error = Date.now();
          }
        }
      }),
      walletConnect({
        projectId:WALLETCONNECT_PROJECT_ID,
        showQrModal:true,
        meta:{name:APP_NAME,description:APP_DESCRIPTION,url:'https://c4c-chess.vercel.app',icons:[]},
        async onConnectError(error:any){
          console.warn('WalletConnect error:',error);
          if(typeof window!=='undefined'){
            (window as any).__c4c_wc_pending = false;
            (window as any).__c4c_wc_error = Date.now();
          }
        }
      }),
    ],
    transports:{[bsc.id]:http(RPC_URL)},
  });
}

// 🔥 Исправленные хелперы подключения с авто-сбросом
export function canConnectMetaPatched():boolean{
  if(typeof window==='undefined')return true;
  const now=Date.now();
  const lastError=(window as any).__c4c_mm_error||0;
  if(now-lastError<5000){console.warn('Waiting after MetaMask error...');return false;}
  const pending=(window as any).__c4c_mm_pending;
  if(pending){console.warn('MetaMask already pending');return false;}
  (window as any).__c4c_mm_pending=true;
  setTimeout(()=>{if(typeof window!=='undefined')(window as any).__c4c_mm_pending=false;},10000);
  return true;
}

export function canConnectWCPatched():boolean{
  if(typeof window==='undefined')return true;
  const now=Date.now();
  const lastError=(window as any).__c4c_wc_error||0;
  if(now-lastError<5000){console.warn('Waiting after WC error...');return false;}
  const pending=(window as any).__c4c_wc_pending;
  if(pending){console.warn('WalletConnect already pending');return false;}
  (window as any).__c4c_wc_pending=true;
  setTimeout(()=>{if(typeof window!=='undefined')(window as any).__c4c_wc_pending=false;},10000);
  return true;
}

// 🔥 Принудительный сброс состояния
export function forceResetConnections(){
  if(typeof window!=='undefined'){
    (window as any).__c4c_mm_pending=false;
    (window as any).__c4c_wc_pending=false;
    (window as any).__c4c_mm_error=0;
    (window as any).__c4c_wc_error=0;
    console.log('Connection states reset');
  }
}

// 🔥 Экспортируем только исправленные функции
export const PATCH_001 = {
  createWagmiConfig: createWagmiConfigPatched,
  canConnectToMetaMask: canConnectMetaPatched,
  canConnectToWalletConnect: canConnectWCPatched,
  resetConnectionStates: forceResetConnections,
};