import { MetadataRoute } from 'next'

export const dynamic = 'force-static'

// GOOGLE-FOCUSED: Sitemap for 1M+ user targeting
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://scienceforactions.me'
  const currentDate = new Date()
  
  // Core pages with highest priority for Google
  const corePages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/main`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/explore`,
      lastModified: currentDate,
      changeFrequency: 'hourly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/tool`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/profile`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/admin`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.6,
    }
  ]

  // GOOGLE TARGET: 1M USER SCALE - Topic pages for massive keyword coverage
  const topicKeywords = [
    // Primary science keywords
    'climate-action', 'public-health', 'ai-ethics', 'youth-science', 'environmental-justice',
    'community-science', 'civic-engagement', 'volunteer-science', 'citizen-science',
    'science-activism', 'public-science', 'stem-community', 'science-for-change',
    
    // Long-tail keywords for Google traffic
    'climate-volunteer-platform', 'student-movements', 'environmental-action', 'public-research',
    'science-campaigns', 'volunteer-research', 'climate-support', 'science-education',
    'environmental-activism', 'climate-science-jobs', 'volunteer-opportunities',
    'science-policy', 'research-participation', 'citizen-research', 'public-participation',
    
    // Location-based science keywords
    'science-india', 'science-usa', 'science-uk', 'science-canada', 'science-australia',
    'climate-india', 'climate-usa', 'climate-uk', 'health-research-india', 'health-usa',
    'environmental-india', 'environmental-usa', 'youth-science-india', 'youth-science-usa',
    
    // Career and education focused
    'science-careers', 'research-careers', 'climate-jobs', 'environmental-careers',
    'science-internships', 'research-internships', 'volunteer-internships', 'science-education',
    'stem-education', 'science-mentorship', 'research-mentorship', 'science-training',
    
    // Problem-specific keywords for Google search intent
    'air-pollution-solutions', 'water-quality-research', 'renewable-energy-projects',
    'waste-reduction-science', 'biodiversity-conservation', 'ocean-conservation',
    'forest-protection', 'sustainable-agriculture', 'green-technology', 'clean-energy',
    
    // Demographic-targeted keywords
    'women-in-science', 'minorities-in-science', 'students-in-research', 'seniors-volunteering',
    'professionals-volunteering', 'teachers-science-support', 'parents-science-education',
    
    // Action-oriented keywords for conversion
    'join-science-cause', 'volunteer-for-science', 'support-research', 'fund-science',
    'participate-research', 'citizen-scientist', 'science-volunteer', 'research-volunteer',
    'environmental-volunteer', 'climate-volunteer', 'health-volunteer', 'education-volunteer'
  ]

  const topicPages = topicKeywords.map(topic => ({
    url: `${baseUrl}/topic/${topic}`,
    lastModified: currentDate,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  // GOOGLE TARGET: Location-based pages for local search dominance
  const locations = [
    // Major global cities for science
    'new-york', 'los-angeles', 'chicago', 'houston', 'philadelphia', 'phoenix', 'san-antonio',
    'san-diego', 'dallas', 'san-jose', 'austin', 'jacksonville', 'san-francisco', 'columbus',
    'fort-worth', 'indianapolis', 'charlotte', 'seattle', 'denver', 'boston', 'detroit',
    
    'london', 'manchester', 'birmingham', 'glasgow', 'liverpool', 'bristol', 'sheffield',
    'leeds', 'edinburgh', 'leicester', 'coventry', 'bradford', 'cardiff', 'belfast',
    
    'delhi', 'mumbai', 'bangalore', 'hyderabad', 'chennai', 'kolkata', 'pune', 'ahmedabad',
    'jaipur', 'surat', 'lucknow', 'kanpur', 'nagpur', 'indore', 'thane', 'bhopal',
    
    'toronto', 'vancouver', 'montreal', 'calgary', 'edmonton', 'ottawa', 'winnipeg',
    'quebec-city', 'hamilton', 'kitchener', 'london-ontario', 'victoria', 'halifax',
    
    'sydney', 'melbourne', 'brisbane', 'perth', 'adelaide', 'gold-coast', 'canberra',
    'newcastle', 'wollongong', 'geelong', 'hobart', 'townsville', 'cairns',
    
    'berlin', 'hamburg', 'munich', 'cologne', 'frankfurt', 'stuttgart', 'dusseldorf',
    'dortmund', 'essen', 'leipzig', 'bremen', 'dresden', 'hanover', 'nuremberg',
    
    'paris', 'marseille', 'lyon', 'toulouse', 'nice', 'nantes', 'strasbourg',
    'montpellier', 'bordeaux', 'lille', 'rennes', 'reims', 'toulon'
  ]

  const locationPages = locations.map(location => ({
    url: `${baseUrl}/explore/${location}`,
    lastModified: currentDate,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  // GOOGLE TARGET: Search intent pages for high-volume keywords
  const searchIntents = [
    'how-to-join-science-cause', 'public-science-projects-near-me', 'climate-volunteer-platform',
    'student-science-movements', 'volunteer-science-opportunities', 'community-research-projects',
    'citizen-science-campaigns', 'environmental-activism-groups', 'science-advocacy-organizations',
    'local-environmental-causes', 'climate-action-groups', 'public-health-initiatives',
    'science-volunteer-jobs', 'research-participation-opportunities', 'climate-action-volunteer',
    'environmental-science-volunteer', 'public-health-volunteer', 'education-science-volunteer',
    'youth-science-programs', 'student-research-opportunities', 'science-mentorship-programs',
    'science-internship-programs', 'research-assistant-volunteer', 'lab-volunteer-opportunities',
    'field-research-volunteer', 'data-collection-volunteer', 'science-outreach-volunteer',
    'science-education-volunteer', 'stem-volunteer-opportunities', 'science-fair-volunteer',
    'science-museum-volunteer', 'nature-conservation-volunteer', 'wildlife-research-volunteer',
    'marine-conservation-volunteer', 'forest-conservation-volunteer', 'urban-ecology-volunteer'
  ]

  const searchPages = searchIntents.map(query => ({
    url: `${baseUrl}/search/${query}`,
    lastModified: currentDate,
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  // GOOGLE TARGET: Problem-solution pages for high-intent traffic
  const problems = [
    'air-pollution', 'water-contamination', 'climate-change', 'deforestation', 'ocean-pollution',
    'plastic-waste', 'food-insecurity', 'energy-crisis', 'biodiversity-loss', 'urban-heat',
    'drought', 'flooding', 'soil-degradation', 'noise-pollution', 'light-pollution',
    'chemical-contamination', 'electronic-waste', 'carbon-emissions', 'methane-emissions',
    'habitat-destruction', 'species-extinction', 'coral-bleaching', 'glacier-melting'
  ]

  const problemPages = problems.map(problem => ({
    url: `${baseUrl}/solutions/${problem}`,
    lastModified: currentDate,
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }))

  // GOOGLE TARGET: Massive cause database for long-tail traffic
  const causeTemplates = [
    'save-local-wetlands', 'urban-air-quality', 'renewable-energy-access', 'community-gardens',
    'science-education-equity', 'climate-resilience', 'biodiversity-conservation', 'waste-reduction',
    'water-quality-monitoring', 'sustainable-transport', 'green-infrastructure', 'energy-efficiency',
    'pollution-tracking', 'ecosystem-restoration', 'climate-adaptation', 'environmental-health',
    'sustainable-agriculture', 'ocean-conservation', 'forest-protection', 'clean-technology'
  ]

  // Generate 500+ cause pages for massive Google indexing
  const causePages = Array.from({ length: 500 }, (_, i) => {
    const template = causeTemplates[i % causeTemplates.length]
    const cityIndex = i % locations.length
    const city = locations[cityIndex]
    
    return {
      url: `${baseUrl}/cause/${template}-${city}-${Math.floor(i / 20) + 1}`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.4,
    }
  })

  console.log(`Generated ${corePages.length + topicPages.length + locationPages.length + searchPages.length + problemPages.length + causePages.length} URLs for Google indexing`)

  return [
    ...corePages,
    ...topicPages,
    ...locationPages,
    ...searchPages,
    ...problemPages,
    ...causePages
  ]
}
