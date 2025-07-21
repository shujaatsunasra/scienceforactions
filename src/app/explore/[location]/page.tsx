import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Head from 'next/head';

// AGGRESSIVE SEO: Location-based pages for local discoverability
const locationData: Record<string, {
  title: string;
  description: string;
  keywords: string[];
  country: string;
  population?: string;
  content: {
    hero: string;
    localCauses: Array<{
      title: string;
      description: string;
      type: string;
    }>;
    stats: Array<{
      label: string;
      value: string;
    }>;
  };
}> = {
  'india': {
    title: 'Science Causes and Volunteer Opportunities in India',
    description: 'Join science causes and volunteer opportunities across India. Support climate action, public health, and community science projects in Indian cities.',
    keywords: ['science causes India', 'volunteer opportunities India', 'climate action India', 'public health India', 'community science India'],
    country: 'India',
    population: '1.4B',
    content: {
      hero: 'Discover science-driven causes across India. From Mumbai air quality initiatives to Bangalore tech for good projects, join the movement.',
      localCauses: [
        { title: 'Mumbai Air Quality Monitoring', description: 'Citizen science project tracking air pollution levels across Mumbai metropolitan area.', type: 'Environmental' },
        { title: 'Delhi Water Conservation', description: 'Community-led water conservation and quality monitoring in Delhi NCR.', type: 'Environmental' },
        { title: 'Bangalore Tech for Climate', description: 'Technology solutions for climate adaptation in urban Karnataka.', type: 'Technology' },
        { title: 'Chennai Coastal Protection', description: 'Marine conservation and coastal erosion prevention initiatives.', type: 'Environmental' }
      ],
      stats: [
        { label: 'Active Campaigns', value: '50+' },
        { label: 'Volunteers', value: '2,000+' },
        { label: 'Cities', value: '15+' }
      ]
    }
  },
  'usa': {
    title: 'Science Causes and Volunteer Opportunities in USA',
    description: 'Join science causes and volunteer opportunities across the United States. Support climate action, public health, and STEM education in American communities.',
    keywords: ['science causes USA', 'volunteer opportunities America', 'climate action US', 'STEM education USA', 'public health America'],
    country: 'United States',
    population: '330M',
    content: {
      hero: 'Lead science innovation across America. From Silicon Valley climate tech to East Coast public health research, make your impact.',
      localCauses: [
        { title: 'California Wildfire Research', description: 'Community-based wildfire prevention and forest management research.', type: 'Environmental' },
        { title: 'Texas Renewable Energy', description: 'Supporting renewable energy adoption and grid resilience projects.', type: 'Energy' },
        { title: 'NYC Urban Farming', description: 'Sustainable agriculture and food security initiatives in urban areas.', type: 'Agriculture' },
        { title: 'Florida Ocean Conservation', description: 'Marine ecosystem protection and coral reef restoration projects.', type: 'Marine' }
      ],
      stats: [
        { label: 'Active Campaigns', value: '120+' },
        { label: 'Volunteers', value: '8,000+' },
        { label: 'States', value: '45+' }
      ]
    }
  },
  'uk': {
    title: 'Science Causes and Volunteer Opportunities in United Kingdom',
    description: 'Join science causes and volunteer opportunities across the UK. Support climate action, biodiversity conservation, and public health research in British communities.',
    keywords: ['science causes UK', 'volunteer opportunities Britain', 'climate action UK', 'biodiversity UK', 'public health Britain'],
    country: 'United Kingdom',
    population: '67M',
    content: {
      hero: 'Drive scientific progress across the UK. From London climate research to Scottish renewable energy, join Britain science community.',
      localCauses: [
        { title: 'London Air Quality Study', description: 'Comprehensive air pollution monitoring and health impact research.', type: 'Health' },
        { title: 'Scotland Renewable Energy', description: 'Wind and tidal energy research and community engagement projects.', type: 'Energy' },
        { title: 'Wales Biodiversity Conservation', description: 'Protecting Welsh ecosystems and endangered species through citizen science.', type: 'Conservation' },
        { title: 'Northern Ireland Agriculture', description: 'Sustainable farming practices and soil health research initiatives.', type: 'Agriculture' }
      ],
      stats: [
        { label: 'Active Campaigns', value: '40+' },
        { label: 'Volunteers', value: '1,500+' },
        { label: 'Counties', value: '25+' }
      ]
    }
  },
  'delhi': {
    title: 'Science Causes and Volunteer Opportunities in Delhi',
    description: 'Join science causes and volunteer opportunities in Delhi, India. Support air quality research, urban sustainability, and public health initiatives in the capital.',
    keywords: ['science causes Delhi', 'volunteer Delhi', 'air quality Delhi', 'pollution research Delhi', 'urban sustainability Delhi'],
    country: 'India',
    population: '32M',
    content: {
      hero: 'Transform Delhi through science. Join air quality monitoring, urban sustainability projects, and public health research in India capital.',
      localCauses: [
        { title: 'Delhi Air Quality Network', description: 'Citizen-led air pollution monitoring across all districts of Delhi.', type: 'Environmental' },
        { title: 'Yamuna River Restoration', description: 'Water quality monitoring and river ecosystem restoration project.', type: 'Environmental' },
        { title: 'Urban Heat Island Study', description: 'Research on Delhi\'s urban heat patterns and mitigation strategies.', type: 'Climate' },
        { title: 'Waste-to-Energy Initiative', description: 'Community waste management and renewable energy generation project.', type: 'Sustainability' }
      ],
      stats: [
        { label: 'Active Projects', value: '15+' },
        { label: 'Local Volunteers', value: '800+' },
        { label: 'Research Partners', value: '5+' }
      ]
    }
  }
};

