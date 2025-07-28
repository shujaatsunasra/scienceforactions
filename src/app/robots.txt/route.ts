import { NextResponse } from 'next/server';

export async function GET() {
  const robotsTxt = `User-agent: *
Allow: /

# Allow all search engines to crawl the site
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: Slurp
Allow: /

User-agent: DuckDuckBot
Allow: /

User-agent: Baiduspider
Allow: /

User-agent: YandexBot
Allow: /

User-agent: facebookexternalhit
Allow: /

User-agent: Twitterbot
Allow: /

User-agent: LinkedInBot
Allow: /

# Sitemap location
Sitemap: https://scienceforactions.me/sitemap.xml

# Crawl delay (be gentle)
Crawl-delay: 1

# Block admin paths for security
Disallow: /admin/
Disallow: /api/internal/
Disallow: /_next/
Disallow: /static/

# Allow important paths
Allow: /action
Allow: /explore
Allow: /main
Allow: /profile
Allow: /topic/
Allow: /tool/

# Performance optimization - allow static assets
Allow: /favicon.ico
Allow: /robots.txt
Allow: /sitemap.xml
Allow: /manifest.json
Allow: /public/

# SEO boost - explicitly allow key landing pages
Allow: /action/
Allow: /explore/
Allow: /main/
Allow: /topic/*
Allow: /tool/*

# Host directive for clarity
Host: https://scienceforactions.me
`;

  return new NextResponse(robotsTxt, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400', // Cache for 24 hours
    },
  });
}

