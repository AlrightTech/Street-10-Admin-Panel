import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Menu, Search, Filter, Calendar, TrendingUp, Clock, FileText, ChevronLeft, ChevronRight, Eye, ChevronDown, X } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

// TypeScript interfaces
interface Transaction {
  id: string
  orderId?: string | null
  customer?: string | null
  type: string
  amount: number
  paymentMethod?: string
  status: string
  date: string
  isPositive: boolean
}

export default function TransactionsHistoryPage() {
  const navigate = useNavigate()
  const { t } = useLanguage()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [filters, setFilters] = useState({
    transactionType: '',
    date: '',
    status: '',
    search: ''
  })

  // Mock transaction data
  const transactions = [
    { 
      id: 'TXN001234', 
      orderId: 'ORD5678', 
      customer: 'John Smith', 
      type: 'Earning', 
      amount: 150.00, 
      paymentMethod: 'Credit Card', 
      status: 'Completed', 
      date: 'Dec 15, 2024',
      isPositive: true 
    },
    { 
      id: 'TXN001235', 
      orderId: 'ORD5679', 
      customer: 'Sarah Johnson', 
      type: 'Refund', 
      amount: 75.50, 
      paymentMethod: 'PayPal', 
      status: 'Pending', 
      date: 'Dec 14, 2024',
      isPositive: false 
    },
    { 
      id: 'TXN001236', 
      orderId: null, 
      customer: null, 
      type: 'Withdrawal', 
      amount: 500.00, 
      paymentMethod: 'Bank Transfer', 
      status: 'Completed', 
      date: 'Dec 13, 2024',
      isPositive: false 
    },
    { 
      id: 'TXN001237', 
      orderId: 'ORD5680', 
      customer: 'Mike Davis', 
      type: 'Earning', 
      amount: 220.00, 
      paymentMethod: 'Wallet', 
      status: 'Failed', 
      date: 'Dec 12, 2024',
      isPositive: true 
    },
    { 
      id: 'TXN001238', 
      orderId: 'ORD5681', 
      customer: 'Emma Wilson', 
      type: 'Earning', 
      amount: 89.99, 
      paymentMethod: 'Credit Card', 
      status: 'Completed', 
      date: 'Dec 11, 2024',
      isPositive: true 
    }
  ]

  const getTypeBadge = (type: string) => {
    switch(type) {
      case 'Earning': return { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200' }
      case 'Refund': return { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200' }
      case 'Withdrawal': return { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200' }
      default: return { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-200' }
    }
  }

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'Completed': return { bg: 'bg-green-100', text: 'text-green-700', icon: '✓' }
      case 'Pending': return { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: '⏱' }
      case 'Failed': return { bg: 'bg-red-100', text: 'text-red-700', icon: '✗' }
      default: return { bg: 'bg-gray-100', text: 'text-gray-700', icon: '' }
    }
  }

  const handleViewTransaction = (transactionId: string) => {
    navigate(`/transactions/${transactionId}`)
  }

  const handleClearFilters = () => {
    setFilters({ transactionType: '', date: '', status: '', search: '' })
  }

  const hasActiveFilters = filters.transactionType || filters.date || filters.status || filters.search

  const handleApplyFilters = () => {
    // Apply filters logic here
    console.log('Applying filters:', filters)
  }

  const totalPages = 8
  const itemsPerPage = 5

  // Get visible pages for pagination
  const getVisiblePages = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }
    if (currentPage <= 3) {
      return [1, 2, 3, null, 7, 8]
    } else if (currentPage >= totalPages - 2) {
      return [1, 2, null, totalPages - 2, totalPages - 1, totalPages]
    } else {
      return [1, 2, null, currentPage - 1, currentPage, currentPage + 1, null, totalPages - 1, totalPages]
    }
  }

  const visiblePages = getVisiblePages()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setSidebarOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-64 bg-primary-500">
            <Sidebar onClose={() => setSidebarOpen(false)} currentPage="transactionHistory" />
          </div>
        </div>
      )}

      {/* Desktop Layout */}
      <div className="hidden lg:flex h-screen overflow-hidden">
        {!sidebarCollapsed && (
          <div className="w-64 flex-shrink-0 bg-primary-500 h-screen overflow-y-auto">
            <Sidebar onClose={() => setSidebarCollapsed(true)} currentPage="transactionHistory" />
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
            <div className="space-y-6">
              {/* Header */}
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Transactions & Finance</h1>
                <p className="text-sm text-gray-500 mt-1">Dashboard • Transaction History</p>
              </div>

              {/* Filters */}
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {/* Transaction Type */}
                  <div className="relative">
                  <select
                      aria-label="Transaction Type"
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none bg-white text-sm"
                    value={filters.transactionType}
                    onChange={(e) => setFilters({ ...filters, transactionType: e.target.value })}
                  >
                      <option value="">Transaction Type</option>
                      <option value="earning">Earning</option>
                      <option value="refund">Refund</option>
                      <option value="withdrawal">Withdrawal</option>
                  </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                  </div>

                  {/* Date */}
                  <div className="relative">
                    <label htmlFor="transaction-date" className="sr-only">Date</label>
                    <input
                      id="transaction-date"
                      type="text"
                      placeholder="mm/dd/yyyy"
                      maxLength={10}
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                      value={filters.date}
                      onChange={(e) => {
                        const formatted = e.target.value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2').replace(/(\d{2}\/\d{2})(\d)/, '$1/$2').slice(0, 10)
                        setFilters({ ...filters, date: formatted })
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const dateInput = document.getElementById('transaction-date') as HTMLInputElement
                        if (dateInput) {
                          dateInput.type = 'date'
                      try {
                        const input = dateInput as any
                        if (input.showPicker && typeof input.showPicker === 'function') {
                          input.showPicker()
                        } else {
                          dateInput.click()
                        }
                      } catch {
                        dateInput.click()
                      }
                          setTimeout(() => {
                            if (dateInput.value) {
                              const dateParts = dateInput.value.split('-')
                              setFilters({ ...filters, date: `${dateParts[1]}/${dateParts[2]}/${dateParts[0]}` })
                            }
                            dateInput.type = 'text'
                          }, 100)
                        }
                      }}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer z-10"
                      aria-label="Open calendar"
                    >
                      <Calendar size={18} />
                    </button>
                  </div>

                  {/* Status */}
                  <div className="relative">
                  <select
                      aria-label="All Status"
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none bg-white text-sm"
                    value={filters.status}
                    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                  >
                      <option value="">All Status</option>
                      <option value="completed">Completed</option>
                      <option value="pending">Pending</option>
                      <option value="failed">Failed</option>
                  </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                  </div>

                  {/* Search */}
                  <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        type="text"
                      placeholder="Transaction ID or Order ID"
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                      value={filters.search}
                      onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    />
                  </div>
                </div>

                {/* Filter Actions */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                <button 
                  onClick={handleClearFilters}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    <div className="relative">
                      <Filter size={16} className="text-blue-600" />
                      {hasActiveFilters && (
                        <X size={12} className="absolute -top-1 -right-1 text-blue-600 bg-white rounded-full" />
                      )}
                    </div>
                    <span>Clear Filters</span>
                  </button>
                  <button 
                    onClick={handleApplyFilters}
                    className="px-6 py-2 bg-[#5842B9] text-white rounded-lg hover:bg-[#4a38a0] transition-colors text-sm font-medium"
                  >
                    Apply Filters
                </button>
                </div>
              </div>

              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm opacity-90">{t('totalEarnings')}</span>
                    <TrendingUp size={20} className="opacity-80" />
                  </div>
                  <p className="text-3xl font-bold">$24,580</p>
                </div>

                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm opacity-90">{t('pending')}</span>
                    <Clock size={20} className="opacity-80" />
                  </div>
                  <p className="text-3xl font-bold">$1,240</p>
                </div>

                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-6 text-white shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm opacity-90">{t('totalTransactions')}</span>
                    <FileText size={20} className="opacity-80" />
                  </div>
                  <p className="text-3xl font-bold">342</p>
                </div>

                <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-6 text-white shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm opacity-90">{t('thisMonth')}</span>
                    <Calendar size={20} className="opacity-80" />
                  </div>
                  <p className="text-3xl font-bold">$5,680</p>
                </div>
              </div>

              {/* Transactions Table */}
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('transactionId')}</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('orderId')}</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('customer')}</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('type')}</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('amount')}</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('paymentMethod')}</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('status')}</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('date')}</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('action')}</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {transactions.map((transaction: Transaction) => {
                        const typeBadge = getTypeBadge(transaction.type)
                        const statusBadge = getStatusBadge(transaction.status)
                        return (
                          <tr key={transaction.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{transaction.id}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              {transaction.orderId ? (
                                <button 
                                  onClick={() => navigate(`/orders/${transaction.orderId?.replace('ORD', '')}`)}
                                  className="text-blue-600 hover:text-blue-800 hover:underline"
                                >
                                  #{transaction.orderId}
                                </button>
                              ) : (
                                <span className="text-gray-400">—</span>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {transaction.customer || <span className="text-gray-400">—</span>}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${typeBadge.bg} ${typeBadge.text} border ${typeBadge.border}`}>
                                {transaction.type}
                              </span>
                            </td>
                            <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${transaction.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                              {(transaction.isPositive ? '+' : '-') + '$' + transaction.amount.toFixed(2)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.paymentMethod}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusBadge.bg} ${statusBadge.text}`}>
                                {statusBadge.icon && <span className="mr-1">{statusBadge.icon}</span>}
                                {transaction.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.date}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <button
                                onClick={() => handleViewTransaction(transaction.id)}
                                className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                              >
                                <Eye size={16} />
                                {t('view')}
                              </button>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="border-t border-gray-200 bg-white px-4 py-3 flex items-center justify-end gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="flex items-center gap-1 text-gray-700 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft size={16} />
                    <span>{t('back')}</span>
                  </button>

                  {visiblePages.map((page: number | null, index: number) => {
                    if (page === null) return null
                    const showEllipsis = index > 0 && visiblePages[index - 1] !== null && page - visiblePages[index - 1]! > 1
                    
                    return (
                      <div key={page} className="flex items-center gap-2">
                        {showEllipsis && <span className="text-gray-500">...</span>}
                        <button
                          onClick={() => setCurrentPage(page)}
                          className={`min-w-[32px] px-3 py-1 rounded text-sm ${
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
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-1 text-gray-700 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span>{t('next')}</span>
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden">
        {/* Sidebar & Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
          <Header onToggleSidebar={() => setSidebarOpen(true)} isSidebarOpen={sidebarOpen} />
        </div>
        {sidebarOpen && (
          <div className="fixed inset-0 z-50">
            <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
            <div className="absolute left-0 top-0 bottom-0 w-64 bg-primary-500">
              <Sidebar onClose={() => setSidebarOpen(false)} currentPage="transactionHistory" />
            </div>
          </div>
        )}

        <main className="mt-14 p-4">
          {/* Title */}
          <div className="mb-4">
            <h1 className="text-2xl font-bold text-gray-900">Transactions & Finance</h1>
            <p className="text-sm text-gray-500">Dashboard • Transaction History</p>
          </div>

          {/* Filters (Compact) */}
          <div className="bg-white rounded-lg p-4 shadow-sm mb-4 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="relative">
              <select
                  aria-label="Transaction Type"
                  className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg text-sm appearance-none bg-white"
                value={filters.transactionType}
                onChange={(e) => setFilters({ ...filters, transactionType: e.target.value })}
              >
                  <option value="">Transaction Type</option>
                  <option value="earning">Earning</option>
                  <option value="refund">Refund</option>
                  <option value="withdrawal">Withdrawal</option>
              </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
              </div>

              <div className="relative">
              <input
                  type="text"
                  placeholder="mm/dd/yyyy"
                  maxLength={10}
                  className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg text-sm"
                value={filters.date}
                  onChange={(e) => {
                    const formatted = e.target.value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2').replace(/(\d{2}\/\d{2})(\d)/, '$1/$2').slice(0, 10)
                    setFilters({ ...filters, date: formatted })
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    const dateInput = document.getElementById('transaction-date-mobile') as HTMLInputElement
                    if (dateInput) {
                      dateInput.type = 'date'
                      try {
                        const input = dateInput as any
                        if (input.showPicker && typeof input.showPicker === 'function') {
                          input.showPicker()
                        } else {
                          dateInput.click()
                        }
                      } catch {
                        dateInput.click()
                      }
                      setTimeout(() => {
                        if (dateInput.value) {
                          const dateParts = dateInput.value.split('-')
                          setFilters({ ...filters, date: `${dateParts[1]}/${dateParts[2]}/${dateParts[0]}` })
                        }
                        dateInput.type = 'text'
                      }, 100)
                    }
                  }}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer z-10"
                  aria-label="Open calendar"
                >
                  <Calendar size={16} />
                </button>
                <input
                  id="transaction-date-mobile"
                  type="text"
                  className="hidden"
                  aria-hidden="true"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="relative">
              <select
                  aria-label="All Status"
                  className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg text-sm appearance-none bg-white"
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              >
                  <option value="">All Status</option>
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
              </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Transaction ID or Order ID"
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm"
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-gray-200">
              <button 
                onClick={handleClearFilters}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2"
              >
                <div className="relative">
                  <Filter size={16} className="text-blue-600" />
                  {hasActiveFilters && (
                    <X size={12} className="absolute -top-1 -right-1 text-blue-600 bg-white rounded-full" />
                  )}
                </div>
                <span>Clear Filters</span>
              </button>
              <button 
                onClick={handleApplyFilters}
                className="px-4 py-2 bg-[#5842B9] text-white rounded-lg text-sm font-medium"
              >
                Apply Filters
              </button>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-4 text-white">
              <p className="text-xs opacity-90">{t('totalEarnings')}</p>
              <p className="text-xl font-bold">$24,580</p>
            </div>
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-4 text-white">
              <p className="text-xs opacity-90">{t('pending')}</p>
              <p className="text-xl font-bold">$1,240</p>
            </div>
          </div>

          {/* Transactions List as Cards */}
          <div className="space-y-3">
            {transactions.map((transaction) => {
              const typeBadge = getTypeBadge(transaction.type)
              const statusBadge = getStatusBadge(transaction.status)
              return (
                <div key={transaction.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="p-4 space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">#{transaction.id}</p>
                        <p className="text-xs text-gray-500">{transaction.date}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusBadge.bg} ${statusBadge.text}`}>
                        {transaction.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-gray-500 text-xs">{t('type')}</p>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${typeBadge.bg} ${typeBadge.text} border ${typeBadge.border}`}>
                          {transaction.type}
                        </span>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs">{t('amount')}</p>
                        <p className={`${transaction.isPositive ? 'text-green-600' : 'text-red-600'} font-medium`}>
                          {(transaction.isPositive ? '+' : '-') + '$' + transaction.amount.toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs">{t('paymentMethod')}</p>
                        <p className="text-gray-900">{transaction.paymentMethod}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs">{t('orderId')}</p>
                        {transaction.orderId ? (
                          <button 
                            onClick={() => navigate(`/orders/${transaction.orderId?.replace('ORD', '')}`)}
                            className="text-blue-600 hover:text-blue-800 text-sm"
                          >
                            #{transaction.orderId}
                          </button>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleViewTransaction(transaction.id)}
                      className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
                    >
                      {t('view')}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-6 bg-white rounded-lg p-4">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-1 text-sm text-gray-700 disabled:opacity-50"
            >
              <ChevronLeft size={16} />
              {t('back')}
            </button>
            <span className="text-sm text-gray-600">{t('page')} {currentPage} / {totalPages}</span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="flex items-center gap-1 text-sm text-gray-700 disabled:opacity-50"
            >
              {t('next')}
              <ChevronRight size={16} />
            </button>
          </div>
        </main>
      </div>
    </div>
  )
}

