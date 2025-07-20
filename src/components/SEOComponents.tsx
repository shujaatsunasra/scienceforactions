import React from 'react';
import Link from 'next/link';

interface InternalLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  title?: string;
  prefetch?: boolean;
}

export default function InternalLink({ 
  href, 
  children, 
  className = '', 
  title,
  prefetch = true 
}: InternalLinkProps) {
  return (
    <Link 
      href={href} 
      className={className}
      title={title}
      prefetch={prefetch}
    >
      {children}
    </Link>
  );
}

// SEO-optimized navigation component
interface SEONavigationProps {
  currentPath: string;
}

export function SEONavigation({ currentPath }: SEONavigationProps) {
  const navItems = [
    {
      href: '/main',
      label: 'Take Action',
      title: 'Find and join science-driven causes in your community',
      keywords: 'science action dashboard'
    },
    {
      href: '/explore',
      label: 'Explore Causes',
      title: 'Discover science campaigns and civic engagement opportunities',
      keywords: 'explore science causes'
    },
    {
      href: '/tool',
      label: 'Action Tool',
      title: 'Get personalized science cause recommendations',
      keywords: 'personalized action tool'
    },
    {
      href: '/profile',
      label: 'Your Impact',
      title: 'Track your science activism and community engagement',
      keywords: 'track science impact'
    }
  ];

  return (
    <nav className="seo-navigation" role="navigation" aria-label="Main navigation">
      <ul className="flex flex-wrap gap-4">
        {navItems.map((item) => (
          <li key={item.href}>
            <InternalLink
              href={item.href}
              title={item.title}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                currentPath === item.href 
                  ? 'text-primary border-b-2 border-primary' 
                  : 'text-grayText hover:text-text'
              }`}
            >
              {item.label}
            </InternalLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

// Content blocks with SEO-rich text
export function SEOContentBlock() {
  return (
    <section className="seo-content-block py-8 text-center max-w-4xl mx-auto">
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-text">
            Citizen Science Campaigns
          </h3>
          <p className="text-sm text-grayText">
            Join thousands supporting real-world <strong>climate science action</strong> and 
            environmental research in communities worldwide.
          </p>
          <InternalLink 
            href="/explore?category=environment"
            className="text-primary text-sm hover:underline"
            title="Explore environmental science campaigns"
          >
            Explore Environmental Causes →
          </InternalLink>
        </div>
        
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-text">
            Community-Driven Research
          </h3>
          <p className="text-sm text-grayText">
            Browse <strong>citizen-driven scientific campaigns</strong> and contribute to 
            research that makes a difference in your local area.
          </p>
          <InternalLink 
            href="/tool"
            className="text-primary text-sm hover:underline"
            title="Find personalized research opportunities"
          >
            Find Your Cause →
          </InternalLink>
        </div>
        
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-text">
            Science Activism Network
          </h3>
          <p className="text-sm text-grayText">
            Your community can lead the next breakthrough in <strong>civic science</strong>. 
            Connect with advocates and researchers making real change.
          </p>
          <InternalLink 
            href="/profile"
            className="text-primary text-sm hover:underline"
            title="Join the science activism community"
          >
            Track Your Impact →
          </InternalLink>
        </div>
      </div>
      
      <div className="bg-gray-50 p-6 rounded-lg">
        <h4 className="text-xl font-bold text-text mb-4">
          Why Science for Action?
        </h4>
        <p className="text-grayText leading-relaxed">
          <strong>Science for Action</strong> is more than a platform—it's a movement connecting 
          <em>science activists</em>, <em>community organizers</em>, and <em>civic engagement advocates</em> 
          worldwide. Whether you're interested in <strong>climate action</strong>, 
          <strong>public health research</strong>, or <strong>environmental justice</strong>, 
          our platform helps you find meaningful ways to contribute to <em>science-backed social change</em>.
        </p>
      </div>
    </section>
  );
}

// Related causes/suggestions component for internal linking
interface RelatedCausesProps {
  currentTopic?: string;
  currentLocation?: string;
}

export function RelatedCauses({ currentTopic, currentLocation }: RelatedCausesProps) {
  const suggestions = [
    {
      title: 'Climate Action Campaigns',
      description: 'Join local climate science initiatives',
      href: '/explore?topic=climate',
      keywords: 'climate action, environmental science'
    },
    {
      title: 'Public Health Research',
      description: 'Support community health studies',
      href: '/explore?topic=health',
      keywords: 'public health, community research'
    },
    {
      title: 'Conservation Projects',
      description: 'Participate in biodiversity research',
      href: '/explore?topic=conservation',
      keywords: 'conservation, biodiversity, citizen science'
    }
  ];

  return (
    <aside className="related-causes mt-8 p-6 bg-gray-50 rounded-lg">
      <h3 className="text-lg font-semibold text-text mb-4">
        Related Science Causes
      </h3>
      <div className="grid md:grid-cols-3 gap-4">
        {suggestions.map((cause, index) => (
          <div key={index} className="space-y-2">
            <InternalLink 
              href={cause.href}
              className="block text-primary font-medium hover:underline"
              title={cause.keywords}
            >
              {cause.title}
            </InternalLink>
            <p className="text-sm text-grayText">
              {cause.description}
            </p>
          </div>
        ))}
      </div>
    </aside>
  );
}
