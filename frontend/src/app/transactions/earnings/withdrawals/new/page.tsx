'use client'

import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Menu, Wallet, Clock, ArrowUp, Send, Download, Calendar, Search, Eye, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { ButtonLoader } from '@/components/ui/Loader'

// TypeScript interfaces
interface WithdrawalRequest {
  id: string
  date: string
  amount: number
  method: string
  status: string
  processed: string | null
}

export default function RequestWithdrawalPage() {
  const router = useRouter()
  const { t } = useLanguage()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [formData, setFormData] = useState({
    amount: '',
    method: '',
    accountDetails: '',
    notes: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800))
    setIsSubmitting(false)
    // Handle withdrawal request submission
    router.push('/transactions/earnings/withdrawals')
  }

  const withdrawals = [
    { id: 'MWD-2024-001', date: 'Dec 15, 2024', amount: 1200.00, method: 'Bank Transfer', status: 'Pending', processed: null },
    { id: 'MWD-2024-002', date: 'Dec 10, 2024', amount: 800.00, method: 'PayPal', status: 'Completed', processed: 'Dec 12, 2024' },
    { id: 'MWD-2024-003', date: 'Dec 8, 2024', amount: 2800.00, method: 'Bank Transfer', status: 'Completed', processed: 'Dec 7, 2024' },
    { id: 'MWD-2024-004', date: 'Nov 28, 2024', amount: 450.00, method: 'JazzCash', status: 'Rejected', processed: 'Nov 29, 2024' }
  ]

  const availableBalance = 12450.75
  const totalPages = 8

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
            <Sidebar onClose={() => setSidebarOpen(false)} currentPage="earningsOverview" />
          </div>
        </div>
      )}

      {/* Desktop Layout */}
      <div className="hidden lg:flex h-screen overflow-hidden">
        {!sidebarCollapsed && (
          <div className="w-64 flex-shrink-0 bg-primary-500 h-screen overflow-y-auto">
            <Sidebar onClose={() => setSidebarCollapsed(true)} currentPage="earningsOverview" />
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
            <div className="max-w-7xl mx-auto space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Transactions & Finance</h1>
                  <p className="text-sm text-gray-500 mt-1">Dashboard - Earnings Overview</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium">
                  <Download size={18} />
                  Download Statement
                </button>
              </div>

              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Current Wallet Balance - Purple */}
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-6 text-white shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm opacity-90">Current Wallet Balance</p>
                    <div className="w-10 h-10 bg-purple-400 rounded-lg flex items-center justify-center">
                      <Wallet size={20} className="text-white" />
                    </div>
                  </div>
                  <p className="text-4xl font-bold">${availableBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                </div>

                {/* Pending Payouts - White */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm text-gray-500">Pending Payouts</p>
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                      <Clock className="text-orange-600" size={20} />
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-gray-900">$2,180.00</p>
                  <p className="text-sm text-gray-500 mt-2">3 requests pending</p>
                </div>

                {/* Total Withdrawn - White */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm text-gray-500">Total Withdrawn</p>
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <ArrowUp className="text-green-600" size={20} />
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-gray-900">$48,920.50</p>
                  <p className="text-sm text-gray-500 mt-2">Last 30 days $5240</p>
                </div>
              </div>

              {/* Request New Withdrawal Form */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Request New Withdrawal</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Withdrawal Amount</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                      <input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        value={formData.amount}
                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                        required
                      />
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      Available balance <span className="font-medium text-gray-900">${availableBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Withdrawal Method</label>
                    <div className="relative">
                      <select
                        className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none bg-white"
                        value={formData.method}
                        onChange={(e) => setFormData({ ...formData, method: e.target.value })}
                        required
                        aria-label="Withdrawal Method"
                      >
                        <option value="">Select Method</option>
                        <option value="bank">Bank Transfer</option>
                        <option value="paypal">PayPal</option>
                        <option value="jazzcash">JazzCash</option>
                        <option value="easypaisa">EasyPaisa</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Account Details</label>
                    <textarea
                      rows={4}
                      placeholder="Enter account details (IBAN, Email, Mobile number, etc.)"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                      value={formData.accountDetails}
                      onChange={(e) => setFormData({ ...formData, accountDetails: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Notes (Optional)</label>
                    <textarea
                      rows={3}
                      placeholder="Add any additional notes or instructions..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                    >
                      {isSubmitting ? <ButtonLoader size="sm" /> : <Send size={18} />}
                      {isSubmitting ? 'Submitting...' : 'Submit Withdrawal Request'}
                    </button>
                  </div>
                </form>
              </div>

              {/* Withdrawal History */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Withdrawal History</h2>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                    <div className="relative flex-1 sm:flex-initial">
                      <Calendar className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-[18px] sm:h-[18px]" />
                      <input
                        type="text"
                        placeholder="Date Range"
                        className="w-full pl-8 sm:pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-xs sm:text-sm"
                      />
                    </div>
                    <div className="relative flex-1 sm:flex-initial">
                      <select className="w-full sm:w-auto px-3 py-2 pr-8 border border-gray-300 rounded-lg text-xs sm:text-sm appearance-none bg-white" aria-label="All Status">
                        <option>All Status</option>
                        <option>Pending</option>
                        <option>Completed</option>
                        <option>Rejected</option>
                      </select>
                      <ChevronDown className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none w-3 h-3 sm:w-4 sm:h-4" />
                    </div>
                    <div className="relative flex-1 sm:flex-initial sm:w-64">
                      <Search className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-[18px] sm:h-[18px]" />
                      <input
                        type="text"
                        placeholder="Search"
                        className="w-full pl-8 sm:pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-xs sm:text-sm"
                      />
                    </div>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Request ID</th>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Date</th>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Amount</th>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Method</th>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Status</th>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Processed</th>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {withdrawals.map((withdrawal: WithdrawalRequest) => (
                        <tr key={withdrawal.id} className="hover:bg-gray-50">
                          <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm font-medium text-gray-900 whitespace-nowrap">{withdrawal.id}</td>
                          <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm text-gray-500 whitespace-nowrap">{withdrawal.date}</td>
                          <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm font-medium text-gray-900 whitespace-nowrap">${withdrawal.amount.toFixed(2)}</td>
                          <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm text-gray-500 whitespace-nowrap">{withdrawal.method}</td>
                          <td className="px-3 sm:px-6 py-4">
                            <span className={`px-2 sm:px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                              withdrawal.status === 'Completed' ? 'bg-green-100 text-green-700' :
                              withdrawal.status === 'Pending' ? 'bg-orange-100 text-orange-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {withdrawal.status}
                            </span>
                          </td>
                          <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm text-gray-500 whitespace-nowrap">
                            {withdrawal.processed || '—'}
                          </td>
                          <td className="px-3 sm:px-6 py-4">
                            <button
                              onClick={() => router.push(`/transactions/earnings/withdrawals/${withdrawal.id.replace('MWD-', 'WD-')}`)}
                              className="text-blue-600 hover:text-blue-800 hover:underline text-xs sm:text-sm"
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="border-t border-gray-200 bg-white px-4 py-3 flex items-center justify-end gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="flex items-center gap-1 text-gray-700 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm"
                  >
                    <ChevronLeft size={14} className="sm:w-4 sm:h-4" />
                    <span>Back</span>
                  </button>

                  {visiblePages.map((page: number | null, index: number) => {
                    if (page === null) return null
                    const showEllipsis = index > 0 && visiblePages[index - 1] !== null && page - visiblePages[index - 1]! > 1
                    
                    return (
                      <div key={page} className="flex items-center gap-2">
                        {showEllipsis && <span className="text-gray-500 text-xs sm:text-sm">...</span>}
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
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-1 text-gray-700 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm"
                  >
                    <span>Next</span>
                    <ChevronRight size={14} className="sm:w-4 sm:h-4" />
                  </button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden min-h-screen bg-gray-50">
        <Header onToggleSidebar={() => setSidebarOpen(true)} isSidebarOpen={sidebarOpen} />
        {sidebarOpen && (
          <div className="fixed inset-0 z-50">
            <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
            <div className="absolute left-0 top-0 bottom-0 w-64 bg-primary-500">
              <Sidebar onClose={() => setSidebarOpen(false)} currentPage="earningsOverview" />
            </div>
          </div>
        )}

        <main className="p-4 pt-20 space-y-4 pb-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Transactions & Finance</h1>
              <p className="text-sm text-gray-500 mt-1">Dashboard - Earnings Overview</p>
            </div>
            <button className="flex items-center justify-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium">
              <Download size={16} />
              Download Statement
            </button>
          </div>

          {/* Summary Cards - Mobile */}
          <div className="grid grid-cols-1 gap-4">
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-4 text-white shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs opacity-90">Current Wallet Balance</p>
                <div className="w-8 h-8 bg-purple-400 rounded-lg flex items-center justify-center">
                  <Wallet size={16} className="text-white" />
                </div>
              </div>
              <p className="text-3xl font-bold">${availableBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs text-gray-500">Pending Payouts</p>
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <Clock className="text-orange-600" size={16} />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">$2,180.00</p>
              <p className="text-xs text-gray-500 mt-1">3 requests pending</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs text-gray-500">Total Withdrawn</p>
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <ArrowUp className="text-green-600" size={16} />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">$48,920.50</p>
              <p className="text-xs text-gray-500 mt-1">Last 30 days $5240</p>
            </div>
          </div>

          {/* Request New Withdrawal Form - Mobile */}
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Request New Withdrawal</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Withdrawal Amount</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    className="w-full pl-7 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    required
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1.5">
                  Available balance <span className="font-medium text-gray-900">${availableBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                </p>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Withdrawal Method</label>
                <div className="relative">
                  <select
                    className="w-full px-3 py-2.5 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none bg-white text-sm"
                    value={formData.method}
                    onChange={(e) => setFormData({ ...formData, method: e.target.value })}
                    required
                    aria-label="Withdrawal Method"
                  >
                    <option value="">Select Method</option>
                    <option value="bank">Bank Transfer</option>
                    <option value="paypal">PayPal</option>
                    <option value="jazzcash">JazzCash</option>
                    <option value="easypaisa">EasyPaisa</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none w-4 h-4" />
                </div>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Account Details</label>
                <textarea
                  rows={3}
                  placeholder="Enter account details (IBAN, Email, Mobile number, etc.)"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none text-sm"
                  value={formData.accountDetails}
                  onChange={(e) => setFormData({ ...formData, accountDetails: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Notes (Optional)</label>
                <textarea
                  rows={2}
                  placeholder="Add any additional notes or instructions..."
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none text-sm"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="flex items-center justify-center gap-2 px-4 py-2.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium w-full sm:w-auto"
                >
                  <Send size={16} />
                  Submit Withdrawal Request
                </button>
              </div>
            </form>
          </div>

          {/* Withdrawal History - Mobile */}
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex flex-col gap-3 mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Withdrawal History</h2>
              <div className="flex flex-col gap-2">
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Date Range"
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
                <div className="relative">
                  <select className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg text-sm appearance-none bg-white" aria-label="All Status">
                    <option>All Status</option>
                    <option>Pending</option>
                    <option>Completed</option>
                    <option>Rejected</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none w-4 h-4" />
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search"
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Request ID</th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Date</th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Amount</th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Status</th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {withdrawals.map((withdrawal) => (
                    <tr key={withdrawal.id} className="hover:bg-gray-50">
                      <td className="px-3 py-3 text-xs font-medium text-gray-900 whitespace-nowrap">{withdrawal.id}</td>
                      <td className="px-3 py-3 text-xs text-gray-500 whitespace-nowrap">{withdrawal.date}</td>
                      <td className="px-3 py-3 text-xs font-medium text-gray-900 whitespace-nowrap">${withdrawal.amount.toFixed(2)}</td>
                      <td className="px-3 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                          withdrawal.status === 'Completed' ? 'bg-green-100 text-green-700' :
                          withdrawal.status === 'Pending' ? 'bg-orange-100 text-orange-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {withdrawal.status}
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        <button
                          onClick={() => router.push(`/transactions/earnings/withdrawals/${withdrawal.id.replace('MWD-', 'WD-')}`)}
                          className="text-blue-600 hover:text-blue-800 hover:underline text-xs"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination - Mobile */}
            <div className="border-t border-gray-200 bg-white px-3 py-3 flex items-center justify-between gap-2 mt-4">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="flex items-center gap-1 text-gray-700 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed text-xs"
              >
                <ChevronLeft size={14} />
                <span>Back</span>
              </button>

              <div className="flex items-center gap-1">
                {visiblePages.map((page: number | null, index: number) => {
                  if (page === null) return null
                  const showEllipsis = index > 0 && visiblePages[index - 1] !== null && page - visiblePages[index - 1]! > 1
                  
                  return (
                    <div key={page} className="flex items-center gap-1">
                      {showEllipsis && <span className="text-gray-500 text-xs">...</span>}
                      <button
                        onClick={() => setCurrentPage(page)}
                        className={`min-w-[24px] px-2 py-1 rounded text-xs ${
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
              </div>

              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="flex items-center gap-1 text-gray-700 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed text-xs"
              >
                <span>Next</span>
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

