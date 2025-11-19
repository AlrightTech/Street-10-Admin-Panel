import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LanguageProviderWrapper from '@/components/providers/LanguageProviderWrapper'
import { RoleProvider } from '@/contexts/RoleContext'

// Pages
import SelectRolePage from '@/pages/SelectRolePage'
import DashboardPage from '@/pages/DashboardPage'
import ProductsPage from '@/pages/ProductsPage'
import ViewProductPage from '@/pages/ViewProductPage'
import AddProductPage from '@/pages/AddProductPage'
import EditProductPage from '@/pages/EditProductPage'
import OrdersPage from '@/pages/OrdersPage'
import OrderDetailsPage from '@/pages/OrderDetailsPage'
import OrderInvoicePage from '@/pages/OrderInvoicePage'
import OrderTrackingPage from '@/pages/OrderTrackingPage'
import TransactionsHistoryPage from '@/pages/TransactionsHistoryPage'
import TransactionDetailsPage from '@/pages/TransactionDetailsPage'
import EarningsPage from '@/pages/EarningsPage'
import ProductPerformancePage from '@/pages/ProductPerformancePage'
import WithdrawalsPage from '@/pages/WithdrawalsPage'
import WithdrawalDetailsPage from '@/pages/WithdrawalDetailsPage'
import RequestWithdrawalPage from '@/pages/RequestWithdrawalPage'
import SalesOverviewPage from '@/pages/SalesOverviewPage'
import EarningsReportPage from '@/pages/EarningsReportPage'
import OrdersReportPage from '@/pages/OrdersReportPage'
import CustomerInsightsPage from '@/pages/CustomerInsightsPage'
import CustomReportsPage from '@/pages/CustomReportsPage'
import CreateReportPage from '@/pages/CreateReportPage'
import ChatPage from '@/pages/ChatPage'
import SettingsStorePage from '@/pages/SettingsStorePage'
import SettingsProfilePage from '@/pages/SettingsProfilePage'
import AddSubVendorPage from '@/pages/AddSubVendorPage'
import EditSubVendorPage from '@/pages/EditSubVendorPage'
import SubVendorDetailPage from '@/pages/SubVendorDetailPage'
import ResetPasswordPage from '@/pages/ResetPasswordPage'
import SettingsPolicyPage from '@/pages/SettingsPolicyPage'
import SettingsNotificationsPage from '@/pages/SettingsNotificationsPage'
import SubAdminUsersPage from '@/pages/SubAdminUsersPage'
import SubAdminUserDetailPage from '@/pages/SubAdminUserDetailPage'
import AddSubAdminUserPage from '@/pages/AddSubAdminUserPage'
import SubAdminAnalyticsPage from '@/pages/SubAdminAnalyticsPage'
import SubAdminBookingsPage from '@/pages/SubAdminBookingsPage'
import SubAdminFinancePage from '@/pages/SubAdminFinancePage'
import SubAdminHostsProvidersPage from '@/pages/SubAdminHostsProvidersPage'
import SubAdminMarketingPage from '@/pages/SubAdminMarketingPage'
import SubAdminSettingsPage from '@/pages/SubAdminSettingsPage'

function App() {
  return (
    <BrowserRouter>
      <LanguageProviderWrapper>
        <RoleProvider>
          <Routes>
            <Route path="/" element={<Navigate to="/select-role" replace />} />
            <Route path="/select-role" element={<SelectRolePage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            
            {/* Products */}
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/add" element={<AddProductPage />} />
            <Route path="/products/:id" element={<ViewProductPage />} />
            <Route path="/products/:id/edit" element={<EditProductPage />} />
            
            {/* Orders */}
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/orders/:id" element={<OrderDetailsPage />} />
            <Route path="/orders/:id/invoice" element={<OrderInvoicePage />} />
            <Route path="/orders/:id/tracking" element={<OrderTrackingPage />} />
            
            {/* Transactions */}
            <Route path="/transactions/history" element={<TransactionsHistoryPage />} />
            <Route path="/transactions/:id" element={<TransactionDetailsPage />} />
            <Route path="/transactions/earnings" element={<EarningsPage />} />
            <Route path="/transactions/earnings/products/:id" element={<ProductPerformancePage />} />
            <Route path="/transactions/earnings/withdrawals" element={<WithdrawalsPage />} />
            <Route path="/transactions/earnings/withdrawals/:id" element={<WithdrawalDetailsPage />} />
            <Route path="/transactions/earnings/withdrawals/new" element={<RequestWithdrawalPage />} />
            
            {/* Analytics */}
            <Route path="/analytics/sales-overview" element={<SalesOverviewPage />} />
            <Route path="/analytics/earnings-report" element={<EarningsReportPage />} />
            <Route path="/analytics/orders-report" element={<OrdersReportPage />} />
            <Route path="/analytics/customer-insights" element={<CustomerInsightsPage />} />
            <Route path="/analytics/custom-reports" element={<CustomReportsPage />} />
            <Route path="/analytics/custom-reports/create" element={<CreateReportPage />} />
            
            {/* Chat */}
            <Route path="/chat" element={<ChatPage />} />
            
            {/* Settings */}
            <Route path="/settings/store" element={<SettingsStorePage />} />
            <Route path="/settings/profile" element={<SettingsProfilePage />} />
            <Route path="/settings/profile/add" element={<AddSubVendorPage />} />
            <Route path="/settings/profile/vendors/:id" element={<SubVendorDetailPage />} />
            <Route path="/settings/profile/vendors/:id/edit" element={<EditSubVendorPage />} />
            <Route path="/settings/profile/vendors/:id/reset-password" element={<ResetPasswordPage />} />
            <Route path="/settings/policy" element={<SettingsPolicyPage />} />
            <Route path="/settings/notifications" element={<SettingsNotificationsPage />} />
            
            {/* Sub Admin */}
            <Route path="/sub-admin/users" element={<SubAdminUsersPage />} />
            <Route path="/sub-admin/users/:id" element={<SubAdminUserDetailPage />} />
            <Route path="/sub-admin/users/add" element={<AddSubAdminUserPage />} />
            <Route path="/sub-admin/analytics" element={<SubAdminAnalyticsPage />} />
            <Route path="/sub-admin/bookings" element={<SubAdminBookingsPage />} />
            <Route path="/sub-admin/finance" element={<SubAdminFinancePage />} />
            <Route path="/sub-admin/hosts-providers" element={<SubAdminHostsProvidersPage />} />
            <Route path="/sub-admin/marketing" element={<SubAdminMarketingPage />} />
            <Route path="/sub-admin/settings" element={<SubAdminSettingsPage />} />
            
            {/* Catch all - redirect to select-role */}
            <Route path="*" element={<Navigate to="/select-role" replace />} />
          </Routes>
        </RoleProvider>
      </LanguageProviderWrapper>
    </BrowserRouter>
  )
}

export default App
