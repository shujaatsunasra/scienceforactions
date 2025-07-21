import { Metadata } from 'next';
import { generateMetadata as generateSEOMetadata } from '@/lib/seo';
import ClientRedirect from '@/components/ClientRedirect';

// Server-side metadata for SEO
export const metadata: Metadata = generateSEOMetadata('home');

export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      {/* Hidden H1 for SEO */}
      <h1 className="sr-only">
        Science for Action - Join Science-Driven Causes in Your Community
      </h1>
      
      {/* SEO-rich content visible to search engines */}
      <div className="text-center space-y-8 max-w-4xl mx-auto px-4">
        <div className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold text-text">
            Science for Action
          </h2>
          <p className="text-xl text-grayText max-w-2xl mx-auto">
            Join thousands supporting <strong>science-driven causes</strong> and 
            <strong> civic engagement</strong> in communities worldwide.
          </p>
        </div>
        
        {/* Key value propositions for SEO */}
        <div className="grid md:grid-cols-3 gap-6 text-left">
          <div>
            <h3 className="font-semibold text-text mb-2">Community Science</h3>
            <p className="text-sm text-grayText">
              Browse <em>citizen-driven scientific campaigns</em> and make your voice heard.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-text mb-2">Climate Action</h3>
            <p className="text-sm text-grayText">
              Support real-world <em>climate science action</em> and environmental research.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-text mb-2">Civic Engagement</h3>
            <p className="text-sm text-grayText">
              Your community can lead the next breakthrough in <em>civic science</em>.
            </p>
          </div>
        </div>
        
        {/* Call to action links for internal SEO */}
        <div className="space-y-4">
          <a 
            href="/main" 
            className="inline-block bg-primary text-white px-8 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Start Taking Action
          </a>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <a href="/explore" className="text-primary hover:underline">
              Explore Science Causes
            </a>
            <a href="/tool" className="text-primary hover:underline">
              Find Your Cause
            </a>
            <a href="/profile" className="text-primary hover:underline">
              Track Your Impact
            </a>
          </div>
        </div>
      </div>
      
      {/* Client-side redirect component */}
      <ClientRedirect />
    </div>
  );
}
