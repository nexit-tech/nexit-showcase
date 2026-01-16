/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Permite QUALQUER domínio (Supabase, S3, etc)
      },
    ],
    // Desabilita otimização estrita se estiver dando erro de timeout
    unoptimized: true, 
  },
  // Garante que o CSS modules funcione bem
  reactStrictMode: true,
};

export default nextConfig;