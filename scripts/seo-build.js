#!/usr/bin/env node

/**
 * SEO Build Optimization Script
 * Runs during build process to ensure SEO best practices
 */

const fs = require('fs');
const path = require('path');

// SEO validation checks
function validateSEO() {
  console.log('🔍 Running SEO validation checks...');
  
  const errors = [];
  const warnings = [];
  
  // Check if required files exist
  const requiredFiles = [
    'public/manifest.json',
    'public/robots.txt',
    'src/lib/seo.ts',
    'CNAME'
  ];
  
  requiredFiles.forEach(file => {
    if (!fs.existsSync(file)) {
      errors.push(`Missing required file: ${file}`);
    }
  });
  
  // Validate CNAME
  if (fs.existsSync('CNAME')) {
    const cname = fs.readFileSync('CNAME', 'utf8').trim();
    if (cname !== 'scienceforactions.me') {
      errors.push(`CNAME should be 'scienceforactions.me', found: '${cname}'`);
    }
  }
  
  // Check manifest.json
  if (fs.existsSync('public/manifest.json')) {
    try {
      const manifest = JSON.parse(fs.readFileSync('public/manifest.json', 'utf8'));
      if (!manifest.name || !manifest.short_name || !manifest.start_url) {
        warnings.push('manifest.json missing required fields');
      }
    } catch (e) {
      errors.push('manifest.json is invalid JSON');
    }
  }
  
  // Validate meta tags in pages
  const pageFiles = [
    'src/app/page.tsx',
    'src/app/main/page.tsx', 
    'src/app/explore/page.tsx',
    'src/app/tool/page.tsx',
    'src/app/profile/page.tsx'
  ];
  
  pageFiles.forEach(file => {
    if (fs.existsSync(file)) {
      const content = fs.readFileSync(file, 'utf8');
      if (!content.includes('generateSEOMetadata') && !content.includes('metadata')) {
        warnings.push(`${file} may be missing SEO metadata`);
      }
    }
  });
  
  // Report results
  if (errors.length > 0) {
    console.error('❌ SEO Validation Errors:');
    errors.forEach(error => console.error(`  - ${error}`));
    process.exit(1);
  }
  
  if (warnings.length > 0) {
    console.warn('⚠️  SEO Warnings:');
    warnings.forEach(warning => console.warn(`  - ${warning}`));
  }
  
  console.log('✅ SEO validation passed!');
}

// Generate sitemap after build
function generateSitemap() {
  console.log('🗺️  Generating sitemap...');
  
  const baseUrl = 'https://scienceforactions.me';
  const routes = [
    { path: '', priority: 1.0, changefreq: 'daily' },
    { path: '/main', priority: 0.9, changefreq: 'daily' },
    { path: '/explore', priority: 0.8, changefreq: 'weekly' },
    { path: '/tool', priority: 0.8, changefreq: 'weekly' },
    { path: '/profile', priority: 0.7, changefreq: 'weekly' }
  ];
  
  const lastmod = new Date().toISOString().split('T')[0];
  
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map(route => `  <url>
    <loc>${baseUrl}${route.path}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  fs.writeFileSync('public/sitemap.xml', sitemap);
  console.log('✅ Sitemap generated at public/sitemap.xml');
}

// Generate robots.txt
function generateRobots() {
  console.log('🤖 Generating robots.txt...');
  
  const robots = `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/

# Sitemap
Sitemap: https://scienceforactions.me/sitemap.xml

# Crawl-delay for respectful crawling
Crawl-delay: 1`;

  fs.writeFileSync('public/robots.txt', robots);
  console.log('✅ robots.txt generated');
}

// Optimize build output
function optimizeBuild() {
  console.log('⚡ Optimizing build for SEO...');
  
  // Copy CNAME to out directory if it exists
  if (fs.existsSync('out') && fs.existsSync('CNAME')) {
    fs.copyFileSync('CNAME', 'out/CNAME');
    console.log('✅ CNAME copied to build output');
  }
  
  // Ensure sitemap and robots are in out directory
  if (fs.existsSync('out')) {
    if (fs.existsSync('public/sitemap.xml')) {
      fs.copyFileSync('public/sitemap.xml', 'out/sitemap.xml');
    }
    if (fs.existsSync('public/robots.txt')) {
      fs.copyFileSync('public/robots.txt', 'out/robots.txt');
    }
    console.log('✅ SEO files copied to build output');
  }
}

// Main execution
function main() {
  const command = process.argv[2];
  
  switch (command) {
    case 'validate':
      validateSEO();
      break;
    case 'generate':
      generateSitemap();
      generateRobots();
      break;
    case 'optimize':
      optimizeBuild();
      break;
    case 'all':
      validateSEO();
      generateSitemap();
      generateRobots();
      optimizeBuild();
      break;
    default:
      console.log('Usage: node seo-build.js [validate|generate|optimize|all]');
      console.log('  validate - Check SEO configuration');
      console.log('  generate - Generate sitemap and robots.txt');
      console.log('  optimize - Optimize build output');
      console.log('  all      - Run all SEO tasks');
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  validateSEO,
  generateSitemap,
  generateRobots,
  optimizeBuild
};
