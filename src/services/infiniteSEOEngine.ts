"use client";

import { supabaseUserService } from './supabaseUserService';
import { supabase } from '@/lib/supabase';

interface SEOData {
  title: string;
  description: string;
  keywords: string[];
  ogImage?: string;
  structuredData?: any;
  canonicalUrl?: string;
}

interface SitemapEntry {
  url: string;
  lastModified: string;
  changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
}

export class InfiniteSEOEngine {
  private baseUrl: string = 'https://scienceforactions.me';
  private seoCache: Map<string, SEOData> = new Map();
  private sitemapCache: SitemapEntry[] = [];
  private lastSitemapUpdate: number = 0;
  private isRunning: boolean = false;

  constructor() {
    this.initializeEngine();
  }

  private async initializeEngine(): Promise<void> {
    try {
      // Generate initial sitemap
      await this.generateDynamicSitemap();
      
      // Schedule regular updates
      this.startAutoUpdates();
      
      // Production: debug output removed
    } catch (error) {
      // Production: debug output removed
    }
  }

  public startAutoUpdates(): void {
    if (this.isRunning) return;
    
    this.isRunning = true;
    
    // Update sitemap every 5 minutes
    setInterval(() => {
      this.generateDynamicSitemap();
    }, 5 * 60 * 1000);
    
    // Ping search engines every hour
    setInterval(() => {
      this.pingSearchEngines();
    }, 60 * 60 * 1000);
    
    // Refresh meta data every 10 minutes
    setInterval(() => {
      this.refreshSEOData();
    }, 10 * 60 * 1000);
  }

  public stopAutoUpdates(): void {
    this.isRunning = false;
  }

  // Generate dynamic sitemap based on current content
  public async generateDynamicSitemap(): Promise<SitemapEntry[]> {
    try {
      const sitemap: SitemapEntry[] = [];
      const now = new Date().toISOString();

      // Static pages with high priority
      const staticPages = [
        { path: '/', priority: 1.0, changeFreq: 'daily' as const },
        { path: '/main', priority: 1.0, changeFreq: 'daily' as const },
        { path: '/explore', priority: 0.9, changeFreq: 'hourly' as const },
        { path: '/tool', priority: 0.9, changeFreq: 'daily' as const },
        { path: '/profile', priority: 0.6, changeFreq: 'weekly' as const },
        { path: '/admin', priority: 0.3, changeFreq: 'monthly' as const },
      ];

      staticPages.forEach(page => {
        sitemap.push({
          url: `${this.baseUrl}${page.path}`,
          lastModified: now,
          changeFrequency: page.changeFreq,
          priority: page.priority
        });
      });

      // Dynamic action pages
      const actions = await supabaseUserService.getActions(1000);
      actions.forEach(action => {
        sitemap.push({
          url: `${this.baseUrl}/action/${action.id}`,
          lastModified: action.updated_at || action.created_at || now,
          changeFrequency: 'weekly',
          priority: 0.7
        });
      });

      // Topic/category pages
      const categories = await this.getUniqueCategories();
      categories.forEach(category => {
        sitemap.push({
          url: `${this.baseUrl}/topic/${encodeURIComponent(category.toLowerCase())}`,
          lastModified: now,
          changeFrequency: 'daily',
          priority: 0.8
        });
      });

      // Tag pages
      const tags = await this.getPopularTags();
      tags.forEach(tag => {
        sitemap.push({
          url: `${this.baseUrl}/tag/${encodeURIComponent(tag.toLowerCase())}`,
          lastModified: now,
          changeFrequency: 'weekly',
          priority: 0.6
        });
      });

      this.sitemapCache = sitemap;
      this.lastSitemapUpdate = Date.now();

      // Generate and save sitemap.xml
      await this.saveSitemapXML();

      return sitemap;
    } catch (error) {
      // Production: debug output removed
      return [];
    }
  }

  private async getUniqueCategories(): Promise<string[]> {
    try {
      const { data } = await supabase
        .from('action_items')
        .select('category')
        .not('category', 'is', null);

      const categories = [...new Set(data?.map(item => item.category) || [])];
      return categories.filter(Boolean);
    } catch {
      return [];
    }
  }

  private async getPopularTags(): Promise<string[]> {
    try {
      const { data } = await supabase
        .from('action_items')
        .select('tags')
        .not('tags', 'is', null)
        .limit(100);

      const allTags: string[] = [];
      data?.forEach(item => {
        if (Array.isArray(item.tags)) {
          allTags.push(...item.tags);
        }
      });

      // Count tag frequency and return top 50
      const tagCounts: { [key: string]: number } = {};
      allTags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });

