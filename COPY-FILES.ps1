# PowerShell script to copy all source files from Figma Make structure to /cleancloth-export
# Run this from the PROJECT ROOT directory (not from cleancloth-export)

Write-Host "🧹 CleanCloth - Copying Source Files to Export Folder" -ForegroundColor Cyan
Write-Host "======================================================" -ForegroundColor Cyan
Write-Host ""

# Check if we're in the right directory
if (-not (Test-Path "App.tsx") -or -not (Test-Path "components") -or -not (Test-Path "pages")) {
    Write-Host "❌ ERROR: Please run this script from the project root directory" -ForegroundColor Red
    Write-Host "   (the folder containing App.tsx, components/, and pages/)" -ForegroundColor Yellow
    exit 1
}

# Check if export folder exists
if (-not (Test-Path "cleancloth-export")) {
    Write-Host "❌ ERROR: cleancloth-export folder not found" -ForegroundColor Red
    Write-Host "   Please make sure you're in the correct directory" -ForegroundColor Yellow
    exit 1
}

Write-Host "📁 Copying components..." -ForegroundColor Green
Copy-Item -Path "components\*" -Destination "cleancloth-export\src\components\" -Recurse -Force
Write-Host "   ✓ Copied all components" -ForegroundColor Gray

Write-Host "📁 Copying pages..." -ForegroundColor Green
Copy-Item -Path "pages\*" -Destination "cleancloth-export\src\pages\" -Recurse -Force
Write-Host "   ✓ Copied all pages" -ForegroundColor Gray

Write-Host ""
Write-Host "✅ All source files copied successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "📂 Next steps:" -ForegroundColor Cyan
Write-Host "1. cd cleancloth-export"
Write-Host "2. npm install"
Write-Host "3. npm run dev"
Write-Host ""
Write-Host "🚀 Your standalone React app is ready!" -ForegroundColor Green
