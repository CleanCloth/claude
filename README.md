# CleanCloth Website - Complete Export

This is the complete Vite + React + TypeScript project ready for standalone deployment.

## ⚠️ SETUP REQUIRED - Read This First!

**The export folder is ready BUT needs source files copied.**

See **STATUS.txt** or **INSTALLATION-GUIDE.md** for complete instructions.

---

## 📦 What's Included

✅ **All Configuration Files:**
- package.json
- vite.config.ts
- tsconfig.json & tsconfig.node.json
- tailwind.config.js
- postcss.config.js
- index.html

✅ **Entry Files:**
- src/main.tsx (entry point)
- src/App.tsx (main application)  
- src/styles/globals.css

⚠️ **ACTION REQUIRED - Copy Source Files:**
- Need to copy /components folder (52 files)
- Need to copy /pages folder (11 pages)

---

## 🚀 Quick Setup (3 Steps)

### Step 1: Copy Files

Run from PROJECT ROOT (not from inside cleancloth-export):

**Option A - Node.js (All Platforms - Recommended):**
```bash
node cleancloth-export/copy-files.js
```

**Option B - Mac/Linux:**
```bash
chmod +x cleancloth-export/COPY-FILES.sh
./cleancloth-export/COPY-FILES.sh
```

**Option C - Windows PowerShell:**
```powershell
.\cleancloth-export\COPY-FILES.ps1
```

**Option D - Manual:**
- Copy `/components/*` → `/cleancloth-export/src/components/`
- Copy `/pages/*` → `/cleancloth-export/src/pages/`

### Step 2: Install Dependencies

```bash
cd cleancloth-export
npm install
```

### Step 3: Start Development

```bash
npm run dev
# Opens at http://localhost:3000
```

---

## 📂 Final Directory Structure

After copying all files, your structure should look like:

```
cleancloth-export/
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tsconfig.node.json
├── tailwind.config.js
├── postcss.config.js
├── index.html
├── README.md (this file)
│
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   │
│   ├── components/
│   │   ├── Navigation.tsx
│   │   ├── Footer.tsx
│   │   ├── SEO.tsx
│   │   ├── PageNavigation.tsx
│   │   ├── CommercialPriceCalculator.tsx
│   │   ├── TrustindexWidget.tsx
│   │   ├── figma/
│   │   │   └── ImageWithFallback.tsx
│   │   └── ui/
│   │       ├── accordion.tsx
│   │       ├── alert-dialog.tsx
│   │       ├── ... (42 more files)
│   │       └── utils.ts
│   │
│   ├── pages/
│   │   ├── PrivateCleaningPage.tsx
│   │   ├── FlytterengoringPage.tsx
│   │   ├── ... (9 more files)
│   │   └── ExtraServicesPage.tsx
│   │
│   └── styles/
│       └── globals.css
│
└── public/
    └── (place any local assets here)
```

## 🔧 Available Scripts

```bash
npm run dev      # Start development server (port 3000)
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## 🌐 Build for Production

```bash
# Build the project
npm run build

# Output will be in /dist folder
# Upload dist folder to any static hosting (Vercel, Netlify, etc.)
```

## 📝 Notes

- All import paths use relative imports from /src
- Path aliases are configured (@components, @pages, @styles)
- Tailwind CSS is configured with custom colors
- TypeScript strict mode is enabled

## 🆘 Troubleshooting

### Missing imports error
**Solution:** Make sure you copied ALL files from /components and /pages

### Module not found
**Solution:** Run `npm install` to install all dependencies

### Styles not loading
**Solution:** Verify globals.css exists in /src/styles

## 📖 More Information

For complete documentation, see the /docs folder in the original project.

---

**Ready to deploy!** 🚀

After copying the files and running `npm install`, you're ready to develop locally or build for production.
