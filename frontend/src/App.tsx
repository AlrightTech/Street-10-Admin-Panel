import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import LanguageProviderWrapper from '@/components/providers/LanguageProviderWrapper'
import { RoleProvider } from '@/contexts/RoleContext'
import Loader from '@/components/ui/Loader'

// Lazy load all pages for code splitting
const SelectRolePage = lazy(() => import('@/pages/SelectRolePage'))
const DashboardPage = lazy(() => import('@/pages/DashboardPage'))
const ProductsPage = lazy(() => import('@/pages/ProductsPage'))
const ViewProductPage = lazy(() => import('@/pages/ViewProductPage'))
const AddProductPage = lazy(() => import('@/pages/AddProductPage'))
const EditProductPage = lazy(() => import('@/pages/EditProductPage'))
const OrdersPage = lazy(() => import('@/pages/OrdersPage'))
const OrderDetailsPage = lazy(() => import('@/pages/OrderDetailsPage'))
const OrderInvoicePage = lazy(() => import('@/pages/OrderInvoicePage'))
const OrderTrackingPage = lazy(() => import('@/pages/OrderTrackingPage'))
const TransactionsHistoryPage = lazy(() => import('@/pages/TransactionsHistoryPage'))
const TransactionDetailsPage = lazy(() => import('@/pages/TransactionDetailsPage'))
const EarningsPage = lazy(() => import('@/pages/EarningsPage'))
const ProductPerformancePage = lazy(() => import('@/pages/ProductPerformancePage'))
const WithdrawalsPage = lazy(() => import('@/pages/WithdrawalsPage'))
const WithdrawalDetailsPage = lazy(() => import('@/pages/WithdrawalDetailsPage'))
const RequestWithdrawalPage = lazy(() => import('@/pages/RequestWithdrawalPage'))
const SalesOverviewPage = lazy(() => import('@/pages/SalesOverviewPage'))
const EarningsReportPage = lazy(() => import('@/pages/EarningsReportPage'))
const OrdersReportPage = lazy(() => import('@/pages/OrdersReportPage'))
const CustomerInsightsPage = lazy(() => import('@/pages/CustomerInsightsPage'))
const CustomReportsPage = lazy(() => import('@/pages/CustomReportsPage'))
const CreateReportPage = lazy(() => import('@/pages/CreateReportPage'))
const ChatPage = lazy(() => import('@/pages/ChatPage'))
const SettingsStorePage = lazy(() => import('@/pages/SettingsStorePage'))
const SettingsProfilePage = lazy(() => import('@/pages/SettingsProfilePage'))
const AddSubVendorPage = lazy(() => import('@/pages/AddSubVendorPage'))
const EditSubVendorPage = lazy(() => import('@/pages/EditSubVendorPage'))
const SubVendorDetailPage = lazy(() => import('@/pages/SubVendorDetailPage'))
const ResetPasswordPage = lazy(() => import('@/pages/ResetPasswordPage'))
const SettingsPolicyPage = lazy(() => import('@/pages/SettingsPolicyPage'))
const SettingsNotificationsPage = lazy(() => import('@/pages/SettingsNotificationsPage'))
const SubAdminUsersPage = lazy(() => import('@/pages/SubAdminUsersPage'))
const SubAdminUserDetailPage = lazy(() => import('@/pages/SubAdminUserDetailPage'))
const AddSubAdminUserPage = lazy(() => import('@/pages/AddSubAdminUserPage'))
const SubAdminAnalyticsPage = lazy(() => import('@/pages/SubAdminAnalyticsPage'))
const SubAdminBookingsPage = lazy(() => import('@/pages/SubAdminBookingsPage'))
const SubAdminFinancePage = lazy(() => import('@/pages/SubAdminFinancePage'))
const SubAdminHostsProvidersPage = lazy(() => import('@/pages/SubAdminHostsProvidersPage'))
const SubAdminMarketingPage = lazy(() => import('@/pages/SubAdminMarketingPage'))
const SubAdminSettingsPage = lazy(() => import('@/pages/SubAdminSettingsPage'))

// Loading fallback component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <Loader />
  </div>
)

function App() {
  return (
    <BrowserRouter>
      <LanguageProviderWrapper>
        <RoleProvider>
          <Suspense fallback={<PageLoader />}>
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
          </Suspense>
        </RoleProvider>
      </LanguageProviderWrapper>
    </BrowserRouter>
  )
}

export default App
