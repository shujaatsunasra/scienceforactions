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
        {/* Enhanced main content area */}
        <main className="flex-1 flex flex-col items-center justify-center bg-gradient-to-br from-background via-backgroundDark to-surface p-6 md:p-12 pt-20 pb-24 md:pt-12 md:pb-12">
          <div className="w-full max-w-6xl space-y-12">
            <h1 className="sr-only">Science Action Dashboard - Take Action on Science-Driven Causes</h1>
            
            {/* Hero section with enhanced typography */}
            <div className="text-center space-y-6 animate-fade-in">
              <h2 className="text-4xl md:text-6xl font-bold text-text tracking-tight">
                Make <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Science</span> Matter
              </h2>
              <p className="text-xl md:text-2xl text-textSecondary font-medium max-w-3xl mx-auto leading-relaxed">
                Turn your passion for science into meaningful action. Join thousands making real change happen.
              </p>
            </div>
            
            {/* Primary Action Tool with enhanced UX */}
            <div className="animate-fade-in-delay-1">
              <ActionTool />
            </div>
            
            {/* Enhanced success stories and social proof */}
            <div className="mt-20 text-center space-y-12 animate-fade-in-delay-2">
              <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-card rounded-card p-8 border border-cardBorder shadow-card hover:shadow-card-hover transition-all duration-300 ease-smooth group">
                  <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4 group-hover:scale-110 transition-transform duration-300">
                    50,000+
                  </div>
                  <div className="text-text font-semibold text-lg mb-3">Active Members</div>
                  <div className="text-textSecondary leading-relaxed">Taking action on science-driven causes worldwide</div>
                </div>
                <div className="bg-card rounded-card p-8 border border-cardBorder shadow-card hover:shadow-card-hover transition-all duration-300 ease-smooth group">
                  <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-accent to-success bg-clip-text text-transparent mb-4 group-hover:scale-110 transition-transform duration-300">
                    12,500+
                  </div>
                  <div className="text-text font-semibold text-lg mb-3">Actions Available</div>
                  <div className="text-textSecondary leading-relaxed">From local volunteer work to policy advocacy</div>
                </div>
                <div className="bg-card rounded-card p-8 border border-cardBorder shadow-card hover:shadow-card-hover transition-all duration-300 ease-smooth group">
                  <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-success to-primary bg-clip-text text-transparent mb-4 group-hover:scale-110 transition-transform duration-300">
                    98%
                  </div>
                  <div className="text-text font-semibold text-lg mb-3">User Satisfaction</div>
                  <div className="text-textSecondary leading-relaxed">Members report meaningful impact from actions</div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-card to-surface rounded-card p-12 border border-cardBorder shadow-card space-y-6">
                <h3 className="text-2xl md:text-3xl font-bold text-text">
                  Ready to make a <span className="text-primary">real difference</span>?
                </h3>
                <p className="text-textSecondary text-lg leading-relaxed max-w-3xl mx-auto">
                  Join thousands of people who have found their path to meaningful action. 
                  Whether you have 5 minutes or 5 hours, there's a perfect way for you to contribute 
                  to the causes you care about most.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                  <button className="btn-primary text-base px-8 py-4">
                    Start Taking Action
                  </button>
                  <button className="btn-secondary text-base px-8 py-4">
                    Learn More
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

