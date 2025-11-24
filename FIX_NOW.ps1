# PowerShell Fix Script - Changes Not Showing

Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "   URGENT FIX: Changes Not Showing in Browser" -ForegroundColor Yellow
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Kill Node Processes
Write-Host "[STEP 1] Stopping all Node processes..." -ForegroundColor Yellow
Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2
Write-Host "✅ All Node processes stopped" -ForegroundColor Green
Write-Host ""

# Step 2: Navigate to frontend
Set-Location -Path "frontend"
if (-not (Test-Path "src\app\products\add\page.tsx")) {
    Write-Host "❌ ERROR: File not found!" -ForegroundColor Red
    pause
    exit
}

# Step 3: Clear Vite Cache
Write-Host "[STEP 2] Clearing Vite cache..." -ForegroundColor Yellow
if (Test-Path ".vite") {
    Remove-Item -Recurse -Force ".vite"
    Write-Host "✅ Vite cache cleared" -ForegroundColor Green
} else {
    Write-Host "ℹ️  No Vite cache found" -ForegroundColor Gray
}
Write-Host ""

# Step 4: Clear node_modules cache
Write-Host "[STEP 3] Clearing node_modules cache..." -ForegroundColor Yellow
if (Test-Path "node_modules\.vite") {
    Remove-Item -Recurse -Force "node_modules\.vite"
    Write-Host "✅ Node modules cache cleared" -ForegroundColor Green
} else {
    Write-Host "ℹ️  No node_modules cache found" -ForegroundColor Gray
}
Write-Host ""

# Step 5: Verify file
Write-Host "[STEP 4] Verifying file exists..." -ForegroundColor Yellow
if (Test-Path "src\app\products\add\page.tsx") {
    Write-Host "✅ File exists: src\app\products\add\page.tsx" -ForegroundColor Green
    $fileInfo = Get-Item "src\app\products\add\page.tsx"
    Write-Host "   Last modified: $($fileInfo.LastWriteTime)" -ForegroundColor Gray
} else {
    Write-Host "❌ ERROR: File not found!" -ForegroundColor Red
    pause
    exit
}
Write-Host ""

Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "   STARTING DEV SERVER" -ForegroundColor Yellow
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📝 IMPORTANT INSTRUCTIONS:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Wait for server to start (you'll see 'Local: http://localhost:5173')" -ForegroundColor White
Write-Host "2. Open browser to: http://localhost:5173/products/add" -ForegroundColor White
Write-Host "3. Press Ctrl+Shift+R to HARD REFRESH (clears cache)" -ForegroundColor White
Write-Host "4. Or use Incognito window (Ctrl+Shift+N)" -ForegroundColor White
Write-Host ""
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "   Server starting in 3 seconds..." -ForegroundColor Yellow
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host ""
Start-Sleep -Seconds 3

# Start dev server
npm run dev

