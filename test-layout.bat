@echo off
echo 🔧 Testing Street 10 Dashboard Layout Fix...

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
echo ✅ Layout Structure:
echo    📐 Sidebar: Fixed width 288px (w-72)
echo    📐 Main Content: flex-1 (takes remaining space)
echo    📐 Layout: Flexbox with proper separation
echo    📐 Mobile: Collapsible sidebar with overlay
echo    📐 Desktop: Side-by-side layout, no overlap
echo.
echo 🚀 Starting development server...
echo 🌐 Dashboard: http://localhost:3000
echo.
echo 🎯 Expected Result:
echo    ✅ Sidebar on left (288px wide)
echo    ✅ Main content on right (remaining space)
echo    ✅ No overlap or content behind sidebar
echo    ✅ Responsive design on all screen sizes
echo.
npm run dev
