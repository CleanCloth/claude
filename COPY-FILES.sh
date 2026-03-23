#!/bin/bash

# Script to copy all source files from Figma Make structure to /cleancloth-export
# Run this from the PROJECT ROOT directory (not from cleancloth-export)

echo "🧹 CleanCloth - Copying Source Files to Export Folder"
echo "======================================================"
echo ""

# Check if we're in the right directory
if [ ! -f "App.tsx" ] || [ ! -d "components" ] || [ ! -d "pages" ]; then
  echo "❌ ERROR: Please run this script from the project root directory"
  echo "   (the folder containing App.tsx, components/, and pages/)"
  exit 1
fi

# Check if export folder exists
if [ ! -d "cleancloth-export" ]; then
  echo "❌ ERROR: cleancloth-export folder not found"
  echo "   Please make sure you're in the correct directory"
  exit 1
fi

echo "📁 Copying components..."
cp -r components/* cleancloth-export/src/components/
echo "   ✓ Copied all components"

echo "📁 Copying pages..."
cp -r pages/* cleancloth-export/src/pages/
echo "   ✓ Copied all pages"

echo ""
echo "✅ All source files copied successfully!"
echo ""
echo "📂 Next steps:"
echo "1. cd cleancloth-export"
echo "2. npm install"
echo "3. npm run dev"
echo ""
echo "🚀 Your standalone React app is ready!"
