# 🚀 How to Run the Project

## Quick Start

### Step 1: Navigate to Frontend Directory
```bash
cd frontend
```

### Step 2: Install Dependencies (if not already installed)
```bash
npm install
```

### Step 3: Start Development Server
```bash
npm run dev
```

The app will start and automatically open in your browser at:
**http://localhost:3000**

## Available Commands

### Development
```bash
npm run dev
```
- Starts the Vite development server
- Hot module replacement (HMR) enabled
- Auto-reloads on file changes

### Build for Production
```bash
npm run build
```
- Creates optimized production build in `dist/` folder
- TypeScript type checking included

### Preview Production Build
```bash
npm run preview
```
- Preview the production build locally
- Useful for testing before deployment

### Lint Code
```bash
npm run lint
```
- Checks code for errors and warnings

## Troubleshooting

### Port Already in Use
If port 3000 is already in use, Vite will automatically use the next available port (3001, 3002, etc.)

### Clear Cache
If you encounter issues, try:
```bash
# Delete node_modules and reinstall
rm -rf node_modules
npm install

# Or on Windows PowerShell:
Remove-Item -Recurse -Force node_modules
npm install
```

### Check Node Version
Make sure you have Node.js 16+ installed:
```bash
node --version
```

## Project Structure

```
frontend/
├── index.html          # Entry HTML file
├── src/
│   ├── main.tsx       # React entry point
│   ├── App.tsx        # Main app component with routes
│   ├── pages/         # All page components
│   ├── components/    # Reusable components
│   └── contexts/      # React contexts
└── package.json       # Dependencies and scripts
```

## First Time Setup

1. Make sure you're in the `frontend` directory
2. Run `npm install` to install all dependencies
3. Run `npm run dev` to start the development server
4. Open http://localhost:3000 in your browser

That's it! 🎉

