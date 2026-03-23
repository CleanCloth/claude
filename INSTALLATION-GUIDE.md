# 🚀 CleanCloth Export - Installation Guide

## ✅ Current Status

The `/cleancloth-export` folder contains:
- ✅ All configuration files (package.json, vite.config.ts, etc.)
- ✅ Entry files (index.html, main.tsx, App.tsx)
- ✅ Global styles (globals.css)
- ✅ Copy scripts (COPY-FILES.sh and COPY-FILES.ps1)
- ⚠️ **MISSING: Source files (components and pages)**

## 📋 What You Need To Do

You have **TWO OPTIONS** to complete the setup:

---

## Option 1: Automated Copy (Recommended) ⚡

### For Mac/Linux:
```bash
# Make script executable
chmod +x cleancloth-export/COPY-FILES.sh

# Run the script from PROJECT ROOT (not from inside cleancloth-export)
./cleancloth-export/COPY-FILES.sh
```

### For Windows PowerShell:
```powershell
# Run the script from PROJECT ROOT (not from inside cleancloth-export)
.\cleancloth-export\COPY-FILES.ps1
```

This will automatically copy:
- All 52 files from `/components/` to `/cleancloth-export/src/components/`
- All 11 files from `/pages/` to `/cleancloth-export/src/pages/`

---

## Option 2: Manual Copy 📁

If the scripts don't work, manually copy these folders:

1. **Copy components:**
   ```
   FROM: /components/*
   TO:   /cleancloth-export/src/components/
   ```
   
2. **Copy pages:**
   ```
   FROM: /pages/*
   TO:   /cleancloth-export/src/pages/
   ```

Make sure to copy the ENTIRE folder structure including subfolders:
- `components/ui/` (44 files)
- `components/figma/` (1 file)
- All root component files (7 files)

---

## 🎯 After Copying Files

Once the files are copied, your `/cleancloth-export` structure should look like:

```
cleancloth-export/
├── package.json
├── vite.config.ts
├── tsconfig.json
├── index.html
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── components/           ← 52 files total
│   │   ├── Navigation.tsx
│   │   ├── Footer.tsx
│   │   ├── SEO.tsx
│   │   ├── PageNavigation.tsx
│   │   ├── CommercialPriceCalculator.tsx
│   │   ├── TrustindexWidget.tsx
│   │   ├── figma/
│   │   │   └── ImageWithFallback.tsx
│   │   └── ui/              ← 44 Shadcn components
│   │       ├── accordion.tsx
│   │       ├── button.tsx
│   │       └── ... (42 more)
│   ├── pages/               ← 11 files total
│   │   ├── PrivateCleaningPage.tsx
│   │   ├── FlytterengoringPage.tsx
│   │   ├── CommercialCleaningPage.tsx
│   │   ├── BookPrivateCleaningPage.tsx
│   │   ├── BookFlytterengoringPage.tsx
│   │   ├── BookingHubPage.tsx
│   │   ├── PricingPage.tsx
│   │   ├── FAQPage.tsx
│   │   ├── HowItWorksPage.tsx
│   │   ├── ServiceIncludedPage.tsx
│   │   └── ExtraServicesPage.tsx
│   └── styles/
│       └── globals.css
└── public/
    └── (place assets here if needed)
```

---

## 🚀 Installation & Run

```bash
# 1. Navigate to export folder
cd cleancloth-export

# 2. Install dependencies (first time only)
npm install

# 3. Start development server
npm run dev

# Server will start at: http://localhost:3000
```

---

## 📦 Build for Production

```bash
# Build the project
npm run build

# Output will be in /dist folder
# Deploy the /dist folder to any hosting service
```

---

## ✅ Verification Checklist

Before running `npm install`, verify:

- [ ] `/cleancloth-export/src/components/` has 52 files
- [ ] `/cleancloth-export/src/components/ui/` has 44 files
- [ ] `/cleancloth-export/src/components/figma/` has 1 file
- [ ] `/cleancloth-export/src/pages/` has 11 files
- [ ] `/cleancloth-export/src/styles/globals.css` exists
- [ ] `/cleancloth-export/package.json` exists

---

## 🐛 Troubleshooting

### "Cannot find module" errors
**Solution:** Make sure ALL files were copied, including the `/ui/` subfolder

### "npm install" fails
**Solution:** Make sure you're inside the `cleancloth-export` folder when running the command

### Port 3000 already in use
**Solution:** Vite will automatically use the next available port (3001, 3002, etc.)

---

## 📞 Need Help?

Check the main project documentation in `/docs` folder for more details.

---

**After copying files and running `npm install`, you'll have a fully working standalone React app!** 🎉
