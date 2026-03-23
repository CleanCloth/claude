#!/usr/bin/env node

/**
 * Node.js script to copy all source files to cleancloth-export
 * Run from project root: node cleancloth-export/copy-files.js
 */

const fs = require('fs');
const path = require('path');

console.log('🧹 CleanCloth - Copying Source Files');
console.log('=====================================\n');

// Check we're in the right directory
if (!fs.existsSync('App.tsx') || !fs.existsSync('components') || !fs.existsSync('pages')) {
  console.error('❌ ERROR: Please run this script from the project root directory');
  console.error('   (the folder containing App.tsx, components/, and pages/)');
  process.exit(1);
}

// Check export folder exists
if (!fs.existsSync('cleancloth-export')) {
  console.error('❌ ERROR: cleancloth-export folder not found');
  process.exit(1);
}

/**
 * Recursively copy directory
 */
function copyDirectory(src, dest) {
  // Create destination directory if it doesn't exist
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  // Read source directory
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      // Recursively copy subdirectory
      copyDirectory(srcPath, destPath);
    } else {
      // Copy file
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

try {
  console.log('📁 Copying components...');
  copyDirectory('components', 'cleancloth-export/src/components');
  console.log('   ✓ Copied all components\n');

  console.log('📁 Copying pages...');
  copyDirectory('pages', 'cleancloth-export/src/pages');
  console.log('   ✓ Copied all pages\n');

  // Count files
  const countFiles = (dir) => {
    let count = 0;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        count += countFiles(fullPath);
      } else if (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts')) {
        count++;
      }
    }
    return count;
  };

  const componentCount = countFiles('cleancloth-export/src/components');
  const pageCount = countFiles('cleancloth-export/src/pages');

  console.log('✅ All source files copied successfully!');
  console.log(`   • ${componentCount} component files`);
  console.log(`   • ${pageCount} page files`);
  console.log(`   • ${componentCount + pageCount} total files\n`);

  console.log('📂 Next steps:');
  console.log('1. cd cleancloth-export');
  console.log('2. npm install');
  console.log('3. npm run dev\n');

  console.log('🚀 Your standalone React app is ready!');

} catch (error) {
  console.error('❌ ERROR:', error.message);
  process.exit(1);
}
