@echo off
cls
echo ========================================================
echo    URGENT FIX: Changes Not Showing in Browser
echo ========================================================
echo.

echo [STEP 1] Stopping all Node processes...
taskkill /F /IM node.exe >nul 2>&1
taskkill /F /IM "node.exe" >nul 2>&1
timeout /t 2 >nul
echo ✅ All Node processes stopped
echo.

echo [STEP 2] Clearing Vite cache...
cd frontend
if exist .vite (
    rmdir /s /q .vite
    echo ✅ Vite cache cleared
) else (
    echo ℹ️  No Vite cache found
)
echo.

echo [STEP 3] Clearing node_modules cache...
if exist node_modules\.vite (
    rmdir /s /q node_modules\.vite
    echo ✅ Node modules cache cleared
) else (
    echo ℹ️  No node_modules cache found
)
echo.

echo [STEP 4] Verifying file exists...
if exist "src\app\products\add\page.tsx" (
    echo ✅ File exists: src\app\products\add\page.tsx
) else (
    echo ❌ ERROR: File not found!
    pause
    exit
)
echo.

echo [STEP 5] Checking for syntax errors...
call npm run lint 2>&1 | findstr /C:"error" >nul
if %errorlevel% equ 0 (
    echo ⚠️  WARNING: Lint errors found (may not prevent running)
) else (
    echo ✅ No critical syntax errors
)
echo.

echo ========================================================
echo    STARTING DEV SERVER
echo ========================================================
echo.
echo 📝 IMPORTANT INSTRUCTIONS:
echo.
echo 1. Wait for server to start (you'll see "Local: http://localhost:5173")
echo 2. Open browser to: http://localhost:5173/products/add
echo 3. Press Ctrl+Shift+R to HARD REFRESH (clears cache)
echo 4. Or use Incognito window (Ctrl+Shift+N)
echo.
echo ========================================================
echo    Server starting in 3 seconds...
echo ========================================================
timeout /t 3 >nul
echo.

npm run dev

