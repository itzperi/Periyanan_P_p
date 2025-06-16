import type {NextConfig} from 'next';

const CLERK_FRONTEND_API = "pretty-stinkbug-54.clerk.accounts.dev";

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
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              `script-src 'self' 'unsafe-eval' 'unsafe-inline' https://${CLERK_FRONTEND_API} https://*.clerk.com https://acteur.clerk.internal`,
              `style-src 'self' 'unsafe-inline' https://${CLERK_FRONTEND_API} https://*.clerk.com`,
              `img-src 'self' data: https://img.clerk.com https://images.clerk.dev https://${CLERK_FRONTEND_API}`,
              `font-src 'self' https://${CLERK_FRONTEND_API} https://*.clerk.com`,
              `frame-src https://${CLERK_FRONTEND_API} https://*.clerk.com`,
              `connect-src 'self' https://${CLERK_FRONTEND_API} https://*.clerk.com https://api.clerk.com`,
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'none'",
            ].join('; '),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
