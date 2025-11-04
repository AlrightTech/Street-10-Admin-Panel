@echo off
echo 🚀 Starting Street 10 Vendor Dashboard with FIXED LAYOUT...

echo.
echo 📦 Installing dependencies...
cd frontend
npm install --silent
if %errorlevel% neq 0 (
    echo ❌ Installation failed! Trying with yarn...
    npm install -g yarn --silent
    yarn install --silent
)

echo.
echo ✅ Starting development server...
echo 🌐 Dashboard will be available at: http://localhost:3000
echo.
echo 🎯 Layout Features:
echo    ✅ Sidebar fixed width (288px)
echo    ✅ Main content takes remaining space
echo    ✅ No overlap or content behind sidebar
echo    ✅ Mobile responsive with collapsible sidebar
echo    ✅ Proper flex layout structure
echo.
npm run dev
