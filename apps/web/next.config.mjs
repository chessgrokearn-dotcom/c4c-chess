/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: false,
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false, net: false, tls: false, crypto: false,
      '@react-native-async-storage/async-storage': false,
      'pino-pretty': false, 'react-native': false,
    };
    config.ignoreWarnings = [
      { module: /@metamask\/sdk/ },
      { module: /@walletconnect/ },
      { module: /pino/ },
    ];
    return config;
  },
};
export default nextConfig;