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
        {/* Main content area for enhanced action tool */}
        <main className="flex-1 flex flex-col items-center justify-center bg-background p-4 md:p-12 pt-16 pb-20 md:pt-0 md:pb-0">
          <div className="w-full max-w-6xl">
            <h1 className="sr-only">Science Action Dashboard - Take Action on Science-Driven Causes</h1>
            
            {/* Primary Action Tool with enhanced UX */}
            <ActionTool />
            
            {/* Success stories and social proof */}
            <div className="mt-16 text-center space-y-8">
              <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-white rounded-xl p-6 border border-grayBorder shadow-sm">
                  <div className="text-3xl font-bold text-primary mb-2">50,000+</div>
                  <div className="text-text font-medium mb-2">Active Members</div>
                  <div className="text-sm text-grayText">Taking action on science-driven causes worldwide</div>
                </div>
                <div className="bg-white rounded-xl p-6 border border-grayBorder shadow-sm">
                  <div className="text-3xl font-bold text-primary mb-2">12,500+</div>
                  <div className="text-text font-medium mb-2">Actions Available</div>
                  <div className="text-sm text-grayText">From local volunteer work to policy advocacy</div>
                </div>
                <div className="bg-white rounded-xl p-6 border border-grayBorder shadow-sm">
                  <div className="text-3xl font-bold text-primary mb-2">98%</div>
                  <div className="text-text font-medium mb-2">User Satisfaction</div>
                  <div className="text-sm text-grayText">Members report meaningful impact from actions</div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-text">
                  Ready to make a real difference?
                </h3>
                <p className="text-grayText max-w-2xl mx-auto">
                  Join thousands of people who have found their path to meaningful action. 
                  Whether you have 5 minutes or 5 hours, there's a perfect way for you to contribute 
                  to the causes you care about most.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

