# Frontend Structure

## Project Organization

### `/src/app/` - Next.js App Router Pages
```
app/
├── layout.tsx              # Root layout with LanguageProvider
├── page.tsx                # Home page (redirects to /dashboard)
├── globals.css             # Global styles
├── dashboard/
│   └── page.tsx            # Dashboard page (/dashboard)
└── products/
    └── page.tsx            # All Products page (/products)
```

### `/src/components/` - Reusable Components
```
components/
├── layout/
│   ├── Header.tsx          # Top header with search, language, notifications
│   └── Sidebar.tsx          # Navigation sidebar with submenus
├── dashboard/
│   ├── DashboardContent.tsx # Main dashboard content
│   └── SalesChart.js        # Sales chart component
├── providers/
│   └── LanguageProviderWrapper.js # Language context wrapper
└── ui/                      # Future UI components
```

### `/src/contexts/` - React Contexts
```
contexts/
└── LanguageContext.js       # Language/i18n context (English/Arabic)
```

### `/src/lib/` - Utilities & Helpers
```
lib/
└── slices/                  # Future Redux slices or utilities
```

## Routes

### Active Routes:
- `/` - Redirects to `/dashboard`
- `/dashboard` - Main dashboard page
- `/products` - Product management page

### Navigation Menu (Sidebar):
- **Dashboard** → `/dashboard`
- **Product Management** > All Products → `/products`
- **Orders** (with 24 badge)
- **Transactions & Finance** (with 34 badge)
- **Analytics & Reports**
- **Chat**
- **Store Builder**
- **Settings**

## Key Features

### 1. Dashboard (`/dashboard`)
- Metric cards with gradient backgrounds
- Orders status breakdown (donut chart)
- Best-selling products
- Product insights
- Customer insights
- Notifications
- Recent orders table
- Sales performance chart
- Top selling products
- New customers
- Recent reviews with auto-rotating carousel

### 2. Products Page (`/products`)
- Product listing table
- Status tabs (All, Active, Inactive)
- Filter dropdowns
- Search functionality
- Responsive design:
  - Desktop: Full table view
  - Mobile: Card-based layout
- Pagination

### 3. Layout Components
- **Sidebar**: Navigation with collapsible submenus
- **Header**: Search, language selector, notifications, user profile
- Responsive layout for mobile/tablet/desktop

### 4. Theme
- Colors:
  - Primary: `#4C50A2` (blue-purple)
  - Accent: `#EE8E32` (orange)
  - Background: `#f9fafb` (light gray)
  - Text: `#666666` (medium gray)
- Font: Urbanist (all weights)

## Responsive Breakpoints

- Mobile: < 768px
- Tablet: 768px - 1023px
- Desktop: ≥ 1024px

## Components Structure

All components use:
- TypeScript (.tsx files)
- Tailwind CSS for styling
- Lucide React icons
- Client-side rendering with 'use client' directive

