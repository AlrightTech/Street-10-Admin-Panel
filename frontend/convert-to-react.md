# Conversion Guide: Next.js to React

This document tracks the conversion from Next.js to pure React with Vite.

## Completed:
1. ✅ Created vite.config.ts
2. ✅ Created main.tsx entry point
3. ✅ Created App.tsx with React Router setup
4. ✅ Updated Sidebar.tsx to use react-router-dom
5. ✅ Updated Header.tsx to use react-router-dom

## Remaining Tasks:
- Convert all page.tsx files in src/app/ to src/pages/
- Replace all `useRouter` from `next/navigation` with `useNavigate` from `react-router-dom`
- Replace all `useParams` from `next/navigation` with `useParams` from `react-router-dom`
- Replace all `Link` from `next/link` with `Link` from `react-router-dom`
- Replace all `href` props with `to` props in Link components
- Replace all `router.push()` with `navigate()`
- Remove 'use client' directives (not needed in React)
- Remove Next.js layout.tsx and convert to App.tsx structure
- Update all imports

## File Mapping:
- `src/app/page.tsx` → `src/pages/SelectRolePage.tsx` (redirects to /select-role)
- `src/app/select-role/page.tsx` → `src/pages/SelectRolePage.tsx`
- `src/app/dashboard/page.tsx` → `src/pages/DashboardPage.tsx`
- `src/app/products/page.tsx` → `src/pages/ProductsPage.tsx`
- `src/app/products/[id]/page.tsx` → `src/pages/ViewProductPage.tsx`
- `src/app/products/[id]/edit/page.tsx` → `src/pages/EditProductPage.tsx`
- `src/app/products/add/page.tsx` → `src/pages/AddProductPage.tsx`
- ... (and all other pages)

