// This script moves all converted pages from src/app/ to src/pages/ with proper naming
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Mapping of file paths to component names
const pageMappings = {
  'src/app/select-role/page.tsx': 'SelectRolePage.tsx',
  'src/app/dashboard/page.tsx': 'DashboardPage.tsx',
  'src/app/products/page.tsx': 'ProductsPage.tsx',
  'src/app/products/add/page.tsx': 'AddProductPage.tsx',
  'src/app/products/[id]/page.tsx': 'ViewProductPage.tsx',
  'src/app/products/[id]/edit/page.tsx': 'EditProductPage.tsx',
  'src/app/orders/page.tsx': 'OrdersPage.tsx',
  'src/app/orders/[id]/page.tsx': 'OrderDetailsPage.tsx',
  'src/app/orders/[id]/invoice/page.tsx': 'OrderInvoicePage.tsx',
  'src/app/orders/[id]/tracking/page.tsx': 'OrderTrackingPage.tsx',
  'src/app/transactions/history/page.tsx': 'TransactionsHistoryPage.tsx',
  'src/app/transactions/[id]/page.tsx': 'TransactionDetailsPage.tsx',
  'src/app/transactions/earnings/page.tsx': 'EarningsPage.tsx',
  'src/app/transactions/earnings/products/[id]/page.tsx': 'ProductPerformancePage.tsx',
  'src/app/transactions/earnings/withdrawals/page.tsx': 'WithdrawalsPage.tsx',
  'src/app/transactions/earnings/withdrawals/[id]/page.tsx': 'WithdrawalDetailsPage.tsx',
  'src/app/transactions/earnings/withdrawals/new/page.tsx': 'RequestWithdrawalPage.tsx',
  'src/app/analytics/sales-overview/page.tsx': 'SalesOverviewPage.tsx',
  'src/app/analytics/earnings-report/page.tsx': 'EarningsReportPage.tsx',
  'src/app/analytics/orders-report/page.tsx': 'OrdersReportPage.tsx',
  'src/app/analytics/customer-insights/page.tsx': 'CustomerInsightsPage.tsx',
  'src/app/analytics/custom-reports/page.tsx': 'CustomReportsPage.tsx',
  'src/app/analytics/custom-reports/create/page.tsx': 'CreateReportPage.tsx',
  'src/app/chat/page.tsx': 'ChatPage.tsx',
  'src/app/settings/store/page.tsx': 'SettingsStorePage.tsx',
  'src/app/settings/profile/page.tsx': 'SettingsProfilePage.tsx',
  'src/app/settings/profile/add/page.tsx': 'AddSubVendorPage.tsx',
  'src/app/settings/profile/vendors/[id]/page.tsx': 'SubVendorDetailPage.tsx',
  'src/app/settings/profile/vendors/[id]/edit/page.tsx': 'EditSubVendorPage.tsx',
  'src/app/settings/profile/vendors/[id]/reset-password/page.tsx': 'ResetPasswordPage.tsx',
  'src/app/settings/policy/page.tsx': 'SettingsPolicyPage.tsx',
  'src/app/settings/notifications/page.tsx': 'SettingsNotificationsPage.tsx',
  'src/app/sub-admin/users/page.tsx': 'SubAdminUsersPage.tsx',
  'src/app/sub-admin/users/[id]/page.tsx': 'SubAdminUserDetailPage.tsx',
  'src/app/sub-admin/users/add/page.tsx': 'AddSubAdminUserPage.tsx',
  'src/app/sub-admin/analytics/page.tsx': 'SubAdminAnalyticsPage.tsx',
  'src/app/sub-admin/bookings/page.tsx': 'SubAdminBookingsPage.tsx',
  'src/app/sub-admin/finance/page.tsx': 'SubAdminFinancePage.tsx',
  'src/app/sub-admin/hosts-providers/page.tsx': 'SubAdminHostsProvidersPage.tsx',
  'src/app/sub-admin/marketing/page.tsx': 'SubAdminMarketingPage.tsx',
  'src/app/sub-admin/settings/page.tsx': 'SubAdminSettingsPage.tsx',
};

const pagesDir = path.join(__dirname, 'src', 'pages');
if (!fs.existsSync(pagesDir)) {
  fs.mkdirSync(pagesDir, { recursive: true });
}

let moved = 0;
for (const [sourcePath, targetName] of Object.entries(pageMappings)) {
  const fullSourcePath = path.join(__dirname, sourcePath);
  const fullTargetPath = path.join(pagesDir, targetName);
  
  if (fs.existsSync(fullSourcePath)) {
    // Read and update the export name
    let content = fs.readFileSync(fullSourcePath, 'utf8');
    
    // Extract the function name from export default
    const functionMatch = content.match(/export default function (\w+)/);
    if (functionMatch) {
      const oldName = functionMatch[1];
      const newName = targetName.replace('.tsx', '');
      
      // Update function name and export
      content = content.replace(new RegExp(`export default function ${oldName}`, 'g'), `export default function ${newName}`);
      content = content.replace(new RegExp(`function ${oldName}\\(`, 'g'), `function ${newName}(`);
    }
    
    fs.writeFileSync(fullTargetPath, content, 'utf8');
    moved++;
    console.log(`✓ Moved: ${sourcePath} → pages/${targetName}`);
  } else {
    console.log(`✗ Not found: ${sourcePath}`);
  }
}

console.log(`\n✅ Moved ${moved} files to pages directory!`);

