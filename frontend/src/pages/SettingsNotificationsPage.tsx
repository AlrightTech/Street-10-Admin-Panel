import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Menu, Bell, Package, Truck, Star, AlertTriangle, RefreshCcw, DollarSign } from 'lucide-react'
import TabsBar from '@/components/ui/TabsBar'
import { useLanguage } from '@/contexts/LanguageContext'

export default function SettingsNotificationsPage() {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [activeFilter, setActiveFilter] = useState<'all' | 'orders' | 'payouts' | 'system'>('all')
  const [displayedCount, setDisplayedCount] = useState(3)

  // Handle notification link clicks
  const handleLinkClick = (linkText: string, notificationType?: string, orderId?: string) => {
    // Check if link text matches any of the known translations
    if (linkText === t('viewOrder') || linkText.includes('View Order') || linkText.includes('view order')) {
      // Extract order ID from description if available
      const orderMatch = notificationType?.match(/#(\d+)/)
      if (orderMatch) {
        navigate(`/orders/${orderMatch[1]}`)
      } else {
        navigate('/orders')
      }
    } else if (linkText === t('trackPackage') || linkText.includes('Track Package') || linkText.includes('track package')) {
      navigate('/orders/10198/tracking')
    } else if (linkText === t('restockNow') || linkText.includes('Restock Now') || linkText.includes('restock')) {
      navigate('/products')
    } else if (linkText === t('viewTransaction') || linkText.includes('View Transaction') || linkText.includes('transaction')) {
      navigate('/transactions/history')
    } else if (linkText === t('viewPolicy') || linkText.includes('View Policy') || linkText.includes('policy')) {
      navigate('/settings/policy')
    } else if (linkText === t('viewReview') || linkText.includes('View Review') || linkText.includes('review')) {
      navigate('/products')
    } else if (linkText === t('viewAll') || linkText.includes('View All') || linkText.includes('view all')) {
      navigate('/orders')
    } else if (linkText === t('viewTranscript') || linkText.includes('View Transcript') || linkText.includes('transcript')) {
      // For chat/transcript, navigate to chat page
      navigate('/chat')
    } else {
      // Default fallback
      navigate('/orders')
    }
  }

  const handleLoadMore = () => {
    setDisplayedCount(prev => prev + 6)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Layout */}
      <div className="hidden lg:flex h-screen overflow-hidden">
        {!sidebarCollapsed && (
          <div className="w-64 flex-shrink-0 bg-primary-500 h-screen overflow-y-auto">
            <Sidebar onClose={() => setSidebarCollapsed(true)} currentPage="settingsNotifications" />
          </div>
        )}

        {sidebarCollapsed && (
          <button
            onClick={() => setSidebarCollapsed(false)}
            className="fixed left-0 top-4 z-30 bg-primary-500 text-white p-2 rounded-r-lg"
            aria-label="Toggle sidebar"
          >
            <Menu size={24} />
          </button>
        )}

        <div className="flex-1 flex flex-col h-screen overflow-hidden bg-gray-50">
          <div className="flex-shrink-0 sticky top-0 z-10 bg-white border-b border-gray-200">
            <Header />
          </div>
          <main className="flex-1 overflow-y-auto p-6">
            <div className="max-w-6xl mx-auto space-y-6">
              {/* Header */}
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{t('storeBuilder')}</h1>
                <p className="text-sm text-gray-500 mt-1">{t('dashboardNotifications')}</p>
              </div>

              {/* Tabs */}
              <TabsBar
                tabs={[
                  { label: t('storeSettings'), href: '/settings/store' },
                  { label: t('policySettings'), href: '/settings/policy' },
                  { label: t('notifications'), href: '/settings/notifications', active: true },
                ]}
                variant="underline"
              />

              {/* Filters header */}
              <div className="bg-white rounded-lg border border-gray-200 p-3 flex items-center justify-between">
                <div className="flex items-center gap-3 px-2">
                  <button 
                    onClick={() => setActiveFilter('all')}
                    className={`px-4 py-2 transition-colors font-medium ${
                      activeFilter === 'all' 
                        ? 'bg-[#5C50AE] text-white rounded-lg' 
                        : 'text-gray-500 hover:text-gray-700 bg-transparent'
                    }`}
                  >
                    {t('all')}
                  </button>
                  <button 
                    onClick={() => setActiveFilter('orders')}
                    className={`px-4 py-2 transition-colors font-medium ${
                      activeFilter === 'orders' 
                        ? 'bg-[#5C50AE] text-white rounded-lg' 
                        : 'text-gray-500 hover:text-gray-700 bg-transparent'
                    }`}
                  >
                    {t('orders')}
                  </button>
                  <button 
                    onClick={() => setActiveFilter('payouts')}
                    className={`px-4 py-2 transition-colors font-medium ${
                      activeFilter === 'payouts' 
                        ? 'bg-[#5C50AE] text-white rounded-lg' 
                        : 'text-gray-500 hover:text-gray-700 bg-transparent'
                    }`}
                  >
                    {t('payouts')}
                  </button>
                  <button 
                    onClick={() => setActiveFilter('system')}
                    className={`px-4 py-2 transition-colors font-medium ${
                      activeFilter === 'system' 
                        ? 'bg-[#5C50AE] text-white rounded-lg' 
                        : 'text-gray-500 hover:text-gray-700 bg-transparent'
                    }`}
                  >
                    {t('systemUpdates')}
                  </button>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <button className="text-gray-600 hover:text-gray-900">{t('markAllAsRead')}</button>
                  <span className="h-3 w-px bg-gray-300" />
                  <button className="text-red-500 hover:text-red-600">{t('clearAll')}</button>
                </div>
              </div>

              {/* Notifications list */}
              <div className="bg-white rounded-lg border border-gray-200">
                {[
                  { icon: Package, title: t('newOrderReceived'), desc: 'Order #10425 has been placed by Sarah Johnson. Total amount: $129.99', tags: [{t:t('newOrder'),c:'bg-green-100 text-green-700'}], links: [t('viewOrder')], time: '2 minutes ago', color: 'text-green-600', dot: 'bg-purple-500', type: 'orders' as const, orderId: '10425' },
                  { icon: DollarSign, title: t('withdrawalCompleted'), desc: 'Your withdrawal request of $560.00 has been processed successfully to your bank account ending in 4567.', tags: [{t:t('payout'),c:'bg-blue-100 text-blue-700'}], links: [t('viewTransaction')], time: '1 day ago', color: 'text-blue-600', dot: 'bg-purple-500', type: 'payouts' as const },
                  { icon: RefreshCcw, title: t('refundPolicyUpdated'), desc: 'Your refund policy has been successfully updated. The new policy will take effect immediately for all new orders.', tags: [{t:t('systemUpdate'),c:'bg-purple-100 text-purple-700'}], links: [t('viewPolicy')], time: '5 days ago', color: 'text-purple-600', dot: 'bg-purple-500', type: 'system' as const },
                  { icon: Truck, title: t('orderShipped'), desc: 'Order #10198 has been shipped via FedEx. Tracking number: IZ999AA1234567890. Expected delivery: Jan 28, 2025', tags: [{t:t('orderUpdate'),c:'bg-orange-100 text-orange-700'}], links: [t('trackPackage')], time: '1 week ago', color: 'text-orange-600', dot: 'bg-purple-500', type: 'orders' as const, orderId: '10198' },
                  { icon: AlertTriangle, title: t('lowStockAlert'), desc: 'Product "Wireless Bluetooth Headphones" is running low on stock. Only 3 units remaining. Consider restocking soon.', tags: [{t:t('stockAlert'),c:'bg-red-100 text-red-700'}], links: [t('restockNow')], time: '1 week ago', color: 'text-red-600', dot: 'bg-purple-500', type: 'orders' as const },
                  { icon: Star, title: t('new5StarReview'), desc: 'Michael Davis left a 5-star review for "Premium Coffee Beans": "Excellent quality and fast shipping. Highly recommended!"', tags: [{t:t('review'),c:'bg-yellow-100 text-yellow-700'}], links: [t('viewReview')], time: '2 weeks ago', color: 'text-yellow-600', dot: 'bg-purple-500', type: 'orders' as const },
                ]
                .filter((n) => activeFilter === 'all' || n.type === activeFilter)
                .slice(0, displayedCount)
                .map((n, idx, filteredArray) => (
                  <div key={idx} className={`flex items-start gap-3 p-4 ${idx !== filteredArray.length - 1 ? 'border-b' : ''}`}>
                    <div className={`w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center ${n.color}`}>
                      <n.icon size={18} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-gray-900">{n.title}</h3>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] text-gray-500">{n.time}</span>
                          <span className={`h-1.5 w-1.5 rounded-full ${n.dot}`} />
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{n.desc}</p>
                      <div className="flex items-center gap-2 mt-2">
                        {n.tags.map((tag) => (
                          <span key={tag.t} className={`px-2 py-0.5 rounded-md text-[11px] ${tag.c} border border-gray-200`}>{tag.t}</span>
                        ))}
                        {n.links.map((a) => (
                          <button 
                            key={a} 
                            onClick={() => handleLinkClick(a, n.desc, n.orderId)}
                            className="text-xs text-orange-600 hover:underline ml-1 cursor-pointer transition-colors"
                          >
                            {a}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
                {[
                  { icon: Package, title: t('newOrderReceived'), desc: 'Order #10425 has been placed by Sarah Johnson. Total amount: $129.99', tags: [{t:t('newOrder'),c:'bg-green-100 text-green-700'}], links: [t('viewOrder')], time: '2 minutes ago', color: 'text-green-600', dot: 'bg-purple-500', type: 'orders' as const, orderId: '10425' },
                  { icon: DollarSign, title: t('withdrawalCompleted'), desc: 'Your withdrawal request of $560.00 has been processed successfully to your bank account ending in 4567.', tags: [{t:t('payout'),c:'bg-blue-100 text-blue-700'}], links: [t('viewTransaction')], time: '1 day ago', color: 'text-blue-600', dot: 'bg-purple-500', type: 'payouts' as const },
                  { icon: RefreshCcw, title: t('refundPolicyUpdated'), desc: 'Your refund policy has been successfully updated. The new policy will take effect immediately for all new orders.', tags: [{t:t('systemUpdate'),c:'bg-purple-100 text-purple-700'}], links: [t('viewPolicy')], time: '5 days ago', color: 'text-purple-600', dot: 'bg-purple-500', type: 'system' as const },
                  { icon: Truck, title: t('orderShipped'), desc: 'Order #10198 has been shipped via FedEx. Tracking number: IZ999AA1234567890. Expected delivery: Jan 28, 2025', tags: [{t:t('orderUpdate'),c:'bg-orange-100 text-orange-700'}], links: [t('trackPackage')], time: '1 week ago', color: 'text-orange-600', dot: 'bg-purple-500', type: 'orders' as const, orderId: '10198' },
                  { icon: AlertTriangle, title: t('lowStockAlert'), desc: 'Product "Wireless Bluetooth Headphones" is running low on stock. Only 3 units remaining. Consider restocking soon.', tags: [{t:t('stockAlert'),c:'bg-red-100 text-red-700'}], links: [t('restockNow')], time: '1 week ago', color: 'text-red-600', dot: 'bg-purple-500', type: 'orders' as const },
                  { icon: Star, title: t('new5StarReview'), desc: 'Michael Davis left a 5-star review for "Premium Coffee Beans": "Excellent quality and fast shipping. Highly recommended!"', tags: [{t:t('review'),c:'bg-yellow-100 text-yellow-700'}], links: [t('viewReview')], time: '2 weeks ago', color: 'text-yellow-600', dot: 'bg-purple-500', type: 'orders' as const },
                ].filter((n) => activeFilter === 'all' || n.type === activeFilter).length > displayedCount && (
                  <div className="p-4 border-t flex justify-center">
                    <button 
                      onClick={handleLoadMore}
                      className="px-4 py-2 text-sm rounded-md border text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
                    >
                      <Bell size={16} />
                      {t('loadMoreNotifications')}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden">
        {sidebarOpen && (
          <div className="fixed inset-0 z-50">
            <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
            <div className="absolute left-0 top-0 bottom-0 w-64 bg-primary-500">
              <Sidebar onClose={() => setSidebarOpen(false)} currentPage="settingsNotifications" />
            </div>
          </div>
        )}

        <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
          <Header onToggleSidebar={() => setSidebarOpen(true)} isSidebarOpen={sidebarOpen} />
        </div>
        <main className="p-4 space-y-4 pt-20 lg:pt-4">
          <div>
            <TabsBar
              tabs={[
                { label: t('storeSettings'), href: '/settings/store' },
                { label: t('policySettings'), href: '/settings/policy' },
                { label: t('notifications'), href: '/settings/notifications', active: true },
              ]}
              variant="underline"
            />
          </div>

          {/* Filters header */}
          <div className="bg-white rounded-lg border border-gray-200 p-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="flex items-center gap-2 sm:gap-3 px-2">
              <button 
                onClick={() => setActiveFilter('all')}
                className={`px-3 sm:px-4 py-2 transition-colors font-medium text-sm ${
                  activeFilter === 'all' 
                    ? 'bg-[#5C50AE] text-white rounded-lg' 
                    : 'text-gray-500 hover:text-gray-700 bg-transparent'
                }`}
              >
                {t('all')}
              </button>
              <button 
                onClick={() => setActiveFilter('orders')}
                className={`px-3 sm:px-4 py-2 transition-colors font-medium text-sm ${
                  activeFilter === 'orders' 
                    ? 'bg-[#5C50AE] text-white rounded-lg' 
                    : 'text-gray-500 hover:text-gray-700 bg-transparent'
                }`}
              >
                {t('orders')}
              </button>
              <button 
                onClick={() => setActiveFilter('payouts')}
                className={`px-3 sm:px-4 py-2 transition-colors font-medium text-sm ${
                  activeFilter === 'payouts' 
                    ? 'bg-[#5C50AE] text-white rounded-lg' 
                    : 'text-gray-500 hover:text-gray-700 bg-transparent'
                }`}
              >
                {t('payouts')}
              </button>
              <button 
                onClick={() => setActiveFilter('system')}
                className={`px-3 sm:px-4 py-2 transition-colors font-medium text-sm ${
                  activeFilter === 'system' 
                    ? 'bg-[#5C50AE] text-white rounded-lg' 
                    : 'text-gray-500 hover:text-gray-700 bg-transparent'
                }`}
              >
                {t('systemUpdates')}
              </button>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <button className="text-gray-600 hover:text-gray-900">{t('markAllAsRead')}</button>
              <span className="h-3 w-px bg-gray-300" />
              <button className="text-red-500 hover:text-red-600">{t('clearAll')}</button>
            </div>
          </div>

          {/* Notifications list */}
          <div className="bg-white rounded-lg border border-gray-200">
            {[
              { icon: Package, title: t('newOrderReceived'), desc: 'Order #10425 has been placed by Sarah Johnson. Total amount: $129.99', tags: [{t:t('newOrder'),c:'bg-green-100 text-green-700'}], links: [t('viewOrder')], time: '2 minutes ago', color: 'text-green-600', dot: 'bg-purple-500', type: 'orders' as const, orderId: '10425' },
              { icon: DollarSign, title: t('withdrawalCompleted'), desc: 'Your withdrawal request of $560.00 has been processed successfully to your bank account ending in 4567.', tags: [{t:t('payout'),c:'bg-blue-100 text-blue-700'}], links: [t('viewTransaction')], time: '1 day ago', color: 'text-blue-600', dot: 'bg-purple-500', type: 'payouts' as const },
              { icon: RefreshCcw, title: t('refundPolicyUpdated'), desc: 'Your refund policy has been successfully updated. The new policy will take effect immediately for all new orders.', tags: [{t:t('systemUpdate'),c:'bg-purple-100 text-purple-700'}], links: [t('viewPolicy')], time: '5 days ago', color: 'text-purple-600', dot: 'bg-purple-500', type: 'system' as const },
              { icon: Truck, title: t('orderShipped'), desc: 'Order #10198 has been shipped via FedEx. Tracking number: IZ999AA1234567890. Expected delivery: Jan 28, 2025', tags: [{t:t('orderUpdate'),c:'bg-orange-100 text-orange-700'}], links: [t('trackPackage')], time: '1 week ago', color: 'text-orange-600', dot: 'bg-purple-500', type: 'orders' as const, orderId: '10198' },
              { icon: AlertTriangle, title: t('lowStockAlert'), desc: 'Product "Wireless Bluetooth Headphones" is running low on stock. Only 3 units remaining. Consider restocking soon.', tags: [{t:t('stockAlert'),c:'bg-red-100 text-red-700'}], links: [t('restockNow')], time: '1 week ago', color: 'text-red-600', dot: 'bg-purple-500', type: 'orders' as const },
              { icon: Star, title: t('new5StarReview'), desc: 'Michael Davis left a 5-star review for "Premium Coffee Beans": "Excellent quality and fast shipping. Highly recommended!"', tags: [{t:t('review'),c:'bg-yellow-100 text-yellow-700'}], links: [t('viewReview')], time: '2 weeks ago', color: 'text-yellow-600', dot: 'bg-purple-500', type: 'orders' as const },
            ]
            .filter((n) => activeFilter === 'all' || n.type === activeFilter)
            .slice(0, displayedCount)
            .map((n, idx, filteredArray) => (
              <div key={idx} className={`flex items-start gap-3 p-4 ${idx !== filteredArray.length - 1 ? 'border-b' : ''}`}>
                <div className={`w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center ${n.color}`}>
                  <n.icon size={18} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-gray-900">{n.title}</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-gray-500">{n.time}</span>
                      <span className={`h-1.5 w-1.5 rounded-full ${n.dot}`} />
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{n.desc}</p>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    {n.tags.map((tag) => (
                      <span key={tag.t} className={`px-2 py-0.5 rounded-md text-[11px] ${tag.c} border border-gray-200`}>{tag.t}</span>
                    ))}
                    {n.links.map((a) => (
                      <button 
                        key={a} 
                        onClick={() => handleLinkClick(a, n.desc, n.orderId)}
                        className="text-xs text-orange-600 hover:underline ml-1 cursor-pointer transition-colors"
                      >
                        {a}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
            {[
              { icon: Package, title: t('newOrderReceived'), desc: 'Order #10425 has been placed by Sarah Johnson. Total amount: $129.99', tags: [{t:t('newOrder'),c:'bg-green-100 text-green-700'}], links: [t('viewOrder')], time: '2 minutes ago', color: 'text-green-600', dot: 'bg-purple-500', type: 'orders' as const, orderId: '10425' },
              { icon: DollarSign, title: t('withdrawalCompleted'), desc: 'Your withdrawal request of $560.00 has been processed successfully to your bank account ending in 4567.', tags: [{t:t('payout'),c:'bg-blue-100 text-blue-700'}], links: [t('viewTransaction')], time: '1 day ago', color: 'text-blue-600', dot: 'bg-purple-500', type: 'payouts' as const },
              { icon: RefreshCcw, title: t('refundPolicyUpdated'), desc: 'Your refund policy has been successfully updated. The new policy will take effect immediately for all new orders.', tags: [{t:t('systemUpdate'),c:'bg-purple-100 text-purple-700'}], links: [t('viewPolicy')], time: '5 days ago', color: 'text-purple-600', dot: 'bg-purple-500', type: 'system' as const },
              { icon: Truck, title: t('orderShipped'), desc: 'Order #10198 has been shipped via FedEx. Tracking number: IZ999AA1234567890. Expected delivery: Jan 28, 2025', tags: [{t:t('orderUpdate'),c:'bg-orange-100 text-orange-700'}], links: [t('trackPackage')], time: '1 week ago', color: 'text-orange-600', dot: 'bg-purple-500', type: 'orders' as const, orderId: '10198' },
              { icon: AlertTriangle, title: t('lowStockAlert'), desc: 'Product "Wireless Bluetooth Headphones" is running low on stock. Only 3 units remaining. Consider restocking soon.', tags: [{t:t('stockAlert'),c:'bg-red-100 text-red-700'}], links: [t('restockNow')], time: '1 week ago', color: 'text-red-600', dot: 'bg-purple-500', type: 'orders' as const },
              { icon: Star, title: t('new5StarReview'), desc: 'Michael Davis left a 5-star review for "Premium Coffee Beans": "Excellent quality and fast shipping. Highly recommended!"', tags: [{t:t('review'),c:'bg-yellow-100 text-yellow-700'}], links: [t('viewReview')], time: '2 weeks ago', color: 'text-yellow-600', dot: 'bg-purple-500', type: 'orders' as const },
            ].filter((n) => activeFilter === 'all' || n.type === activeFilter).length > displayedCount && (
              <div className="p-4 border-t flex justify-center">
                <button 
                  onClick={handleLoadMore}
                  className="px-4 py-2 text-sm rounded-md border text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
                >
                  <Bell size={16} />
                  {t('loadMoreNotifications')}
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}


