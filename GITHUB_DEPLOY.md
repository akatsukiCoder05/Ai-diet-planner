# 🚀 GitHub Push & Deployment Guide

## Part 1: Push to GitHub

### Step 1: Initialize Git (if not already done)
```bash
cd d:\fullstack\Ditepalnner
git init
```

### Step 2: Create .gitignore (Already Done ✅)
Your `.gitignore` is already configured to exclude:
- node_modules
- .env files (your API key)
- dist folder
- PDF files

### Step 3: Create GitHub Repository

1. Go to https://github.com
2. Click **"New"** or **"+"** → **"New repository"**
3. Name it: `ai-diet-planner`
4. Description: `AI-powered diet planner with PDF generation`
5. **DO NOT** initialize with README (we already have files)
6. Click **"Create repository"**

### Step 4: Add All Files
```bash
git add .
```

### Step 5: Commit
```bash
git commit -m "Initial commit: AI Diet Planner with backend"
```

### Step 6: Add Remote (Replace YOUR_USERNAME)
```bash
git remote add origin https://github.com/YOUR_USERNAME/ai-diet-planner.git
```

### Step 7: Push to GitHub
```bash
git branch -M main
git push -u origin main
```

### ⚠️ IMPORTANT: Remove API Key Before Pushing!

Your Groq API key is currently **hardcoded** in `App.jsx`. This is a security risk!

**Before pushing, do this:**

1. Move API key to `.env` file
2. Update code to read from environment variable
3. Add `.env` to `.gitignore` (already done ✅)
4. Never commit `.env` file

---

## Part 2: Fix Deployment (Black Screen Issue)

The black screen means the React app isn't loading. Here are the fixes:

### Issue 1: Base Path for Vite

Update `vite.config.js`:

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/', // Change this to '/repo-name/' if deploying to GitHub Pages subdirectory
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
  server: {
    port: 5173,
    host: true,
  }
})
```

### Issue 2: API URLs Need to be Dynamic

Update `App.jsx` to use environment variables:

```javascript
// At the top of App.jsx
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Then in fetch calls:
fetch(`${API_URL}/api/generate-pdf`, { ... })
fetch(`${API_URL}/api/save-plan`, { ... })
fetch(`${API_URL}/api/health`, { ... })
```

### Issue 3: Build the App Properly

```bash
npm run build
```

This creates a `dist` folder with optimized production files.

---

## 🌐 Deployment Options

### Option 1: Vercel (Recommended - Full Stack)

**Deploy Both Frontend & Backend:**

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Create `vercel.json`:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    },
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/server.js"
    },
    {
      "src": "/(.*)",
      "dest": "/$1"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

3. Add build script to `package.json`:
```json
{
  "scripts": {
    "vercel-build": "npm run build"
  }
}
```

4. Deploy:
```bash
vercel
```

---

### Option 2: Netlify (Frontend) + Railway (Backend)

**Frontend on Netlify:**

1. Push to GitHub first
2. Go to https://netlify.com
3. Click "New site from Git"
4. Connect your GitHub repo
5. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
6. Add environment variable:
   - `VITE_API_URL` = `https://your-railway-backend.railway.app`

**Backend on Railway:**

1. Go to https://railway.app
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repo
4. Railway auto-detects `server.js`
5. Add environment variables if needed
6. Get your backend URL

---

### Option 3: GitHub Pages (Frontend Only)

⚠️ **Note**: GitHub Pages only hosts static files. Backend won't work!

1. Install gh-pages:
```bash
npm install --save-dev gh-pages
```

2. Update `package.json`:
```json
{
  "homepage": "https://YOUR_USERNAME.github.io/ai-diet-planner",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

3. Update `vite.config.js`:
```javascript
export default defineConfig({
  base: '/ai-diet-planner/', // Your repo name
  plugins: [react()],
})
```

4. Deploy:
```bash
npm run deploy
```

5. Enable GitHub Pages:
   - Go to repo → Settings → Pages
   - Source: `gh-pages` branch
   - Save

⚠️ **PDF download won't work** on GitHub Pages (no backend support)

---

## 🔧 Fix Your Current Black Screen

The black screen is likely because:

### Fix 1: Check Console for Errors

1. Open browser DevTools (F12)
2. Go to Console tab
3. Look for errors (red text)
4. Share the error messages

### Fix 2: Ensure Build is Correct

```bash
# Clean build
rm -rf dist node_modules

# Reinstall
npm install

# Build
npm run build

# Test locally
npm run preview
```

### Fix 3: Check index.html Path

Make sure `index.html` has:
```html
<script type="module" src="/src/main.jsx"></script>
```

NOT:
```html
<script type="module" src="./src/main.jsx"></script>
```

### Fix 4: Check Tailwind CDN

Make sure `index.html` has the Tailwind CDN:
```html
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
```

---

## 📝 Complete Deployment Checklist

Before deploying:

- [ ] Remove hardcoded API key from code
- [ ] Add `.env` to `.gitignore`
- [ ] Test build locally (`npm run build` then `npm run preview`)
- [ ] Update API URLs to use environment variables
- [ ] Commit and push to GitHub
- [ ] Choose deployment platform
- [ ] Set environment variables on platform
- [ ] Deploy and test

---

## 🆘 Common Deployment Errors

### Error: "Failed to load module"
**Fix**: Check `vite.config.js` base path

### Error: "Cannot GET /"
**Fix**: Ensure `index.html` is in root directory

### Error: "API calls failing"
**Fix**: Update API_URL environment variable

### Error: "White/Black screen"
**Fix**: 
1. Check browser console
2. Verify build folder has files
3. Check base path in vite.config.js

---

## 🔒 Security Checklist

Before pushing to GitHub:

- [ ] API key moved to `.env` file
- [ ] `.env` is in `.gitignore`
- [ ] No passwords in code
- [ ] No sensitive data in commits
- [ ] Environment variables set on deployment platform

---

## 📞 Need Help?

Share:
1. Console error messages (F12 → Console)
2. Network errors (F12 → Network tab)
3. Deployment platform you're using
4. URL of deployed site

