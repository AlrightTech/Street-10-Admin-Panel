@echo off
echo ========================================
echo    RESTARTING DEV SERVER - FIXING
echo    CHANGES NOT SHOWING ISSUE
echo ========================================
echo.

echo Step 1: Stopping any running processes on port 5173...
netstat -ano | findstr :5173 >nul
if %errorlevel% == 0 (
    echo Port 5173 is in use. Killing process...
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5173') do (
        taskkill /F /PID %%a >nul 2>&1
    )
    timeout /t 2 >nul
)

echo.
echo Step 2: Clearing Vite cache...
cd frontend
if exist .vite (
    rmdir /s /q .vite
    echo Vite cache cleared!
)

echo.
echo Step 3: Clearing node_modules/.vite cache...
if exist node_modules\.vite (
    rmdir /s /q node_modules\.vite
    echo Node modules cache cleared!
)

echo.
echo Step 4: Restarting dev server...
echo.
echo ========================================
echo    SERVER STARTING...
echo    Open: http://localhost:5173
echo ========================================
echo.
echo IMPORTANT: After server starts:
echo 1. Press Ctrl+Shift+R (Hard Refresh) in browser
echo 2. Or Ctrl+F5 to clear cache
echo 3. Or open in Incognito/Private window
echo.

npm run dev

