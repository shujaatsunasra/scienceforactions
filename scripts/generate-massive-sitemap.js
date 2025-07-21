const fs = require('fs');
const path = require('path');

// GOOGLE-FOCUSED: Generate massive sitemap for 1M+ user targeting
console.log('🚀 Generating massive Google-focused sitemap...');

const baseUrl = 'https://scienceforactions.me';
const currentDate = new Date().toISOString().split('T')[0];

// Build comprehensive URL list
const urls = [];

// Core pages
const corePages = [
  { url: baseUrl, priority: '1.0', changefreq: 'daily' },
  { url: `${baseUrl}/main`, priority: '0.9', changefreq: 'daily' },
  { url: `${baseUrl}/explore`, priority: '0.9', changefreq: 'hourly' },
  { url: `${baseUrl}/tool`, priority: '0.8', changefreq: 'daily' },
  { url: `${baseUrl}/profile`, priority: '0.7', changefreq: 'weekly' },
  { url: `${baseUrl}/admin`, priority: '0.6', changefreq: 'weekly' }
];

urls.push(...corePages);

// Topic pages for massive keyword coverage
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
];

const topicPages = topicKeywords.map(topic => ({
  url: `${baseUrl}/topic/${topic}`,
  priority: '0.8',
  changefreq: 'weekly'
}));

urls.push(...topicPages);

// Location pages for local search dominance
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
];

const locationPages = locations.map(location => ({
  url: `${baseUrl}/explore/${location}`,
  priority: '0.7',
  changefreq: 'weekly'
}));

urls.push(...locationPages);

// Search intent pages for high-volume keywords
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
];

const searchPages = searchIntents.map(query => ({
  url: `${baseUrl}/search/${query}`,
  priority: '0.6',
  changefreq: 'weekly'
}));

urls.push(...searchPages);

// Problem-solution pages for high-intent traffic
const problems = [
  'air-pollution', 'water-contamination', 'climate-change', 'deforestation', 'ocean-pollution',
  'plastic-waste', 'food-insecurity', 'energy-crisis', 'biodiversity-loss', 'urban-heat',
  'drought', 'flooding', 'soil-degradation', 'noise-pollution', 'light-pollution',
  'chemical-contamination', 'electronic-waste', 'carbon-emissions', 'methane-emissions',
  'habitat-destruction', 'species-extinction', 'coral-bleaching', 'glacier-melting'
];

const problemPages = problems.map(problem => ({
  url: `${baseUrl}/solutions/${problem}`,
  priority: '0.5',
  changefreq: 'monthly'
}));

urls.push(...problemPages);

// Massive cause database for long-tail traffic
const causeTemplates = [
  'save-local-wetlands', 'urban-air-quality', 'renewable-energy-access', 'community-gardens',
  'science-education-equity', 'climate-resilience', 'biodiversity-conservation', 'waste-reduction',
  'water-quality-monitoring', 'sustainable-transport', 'green-infrastructure', 'energy-efficiency',
  'pollution-tracking', 'ecosystem-restoration', 'climate-adaptation', 'environmental-health',
  'sustainable-agriculture', 'ocean-conservation', 'forest-protection', 'clean-technology'
];

// Generate 1000+ cause pages for massive Google indexing
for (let i = 0; i < 1000; i++) {
  const template = causeTemplates[i % causeTemplates.length];
  const cityIndex = i % locations.length;
  const city = locations[cityIndex];
  
  urls.push({
    url: `${baseUrl}/cause/${template}-${city}-${Math.floor(i / 20) + 1}`,
    priority: '0.4',
    changefreq: 'monthly'
  });
}

// Generate XML sitemap
const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(({ url, priority, changefreq }) => `  <url>
    <loc>${url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`).join('\n')}
</urlset>`;

// Write sitemap to output directory
const outputPath = path.join('out', 'sitemap.xml');
fs.writeFileSync(outputPath, sitemapXml);

console.log(`✅ Generated massive sitemap with ${urls.length} URLs for Google indexing`);
console.log(`📁 Sitemap saved to: ${outputPath}`);
console.log(`🎯 Google Search Console ready: https://scienceforactions.me/sitemap.xml`);
console.log(`📈 Target: 1M+ users through comprehensive keyword coverage`);
