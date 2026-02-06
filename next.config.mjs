/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // <--- Adicionado para reduzir RAM
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Permite QUALQUER domínio
      },
    ],
    unoptimized: true, 
  },
  reactStrictMode: true,
};

export default nextConfig;