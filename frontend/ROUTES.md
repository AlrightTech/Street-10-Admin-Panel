# Application Routes

## Available Routes

### 1. Root Route: `/`
- **File**: `src/app/page.tsx`
- **Action**: Redirects to `/dashboard`
- **Description**: Landing page that automatically redirects to dashboard

### 2. Dashboard: `/dashboard`
- **File**: `src/app/dashboard/page.tsx`
- **Description**: Main dashboard with metrics, charts, and analytics
- **Features**:
  - Metric cards (Uncompleted Orders, Total Orders, Revenue, Pending Payouts)
  - Orders status breakdown with donut chart
  - Best-selling products
  - Recent orders table
  - Sales performance chart
  - Top selling products
  - New customers list
  - Recent reviews with auto-rotating carousel

### 3. Products: `/products`
- **File**: `src/app/products/page.tsx`
- **Description**: Product management page
- **Features**:
  - Product listing table
  - Filter by category, status, stock
  - Search functionality
  - Status tabs (All, Active, Inactive)
  - Add product button
  - Edit/Delete actions
  - Pagination
  - Fully responsive (table view on desktop, cards on mobile)

## Navigation Structure

### Sidebar Navigation:
```
Dashboard (/) -> /dashboard
Product Management (has submenu)
  └─ All Products -> /products
Orders (has submenu)
Transactions & Finance (has submenu)
Analytics & Reports (has submenu)
Chat (has submenu)
Store Builder (has submenu)
Settings (has submenu)
```

## Component Organization

All routes share:
- **Sidebar**: `src/components/layout/Sidebar.tsx`
- **Header**: `src/components/layout/Header.tsx`
- **Language Provider**: Wrapped in root layout

## Getting Started

1. Visit `http://localhost:3000`
2. Automatically redirected to `/dashboard`
3. Click "Product Management" in sidebar to expand menu
4. Click "All Products" to navigate to `/products`

