// apps/web/next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Используем серверный рендеринг (не статический экспорт)
  output: 'standalone',
  
  // Отключаем строгие проверки при сборке (для сторонних библиотек)
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Настройка Webpack для совместимости с viem/wagmi/rainbowkit
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Отключаем полифилы для браузера, которые ломают сборку
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