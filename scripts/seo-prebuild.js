const fs = require('fs');
const path = require('path');

// AGGRESSIVE SEO: Pre-build validation and setup
console.log('🔍 Starting SEO pre-build validation...');

// Validate critical SEO files exist
const criticalFiles = [
  'src/app/layout.tsx',
  'src/app/page.tsx',
  'src/app/sitemap.ts',
  'src/app/robots.ts',
  'src/lib/seo.ts'
];

const missingFiles = criticalFiles.filter(file => !fs.existsSync(file));
if (missingFiles.length > 0) {
  console.error('❌ Critical SEO files missing:', missingFiles);
  process.exit(1);
}

// Validate sitemap has sufficient entries
try {
  const sitemapContent = fs.readFileSync('src/app/sitemap.ts', 'utf8');
  const entryCount = (sitemapContent.match(/url:/g) || []).length;
  if (entryCount < 50) {
    console.warn(`⚠️  Sitemap has only ${entryCount} entries. Consider adding more for better SEO coverage.`);
  } else {
    console.log(`✅ Sitemap contains ${entryCount} entries`);
  }
} catch (error) {
  console.error('❌ Error reading sitemap:', error);
  process.exit(1);
}

// Validate robots.txt configuration
try {
  const robotsContent = fs.readFileSync('src/app/robots.ts', 'utf8');
  if (!robotsContent.includes('sitemap:') && !robotsContent.includes('Sitemap:')) {
    console.error('❌ Robots.txt missing sitemap reference');
    process.exit(1);
  }
  console.log('✅ Robots.txt properly configured');
} catch (error) {
  console.error('❌ Error reading robots.ts:', error);
  process.exit(1);
}

// Validate meta tags in layout
try {
  const layoutContent = fs.readFileSync('src/app/layout.tsx', 'utf8');
  const requiredMeta = ['title', 'description', 'keywords', 'openGraph'];
  const missingMeta = requiredMeta.filter(meta => !layoutContent.includes(meta));
  
  if (missingMeta.length > 0) {
    console.warn('⚠️  Layout missing meta tags:', missingMeta);
  } else {
    console.log('✅ Layout contains all essential meta tags');
  }
} catch (error) {
  console.error('❌ Error reading layout.tsx:', error);
  process.exit(1);
}

// Create SEO manifest
const seoManifest = {
  buildTime: new Date().toISOString(),
  version: '1.0.0',
  baseUrl: 'https://scienceforactions.me',
  siteName: 'Science for Action',
  validation: {
    criticalFiles: criticalFiles.length,
    sitemapEntries: (fs.readFileSync('src/app/sitemap.ts', 'utf8').match(/url:/g) || []).length,
    robotsConfigured: true,
    metaTagsPresent: true
  }
};

fs.writeFileSync('seo-manifest.json', JSON.stringify(seoManifest, null, 2));
console.log('✅ SEO manifest created');
console.log('🚀 Pre-build validation complete!');
