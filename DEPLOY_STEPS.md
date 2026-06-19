# 🚀 Step-by-Step: Push to GitHub & Deploy

## ✅ Part 1: Push to GitHub (5 Minutes)

### Step 1: Open Terminal in Project Folder
```bash
cd d:\fullstack\Ditepalnner
```

### Step 2: Initialize Git
```bash
git init
```

### Step 3: Add All Files
```bash
git add .
```

### Step 4: Commit
```bash
git commit -m "Initial commit: AI Diet Planner with PDF generation"
```

### Step 5: Create GitHub Repository
1. Go to https://github.com/new
2. Repository name: `ai-diet-planner`
3. Description: `AI-powered personalized diet planner with PDF export`
4. **Public** or Private (your choice)
5. **DO NOT** check "Initialize with README"
6. Click **"Create repository"**

### Step 6: Add Remote (Copy from GitHub page)
```bash
git remote add origin https://github.com/YOUR_USERNAME/ai-diet-planner.git
```

### Step 7: Push
```bash
git branch -M main
git push -u origin main
```

✅ **Done!** Your code is now on GitHub!

---

## 🌐 Part 2: Deploy to Vercel (10 Minutes)

### Why Vercel?
- ✅ Hosts both frontend AND backend
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Free tier
- ✅ Easy environment variables

### Step 1: Sign Up for Vercel
1. Go to https://vercel.com
2. Click **"Sign Up"**
3. Choose **"Continue with GitHub"**
4. Authorize Vercel

### Step 2: Import Project
1. Click **"Add New..."** → **"Project"**
2. Find your `ai-diet-planner` repository
3. Click **"Import"**

### Step 3: Configure Project

**Framework Preset:** Vite
**Root Directory:** `./` (leave as is)
**Build Command:** `npm run build`
**Output Directory:** `dist`

### Step 4: Add Environment Variables

Click **"Environment Variables"** and add:

| Name | Value |
|------|-------|
| `VITE_GROQ_API_KEY` | `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` |
| `VITE_API_URL` | Leave empty for now (we'll update after deployment) |

### Step 5: Deploy
1. Click **"Deploy"**
2. Wait 2-3 minutes
3. You'll get a URL like: `https://ai-diet-planner-abc123.vercel.app`

### Step 6: Update API URL

1. Copy your Vercel URL
2. Go to **Settings** → **Environment Variables**
3. Edit `VITE_API_URL`
4. Set value to: `https://ai-diet-planner-abc123.vercel.app`
5. Click **"Save"**
6. Go to **Deployments**
7. Click **"Redeploy"**

✅ **Done!** Your app is live!

---

## 🔧 Fix Black Screen Issue

If you see a black screen after deployment:

### Fix 1: Check Vite Config

Make sure `vite.config.js` has:
```javascript
export default defineConfig({
  plugins: [react()],
  base: '/', // Important!
  build: {
    outDir: 'dist',
  }
})
```

### Fix 2: Check index.html

Make sure it has:
```html
<script type="module" src="/src/main.jsx"></script>
```

NOT `./src/main.jsx`

### Fix 3: Test Build Locally

```bash
npm run build
npm run preview
```

Open http://localhost:4173 - does it work?

- ✅ If yes: Issue is with deployment config
- ❌ If no: Issue is with the code

### Fix 4: Check Browser Console

1. Press F12
2. Go to **Console** tab
3. Look for red errors
4. Share the error message

### Fix 5: Check Vercel Build Logs

1. Go to Vercel dashboard
2. Click your deployment
3. Click **"Building"** or **"Deployment"**
4. Check for errors in build logs

---

## 📋 Quick Deployment Checklist

Before deploying:

- [x] API key moved to `.env` ✅
- [x] `.env` in `.gitignore` ✅
- [x] Code pushed to GitHub ✅
- [x] `vercel.json` created ✅
- [ ] Test build locally: `npm run build`
- [ ] Test preview: `npm run preview`
- [ ] Deploy to Vercel
- [ ] Set environment variables
- [ ] Test deployed site

---

## 🆘 Common Issues & Solutions

### Issue 1: "Module not found" Error

**Solution:**
```bash
npm install
npm run build
```

### Issue 2: "Failed to fetch" API Errors

**Solution:**
Update `VITE_API_URL` in Vercel to your deployed URL

### Issue 3: Blank Page / Black Screen

**Check:**
1. Browser console (F12) for errors
2. Vercel build logs for failures
3. `vite.config.js` base path is `/`
4. Test locally first: `npm run preview`

### Issue 4: PDF Download Not Working

**Reason:**
Backend and frontend must be on same domain for Vercel deployment

**Solution:**
Already configured in `vercel.json` - backend runs on `/api/*` routes

---

## 🎯 Expected Result

After successful deployment:

1. ✅ Site loads at Vercel URL
2. ✅ Beautiful organic wellness UI
3. ✅ Green dot (server online)
4. ✅ Can generate diet plan
5. ✅ Can download PDF
6. ✅ Can save plan

---

## 📞 Still Having Issues?

### Share This Information:

1. **Vercel deployment URL**
2. **Browser console errors** (F12 → Console → screenshot)
3. **Vercel build logs** (from dashboard)
4. **What happens when you click buttons**

### Or Try Alternative:

Deploy to **Netlify + Railway**:
- Netlify for frontend
- Railway for backend
- See GITHUB_DEPLOY.md for instructions

---

## 🎉 Success!

If everything works:

1. Share your deployment URL
2. Show it off to friends
3. Add it to your portfolio
4. Consider adding:
   - User authentication
   - Database storage
   - More meal options
   - Recipe details

**Congratulations on deploying your first full-stack app!** 🚀
