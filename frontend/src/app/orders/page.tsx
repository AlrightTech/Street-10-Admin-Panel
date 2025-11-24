import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'
import { useState, useEffect, useMemo } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Menu, Search, Filter, MoreVertical, ChevronLeft, ChevronRight, Eye, Edit, X, RefreshCw, FileText, Trash2 } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { ButtonLoader } from '@/components/ui/Loader'
import SuccessModal from '@/components/ui/SuccessModal'
import ErrorModal from '@/components/ui/ErrorModal'
import ConfirmModal from '@/components/ui/ConfirmModal'

// TypeScript interfaces
interface OrderRow {
  id: number
  orderNo: string
  placedOn: string
  type: string
  items: number
  amount: number
  paymentMethod: string
  status: string
}

export default function OrdersPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { t, language, translateOrder } = useLanguage()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  // Initialize activeTab from location state if available
  const [activeTab, setActiveTab] = useState((location.state as any)?.activeTab || 'all')
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null)
  const [loadingOrderId, setLoadingOrderId] = useState<number | null>(null)
  
  // Modal states
  const [successModal, setSuccessModal] = useState({ isOpen: false, message: '' })
  const [errorModal, setErrorModal] = useState({ isOpen: false, message: '' })
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, message: '', onConfirm: () => {}, type: 'cancel' as 'cancel' | 'refund' | 'delete' })
  const [rawOrders, setRawOrders] = useState([
    { id: 1, orderNo: 'ORD-1562792771583', placedOn: '26/04/2020', type: 'Subscription', items: 5, amount: 200, paymentMethod: 'Online', status: 'Pending' },
    { id: 2, orderNo: 'ORD-1562792771584', placedOn: '26/04/2020', type: 'Order', items: 5, amount: 200, paymentMethod: 'COD', status: 'Completed' },
    { id: 3, orderNo: 'ORD-1562792771585', placedOn: '27/02/2020', type: 'Subscription', items: 5, amount: 200, paymentMethod: 'Wallet', status: 'Cancelled' },
    { id: 4, orderNo: 'ORD-1562792771586', placedOn: '26/04/2020', type: 'Order', items: 5, amount: 200, paymentMethod: 'Online', status: 'Refunded' },
    { id: 5, orderNo: 'ORD-1562792771587', placedOn: '27/02/2020', type: 'Subscription', items: 5, amount: 200, paymentMethod: 'COD', status: 'Pending' },
  ])

  // Automatically translate orders
  const orders = useMemo(() => {
    return rawOrders.map(order => translateOrder(order))
  }, [rawOrders, translateOrder, language])

  const allOrders = orders

  // Filter orders based on active tab
  const getFilteredByTab = () => {
    if (activeTab === 'all') return allOrders
    return allOrders.filter(order => {
      const statusMap: { [key: string]: string } = {
        'pending': 'Pending',
        'completed': 'Completed',
        'cancelled': 'Cancelled',
        'refunded': 'Refunded'
      }
      return order.status === statusMap[activeTab]
    })
  }

  // Filter orders based on search query
  const filteredOrders = getFilteredByTab().filter(order => {
    if (!searchQuery.trim()) return true
    return order.orderNo.toLowerCase().includes(searchQuery.toLowerCase())
  })

  // Pagination
  const itemsPerPage = 5
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedOrders = filteredOrders.slice(startIndex, endIndex)

  // Get visible pages for pagination
  const getVisiblePages = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }
    if (currentPage <= 3) {
      return [1, 2, 3, null, totalPages - 1, totalPages]
    } else if (currentPage >= totalPages - 2) {
      return [1, 2, null, totalPages - 2, totalPages - 1, totalPages]
    } else {
      return [1, 2, null, currentPage - 1, currentPage, currentPage + 1, null, totalPages - 1, totalPages]
    }
  }

  const visiblePages = getVisiblePages()

  // Counts based on all orders (not filtered)
  const allCount = allOrders.length
  const pendingCount = allOrders.filter(o => o.status === 'Pending').length
  const completedCount = allOrders.filter(o => o.status === 'Completed').length
  const cancelledCount = allOrders.filter(o => o.status === 'Cancelled').length
  const refundedCount = allOrders.filter(o => o.status === 'Refunded').length

  // Handle tab change - reset to page 1
  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    setCurrentPage(1)
    // Clear location state after using it
    if (location.state) {
      navigate(location.pathname, { replace: true, state: {} })
    }
  }

  // Set initial tab from location state on mount
  useEffect(() => {
    if ((location.state as any)?.activeTab) {
      setActiveTab((location.state as any).activeTab)
      setCurrentPage(1)
    }
  }, [location.state])

  // Handle search change - reset to page 1
  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    setCurrentPage(1)
  }

  // Reset to page 1 if current page exceeds total pages after filtering
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1)
    }
  }, [totalPages, currentPage])

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Pending': return 'bg-yellow-500 text-white'
      case 'Completed': return 'bg-green-500 text-white'
      case 'Cancelled': return 'bg-red-500 text-white'
      case 'Refunded': return 'bg-blue-500 text-white'
      default: return 'bg-gray-500 text-white'
    }
  }

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'Pending': return { bg: 'bg-yellow-100', text: 'text-yellow-700' }
      case 'Completed': return { bg: 'bg-green-100', text: 'text-green-700' }
      case 'Cancelled': return { bg: 'bg-red-100', text: 'text-red-700' }
      case 'Refunded': return { bg: 'bg-blue-100', text: 'text-blue-700' }
      default: return { bg: 'bg-gray-100', text: 'text-gray-700' }
    }
  }

  const handleViewOrder = (orderId: number) => {
    navigate(`/orders/${orderId}`)
  }

  const handleViewDetails = (orderId: number) => {
    setOpenDropdownId(null)
    navigate(`/orders/${orderId}`)
  }

  const handleEditOrder = (orderId: number) => {
    setOpenDropdownId(null)
    // Navigate to order details page where user can edit
    navigate(`/orders/${orderId}`)
  }

  const handleCancelOrder = async (orderId: number) => {
    setOpenDropdownId(null)
    setConfirmModal({
      isOpen: true,
      message: t('confirmCancelOrder'),
      type: 'cancel',
      onConfirm: async () => {
        setLoadingOrderId(orderId)
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 500))
          
          // Update order status to Cancelled
          setRawOrders(prevOrders => 
            prevOrders.map(order => 
              order.id === orderId 
                ? { ...order, status: 'Cancelled' as const }
                : order
            )
          )
          
          // Show success message
          setSuccessModal({ isOpen: true, message: t('orderCancelledSuccess') })
        
        // Reset to page 1 if current page becomes empty
        const updatedOrders = rawOrders.map(order => 
          order.id === orderId ? { ...order, status: 'Cancelled' as const } : order
        )
        const filtered = updatedOrders.filter(order => {
          if (activeTab === 'all') return true
          const statusMap: { [key: string]: string } = {
            'pending': 'Pending',
            'completed': 'Completed',
            'cancelled': 'Cancelled',
            'refunded': 'Refunded'
          }
          return order.status === statusMap[activeTab]
        })
        if (currentPage > Math.ceil(filtered.length / 5) && filtered.length > 0) {
          setCurrentPage(1)
        }
        } catch (error) {
          console.error('Error cancelling order:', error)
          setErrorModal({ isOpen: true, message: t('orderCancelledFailed') })
        } finally {
          setLoadingOrderId(null)
        }
      }
    })
  }

  const handleRefundOrder = async (orderId: number) => {
    setOpenDropdownId(null)
    setConfirmModal({
      isOpen: true,
      message: t('confirmRefundOrder'),
      type: 'refund',
      onConfirm: async () => {
        setLoadingOrderId(orderId)
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 500))
          
          // Update order status to Refunded
          setRawOrders(prevOrders => 
            prevOrders.map(order => 
              order.id === orderId 
                ? { ...order, status: 'Refunded' as const }
                : order
            )
          )
          
          // Show success message
          setSuccessModal({ isOpen: true, message: t('refundProcessedSuccess') })
        
        // Reset to page 1 if current page becomes empty
        const updatedOrders = rawOrders.map(order => 
          order.id === orderId ? { ...order, status: 'Refunded' as const } : order
        )
        const filtered = updatedOrders.filter(order => {
          if (activeTab === 'all') return true
          const statusMap: { [key: string]: string } = {
            'pending': 'Pending',
            'completed': 'Completed',
            'cancelled': 'Cancelled',
            'refunded': 'Refunded'
          }
          return order.status === statusMap[activeTab]
        })
        if (currentPage > Math.ceil(filtered.length / 5) && filtered.length > 0) {
          setCurrentPage(1)
        }
        } catch (error) {
          console.error('Error processing refund:', error)
          setErrorModal({ isOpen: true, message: t('refundProcessedFailed') })
        } finally {
          setLoadingOrderId(null)
        }
      }
    })
  }

  const handleDownloadInvoice = (orderId: number) => {
    setOpenDropdownId(null)
    navigate(`/orders/${orderId}/invoice`)
  }

  const handleDeleteOrder = async (orderId: number) => {
    setOpenDropdownId(null)
    setConfirmModal({
      isOpen: true,
      message: t('confirmDeleteOrder'),
      type: 'delete',
      onConfirm: async () => {
        setLoadingOrderId(orderId)
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 500))
          
          // Remove order from list
          setRawOrders(prevOrders => prevOrders.filter(order => order.id !== orderId))
          
          // Show success message
          setSuccessModal({ isOpen: true, message: t('orderDeletedSuccess') })
        
        // Reset to page 1 if current page becomes empty
        const remainingOrders = rawOrders.filter(order => order.id !== orderId)
        const filtered = remainingOrders.filter(order => {
          if (activeTab === 'all') return true
          const statusMap: { [key: string]: string } = {
            'pending': 'Pending',
            'completed': 'Completed',
            'cancelled': 'Cancelled',
            'refunded': 'Refunded'
          }
          return order.status === statusMap[activeTab]
        })
        if (currentPage > Math.ceil(filtered.length / 5) && filtered.length > 0) {
          setCurrentPage(1)
        } else if (filtered.length === 0 && currentPage > 1) {
          setCurrentPage(1)
        }
        } catch (error) {
          console.error('Error deleting order:', error)
          setErrorModal({ isOpen: true, message: t('orderCancelledFailed') })
        } finally {
          setLoadingOrderId(null)
        }
      }
    })
  }

  // Close dropdown when clicking outside and prevent body scroll when dropdown is open
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openDropdownId !== null) {
        const target = event.target as HTMLElement
        if (!target.closest('.order-dropdown-container')) {
          setOpenDropdownId(null)
        }
      }
    }

    // Prevent body scroll when dropdown is open
    if (openDropdownId !== null) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      // Reset body overflow when component unmounts
      document.body.style.overflow = ''
    }
  }, [openDropdownId])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="hidden lg:flex h-screen overflow-hidden">
        {!sidebarCollapsed && (
          <div className="w-64 flex-shrink-0 bg-primary-500 h-screen overflow-y-auto">
            <Sidebar onClose={() => setSidebarCollapsed(true)} currentPage="orders" />
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
          
          <main className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6">
            <div className="space-y-4 sm:space-y-6">
              {/* Header */}
              <div>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">{t('orders')}</h1>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">{t('dashboardOrders')}</p>
              </div>

              {/* Status Tabs and Search */}
              <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 sm:gap-4 mb-4">
                  {/* Status Tabs - Horizontal Scroll on Mobile */}
                  <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide lg:overflow-x-visible lg:pb-0 lg:mx-0 lg:px-0">
                    <div className="flex gap-2 min-w-max">
                      <div className="flex flex-col flex-shrink-0">
                        <button 
                          onClick={() => handleTabChange('all')}
                          className="px-3 sm:px-4 py-2 rounded-lg transition-colors text-gray-700 hover:bg-gray-50 text-xs sm:text-sm whitespace-nowrap"
                        >
                          {t('all')} <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                            activeTab === 'all' ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-700'
                          }`}>{allCount}</span>
                        </button>
                        {activeTab === 'all' && <div className="w-full h-0.5 bg-primary-500 mt-1"></div>}
                      </div>
                      <div className="flex flex-col flex-shrink-0">
                        <button 
                          onClick={() => handleTabChange('pending')}
                          className="px-3 sm:px-4 py-2 rounded-lg transition-colors text-gray-700 hover:bg-gray-50 text-xs sm:text-sm whitespace-nowrap"
                        >
                          {t('pending')} <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                            activeTab === 'pending' ? 'bg-yellow-600 text-white' : 'bg-yellow-100 text-yellow-700'
                          }`}>{pendingCount}</span>
                        </button>
                        {activeTab === 'pending' && <div className="w-full h-0.5 bg-yellow-600 mt-1"></div>}
                      </div>
                      <div className="flex flex-col flex-shrink-0">
                        <button 
                          onClick={() => handleTabChange('completed')}
                          className="px-3 sm:px-4 py-2 rounded-lg transition-colors text-gray-700 hover:bg-gray-50 text-xs sm:text-sm whitespace-nowrap"
                        >
                          {t('completed')} <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                            activeTab === 'completed' ? 'bg-green-600 text-white' : 'bg-green-100 text-green-700'
                          }`}>{completedCount}</span>
                        </button>
                        {activeTab === 'completed' && <div className="w-full h-0.5 bg-green-600 mt-1"></div>}
                      </div>
                      <div className="flex flex-col flex-shrink-0">
                        <button 
                          onClick={() => handleTabChange('cancelled')}
                          className="px-3 sm:px-4 py-2 rounded-lg transition-colors text-gray-700 hover:bg-gray-50 text-xs sm:text-sm whitespace-nowrap"
                        >
                          {t('cancelled')} <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                            activeTab === 'cancelled' ? 'bg-red-600 text-white' : 'bg-red-100 text-red-700'
                          }`}>{cancelledCount}</span>
                        </button>
                        {activeTab === 'cancelled' && <div className="w-full h-0.5 bg-red-600 mt-1"></div>}
                      </div>
                      <div className="flex flex-col flex-shrink-0">
                        <button 
                          onClick={() => handleTabChange('refunded')}
                          className="px-3 sm:px-4 py-2 rounded-lg transition-colors text-gray-700 hover:bg-gray-50 text-xs sm:text-sm whitespace-nowrap"
                        >
                          {t('refunded')} <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                            activeTab === 'refunded' ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-700'
                          }`}>{refundedCount}</span>
                        </button>
                        {activeTab === 'refunded' && <div className="w-full h-0.5 bg-blue-600 mt-1"></div>}
                      </div>
                    </div>
                  </div>

                  {/* Search and Filter */}
                  <div className="flex items-center gap-2 sm:gap-3 flex-wrap sm:flex-nowrap lg:flex-shrink-0">
                    <div className="relative flex-1 lg:flex-initial min-w-0">
                      <Search className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                      <input
                        type="text"
                        placeholder={t('searchOrderPlaceholder')}
                        value={searchQuery}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        className="w-full lg:w-64 pl-8 sm:pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-xs sm:text-sm"
                      />
                    </div>
                    <button 
                      className="flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-xs sm:text-sm flex-shrink-0" 
                      aria-label="Filter orders"
                    >
                      <Filter size={16} className="sm:w-[18px] sm:h-[18px]" />
                      <span className="hidden sm:inline">{t('filter')}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Orders Table - Scrollable on all screens */}
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-white border-b border-gray-300">
                      <tr>
                        <th className="text-left py-3 px-3 sm:px-4 text-xs sm:text-sm font-medium text-gray-700 whitespace-nowrap">{t('orderNumber')}</th>
                        <th className="text-left py-3 px-3 sm:px-4 text-xs sm:text-sm font-medium text-gray-700 whitespace-nowrap">{t('placedOn')}</th>
                        <th className="text-left py-3 px-3 sm:px-4 text-xs sm:text-sm font-medium text-gray-700 whitespace-nowrap">{t('type')}</th>
                        <th className="text-left py-3 px-3 sm:px-4 text-xs sm:text-sm font-medium text-gray-700 whitespace-nowrap">{t('itemsCount')}</th>
                        <th className="text-left py-3 px-3 sm:px-4 text-xs sm:text-sm font-medium text-gray-700 whitespace-nowrap">{t('amount')}</th>
                        <th className="text-left py-3 px-3 sm:px-4 text-xs sm:text-sm font-medium text-gray-700 whitespace-nowrap">{t('paymentMethod')}</th>
                        <th className="text-left py-3 px-3 sm:px-4 text-xs sm:text-sm font-medium text-gray-700 whitespace-nowrap">{t('status')}</th>
                        <th className="text-left py-3 px-3 sm:px-4 text-xs sm:text-sm font-medium text-gray-700 whitespace-nowrap"></th>
                      </tr>
                    </thead>
                  <tbody className="divide-y divide-gray-200">
                    {paginatedOrders.length > 0 ? (
                      paginatedOrders.map((order: OrderRow) => {
                        const badge = getStatusBadge(order.status)
                        return (
                          <tr 
                            key={order.id} 
                            className="hover:bg-gray-50 cursor-pointer"
                            onClick={() => handleViewOrder(order.id)}
                          >
                          <td className="py-3 px-3 sm:px-4 text-xs sm:text-sm text-gray-900 whitespace-nowrap">{order.orderNo}</td>
                          <td className="py-3 px-3 sm:px-4 text-xs sm:text-sm text-gray-700 whitespace-nowrap">{order.placedOn}</td>
                          <td className="py-3 px-3 sm:px-4 text-xs sm:text-sm text-gray-700 whitespace-nowrap">{order.type}</td>
                          <td className="py-3 px-3 sm:px-4 text-xs sm:text-sm text-gray-700 whitespace-nowrap">{order.items}</td>
                          <td className="py-3 px-3 sm:px-4 text-xs sm:text-sm font-medium text-gray-900 whitespace-nowrap">${order.amount}</td>
                          <td className="py-3 px-3 sm:px-4 text-xs sm:text-sm text-gray-700 whitespace-nowrap">{order.paymentMethod}</td>
                          <td className="py-3 px-3 sm:px-4 whitespace-nowrap">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="py-3 px-3 sm:px-4 whitespace-nowrap relative order-dropdown-container">
                              <button 
                                className="text-gray-600 hover:text-gray-900 p-1 rounded-md hover:bg-gray-100 transition-colors"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setOpenDropdownId(openDropdownId === order.id ? null : order.id)
                                }}
                                aria-label="More options"
                              >
                                <MoreVertical size={16} />
                              </button>
                              
                              {/* Dropdown Menu */}
                              {openDropdownId === order.id && (
                                <>
                                  {/* Backdrop for mobile */}
                                  <div 
                                    className="fixed inset-0 z-40 lg:hidden"
                                    onClick={() => setOpenDropdownId(null)}
                                  />
                                  
                                  {/* Dropdown */}
                                  <div 
                                    className="fixed bottom-0 left-0 right-0 lg:absolute lg:bottom-auto lg:left-auto lg:right-0 lg:top-full lg:mt-1 z-50 bg-white lg:rounded-lg lg:shadow-xl lg:border lg:border-gray-200 lg:w-56 flex flex-col max-h-[80vh] lg:max-h-[400px]"
                                    onWheel={(e) => e.stopPropagation()}
                                    onTouchMove={(e) => e.stopPropagation()}
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    {/* Mobile Header */}
                                    <div className="lg:hidden flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
                                      <h3 className="text-lg font-semibold text-gray-900">{t('orderActions')}</h3>
                                      <button
                                        onClick={() => setOpenDropdownId(null)}
                                        className="p-2 rounded-md hover:bg-gray-100 transition-colors"
                                        aria-label="Close menu"
                                      >
                                        <X size={20} className="text-gray-600" />
                                      </button>
                                    </div>
                                    
                                    {/* Menu Items - Scrollable */}
                                    <div 
                                      className="overflow-y-auto overflow-x-hidden py-2 flex-1 min-h-0 scrollbar-hide" 
                                      onWheel={(e) => {
                                        e.stopPropagation()
                                        const target = e.currentTarget
                                        const { scrollTop, scrollHeight, clientHeight } = target
                                        const isAtTop = scrollTop === 0
                                        const isAtBottom = scrollTop + clientHeight >= scrollHeight - 1
                                        
                                        if ((isAtTop && e.deltaY < 0) || (isAtBottom && e.deltaY > 0)) {
                                          e.preventDefault()
                                        }
                                      }} 
                                      onTouchMove={(e) => {
                                        e.stopPropagation()
                                        const target = e.currentTarget
                                        const { scrollTop, scrollHeight, clientHeight } = target
                                        const touch = e.touches[0]
                                        const rect = target.getBoundingClientRect()
                                        const isAtTop = scrollTop === 0 && touch.clientY > rect.top
                                        const isAtBottom = scrollTop + clientHeight >= scrollHeight - 1 && touch.clientY < rect.bottom
                                        
                                        if (isAtTop || isAtBottom) {
                                          e.preventDefault()
                                        }
                                      }}
                                    >
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          handleViewDetails(order.id)
                                        }}
                                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-gray-700 text-left"
                                      >
                                        <Eye size={18} className="text-gray-500" />
                                        <span className="text-sm font-medium">{t('viewDetails')}</span>
                                      </button>
                                      
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          handleEditOrder(order.id)
                                        }}
                                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-gray-700 text-left"
                                      >
                                        <Edit size={18} className="text-gray-500" />
                                        <span className="text-sm font-medium">{t('editOrder')}</span>
                                      </button>
                                      
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          handleDownloadInvoice(order.id)
                                        }}
                                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-gray-700 text-left"
                                      >
                                        <FileText size={18} className="text-gray-500" />
                                        <span className="text-sm font-medium">{t('downloadInvoice')}</span>
                                      </button>
                                      
                                      <div className="border-t border-gray-200 my-2" />
                                      
                                      {order.status === 'Pending' && (
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation()
                                            handleCancelOrder(order.id)
                                          }}
                                          disabled={loadingOrderId === order.id}
                                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 transition-colors text-red-600 text-left disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                          {loadingOrderId === order.id ? (
                                            <ButtonLoader size="sm" />
                                          ) : (
                                            <X size={18} />
                                          )}
                                          <span className="text-sm font-medium">{t('cancelOrder')}</span>
                                        </button>
                                      )}
                                      
                                      {(order.status === 'Completed' || order.status === 'Pending') && (
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation()
                                            handleRefundOrder(order.id)
                                          }}
                                          disabled={loadingOrderId === order.id}
                                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-orange-50 transition-colors text-orange-600 text-left disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                          {loadingOrderId === order.id ? (
                                            <ButtonLoader size="sm" />
                                          ) : (
                                            <RefreshCw size={18} />
                                          )}
                                          <span className="text-sm font-medium">{t('issueRefund')}</span>
                                        </button>
                                      )}
                                      
                                      <div className="border-t border-gray-200 my-2" />
                                      
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          handleDeleteOrder(order.id)
                                        }}
                                        disabled={loadingOrderId === order.id}
                                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 transition-colors text-red-600 text-left disabled:opacity-50 disabled:cursor-not-allowed"
                                      >
                                        {loadingOrderId === order.id ? (
                                          <ButtonLoader size="sm" />
                                        ) : (
                                          <Trash2 size={18} />
                                        )}
                                        <span className="text-sm font-medium">{t('deleteOrder')}</span>
                                      </button>
                                    </div>
                                  </div>
                                </>
                              )}
                            </td>
                          </tr>
                        )
                      })
                    ) : (
                      <tr>
                        <td colSpan={8} className="py-8 px-3 sm:px-4 text-center text-xs sm:text-sm text-gray-500">
                          {t('noOrdersFound')}
                        </td>
                      </tr>
                    )}
                  </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 0 && (
                  <div className="border-t border-gray-200 bg-white px-3 sm:px-4 py-3 flex items-center justify-end gap-1 sm:gap-2 flex-wrap">
                    <button 
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="flex items-center gap-1 text-xs sm:text-sm text-gray-700 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft size={14} className="sm:w-4 sm:h-4" />
                      <span className="hidden sm:inline">{t('back')}</span>
                    </button>
                    
                    {visiblePages.map((page: number | null, index: number) => {
                      if (page === null) return null
                      const showEllipsis = index > 0 && visiblePages[index - 1] !== null && page - visiblePages[index - 1]! > 1
                      
                      return (
                        <div key={page} className="flex items-center gap-1 sm:gap-2">
                          {showEllipsis && <span className="text-gray-500 text-xs">...</span>}
                          <button
                            onClick={() => setCurrentPage(page)}
                            className={`min-w-[28px] sm:min-w-[32px] px-2 sm:px-3 py-1 rounded text-xs sm:text-sm ${
                              currentPage === page
                                ? 'bg-primary-500 text-white'
                                : 'bg-white text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            {page}
                          </button>
                        </div>
                      )
                    })}

                    <button
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages || totalPages === 0}
                      className="flex items-center gap-1 text-xs sm:text-sm text-gray-700 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="hidden sm:inline">{t('next')}</span>
                      <ChevronRight size={14} className="sm:w-4 sm:h-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Mobile Orders Cards */}
              <div className="md:hidden space-y-3">
                {paginatedOrders.length > 0 ? (
                  paginatedOrders.map((order: OrderRow) => {
                    const badge = getStatusBadge(order.status)
                    return (
                      <div 
                        key={order.id} 
                        onClick={() => handleViewOrder(order.id)}
                        className="bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer"
                      >
                        <div className="p-4 space-y-3">
                        {/* Header */}
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate">{order.orderNo}</p>
                            <p className="text-xs text-gray-500">{order.placedOn}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
                              {order.status}
                            </span>
                            <div className="relative order-dropdown-container">
                              <button 
                                className="text-gray-600 hover:text-gray-900 p-1 rounded-md hover:bg-gray-100 transition-colors"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setOpenDropdownId(openDropdownId === order.id ? null : order.id)
                                }}
                                aria-label="More options"
                              >
                                <MoreVertical size={18} />
                              </button>
                              
                              {/* Dropdown Menu for Mobile Cards */}
                              {openDropdownId === order.id && (
                                <>
                                  {/* Backdrop */}
                                  <div 
                                    className="fixed inset-0 z-40"
                                    onClick={() => setOpenDropdownId(null)}
                                  />
                                  
                                  {/* Dropdown */}
                                  <div 
                                    className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-lg shadow-xl border-t border-gray-200 flex flex-col max-h-[80vh]"
                                    onWheel={(e) => e.stopPropagation()}
                                    onTouchMove={(e) => e.stopPropagation()}
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    {/* Mobile Header */}
                                    <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
                                      <h3 className="text-lg font-semibold text-gray-900">{t('orderActions')}</h3>
                                      <button
                                        onClick={() => setOpenDropdownId(null)}
                                        className="p-2 rounded-md hover:bg-gray-100 transition-colors"
                                        aria-label="Close menu"
                                      >
                                        <X size={20} className="text-gray-600" />
                                      </button>
                                    </div>
                                    
                                    {/* Menu Items - Scrollable */}
                                    <div 
                                      className="overflow-y-auto overflow-x-hidden py-2 flex-1 min-h-0 scrollbar-hide" 
                                      onWheel={(e) => {
                                        e.stopPropagation()
                                        const target = e.currentTarget
                                        const { scrollTop, scrollHeight, clientHeight } = target
                                        const isAtTop = scrollTop === 0
                                        const isAtBottom = scrollTop + clientHeight >= scrollHeight - 1
                                        
                                        if ((isAtTop && e.deltaY < 0) || (isAtBottom && e.deltaY > 0)) {
                                          e.preventDefault()
                                        }
                                      }} 
                                      onTouchMove={(e) => {
                                        e.stopPropagation()
                                        const target = e.currentTarget
                                        const { scrollTop, scrollHeight, clientHeight } = target
                                        const touch = e.touches[0]
                                        const rect = target.getBoundingClientRect()
                                        const isAtTop = scrollTop === 0 && touch.clientY > rect.top
                                        const isAtBottom = scrollTop + clientHeight >= scrollHeight - 1 && touch.clientY < rect.bottom
                                        
                                        if (isAtTop || isAtBottom) {
                                          e.preventDefault()
                                        }
                                      }}
                                    >
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          handleViewDetails(order.id)
                                        }}
                                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-gray-700 text-left"
                                      >
                                        <Eye size={18} className="text-gray-500" />
                                        <span className="text-sm font-medium">{t('viewDetails')}</span>
                                      </button>
                                      
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          handleEditOrder(order.id)
                                        }}
                                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-gray-700 text-left"
                                      >
                                        <Edit size={18} className="text-gray-500" />
                                        <span className="text-sm font-medium">{t('editOrder')}</span>
                                      </button>
                                      
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          handleDownloadInvoice(order.id)
                                        }}
                                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-gray-700 text-left"
                                      >
                                        <FileText size={18} className="text-gray-500" />
                                        <span className="text-sm font-medium">{t('downloadInvoice')}</span>
                                      </button>
                                      
                                      <div className="border-t border-gray-200 my-2" />
                                      
                                      {order.status === 'Pending' && (
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation()
                                            handleCancelOrder(order.id)
                                          }}
                                          disabled={loadingOrderId === order.id}
                                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 transition-colors text-red-600 text-left disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                          {loadingOrderId === order.id ? (
                                            <ButtonLoader size="sm" />
                                          ) : (
                                            <X size={18} />
                                          )}
                                          <span className="text-sm font-medium">{t('cancelOrder')}</span>
                                        </button>
                                      )}
                                      
                                      {(order.status === 'Completed' || order.status === 'Pending') && (
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation()
                                            handleRefundOrder(order.id)
                                          }}
                                          disabled={loadingOrderId === order.id}
                                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-orange-50 transition-colors text-orange-600 text-left disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                          {loadingOrderId === order.id ? (
                                            <ButtonLoader size="sm" />
                                          ) : (
                                            <RefreshCw size={18} />
                                          )}
                                          <span className="text-sm font-medium">{t('issueRefund')}</span>
                                        </button>
                                      )}
                                      
                                      <div className="border-t border-gray-200 my-2" />
                                      
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          handleDeleteOrder(order.id)
                                        }}
                                        disabled={loadingOrderId === order.id}
                                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 transition-colors text-red-600 text-left disabled:opacity-50 disabled:cursor-not-allowed"
                                      >
                                        {loadingOrderId === order.id ? (
                                          <ButtonLoader size="sm" />
                                        ) : (
                                          <Trash2 size={18} />
                                        )}
                                        <span className="text-sm font-medium">{t('deleteOrder')}</span>
                                      </button>
                                    </div>
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                          {/* Details Grid */}
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div>
                              <p className="text-gray-500 text-xs">Type</p>
                              <p className="font-medium text-gray-900">{order.type}</p>
                            </div>
                            <div>
                              <p className="text-gray-500 text-xs">Items</p>
                              <p className="font-medium text-gray-900">{order.items}</p>
                            </div>
                            <div>
                              <p className="text-gray-500 text-xs">Amount</p>
                              <p className="font-semibold text-gray-900">${order.amount}</p>
                            </div>
                            <div>
                              <p className="text-gray-500 text-xs">Payment</p>
                              <p className="font-medium text-gray-900">{order.paymentMethod}</p>
                            </div>
                          </div>

                          {/* Action Button */}
                          <button className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50">
                            {t('viewDetails')}
                          </button>
                        </div>
                      </div>
                    )
                  })
                ) : (
                  <div className="bg-white rounded-lg shadow-sm p-8 text-center text-sm text-gray-500">
                    {t('noOrdersFound')}
                  </div>
                )}

                {/* Mobile Pagination */}
                {totalPages > 0 && (
                  <div className="flex items-center justify-between mt-6 bg-white rounded-lg p-4">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="flex items-center gap-1 text-sm text-gray-700 disabled:opacity-50"
                    >
                      <ChevronLeft size={16} />
                      {t('back')}
                    </button>
                    <span className="text-sm text-gray-600">
                      {t('pageOf').replace('{current}', currentPage.toString()).replace('{total}', totalPages.toString())}
                    </span>
                    <button
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages || totalPages === 0}
                      className="flex items-center gap-1 text-sm text-gray-700 disabled:opacity-50"
                    >
                      {t('next')}
                      <ChevronRight size={16} />
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
          <div 
            className="fixed inset-0 z-40 bg-black bg-opacity-50"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        
        <div className={`
          fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <Sidebar onClose={() => setSidebarOpen(false)} currentPage="orders" />
        </div>

        <div className="flex-1 flex flex-col min-h-screen bg-gray-50">
          <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} isSidebarOpen={sidebarOpen} />
          <main className="flex-1 overflow-x-hidden overflow-y-auto p-3 sm:p-4 pt-16 lg:pt-20">
            {/* Title */}
            <div className="mb-4">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Orders</h1>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">Dashboard - Orders</p>
            </div>

            {/* Status Tabs */}
            <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm mb-4">
              <div className="flex flex-col gap-3 sm:gap-4 mb-4">
                {/* Status Tabs - Horizontal Scroll on Mobile */}
                <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
                  <div className="flex gap-2 min-w-max">
                    <div className="flex flex-col flex-shrink-0">
                      <button 
                        onClick={() => handleTabChange('all')}
                        className="px-3 sm:px-4 py-2 rounded-lg transition-colors text-gray-700 hover:bg-gray-50 text-xs sm:text-sm whitespace-nowrap"
                      >
                        All <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                          activeTab === 'all' ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-700'
                        }`}>{allCount}</span>
                      </button>
                      {activeTab === 'all' && <div className="w-full h-0.5 bg-primary-500 mt-1"></div>}
                    </div>
                    <div className="flex flex-col flex-shrink-0">
                      <button 
                        onClick={() => handleTabChange('pending')}
                        className="px-3 sm:px-4 py-2 rounded-lg transition-colors text-gray-700 hover:bg-gray-50 text-xs sm:text-sm whitespace-nowrap"
                      >
                        Pending <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                          activeTab === 'pending' ? 'bg-yellow-600 text-white' : 'bg-yellow-100 text-yellow-700'
                        }`}>{pendingCount}</span>
                      </button>
                      {activeTab === 'pending' && <div className="w-full h-0.5 bg-yellow-600 mt-1"></div>}
                    </div>
                    <div className="flex flex-col flex-shrink-0">
                      <button 
                        onClick={() => handleTabChange('completed')}
                        className="px-3 sm:px-4 py-2 rounded-lg transition-colors text-gray-700 hover:bg-gray-50 text-xs sm:text-sm whitespace-nowrap"
                      >
                        Completed <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                          activeTab === 'completed' ? 'bg-green-600 text-white' : 'bg-green-100 text-green-700'
                        }`}>{completedCount}</span>
                      </button>
                      {activeTab === 'completed' && <div className="w-full h-0.5 bg-green-600 mt-1"></div>}
                    </div>
                    <div className="flex flex-col flex-shrink-0">
                      <button 
                        onClick={() => handleTabChange('cancelled')}
                        className="px-3 sm:px-4 py-2 rounded-lg transition-colors text-gray-700 hover:bg-gray-50 text-xs sm:text-sm whitespace-nowrap"
                      >
                        Cancelled <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                          activeTab === 'cancelled' ? 'bg-red-600 text-white' : 'bg-red-100 text-red-700'
                        }`}>{cancelledCount}</span>
                      </button>
                      {activeTab === 'cancelled' && <div className="w-full h-0.5 bg-red-600 mt-1"></div>}
                    </div>
                    <div className="flex flex-col flex-shrink-0">
                      <button 
                        onClick={() => handleTabChange('refunded')}
                        className="px-3 sm:px-4 py-2 rounded-lg transition-colors text-gray-700 hover:bg-gray-50 text-xs sm:text-sm whitespace-nowrap"
                      >
                        Refunded <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                          activeTab === 'refunded' ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-700'
                        }`}>{refundedCount}</span>
                      </button>
                      {activeTab === 'refunded' && <div className="w-full h-0.5 bg-blue-600 mt-1"></div>}
                    </div>
                  </div>
                </div>

                {/* Search and Filter */}
                <div className="flex items-center gap-2 sm:gap-3 flex-wrap sm:flex-nowrap">
                  <div className="relative flex-1 min-w-0">
                    <Search className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type="text"
                      placeholder="Search Order #"
                      value={searchQuery}
                      onChange={(e) => handleSearchChange(e.target.value)}
                      className="w-full pl-8 sm:pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-xs sm:text-sm"
                    />
                  </div>
                  <button 
                    className="flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-xs sm:text-sm flex-shrink-0" 
                    aria-label="Filter orders"
                  >
                    <Filter size={16} className="sm:w-[18px] sm:h-[18px]" />
                    <span className="hidden sm:inline">Filter</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Orders List - Mobile Cards */}
            <div className="space-y-3">
              {paginatedOrders.length > 0 ? (
                paginatedOrders.map((order) => {
                  const badge = getStatusBadge(order.status)
                  return (
                    <div 
                      key={order.id} 
                      onClick={() => handleViewOrder(order.id)}
                      className="bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer"
                    >
                      <div className="p-4 space-y-3">
                        {/* Header */}
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate">{order.orderNo}</p>
                            <p className="text-xs text-gray-500">{order.placedOn}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
                              {order.status}
                            </span>
                            <div className="relative order-dropdown-container">
                              <button 
                                className="text-gray-600 hover:text-gray-900 p-1 rounded-md hover:bg-gray-100 transition-colors"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setOpenDropdownId(openDropdownId === order.id ? null : order.id)
                                }}
                                aria-label="More options"
                              >
                                <MoreVertical size={18} />
                              </button>
                              
                              {/* Dropdown Menu for Mobile Cards */}
                              {openDropdownId === order.id && (
                                <>
                                  {/* Backdrop */}
                                  <div 
                                    className="fixed inset-0 z-40"
                                    onClick={() => setOpenDropdownId(null)}
                                  />
                                  
                                  {/* Dropdown */}
                                  <div 
                                    className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-lg shadow-xl border-t border-gray-200 flex flex-col max-h-[80vh]"
                                    onWheel={(e) => e.stopPropagation()}
                                    onTouchMove={(e) => e.stopPropagation()}
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    {/* Mobile Header */}
                                    <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
                                      <h3 className="text-lg font-semibold text-gray-900">{t('orderActions')}</h3>
                                      <button
                                        onClick={() => setOpenDropdownId(null)}
                                        className="p-2 rounded-md hover:bg-gray-100 transition-colors"
                                        aria-label="Close menu"
                                      >
                                        <X size={20} className="text-gray-600" />
                                      </button>
                                    </div>
                                    
                                    {/* Menu Items - Scrollable */}
                                    <div 
                                      className="overflow-y-auto overflow-x-hidden py-2 flex-1 min-h-0 scrollbar-hide" 
                                      onWheel={(e) => {
                                        e.stopPropagation()
                                        const target = e.currentTarget
                                        const { scrollTop, scrollHeight, clientHeight } = target
                                        const isAtTop = scrollTop === 0
                                        const isAtBottom = scrollTop + clientHeight >= scrollHeight - 1
                                        
                                        if ((isAtTop && e.deltaY < 0) || (isAtBottom && e.deltaY > 0)) {
                                          e.preventDefault()
                                        }
                                      }} 
                                      onTouchMove={(e) => {
                                        e.stopPropagation()
                                        const target = e.currentTarget
                                        const { scrollTop, scrollHeight, clientHeight } = target
                                        const touch = e.touches[0]
                                        const rect = target.getBoundingClientRect()
                                        const isAtTop = scrollTop === 0 && touch.clientY > rect.top
                                        const isAtBottom = scrollTop + clientHeight >= scrollHeight - 1 && touch.clientY < rect.bottom
                                        
                                        if (isAtTop || isAtBottom) {
                                          e.preventDefault()
                                        }
                                      }}
                                    >
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          handleViewDetails(order.id)
                                        }}
                                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-gray-700 text-left"
                                      >
                                        <Eye size={18} className="text-gray-500" />
                                        <span className="text-sm font-medium">{t('viewDetails')}</span>
                                      </button>
                                      
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          handleEditOrder(order.id)
                                        }}
                                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-gray-700 text-left"
                                      >
                                        <Edit size={18} className="text-gray-500" />
                                        <span className="text-sm font-medium">{t('editOrder')}</span>
                                      </button>
                                      
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          handleDownloadInvoice(order.id)
                                        }}
                                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-gray-700 text-left"
                                      >
                                        <FileText size={18} className="text-gray-500" />
                                        <span className="text-sm font-medium">{t('downloadInvoice')}</span>
                                      </button>
                                      
                                      <div className="border-t border-gray-200 my-2" />
                                      
                                      {order.status === 'Pending' && (
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation()
                                            handleCancelOrder(order.id)
                                          }}
                                          disabled={loadingOrderId === order.id}
                                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 transition-colors text-red-600 text-left disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                          {loadingOrderId === order.id ? (
                                            <ButtonLoader size="sm" />
                                          ) : (
                                            <X size={18} />
                                          )}
                                          <span className="text-sm font-medium">{t('cancelOrder')}</span>
                                        </button>
                                      )}
                                      
                                      {(order.status === 'Completed' || order.status === 'Pending') && (
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation()
                                            handleRefundOrder(order.id)
                                          }}
                                          disabled={loadingOrderId === order.id}
                                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-orange-50 transition-colors text-orange-600 text-left disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                          {loadingOrderId === order.id ? (
                                            <ButtonLoader size="sm" />
                                          ) : (
                                            <RefreshCw size={18} />
                                          )}
                                          <span className="text-sm font-medium">{t('issueRefund')}</span>
                                        </button>
                                      )}
                                      
                                      <div className="border-t border-gray-200 my-2" />
                                      
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          handleDeleteOrder(order.id)
                                        }}
                                        disabled={loadingOrderId === order.id}
                                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 transition-colors text-red-600 text-left disabled:opacity-50 disabled:cursor-not-allowed"
                                      >
                                        {loadingOrderId === order.id ? (
                                          <ButtonLoader size="sm" />
                                        ) : (
                                          <Trash2 size={18} />
                                        )}
                                        <span className="text-sm font-medium">{t('deleteOrder')}</span>
                                      </button>
                                    </div>
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <p className="text-gray-500 text-xs">Type</p>
                            <p className="font-medium text-gray-900">{order.type}</p>
                          </div>
                          <div>
                            <p className="text-gray-500 text-xs">Items</p>
                            <p className="font-medium text-gray-900">{order.items}</p>
                          </div>
                          <div>
                            <p className="text-gray-500 text-xs">Amount</p>
                            <p className="font-semibold text-gray-900">${order.amount}</p>
                          </div>
                          <div>
                            <p className="text-gray-500 text-xs">Payment</p>
                            <p className="font-medium text-gray-900">{order.paymentMethod}</p>
                          </div>
                        </div>

                        {/* Action Button */}
                        <button className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50">
                          {t('viewDetailsBtn')}
                        </button>
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="bg-white rounded-lg shadow-sm p-8 text-center text-sm text-gray-500">
                  {t('noOrdersFound')}
                </div>
              )}
            </div>

            {/* Mobile Pagination */}
            {totalPages > 0 && (
              <div className="flex items-center justify-between mt-6 bg-white rounded-lg p-4">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="flex items-center gap-1 text-sm text-gray-700 disabled:opacity-50"
                >
                  <ChevronLeft size={16} />
                  {t('back')}
                </button>
                <span className="text-sm text-gray-600">
                  {t('pageOf').replace('{current}', currentPage.toString()).replace('{total}', totalPages.toString())}
                </span>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className="flex items-center gap-1 text-sm text-gray-700 disabled:opacity-50"
                >
                  {t('next')}
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Modals */}
      <SuccessModal
        isOpen={successModal.isOpen}
        onClose={() => setSuccessModal({ isOpen: false, message: '' })}
        message={successModal.message}
      />
      
      <ErrorModal
        isOpen={errorModal.isOpen}
        onClose={() => setErrorModal({ isOpen: false, message: '' })}
        message={errorModal.message}
      />
      
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, message: '', onConfirm: () => {}, type: 'cancel' })}
        onConfirm={confirmModal.onConfirm}
        message={confirmModal.message}
        confirmText={t('confirm') || 'Confirm'}
        cancelText={t('cancel') || 'Cancel'}
        confirmButtonColor={confirmModal.type === 'delete' ? 'red' : 'orange'}
      />
    </div>
  )
}

