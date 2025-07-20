import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://scienceforactions.me'
  
  // Core pages
  const routes = [
    '',
    '/main',
    '/explore', 
    '/tool',
    '/profile'
  ]

  const sitemap = routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' || route === '/main' ? 'daily' as const : 'weekly' as const,
    priority: route === '' ? 1 : route === '/main' ? 0.9 : 0.8,
  }))

  // Add dynamic content routes if needed
  // Example: causes, campaigns, etc.
  // These could be generated from your database or API
  
  return sitemap
}
