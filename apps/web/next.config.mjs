/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    reactStrictMode: true,
    typescript: { ignoreBuildErrors: true },
    eslint: { ignoreDuringBuilds: true },
    webpack: (config) => {
      config.resolve.fallback = { fs: false, net: false, tls: false, crypto: false };
      return config;
    },
  };
  export default nextConfig;