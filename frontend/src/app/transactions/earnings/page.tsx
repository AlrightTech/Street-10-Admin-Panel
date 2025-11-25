import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'
import { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Menu, TrendingUp, Calendar, Clock, ArrowDown, DollarSign, ShoppingCart, RefreshCw, Percent, BarChart3, Search, Eye, Download, X } from 'lucide-react'
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

export default function EarningsOverviewPage() {
  const navigate = useNavigate()
  const { t } = useLanguage()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [dateRange, setDateRange] = useState('daily')
  const [showCustomDatePicker, setShowCustomDatePicker] = useState(false)
  const [customStartDate, setCustomStartDate] = useState('')
  const [customEndDate, setCustomEndDate] = useState('')

  // Mock data for earnings trend for different time ranges
  const earningsData = {
    daily: [
      { label: 'Mon', amount: 325 },
      { label: 'Tue', amount: 450 },
      { label: 'Wed', amount: 375 },
      { label: 'Thu', amount: 520 },
      { label: 'Fri', amount: 480 },
      { label: 'Sat', amount: 600 },
      { label: 'Sun', amount: 420 }
    ],
    weekly: [
      { label: 'Week 1', amount: 2100 },
      { label: 'Week 2', amount: 2450 },
      { label: 'Week 3', amount: 2280 },
      { label: 'Week 4', amount: 2650 }
    ],
    monthly: [
      { label: 'Jan', amount: 8500 },
      { label: 'Feb', amount: 9200 },
      { label: 'Mar', amount: 8800 },
      { label: 'Apr', amount: 10200 },
      { label: 'May', amount: 9600 },
      { label: 'Jun', amount: 11000 }
    ],
    custom: [] // Will be populated when custom dates are selected
  }

  // Summary data for different ranges
  const summaryData = {
    daily: {
      totalEarnings: 24580,
      thisMonth: 3240,
      pendingBalance: 1580,
      withdrawn: 19760,
      ordersRevenue: 22340,
      refundsDeducted: 540,
      platformFees: 1220,
      netEarnings: 20580
    },
    weekly: {
      totalEarnings: 24580,
      thisMonth: 9480,
      pendingBalance: 1580,
      withdrawn: 19760,
      ordersRevenue: 22340,
      refundsDeducted: 540,
      platformFees: 1220,
      netEarnings: 20580
    },
    monthly: {
      totalEarnings: 24580,
      thisMonth: 11000,
      pendingBalance: 1580,
      withdrawn: 19760,
      ordersRevenue: 22340,
      refundsDeducted: 540,
      platformFees: 1220,
      netEarnings: 20580
    },
    custom: {
      totalEarnings: 24580,
      thisMonth: 3240,
      pendingBalance: 1580,
      withdrawn: 19760,
      ordersRevenue: 22340,
      refundsDeducted: 540,
      platformFees: 1220,
      netEarnings: 20580
    }
  }

  // Generate custom data when dates are selected
  const generateCustomData = (startDate: string, endDate: string) => {
    if (!startDate || !endDate) return []
    
    const start = new Date(startDate)
    const end = new Date(endDate)
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
    
    const data = []
    for (let i = 0; i <= days; i++) {
      const date = new Date(start)
      date.setDate(date.getDate() + i)
      data.push({
        label: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        amount: Math.floor(Math.random() * 500) + 300
      })
    }
    return data
  }

  // State for current chart data
  const [currentData, setCurrentData] = useState(earningsData.daily)
  const [chartKey, setChartKey] = useState(0)

  // Update chart data when dateRange or custom dates change
  useEffect(() => {
    // Immediately update chart when dateRange changes
    if (dateRange === 'custom') {
      if (customStartDate && customEndDate) {
        const customData = generateCustomData(customStartDate, customEndDate)
        setCurrentData(customData)
        setChartKey(prev => prev + 1)
      } else {
        // Show empty state for custom if dates not selected
        setCurrentData([])
        setChartKey(prev => prev + 1)
      }
    } else {
      // For daily, weekly, monthly - immediately update
      const rangeData = earningsData[dateRange as keyof typeof earningsData]
      if (rangeData && rangeData.length > 0) {
        // Create a new array to force React to detect the change
        setCurrentData([...rangeData])
        setChartKey(prev => prev + 1)
      } else {
        // Fallback to daily
        setCurrentData([...earningsData.daily])
        setChartKey(prev => prev + 1)
      }
    }
  }, [dateRange, customStartDate, customEndDate])

  // Get current summary based on selected range
  const currentSummary = summaryData[dateRange as keyof typeof summaryData] || summaryData.daily

  const bestProducts = [
    { id: 1, name: 'Premium Headphones', productId: 'APP001', category: 'Electronics', totalSold: 234, revenue: 4680 },
    { id: 2, name: 'Wireless Speaker', productId: 'APP002', category: 'Electronics', totalSold: 188, revenue: 3760 },
    { id: 3, name: 'Smart Watch', productId: 'APP003', category: 'Wearables', totalSold: 156, revenue: 3120 }
  ]

  // Calculate chart dimensions for line chart
  const chartHeight = 240
  const chartPadding = { top: 20, right: 40, bottom: 40, left: 50 }
  const chartWidth = 700
  const graphWidth = chartWidth - chartPadding.left - chartPadding.right
  const graphHeight = chartHeight - chartPadding.top - chartPadding.bottom

  const handleCustomDateApply = () => {
    if (customStartDate && customEndDate) {
      setDateRange('custom')
      setShowCustomDatePicker(false)
    }
  }

  const handleDateRangeChange = (range: string) => {
    if (range === 'custom') {
      setShowCustomDatePicker(true)
      // Don't change dateRange until custom dates are selected
    } else {
      // Immediately update dateRange which triggers useEffect to update chart
      setDateRange(range)
      setShowCustomDatePicker(false)
      // Force chart update
      setChartKey(prev => prev + 1)
    }
  }

  // Chart rendering function - recalculates on every render with new data
  const renderChart = () => {
    if (currentData.length === 0) {
      return (
        <div className="flex items-center justify-center h-64 text-gray-500">
          {dateRange === 'custom' ? 'Please select a date range' : 'No data available'}
        </div>
      )
    }

    // Dynamic Y-axis range based on data
    const amounts = currentData.map(d => d.amount)
    const dataMax = Math.max(...amounts)
    const dataMin = Math.min(...amounts)
    
    // Add padding to Y-axis (10% above max, 10% below min)
    const padding = (dataMax - dataMin) * 0.1 || 100
    const maxAmount = Math.ceil(dataMax + padding)
    const minAmount = Math.max(0, Math.floor(dataMin - padding))
    
    // Generate grid lines dynamically (5-7 lines)
    const range = maxAmount - minAmount
    const step = Math.ceil(range / 5)
    const gridLines: number[] = []
    for (let i = minAmount; i <= maxAmount; i += step) {
      gridLines.push(i)
    }
    if (gridLines[gridLines.length - 1] < maxAmount) {
      gridLines.push(maxAmount)
    }

    const getYPosition = (value: number) => {
      const range = maxAmount - minAmount
      if (range === 0) return chartPadding.top + graphHeight / 2
      return chartPadding.top + graphHeight - ((value - minAmount) / range) * graphHeight
    }

    const getXPosition = (index: number, total: number) => {
      if (total <= 1) return chartPadding.left + graphWidth / 2
      return chartPadding.left + (index / (total - 1)) * graphWidth
    }

    // Create path data
    const pathData = currentData.map((data, index) => {
      const x = getXPosition(index, currentData.length)
      const y = getYPosition(data.amount)
      return `${x},${y}`
    }).join(' L ')

    return (
      <svg 
        key={`chart-${chartKey}-${dateRange}-${currentData.length}-${currentData[0]?.label || ''}-${currentData[0]?.amount || 0}-${maxAmount}-${minAmount}`}
        viewBox={`0 0 ${chartWidth} ${chartHeight}`} 
        className="w-full h-auto" 
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Y-axis grid lines */}
        {gridLines.map((value, idx) => {
          const y = getYPosition(value)
          return (
            <g key={`grid-${chartKey}-${idx}-${value}`}>
              <line
                x1={chartPadding.left}
                y1={y}
                x2={chartWidth - chartPadding.right}
                y2={y}
                stroke="#e5e7eb"
                strokeWidth="1"
              />
              <text
                x={chartPadding.left - 10}
                y={y + 4}
                textAnchor="end"
                fontSize="12"
                fill="#6b7280"
              >
                {value}
              </text>
            </g>
          )
        })}
        
        {/* Y-axis label */}
        <text
          x={25}
          y={chartHeight / 2}
          textAnchor="middle"
          transform={`rotate(-90, 25, ${chartHeight / 2})`}
          fontSize="14"
          fill="#6b7280"
          fontWeight="500"
        >
          Earnings ($)
        </text>

        {/* Line chart path */}
        <path
          key={`path-${chartKey}`}
          d={`M ${pathData}`}
          fill="none"
          stroke="#3b82f6"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Data points (circles) */}
        {currentData.map((data, index) => {
          const x = getXPosition(index, currentData.length)
          const y = getYPosition(data.amount)
          return (
            <circle
              key={`point-${chartKey}-${index}-${data.amount}`}
              cx={x}
              cy={y}
              r="5"
              fill="#3b82f6"
              stroke="#fff"
              strokeWidth="2"
            />
          )
        })}

        {/* X-axis labels */}
        {currentData.map((data, index) => {
          const x = getXPosition(index, currentData.length)
          return (
            <text
              key={`label-${chartKey}-${index}-${data.label}`}
              x={x}
              y={chartHeight - chartPadding.bottom + 20}
              textAnchor="middle"
              fontSize="12"
              fill="#6b7280"
            >
              {data.label}
            </text>
          )
        })}
      </svg>
    )
  }

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
              {/* Header Section */}
              <div className="flex items-center justify-between relative">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Transactions & Finance</h1>
                  <p className="text-sm text-gray-500 mt-1">Dashboard - Earnings Overview</p>
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
                  <p className="text-3xl font-bold mb-1">${currentSummary.totalEarnings.toLocaleString()}</p>
                  <p className="text-sm opacity-90">All-time</p>
                </div>

                {/* This Month - Green */}
                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm opacity-90">This {dateRange === 'daily' ? 'Month' : dateRange === 'weekly' ? 'Month' : dateRange === 'monthly' ? 'Period' : 'Period'}</span>
                    <div className="w-10 h-10 bg-green-400 rounded-full flex items-center justify-center">
                      <Calendar size={20} className="text-white" />
                    </div>
                  </div>
                  <p className="text-3xl font-bold mb-1">${currentSummary.thisMonth.toLocaleString()}</p>
                  <p className="text-sm opacity-90">+12% from last period</p>
                </div>

                {/* Pending Balance - Orange */}
                <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-6 text-white shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm opacity-90">Pending Balance</span>
                    <div className="w-10 h-10 bg-orange-400 rounded-full flex items-center justify-center">
                      <Clock size={20} className="text-white" />
                    </div>
                  </div>
                  <p className="text-3xl font-bold mb-1">${currentSummary.pendingBalance.toLocaleString()}</p>
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
                  <p className="text-3xl font-bold mb-1">${currentSummary.withdrawn.toLocaleString()}</p>
                  <p className="text-sm opacity-90">Last withdrawal 3 days ago</p>
                </div>
              </div>

              {/* Earnings Trend Chart - Line Chart */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Earnings Trend</h2>
                  <div className="flex items-center gap-3">
                    {/* Date Range Selector Buttons */}
                    <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                      <button
                        onClick={() => handleDateRangeChange('daily')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                          dateRange === 'daily'
                            ? 'bg-white text-blue-600 shadow-sm'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        Daily
                      </button>
                      <button
                        onClick={() => handleDateRangeChange('weekly')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                          dateRange === 'weekly'
                            ? 'bg-white text-blue-600 shadow-sm'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        Weekly
                      </button>
                      <button
                        onClick={() => handleDateRangeChange('monthly')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                          dateRange === 'monthly'
                            ? 'bg-white text-blue-600 shadow-sm'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        Monthly
                      </button>
                      <button
                        onClick={() => handleDateRangeChange('custom')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                          dateRange === 'custom'
                            ? 'bg-white text-blue-600 shadow-sm'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        Custom
                      </button>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1">
                      <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                      <span className="text-sm text-gray-700">
                        {dateRange === 'daily' ? 'Daily Earnings' : 
                         dateRange === 'weekly' ? 'Weekly Earnings' : 
                         dateRange === 'monthly' ? 'Monthly Earnings' : 
                         'Custom Earnings'}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Custom Date Picker Modal */}
                {showCustomDatePicker && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Select Custom Date Range</h3>
                        <button
                          onClick={() => {
                            setShowCustomDatePicker(false)
                            if (!customStartDate || !customEndDate) {
                              setDateRange('daily')
                            }
                          }}
                          className="text-gray-400 hover:text-gray-600"
                          aria-label="Close date picker"
                          title="Close"
                        >
                          <X size={20} />
                        </button>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                          <input
                            type="date"
                            value={customStartDate}
                            onChange={(e) => setCustomStartDate(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            aria-label="Start date"
                            title="Select start date"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                          <input
                            type="date"
                            value={customEndDate}
                            onChange={(e) => setCustomEndDate(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            aria-label="End date"
                            title="Select end date"
                          />
                        </div>
                        <div className="flex gap-3 pt-2">
                          <button
                            onClick={handleCustomDateApply}
                            disabled={!customStartDate || !customEndDate}
                            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            Apply
                          </button>
                          <button
                            onClick={() => {
                              setShowCustomDatePicker(false)
                              setCustomStartDate('')
                              setCustomEndDate('')
                              setDateRange('daily')
                            }}
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div key={`chart-container-${chartKey}-${dateRange}`} className="relative">
                  {renderChart()}
                </div>
              </div>

              {/* Revenue Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <ShoppingCart className="text-green-600" size={24} />
                    <span className="text-sm text-gray-500">{t('ordersRevenue')}</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">${currentSummary.ordersRevenue.toLocaleString()}</p>
                  <button 
                    onClick={() => navigate('/orders')}
                    className="text-blue-600 text-sm mt-3 hover:underline"
                  >
                    {t('viewOrders')}
                  </button>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <RefreshCw className="text-red-600" size={24} />
                    <span className="text-sm text-gray-500">{t('refundsDeducted')}</span>
                  </div>
                  <p className="text-2xl font-bold text-red-600">-${currentSummary.refundsDeducted.toLocaleString()}</p>
                  <button 
                    onClick={() => navigate('/orders', { state: { activeTab: 'refunded' } })}
                    className="text-blue-600 text-sm mt-3 hover:underline"
                  >
                    {t('viewRefunds')}
                  </button>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Percent className="text-gray-600" size={24} />
                    <span className="text-sm text-gray-500">{t('platformFees')}</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">-${currentSummary.platformFees.toLocaleString()}</p>
                  <p className="text-sm text-gray-500 mt-3">5% commission</p>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <BarChart3 className="text-blue-600" size={24} />
                    <span className="text-sm text-gray-500">{t('netEarnings')}</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">${currentSummary.netEarnings.toLocaleString()}</p>
                  <p className="text-sm text-gray-500 mt-3">{t('afterDeductions')}</p>
                </div>
              </div>

              {/* Best Performing Products */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">{t('bestPerformingProducts')}</h2>
                  <div className="flex items-center gap-3">
                    <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm" aria-label={t('transactionType')}>
                      <option>{t('transactionType')}</option>
                    </select>
                    <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm" aria-label={t('category')}>
                      <option>{t('category')}</option>
                    </select>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        type="text"
                        placeholder={t('product')}
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
                    {bestProducts.map((product: BestProduct) => (
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
                    ))}
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
                <button className="flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium">
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
              <p className="text-sm text-gray-500 mt-1">Dashboard - Earnings Overview</p>
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
              <p className="text-xl sm:text-2xl font-bold mb-1">${currentSummary.totalEarnings.toLocaleString()}</p>
              <p className="text-xs opacity-90">All-time</p>
            </div>

            {/* This Month */}
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-4 text-white shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs opacity-90">This {dateRange === 'daily' ? 'Month' : dateRange === 'weekly' ? 'Month' : dateRange === 'monthly' ? 'Period' : 'Period'}</span>
                <div className="w-8 h-8 bg-green-400 rounded-full flex items-center justify-center">
                  <Calendar size={16} className="text-white" />
                </div>
              </div>
              <p className="text-xl sm:text-2xl font-bold mb-1">${currentSummary.thisMonth.toLocaleString()}</p>
              <p className="text-xs opacity-90">+12% from last period</p>
            </div>

            {/* Pending Balance */}
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-4 text-white shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs opacity-90">Pending Balance</span>
                <div className="w-8 h-8 bg-orange-400 rounded-full flex items-center justify-center">
                  <Clock size={16} className="text-white" />
                </div>
              </div>
              <p className="text-xl sm:text-2xl font-bold mb-1">${currentSummary.pendingBalance.toLocaleString()}</p>
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
              <p className="text-xl sm:text-2xl font-bold mb-1">${currentSummary.withdrawn.toLocaleString()}</p>
              <p className="text-xs opacity-90">Last withdrawal 3 days ago</p>
            </div>
          </div>

          {/* Earnings Trend Chart - Mobile Line Chart */}
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex flex-col gap-3 mb-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Earnings Trend</h2>
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 bg-blue-600 rounded-full"></div>
                  <span className="text-xs text-gray-700">Daily Earnings</span>
                </div>
              </div>
              {/* Date Range Selector Buttons - Mobile */}
              <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1 overflow-x-auto">
                <button
                  onClick={() => handleDateRangeChange('daily')}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
                    dateRange === 'daily'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Daily
                </button>
                <button
                  onClick={() => handleDateRangeChange('weekly')}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
                    dateRange === 'weekly'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Weekly
                </button>
                <button
                  onClick={() => handleDateRangeChange('monthly')}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
                    dateRange === 'monthly'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => handleDateRangeChange('custom')}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
                    dateRange === 'custom'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Custom
                </button>
              </div>
            </div>
            
            {/* Custom Date Picker Modal - Mobile */}
            {showCustomDatePicker && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
                <div className="bg-white rounded-lg p-6 max-w-md w-full">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Select Custom Date Range</h3>
                    <button
                      onClick={() => {
                        setShowCustomDatePicker(false)
                        if (!customStartDate || !customEndDate) {
                          setDateRange('daily')
                        }
                      }}
                      className="text-gray-400 hover:text-gray-600"
                      aria-label="Close date picker"
                      title="Close"
                    >
                      <X size={20} />
                    </button>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                      <input
                        type="date"
                        value={customStartDate}
                        onChange={(e) => setCustomStartDate(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        aria-label="Start date"
                        title="Select start date"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                      <input
                        type="date"
                        value={customEndDate}
                        onChange={(e) => setCustomEndDate(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        aria-label="End date"
                        title="Select end date"
                      />
                    </div>
                    <div className="flex gap-3 pt-2">
                      <button
                        onClick={handleCustomDateApply}
                        disabled={!customStartDate || !customEndDate}
                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Apply
                      </button>
                      <button
                        onClick={() => {
                          setShowCustomDatePicker(false)
                          setCustomStartDate('')
                          setCustomEndDate('')
                          setDateRange('daily')
                        }}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div key={`mobile-chart-container-${chartKey}-${dateRange}`} className="overflow-x-auto">
              {renderChart()}
            </div>
          </div>

          {/* Best Products */}
          <div className="bg-white rounded-lg p-4 shadow-sm mb-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">{t('bestPerformingProducts')}</h2>
            <div className="space-y-3">
              {bestProducts.map((p: BestProduct) => (
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
              ))}
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
            <button className="flex-1 px-4 py-3 bg-orange-500 text-white rounded-lg">
              {t('downloadReport')}
            </button>
          </div>
        </main>
      </div>
    </div>
  )
}

