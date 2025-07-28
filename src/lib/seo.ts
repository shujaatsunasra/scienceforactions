import { Metadata } from 'next';

export interface SEOConfig {
  title: string;
  description: string;
  keywords?: string;
  canonical?: string;
  openGraph?: {
    title: string;
    description: string;
    url: string;
    images: Array<{
      url: string;
      width: number;
      height: number;
      alt: string;
    }>;
    siteName: string;
    type: 'website' | 'article';
  };
  twitter?: {
    card: 'summary_large_image' | 'summary';
    site: string;
    creator: string;
    title: string;
    description: string;
    images: string[];
  };
  robots?: {
    index: boolean;
    follow: boolean;
    googlebot?: string;
  };
  alternates?: {
    canonical: string;
  };
}

export const defaultSEO: SEOConfig = {
  title: 'Science for Action | Join Science-Driven Causes in Your Community',
  description: 'Science for Action is a community-powered platform to join, support, and launch science-driven causes and campaigns across the world. Take action on what matters with science-backed civic engagement.',
  keywords: 'science causes, civic engagement, community science, science for action, science activism, volunteer science, scientific campaigns, public science, STEM community support, climate action, environmental science, citizen science',
  openGraph: {
    title: 'Science for Action | Join Science-Driven Causes in Your Community',
    description: 'Science for Action is a community-powered platform to join, support, and launch science-driven causes and campaigns across the world.',
    url: 'https://scienceforactions.me',
    siteName: 'Science for Action',
    type: 'website',
    images: [
      {
        url: 'https://scienceforactions.me/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Science for Action - Community-powered science campaigns'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    site: '@scienceforaction',
    creator: '@scienceforaction',
    title: 'Science for Action | Join Science-Driven Causes',
    description: 'Community-powered platform for science-driven causes and campaigns.',
    images: ['https://scienceforactions.me/og-image.jpg']
  },
  robots: {
    index: true,
    follow: true,
    googlebot: 'index,follow'
  },
  alternates: {
    canonical: 'https://scienceforactions.me'
  }
};

export const pagesSEO: Record<string, SEOConfig> = {
  home: {
    title: 'Science for Action | Join Science-Driven Causes in Your Community',
    description: 'Science for Action is a community-powered platform to join, support, and launch science-driven causes and campaigns across the world. Take action on what matters with science-backed civic engagement.',
    keywords: 'science causes, civic engagement, community science, science for action, science activism, volunteer science, scientific campaigns, public science, STEM community support',
    canonical: 'https://scienceforactions.me',
    openGraph: {
      ...defaultSEO.openGraph!,
      url: 'https://scienceforactions.me'
    },
    twitter: defaultSEO.twitter,
    robots: defaultSEO.robots,
    alternates: {
      canonical: 'https://scienceforactions.me'
    }
  },
  main: {
    title: 'Take Action Now | Science for Action Dashboard',
    description: 'Access your personalized science action dashboard. Find causes, track your impact, and join science-driven movements that matter to your community.',
    keywords: 'science action dashboard, personalized causes, community science, civic engagement platform, science activism tracker',
    canonical: 'https://scienceforactions.me/main',
    openGraph: {
      ...defaultSEO.openGraph!,
      title: 'Take Action Now | Science for Action Dashboard',
      description: 'Access your personalized science action dashboard. Find causes, track your impact, and join science-driven movements.',
      url: 'https://scienceforactions.me/main'
    },
    twitter: {
      ...defaultSEO.twitter!,
      title: 'Take Action Now | Science for Action Dashboard',
      description: 'Access your personalized science action dashboard. Find causes and join science-driven movements.'
    },
    robots: defaultSEO.robots,
    alternates: {
      canonical: 'https://scienceforactions.me/main'
    }
  },
  explore: {
    title: 'Explore Science Causes Near You | Science for Action',
    description: 'Discover public science campaigns and civic engagement causes near you. Browse citizen-driven scientific campaigns, climate action initiatives, and community research projects.',
    keywords: 'explore science causes, local science campaigns, civic science projects, community research, citizen science near me, environmental campaigns, climate action local',
    canonical: 'https://scienceforactions.me/explore',
    openGraph: {
      ...defaultSEO.openGraph!,
      title: 'Explore Science Causes Near You | Science for Action',
      description: 'Discover public science campaigns and civic engagement causes near you. Browse citizen-driven scientific campaigns and community research projects.',
      url: 'https://scienceforactions.me/explore'
    },
    twitter: {
      ...defaultSEO.twitter!,
      title: 'Explore Science Causes Near You',
      description: 'Discover public science campaigns and civic engagement causes near you.'
    },
    robots: defaultSEO.robots,
    alternates: {
      canonical: 'https://scienceforactions.me/explore'
    }
  },
  tool: {
    title: 'Find Personalized Science Causes Near You | Action Tool',
    description: 'Use our Action Tool to find personalized scientific causes based on your values, location, and interests. Get customized civic engagement opportunities and science-backed action plans.',
    keywords: 'personalized science causes, action tool, civic engagement finder, science cause matcher, community action generator, personalized activism',
    canonical: 'https://scienceforactions.me/tool',
    openGraph: {
      ...defaultSEO.openGraph!,
      title: 'Find Personalized Science Causes | Action Tool',
      description: 'Use our Action Tool to find personalized scientific causes based on your values, location, and interests.',
      url: 'https://scienceforactions.me/tool'
    },
    twitter: {
      ...defaultSEO.twitter!,
      title: 'Find Personalized Science Causes | Action Tool',
      description: 'Find personalized scientific causes based on your values and location.'
    },
    robots: defaultSEO.robots,
    alternates: {
      canonical: 'https://scienceforactions.me/tool'
    }
  },
  profile: {
    title: 'Your Science Action Profile | Track Your Impact',
    description: 'Track your engagement and support for science-backed movements. View your action history, impact metrics, and connect with like-minded science advocates in your community.',
    keywords: 'science action profile, track impact, civic engagement history, science activism tracker, community impact dashboard',
    canonical: 'https://scienceforactions.me/profile',
    openGraph: {
      ...defaultSEO.openGraph!,
      title: 'Your Science Action Profile | Track Your Impact',
      description: 'Track your engagement and support for science-backed movements. View your action history and impact metrics.',
      url: 'https://scienceforactions.me/profile'
    },
    twitter: {
      ...defaultSEO.twitter!,
      title: 'Your Science Action Profile | Track Your Impact',
      description: 'Track your engagement and support for science-backed movements.'
    },
    robots: defaultSEO.robots,
    alternates: {
      canonical: 'https://scienceforactions.me/profile'
    }
  },
  admin: {
    title: 'Admin Dashboard | Science for Action',
    description: 'Administrative dashboard for Science for Action platform management.',
    keywords: 'admin dashboard, platform management, science for action admin',
    canonical: 'https://scienceforactions.me/admin',
    openGraph: {
      ...defaultSEO.openGraph!,
      title: 'Admin Dashboard | Science for Action',
      description: 'Administrative dashboard for Science for Action platform management.',
      url: 'https://scienceforactions.me/admin'
    },
    twitter: {
      ...defaultSEO.twitter!,
      title: 'Admin Dashboard | Science for Action',
      description: 'Administrative dashboard for Science for Action platform management.'
    },
    robots: {
      index: false,
      follow: false,
      googlebot: 'noindex,nofollow'
    },
    alternates: {
      canonical: 'https://scienceforactions.me/admin'
    }
  }
};

export function generateMetadata(pageKey: string, customData?: Partial<SEOConfig>): Metadata {
  const seoData = pagesSEO[pageKey] || defaultSEO;
  const mergedData = { ...seoData, ...customData };

  const metadata: Metadata = {
    title: mergedData.title,
    description: mergedData.description,
    keywords: mergedData.keywords,
    robots: mergedData.robots ? {
      index: mergedData.robots.index,
      follow: mergedData.robots.follow,
      googleBot: mergedData.robots.googlebot
    } : undefined,
    openGraph: mergedData.openGraph ? {
      title: mergedData.openGraph.title,
      description: mergedData.openGraph.description,
      url: mergedData.openGraph.url,
      siteName: mergedData.openGraph.siteName,
      images: mergedData.openGraph.images,
      type: mergedData.openGraph.type
    } : undefined,
    twitter: mergedData.twitter ? {
      card: mergedData.twitter.card,
      site: mergedData.twitter.site,
      creator: mergedData.twitter.creator,
      title: mergedData.twitter.title,
      description: mergedData.twitter.description,
      images: mergedData.twitter.images
    } : undefined,
    alternates: mergedData.alternates
  };

  return metadata;
}

// JSON-LD Schema generators
export function generateWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Science for Action',
    description: 'Community-powered platform for science-driven causes and campaigns',
    url: 'https://scienceforactions.me',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://scienceforactions.me/explore?search={search_term_string}',
      'query-input': 'required name=search_term_string'
    },
    sameAs: [
      'https://twitter.com/scienceforaction',
      'https://facebook.com/scienceforaction'
    ]
  };
}

export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Science for Action',
    description: 'Science for Action is a community-powered platform to join, support, and launch science-driven causes and campaigns across the world.',
    url: 'https://scienceforactions.me',
    logo: 'https://scienceforactions.me/logo.png',
    sameAs: [
      'https://twitter.com/scienceforaction',
      'https://facebook.com/scienceforaction'
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      availableLanguage: 'English'
    }
  };
}

export function generateWebPageSchema(pageTitle: string, pageDescription: string, pageUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: pageTitle,
    description: pageDescription,
    url: pageUrl,
    isPartOf: {
      '@type': 'WebSite',
      name: 'Science for Action',
      url: 'https://scienceforactions.me'
    },
    about: {
      '@type': 'Thing',
      name: 'Science Activism',
      description: 'Community-driven scientific campaigns and civic engagement'
    },
    audience: {
      '@type': 'Audience',
      audienceType: 'Science activists, researchers, community organizers, civic engagement advocates'
    }
  };
}

export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  };
}

