import type { NextConfig } from "next";
import { env } from "process";

const nextConfig: NextConfig = {
  output: env.NODE_ENV === 'production' ? 'standalone' : undefined, // Enable standalone output for Docker optimization only
  eslint: {
    ignoreDuringBuilds: true, // Don't fail build on ESLint errors
  },
  images: {
    // Allow images from our custom route handler
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/media/**',
      },
      // Only add HTTPS pattern if NEXT_PUBLIC_APP_URL is defined
      ...(env.NEXT_PUBLIC_APP_URL ? [{
        protocol: 'https' as const,
        hostname: env.NEXT_PUBLIC_APP_URL,
        pathname: '/media/**',
      }] : []),
    ],
    formats: ['image/webp', 'image/avif'],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '5mb', // Increase body size limit for Server Actions
    },
  },
};

export default nextConfig;
