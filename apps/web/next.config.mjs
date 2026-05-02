// apps/web/next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
    // Отключаем минификацию для отладки (помогает с ошибками типа l.vX)
    productionBrowserSourceMaps: true,
    
    webpack: (config, { isServer }) => {
      // Исправляем проблемы с импортами для viem/wagmi
      if (!isServer) {
        config.resolve.fallback = {
          ...config.resolve.fallback,
          fs: false,
          net: false,
          tls: false,
          crypto: false,
        };
      }
      return config;
    },
  };
  
  export default nextConfig;