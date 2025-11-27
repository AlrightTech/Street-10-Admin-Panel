import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Menu, TrendingUp, Calendar, Clock, ArrowDown, DollarSign, ShoppingCart, RefreshCw, Percent, BarChart3, Search, Eye, Download } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

// TypeScript interfaces
interface BestProduct {
  id: number
  name: string
  productId: string
  category: string
  totalSold: number
  revenue: number
}

export default function EarningsPage() {
  const navigate = useNavigate()
  const { t } = useLanguage()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [dateRange, setDateRange] = useState('daily')
  const [productFilters, setProductFilters] = useState({
    transactionType: '',
    category: '',
    search: ''
  })

  // Mock data for earnings trend for different time ranges
  const earningsData = {
    daily: [
      { day: 'Mon', amount: 320 },
      { day: 'Tue', amount: 450 },
      { day: 'Wed', amount: 380 },
      { day: 'Thu', amount: 530 },
      { day: 'Fri', amount: 480 },
      { day: 'Sat', amount: 600 },
      { day: 'Sun', amount: 420 }
    ],
    weekly: [
      { day: 'Week 1', amount: 2100 },
      { day: 'Week 2', amount: 2450 },
      { day: 'Week 3', amount: 2280 },
      { day: 'Week 4', amount: 2650 }
    ],
    monthly: [
      { day: 'Jan', amount: 8500 },
      { day: 'Feb', amount: 9200 },
      { day: 'Mar', amount: 8800 },
      { day: 'Apr', amount: 10200 },
      { day: 'May', amount: 9600 },
      { day: 'Jun', amount: 11000 }
    ],
    custom: [
      { day: 'Day 1', amount: 450 },
      { day: 'Day 2', amount: 520 },
      { day: 'Day 3', amount: 480 },
      { day: 'Day 4', amount: 600 },
      { day: 'Day 5', amount: 550 }
    ]
  }

  // Get current data based on selected date range
  const currentData = earningsData[dateRange as keyof typeof earningsData] || earningsData.daily

  // Calculate dynamic Y-axis range based on current data
  const amounts = currentData.map(d => d.amount)
  const dataMax = Math.max(...amounts)
  const dataMin = Math.min(...amounts)
  const padding = (dataMax - dataMin) * 0.1 || 100
  const maxAmount = Math.ceil(dataMax + padding)
  const minAmount = Math.max(0, Math.floor(dataMin - padding))

  const allProducts = [
    { id: 1, name: 'Premium Headphones', productId: 'APP001', category: 'Electronics', totalSold: 234, revenue: 4680 },
    { id: 2, name: 'Wireless Speaker', productId: 'APP002', category: 'Electronics', totalSold: 188, revenue: 3760 },
    { id: 3, name: 'Smart Watch', productId: 'APP003', category: 'Wearables', totalSold: 156, revenue: 3120 },
    { id: 4, name: 'Gaming Mouse', productId: 'APP004', category: 'Electronics', totalSold: 145, revenue: 2900 },
    { id: 5, name: 'Fitness Tracker', productId: 'APP005', category: 'Wearables', totalSold: 198, revenue: 3960 },
    { id: 6, name: 'Bluetooth Earbuds', productId: 'APP006', category: 'Electronics', totalSold: 267, revenue: 5340 }
  ]

  // Get unique categories from products
  const categories = Array.from(new Set(allProducts.map(p => p.category)))

  // Filter products based on selected filters
  const filteredProducts = allProducts.filter((product) => {
    // Filter by category
    if (productFilters.category && product.category !== productFilters.category) {
      return false
    }

    // Filter by search (product name or product ID)
    if (productFilters.search) {
      const searchLower = productFilters.search.toLowerCase()
      const matchesName = product.name.toLowerCase().includes(searchLower)
      const matchesId = product.productId.toLowerCase().includes(searchLower)
      if (!matchesName && !matchesId) return false
    }

    // Note: transactionType filter can be added when transaction data is available
    // For now, we'll keep it for future implementation

    return true
  })

  const bestProducts = filteredProducts

  // Calculate chart dimensions for line chart
  const chartHeight = 240
  const chartPadding = { top: 20, right: 40, bottom: 40, left: 60 }
  const chartWidth = 700
  const graphWidth = chartWidth - chartPadding.left - chartPadding.right
  const graphHeight = chartHeight - chartPadding.top - chartPadding.bottom

  // Calculate line points
  const getYPosition = (value: number) => {
    return chartPadding.top + graphHeight - ((value - minAmount) / (maxAmount - minAmount)) * graphHeight
  }

  const getXPosition = (index: number) => {
    const total = currentData.length
    if (total <= 1) return chartPadding.left + graphWidth / 2
    return chartPadding.left + (index / (total - 1)) * graphWidth
  }

  // Get legend text based on date range
  const getLegendText = () => {
    switch(dateRange) {
      case 'daily': return 'Daily Earnings'
      case 'weekly': return 'Weekly Earnings'
      case 'monthly': return 'Monthly Earnings'
      case 'custom': return 'Custom Earnings'
      default: return 'Daily Earnings'
    }
  }

  // Handle download report
  const handleDownloadReport = () => {
    // Create report data
    const reportData = {
      title: 'Earnings Report',
      dateRange: dateRange.charAt(0).toUpperCase() + dateRange.slice(1),
      generatedAt: new Date().toLocaleString(),
      summary: {
        totalEarnings: 24580,
        thisMonth: 3240,
        pendingBalance: 1580,
        withdrawn: 19760
      },
      chartData: currentData,
      products: bestProducts
    }

    // Create CSV content
    let csvContent = `Earnings Report - ${reportData.dateRange}\n`
    csvContent += `Generated: ${reportData.generatedAt}\n\n`
    
    csvContent += `Summary\n`
    csvContent += `Total Earnings,$${reportData.summary.totalEarnings.toLocaleString()}\n`
    csvContent += `This Month,$${reportData.summary.thisMonth.toLocaleString()}\n`
    csvContent += `Pending Balance,$${reportData.summary.pendingBalance.toLocaleString()}\n`
    csvContent += `Withdrawn,$${reportData.summary.withdrawn.toLocaleString()}\n\n`
    
    csvContent += `Earnings Trend (${reportData.dateRange})\n`
    csvContent += `Period,Amount ($)\n`
    reportData.chartData.forEach((data) => {
      csvContent += `${data.day},$${data.amount.toLocaleString()}\n`
    })
    
    csvContent += `\nBest Performing Products\n`
    csvContent += `Product Name,Product ID,Category,Total Sold,Revenue ($)\n`
    reportData.products.forEach((product) => {
      csvContent += `${product.name},${product.productId},${product.category},${product.totalSold},$${product.revenue.toLocaleString()}\n`
    })

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `earnings-report-${dateRange}-${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  // Generate Y-axis grid lines dynamically
  const generateGridLines = () => {
    const range = maxAmount - minAmount
    const step = Math.ceil(range / 5)
    const lines: number[] = []
    for (let i = minAmount; i <= maxAmount; i += step) {
      lines.push(i)
    }
    if (lines[lines.length - 1] < maxAmount) {
      lines.push(maxAmount)
    }
    return lines
  }

  const gridLines = generateGridLines()

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
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Transactions & Finance</h1>
                  <p className="text-sm mt-1">
                    <span className="text-gray-500">Dashboard</span>
                    <span className="text-gray-900"> • Earnings Overview</span>
                  </p>
                </div>
                <div className="flex gap-2">
                  {['daily', 'weekly', 'monthly', 'custom'].map((range) => (
                    <button
                      key={range}
                      onClick={() => setDateRange(range)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        dateRange === range
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {range.charAt(0).toUpperCase() + range.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Total Earnings - Dark Blue */}
                <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg p-6 text-white shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm opacity-90">Total Earnings</span>
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                      <DollarSign size={20} className="text-white" />
                    </div>
                  </div>
                  <p className="text-3xl font-bold mb-1">$24,580</p>
                  <p className="text-sm opacity-90">All-time</p>
                </div>

                {/* This Month - Green */}
                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm opacity-90">This Month</span>
                    <div className="w-10 h-10 bg-green-400 rounded-full flex items-center justify-center">
                      <Calendar size={20} className="text-white" />
                    </div>
                  </div>
                  <p className="text-3xl font-bold mb-1">$3,240</p>
                  <p className="text-sm opacity-90">+12% from last month</p>
                </div>

                {/* Pending Balance - Orange */}
                <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-6 text-white shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm opacity-90">Pending Balance</span>
                    <div className="w-10 h-10 bg-orange-400 rounded-full flex items-center justify-center">
                      <Clock size={20} className="text-white" />
                    </div>
                  </div>
                  <p className="text-3xl font-bold mb-1">$1,580</p>
                  <p className="text-sm opacity-90">8 pending orders</p>
                </div>

                {/* Withdrawn - Purple */}
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-6 text-white shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm opacity-90">Withdrawn</span>
                    <div className="w-10 h-10 bg-purple-400 rounded-full flex items-center justify-center">
                      <ArrowDown size={20} className="text-white" />
                    </div>
                  </div>
                  <p className="text-3xl font-bold mb-1">$19,760</p>
                  <p className="text-sm opacity-90">Last withdrawal 3 days ago</p>
                </div>
              </div>

              {/* Earnings Trend Chart - Line Chart */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Earnings Trend</h2>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg">
                      <div className="w-3 h-3 bg-blue-600 rounded-full shadow-sm"></div>
                      <span className="text-sm font-medium text-gray-700">{getLegendText()}</span>
                    </div>
                  </div>
                </div>
                <div className="relative">
                  <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-auto" preserveAspectRatio="xMidYMid meet" key={`chart-${dateRange}`}>
                    {/* Gradient definitions for area fill */}
                    <defs>
                      <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
                        <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.02" />
                      </linearGradient>
                      <filter id="glow">
                        <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                        <feMerge>
                          <feMergeNode in="coloredBlur"/>
                          <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                      </filter>
                    </defs>

                    {/* Y-axis grid lines */}
                    {gridLines.map((value) => {
                      const y = getYPosition(value)
                      return (
                        <g key={value}>
                          <line
                            x1={chartPadding.left}
                            y1={y}
                            x2={chartWidth - chartPadding.right}
                            y2={y}
                            stroke="#f3f4f6"
                            strokeWidth="1"
                            strokeDasharray="none"
                          />
                          <text
                            x={chartPadding.left - 20}
                            y={y + 5}
                            textAnchor="end"
                            fontSize="11"
                            fill="#9ca3af"
                            fontWeight="500"
                            fontFamily="system-ui, -apple-system, sans-serif"
                          >
                            {value.toLocaleString()}
                          </text>
                        </g>
                      )
                    })}
                    
                    {/* Y-axis label */}
                    <text
                      x={8}
                      y={chartHeight / 2}
                      textAnchor="middle"
                      transform={`rotate(-90, 8, ${chartHeight / 2})`}
                      fontSize="11"
                      fill="#6b7280"
                      fontWeight="600"
                      fontFamily="system-ui, -apple-system, sans-serif"
                      letterSpacing="0.3px"
                    >
                      Earnings ($)
                    </text>

                    {/* Area under the line for depth */}
                    <path
                      d={`M ${chartPadding.left} ${chartPadding.top + graphHeight} ${currentData.map((data, index) => {
                        const x = getXPosition(index)
                        const y = getYPosition(data.amount)
                        return `L ${x} ${y}`
                      }).join(' ')} L ${chartPadding.left + graphWidth} ${chartPadding.top + graphHeight} Z`}
                      fill="url(#areaGradient)"
                    />

                    {/* Line chart path with smooth curve */}
                    <path
                      d={`M ${currentData.map((data, index) => {
                        const x = getXPosition(index)
                        const y = getYPosition(data.amount)
                        return `${x},${y}`
                      }).join(' L ')}`}
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      filter="url(#glow)"
                    />

                    {/* Data points (circles) with better styling */}
                    {currentData.map((data, index) => {
                      const x = getXPosition(index)
                      const y = getYPosition(data.amount)
                      return (
                        <g key={index}>
                          {/* Outer glow circle */}
                          <circle
                            cx={x}
                            cy={y}
                            r="7"
                            fill="#3b82f6"
                            opacity="0.2"
                          />
                          {/* Main circle */}
                          <circle
                            cx={x}
                            cy={y}
                            r="5"
                            fill="#3b82f6"
                            stroke="#ffffff"
                            strokeWidth="2.5"
                            className="cursor-pointer"
                          />
                          {/* Inner highlight */}
                          <circle
                            cx={x}
                            cy={y}
                            r="2"
                            fill="#ffffff"
                            opacity="0.8"
                          />
                        </g>
                      )
                    })}

                    {/* X-axis labels with better styling */}
                    {currentData.map((data, index) => {
                      const x = getXPosition(index)
                      return (
                        <text
                          key={index}
                          x={x}
                          y={chartHeight - chartPadding.bottom + 22}
                          textAnchor="middle"
                          fontSize="11"
                          fill="#6b7280"
                          fontWeight="500"
                          fontFamily="system-ui, -apple-system, sans-serif"
                        >
                          {data.day}
                        </text>
                      )
                    })}
                  </svg>
                </div>
              </div>

              {/* Revenue Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <ShoppingCart className="text-green-600" size={24} />
                    <span className="text-sm text-gray-500">{t('ordersRevenue')}</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">$22,340</p>
                  <button className="text-blue-600 text-sm mt-3 hover:underline">{t('viewOrders')}</button>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <RefreshCw className="text-red-600" size={24} />
                    <span className="text-sm text-gray-500">{t('refundsDeducted')}</span>
                  </div>
                  <p className="text-2xl font-bold text-red-600">-$540</p>
                  <button className="text-blue-600 text-sm mt-3 hover:underline">{t('viewRefunds')}</button>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Percent className="text-gray-600" size={24} />
                    <span className="text-sm text-gray-500">{t('platformFees')}</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">-$1,220</p>
                  <p className="text-sm text-gray-500 mt-3">5% commission</p>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <BarChart3 className="text-blue-600" size={24} />
                    <span className="text-sm text-gray-500">{t('netEarnings')}</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">$20,580</p>
                  <p className="text-sm text-gray-500 mt-3">{t('afterDeductions')}</p>
                </div>
              </div>

              {/* Best Performing Products */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">{t('bestPerformingProducts')}</h2>
                    {bestProducts.length > 0 && (
                      <p className="text-sm text-gray-500 mt-1">
                        Showing {bestProducts.length} {bestProducts.length === 1 ? 'product' : 'products'}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <select 
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      aria-label={t('transactionType')}
                      value={productFilters.transactionType}
                      onChange={(e) => setProductFilters({ ...productFilters, transactionType: e.target.value })}
                    >
                      <option value="">{t('transactionType')}</option>
                      <option value="all">All Transactions</option>
                      <option value="sales">Sales</option>
                      <option value="refunds">Refunds</option>
                    </select>
                    <select 
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      aria-label={t('category')}
                      value={productFilters.category}
                      onChange={(e) => setProductFilters({ ...productFilters, category: e.target.value })}
                    >
                      <option value="">{t('category')}</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        type="text"
                        placeholder={t('product')}
                        value={productFilters.search}
                        onChange={(e) => setProductFilters({ ...productFilters, search: e.target.value })}
                        className="pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm w-64 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('product')}</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('category')}</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('totalSold')}</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('revenue')}</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('action')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {bestProducts.length > 0 ? (
                      bestProducts.map((product: BestProduct) => (
                      <tr key={product.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                              <span className="text-gray-600 text-xs font-medium">PH</span>
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{product.name}</p>
                              <p className="text-sm text-gray-500">{product.productId}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                            {product.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-900">{product.totalSold}</td>
                        <td className="px-6 py-4 font-medium text-gray-900">${product.revenue.toLocaleString()}</td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => navigate(`/transactions/earnings/products/${product.id}`)}
                            className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm"
                          >
                            <Eye size={16} />
                            {t('viewDetails')}
                          </button>
                        </td>
                      </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="px-6 py-8 text-center text-sm text-gray-500">
                          No products found matching your filters.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => navigate('/transactions/earnings/withdrawals/new')}
                  className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  <DollarSign size={18} />
                  {t('requestWithdrawal')}
                </button>
                <button 
                  onClick={handleDownloadReport}
                  className="flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
                >
                  <Download size={18} />
                  {t('downloadReport')}
                </button>
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
          <div className="flex flex-col gap-3 mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Transactions & Finance</h1>
              <p className="text-sm mt-1">
                <span className="text-gray-500">Dashboard</span>
                <span className="text-gray-900"> • Earnings Overview</span>
              </p>
            </div>
            
            {/* Date ranges - Scrollable on mobile */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {['daily', 'weekly', 'monthly', 'custom'].map((range) => (
                <button
                  key={range}
                  onClick={() => setDateRange(range)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap flex-shrink-0 transition-colors ${
                    dateRange === range ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {range.charAt(0).toUpperCase() + range.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Summary Cards - Stack vertically on mobile */}
          <div className="grid grid-cols-2 gap-3">
            {/* Total Earnings */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg p-4 text-white shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs opacity-90">Total Earnings</span>
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <DollarSign size={16} className="text-white" />
                </div>
              </div>
              <p className="text-xl sm:text-2xl font-bold mb-1">$24,580</p>
              <p className="text-xs opacity-90">All-time</p>
            </div>

            {/* This Month */}
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-4 text-white shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs opacity-90">This Month</span>
                <div className="w-8 h-8 bg-green-400 rounded-full flex items-center justify-center">
                  <Calendar size={16} className="text-white" />
                </div>
              </div>
              <p className="text-xl sm:text-2xl font-bold mb-1">$3,240</p>
              <p className="text-xs opacity-90">+12% from last month</p>
            </div>

            {/* Pending Balance */}
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-4 text-white shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs opacity-90">Pending Balance</span>
                <div className="w-8 h-8 bg-orange-400 rounded-full flex items-center justify-center">
                  <Clock size={16} className="text-white" />
                </div>
              </div>
              <p className="text-xl sm:text-2xl font-bold mb-1">$1,580</p>
              <p className="text-xs opacity-90">8 pending orders</p>
            </div>

            {/* Withdrawn */}
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-4 text-white shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs opacity-90">Withdrawn</span>
                <div className="w-8 h-8 bg-purple-400 rounded-full flex items-center justify-center">
                  <ArrowDown size={16} className="text-white" />
                </div>
              </div>
              <p className="text-xl sm:text-2xl font-bold mb-1">$19,760</p>
              <p className="text-xs opacity-90">Last withdrawal 3 days ago</p>
            </div>
          </div>

          {/* Earnings Trend Chart - Mobile Line Chart */}
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Earnings Trend</h2>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-gray-50 rounded-lg">
                  <div className="w-2.5 h-2.5 bg-blue-600 rounded-full shadow-sm"></div>
                  <span className="text-xs font-medium text-gray-700">{getLegendText()}</span>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full min-w-[500px] h-auto" preserveAspectRatio="xMidYMid meet" key={`chart-mobile-${dateRange}`}>
                {/* Gradient definitions */}
                <defs>
                  <linearGradient id="areaGradientMobile" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.02" />
                  </linearGradient>
                  <filter id="glowMobile">
                    <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
                    <feMerge>
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>

                {/* Y-axis grid lines */}
                {gridLines.map((value) => {
                  const y = getYPosition(value)
                  return (
                    <g key={value}>
                      <line
                        x1={chartPadding.left}
                        y1={y}
                        x2={chartWidth - chartPadding.right}
                        y2={y}
                        stroke="#f3f4f6"
                        strokeWidth="1"
                      />
                      <text
                        x={chartPadding.left - 18}
                        y={y + 4}
                        textAnchor="end"
                        fontSize="10"
                        fill="#9ca3af"
                        fontWeight="500"
                        fontFamily="system-ui, -apple-system, sans-serif"
                      >
                        {value.toLocaleString()}
                      </text>
                    </g>
                  )
                })}
                
                {/* Y-axis label */}
                <text
                  x={6}
                  y={chartHeight / 2}
                  textAnchor="middle"
                  transform={`rotate(-90, 6, ${chartHeight / 2})`}
                  fontSize="10"
                  fill="#6b7280"
                  fontWeight="600"
                  fontFamily="system-ui, -apple-system, sans-serif"
                  letterSpacing="0.3px"
                >
                  Earnings ($)
                </text>

                {/* Area under the line */}
                <path
                  d={`M ${chartPadding.left} ${chartPadding.top + graphHeight} ${currentData.map((data, index) => {
                    const x = getXPosition(index)
                    const y = getYPosition(data.amount)
                    return `L ${x} ${y}`
                  }).join(' ')} L ${chartPadding.left + graphWidth} ${chartPadding.top + graphHeight} Z`}
                  fill="url(#areaGradientMobile)"
                />

                {/* Line chart path */}
                <path
                  d={`M ${currentData.map((data, index) => {
                    const x = getXPosition(index)
                    const y = getYPosition(data.amount)
                    return `${x},${y}`
                  }).join(' L ')}`}
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  filter="url(#glowMobile)"
                />

                {/* Data points */}
                {currentData.map((data, index) => {
                  const x = getXPosition(index)
                  const y = getYPosition(data.amount)
                  return (
                    <g key={index}>
                      <circle
                        cx={x}
                        cy={y}
                        r="6"
                        fill="#3b82f6"
                        opacity="0.2"
                      />
                      <circle
                        cx={x}
                        cy={y}
                        r="4"
                        fill="#3b82f6"
                        stroke="#ffffff"
                        strokeWidth="2"
                      />
                      <circle
                        cx={x}
                        cy={y}
                        r="1.5"
                        fill="#ffffff"
                        opacity="0.8"
                      />
                    </g>
                  )
                })}

                {/* X-axis labels */}
                {currentData.map((data, index) => {
                  const x = getXPosition(index)
                  return (
                    <text
                      key={index}
                      x={x}
                      y={chartHeight - chartPadding.bottom + 20}
                      textAnchor="middle"
                      fontSize="10"
                      fill="#6b7280"
                      fontWeight="500"
                      fontFamily="system-ui, -apple-system, sans-serif"
                    >
                      {data.day}
                    </text>
                  )
                })}
              </svg>
            </div>
          </div>

          {/* Best Products */}
          <div className="bg-white rounded-lg p-4 shadow-sm mb-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">{t('bestPerformingProducts')}</h2>
            
            {/* Mobile Filters */}
            <div className="flex flex-col gap-2 mb-4">
              <select 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                value={productFilters.category}
                onChange={(e) => setProductFilters({ ...productFilters, category: e.target.value })}
                aria-label={t('category')}
                title={t('category')}
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder={t('product')}
                  value={productFilters.search}
                  onChange={(e) => setProductFilters({ ...productFilters, search: e.target.value })}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="space-y-3">
              {bestProducts.length > 0 ? (
                bestProducts.map((p: BestProduct) => (
                  <div key={p.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-gray-600 text-xs font-medium">PH</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{p.name}</p>
                        <p className="text-xs text-gray-500">{p.productId}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => navigate(`/transactions/earnings/products/${p.id}`)}
                      className="text-blue-600 text-sm"
                    >
                      {t('viewDetails')}
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-sm text-gray-500">
                  No products found matching your filters.
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => navigate('/transactions/earnings/withdrawals/new')}
              className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg"
            >
              {t('requestWithdrawal')}
            </button>
            <button 
              onClick={handleDownloadReport}
              className="flex-1 px-4 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              {t('downloadReport')}
            </button>
          </div>
        </main>
      </div>
    </div>
  )
}

