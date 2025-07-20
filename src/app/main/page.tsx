import React from "react";
import type { Metadata } from "next";
import ActionTool from "@/components/ActionTool";
import { generateMetadata as generateSEOMetadata, generateWebPageSchema, generateBreadcrumbSchema } from '@/lib/seo';

export const metadata: Metadata = generateSEOMetadata('main');

export default function MainPage() {
  const pageSchema = generateWebPageSchema(
    'Take Action Now | Science for Action Dashboard',
    'Access your personalized science action dashboard. Find causes, track your impact, and join science-driven movements that matter to your community.',
    'https://scienceforactions.me/main'
  );

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: 'https://scienceforactions.me' },
    { name: 'Action Dashboard', url: 'https://scienceforactions.me/main' }
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
      
      <div className="flex w-full min-h-screen">
        {/* Main content area for action tool flow */}
        <main className="flex-1 flex flex-col items-center justify-center bg-background p-4 md:p-12 pt-16 pb-20 md:pt-0 md:pb-0">
          <div className="w-full max-w-4xl">
            <h1 className="sr-only">Science Action Dashboard - Take Action on Science-Driven Causes</h1>
            <div className="mb-8 text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-text mb-4">
                Join thousands supporting real-world climate science action
              </h2>
              <p className="text-grayText text-lg">
                Browse citizen-driven scientific campaigns and make your voice heard on issues that matter.
                Your community can lead the next breakthrough in civic science.
              </p>
            </div>
            <ActionTool />
            
            {/* SEO-rich content block */}
            <div className="mt-12 text-center space-y-6">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-text">
                    Science-Backed Community Action
                  </h3>
                  <p className="text-grayText">
                    Connect with <strong>science activists</strong> and <strong>community organizers</strong> who are 
                    making real change through evidence-based advocacy and <em>civic engagement</em>.
                  </p>
                </div>
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-text">
                    Personalized Action Opportunities
                  </h3>
                  <p className="text-grayText">
                    Our platform matches you with <strong>science causes</strong> that align with your values, 
                    from <em>climate action</em> to <em>public health research</em> and <em>environmental justice</em>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
