import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
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
  
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
