#!/bin/bash

echo "========================================"
echo "  Street 10 Backend Server"
echo "========================================"
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
    echo ""
fi

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "Creating .env file..."
    cat > .env << EOF
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/street10-dashboard
FRONTEND_URL=http://localhost:3000
JWT_SECRET=street10-secret-key-change-in-production
EOF
    echo ".env file created!"
    echo ""
fi

echo "Starting backend server..."
echo ""
echo "Server will run on: http://localhost:5000"
echo "Press Ctrl+C to stop the server"
echo ""
echo "========================================"
echo ""

npm run dev

