// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  transpilePackages: ['react-big-calendar', 'react-calendar'], 
  output: 'standalone', 
};

export default nextConfig;
