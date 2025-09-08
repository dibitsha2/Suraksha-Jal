
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
       {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  devIndicators: {
    buildActivity: false,
  },
  // This is a temporary workaround for a Next.js 15 bug
  // that causes the server to restart in a loop.
  experimental: {
    allowedDevOrigins: [
      'https://*.cloudworkstations.dev',
      'https://*.firebase.studio',
    ]
  },
};

export default nextConfig;
