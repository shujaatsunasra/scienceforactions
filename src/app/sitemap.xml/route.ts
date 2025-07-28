import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function GET() {
  try {
    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Fetch sitemap data from database
    const { data: sitemapData, error } = await supabase
      .from('sitemap_data')
      .select('*')
      .eq('status', 'active')
      .order('priority', { ascending: false });

    if (error) {
      // Production: debug output removed
    }

    // Default sitemap entries
    const defaultEntries = [
      {
        url: '/',
        lastModified: new Date().toISOString(),
        changeFrequency: 'daily',
        priority: 1.0
      },
      {
        url: '/action',
        lastModified: new Date().toISOString(),
        changeFrequency: 'daily',
        priority: 0.9
      },
      {
        url: '/explore',
        lastModified: new Date().toISOString(),
        changeFrequency: 'daily',
        priority: 0.8
      },
      {
        url: '/main',
        lastModified: new Date().toISOString(),
        changeFrequency: 'daily',
        priority: 0.7
      },
      {
        url: '/profile',
        lastModified: new Date().toISOString(),
        changeFrequency: 'weekly',
        priority: 0.6
      }
    ];

    // Combine database entries with defaults
    const allEntries = [
      ...defaultEntries,
      ...(sitemapData || []).map((entry: any) => ({
        url: entry.url,
        lastModified: entry.last_modified || new Date().toISOString(),
        changeFrequency: entry.change_frequency || 'weekly',
        priority: entry.priority || 0.5
      }))
    ];

    // Remove duplicates
    const uniqueEntries = allEntries.filter((entry, index, self) => 
      index === self.findIndex(e => e.url === entry.url)
    );

    // Generate XML sitemap
    const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${uniqueEntries.map(entry => `  <url>
    <loc>https://scienceforactions.me${entry.url}</loc>
    <lastmod>${new Date(entry.lastModified).toISOString()}</lastmod>
    <changefreq>${entry.changeFrequency}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

    return new NextResponse(sitemapXml, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600', // Cache for 1 hour
      },
    });
  } catch (error) {
    // Production: debug output removed
    
    // Return basic sitemap on error
    const basicSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://scienceforactions.me/</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://scienceforactions.me/action</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://scienceforactions.me/explore</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>`;

    return new NextResponse(basicSitemap, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  }
}

