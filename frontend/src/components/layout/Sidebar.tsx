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
  Store
} from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { useState } from 'react'
import Link from 'next/link'

interface SidebarProps {
  onClose?: () => void
  currentPage?: string
}

export default function Sidebar({ onClose, currentPage = 'dashboard' }: SidebarProps) {
  const { t } = useLanguage()
  const isTransactionPage = currentPage === 'transactionHistory' || currentPage === 'earningsOverview' || currentPage?.startsWith('transaction')
  const [openMenus, setOpenMenus] = useState<{[key: string]: boolean}>({
    productManagement: currentPage === 'products' || currentPage === 'products',
    orders: false,
    transactions: isTransactionPage,
    analytics: false,
    chat: false,
    settings: false
  })

  const toggleMenu = (menu: string) => {
    setOpenMenus(prev => ({ ...prev, [menu]: !prev[menu] }))
  }

  const menuItems = [
    { icon: LayoutDashboard, label: t('dashboard'), link: '/dashboard', active: currentPage === 'dashboard' },
    { icon: Package, label: t('productManagement'), hasSubmenu: true, key: 'productManagement' },
    { icon: ShoppingCart, label: t('orders'), link: '/orders', active: currentPage === 'orders', badge: '24' },
    { icon: Users, label: t('transactions'), hasSubmenu: true, key: 'transactions', badge: '34' },
    { icon: BarChart3, label: t('analytics'), hasSubmenu: true, key: 'analytics' },
    { icon: MessageCircle, label: t('chat'), link: '/chat', active: currentPage === 'chat' },
    { icon: Store, label: t('storeBuilder'), link: '/settings/store', active: (currentPage === 'settingsStore' || currentPage === 'settingsPolicy' || currentPage === 'settingsNotifications') },
    { icon: Settings, label: t('settings'), link: '/settings/profile', active: currentPage === 'settings' || currentPage === 'settingsProfile' },
  ]

  const productManagementSubmenu = [
    { label: t('allProducts'), link: '/products', active: currentPage === 'products' }
  ]

  const transactionsSubmenu = [
    { label: t('transactionHistory'), link: '/transactions/history', active: currentPage === 'transactionHistory' || currentPage?.startsWith('transaction') },
    { label: t('earningsOverview'), link: '/transactions/earnings', active: currentPage === 'earningsOverview' }
  ]
 
  const analyticsSubmenu = [
    { label: t('salesOverview'), link: '/analytics/sales-overview', active: currentPage === 'analyticsSales' },
    { label: t('earningsReport'), link: '/analytics/earnings-report', active: currentPage === 'analyticsEarnings' },
    { label: t('ordersReport'), link: '/analytics/orders-report', active: currentPage === 'analyticsOrders' },
    { label: t('customerInsights'), link: '/analytics/customer-insights', active: currentPage === 'analyticsCustomers' },
    { label: t('customReports'), link: '/analytics/custom-reports', active: currentPage === 'analyticsCustom' }
  ]
 
  
  
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
            alt="MAZAD" 
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
                  </div>
                </Link>
              ) : (
                <>
                       <button
                         onClick={() => item.hasSubmenu && toggleMenu(item.key)}
                         className={`flex items-center justify-between w-full px-3 py-3 rounded-lg transition-colors duration-200 ${
                           (item.active || (item.key === 'transactions' && isTransactionPage))
                             ? 'bg-orange-500 text-white'
                             : 'text-white hover:bg-primary-600'
                         }`}
                       >
                           <div className="flex items-center space-x-3">
                             <item.icon size={20} />
                             <span className="font-medium">{item.label}</span>
                      {item.badge && (
                        <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full ml-1">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    {item.hasSubmenu && (
                      <div className="transform transition-transform">
                        {openMenus[item.key] ? <ChevronDown size={14} className="opacity-70" /> : <ChevronRight size={14} className="opacity-70" />}
                      </div>
                    )}
                  </button>
                  {item.hasSubmenu && item.key === 'productManagement' && openMenus[item.key] && (
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
                  {item.hasSubmenu && item.key === 'transactions' && openMenus[item.key] && (
                    <ul className="ml-4 mt-2 space-y-2">
                      {transactionsSubmenu.map((subItem, subIndex) => (
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
                  {item.hasSubmenu && item.key === 'analytics' && openMenus[item.key] && (
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
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold">A</span>
          </div>
          <div className="flex-1">
            <p className="font-medium">Abdullah</p>
            <p className="text-xs text-primary-200">{t('vendor')}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

