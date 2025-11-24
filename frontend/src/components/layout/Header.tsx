import { Search, Bell, ChevronDown, Menu, X, Package, Truck, Star, AlertTriangle, RefreshCcw, DollarSign, Loader2, User, Settings, LogOut, HelpCircle, FileText, Users, MessageCircle, Wallet, CreditCard, Navigation } from 'lucide-react'
import { useState, useMemo, useEffect, useRef } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { useRole } from '@/contexts/RoleContext'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'

interface HeaderProps {
  onToggleSidebar?: () => void
  isSidebarOpen?: boolean
}

export default function Header({ onToggleSidebar, isSidebarOpen = false }: HeaderProps) {
  const { language, changeLanguage, t } = useLanguage()
  const { setRole } = useRole()
  const navigate = useNavigate()
  const [showLangDropdown, setShowLangDropdown] = useState(false)
  const [searchExpanded, setSearchExpanded] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfileDropdown, setShowProfileDropdown] = useState(false)
  const [activeFilter, setActiveFilter] = useState<'all' | 'orders' | 'payouts' | 'system'>('all')
  const [displayCount, setDisplayCount] = useState(6)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [readNotifications, setReadNotifications] = useState<Set<string>>(new Set())
  const [clearedNotifications, setClearedNotifications] = useState<Set<string>>(new Set())
  const [searchQuery, setSearchQuery] = useState('')
  const [showSearchResults, setShowSearchResults] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const searchResultsRef = useRef<HTMLDivElement>(null)

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
    navigate('/select-role')
    setShowProfileDropdown(false)
  }

  // Handle notification link clicks
  const handleNotificationLinkClick = (linkKey: string, notification: typeof allNotifications[0]) => {
    setShowNotifications(false)
    
    switch(linkKey) {
      case 'viewOrder':
        // Extract order ID from notification description or use a default
        // For now, navigate to orders page - in real app, extract ID from notification data
        navigate('/orders')
        break
      case 'trackPackage':
        // Navigate to tracking page - in real app, extract order ID from notification
        // For demo, using a sample order ID
        navigate('/orders/10198/tracking')
        break
      case 'restockNow':
        // Navigate to products page
        navigate('/products')
        break
      case 'viewTransaction':
        // Navigate to transactions page
        navigate('/transactions/history')
        break
      case 'viewPolicy':
        // Navigate to settings page
        navigate('/settings/profile')
        break
      case 'viewReview':
        // Navigate to products page (reviews are typically on product pages)
        navigate('/products')
        break
      case 'viewStatement':
        // Navigate to earnings/withdrawals page
        navigate('/transactions/earnings/withdrawals')
        break
      case 'viewInventory':
        // Navigate to products page
        navigate('/products')
        break
      case 'viewRatings':
        // Navigate to products page
        navigate('/products')
        break
      case 'sendReminder':
        // Navigate to chat or orders page
        navigate('/chat')
        break
      case 'processRefund':
        // Navigate to orders page
        navigate('/orders')
        break
      case 'exploreFeature':
        // Navigate to dashboard
        navigate('/dashboard')
        break
      default:
        // Default to orders page
        navigate('/orders')
    }
  }

  // Comprehensive search data - in a real app, this would come from a context or API
  const searchableProducts = [
    { id: 1, name: 'Apple AirPods Pro (2nd)', sku: 'WH-001', category: 'Electronics', price: 200 },
    { id: 2, name: 'Premium T-Shirt', sku: 'TS-002', category: 'Clothing', price: 200 },
    { id: 3, name: 'Running Shoes', sku: 'YM-003', category: 'Sports', price: 200 },
    { id: 4, name: 'Yoga Mat Pro', sku: 'RS-004', category: 'Sports', price: 200 },
    { id: 5, name: 'Coffee Mug Set', sku: 'CM-005', category: 'Home & Garden', price: 200 },
  ]

  const searchableOrders = [
    { id: 1, orderNo: 'ORD-1562792771583', customer: 'Sarah Johnson', amount: 200, status: 'Pending' },
    { id: 2, orderNo: 'ORD-1562792771584', customer: 'Mike Chen', amount: 200, status: 'Completed' },
    { id: 3, orderNo: 'ORD-1562792771585', customer: 'Emma Davis', amount: 200, status: 'Cancelled' },
    { id: 4, orderNo: 'ORD-1562792771586', customer: 'John Smith', amount: 200, status: 'Refunded' },
    { id: 5, orderNo: 'ORD-1562792771587', customer: 'Lisa Brown', amount: 200, status: 'Pending' },
  ]

  const searchableUsers = [
    { id: 1, name: 'Touseeef Ahmed', username: 'Touseeef', email: 'alice.johnson@example.com', phone: '+1 234 567 8900', status: 'Verified' },
    { id: 2, name: 'John Doe', username: 'johndoe', email: 'john.doe@example.com', phone: '+1 234 567 8901', status: 'Verified' },
    { id: 3, name: 'Jane Smith', username: 'janesmith', email: 'jane.smith@example.com', phone: '+1 234 567 8902', status: 'Pending' },
    { id: 4, name: 'Mike Johnson', username: 'mikejohnson', email: 'mike.j@example.com', phone: '+1 234 567 8903', status: 'Verified' },
  ]

  const searchableTransactions = [
    { id: 'TXN001234', orderId: 'ORD5678', customer: 'John Smith', type: 'Earning', amount: 150.00, status: 'Completed', date: 'Dec 15, 2024' },
    { id: 'TXN001235', orderId: 'ORD5679', customer: 'Sarah Johnson', type: 'Refund', amount: 75.50, status: 'Pending', date: 'Dec 14, 2024' },
    { id: 'TXN001236', orderId: null, customer: null, type: 'Withdrawal', amount: 500.00, status: 'Completed', date: 'Dec 13, 2024' },
    { id: 'TXN001237', orderId: 'ORD5680', customer: 'Mike Davis', type: 'Earning', amount: 220.00, status: 'Failed', date: 'Dec 12, 2024' },
    { id: 'TXN001238', orderId: 'ORD5681', customer: 'Emma Wilson', type: 'Earning', amount: 89.99, status: 'Completed', date: 'Dec 11, 2024' },
  ]

  const searchableWithdrawals = [
    { id: 'WD-2024-001', date: 'Dec 15, 2024', amount: 2500, method: 'PayPal', status: 'Pending' },
    { id: 'WD-2024-002', date: 'Dec 10, 2024', amount: 1800, method: 'Bank Transfer', status: 'Completed' },
    { id: 'WD-2024-003', date: 'Dec 5, 2024', amount: 3200, method: 'Stripe', status: 'Completed' },
    { id: 'WD-2024-004', date: 'Nov 28, 2024', amount: 900, method: 'PayPal', status: 'Rejected' },
  ]

  const searchableChats = [
    { id: '1', name: 'Ali Raza', type: 'customer', orderId: '#1023', lastMessage: 'Hi! I placed order #1023 yesterday' },
    { id: '2', name: 'Admin Support', type: 'support', orderId: null, lastMessage: 'Your request is under review' },
    { id: '3', name: 'Sarah khan', type: 'customer', orderId: null, lastMessage: 'Thanks for the quick delivery!' },
    { id: '4', name: 'Ahmed Ali', type: 'customer', orderId: '#9837', lastMessage: 'Can you confirm order #9837?' },
  ]

  const searchablePages = [
    { name: 'Dashboard', path: '/dashboard', description: 'Main dashboard with metrics and analytics' },
    { name: 'Products', path: '/products', description: 'Manage all products' },
    { name: 'Orders', path: '/orders', description: 'View and manage orders' },
    { name: 'Transactions', path: '/transactions/history', description: 'Transaction history' },
    { name: 'Earnings', path: '/transactions/earnings', description: 'View earnings and revenue' },
    { name: 'Withdrawals', path: '/transactions/earnings/withdrawals', description: 'Manage withdrawal requests' },
    { name: 'Chat', path: '/chat', description: 'Customer support chat' },
    { name: 'Analytics', path: '/analytics/sales-overview', description: 'Sales analytics and reports' },
    { name: 'Settings', path: '/settings/profile', description: 'Account and store settings' },
    { name: 'Sub-Admin Users', path: '/sub-admin/users', description: 'Manage sub-admin users' },
  ]

  // Comprehensive search functionality - searches through everything
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return { 
      products: [], 
      orders: [], 
      users: [], 
      transactions: [], 
      withdrawals: [], 
      chats: [], 
      pages: [] 
    }

    const query = searchQuery.toLowerCase().trim()
    
    // Search Products
    const matchedProducts = searchableProducts.filter(product => 
      product.name.toLowerCase().includes(query) ||
      product.sku.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query) ||
      product.price.toString().includes(query)
    ).slice(0, 5)

    // Search Orders
    const matchedOrders = searchableOrders.filter(order =>
      order.orderNo.toLowerCase().includes(query) ||
      order.customer.toLowerCase().includes(query) ||
      order.status.toLowerCase().includes(query) ||
      order.amount.toString().includes(query)
    ).slice(0, 5)

    // Search Users/Customers
    const matchedUsers = searchableUsers.filter(user =>
      user.name.toLowerCase().includes(query) ||
      user.username.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      user.phone.includes(query) ||
      user.status.toLowerCase().includes(query)
    ).slice(0, 5)

    // Search Transactions
    const matchedTransactions = searchableTransactions.filter(transaction =>
      transaction.id.toLowerCase().includes(query) ||
      (transaction.orderId && transaction.orderId.toLowerCase().includes(query)) ||
      (transaction.customer && transaction.customer.toLowerCase().includes(query)) ||
      transaction.type.toLowerCase().includes(query) ||
      transaction.status.toLowerCase().includes(query) ||
      transaction.amount.toString().includes(query) ||
      transaction.date.toLowerCase().includes(query)
    ).slice(0, 5)

    // Search Withdrawals
    const matchedWithdrawals = searchableWithdrawals.filter(withdrawal =>
      withdrawal.id.toLowerCase().includes(query) ||
      withdrawal.method.toLowerCase().includes(query) ||
      withdrawal.status.toLowerCase().includes(query) ||
      withdrawal.amount.toString().includes(query) ||
      withdrawal.date.toLowerCase().includes(query)
    ).slice(0, 5)

    // Search Chats
    const matchedChats = searchableChats.filter(chat =>
      chat.name.toLowerCase().includes(query) ||
      chat.type.toLowerCase().includes(query) ||
      (chat.orderId && chat.orderId.toLowerCase().includes(query)) ||
      chat.lastMessage.toLowerCase().includes(query)
    ).slice(0, 5)

    // Search Pages/Navigation
    const matchedPages = searchablePages.filter(page =>
      page.name.toLowerCase().includes(query) ||
      page.path.toLowerCase().includes(query) ||
      page.description.toLowerCase().includes(query)
    ).slice(0, 5)

    return { 
      products: matchedProducts, 
      orders: matchedOrders,
      users: matchedUsers,
      transactions: matchedTransactions,
      withdrawals: matchedWithdrawals,
      chats: matchedChats,
      pages: matchedPages
    }
  }, [searchQuery])

  const hasSearchResults = 
    searchResults.products.length > 0 || 
    searchResults.orders.length > 0 ||
    searchResults.users.length > 0 ||
    searchResults.transactions.length > 0 ||
    searchResults.withdrawals.length > 0 ||
    searchResults.chats.length > 0 ||
    searchResults.pages.length > 0

  const totalResults = 
    searchResults.products.length + 
    searchResults.orders.length +
    searchResults.users.length +
    searchResults.transactions.length +
    searchResults.withdrawals.length +
    searchResults.chats.length +
    searchResults.pages.length

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    setShowSearchResults(e.target.value.trim().length > 0)
  }

  // Handle search result click
  const handleSearchResultClick = (type: string, id: string | number, path?: string) => {
    if (path) {
      navigate(path)
    } else if (type === 'product') {
      navigate(`/products/${id}`)
    } else if (type === 'order') {
      navigate(`/orders/${id}`)
    } else if (type === 'user') {
      navigate(`/sub-admin/users/${id}`)
    } else if (type === 'transaction') {
      navigate(`/transactions/${id}`)
    } else if (type === 'withdrawal') {
      navigate(`/transactions/earnings/withdrawals/${id}`)
    } else if (type === 'chat') {
      navigate(`/chat`)
    } else if (type === 'page') {
      navigate(path || '/')
    }
    setSearchQuery('')
    setShowSearchResults(false)
    searchInputRef.current?.blur()
  }

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchResultsRef.current &&
        !searchResultsRef.current.contains(event.target as Node) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target as Node)
      ) {
        setShowSearchResults(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Handle search input focus
  const handleSearchFocus = () => {
    if (searchQuery.trim().length > 0) {
      setShowSearchResults(true)
    }
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
              <div className="relative" ref={searchResultsRef}>
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onFocus={handleSearchFocus}
                  placeholder={t('search') || 'Search products, orders...'}
                  className="w-full pl-3 pr-9 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
                />
                <Search className="absolute right-2.5 top-1/2 transform -translate-y-1/2 text-gray-500" size={16} />
                
                {/* Search Results Dropdown */}
                {showSearchResults && searchQuery.trim().length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-[600px] overflow-y-auto">
                    {hasSearchResults ? (
                      <div className="py-2">
                        {/* Products Section */}
                        {searchResults.products.length > 0 && (
                          <div className="mb-2">
                            <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide border-b border-gray-100">
                              {t('products') || 'Products'} ({searchResults.products.length})
                            </div>
                            {searchResults.products.map((product) => (
                              <button
                                key={product.id}
                                onClick={() => handleSearchResultClick('product', product.id)}
                                className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center gap-3 border-b border-gray-50 last:border-b-0"
                              >
                                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                  <Package size={18} className="text-primary-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="text-sm font-medium text-gray-900 truncate">{product.name}</div>
                                  <div className="text-xs text-gray-500 mt-0.5">
                                    {product.sku} • {product.category}
                                  </div>
                                </div>
                                <div className="text-sm font-semibold text-gray-700 flex-shrink-0">
                                  ${product.price}
                                </div>
                              </button>
                            ))}
                          </div>
                        )}

                        {/* Orders Section */}
                        {searchResults.orders.length > 0 && (
                          <div className="mb-2">
                            <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide border-b border-gray-100">
                              {t('orders') || 'Orders'} ({searchResults.orders.length})
                            </div>
                            {searchResults.orders.map((order) => (
                              <button
                                key={order.id}
                                onClick={() => handleSearchResultClick('order', order.id)}
                                className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center gap-3 border-b border-gray-50 last:border-b-0"
                              >
                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                  <FileText size={18} className="text-blue-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="text-sm font-medium text-gray-900 truncate">{order.orderNo}</div>
                                  <div className="text-xs text-gray-500 mt-0.5">
                                    {order.customer} • {order.status}
                                  </div>
                                </div>
                                <div className="text-sm font-semibold text-gray-700 flex-shrink-0">
                                  ${order.amount}
                                </div>
                              </button>
                            ))}
                          </div>
                        )}

                        {/* Users Section */}
                        {searchResults.users.length > 0 && (
                          <div className="mb-2">
                            <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide border-b border-gray-100">
                              {t('users') || 'Users'} ({searchResults.users.length})
                            </div>
                            {searchResults.users.map((user) => (
                              <button
                                key={user.id}
                                onClick={() => handleSearchResultClick('user', user.id)}
                                className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center gap-3 border-b border-gray-50 last:border-b-0"
                              >
                                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                  <Users size={18} className="text-green-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="text-sm font-medium text-gray-900 truncate">{user.name}</div>
                                  <div className="text-xs text-gray-500 mt-0.5">
                                    {user.email} • {user.status}
                                  </div>
                                </div>
                              </button>
                            ))}
                          </div>
                        )}

                        {/* Transactions Section */}
                        {searchResults.transactions.length > 0 && (
                          <div className="mb-2">
                            <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide border-b border-gray-100">
                              {t('transactions') || 'Transactions'} ({searchResults.transactions.length})
                            </div>
                            {searchResults.transactions.map((transaction) => (
                              <button
                                key={transaction.id}
                                onClick={() => handleSearchResultClick('transaction', transaction.id)}
                                className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center gap-3 border-b border-gray-50 last:border-b-0"
                              >
                                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                  <CreditCard size={18} className="text-purple-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="text-sm font-medium text-gray-900 truncate">{transaction.id}</div>
                                  <div className="text-xs text-gray-500 mt-0.5">
                                    {transaction.type} • {transaction.status} {transaction.customer && `• ${transaction.customer}`}
                                  </div>
                                </div>
                                <div className="text-sm font-semibold text-gray-700 flex-shrink-0">
                                  ${transaction.amount}
                                </div>
                              </button>
                            ))}
                          </div>
                        )}

                        {/* Withdrawals Section */}
                        {searchResults.withdrawals.length > 0 && (
                          <div className="mb-2">
                            <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide border-b border-gray-100">
                              {t('withdrawals') || 'Withdrawals'} ({searchResults.withdrawals.length})
                            </div>
                            {searchResults.withdrawals.map((withdrawal) => (
                              <button
                                key={withdrawal.id}
                                onClick={() => handleSearchResultClick('withdrawal', withdrawal.id)}
                                className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center gap-3 border-b border-gray-50 last:border-b-0"
                              >
                                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                  <Wallet size={18} className="text-orange-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="text-sm font-medium text-gray-900 truncate">{withdrawal.id}</div>
                                  <div className="text-xs text-gray-500 mt-0.5">
                                    {withdrawal.method} • {withdrawal.status} • {withdrawal.date}
                                  </div>
                                </div>
                                <div className="text-sm font-semibold text-gray-700 flex-shrink-0">
                                  ${withdrawal.amount}
                                </div>
                              </button>
                            ))}
                          </div>
                        )}

                        {/* Chats Section */}
                        {searchResults.chats.length > 0 && (
                          <div className="mb-2">
                            <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide border-b border-gray-100">
                              {t('chats') || 'Chats'} ({searchResults.chats.length})
                            </div>
                            {searchResults.chats.map((chat) => (
                              <button
                                key={chat.id}
                                onClick={() => handleSearchResultClick('chat', chat.id)}
                                className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center gap-3 border-b border-gray-50 last:border-b-0"
                              >
                                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                  <MessageCircle size={18} className="text-indigo-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="text-sm font-medium text-gray-900 truncate">{chat.name}</div>
                                  <div className="text-xs text-gray-500 mt-0.5 truncate">
                                    {chat.orderId || chat.type} • {chat.lastMessage}
                                  </div>
                                </div>
                              </button>
                            ))}
                          </div>
                        )}

                        {/* Pages/Navigation Section */}
                        {searchResults.pages.length > 0 && (
                          <div className="mb-2">
                            <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide border-b border-gray-100">
                              {t('pages') || 'Pages'} ({searchResults.pages.length})
                            </div>
                            {searchResults.pages.map((page, index) => (
                              <button
                                key={index}
                                onClick={() => handleSearchResultClick('page', index, page.path)}
                                className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center gap-3 border-b border-gray-50 last:border-b-0"
                              >
                                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                  <Navigation size={18} className="text-gray-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="text-sm font-medium text-gray-900 truncate">{page.name}</div>
                                  <div className="text-xs text-gray-500 mt-0.5 truncate">
                                    {page.description}
                                  </div>
                                </div>
                              </button>
                            ))}
                          </div>
                        )}

                        {/* View All Results */}
                        {totalResults > 0 && (
                          <div className="px-4 py-2 border-t border-gray-100 bg-gray-50">
                            <button
                              onClick={() => {
                                navigate(`/products?search=${encodeURIComponent(searchQuery)}`)
                                setSearchQuery('')
                                setShowSearchResults(false)
                              }}
                              className="w-full text-sm text-primary-600 hover:text-primary-700 font-medium text-center py-2"
                            >
                              {t('viewAllResults') || `View all ${totalResults} results`}
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="px-4 py-8 text-center">
                        <Search size={32} className="mx-auto text-gray-300 mb-2" />
                        <p className="text-sm text-gray-500">{t('noResultsFound') || 'No results found'}</p>
                        <p className="text-xs text-gray-400 mt-1">Try searching for products, orders, users, transactions, or pages</p>
                      </div>
                    )}
                  </div>
                )}
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
                                <button 
                                  key={idx} 
                                  onClick={() => handleNotificationLinkClick(link.tKey, n)}
                                  className="text-xs text-orange-600 hover:underline whitespace-nowrap cursor-pointer"
                                >
                                  {t(link.tKey)}
                                </button>
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
                      to="/settings/profile"
                      onClick={() => setShowProfileDropdown(false)}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-gray-700"
                    >
                      <User size={18} className="text-gray-500" />
                      <span className="text-sm font-medium">{language === 'ar' ? 'ملفي الشخصي' : 'My Profile'}</span>
                    </Link>
                    
                    <Link
                      to="/settings/store"
                      onClick={() => setShowProfileDropdown(false)}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-gray-700"
                    >
                      <Settings size={18} className="text-gray-500" />
                      <span className="text-sm font-medium">{t('settings')}</span>
                    </Link>
                    
                    <div className="border-t border-gray-200 my-2" />
                    
                    <Link
                      to="/help-support"
                      onClick={() => setShowProfileDropdown(false)}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-gray-700"
                    >
                      <HelpCircle size={18} className="text-gray-500" />
                      <span className="text-sm font-medium">{language === 'ar' ? 'المساعدة والدعم' : 'Help & Support'}</span>
                    </Link>
                    
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
