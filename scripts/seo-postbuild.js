const fs = require('fs');
const path = require('path');

// AGGRESSIVE SEO: Post-build optimization and validation
console.log('🔧 Starting SEO post-build optimization...');

const outDir = 'out';

if (!fs.existsSync(outDir)) {
  console.error('❌ Build output directory not found');
  process.exit(1);
}

// Validate critical SEO files in output
const criticalOutputFiles = [
  'sitemap.xml',
  'robots.txt',
  'index.html'
];

const missingOutputFiles = criticalOutputFiles.filter(file => 
  !fs.existsSync(path.join(outDir, file))
);

if (missingOutputFiles.length > 0) {
  console.error('❌ Critical SEO files missing from build output:', missingOutputFiles);
  process.exit(1);
}

// Copy additional SEO files
const seoFiles = [
  { src: 'public/manifest.json', dest: 'manifest.json' },
  { src: 'CNAME', dest: 'CNAME' }
];

seoFiles.forEach(({ src, dest }) => {
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, path.join(outDir, dest));
    console.log(`✅ Copied ${src} to build output`);
  }
});

// Validate HTML pages have meta tags
const validateHtmlFile = (filePath) => {
  const content = fs.readFileSync(filePath, 'utf8');
  const requiredTags = [
    '<title>',
    '<meta name="description"',
    '<meta property="og:title"',
    '<meta property="og:description"'
  ];
  
  const missingTags = requiredTags.filter(tag => !content.includes(tag));
  return { file: filePath, missing: missingTags };
};

// Find all HTML files
const findHtmlFiles = (dir) => {
  const files = [];
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      files.push(...findHtmlFiles(fullPath));
    } else if (item.endsWith('.html')) {
      files.push(fullPath);
    }
  }
  
  return files;
};

const htmlFiles = findHtmlFiles(outDir);
console.log(`🔍 Validating ${htmlFiles.length} HTML files for SEO tags...`);

let validationErrors = 0;
htmlFiles.forEach(file => {
  const result = validateHtmlFile(file);
  if (result.missing.length > 0) {
    console.warn(`⚠️  ${file} missing tags:`, result.missing);
    validationErrors++;
  }
});

if (validationErrors === 0) {
  console.log('✅ All HTML files contain required SEO tags');
} else {
  console.warn(`⚠️  ${validationErrors} HTML files have missing SEO tags`);
}

// Validate sitemap.xml
if (fs.existsSync(path.join(outDir, 'sitemap.xml'))) {
  const sitemapContent = fs.readFileSync(path.join(outDir, 'sitemap.xml'), 'utf8');
  const urlCount = (sitemapContent.match(/<url>/g) || []).length;
  console.log(`✅ Sitemap generated with ${urlCount} URLs`);
  
  if (urlCount < 10) {
    console.warn('⚠️  Sitemap has very few URLs. Consider adding more pages.');
  }
} else {
  console.error('❌ Sitemap.xml not generated');
  process.exit(1);
}

// Create SEO report
const seoReport = {
  buildTime: new Date().toISOString(),
  outputDirectory: outDir,
  validation: {
    htmlFiles: htmlFiles.length,
    validationErrors: validationErrors,
    sitemapGenerated: fs.existsSync(path.join(outDir, 'sitemap.xml')),
    robotsGenerated: fs.existsSync(path.join(outDir, 'robots.txt')),
    manifestCopied: fs.existsSync(path.join(outDir, 'manifest.json')),
    cnameCopied: fs.existsSync(path.join(outDir, 'CNAME'))
  },
  recommendations: [
    'Submit sitemap to Google Search Console',
    'Submit sitemap to Bing Webmaster Tools',
    'Verify CNAME configuration for custom domain',
    'Monitor Core Web Vitals in Google PageSpeed Insights'
  ]
};

fs.writeFileSync('seo-build-report.json', JSON.stringify(seoReport, null, 2));
console.log('✅ SEO build report created');
console.log('🎉 Post-build optimization complete!');
console.log('📝 Next steps:');
console.log('   1. Deploy to GitHub Pages');
console.log('   2. Submit sitemap to search engines');
console.log('   3. Monitor indexing status');
