# 🧪 Test Upload Functionality - Step by Step

## ✅ What Should Work Now:

1. **Click anywhere on upload area** → Opens file browser
2. **Click "Browse Files" button** → Opens file browser  
3. **Drag and drop files** → Files upload and show preview
4. **Click uploaded image** → Opens full-screen preview
5. **Click X on files** → Removes file

---

## 🔍 How to Test:

### Step 1: Restart Dev Server
```bash
# Stop current server (Ctrl+C)
cd frontend
npm run dev
```

### Step 2: Hard Refresh Browser
- **Windows/Linux:** `Ctrl + Shift + R`
- **Mac:** `Cmd + Shift + R`
- Or open in **Incognito/Private** window

### Step 3: Open Console (F12)
- Press **F12** to open Developer Tools
- Go to **Console** tab
- You should see logs when clicking

### Step 4: Test Media Upload
1. Go to: `http://localhost:5173/products/add`
2. **Click anywhere on the "Upload Media" box**
   - Should see in console: "Media click handler triggered"
   - File browser should open immediately
3. **Or click the "Browse Files" button**
   - Should see: "Browse Files button clicked"
   - File browser should open

### Step 5: Test Document Upload
1. Scroll to "Upload Doc" section
2. **Click anywhere on the "Upload Doc" box**
   - Should see: "Document click handler triggered"
   - File browser should open
3. **Or click the "Browse Files" button**
   - Should see: "Browse Files button clicked for documents"
   - File browser should open

---

## 🐛 Troubleshooting

### File Browser Doesn't Open?

**Check Console (F12):**
- If you see errors, share them
- If you see logs like "Media click handler triggered" but no file browser, the ref might be null

**Try This:**
1. **Refresh page** (hard refresh: Ctrl+Shift+R)
2. **Clear browser cache** completely
3. **Check if file input exists** - Open Console and type:
   ```javascript
   document.querySelector('input[type="file"]')
   ```
   Should return an element (not null)

### Still Not Working?

1. **Verify file is saved:**
   - Check file timestamp
   - Make sure file is actually saved

2. **Check if server is running:**
   - Terminal should show: `VITE v5.x.x ready...`
   - URL should be: `http://localhost:5173`

3. **Try different browser:**
   - Chrome, Firefox, Edge
   - Or Incognito mode

4. **Check for JavaScript errors:**
   - Console tab (F12)
   - Look for red errors
   - Share any errors you see

---

## 📝 Expected Behavior

### When You Click on Upload Area:
1. **File browser opens immediately**
2. **Console shows:** "Media click handler triggered" or "Document click handler triggered"
3. **Console shows:** "Opening file browser for media..." or "Opening file browser for documents..."

### When You Select Files:
1. **Files appear below upload area**
2. **Images show preview thumbnails**
3. **Documents show file icon with name**
4. **File count and size displayed**

### When You Click Image Preview:
1. **Full-screen modal opens**
2. **Image displays large**
3. **Close button in top-right**

---

## 🎯 Quick Fix Commands

```bash
# 1. Navigate to frontend
cd frontend

# 2. Clear Vite cache
rm -rf .vite node_modules/.vite

# 3. Restart server
npm run dev

# 4. In browser: Hard refresh
Ctrl + Shift + R
```

---

## ✅ Success Indicators

You'll know it's working when:
- ✅ Clicking upload area opens file browser instantly
- ✅ Console shows handler logs
- ✅ Files upload and show previews
- ✅ No errors in console
- ✅ Drag and drop works smoothly

---

**If it's still not working, share:**
1. Console output (screenshot or text)
2. Any error messages
3. What happens when you click (nothing? error?)
4. Browser and version

