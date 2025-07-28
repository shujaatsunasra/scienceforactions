# 🚀 GitHub Pages Deployment Setup

## Quick Setup Instructions

### 1. Enable GitHub Pages
1. Go to your repository: `https://github.com/shujaatsunasra/scienceforactions`
2. Click **Settings** tab
3. Scroll down to **Pages** section (left sidebar)
4. Under **Source**, select **GitHub Actions**
5. Save the settings

### 2. Verify Workflow 
The workflow file is already configured at `.github/workflows/deploy.yml`

### 3. Trigger Deployment
The deployment will happen automatically when you push this commit, or you can:
1. Go to **Actions** tab in your repository
2. Click **Deploy Next.js to GitHub Pages**
3. Click **Run workflow** button

### 4. Access Your Site
After deployment (2-3 minutes), your site will be available at:
- **Primary URL**: `https://shujaatsunasra.github.io/scienceforactions/`
- **Custom Domain**: `https://scienceforactions.me` (if DNS is configured)

### 5. Monitor Deployment
- Check **Actions** tab for build status
- Look for green checkmark ✅ next to latest commit
- Any errors will show up in the workflow logs

## Troubleshooting

If the site doesn't update:
1. Check **Actions** tab for failed builds
2. Verify **Pages** settings are set to **GitHub Actions**
3. Clear browser cache and try again
4. Wait 5-10 minutes for GitHub's CDN to update

## Current Status
- ✅ Repository: Ready for deployment
- ✅ Build: Successfully tested locally
- ✅ Workflow: Updated to latest GitHub Pages actions
- 🔄 Pages Settings: **Needs to be enabled in repository settings**

---
*Last updated: July 28, 2025*
