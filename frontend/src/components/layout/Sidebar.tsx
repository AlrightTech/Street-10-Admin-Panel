'use client'

import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  BarChart3, 
  Settings,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  X,
  MessageCircle,
  Store,
  User,
  UserCheck,
  ClipboardList,
  DollarSign,
  Percent,
  Clock,
  LogOut
} from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { useRole } from '@/contexts/RoleContext'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface SidebarProps {
  onClose?: () => void
  currentPage?: string
}

export default function Sidebar({ onClose, currentPage = 'dashboard' }: SidebarProps) {
  const { t } = useLanguage()
  const { role, isSubAdmin, setRole } = useRole()
  const router = useRouter()

  const handleLogout = () => {
    // Clear role from localStorage
    setRole(null)
    // Navigate to role-select page
    router.push('/select-role')
    // Close sidebar on mobile if open
    if (onClose) {
      onClose()
    }
  }
  const isTransactionPage = currentPage === 'transactionHistory' || currentPage === 'earningsOverview' || currentPage?.startsWith('transaction')
  const [openMenus, setOpenMenus] = useState<{[key: string]: boolean}>({
    productManagement: currentPage === 'products' || currentPage === 'products',
    orders: false,
    transactions: isTransactionPage,
    analytics: false,
    chat: false,
    settings: false,
    subAdminUsers: currentPage === 'subAdminUsers',
    subAdminHosts: currentPage === 'subAdminHosts',
    subAdminBookings: currentPage === 'subAdminBookings',
    subAdminFinance: currentPage === 'subAdminFinance',
    subAdminMarketing: currentPage === 'subAdminMarketing',
    subAdminAnalytics: currentPage === 'subAdminAnalytics',
    subAdminSettings: currentPage === 'subAdminSettings',
  })

  const toggleMenu = (menu: string) => {
    setOpenMenus(prev => ({ ...prev, [menu]: !prev[menu] }))
  }

  // Sub Admin specific menu items (completely different sidebar)
        const subAdminMenuItems = [
          { icon: Clock, label: t('dashboard'), link: '/dashboard', active: currentPage === 'dashboard' },
          { icon: User, label: t('users'), link: '/sub-admin/users', active: currentPage === 'subAdminUsers' },
          { icon: UserCheck, label: t('hostsProviders'), link: '/sub-admin/hosts-providers', active: currentPage === 'subAdminHosts' },
          { icon: ClipboardList, label: t('bookings'), link: '/sub-admin/bookings', active: currentPage === 'subAdminBookings' },
          { icon: DollarSign, label: t('finance'), link: '/sub-admin/finance', active: currentPage === 'subAdminFinance' },
          { icon: Percent, label: t('marketing'), link: '/sub-admin/marketing', active: currentPage === 'subAdminMarketing' },
          { icon: BarChart3, label: t('analyticsSubAdmin'), link: '/sub-admin/analytics', active: currentPage === 'subAdminAnalytics' },
          { icon: Settings, label: t('settingsSubAdmin'), link: '/sub-admin/settings', active: currentPage === 'subAdminSettings' },
        ]

  // Vendor/Super Admin menu items (original)
  const vendorMenuItems = [
    { icon: LayoutDashboard, label: t('dashboard'), link: '/dashboard', active: currentPage === 'dashboard', roles: ['vendor', 'super-admin'] },
    { icon: Package, label: t('productManagement'), hasSubmenu: true, key: 'productManagement', roles: ['vendor', 'super-admin'] },
    { icon: ShoppingCart, label: t('orders'), link: '/orders', active: currentPage === 'orders', badge: '24', roles: ['vendor', 'super-admin'] },
    { icon: Users, label: t('transactions'), hasSubmenu: true, key: 'transactions', badge: '34', roles: ['vendor', 'super-admin'] },
    { icon: BarChart3, label: t('analytics'), hasSubmenu: true, key: 'analytics', roles: ['vendor', 'super-admin'] },
    { icon: MessageCircle, label: t('chat'), link: '/chat', active: currentPage === 'chat', roles: ['vendor', 'super-admin'] },
    { icon: Store, label: t('storeBuilder'), link: '/settings/store', active: (currentPage === 'settingsStore' || currentPage === 'settingsPolicy' || currentPage === 'settingsNotifications'), roles: ['vendor', 'super-admin'] },
    { icon: Settings, label: t('settings'), link: '/settings/profile', active: currentPage === 'settings' || currentPage === 'settingsProfile', roles: ['vendor', 'super-admin'] },
  ]

  // Use different menu based on role
  const menuItems = isSubAdmin ? subAdminMenuItems : vendorMenuItems.filter(item => !role || item.roles?.includes(role))

  const productManagementSubmenu = [
    { label: t('allProducts'), link: '/products', active: currentPage === 'products' }
  ]

  const transactionsSubmenu = [
    { label: t('transactionHistory'), link: '/transactions/history', active: currentPage === 'transactionHistory' || currentPage?.startsWith('transaction') },
    { label: t('earningsOverview'), link: '/transactions/earnings', active: currentPage === 'earningsOverview' }
  ]
 
  // Analytics submenu - Sub Admin has limited access
  const analyticsSubmenu = isSubAdmin 
    ? [
        { label: t('ordersReport'), link: '/analytics/orders-report', active: currentPage === 'analyticsOrders' },
        { label: t('customerInsights'), link: '/analytics/customer-insights', active: currentPage === 'analyticsCustomers' },
      ]
    : [
        { label: t('salesOverview'), link: '/analytics/sales-overview', active: currentPage === 'analyticsSales' },
        { label: t('earningsReport'), link: '/analytics/earnings-report', active: currentPage === 'analyticsEarnings' },
        { label: t('ordersReport'), link: '/analytics/orders-report', active: currentPage === 'analyticsOrders' },
        { label: t('customerInsights'), link: '/analytics/customer-insights', active: currentPage === 'analyticsCustomers' },
        { label: t('customReports'), link: '/analytics/custom-reports', active: currentPage === 'analyticsCustom' }
      ]

  // Transactions submenu - Sub Admin has no access
  const transactionsSubmenuFiltered = isSubAdmin ? [] : transactionsSubmenu
 
  
  
  return (
    <div className="w-full h-full bg-primary-500 text-white flex flex-col overflow-hidden">
      {/* Logo and Close Button - Fixed at top */}
      <div className="flex-shrink-0 p-4 border-b border-primary-400">
        {/* Close Icon - Top Right */}
        <div className="flex justify-end mb-2">
          {/* Close Icon - Show on desktop only */}
          <button
            onClick={onClose}
            className="hidden lg:flex items-center justify-center w-8 h-8 rounded-lg hover:bg-primary-600 text-white transition-colors"
            aria-label="Close sidebar"
          >
            <ChevronLeft size={20} />
          </button>
          {/* Close X - Show on mobile */}
          <button
            onClick={onClose}
            className="lg:hidden flex items-center justify-center w-8 h-8 rounded-lg hover:bg-primary-600 text-white transition-colors"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>
        {/* Logo - Centered Below */}
        <div className="flex items-center justify-center">
          <img 
            src="/images/sidebar-topicon.png" 
            alt="Street 10" 
            className="h-20 w-auto object-contain"
          />
        </div>
      </div>

      {/* Navigation - Scrollable, takes remaining space */}
      <nav className="flex-1 p-3 overflow-y-auto overflow-x-hidden">
        <ul className="space-y-2">
          {menuItems.map((item, index) => (
            <li key={index}>
              {item.link ? (
                       <Link
                         href={item.link}
                         className={`flex items-center justify-between px-3 py-3 rounded-lg transition-colors duration-200 ${
                           item.active
                             ? 'bg-orange-500 text-white'
                             : 'text-white hover:bg-primary-600'
                         }`}
                       >
                         <div className="flex items-center space-x-3">
                           <item.icon size={20} />
                           <span className="font-medium">{item.label}</span>
                           {'badge' in item && item.badge && (
                             <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full ml-1">
                               {item.badge}
                             </span>
                           )}
                  </div>
                </Link>
              ) : (
                <>
                       <button
                         onClick={() => 'hasSubmenu' in item && item.hasSubmenu && 'key' in item && item.key && toggleMenu(item.key)}
                         className={`flex items-center justify-between w-full px-3 py-3 rounded-lg transition-colors duration-200 ${
                           (item.active || ('key' in item && item.key === 'transactions' && isTransactionPage))
                             ? 'bg-orange-500 text-white'
                             : 'text-white hover:bg-primary-600'
                         }`}
                       >
                           <div className="flex items-center space-x-3">
                             <item.icon size={20} />
                             <span className="font-medium">{item.label}</span>
                      {'badge' in item && item.badge && (
                        <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full ml-1">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    {'hasSubmenu' in item && item.hasSubmenu && 'key' in item && item.key && (
                      <div className="transform transition-transform">
                        {openMenus[item.key as string] ? <ChevronDown size={14} className="opacity-70" /> : <ChevronRight size={14} className="opacity-70" />}
                      </div>
                    )}
                  </button>
                  {'hasSubmenu' in item && item.hasSubmenu && 'key' in item && item.key === 'productManagement' && openMenus[item.key as string] && (
                    <ul className="ml-4 mt-2 space-y-2">
                      {productManagementSubmenu.map((subItem, subIndex) => (
                        <li key={subIndex}>
                          <Link
                            href={subItem.link}
                            className={`flex items-center px-4 py-2.5 rounded-lg transition-colors duration-200 ${
                              subItem.active
                                ? 'bg-orange-500 text-white'
                                : 'text-primary-200 hover:bg-primary-600 hover:text-white'
                            }`}
                          >
                            <span className="font-medium">{subItem.label}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                  {'hasSubmenu' in item && item.hasSubmenu && 'key' in item && item.key === 'transactions' && openMenus[item.key as string] && (
                    <ul className="ml-4 mt-2 space-y-2">
                      {transactionsSubmenuFiltered.map((subItem, subIndex) => (
                        <li key={subIndex}>
                          <Link
                            href={subItem.link}
                            className={`flex items-center px-4 py-2.5 rounded-lg transition-colors duration-200 ${
                              subItem.active
                                ? 'bg-orange-500 text-white'
                                : 'text-primary-200 hover:bg-primary-600 hover:text-white'
                            }`}
                          >
                            <span className="font-medium">{subItem.label}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                  {'hasSubmenu' in item && item.hasSubmenu && 'key' in item && item.key === 'analytics' && openMenus[item.key as string] && (
                    <ul className="ml-4 mt-2 space-y-2">
                      {analyticsSubmenu.map((subItem, subIndex) => (
                        <li key={subIndex}>
                          <Link
                            href={subItem.link}
                            className={`flex items-center px-4 py-2.5 rounded-lg transition-colors duration-200 ${
                              subItem.active
                                ? 'bg-orange-500 text-white'
                                : 'text-primary-200 hover:bg-primary-600 hover:text-white'
                            }`}
                          >
                            <span className="font-medium">{subItem.label}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                  
                </>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* User Profile - Fixed at bottom */}
      <div className="flex-shrink-0 p-3 border-t border-primary-400">
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold">A</span>
          </div>
          <div className="flex-1">
            <p className="font-medium">Abdullah</p>
            <p className="text-xs text-primary-200">
              {role === 'vendor' ? t('vendor') : 
               role === 'sub-admin' ? (t('subAdmin') || 'Sub Admin') :
               role === 'super-admin' ? (t('superAdmin') || 'Super Admin') :
               t('vendor')}
            </p>
          </div>
        </div>
        
              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-white hover:bg-primary-600 transition-colors duration-200"
              >
                <LogOut size={20} />
                <span className="font-medium">{t('logout')}</span>
              </button>
      </div>
    </div>
  )
}

