// Performance and SEO optimization utilities

// Critical CSS inlining helper
export function inlineCriticalCSS() {
  const criticalStyles = `
    /* Critical above-the-fold styles */
    body {
      font-family: var(--font-geist-sans, system-ui, sans-serif);
      margin: 0;
      padding: 0;
      background-color: var(--background, #ffffff);
      color: var(--text, #000000);
    }
    
    .min-h-screen {
      min-height: 100vh;
    }
    
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1rem;
    }
    
    .text-center {
      text-align: center;
    }
    
    .font-bold {
      font-weight: 700;
    }
    
    .text-primary {
      color: var(--primary, #1e40af);
    }
    
    .bg-background {
      background-color: var(--background, #ffffff);
    }
  `;
  
  return criticalStyles;
}

// Preload important resources
export function getPreloadLinks() {
  return [
    // Preload fonts
    {
      rel: 'preload',
      href: '/fonts/geist-sans.woff2',
      as: 'font',
      type: 'font/woff2',
      crossOrigin: 'anonymous'
    },
    // Preload hero images
    {
      rel: 'preload',
      href: '/og-image.jpg',
      as: 'image'
    },
    // Preconnect to external services
    {
      rel: 'preconnect',
      href: 'https://fonts.googleapis.com'
    },
    {
      rel: 'preconnect', 
      href: 'https://fonts.gstatic.com',
      crossOrigin: 'anonymous'
    }
  ];
}

// Generate meta tags for mobile optimization
export function getMobileMetaTags() {
  return [
    {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes'
    },
    {
      name: 'mobile-web-app-capable',
      content: 'yes'
    },
    {
      name: 'apple-mobile-web-app-capable',
      content: 'yes'
    },
    {
      name: 'apple-mobile-web-app-status-bar-style',
      content: 'default'
    },
    {
      name: 'apple-mobile-web-app-title',
      content: 'Science for Action'
    },
    {
      name: 'application-name',
      content: 'Science for Action'
    },
    {
      name: 'msapplication-TileColor',
      content: '#ffffff'
    },
    {
      name: 'theme-color',
      content: '#1e40af'
    }
  ];
}

// Performance monitoring
export function trackWebVitals() {
  if (typeof window !== 'undefined') {
    // Track Core Web Vitals
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'largest-contentful-paint') {
          console.log('LCP:', entry.startTime);
        }
        if (entry.entryType === 'first-input') {
          const fidEntry = entry as any;
          console.log('FID:', fidEntry.processingStart - fidEntry.startTime);
        }
        if (entry.entryType === 'layout-shift') {
          const clsEntry = entry as any;
          if (!clsEntry.hadRecentInput) {
            console.log('CLS:', clsEntry.value);
          }
        }
      }
    });

    try {
      observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] });
    } catch (e) {
      // Browser doesn't support these metrics
      console.log('Performance monitoring not supported');
    }
  }
}

// SEO-friendly image loading
export interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  className?: string;
}

export function generateImageAttributes({ 
  src, 
  alt, 
  width, 
  height, 
  priority = false 
}: OptimizedImageProps) {
  const attributes: Record<string, string | number | boolean> = {
    src,
    alt,
    loading: priority ? 'eager' : 'lazy',
    decoding: 'async'
  };

  if (width) attributes.width = width;
  if (height) attributes.height = height;

  // Add srcset for responsive images
  if (src.startsWith('/') || src.startsWith('https://scienceforactions.me')) {
    const baseUrl = src.startsWith('/') ? 'https://scienceforactions.me' : '';
    attributes.srcSet = `
      ${baseUrl}${src} 1x,
      ${baseUrl}${src.replace('.jpg', '@2x.jpg').replace('.png', '@2x.png')} 2x
    `.trim();
  }

  return attributes;
}

// JSON-LD schema helpers
export function generateEventSchema(event: {
  name: string;
  description: string;
  startDate: string;
  endDate?: string;
  location: string;
  organizer: string;
  url: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.name,
    description: event.description,
    startDate: event.startDate,
    endDate: event.endDate,
    location: {
      '@type': 'Place',
      name: event.location
    },
    organizer: {
      '@type': 'Organization',
      name: event.organizer
    },
    url: event.url
  };
}

export function generateArticleSchema(article: {
  title: string;
  description: string;
  author: string;
  datePublished: string;
  dateModified?: string;
  url: string;
  image?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    author: {
      '@type': 'Person',
      name: article.author
    },
    datePublished: article.datePublished,
    dateModified: article.dateModified || article.datePublished,
    url: article.url,
    image: article.image,
    publisher: {
      '@type': 'Organization',
      name: 'Science for Action',
      logo: {
        '@type': 'ImageObject',
        url: 'https://scienceforactions.me/logo.png'
      }
    }
  };
}
