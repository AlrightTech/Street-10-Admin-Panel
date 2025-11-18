'use client'

import { Search, Bell, ChevronDown, Menu, X, Package, Truck, Star, AlertTriangle, RefreshCcw, DollarSign, Loader2, User, Settings, LogOut, HelpCircle } from 'lucide-react'
import { useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { useRole } from '@/contexts/RoleContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface HeaderProps {
  onToggleSidebar?: () => void
  isSidebarOpen?: boolean
}

export default function Header({ onToggleSidebar, isSidebarOpen = false }: HeaderProps) {
  const { language, changeLanguage, t } = useLanguage()
  const { setRole } = useRole()
  const router = useRouter()
  const [showLangDropdown, setShowLangDropdown] = useState(false)
  const [searchExpanded, setSearchExpanded] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfileDropdown, setShowProfileDropdown] = useState(false)
  const [activeFilter, setActiveFilter] = useState<'all' | 'orders' | 'payouts' | 'system'>('all')
  const [displayCount, setDisplayCount] = useState(6)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [readNotifications, setReadNotifications] = useState<Set<string>>(new Set())
  const [clearedNotifications, setClearedNotifications] = useState<Set<string>>(new Set())

  const languages = [
    { code: 'ar', name: 'Arabic', flag: '🇶🇦' },
    { code: 'en', name: 'English', flag: '🇬🇧' }
  ]

  type Language = typeof languages[number]

  const handleLanguageChange = (lang: Language) => {
    changeLanguage(lang.code)
    setShowLangDropdown(false)
  }

  const allNotifications = [
    { id: '1', icon: Package, titleKey: 'newOrderReceived', descKey: 'orderPlacedBy', tags: [{tKey:'newOrder',c:'bg-green-100 text-green-700'}], links: [{tKey:'viewOrder'}], timeKey: 'twoMinutesAgo', color: 'text-green-600', dot: 'bg-purple-500', type: 'orders' as const },
    { id: '2', icon: DollarSign, titleKey: 'withdrawalCompleted', descKey: 'withdrawalProcessed', tags: [{tKey:'payout',c:'bg-blue-100 text-blue-700'}], links: [{tKey:'viewTransaction'}], timeKey: 'oneDayAgo', color: 'text-blue-600', dot: 'bg-purple-500', type: 'payouts' as const },
    { id: '3', icon: RefreshCcw, titleKey: 'refundPolicyUpdated', descKey: 'refundPolicyUpdatedDesc', tags: [{tKey:'systemUpdate',c:'bg-purple-100 text-purple-700'}], links: [{tKey:'viewPolicy'}], timeKey: 'fiveDaysAgo', color: 'text-purple-600', dot: 'bg-purple-500', type: 'system' as const },
    { id: '4', icon: Truck, titleKey: 'orderShipped', descKey: 'orderShippedDesc', tags: [{tKey:'orderUpdate',c:'bg-orange-100 text-orange-700'}], links: [{tKey:'trackPackage'}], timeKey: 'oneWeekAgo', color: 'text-orange-600', dot: 'bg-purple-500', type: 'orders' as const },
    { id: '5', icon: AlertTriangle, titleKey: 'lowStockAlert', descKey: 'lowStockDesc', tags: [{tKey:'stockAlert',c:'bg-red-100 text-red-700'}], links: [{tKey:'restockNow'}], timeKey: 'oneWeekAgo', color: 'text-red-600', dot: 'bg-purple-500', type: 'orders' as const },
    { id: '6', icon: Star, titleKey: 'new5StarReview', descKey: 'new5StarReviewDesc', tags: [{tKey:'review',c:'bg-yellow-100 text-yellow-700'}], links: [{tKey:'viewReview'}], timeKey: 'twoWeeksAgo', color: 'text-yellow-600', dot: 'bg-purple-500', type: 'orders' as const },
    { id: '7', icon: Package, titleKey: 'orderDelivered', descKey: 'orderDeliveredDesc', tags: [{tKey:'orderDelivered',c:'bg-green-100 text-green-700'}], links: [{tKey:'viewOrder'}], timeKey: 'twoWeeksAgo', color: 'text-green-600', dot: 'bg-purple-500', type: 'orders' as const },
    { id: '8', icon: DollarSign, titleKey: 'paymentReceived', descKey: 'paymentReceivedDesc', tags: [{tKey:'payout',c:'bg-blue-100 text-blue-700'}], links: [{tKey:'viewTransaction'}], timeKey: 'threeWeeksAgo', color: 'text-blue-600', dot: 'bg-purple-500', type: 'payouts' as const },
    { id: '9', icon: RefreshCcw, titleKey: 'systemMaintenanceScheduled', descKey: 'systemMaintenanceDesc', tags: [{tKey:'systemUpdate',c:'bg-purple-100 text-purple-700'}], links: [{tKey:'viewPolicy'}], timeKey: 'threeWeeksAgo', color: 'text-purple-600', dot: 'bg-purple-500', type: 'system' as const },
    { id: '10', icon: Truck, titleKey: 'orderOutForDelivery', descKey: 'orderOutForDeliveryDesc', tags: [{tKey:'orderUpdate',c:'bg-orange-100 text-orange-700'}], links: [{tKey:'trackPackage'}], timeKey: 'threeWeeksAgo', color: 'text-orange-600', dot: 'bg-purple-500', type: 'orders' as const },
    { id: '11', icon: AlertTriangle, titleKey: 'productReviewPending', descKey: 'reviewPendingDesc', tags: [{tKey:'reviewRequest',c:'bg-yellow-100 text-yellow-700'}], links: [{tKey:'sendReminder'}], timeKey: 'fourWeeksAgo', color: 'text-yellow-600', dot: 'bg-purple-500', type: 'orders' as const },
    { id: '12', icon: Star, titleKey: 'new4StarReview', descKey: 'new4StarReviewDesc', tags: [{tKey:'review',c:'bg-yellow-100 text-yellow-700'}], links: [{tKey:'viewReview'}], timeKey: 'fourWeeksAgo', color: 'text-yellow-600', dot: 'bg-purple-500', type: 'orders' as const },
    { id: '13', icon: Package, titleKey: 'bulkOrderReceived', descKey: 'bulkOrderDesc', tags: [{tKey:'newOrder',c:'bg-green-100 text-green-700'}], links: [{tKey:'viewOrder'}], timeKey: 'oneMonthAgo', color: 'text-green-600', dot: 'bg-purple-500', type: 'orders' as const },
    { id: '14', icon: DollarSign, titleKey: 'monthlyPayoutProcessed', descKey: 'monthlyPayoutDesc', tags: [{tKey:'payout',c:'bg-blue-100 text-blue-700'}], links: [{tKey:'viewStatement'}], timeKey: 'oneMonthAgo', color: 'text-blue-600', dot: 'bg-purple-500', type: 'payouts' as const },
    { id: '15', icon: RefreshCcw, titleKey: 'newFeatureAvailable', descKey: 'newFeatureDesc', tags: [{tKey:'systemUpdate',c:'bg-purple-100 text-purple-700'}], links: [{tKey:'exploreFeature'}], timeKey: 'oneMonthAgo', color: 'text-purple-600', dot: 'bg-purple-500', type: 'system' as const },
    { id: '16', icon: Truck, titleKey: 'orderReturned', descKey: 'orderReturnedDesc', tags: [{tKey:'return',c:'bg-red-100 text-red-700'}], links: [{tKey:'processRefund'}], timeKey: 'oneMonthAgo', color: 'text-red-600', dot: 'bg-purple-500', type: 'orders' as const },
    { id: '17', icon: AlertTriangle, titleKey: 'inventorySyncCompleted', descKey: 'inventorySyncDesc', tags: [{tKey:'inventory',c:'bg-blue-100 text-blue-700'}], links: [{tKey:'viewInventory'}], timeKey: 'oneMonthAgo', color: 'text-blue-600', dot: 'bg-purple-500', type: 'system' as const },
    { id: '18', icon: Star, titleKey: 'storeRatingImproved', descKey: 'storeRatingDesc', tags: [{tKey:'achievement',c:'bg-green-100 text-green-700'}], links: [{tKey:'viewRatings'}], timeKey: 'twoMonthsAgo', color: 'text-green-600', dot: 'bg-purple-500', type: 'orders' as const },
  ]

  // Filter out cleared notifications and apply active filter
  const filteredNotifications = allNotifications
    .filter((n) => !clearedNotifications.has(n.id))
    .filter((n) => activeFilter === 'all' || n.type === activeFilter)
  
  const displayedNotifications = filteredNotifications.slice(0, displayCount)
  const hasMoreNotifications = displayCount < filteredNotifications.length

  // Count unread notifications (not cleared and not read)
  const unreadCount = allNotifications.filter(
    (n) => !clearedNotifications.has(n.id) && !readNotifications.has(n.id)
  ).length

  const handleLoadMore = async () => {
    setIsLoadingMore(true)
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800))
    setDisplayCount(prev => prev + 6)
    setIsLoadingMore(false)
  }

  // Reset display count when filter changes
  const handleFilterChange = (filter: 'all' | 'orders' | 'payouts' | 'system') => {
    setActiveFilter(filter)
    setDisplayCount(6)
  }

  // Mark all notifications as read
  const handleMarkAllAsRead = () => {
    const allNotificationIds = filteredNotifications.map(n => n.id)
    setReadNotifications(prev => {
      const newSet = new Set(prev)
      allNotificationIds.forEach(id => newSet.add(id))
      return newSet
    })
  }

  // Clear all notifications
  const handleClearAll = () => {
    const allNotificationIds = filteredNotifications.map(n => n.id)
    setClearedNotifications(prev => {
      const newSet = new Set(prev)
      allNotificationIds.forEach(id => newSet.add(id))
      return newSet
    })
    // Reset display count after clearing
    setDisplayCount(6)
  }

  // Handle logout
  const handleLogout = () => {
    // Clear role from localStorage
    setRole(null)
    // Navigate to role-select page
    router.push('/select-role')
    setShowProfileDropdown(false)
  }

  return (
    <header className={`bg-gray-100 px-4 lg:px-6 py-3 fixed lg:static top-0 left-0 right-0 ${onToggleSidebar ? 'z-40' : 'z-50'}`}>
      <div className="flex items-center justify-between w-full gap-4">
        {/* Left side - Mobile Toggle Button and Search Bar */}
        <div className="flex items-center gap-4 flex-1 min-w-0">
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-200 flex-shrink-0"
              aria-label="Toggle sidebar"
            >
              {isSidebarOpen ? <X size={20} className="sm:w-6 sm:h-6" /> : <Menu size={20} className="sm:w-6 sm:h-6" />}
            </button>
          )}
          
          {/* Search Bar - Responsive */}
          {searchExpanded || !onToggleSidebar ? (
            <div className={`w-80 ${onToggleSidebar ? 'ml-3 lg:ml-0' : ''}`}>
              <div className="relative">
                <input
                  type="text"
                  placeholder={t('search')}
                  className="w-full pl-3 pr-9 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
                />
                <Search className="absolute right-2.5 top-1/2 transform -translate-y-1/2 text-gray-500" size={16} />
              </div>
            </div>
          ) : (
            <button
              onClick={() => setSearchExpanded(true)}
              className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-200 flex-shrink-0"
              aria-label="Search"
            >
              <Search size={20} />
            </button>
          )}
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {/* Language Selector - Hidden on very small screens */}
          <div className="relative hidden sm:block">
            <button
              onClick={() => setShowLangDropdown(!showLangDropdown)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 transition-colors"
            >
              <span className="text-lg">{languages.find(l => l.code === language)?.flag || '🇶🇦'}</span>
              <span className="hidden md:inline text-sm font-medium text-gray-700">{languages.find(l => l.code === language)?.name || 'Arabic'}</span>
              <ChevronDown size={16} className="hidden md:inline text-gray-600" />
            </button>

            {/* Dropdown Menu */}
            {showLangDropdown && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setShowLangDropdown(false)}
                />
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
                  <div className="py-1">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => handleLanguageChange(lang)}
                        className={`w-full text-left px-4 py-2 flex items-center space-x-2 hover:bg-gray-50 transition-colors ${
                          language === lang.code ? 'bg-primary-50 text-primary-600' : 'text-gray-700'
                        }`}
                      >
                        <span className="text-lg">{lang.flag}</span>
                        <span className="text-sm font-medium">{lang.name}</span>
                        {language === lang.code && (
                          <span className="ml-auto text-primary-600">✓</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Notifications */}
          <div className="relative">
            <button 
              onClick={() => {
                setShowNotifications(!showNotifications)
                setShowProfileDropdown(false)
              }}
              className="w-10 h-10 rounded-full bg-white border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm relative" 
              aria-label="Notifications"
            >
              <Bell size={20} className="text-gray-600" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                  <span className="text-white text-xs font-bold">{unreadCount > 99 ? '99+' : unreadCount}</span>
                </span>
              )}
            </button>

            {/* Notifications Panel */}
            {showNotifications && (
              <>
                {/* Backdrop */}
                <div 
                  className="fixed inset-0 z-40 bg-black/50 lg:bg-transparent"
                  onClick={() => setShowNotifications(false)}
                />
                
                {/* Notifications Panel - Mobile: Full Screen, Desktop: Dropdown */}
                <div className="fixed inset-0 lg:absolute lg:inset-auto lg:right-0 lg:top-full lg:mt-2 z-50 lg:z-50 bg-white lg:rounded-lg lg:shadow-xl lg:border lg:border-gray-200 lg:w-[420px] lg:max-h-[600px] flex flex-col">
                  {/* Header */}
                  <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white lg:bg-white sticky top-0 z-10">
                    <h2 className="text-lg font-semibold text-gray-900">{t('notifications')}</h2>
                    <button
                      onClick={() => setShowNotifications(false)}
                      className="lg:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
                      aria-label="Close notifications"
                    >
                      <X size={20} className="text-gray-600" />
                    </button>
                  </div>

                  {/* Filters */}
                  <div className="p-3 border-b border-gray-200 bg-gray-50 sticky top-[57px] z-10">
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
                      <button 
                        onClick={() => handleFilterChange('all')}
                        className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${
                          activeFilter === 'all' 
                            ? 'bg-[#5C50AE] text-white' 
                            : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                        }`}
                      >
                        {t('all')}
                      </button>
                      <button 
                        onClick={() => handleFilterChange('orders')}
                        className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${
                          activeFilter === 'orders' 
                            ? 'bg-[#5C50AE] text-white' 
                            : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                        }`}
                      >
                        {t('orders')}
                      </button>
                      <button 
                        onClick={() => handleFilterChange('payouts')}
                        className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${
                          activeFilter === 'payouts' 
                            ? 'bg-[#5C50AE] text-white' 
                            : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                        }`}
                      >
                        {t('payouts')}
                      </button>
                      <button 
                        onClick={() => handleFilterChange('system')}
                        className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${
                          activeFilter === 'system' 
                            ? 'bg-[#5C50AE] text-white' 
                            : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                        }`}
                      >
                        {t('systemUpdates')}
                      </button>
                    </div>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-200">
                      <button 
                        onClick={handleMarkAllAsRead}
                        disabled={filteredNotifications.length === 0 || filteredNotifications.every(n => readNotifications.has(n.id))}
                        className="text-xs text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {t('markAllAsRead')}
                      </button>
                      <span className="h-3 w-px bg-gray-300" />
                      <button 
                        onClick={handleClearAll}
                        disabled={filteredNotifications.length === 0}
                        className="text-xs text-red-500 hover:text-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {t('clearAll')}
                      </button>
                    </div>
                  </div>

                  {/* Notifications List */}
                  <div className="flex-1 overflow-y-auto">
                    {displayedNotifications.length > 0 ? (
                      displayedNotifications.map((n, idx) => {
                        const isRead = readNotifications.has(n.id)
                        return (
                          <div key={n.id} className={`flex items-start gap-3 p-4 hover:bg-gray-50 transition-colors ${idx !== displayedNotifications.length - 1 ? 'border-b border-gray-100' : ''} ${isRead ? 'opacity-75' : ''}`}>
                            <div className={`w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 ${n.color}`}>
                              <n.icon size={18} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <h3 className={`text-sm font-semibold ${isRead ? 'text-gray-600' : 'text-gray-900'}`}>{t(n.titleKey)}</h3>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                  <span className="text-[11px] text-gray-500 whitespace-nowrap">{t(n.timeKey)}</span>
                                  {!isRead && <span className={`h-1.5 w-1.5 rounded-full ${n.dot}`} />}
                                </div>
                              </div>
                            <p className="text-sm text-gray-600 mt-1 break-words">{t(n.descKey)}</p>
                            <div className="flex items-center gap-2 mt-2 flex-wrap">
                              {n.tags.map((tag, idx) => (
                                <span key={idx} className={`px-2 py-0.5 rounded-md text-[11px] ${tag.c} border border-gray-200`}>{t(tag.tKey)}</span>
                              ))}
                              {n.links.map((link, idx) => (
                                <button key={idx} className="text-xs text-orange-600 hover:underline whitespace-nowrap">{t(link.tKey)}</button>
                              ))}
                            </div>
                          </div>
                        </div>
                      )
                    })
                    ) : (
                      <div className="p-8 text-center">
                        <Bell size={48} className="mx-auto text-gray-300 mb-3" />
                        <p className="text-sm text-gray-500">{t('noNotificationsFound')}</p>
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  {hasMoreNotifications && (
                    <div className="p-4 border-t border-gray-200 bg-white sticky bottom-0">
                      <button 
                        onClick={handleLoadMore}
                        disabled={isLoadingMore}
                        className="w-full px-4 py-2 text-sm rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isLoadingMore ? (
                          <>
                            <Loader2 size={16} className="animate-spin" />
                            {t('loading') || (language === 'ar' ? 'جاري التحميل...' : 'Loading...')}
                          </>
                        ) : (
                          <>
                            <Bell size={16} />
                            {t('loadMoreNotifications')}
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* User Profile */}
          <div className="relative">
            <button
              onClick={() => {
                setShowProfileDropdown(!showProfileDropdown)
                setShowNotifications(false)
              }}
              className="cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-full"
              aria-label="User profile menu"
            >
            <img 
              src="https://ui-avatars.com/api/?name=abdulamin&size=40&background=random" 
              alt="User" 
                className="w-10 h-10 rounded-full object-cover border-2 border-gray-300 shadow-sm hover:border-primary-500 transition-colors"
              />
            </button>

            {/* Profile Dropdown Menu */}
            {showProfileDropdown && (
              <>
                {/* Backdrop */}
                <div 
                  className="fixed inset-0 z-40 bg-black/50 lg:bg-transparent"
                  onClick={() => setShowProfileDropdown(false)}
                />
                
                {/* Profile Dropdown - Mobile: Full Screen, Desktop: Dropdown */}
                <div className="fixed inset-0 lg:absolute lg:inset-auto lg:right-0 lg:top-full lg:mt-2 z-50 lg:z-50 bg-white lg:rounded-lg lg:shadow-xl lg:border lg:border-gray-200 lg:w-64 flex flex-col">
                  {/* Header */}
                  <div className="flex items-center gap-3 p-4 border-b border-gray-200 bg-white lg:bg-white">
                    <img 
                      src="https://ui-avatars.com/api/?name=abdulamin&size=48&background=random" 
                      alt="User" 
                      className="w-12 h-12 rounded-full object-cover border-2 border-gray-300"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-gray-900 truncate">Abdul Amin</h3>
                      <p className="text-xs text-gray-500 truncate">admin@example.com</p>
                    </div>
                    <button
                      onClick={() => setShowProfileDropdown(false)}
                      className="lg:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
                      aria-label="Close profile menu"
                    >
                      <X size={20} className="text-gray-600" />
                    </button>
                  </div>

                  {/* Menu Items */}
                  <div className="flex-1 overflow-y-auto py-2">
                    <Link
                      href="/settings/profile"
                      onClick={() => setShowProfileDropdown(false)}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-gray-700"
                    >
                      <User size={18} className="text-gray-500" />
                      <span className="text-sm font-medium">{language === 'ar' ? 'ملفي الشخصي' : 'My Profile'}</span>
                    </Link>
                    
                    <Link
                      href="/settings/store"
                      onClick={() => setShowProfileDropdown(false)}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-gray-700"
                    >
                      <Settings size={18} className="text-gray-500" />
                      <span className="text-sm font-medium">{t('settings')}</span>
                    </Link>
                    
                    <div className="border-t border-gray-200 my-2" />
                    
                    <button
                      onClick={() => {
                        setShowProfileDropdown(false)
                        // Add help/support action
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-gray-700"
                    >
                      <HelpCircle size={18} className="text-gray-500" />
                      <span className="text-sm font-medium">{language === 'ar' ? 'المساعدة والدعم' : 'Help & Support'}</span>
                    </button>
                    
                    <div className="border-t border-gray-200 my-2" />
                    
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 transition-colors text-red-600"
                    >
                      <LogOut size={18} />
                      <span className="text-sm font-medium">{t('logout')}</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
