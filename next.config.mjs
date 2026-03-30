import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Necessário para o plugin PWA funcionar no Next.js 16 (que usa Turbopack por padrão)
  webpack: (config) => {
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'canvxsrxxclnrxxcakrk.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
};

export default withPWA(nextConfig);
