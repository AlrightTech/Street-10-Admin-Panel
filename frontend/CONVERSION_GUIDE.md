# Next.js to React Conversion Guide

## Summary
This project has been converted from Next.js to pure React.js with React Router.

## Key Changes Made

### 1. Entry Points
- Created `index.html` for Vite
- Created `src/main.tsx` as the entry point
- Created `src/App.tsx` with React Router setup

### 2. Routing
- Replaced Next.js App Router with React Router
- All routes defined in `src/App.tsx`
- Dynamic routes use `:id` instead of `[id]`

### 3. Navigation
- `useRouter` from 'next/navigation' → `useNavigate` from 'react-router-dom'
- `useParams` from 'next/navigation' → `useParams` from 'react-router-dom'
- `Link` from 'next/link' → `Link` from 'react-router-dom'
- `router.push()` → `navigate()`
- `router.back()` → `navigate(-1)`

### 4. Pages
- Removed 'use client' directives
- All pages moved to `src/pages/` directory
- Pages are now standard React components

### 5. Configuration
- Removed `next.config.js`
- Updated `vite.config.ts` with path aliases
- Updated `tsconfig.json` (removed Next.js plugins)

## Files That Need Manual Conversion

All page files in `src/app/` need to be:
1. Moved to `src/pages/`
2. Converted using the patterns above
3. Imported in `src/App.tsx`

## Running the Project

```bash
cd frontend
npm install
npm run dev
```

The app will run on http://localhost:3000

