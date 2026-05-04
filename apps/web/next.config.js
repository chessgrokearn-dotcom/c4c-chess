/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: false },
  webpack: (config, { isServer }) => {
    // 🔹 Игнорируем опциональные зависимости для React Native / pino
    config.resolve.fallback = {
      ...config.resolve.fallback,
      '@react-native-async-storage/async-storage': false,
      'pino-pretty': false,
      fs: false, net: false, tls: false, crypto: false,
      stream: false, http: false, https: false, zlib: false,
    };
    
    // 🔹 Фикс для wagmi/viem: отключаем проблемные алиасы при сборке
    if (!isServer) {
      config.externals = [
        ...(config.externals || []),
        { 'perf_hooks': 'commonjs perf_hooks' }
      ];
    }
    
    return config;
  },
};
module.exports = nextConfig;
