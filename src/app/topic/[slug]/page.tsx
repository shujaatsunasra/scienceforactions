import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Head from 'next/head';

// AGGRESSIVE SEO: Topic-specific pages for long-tail keywords
const topicData: Record<string, {
  title: string;
  description: string;
  keywords: string[];
  content: {
    hero: string;
    sections: Array<{
      title: string;
      content: string;
      stats?: { label: string; value: string; }[];
    }>;
  };
}> = {
  'climate-action': {
    title: 'Climate Action Causes and Volunteer Opportunities',
    description: 'Join climate action causes and volunteer for environmental science projects. Find climate volunteer platform opportunities and support climate science action in your community.',
    keywords: ['climate action', 'climate volunteer platform', 'environmental science', 'climate science action', 'climate activism', 'environmental causes'],
    content: {
      hero: 'Take meaningful climate action in your community. Join thousands of volunteers supporting science-driven climate causes and environmental research.',
      sections: [
        {
          title: 'Local Climate Initiatives',
          content: 'Discover climate action projects in your area. From urban air quality monitoring to renewable energy advocacy, find your place in the climate movement.',
          stats: [
            { label: 'Active Climate Campaigns', value: '250+' },
            { label: 'Climate Volunteers', value: '5,000+' },
            { label: 'Cities Engaged', value: '50+' }
          ]
        },
        {
          title: 'Science-Backed Climate Solutions',
          content: 'Support evidence-based climate solutions. Our climate volunteer platform connects you with research-driven environmental projects making real impact.'
        }
      ]
    }
  },
  'public-health': {
    title: 'Public Health Science Causes and Volunteer Opportunities',
    description: 'Join public health science causes and volunteer for community health research. Support public health initiatives and health science activism in your area.',
    keywords: ['public health', 'health science', 'community health', 'health research', 'health activism', 'medical science'],
    content: {
      hero: 'Advance public health through community-driven science. Join health research initiatives and support evidence-based health policies.',
      sections: [
        {
          title: 'Community Health Research',
          content: 'Participate in community health studies and public health research. Help gather data that drives better health policies and outcomes.',
          stats: [
            { label: 'Health Research Projects', value: '150+' },
            { label: 'Health Volunteers', value: '3,000+' },
            { label: 'Research Partners', value: '25+' }
          ]
        },
        {
          title: 'Health Advocacy Campaigns',
          content: 'Support science-based health advocacy. From mental health awareness to environmental health, join campaigns that matter.'
        }
      ]
    }
  },
  'youth-science': {
    title: 'Youth Science Movements and Student Activism',
    description: 'Join youth science movements and student science activism. Support student science movements and youth-led scientific campaigns for social change.',
    keywords: ['youth science', 'student science movements', 'youth activism', 'student research', 'youth leadership', 'student campaigns'],
    content: {
      hero: 'Empower the next generation of science leaders. Support youth-led scientific initiatives and student science movements driving change.',
      sections: [
        {
          title: 'Student Research Projects',
          content: 'Support student-led research initiatives addressing real-world problems. From AI ethics to climate solutions, students are leading innovation.',
          stats: [
            { label: 'Student Projects', value: '200+' },
            { label: 'Youth Participants', value: '2,500+' },
            { label: 'Schools Involved', value: '100+' }
          ]
        },
        {
          title: 'Youth Science Leadership',
          content: 'Mentor young scientists and support youth science movements. Help students develop research skills and scientific leadership.'
        }
      ]
    }
  },
  'community-science': {
    title: 'Community Science Projects and Citizen Research',
    description: 'Join community science projects and citizen research initiatives. Participate in community-driven scientific research and public science engagement.',
    keywords: ['community science', 'citizen science', 'public science', 'community research', 'participatory research', 'volunteer research'],
    content: {
      hero: 'Make science accessible to everyone. Join community science projects that democratize research and empower local communities.',
      sections: [
        {
          title: 'Citizen Science Initiatives',
          content: 'Participate in citizen science projects that advance research while engaging communities. From biodiversity monitoring to air quality studies.',
          stats: [
            { label: 'Citizen Science Projects', value: '300+' },
            { label: 'Community Volunteers', value: '8,000+' },
            { label: 'Research Publications', value: '50+' }
          ]
        },
        {
          title: 'Community-Led Research',
          content: 'Support research initiatives driven by community needs. Help communities use science to address local challenges and opportunities.'
        }
      ]
    }
  }
};

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return Object.keys(topicData).map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const topic = topicData[slug];
  
  if (!topic) {
    return {
      title: 'Topic Not Found | Science for Action',
    };
  }

  return {
    title: `${topic.title} | Science for Action`,
    description: topic.description,
    keywords: topic.keywords.join(', '),
    openGraph: {
      title: `${topic.title} | Science for Action`,
      description: topic.description,
      url: `https://scienceforactions.me/topic/${slug}`,
      siteName: 'Science for Action',
      images: [
        {
          url: `https://scienceforactions.me/og-${slug}.jpg`,
          width: 1200,
          height: 630,
          alt: topic.title
        }
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${topic.title} | Science for Action`,
      description: topic.description,
      images: [`https://scienceforactions.me/og-${slug}.jpg`],
    },
    alternates: {
      canonical: `https://scienceforactions.me/topic/${slug}`,
    }
  };
}

