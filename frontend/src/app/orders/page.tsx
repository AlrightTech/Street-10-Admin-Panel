'use client'

import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Menu, Search, Filter, MoreVertical, ChevronLeft, ChevronRight } from 'lucide-react'

export default function OrdersPage() {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [activeTab, setActiveTab] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  const allOrders = [
    { id: 1, orderNo: 'ORD-1562792771583', placedOn: '26/04/2020', type: 'Subscription', items: 5, amount: 200, paymentMethod: 'Online', status: 'Pending' },
    { id: 2, orderNo: 'ORD-1562792771584', placedOn: '26/04/2020', type: 'Order', items: 5, amount: 200, paymentMethod: 'COD', status: 'Completed' },
    { id: 3, orderNo: 'ORD-1562792771585', placedOn: '27/02/2020', type: 'Subscription', items: 5, amount: 200, paymentMethod: 'Wallet', status: 'Cancelled' },
    { id: 4, orderNo: 'ORD-1562792771586', placedOn: '26/04/2020', type: 'Order', items: 5, amount: 200, paymentMethod: 'Online', status: 'Refunded' },
    { id: 5, orderNo: 'ORD-1562792771587', placedOn: '27/02/2020', type: 'Subscription', items: 5, amount: 200, paymentMethod: 'COD', status: 'Pending' },
  ]

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
  }

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
    router.push(`/orders/${orderId}`)
  }

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
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">Orders</h1>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">Dashboard - Orders</p>
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
                  <div className="flex items-center gap-2 sm:gap-3 flex-wrap sm:flex-nowrap lg:flex-shrink-0">
                    <div className="relative flex-1 lg:flex-initial min-w-0">
                      <Search className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                      <input
                        type="text"
                        placeholder="Search Order #"
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
                      <span className="hidden sm:inline">Filter</span>
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
                        <th className="text-left py-3 px-3 sm:px-4 text-xs sm:text-sm font-medium text-gray-700 whitespace-nowrap">Order #</th>
                        <th className="text-left py-3 px-3 sm:px-4 text-xs sm:text-sm font-medium text-gray-700 whitespace-nowrap">Placed on</th>
                        <th className="text-left py-3 px-3 sm:px-4 text-xs sm:text-sm font-medium text-gray-700 whitespace-nowrap">Type</th>
                        <th className="text-left py-3 px-3 sm:px-4 text-xs sm:text-sm font-medium text-gray-700 whitespace-nowrap">Items</th>
                        <th className="text-left py-3 px-3 sm:px-4 text-xs sm:text-sm font-medium text-gray-700 whitespace-nowrap">Amount</th>
                        <th className="text-left py-3 px-3 sm:px-4 text-xs sm:text-sm font-medium text-gray-700 whitespace-nowrap">Payment Method</th>
                        <th className="text-left py-3 px-3 sm:px-4 text-xs sm:text-sm font-medium text-gray-700 whitespace-nowrap">Status</th>
                        <th className="text-left py-3 px-3 sm:px-4 text-xs sm:text-sm font-medium text-gray-700 whitespace-nowrap"></th>
                      </tr>
                    </thead>
                  <tbody className="divide-y divide-gray-200">
                    {paginatedOrders.length > 0 ? (
                      paginatedOrders.map((order) => {
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
                          <td className="py-3 px-3 sm:px-4 whitespace-nowrap">
                              <button 
                                className="text-gray-600 hover:text-gray-900"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  alert('More options')
                                }}
                                aria-label="More options"
                              >
                                <MoreVertical size={16} />
                              </button>
                            </td>
                          </tr>
                        )
                      })
                    ) : (
                      <tr>
                        <td colSpan={8} className="py-8 px-3 sm:px-4 text-center text-xs sm:text-sm text-gray-500">
                          No orders found
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
                      <span className="hidden sm:inline">Back</span>
                    </button>
                    
                    {visiblePages.map((page, index) => {
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
                      <span className="hidden sm:inline">Next</span>
                      <ChevronRight size={14} className="sm:w-4 sm:h-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Mobile Orders Cards */}
              <div className="md:hidden space-y-3">
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
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
                              {order.status}
                            </span>
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
                            View Details
                          </button>
                        </div>
                      </div>
                    )
                  })
                ) : (
                  <div className="bg-white rounded-lg shadow-sm p-8 text-center text-sm text-gray-500">
                    No orders found
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
                      Back
                    </button>
                    <span className="text-sm text-gray-600">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages || totalPages === 0}
                      className="flex items-center gap-1 text-sm text-gray-700 disabled:opacity-50"
                    >
                      Next
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
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
                            {order.status}
                          </span>
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
                          View Details
                        </button>
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="bg-white rounded-lg shadow-sm p-8 text-center text-sm text-gray-500">
                  No orders found
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
                  Back
                </button>
                <span className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className="flex items-center gap-1 text-sm text-gray-700 disabled:opacity-50"
                >
                  Next
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}