type Props = {
  params: Promise<{ location: string }>;
};

export async function generateStaticParams() {
  return Object.keys(locationData).map((location) => ({
    location,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { location: locationSlug } = await params;
  const location = locationData[locationSlug];
  
  if (!location) {
    return {
      title: 'Location Not Found | Science for Action',
    };
  }

  return {
    title: `${location.title} | Science for Action`,
    description: location.description,
    keywords: location.keywords.join(', '),
    openGraph: {
      title: `${location.title} | Science for Action`,
      description: location.description,
      url: `https://scienceforactions.me/explore/${locationSlug}`,
      siteName: 'Science for Action',
      images: [
        {
          url: `https://scienceforactions.me/og-${locationSlug}.jpg`,
          width: 1200,
          height: 630,
          alt: location.title
        }
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${location.title} | Science for Action`,
      description: location.description,
      images: [`https://scienceforactions.me/og-${locationSlug}.jpg`],
    },
    alternates: {
      canonical: `https://scienceforactions.me/explore/${locationSlug}`,
    }
  };
}

export default async function LocationPage({ params }: Props) {
  const { location: locationSlug } = await params;
  const location = locationData[locationSlug];

  if (!location) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": location.title,
    "description": location.description,
    "url": `https://scienceforactions.me/explore/${locationSlug}`,
    "isPartOf": {
      "@type": "WebSite",
      "name": "Science for Action",
      "url": "https://scienceforactions.me"
    },
    "about": {
      "@type": "Place",
      "name": location.country,
      "description": `Science causes and volunteer opportunities in ${location.country}`
    },
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": location.content.localCauses.length,
      "itemListElement": location.content.localCauses.map((cause, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "Event",
          "name": cause.title,
          "description": cause.description,
          "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
          "eventStatus": "https://schema.org/EventScheduled",
          "location": {
            "@type": "Place",
            "name": location.country
          }
        }
      }))
    }
  };

  return (
    <>
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </Head>
      
      <div className="min-h-screen bg-background">
        {/* SEO-Optimized Header */}
        <header className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
          <div className="max-w-6xl mx-auto px-4 py-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Science Causes in {location.country}
            </h1>
            <p className="text-xl md:text-2xl max-w-4xl mb-6">
              {location.content.hero}
            </p>
            
            {/* Location Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
              <div className="bg-white/10 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold">
                  {location.population || 'N/A'}
                </div>
                <div className="text-sm opacity-90">Population</div>
              </div>
              {location.content.stats.map((stat, index) => (
                <div key={index} className="bg-white/10 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold">
                    {stat.value}
                  </div>
                  <div className="text-sm opacity-90">{stat.label}</div>
                </div>
              ))}
            </div>
            
            <div className="mt-8">
              <a 
                href={`/explore?location=${locationSlug}`}
                className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Explore All {location.country} Causes
              </a>
            </div>
          </div>
        </header>

        {/* Local Causes Section */}
        <main className="max-w-6xl mx-auto px-4 py-12">
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Featured Science Causes in {location.country}
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              {location.content.localCauses.map((cause, index) => (
                <article key={index} className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="flex items-center mb-4">
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                      {cause.type}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {cause.title}
                  </h3>
                  <p className="text-gray-700 mb-4 leading-relaxed">
                    {cause.description}
                  </p>
                  <div className="space-x-3">
                    <a 
                      href="/main" 
                      className="text-blue-600 hover:underline font-medium"
                    >
                      Join This Cause →
                    </a>
                    <a 
                      href="/tool" 
                      className="text-gray-600 hover:underline"
                    >
                      Learn More
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* How to Get Involved */}
          <section className="mt-16 bg-gray-50 p-8 rounded-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              How to Get Involved in {location.country}
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">🔍 Discover</h4>
                <p className="text-gray-700">
                  Browse science causes and volunteer opportunities in your area of {location.country}.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">🤝 Connect</h4>
                <p className="text-gray-700">
                  Join local science communities and connect with researchers and activists.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">🚀 Act</h4>
                <p className="text-gray-700">
                  Take meaningful action on science causes that matter to your community.
                </p>
              </div>
            </div>
            
            <div className="text-center mt-8">
              <a 
                href="/main" 
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Start Your Science Journey in {location.country}
              </a>
            </div>
          </section>

          {/* Related Locations */}
          <section className="mt-16">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Explore Other Locations
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.keys(locationData)
                .filter(slug => slug !== locationSlug)
                .slice(0, 4)
                .map((relatedLocation) => (
                <a 
                  key={relatedLocation}
                  href={`/explore/${relatedLocation}`}
                  className="bg-white p-4 rounded-lg shadow-sm border hover:shadow-md transition-shadow"
                >
                  <h4 className="font-semibold text-gray-900 capitalize">
                    {locationData[relatedLocation].country}
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    {locationData[relatedLocation].content.stats[1]?.value || 'N/A'} volunteers
                  </p>
                </a>
              ))}
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
