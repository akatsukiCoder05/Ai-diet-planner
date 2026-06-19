# 🚀 How to Push to GitHub

## ⚠️ IMPORTANT: Before You Push!

### Step 0: Protect Your API Key!

Your Groq API key is currently exposed in `src/App.jsx`. This is a **security risk**!

**You MUST move it to an environment variable:**

1. Open `src/App.jsx`
2. Find this line:
   ```javascript
   apiKey: "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",
   ```
3. Replace it with:
   ```javascript
   apiKey: import.meta.env.VITE_GROQ_API_KEY,
   ```
4. Create a `.env` file in the root folder:
   ```env
   VITE_GROQ_API_KEY=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
   ```

**Note:** `.env` is already in `.gitignore` so it won't be pushed to GitHub.

---

## 📋 Step-by-Step Guide

### Step 1: Check Git Installation

Open terminal and check if Git is installed:

```bash
git --version
```

If not installed, download from: https://git-scm.com/downloads

---

### Step 2: Initialize Git Repository

In your project folder:

```bash
cd d:\fullstack\Ditepalnner
git init
```

**Expected Output:**
```
Initialized empty Git repository in d:/fullstack/Ditepalnner/.git/
```

---

### Step 3: Configure Git (First Time Only)

Set your name and email:

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

---

### Step 4: Add All Files to Git

```bash
git add .
```

This stages all your files for commit.

---

### Step 5: Create Your First Commit

```bash
git commit -m "Initial commit: AI Diet Planner with organic wellness UI and PDF generation"
```

**Expected Output:**
```
[main (root-commit) abc1234] Initial commit: AI Diet Planner...
 XX files changed, XXX insertions(+)
 create mode 100644 src/App.jsx
 create mode 100644 server.js
 ...
```

---

### Step 6: Create GitHub Repository

1. Go to https://github.com
2. Click the **"+"** icon (top right)
3. Click **"New repository"**
4. Fill in details:
   - **Repository name:** `ai-diet-planner` (or your choice)
   - **Description:** AI-powered diet planner with organic wellness UI and PDF generation
   - **Public** or **Private** (your choice)
   - **DO NOT** check "Initialize with README" (you already have files)
5. Click **"Create repository"**

---

### Step 7: Connect Local to GitHub

Copy the commands GitHub shows you, or use these (replace `YOUR-USERNAME`):

```bash
git remote add origin https://github.com/YOUR-USERNAME/ai-diet-planner.git
git branch -M main
git push -u origin main
```

**Example:**
```bash
git remote add origin https://github.com/johndoe/ai-diet-planner.git
git branch -M main
git push -u origin main
```

---

### Step 8: Enter GitHub Credentials

When prompted:
- **Username:** Your GitHub username
- **Password:** Your GitHub Personal Access Token (not your password!)

**How to get a Personal Access Token:**
1. Go to https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Select scopes: `repo` (full control of private repositories)
4. Click "Generate token"
5. Copy the token (you won't see it again!)
6. Use this as your password when pushing

---

### Step 9: Verify Push Success

Check GitHub:
1. Go to https://github.com/YOUR-USERNAME/ai-diet-planner
2. You should see all your files!

---

## 🔄 Making Updates Later

### When you make changes:

```bash
# 1. Check what changed
git status

# 2. Add changes
git add .

# 3. Commit with a message
git commit -m "Description of what you changed"

# 4. Push to GitHub
git push
```

**Example workflow:**
```bash
git add .
git commit -m "Added server status indicator and improved error handling"
git push
```

---

## 📝 Useful Git Commands

| Command | Description |
|---------|-------------|
| `git status` | See what files changed |
| `git log` | See commit history |
| `git diff` | See detailed changes |
| `git add .` | Stage all changes |
| `git add <file>` | Stage specific file |
| `git commit -m "message"` | Commit with message |
| `git push` | Push to GitHub |
| `git pull` | Pull latest from GitHub |
| `git branch` | List branches |
| `git checkout -b <name>` | Create new branch |

---

## 🌿 Git Workflow (Best Practice)

### For new features:

```bash
# 1. Create a new branch
git checkout -b feature/new-feature-name

# 2. Make your changes
# ... edit files ...

# 3. Commit changes
git add .
git commit -m "Add new feature description"

# 4. Push branch to GitHub
git push -u origin feature/new-feature-name

# 5. Create Pull Request on GitHub
# Go to your repo and click "Compare & pull request"

# 6. After merging, switch back to main
git checkout main
git pull
```

---

## ⚠️ Common Issues & Solutions

### Issue 1: "Permission denied (publickey)"

**Solution:** Use HTTPS instead of SSH:
```bash
git remote set-url origin https://github.com/YOUR-USERNAME/ai-diet-planner.git
```

---

### Issue 2: "Failed to push some refs"

**Solution:** Pull first, then push:
```bash
git pull origin main --rebase
git push
```

---

### Issue 3: "API Key in Git History"

If you accidentally committed your API key:

**Solution:**
1. Remove it from the code
2. Use BFG Repo Cleaner or git filter-branch
3. Force push (risky!)
4. **Better:** Revoke old key, create new one

---

### Issue 4: Large Files Error

**Error:** "file is XXX MB; this exceeds GitHub's file size limit of 100 MB"

**Solution:** Add to `.gitignore`:
```bash
echo "large-file.pdf" >> .gitignore
git rm --cached large-file.pdf
git commit -m "Remove large file"
```

---

## 🔐 Security Checklist

Before pushing, verify:

- [ ] API key is in `.env` file (not in code)
- [ ] `.env` is in `.gitignore`
- [ ] No passwords or secrets in code
- [ ] `.env.example` has placeholder values only
- [ ] Reviewed all files with `git status`
- [ ] Committed with meaningful message

---

## 📦 What Gets Pushed

**✅ Included:**
- `src/` - All source code
- `public/` - Public assets
- `server.js` - Backend server
- `package.json` - Dependencies list
- `README.md` - Project documentation
- `*.md` - All documentation files
- `.gitignore` - Git ignore rules
- Configuration files

**❌ NOT Included (in .gitignore):**
- `node_modules/` - Dependencies (installed with npm)
- `.env` - Environment variables
- `dist/` - Build output
- `*.log` - Log files
- Generated PDFs
- Editor config files

---

## 🎯 Quick Commands Reference

```bash
# First time setup
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR-USERNAME/REPO-NAME.git
git push -u origin main

# Regular updates
git add .
git commit -m "Your message"
git push

# Check status
git status
git log --oneline

# Undo changes (before commit)
git checkout -- <file>

# Undo last commit (keep changes)
git reset --soft HEAD~1
```

---

## 📚 Additional Resources

- **Git Documentation:** https://git-scm.com/doc
- **GitHub Guides:** https://guides.github.com
- **Git Cheat Sheet:** https://education.github.com/git-cheat-sheet-education.pdf
- **Try Git:** https://try.github.io

---

## 🎉 All Done!

Your AI Diet Planner is now on GitHub! 

**Next Steps:**
1. Add a nice README.md with screenshots
2. Add topics/tags to your repo
3. Star your own repo (why not? 😄)
4. Share the link!

**Repository URL Format:**
```
https://github.com/YOUR-USERNAME/ai-diet-planner
```

---

**Need help?** Check these files:
- `README.md` - Project overview
- `QUICKSTART.md` - Quick start guide
- `TROUBLESHOOTING.md` - Common issues

---

Good luck! 🚀
