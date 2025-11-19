import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Menu, ArrowLeft, TrendingUp, DollarSign, Tag, RefreshCw, BarChart3, Star, Calendar, Search, Download } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

// TypeScript interfaces
interface ProductOrder {
  id: string
  customer: string
  date: string
  qty: number
  revenue: number
  status: string
}

export default function ProductPerformancePage({ params }: { params: { id: string } }) {
  const navigate = useNavigate()
  const { t } = useLanguage()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [chartRange, setChartRange] = useState('daily')

  // Mock product data
  const product = {
    id: params.id,
    name: 'Premium Wireless Headphones',
    productId: 'RPW001',
    image: '/images/products/headphones.jpg'
  }

  // Sales data matching the image - Jan 1 to Jan 15
  const salesData = [
    { date: 'Jan 1', sold: 45 },
    { date: 'Jan 2', sold: 52 },
    { date: 'Jan 3', sold: 38 },
    { date: 'Jan 4', sold: 65 },
    { date: 'Jan 5', sold: 72 },
    { date: 'Jan 6', sold: 58 },
    { date: 'Jan 7', sold: 69 },
    { date: 'Jan 8', sold: 76 },
    { date: 'Jan 9', sold: 82 },
    { date: 'Jan 10', sold: 68 },
    { date: 'Jan 11', sold: 92 },
    { date: 'Jan 12', sold: 86 },
    { date: 'Jan 13', sold: 77 },
    { date: 'Jan 14', sold: 88 },
    { date: 'Jan 15', sold: 94 }
  ]

  // Chart configuration
  const chartHeight = 240
  const chartPadding = { top: 20, right: 40, bottom: 40, left: 50 }
  const chartWidth = 800
  const graphWidth = chartWidth - chartPadding.left - chartPadding.right
  const graphHeight = chartHeight - chartPadding.top - chartPadding.bottom
  const minUnits = 20
  const maxUnits = 100

  // Calculate positions
  const getYPosition = (value: number) => {
    return chartPadding.top + graphHeight - ((value - minUnits) / (maxUnits - minUnits)) * graphHeight
  }

  const getXPosition = (index: number) => {
    return chartPadding.left + (index / (salesData.length - 1)) * graphWidth
  }

  const orders = [
    { id: 'ORD-2024-001', customer: 'John Smith', date: 'Jan 15, 2024', qty: 2, revenue: 299.79, status: 'Delivered' },
    { id: 'ORD-2024-002', customer: 'Sarah Johnson', date: 'Jan 14, 2024', qty: 1, revenue: 149.85, status: 'Delivered' },
    { id: 'ORD-2024-003', customer: 'Michael Green', date: 'Jan 13, 2024', qty: 1, revenue: 149.85, status: 'Returned' },
    { id: 'ORD-2024-004', customer: 'Emily Davis', date: 'Jan 12, 2024', qty: 3, revenue: 449.55, status: 'Pending' },
    { id: 'ORD-2024-005', customer: 'David Wilson', date: 'Jan 11, 2024', qty: 1, revenue: 149.85, status: 'Delivered' }
  ]

  const topLocations = [
    { country: 'United States', percentage: 42, flag: '🇺🇸' },
    { country: 'United Kingdom', percentage: 28, flag: '🇬🇧' },
    { country: 'Canada', percentage: 18, flag: '🇨🇦' },
    { country: 'Australia', percentage: 12, flag: '🇦🇺' }
  ]

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
          
          <main className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6">
            <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <button
                      onClick={() => navigate('/transactions/earnings')}
                      className="p-2 hover:bg-gray-100 rounded-lg flex-shrink-0"
                      aria-label="Go back to earnings overview"
                    >
                      <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 truncate">Transactions & Finance</h1>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-500 truncate">Dashboard - Product Performance - {product.name}</p>
                </div>
              </div>

              {/* Product Card */}
              <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-black rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-lg sm:text-xl">🎧</span>
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">{product.name}</h2>
                    <p className="text-xs sm:text-sm text-gray-500 truncate">Product ID: {product.productId}</p>
                  </div>
                </div>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <BarChart3 className="text-blue-600 w-5 h-5 sm:w-6 sm:h-6" />
                    <span className="text-xs text-green-600 flex items-center gap-1">
                      <TrendingUp size={12} className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                      +12.3%
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-500 mb-2">Total Units Sold</p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900">2,847</p>
                  <p className="text-xs text-gray-500 mt-2">vs last month</p>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <DollarSign className="text-green-600 w-5 h-5 sm:w-6 sm:h-6" />
                    <span className="text-xs text-green-600 flex items-center gap-1">
                      <TrendingUp size={12} className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                      +18.2%
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-500 mb-2">Total Revenue</p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900">$426,706</p>
                  <p className="text-xs text-gray-500 mt-2">vs last month</p>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <Tag className="text-purple-600 w-5 h-5 sm:w-6 sm:h-6" />
                    <span className="text-xs text-green-600 flex items-center gap-1">
                      <TrendingUp size={12} className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                      +0.3%
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-500 mb-2">Average Order Value</p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900">$149.85</p>
                  <p className="text-xs text-gray-500 mt-2">vs last month</p>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <RefreshCw className="text-orange-600 w-5 h-5 sm:w-6 sm:h-6" />
                    <span className="text-xs text-red-600 flex items-center gap-1">
                      <TrendingUp size={12} className="w-3 h-3 sm:w-3.5 sm:h-3.5 rotate-180" />
                      -0.3%
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-500 mb-2">Refund Rate</p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900">2.3%</p>
                  <p className="text-xs text-gray-500 mt-2">vs last month</p>
                </div>
              </div>

              {/* Sales Trend Chart - Line Chart */}
              <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Sales Trend</h2>
                  <div className="flex gap-2">
                    {['daily', 'weekly', 'monthly'].map((range) => (
                      <button
                        key={range}
                        onClick={() => setChartRange(range)}
                        className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                          chartRange === range
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {range.charAt(0).toUpperCase() + range.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="relative overflow-x-auto">
                  <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full min-w-[600px] sm:min-w-0 h-auto" preserveAspectRatio="xMidYMid meet">
                    {/* Y-axis grid lines */}
                    {[20, 40, 60, 80, 100].map((value) => {
                      const y = getYPosition(value)
                      return (
                        <g key={value}>
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
                      Units Sold
                    </text>

                    {/* Line chart path */}
                    <path
                      d={`M ${salesData.map((data, index) => {
                        const x = getXPosition(index)
                        const y = getYPosition(data.sold)
                        return `${x},${y}`
                      }).join(' L ')}`}
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />

                    {/* Data points (circles) */}
                    {salesData.map((data, index) => {
                      const x = getXPosition(index)
                      const y = getYPosition(data.sold)
                      return (
                        <circle
                          key={index}
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
                    {salesData.map((data, index) => {
                      const x = getXPosition(index)
                      return (
                        <text
                          key={index}
                          x={x}
                          y={chartHeight - chartPadding.bottom + 20}
                          textAnchor="middle"
                          fontSize="12"
                          fill="#6b7280"
                        >
                          {data.date}
                        </text>
                      )
                    })}
                  </svg>
                </div>
              </div>

              {/* Customer Insights */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Top Customer Locations</h3>
                  <div className="space-y-3">
                    {topLocations.map((location, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-lg sm:text-xl flex-shrink-0">{location.flag}</span>
                          <span className="text-xs sm:text-sm text-gray-700 truncate">{location.country}</span>
                        </div>
                        <span className="text-xs sm:text-sm font-medium text-gray-900 flex-shrink-0 ml-2">{location.percentage}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Repeat Purchase Rate</h3>
                  <p className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">34.7%</p>
                  <p className="text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4">of customers bought again</p>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-blue-600 h-3 rounded-full" style={{ width: '34.7%' }}></div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Customer Rating</h3>
                  <p className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">4.8</p>
                  <div className="flex gap-1 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`${star <= 4 ? 'text-yellow-400 fill-yellow-400' : star === 5 ? 'text-yellow-400 fill-yellow-400 opacity-80' : 'text-gray-300'} w-4 h-4 sm:w-5 sm:h-5`}
                      />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-gray-500">Based on 12K+ reviews</p>
                </div>
              </div>

              {/* Order Breakdown */}
              <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Order Breakdown</h2>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                    <div className="relative flex-1 sm:flex-initial">
                      <Calendar className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-[18px] sm:h-[18px]" />
                      <input
                        type="text"
                        placeholder="Date Range"
                        className="w-full pl-8 sm:pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-xs sm:text-sm"
                      />
                    </div>
                    <select className="px-3 py-2 border border-gray-300 rounded-lg text-xs sm:text-sm" aria-label="Status">
                      <option>Status</option>
                      <option>Delivered</option>
                      <option>Pending</option>
                      <option>Returned</option>
                    </select>
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
                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Order ID</th>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Customer Name</th>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Date Purchased</th>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Quantity</th>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Revenue</th>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {orders.map((order: ProductOrder) => (
                        <tr key={order.id} className="hover:bg-gray-50">
                          <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm font-medium text-blue-600 whitespace-nowrap">{order.id}</td>
                          <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm text-gray-900 whitespace-nowrap">{order.customer}</td>
                          <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm text-gray-500 whitespace-nowrap">{order.date}</td>
                          <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm text-gray-900 whitespace-nowrap">{order.qty}</td>
                          <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm font-medium text-gray-900 whitespace-nowrap">${order.revenue.toFixed(2)}</td>
                          <td className="px-3 sm:px-6 py-4">
                            <span className={`px-2 sm:px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                              order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                              order.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {order.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Export Button */}
              <div className="flex justify-end">
                <button className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm sm:text-base font-medium">
                  <Download size={16} className="sm:w-[18px] sm:h-[18px]" />
                  <span className="whitespace-nowrap">Export Product Report</span>
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
          <div>
            <button
              onClick={() => navigate('/transactions/earnings')}
              className="p-2 hover:bg-gray-100 rounded-lg mb-2"
              aria-label="Go back"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Transactions & Finance</h1>
            <p className="text-sm text-gray-500 mt-1">Dashboard - Product Performance</p>
          </div>

          {/* Product Card */}
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-white text-lg">🎧</span>
              </div>
              <div className="min-w-0">
                <h2 className="text-lg font-semibold text-gray-900 truncate">{product.name}</h2>
                <p className="text-xs text-gray-500 truncate">Product ID: {product.productId}</p>
              </div>
            </div>
          </div>

          {/* Key Metrics - Mobile */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-center justify-between mb-3">
                <BarChart3 className="text-blue-600" size={18} />
                <span className="text-xs text-green-600 flex items-center gap-1">
                  <TrendingUp size={10} />
                  +12.3%
                </span>
              </div>
              <p className="text-xs text-gray-500 mb-1">Total Units Sold</p>
              <p className="text-xl font-bold text-gray-900">2,847</p>
              <p className="text-xs text-gray-500 mt-1">vs last month</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-center justify-between mb-3">
                <DollarSign className="text-green-600" size={18} />
                <span className="text-xs text-green-600 flex items-center gap-1">
                  <TrendingUp size={10} />
                  +18.2%
                </span>
              </div>
              <p className="text-xs text-gray-500 mb-1">Total Revenue</p>
              <p className="text-xl font-bold text-gray-900">$426K</p>
              <p className="text-xs text-gray-500 mt-1">vs last month</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-center justify-between mb-3">
                <Tag className="text-purple-600" size={18} />
                <span className="text-xs text-green-600 flex items-center gap-1">
                  <TrendingUp size={10} />
                  +0.3%
                </span>
              </div>
              <p className="text-xs text-gray-500 mb-1">Avg Order Value</p>
              <p className="text-xl font-bold text-gray-900">$149.85</p>
              <p className="text-xs text-gray-500 mt-1">vs last month</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-center justify-between mb-3">
                <RefreshCw className="text-orange-600" size={18} />
                <span className="text-xs text-red-600 flex items-center gap-1">
                  <TrendingUp size={10} className="rotate-180" />
                  -0.3%
                </span>
              </div>
              <p className="text-xs text-gray-500 mb-1">Refund Rate</p>
              <p className="text-xl font-bold text-gray-900">2.3%</p>
              <p className="text-xs text-gray-500 mt-1">vs last month</p>
            </div>
          </div>

          {/* Sales Trend Chart - Mobile Line Chart */}
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex flex-col gap-3 mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Sales Trend</h2>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {['daily', 'weekly', 'monthly'].map((range) => (
                  <button
                    key={range}
                    onClick={() => setChartRange(range)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap flex-shrink-0 ${
                      chartRange === range
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {range.charAt(0).toUpperCase() + range.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <div className="overflow-x-auto">
              <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full min-w-[600px] h-auto" preserveAspectRatio="xMidYMid meet">
                {/* Y-axis grid lines */}
                {[20, 40, 60, 80, 100].map((value) => {
                  const y = getYPosition(value)
                  return (
                    <g key={value}>
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
                        fontSize="10"
                        fill="#6b7280"
                      >
                        {value}
                      </text>
                    </g>
                  )
                })}
                
                {/* Y-axis label */}
                <text
                  x={20}
                  y={chartHeight / 2}
                  textAnchor="middle"
                  transform={`rotate(-90, 20, ${chartHeight / 2})`}
                  fontSize="12"
                  fill="#6b7280"
                  fontWeight="500"
                >
                  Units Sold
                </text>

                {/* Line chart path */}
                <path
                  d={`M ${salesData.map((data, index) => {
                    const x = getXPosition(index)
                    const y = getYPosition(data.sold)
                    return `${x},${y}`
                  }).join(' L ')}`}
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Data points */}
                {salesData.map((data, index) => {
                  const x = getXPosition(index)
                  const y = getYPosition(data.sold)
                  return (
                    <circle
                      key={index}
                      cx={x}
                      cy={y}
                      r="4"
                      fill="#3b82f6"
                      stroke="#fff"
                      strokeWidth="2"
                    />
                  )
                })}

                {/* X-axis labels */}
                {salesData.map((data, index) => {
                  const x = getXPosition(index)
                  return (
                    <text
                      key={index}
                      x={x}
                      y={chartHeight - chartPadding.bottom + 18}
                      textAnchor="middle"
                      fontSize="10"
                      fill="#6b7280"
                    >
                      {data.date}
                    </text>
                  )
                })}
              </svg>
            </div>
          </div>

          {/* Customer Insights - Mobile */}
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="text-base font-semibold text-gray-900 mb-3">Top Customer Locations</h3>
              <div className="space-y-3">
                {topLocations.map((location, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-lg flex-shrink-0">{location.flag}</span>
                      <span className="text-sm text-gray-700 truncate">{location.country}</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900 flex-shrink-0 ml-2">{location.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="text-base font-semibold text-gray-900 mb-3">Repeat Purchase Rate</h3>
              <p className="text-3xl font-bold text-gray-900 mb-2">34.7%</p>
              <p className="text-xs text-gray-500 mb-3">of customers bought again</p>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-blue-600 h-3 rounded-full" style={{ width: '34.7%' }}></div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="text-base font-semibold text-gray-900 mb-3">Customer Rating</h3>
              <p className="text-3xl font-bold text-gray-900 mb-2">4.8</p>
              <div className="flex gap-1 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={star <= 4 ? 'text-yellow-400 fill-yellow-400' : star === 5 ? 'text-yellow-400 fill-yellow-400 opacity-80' : 'text-gray-300'}
                    size={16}
                  />
                ))}
              </div>
              <p className="text-xs text-gray-500">Based on 12K+ reviews</p>
            </div>
          </div>

          {/* Order Breakdown - Mobile */}
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex flex-col gap-3 mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Order Breakdown</h2>
              <div className="flex flex-col gap-2">
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="text"
                    placeholder="Date Range"
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" aria-label="Status">
                  <option>Status</option>
                  <option>Delivered</option>
                  <option>Pending</option>
                  <option>Returned</option>
                </select>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="text"
                    placeholder="Search"
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Order ID</th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Customer</th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Date</th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Qty</th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Revenue</th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {orders.map((order: ProductOrder) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-3 py-4 text-xs font-medium text-blue-600 whitespace-nowrap">{order.id}</td>
                      <td className="px-3 py-4 text-xs text-gray-900 whitespace-nowrap">{order.customer}</td>
                      <td className="px-3 py-4 text-xs text-gray-500 whitespace-nowrap">{order.date}</td>
                      <td className="px-3 py-4 text-xs text-gray-900 whitespace-nowrap">{order.qty}</td>
                      <td className="px-3 py-4 text-xs font-medium text-gray-900 whitespace-nowrap">${order.revenue.toFixed(2)}</td>
                      <td className="px-3 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                          order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                          order.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Export Button - Mobile */}
          <div className="flex justify-center">
            <button className="flex items-center justify-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium w-full sm:w-auto">
              <Download size={16} />
              Export Product Report
            </button>
          </div>
        </main>
      </div>
    </div>
  )
}

