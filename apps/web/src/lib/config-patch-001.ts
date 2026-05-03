import{createConfig,http}from'wagmi';import{bsc}from'wagmi/chains';import{walletConnect,metaMask}from'wagmi/connectors';
import{APP_NAME,APP_DESCRIPTION,WALLETCONNECT_PROJECT_ID,RPC_URL}from'./config-base';

// 🔥 Минимальная фабрика: только валидные свойства wagmi v2
export function createWagmiConfigPatched(){
  return createConfig({
    chains:[bsc],
    connectors:[
      // MetaMask: dappMetadata (не dappMeta!)
      metaMask({dappMetadata:{name:APP_NAME,url:'https://c4c-chess.vercel.app'}}),
      // WalletConnect: metadata (не meta!) + projectId
      walletConnect({
        projectId:WALLETCONNECT_PROJECT_ID,
        showQrModal:true,
        metadata:{name:APP_NAME,description:APP_DESCRIPTION,url:'https://c4c-chess.vercel.app',icons:[]},
      }),
    ],
    transports:{[bsc.id]:http(RPC_URL)},
  });
}

// 🔥 Простые проверки (без сложных таймеров)
export function canConnectMetaPatched():boolean{return typeof window!=='undefined';}
export function canConnectWCPatched():boolean{return typeof window!=='undefined';}
export function forceResetConnections(){}

export const PATCH_001={
  createWagmiConfig:createWagmiConfigPatched,
  canConnectToMetaMask:canConnectMetaPatched,
  canConnectToWalletConnect:canConnectWCPatched,
  resetConnectionStates:forceResetConnections,
};
