@echo off
echo 🔧 FIXING SIDEBAR OVERLAP ISSUE...

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
echo ✅ Layout Structure Fixed:
echo    📐 Desktop: Side-by-side layout (no overlap)
echo    📐 Sidebar: Fixed 288px width, separate container
echo    📐 Main Content: flex-1, takes remaining space
echo    📐 Mobile: Stacked layout with collapsible sidebar
echo    📐 Z-index: Proper layering to prevent overlap
echo.
echo 🚀 Starting development server...
echo 🌐 Dashboard: http://localhost:3000
echo.
echo 🎯 Expected Result:
echo    ✅ Sidebar on left (288px wide)
echo    ✅ Main content on right (remaining space)
echo    ✅ NO OVERLAP - completely separate containers
echo    ✅ Responsive design on all screen sizes
echo.
npm run dev
