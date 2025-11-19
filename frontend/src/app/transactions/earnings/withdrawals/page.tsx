import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Menu, TrendingUp, Clock, CheckCircle, Plus, Calendar, Search, Eye, Download, ChevronLeft, ChevronRight } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

// TypeScript interfaces
interface Withdrawal {
  id: string
  date: string
  amount: number
  method: string
  status: string
  reference: string
}

export default function WithdrawalHistoryPage() {
  const navigate = useNavigate()
  const { t } = useLanguage()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)

  const withdrawals = [
    { id: 'WD-2024-001', date: 'Dec 15, 2024', amount: 2500, method: 'PayPal', status: 'Pending', reference: 'WD-2024-001' },
    { id: 'WD-2024-002', date: 'Dec 10, 2024', amount: 1800, method: 'Bank Transfer', status: 'Completed', reference: 'WD-2024-002' },
    { id: 'WD-2024-003', date: 'Dec 5, 2024', amount: 3200, method: 'Stripe', status: 'Completed', reference: 'WD-2024-003' },
    { id: 'WD-2024-004', date: 'Nov 28, 2024', amount: 900, method: 'PayPal', status: 'Rejected', reference: 'WD-2024-004' },
    { id: 'WD-2024-005', date: 'Nov 20, 2024', amount: 4750, method: 'Bank Transfer', status: 'Completed', reference: 'WD-2024-005' }
  ]

  const totalPages = 9

  // Get visible pages for pagination
  const getVisiblePages = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }
    if (currentPage <= 3) {
      return [1, 2, 3, null, 8, 9]
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
                  <h1 className="text-3xl font-bold text-gray-900">{t('withdrawalHistory')}</h1>
                  <p className="text-sm text-gray-500 mt-1">{t('dashboard')} / {t('withdrawalHistory')}</p>
                </div>
                <button
                  onClick={() => navigate('/transactions/earnings/withdrawals/new')}
                  className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                >
                  <Plus size={18} />
                  {t('newWithdrawal')}
                </button>
              </div>

              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <TrendingUp className="text-green-600" size={24} />
                    <span className="text-xs text-green-600 flex items-center gap-1">
                      <TrendingUp size={14} />
                      +12.5% vs last month
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mb-2">{t('totalWithdrawn')}</p>
                  <p className="text-3xl font-bold text-gray-900">$24,580</p>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Clock className="text-orange-600" size={24} />
                  </div>
                  <p className="text-sm text-gray-500 mb-2">{t('pendingAmount')}</p>
                  <p className="text-3xl font-bold text-gray-900">$1,250</p>
                  <p className="text-sm text-gray-500 mt-2">3 requests</p>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <CheckCircle className="text-green-600" size={24} />
                    <span className="text-xs text-green-600 flex items-center gap-1">
                      <TrendingUp size={14} />
                      +2.1% improvement
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mb-2">{t('successRate')}</p>
                  <p className="text-3xl font-bold text-gray-900">94.2%</p>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Clock className="text-blue-600" size={24} />
                    <span className="text-xs text-green-600 flex items-center gap-1">
                      <TrendingUp size={14} />
                      -0.2 days faster
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mb-2">{t('avgProcessing')}</p>
                  <p className="text-3xl font-bold text-gray-900">2.4 days</p>
                </div>
              </div>

              {/* Filters */}
              <div className="bg-white rounded-lg shadow-sm p-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 flex-1">
                    <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm" aria-label={t('allStatus')}>
                      <option>{t('allStatus')}</option>
                      <option>{t('pending')}</option>
                      <option>{t('completed')}</option>
                      <option>{t('rejected')}</option>
                    </select>
                    <div className="relative flex-1 max-w-xs">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        type="text"
                        placeholder="2024-01-01 to 2024-12-31"
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm"
                      />
                    </div>
                  </div>
                  <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                    <Download size={18} />
                    {t('export')}
                  </button>
                </div>
              </div>

              {/* Withdrawal Requests Table */}
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">{t('withdrawalRequests')}</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('date')}</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('requestAmount')}</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('paymentMethod')}</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('status')}</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('referenceId')}</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('actions')}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {withdrawals.map((withdrawal: Withdrawal) => (
                        <tr key={withdrawal.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm text-gray-900">{withdrawal.date}</td>
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">${withdrawal.amount.toFixed(2)}</td>
                          <td className="px-6 py-4 text-sm text-gray-500">{withdrawal.method}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                              withdrawal.status === 'Completed' ? 'bg-green-100 text-green-700' :
                              withdrawal.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {withdrawal.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">{withdrawal.reference}</td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => navigate(`/transactions/earnings/withdrawals/${withdrawal.id}`)}
                              className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
                            >
                              <Eye size={16} />
                              {t('view')}
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
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
          <Header onToggleSidebar={() => setSidebarOpen(true)} isSidebarOpen={sidebarOpen} />
        </div>
        <main className="p-4">
          <div className="mb-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 hover:bg-gray-100 rounded-lg"
              aria-label="Open menu"
            >
              <Menu size={24} />
            </button>
          </div>
        </main>
      </div>
    </div>
  )
}

