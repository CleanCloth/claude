# ✅ Setup Checklist

## Before You Start

- [ ] You have Node.js 18+ installed
- [ ] You're in the PROJECT ROOT directory (where App.tsx, components/, pages/ are located)

---

## Step-by-Step Setup

### 1. Copy Source Files

- [ ] Run copy script OR manually copy folders:
  - `chmod +x cleancloth-export/COPY-FILES.sh && ./cleancloth-export/COPY-FILES.sh` (Mac/Linux)
  - `.\cleancloth-export\COPY-FILES.ps1` (Windows)
  - OR manually copy `/components` and `/pages` folders

### 2. Verify Files Were Copied

- [ ] `/cleancloth-export/src/components/` exists and has files
- [ ] `/cleancloth-export/src/components/ui/` exists (44 files)
- [ ] `/cleancloth-export/src/components/figma/` exists (1 file)
- [ ] `/cleancloth-export/src/pages/` exists (11 files)
- [ ] Total should be ~63 source files

### 3. Install Dependencies

- [ ] `cd cleancloth-export`
- [ ] `npm install` (this takes 1-2 minutes)
- [ ] No errors during installation

### 4. Start Development Server

- [ ] `npm run dev`
- [ ] Server starts successfully
- [ ] Browser opens at http://localhost:3000
- [ ] Website loads without errors

### 5. Test Basic Functionality

- [ ] Homepage loads with video background
- [ ] Navigation menu opens/closes
- [ ] Can navigate between pages
- [ ] Booking form works
- [ ] No console errors

---

## Production Build

- [ ] `npm run build` completes successfully
- [ ] `/dist` folder created
- [ ] No build errors

---

## Deployment Ready! 🚀

Once all checkboxes are ✅, your app is ready to:
- Develop locally
- Build for production  
- Deploy to hosting (Vercel, Netlify, etc.)

---

## Need Help?

- Check **INSTALLATION-GUIDE.md** for detailed instructions
- Check **STATUS.txt** for current setup status
- See `/docs` folder in main project for full documentation
