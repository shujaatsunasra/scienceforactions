import type { NextConfig } from "next";

// AGGRESSIVE SEO: Optimized configuration for GitHub Pages static export
const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'scienceforactions.me',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // Generate static HTML for better SEO
  generateEtags: false,
  poweredByHeader: false,
  
  // Optimize for static export
  distDir: 'out',
  
  // SEO optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Environment variables for SEO
  env: {
    NEXT_PUBLIC_BASE_URL: 'https://scienceforactions.me',
    NEXT_PUBLIC_SITE_NAME: 'Science for Action',
  },
  
  // Experimental features for performance
  experimental: {
    // optimizeCss: true, // Disabled due to build error
    optimizePackageImports: ['lucide-react'],
  },
  
  // Webpack optimization for faster loading
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          default: false,
          vendors: false,
          vendor: {
            chunks: 'all',
            test: /node_modules/,
            name: 'vendor',
            enforce: true,
          },
        },
      };
    }
    return config;
  },
  
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
