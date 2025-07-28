import { MetadataRoute } from 'next'

export const dynamic = 'force-static'

// GOOGLE-FOCUSED: Robots.txt optimized for 1M+ user scale on Google
export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://scienceforactions.me'
  
  return {
    rules: [
      // Primary rule for Googlebot - maximum crawling
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/api/', '/admin/private/', '/_next/static/'],
        crawlDelay: 0.5, // Aggressive crawling for Google
      },
      // General rule for other bots - less aggressive
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/private/',
          '/_next/',
          '/private/',
          '*.json$',
        ],
        crawlDelay: 2,
      },
      // Special allowances for social media bots for sharing
      {
        userAgent: 'facebookexternalhit',
        allow: '/',
      },
      {
        userAgent: 'Twitterbot',
        allow: '/',
      },
    ],
    sitemap: [
      `${baseUrl}/sitemap.xml`,
    ],
    host: baseUrl,
  }
}

