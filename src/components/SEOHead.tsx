import React from 'react';
import Head from 'next/head';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
  twitterCard?: 'summary' | 'summary_large_image';
  noindex?: boolean;
  schema?: object[];
}

export default function SEOHead({
  title = 'Science for Action | Join Science-Driven Causes in Your Community',
  description = 'Science for Action is a community-powered platform to join, support, and launch science-driven causes and campaigns across the world.',
  keywords = 'science causes, civic engagement, community science, science for action, science activism, volunteer science, scientific campaigns, public science, STEM community support',
  canonical,
  ogImage = 'https://scienceforactions.me/og-image.jpg',
  ogType = 'website',
  twitterCard = 'summary_large_image',
  noindex = false,
  schema = []
}: SEOHeadProps) {
  const baseUrl = 'https://scienceforactions.me';
  const fullCanonical = canonical ? `${baseUrl}${canonical}` : baseUrl;

  return (
    <Head>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* Robots */}
      <meta name="robots" content={noindex ? 'noindex,nofollow' : 'index,follow'} />
      <meta name="googlebot" content={noindex ? 'noindex,nofollow' : 'index,follow'} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={fullCanonical} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={fullCanonical} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content="Science for Action" />
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter */}
      <meta property="twitter:card" content={twitterCard} />
      <meta property="twitter:url" content={fullCanonical} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={ogImage} />
      <meta property="twitter:site" content="@scienceforaction" />
      <meta property="twitter:creator" content="@scienceforaction" />
      
      {/* Additional Meta Tags */}
      <meta name="author" content="Science for Action" />
      <meta name="publisher" content="Science for Action" />
      <meta name="format-detection" content="telephone=no" />
      
      {/* Mobile Optimization */}
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="Science for Action" />
      
      {/* Schema.org JSON-LD */}
      {schema.map((schemaItem, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schemaItem)
          }}
        />
      ))}
    </Head>
  );
}

// Hook for dynamic SEO
export function useSEO(data: SEOHeadProps) {
  return {
    title: data.title,
    description: data.description,
    canonical: data.canonical,
    schema: data.schema || []
  };
}

