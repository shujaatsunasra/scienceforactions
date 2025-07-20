import React from "react";
import type { Metadata } from "next";
import ReliableActionTool from "@/components/ReliableActionTool";
import { ProfileProvider } from "@/context/SafeProfileContext";
import { generateMetadata as generateSEOMetadata, generateWebPageSchema, generateBreadcrumbSchema } from '@/lib/seo';

export const metadata: Metadata = generateSEOMetadata('tool');

export default function ToolPage() {
  const pageSchema = generateWebPageSchema(
    'Find Personalized Science Causes Near You | Action Tool',
    'Use our Action Tool to find personalized scientific causes based on your values, location, and interests. Get customized civic engagement opportunities and science-backed action plans.',
    'https://scienceforactions.me/tool'
  );

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: 'https://scienceforactions.me' },
    { name: 'Action Tool', url: 'https://scienceforactions.me/tool' }
  ]);

  return (
    <ProfileProvider>
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
      
      <div className="flex w-full min-h-screen">
        <main className="flex-1 flex flex-col items-center justify-center bg-background p-4 md:p-12 pt-16 pb-20 md:pt-0 md:pb-0">
          <div className="w-full max-w-4xl">
            <header className="mb-8 text-center">
              <h1 className="text-3xl md:text-4xl font-bold text-text mb-4">
                Find Personalized Science Causes Near You
              </h1>
              <p className="text-grayText text-lg max-w-2xl mx-auto">
                Use our Action Tool to discover scientific causes that match your values, 
                location, and interests. Get personalized civic engagement opportunities 
                and science-backed action plans.
              </p>
            </header>
            <ReliableActionTool 
              title="Civic Action Tool"
              description="Choose an action type and get a personalized template to make your voice heard on important issues."
              tags={['civic-engagement', 'personalized', 'action-ready']}
            />
          </div>
        </main>
      </div>
    </ProfileProvider>
  );
}
