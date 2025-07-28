import React from "react";
import type { Metadata } from "next";
import ExploreView from "@/components/ExploreView";
import { SEOContentBlock, RelatedCauses } from "@/components/SEOComponents";
import { generateMetadata as generateSEOMetadata, generateWebPageSchema, generateBreadcrumbSchema } from '@/lib/seo';

export const metadata: Metadata = generateSEOMetadata('explore');

export default function ExplorePage() {
  const pageSchema = generateWebPageSchema(
    'Explore Science Causes Near You | Science for Action',
    'Discover public science campaigns and civic engagement causes near you. Browse citizen-driven scientific campaigns, climate action initiatives, and community research projects.',
    'https://scienceforactions.me/explore'
  );

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: 'https://scienceforactions.me' },
    { name: 'Explore Causes', url: 'https://scienceforactions.me/explore' }
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(pageSchema)
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema)
        }}
      />
      
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <header className="mb-8 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-text mb-4">
              Explore Science Causes Near You
            </h1>
            <p className="text-grayText text-lg max-w-3xl mx-auto">
              Discover public science campaigns and civic engagement causes in your community. 
              Browse citizen-driven scientific campaigns, climate action initiatives, and 
              community research projects making a real difference.
            </p>
          </header>
          <ExploreView />
          
          {/* SEO Content Block */}
          <SEOContentBlock />
          
          {/* Related Causes */}
          <RelatedCauses />
        </div>
      </div>
    </>
  );
}

