/**
 * Build & Verification Script for Bleigh Bande Portfolio & Mobile Hub
 * Runs during CI/CD to validate assets, check integrity, and compile build output.
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 Starting Portfolio Build & Compilation Process...\n');

const criticalFiles = [
    { file: 'index.html', label: 'Main Portfolio HTML' },
    { file: 'styles.css', label: 'Main Portfolio Stylesheet' },
    { file: 'script.js', label: 'Main Interactive Systems Logic' },
    { file: 'mobile/index.html', label: 'Mobile Android Hub HTML' },
    { file: 'mobile/styles.css', label: 'Mobile Hub Stylesheet' },
    { file: 'mobile/app.js', label: 'Mobile App Logic & Cloud Controller' },
    { file: 'mobile/manifest.json', label: 'Android PWA Web Manifest' },
    { file: 'mobile/sw.js', label: 'Service Worker Offline Cache' },
    { file: 'sitemap.xml', label: 'SEO Sitemap' },
    { file: 'robots.txt', label: 'Robots Protocol' },
    { file: 'Bleigh Bande IT CV .pdf', label: 'Official Curriculum Vitae (PDF)' }
];

let errors = 0;
let totalBytes = 0;

console.log('📦 Validating Project Assets & File System Integrity:');
criticalFiles.forEach(({ file, label }) => {
    const fullPath = path.join(__dirname, file);
    if (fs.existsSync(fullPath)) {
        const stats = fs.statSync(fullPath);
        totalBytes += stats.size;
        console.log(`  ✓ [PASS] ${file.padEnd(28)} ${(stats.size / 1024).toFixed(1).padStart(7)} KB  (${label})`);
    } else {
        console.error(`  ✗ [FAIL] Missing critical file: ${file}`);
        errors++;
    }
});

// Validate JSON files
console.log('\n🔍 Validating JSON Data Integrity:');
const jsonFiles = ['mobile/manifest.json', 'package.json'];
jsonFiles.forEach((file) => {
    try {
        const content = fs.readFileSync(path.join(__dirname, file), 'utf8');
        JSON.parse(content);
        console.log(`  ✓ [VALID JSON] ${file}`);
    } catch (err) {
        console.error(`  ✗ [INVALID JSON] ${file}:`, err.message);
        errors++;
    }
});

if (errors > 0) {
    console.error(`\n❌ Build failed with ${errors} error(s).`);
    process.exit(1);
}

console.log(`\n✨ Build & Asset Compilation Successful! Total build size: ${(totalBytes / 1024).toFixed(1)} KB`);
process.exit(0);
