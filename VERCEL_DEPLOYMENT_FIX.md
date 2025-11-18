# Vercel Deployment Fix - 404 Error

## Problem
Getting 404 NOT_FOUND error on Vercel deployment.

## Solution

### Option 1: Set Root Directory in Vercel Dashboard (RECOMMENDED)
1. Go to your Vercel project settings
2. Navigate to **Settings** → **General**
3. Under **Root Directory**, set it to: `frontend`
4. Click **Save**
5. Redeploy your project

### Option 2: Deploy from Frontend Directory
1. In Vercel dashboard, go to **Settings** → **General**
2. Change the **Root Directory** to `frontend`
3. Or connect the repository and point it directly to the `frontend` folder

### Option 3: Use Monorepo Configuration
If you want to keep the current structure, ensure `vercel.json` is in the root with:
```json
{
  "buildCommand": "cd frontend && npm install && npm run build",
  "outputDirectory": "frontend/.next",
  "installCommand": "cd frontend && npm install",
  "framework": "nextjs",
  "rootDirectory": "frontend"
}
```

## Important Notes
- The Next.js app is located in the `frontend` folder
- Vercel needs to know this is the root directory for the Next.js app
- After changing settings, trigger a new deployment

## Verify Build Locally
Before deploying, test the build:
```bash
cd frontend
npm install
npm run build
```

If build succeeds locally, the issue is just the Vercel configuration.

