@echo off
echo ========================================
echo   Street 10 Backend Server
echo ========================================
echo.

REM Check if node_modules exists
if not exist "node_modules\" (
    echo Installing dependencies...
    call npm install
    echo.
)

REM Check if .env exists
if not exist ".env" (
    echo Creating .env file...
    (
        echo PORT=5000
        echo NODE_ENV=development
        echo MONGODB_URI=mongodb://localhost:27017/street10-dashboard
        echo FRONTEND_URL=http://localhost:3000
        echo JWT_SECRET=street10-secret-key-change-in-production
    ) > .env
    echo .env file created!
    echo.
)

echo Starting backend server...
echo.
echo Server will run on: http://localhost:5000
echo Press Ctrl+C to stop the server
echo.
echo ========================================
echo.

npm run dev

