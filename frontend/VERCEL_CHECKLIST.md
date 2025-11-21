# ✅ Vercel Deployment Checklist

## Critical Settings in Vercel Dashboard

Go to: **Vercel Dashboard → Your Project → Settings → General**

### ✅ Required Settings:

1. **Root Directory**: 
   - Must be: `frontend`
   - NOT: `/frontend` or `./frontend` or empty
   - Location: Settings → General → Root Directory

2. **Framework Preset**:
   - Should be: `Vite` or `Other`
   - NOT: `Next.js` (this causes routing issues!)
   - Location: Settings → General → Framework Preset

3. **Build Command**:
   - Can be: Empty (auto-detected) OR `npm run build`
   - Location: Settings → General → Build & Development Settings

4. **Output Directory**:
   - Can be: Empty (auto-detected) OR `dist`
   - Location: Settings → General → Build & Development Settings

5. **Install Command**:
   - Can be: Empty (auto-detected) OR `npm install`
   - Location: Settings → General → Build & Development Settings

## File Structure Check

Your project should have:
```
Street-10-Admin-Panel/
├── frontend/
│   ├── vercel.json          ✅ (MUST exist here)
│   ├── package.json         ✅
│   ├── vite.config.ts       ✅
│   ├── dist/                ✅ (created after build)
│   └── src/                 ✅
```

## vercel.json Content

The `frontend/vercel.json` should contain:
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

## Common Issues & Fixes

### Issue 1: Still Getting 404 on Routes
**Fix**: 
- Verify `vercel.json` exists in `frontend/` folder
- Verify Root Directory is set to `frontend` in dashboard
- Verify Framework Preset is NOT `Next.js`
- Redeploy after making changes

### Issue 2: Build Fails
**Fix**:
- Check Root Directory is `frontend`
- Check `package.json` exists in `frontend/`
- Check build logs for specific errors
- Try clearing build cache in Vercel settings

### Issue 3: Assets Don't Load (CSS/JS 404)
**Fix**:
- This usually means routing is working but paths are wrong
- Check that all asset paths in `index.html` start with `/`
- Verify `dist/` folder structure is correct

### Issue 4: Blank White Page
**Fix**:
- Check browser console for JavaScript errors
- Verify React app is mounting correctly
- Check if there are any API calls failing
- Verify all dependencies are installed

## Quick Test

After deployment, test these URLs:
1. `https://your-site.vercel.app/` → Should load homepage
2. `https://your-site.vercel.app/dashboard` → Should load dashboard (NOT 404)
3. `https://your-site.vercel.app/products` → Should load products page (NOT 404)
4. Refresh any page → Should still work (NOT 404)

## Still Having Issues?

Share:
1. What error message you see
2. What happens when you visit the site
3. Screenshot of Vercel Settings → General page
4. Any errors from Vercel build logs