export default async function TopicPage({ params }: Props) {
  const { slug } = await params;
  const topic = topicData[slug];

  if (!topic) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": topic.title,
    "description": topic.description,
    "url": `https://scienceforactions.me/topic/${slug}`,
    "isPartOf": {
      "@type": "WebSite",
      "name": "Science for Action",
      "url": "https://scienceforactions.me"
    },
    "about": topic.keywords.map(keyword => ({
      "@type": "Thing",
      "name": keyword
    })),
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": topic.content.sections.length,
      "itemListElement": topic.content.sections.map((section, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "Article",
          "name": section.title,
          "description": section.content
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
        <header className="bg-gradient-to-r from-blue-600 to-green-600 text-white">
          <div className="max-w-6xl mx-auto px-4 py-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {topic.title}
            </h1>
            <p className="text-xl md:text-2xl max-w-4xl">
              {topic.content.hero}
            </p>
            <div className="mt-8">
              <a 
                href="/explore" 
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Explore {topic.title.split(' ')[0]} Causes
              </a>
            </div>
          </div>
        </header>

        {/* Content Sections */}
        <main className="max-w-6xl mx-auto px-4 py-12">
          {topic.content.sections.map((section, index) => (
            <section key={index} className="mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                {section.title}
              </h2>
              <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                {section.content}
              </p>
              
              {section.stats && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {section.stats.map((stat, statIndex) => (
                    <div key={statIndex} className="bg-white p-6 rounded-lg shadow-sm border text-center">
                      <div className="text-3xl font-bold text-blue-600 mb-2">
                        {stat.value}
                      </div>
                      <div className="text-gray-600">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          ))}

          {/* Call to Action */}
          <section className="bg-gray-50 p-8 rounded-lg text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Make an Impact?
            </h3>
            <p className="text-gray-700 mb-6">
              Join thousands of volunteers supporting {slug.replace('-', ' ')} causes worldwide.
            </p>
            <div className="space-x-4">
              <a 
                href="/main" 
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Start Taking Action
              </a>
              <a 
                href={`/explore?topic=${slug}`}
                className="bg-gray-200 text-gray-800 px-8 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                Browse Related Causes
              </a>
            </div>
          </section>

          {/* Related Topics */}
          <section className="mt-16">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Related Topics
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.keys(topicData)
                .filter(topicSlug => topicSlug !== slug)
                .slice(0, 4)
                .map((relatedSlug) => (
                <a 
                  key={relatedSlug}
                  href={`/topic/${relatedSlug}`}
                  className="bg-white p-4 rounded-lg shadow-sm border hover:shadow-md transition-shadow"
                >
                  <h4 className="font-semibold text-gray-900 capitalize">
                    {relatedSlug.replace('-', ' ')}
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    {topicData[relatedSlug].description.slice(0, 60)}...
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
