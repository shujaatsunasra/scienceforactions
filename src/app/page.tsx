import { Metadata } from 'next';
import Head from 'next/head';
import ClientRedirect from '@/components/ClientRedirect';

// AGGRESSIVE SEO: Static metadata for GitHub Pages
export const metadata: Metadata = {
  title: 'Science for Action | Join Science-Driven Causes in Your Community',
  description: 'Science for Action is a community-powered platform to join, support, and launch science-driven causes and campaigns across the world. Take action on what matters with science-backed civic engagement.',
  keywords: 'science causes, civic engagement, community science, science activism, volunteer science, scientific campaigns, public science, STEM community support, climate action, environmental science, citizen science, science for social change, public science engagement, volunteer science movements, climate action support, how to join a science cause, public science projects near me, climate volunteer platform, student science movements, youth science movements, AI for change, public problem solving',
  openGraph: {
    title: 'Science for Action | Join Science-Driven Causes in Your Community',
    description: 'Science for Action is a community-powered platform to join, support, and launch science-driven causes and campaigns across the world.',
    url: 'https://scienceforactions.me',
    siteName: 'Science for Action',
    images: [
      {
        url: 'https://scienceforactions.me/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Science for Action - Community-powered science campaigns'
      }
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Science for Action | Join Science-Driven Causes',
    description: 'Community-powered platform for science-driven causes and campaigns.',
    images: ['https://scienceforactions.me/og-image.jpg'],
  },
  alternates: {
    canonical: 'https://scienceforactions.me',
  },
  robots: {
    index: true,
    follow: true,
  }
};

export default function Home() {
  return (
    <>
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Science for Action",
              "description": "Community-powered platform for science-driven causes and campaigns",
              "url": "https://scienceforactions.me",
              "logo": "https://scienceforactions.me/logo.png",
              "foundingDate": "2024",
              "founder": {
                "@type": "Person",
                "name": "Science for Action Team"
              },
              "sameAs": [
                "https://twitter.com/scienceforaction",
                "https://github.com/shujaatsunasra/scienceforactions"
              ],
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://scienceforactions.me/explore?q={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Science for Action",
              "description": "Join science-driven causes and campaigns in your community",
              "url": "https://scienceforactions.me",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://scienceforactions.me/explore?q={search_term_string}",
                "query-input": "required name=search_term_string"
              },
              "about": [
                {
                  "@type": "Thing",
                  "name": "Science Activism"
                },
                {
                  "@type": "Thing", 
                  "name": "Civic Engagement"
                },
                {
                  "@type": "Thing",
                  "name": "Community Science"
                },
                {
                  "@type": "Thing",
                  "name": "Climate Action"
                }
              ]
            })
          }}
        />
      </Head>
      
      <div className="min-h-screen bg-background">
        {/* AGGRESSIVE SEO: Multiple H1-H4 headers for keyword density */}
        <header className="sr-only">
          <h1>Science for Action - Join Science-Driven Causes in Your Community</h1>
          <h2>Community-Powered Science Activism Platform</h2>
        </header>
        
        {/* Hero Section with SEO-Rich Content */}
        <section className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
          <div className="text-center space-y-8 max-w-6xl mx-auto px-4 py-12">
            
            {/* Primary Headlines */}
            <div className="space-y-6">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
                Science for <span className="text-blue-600">Action</span>
              </h1>
              <h2 className="text-xl md:text-2xl text-gray-700 max-w-4xl mx-auto font-medium">
                Join thousands supporting <strong>science-driven causes</strong> and 
                <strong> civic engagement</strong> in communities worldwide
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Discover, support, and launch <em>scientific campaigns</em> that matter. 
                From <strong>climate action</strong> to <strong>public health initiatives</strong>, 
                your community can lead the next breakthrough in <em>civic science</em>.
              </p>
            </div>
            
            {/* Key Value Propositions Grid */}
            <div className="grid md:grid-cols-3 gap-8 mt-12 text-left">
              <article className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">🧪 Community Science</h3>
                <p className="text-gray-600 leading-relaxed">
                  Browse <strong>citizen-driven scientific campaigns</strong> and make your voice heard. 
                  Join local <em>volunteer science movements</em> addressing real community challenges.
                </p>
                <a href="/explore" className="text-blue-600 hover:underline mt-2 inline-block">
                  Explore Science Causes →
                </a>
              </article>
              
              <article className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">🌍 Climate Action</h3>
                <p className="text-gray-600 leading-relaxed">
                  Support real-world <strong>climate science action</strong> and environmental research. 
                  Find <em>climate volunteer platform</em> opportunities near you.
                </p>
                <a href="/explore?topic=climate" className="text-blue-600 hover:underline mt-2 inline-block">
                  Join Climate Causes →
                </a>
              </article>
              
              <article className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">🧠 Civic Engagement</h3>
                <p className="text-gray-600 leading-relaxed">
                  Participate in <strong>public science projects</strong> and 
                  <em>student science movements</em> driving social change.
                </p>
                <a href="/tool" className="text-blue-600 hover:underline mt-2 inline-block">
                  Find Your Cause →
                </a>
              </article>
            </div>
            
            {/* Trending Topics Section */}
            <section className="mt-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">🔥 Trending Science Causes</h3>
              <div className="flex flex-wrap justify-center gap-3">
                <a href="/topic/climate-action" className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full hover:bg-blue-200 transition-colors">
                  Climate Action
                </a>
                <a href="/topic/public-health" className="bg-green-100 text-green-800 px-4 py-2 rounded-full hover:bg-green-200 transition-colors">
                  Public Health
                </a>
                <a href="/topic/ai-ethics" className="bg-purple-100 text-purple-800 px-4 py-2 rounded-full hover:bg-purple-200 transition-colors">
                  AI Ethics
                </a>
                <a href="/topic/youth-science" className="bg-orange-100 text-orange-800 px-4 py-2 rounded-full hover:bg-orange-200 transition-colors">
                  Youth Science
                </a>
                <a href="/topic/environmental-justice" className="bg-teal-100 text-teal-800 px-4 py-2 rounded-full hover:bg-teal-200 transition-colors">
                  Environmental Justice
                </a>
              </div>
            </section>
            
            {/* Call to Action */}
            <div className="space-y-6 mt-12">
              <a 
                href="/main" 
                className="inline-block bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors shadow-lg"
              >
                🚀 Start Taking Action
              </a>
              <div className="flex flex-wrap justify-center gap-6 text-sm">
                <a href="/explore" className="text-blue-600 hover:underline font-medium">
                  🔍 How to join a science cause
                </a>
                <a href="/tool" className="text-blue-600 hover:underline font-medium">
                  📍 Public science projects near me
                </a>
                <a href="/profile" className="text-blue-600 hover:underline font-medium">
                  📊 Track Your Impact
                </a>
              </div>
            </div>
            
            {/* Community Stats */}
            <section className="mt-16 bg-gray-50 p-8 rounded-lg">
              <h4 className="text-xl font-semibold text-gray-900 mb-4">Join Our Growing Community</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-600">1,000+</div>
                  <div className="text-sm text-gray-600">Active Campaigns</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">50+</div>
                  <div className="text-sm text-gray-600">Cities Worldwide</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600">25k+</div>
                  <div className="text-sm text-gray-600">Science Supporters</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-orange-600">100+</div>
                  <div className="text-sm text-gray-600">Research Partners</div>
                </div>
              </div>
            </section>
          </div>
        </section>
        
        {/* Client-side redirect component (hidden from search engines) */}
        <div style={{ display: 'none' }}>
          <ClientRedirect />
        </div>
      </div>
    </>
  );
}