      return Object.entries(tagCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 50)
        .map(([tag]) => tag);
    } catch {
      return [];
    }
  }

  private async saveSitemapXML(): Promise<void> {
    try {
      let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
      xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

      this.sitemapCache.forEach(entry => {
        xml += '  <url>\n';
        xml += `    <loc>${entry.url}</loc>\n`;
        xml += `    <lastmod>${entry.lastModified}</lastmod>\n`;
        xml += `    <changefreq>${entry.changeFrequency}</changefreq>\n`;
        xml += `    <priority>${entry.priority}</priority>\n`;
        xml += '  </url>\n';
      });

      xml += '</urlset>';

      // In a real implementation, you would save this to your public directory
      // For now, we'll store it in a way that can be accessed by the sitemap route
      await this.storeSitemapData(xml);
      
      // Production: debug output removed
    } catch (error) {
      // Production: debug output removed
    }
  }

  private async storeSitemapData(xmlContent: string): Promise<void> {
    try {
      // Store sitemap data in Supabase for the API route to access
      await supabase
        .from('sitemap_data')
        .upsert([{
          id: 'main',
          xml_content: xmlContent,
          generated_at: new Date().toISOString(),
          url_count: this.sitemapCache.length
        }]);
    } catch (error) {
      // Production: debug output removed
    }
  }

  // Generate robots.txt with dynamic content
  public async generateRobotsTxt(): Promise<string> {
    const robotsTxt = `User-agent: *
Allow: /

# Disallow admin and private areas
Disallow: /admin/
Disallow: /api/
Disallow: /_next/
Disallow: /profile/

# Allow important discovery paths
Allow: /explore
Allow: /tool
Allow: /action/
Allow: /topic/
Allow: /tag/

# Sitemap location
Sitemap: ${this.baseUrl}/sitemap.xml

# Crawl-delay to be respectful
Crawl-delay: 1`;

    return robotsTxt;
  }

  // Ping search engines about updates
  public async pingSearchEngines(): Promise<void> {
    const sitemapUrl = `${this.baseUrl}/sitemap.xml`;
    
    const pingUrls = [
      `https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`,
      `https://www.bing.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`,
    ];

    try {
      const pingPromises = pingUrls.map(url => 
        fetch(url, { method: 'GET' }).catch(() => {
          // Production: error handling
        })
      );

      await Promise.allSettled(pingPromises);
      // Production: ping complete
    } catch (error) {
      // Production: ping failed
    }
  }

  // Generate SEO-optimized metadata for any page
  public generateSEOData(pageType: string, data?: any): SEOData {
    const cacheKey = `${pageType}:${data?.id || 'default'}`;
    
    if (this.seoCache.has(cacheKey)) {
      return this.seoCache.get(cacheKey)!;
    }

    let seoData: SEOData;

    switch (pageType) {
      case 'home':
        seoData = {
          title: 'Science for Action | Join Science-Driven Causes in Your Community',
          description: 'Science for Action is a community-powered platform to join, support, and launch science-driven causes and campaigns across the world. Take action on what matters with science-backed civic engagement.',
          keywords: ['science causes', 'civic engagement', 'community science', 'science activism', 'volunteer science', 'scientific campaigns', 'public science', 'STEM community support']
        };
        break;

      case 'explore':
        seoData = {
          title: 'Explore Science-Driven Causes | Science for Action',
          description: 'Discover and explore science-driven causes and campaigns in your area. Find volunteer opportunities, research initiatives, and community science projects that match your interests.',
          keywords: ['explore science causes', 'find volunteer opportunities', 'community science projects', 'research initiatives', 'science campaigns']
        };
        break;

      case 'action':
        seoData = {
          title: data?.title ? `${data.title} | Science for Action` : 'Take Action | Science for Action',
          description: data?.description || 'Take meaningful action on science-driven causes in your community. Join the movement for evidence-based change.',
          keywords: data?.tags || ['science action', 'community engagement', 'volunteer opportunity']
        };
        break;

      case 'topic':
        const topic = data?.topic || 'Science';
        seoData = {
          title: `${topic} Causes and Actions | Science for Action`,
          description: `Discover and join ${topic.toLowerCase()} causes and campaigns. Find volunteer opportunities and research initiatives related to ${topic.toLowerCase()}.`,
          keywords: [`${topic.toLowerCase()} causes`, `${topic.toLowerCase()} volunteer`, `${topic.toLowerCase()} research`, 'community science']
        };
        break;

      case 'tool':
        seoData = {
          title: 'Action Tool | Find Your Perfect Science Cause | Science for Action',
          description: 'Use our intelligent Action Tool to discover science causes that match your interests, skills, and location. Get personalized recommendations for meaningful civic engagement.',
          keywords: ['action tool', 'find science causes', 'personalized recommendations', 'civic engagement tool', 'volunteer matching']
        };
        break;

      default:
        seoData = {
          title: 'Science for Action | Community-Powered Science Engagement',
          description: 'Join the movement for science-driven civic engagement. Discover causes, take action, and make a difference in your community.',
          keywords: ['science for action', 'civic engagement', 'community science']
        };
    }

    // Add structured data for rich snippets
    seoData.structuredData = this.generateStructuredData(pageType, data);
    
    // Cache the result
    this.seoCache.set(cacheKey, seoData);
    
    return seoData;
  }

  private generateStructuredData(pageType: string, data?: any): any {
    const baseStructuredData = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Science for Action",
      "url": this.baseUrl,
      "description": "Community-powered platform for science-driven causes and campaigns",
      "potentialAction": {
        "@type": "SearchAction",
        "target": `${this.baseUrl}/explore?q={search_term_string}`,
        "query-input": "required name=search_term_string"
      }
    };

    switch (pageType) {
      case 'action':
        if (data) {
          return {
            "@context": "https://schema.org",
            "@type": "Event",
            "name": data.title,
            "description": data.description,
            "organizer": {
              "@type": "Organization",
              "name": data.organization || "Science for Action",
              "url": this.baseUrl
            },
            "location": data.location || "Online",
            "eventStatus": "https://schema.org/EventScheduled"
          };
        }
        break;

      case 'topic':
        return {
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "name": `${data?.topic || 'Science'} Causes`,
          "description": `Collection of ${data?.topic?.toLowerCase() || 'science'} causes and campaigns`,
          "url": `${this.baseUrl}/topic/${data?.topic?.toLowerCase() || 'science'}`
        };

      default:
        return baseStructuredData;
    }

    return baseStructuredData;
  }

  // Refresh cached SEO data
  public async refreshSEOData(): Promise<void> {
    try {
      // Clear cache to force regeneration
      this.seoCache.clear();
      
      // Regenerate common pages
      const commonPages = ['home', 'explore', 'tool'];
      commonPages.forEach(page => {
        this.generateSEOData(page);
      });

      // Production: debug output removed
    } catch (error) {
      // Production: debug output removed
    }
  }

  // Generate meta tags HTML string
  public generateMetaTags(seoData: SEOData): string {
    let metaTags = '';
    
    // Basic meta tags
    metaTags += `<title>${seoData.title}</title>\n`;
    metaTags += `<meta name="description" content="${seoData.description}" />\n`;
    metaTags += `<meta name="keywords" content="${seoData.keywords.join(', ')}" />\n`;
    
    // Open Graph tags
    metaTags += `<meta property="og:title" content="${seoData.title}" />\n`;
    metaTags += `<meta property="og:description" content="${seoData.description}" />\n`;
    metaTags += `<meta property="og:type" content="website" />\n`;
    if (seoData.ogImage) {
      metaTags += `<meta property="og:image" content="${seoData.ogImage}" />\n`;
    }
    
    // Twitter Card tags
    metaTags += `<meta name="twitter:card" content="summary_large_image" />\n`;
    metaTags += `<meta name="twitter:title" content="${seoData.title}" />\n`;
    metaTags += `<meta name="twitter:description" content="${seoData.description}" />\n`;
    
    // Canonical URL
    if (seoData.canonicalUrl) {
      metaTags += `<link rel="canonical" href="${seoData.canonicalUrl}" />\n`;
    }
    
    // Structured data
    if (seoData.structuredData) {
      metaTags += `<script type="application/ld+json">${JSON.stringify(seoData.structuredData)}</script>\n`;
    }
    
    return metaTags;
  }

  // Get current sitemap for API routes
  public getSitemap(): SitemapEntry[] {
    return [...this.sitemapCache];
  }

  // Get sitemap XML content
  public async getSitemapXML(): Promise<string> {
    try {
      const { data } = await supabase
        .from('sitemap_data')
        .select('xml_content')
        .eq('id', 'main')
        .single();

      return data?.xml_content || '';
    } catch {
      // Fallback: generate on the fly
      await this.generateDynamicSitemap();
      return await this.getSitemapXML();
    }
  }

  // Force immediate SEO update
  public async forceUpdate(): Promise<void> {
    await Promise.all([
      this.generateDynamicSitemap(),
      this.refreshSEOData(),
      this.pingSearchEngines()
    ]);
  }

  // Get SEO performance metrics
  public getSEOMetrics() {
    return {
      sitemapUrls: this.sitemapCache.length,
      lastSitemapUpdate: new Date(this.lastSitemapUpdate).toISOString(),
      cachedSEOPages: this.seoCache.size,
      isRunning: this.isRunning
    };
  }
}

// Export singleton instance
export const infiniteSEOEngine = new InfiniteSEOEngine();
export default infiniteSEOEngine;

