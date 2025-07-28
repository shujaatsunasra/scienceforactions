import React from "react";
import type { Metadata } from "next";
import ProfileView from "@/components/ProfileView";
import { generateMetadata as generateSEOMetadata, generateWebPageSchema, generateBreadcrumbSchema } from '@/lib/seo';

export const metadata: Metadata = generateSEOMetadata('profile');

export default function ProfilePage() {
  const pageSchema = generateWebPageSchema(
    'Your Science Action Profile | Track Your Impact',
    'Track your engagement and support for science-backed movements. View your action history, impact metrics, and connect with like-minded science advocates in your community.',
    'https://scienceforactions.me/profile'
  );

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: 'https://scienceforactions.me' },
    { name: 'Your Profile', url: 'https://scienceforactions.me/profile' }
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
              Your Science Action Profile
            </h1>
            <p className="text-grayText text-lg max-w-2xl mx-auto">
              Track your engagement and support for science-backed movements. 
              View your action history, impact metrics, and connect with like-minded 
              science advocates in your community.
            </p>
          </header>
          <ProfileView />
        </div>
      </div>
    </>
  );
}

