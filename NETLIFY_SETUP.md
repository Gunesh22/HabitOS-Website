# 🚀 Netlify Auto-Deploy Setup

## ✅ What's Already Done

Your website repository is now on GitHub:
- **Repo:** https://github.com/Gunesh22/HabitOS-Website
- **Auto-push:** Every `git push` updates GitHub

## 🔗 Connect to Netlify (One-Time Setup)

### Step 1: Login to Netlify
1. Go to https://app.netlify.com
2. Sign in with GitHub

### Step 2: Import Repository
1. Click **Add new site** → **Import an existing project**
2. Choose **Deploy with GitHub**
3. Authorize Netlify (if first time)
4. Select **HabitOS-Website** from the list

### Step 3: Configure Build Settings
Leave everything as default:
- **Branch to deploy:** `main`
- **Build command:** (leave empty)
- **Publish directory:** `.` (root directory)
- **Environment variables:** (none needed)

Click **Deploy site**

### Step 4: Get Your URL
Netlify will give you a URL like:
```
https://random-name-123.netlify.app
```

You can customize it:
1. Go to **Site settings** → **Domain management**
2. Click **Options** → **Edit site name**
3. Change to: `habitos` (if available)
4. Your site will be: `https://habitos.netlify.app`

## 🎉 You're Done!

From now on, whenever you:
```bash
cd "d:\HabitOS website"
git add .
git commit -m "Update pricing"
git push
```

Netlify will **automatically** deploy within 1-2 minutes!

## 📝 Workflow Summary

### To Update Website Content
```bash
cd "d:\HabitOS website"
# Edit index.html, style.css, etc.
git add .
git commit -m "Update homepage"
git push
```
→ Netlify auto-deploys ✅

### To Update Prices/Trial Period
```bash
cd "d:\image to text using gemini website\HabitOS"
# Edit backend/config.js
git add backend/config.js
git commit -m "Change price to ₹99"
git push origin HEAD:master
```
→ Render auto-deploys backend ✅
→ Website fetches new config automatically ✅

### To Update Desktop App
```bash
cd "d:\image to text using gemini website\HabitOS"
# Make changes to src/
npm run electron:build:win
# Upload HabitOS-Setup.exe to GitHub Releases
```
→ Users get new version on next download ✅

## 🔍 Monitoring

- **Website:** https://app.netlify.com/sites/YOUR-SITE/deploys
- **Backend:** https://dashboard.render.com
- **Releases:** https://github.com/Gunesh22/HabitOS-Final/releases

## 🎯 No More Manual Uploads!

You'll never need to drag-and-drop to Netlify again. Just `git push` and relax! ☕
