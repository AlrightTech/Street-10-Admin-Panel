'use client'

import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'
import { useState } from 'react'
import { Menu, Calendar, ChevronDown, Download, DollarSign, ShoppingCart, TrendingUp, RefreshCw, FileText, Table, Crown, Bell, Users, Eye } from 'lucide-react'

export default function SalesOverviewPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [selectedPeriod, setSelectedPeriod] = useState('Daily')

  // Chart data for different periods
  const chartData = {
    Daily: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      sales: [1200, 1800, 1500, 2200, 1900, 2600, 2100],
      orders: [45, 68, 52, 85, 72, 98, 88]
    },
    Weekly: {
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      sales: [12500, 14800, 13200, 16500],
      orders: [380, 420, 395, 450]
    },
    Monthly: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      sales: [52000, 58000, 54000, 62000, 59000, 65000],
      orders: [1800, 2000, 1900, 2200, 2100, 2300]
    }
  }

  const currentData = chartData[selectedPeriod as keyof typeof chartData]

  // Helper function to render the sales performance chart
  const renderSalesChart = (data: typeof currentData, period: string) => {
    const chartWidth = 700
    const chartHeight = 280
    const padding = { top: 20, right: 40, bottom: 50, left: 70 }
    const graphWidth = chartWidth - padding.left - padding.right
    const graphHeight = chartHeight - padding.top - padding.bottom

    // Determine max Y based on period
    const maxSales = Math.max(...data.sales)
    const maxOrders = Math.max(...data.orders)
    let maxY: number
    let yLabels: number[]
    
    if (period === 'Daily') {
      maxY = 3000
      yLabels = [0, 1000, 2000, 3000]
    } else if (period === 'Weekly') {
      maxY = 20000
      yLabels = [0, 5000, 10000, 15000, 20000]
    } else {
      maxY = 70000
      yLabels = [0, 20000, 40000, 60000, 70000]
    }
    
    const minY = 0
    const yRange = maxY - minY

    // Calculate positions for Sales
    const xStep = graphWidth / (data.labels.length - 1)
    const salesPoints = data.sales.map((value, index) => {
      const x = padding.left + index * xStep
      const y = padding.top + graphHeight - ((value - minY) / yRange) * graphHeight
      return { x, y, value }
    })

    // Calculate positions for Orders (scaled to same Y-axis)
    const ordersPoints = data.orders.map((value, index) => {
      const x = padding.left + index * xStep
      // Scale orders to fit on the chart (orders are much smaller, so we'll scale them proportionally)
      const scaledValue = period === 'Daily' ? value * 30 : period === 'Weekly' ? value * 50 : value * 30
      const y = padding.top + graphHeight - ((scaledValue - minY) / yRange) * graphHeight
      return { x, y, value }
    })

    // Create paths
    const salesLinePath = salesPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
    const salesAreaPath = `${salesLinePath} L ${salesPoints[salesPoints.length - 1].x} ${padding.top + graphHeight} L ${salesPoints[0].x} ${padding.top + graphHeight} Z`
    
    const ordersLinePath = ordersPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')

    // Grid lines
    const gridLines = yLabels.map((label) => {
      const y = padding.top + graphHeight - ((label - minY) / yRange) * graphHeight
      return { y, label }
    })

    const formatLabel = (label: number) => {
      if (label >= 1000) return `${label / 1000}K`
      return label.toString()
    }

    return (
      <div className="w-full overflow-x-auto">
        <div className="min-w-[320px]">
          <svg 
            viewBox={`0 0 ${chartWidth} ${chartHeight}`} 
            className="w-full h-80 sm:h-96" 
            preserveAspectRatio="xMidYMid meet"
          >
            {/* Y-axis label */}
            <text
              x={20}
              y={padding.top + graphHeight / 2}
              textAnchor="middle"
              fill="#374151"
              fontSize="12"
              className="font-medium"
              transform={`rotate(-90, 20, ${padding.top + graphHeight / 2})`}
            >
              Amount ($)
            </text>

            {/* Grid lines */}
            {gridLines.map((grid, i) => (
              <g key={i}>
                <line
                  x1={padding.left}
                  y1={grid.y}
                  x2={padding.left + graphWidth}
                  y2={grid.y}
                  stroke="#e5e7eb"
                  strokeWidth="1"
                />
                <text
                  x={padding.left - 10}
                  y={grid.y + 4}
                  textAnchor="end"
                  fill="#6b7280"
                  fontSize="12"
                  className="font-medium"
                >
                  {formatLabel(grid.label)}
                </text>
              </g>
            ))}

            {/* X-axis labels */}
            {data.labels.map((label, index) => {
              const x = padding.left + index * xStep
              return (
                <text
                  key={index}
                  x={x}
                  y={chartHeight - padding.bottom + 20}
                  textAnchor="middle"
                  fill="#6b7280"
                  fontSize="12"
                  className="font-medium"
                >
                  {label}
                </text>
              )
            })}

            {/* Sales area fill with gradient */}
            <defs>
              <linearGradient id={`salesGradient-${period}`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.05" />
              </linearGradient>
            </defs>
            <path
              d={salesAreaPath}
              fill={`url(#salesGradient-${period})`}
            />

            {/* Sales line */}
            <path
              d={salesLinePath}
              fill="none"
              stroke="#3b82f6"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Sales data points (circular markers) */}
            {salesPoints.map((point, index) => (
              <circle
                key={`sales-${index}`}
                cx={point.x}
                cy={point.y}
                r="4"
                fill="#3b82f6"
                stroke="#fff"
                strokeWidth="2"
              />
            ))}

            {/* Orders line */}
            <path
              d={ordersLinePath}
              fill="none"
              stroke="#22c55e"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Orders data points (diamond markers) */}
            {ordersPoints.map((point, index) => (
              <polygon
                key={`orders-${index}`}
                points={`${point.x},${point.y - 4} ${point.x + 4},${point.y} ${point.x},${point.y + 4} ${point.x - 4},${point.y}`}
                fill="#22c55e"
                stroke="#fff"
                strokeWidth="1.5"
              />
            ))}
          </svg>
        </div>
        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className="text-sm text-gray-700 font-medium">Sales</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-sm text-gray-700 font-medium">Orders</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Layout */}
      <div className="hidden lg:flex h-screen overflow-hidden">
        {!sidebarCollapsed && (
          <div className="w-64 flex-shrink-0 bg-primary-500 h-screen overflow-y-auto">
            <Sidebar onClose={() => setSidebarCollapsed(true)} currentPage="analyticsSales" />
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
              {/* Header Section */}
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Analytics & Reports</h1>
                <p className="text-xs text-gray-500 mt-1">Dashboard • Sales Overview</p>
              </div>

              {/* Sales Overview Card */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                {/* Card Header */}
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Sales Overview</h2>
                    <p className="text-sm text-gray-500 mt-1">Track your sales performance and insights</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="px-3 py-2 text-sm rounded-md border border-gray-300 bg-white flex items-center gap-2 text-gray-700 hover:bg-gray-50">
                      <Calendar size={16} />
                      Today
                      <ChevronDown size={16} className="text-gray-500" />
                    </button>
                    <button className="px-3 py-2 text-sm rounded-md bg-orange-500 text-white flex items-center gap-2 hover:bg-orange-600">
                      <Download size={16} />
                      PDF
                    </button>
                    <button className="px-3 py-2 text-sm rounded-md border border-gray-300 bg-white flex items-center gap-2 text-gray-700 hover:bg-gray-50">
                      <Table size={16} />
                      Excel
                    </button>
                    <button className="px-3 py-2 text-sm rounded-md border border-gray-300 bg-white flex items-center gap-2 text-gray-700 hover:bg-gray-50">
                      <FileText size={16} />
                      CSV
                    </button>
                  </div>
                </div>

                {/* Key Metrics Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  {/* Total Sales Card */}
                  <div className="bg-green-50 rounded-lg border border-green-100 p-4 relative">
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                        <DollarSign size={20} className="text-white" />
                      </div>
                      <div className="flex items-center gap-1">
                        <TrendingUp size={14} className="text-green-600" />
                        <span className="text-xs font-medium text-green-600">12.5%</span>
                      </div>
                    </div>
                    <p className="text-2xl font-semibold text-gray-900">$12,540</p>
                    <p className="text-sm text-gray-600 mt-1">Total Sales</p>
                  </div>

                  {/* Total Orders Card */}
                  <div className="bg-white rounded-lg border border-gray-200 p-4 relative">
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                        <ShoppingCart size={20} className="text-white" />
                      </div>
                      <div className="flex items-center gap-1">
                        <TrendingUp size={14} className="text-green-600" />
                        <span className="text-xs font-medium text-green-600">8.2%</span>
                      </div>
                    </div>
                    <p className="text-2xl font-semibold text-gray-900">452</p>
                    <p className="text-sm text-gray-600 mt-1">Total Orders</p>
                  </div>

                  {/* Average Order Value Card */}
                  <div className="bg-white rounded-lg border border-gray-200 p-4 relative">
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                        <DollarSign size={20} className="text-white" />
                      </div>
                      <div className="flex items-center gap-1">
                        <TrendingUp size={14} className="text-green-600" />
                        <span className="text-xs font-medium text-green-600">4.1%</span>
                      </div>
                    </div>
                    <p className="text-2xl font-semibold text-gray-900">$27.75</p>
                    <p className="text-sm text-gray-600 mt-1">Average Order Value</p>
                  </div>

                  {/* Refunded Orders Card */}
                  <div className="bg-white rounded-lg border border-gray-200 p-4 relative">
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                        <RefreshCw size={20} className="text-white" />
                      </div>
                      <div className="flex items-center gap-1">
                        <TrendingUp size={14} className="text-red-600 rotate-180" />
                        <span className="text-xs font-medium text-red-600">-2%</span>
                      </div>
                    </div>
                    <p className="text-2xl font-semibold text-gray-900">14</p>
                    <p className="text-sm text-gray-600 mt-1">Refunded Orders</p>
                  </div>
                </div>

              </div>

              {/* Sales Performance Section (Full Width) */}
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Sales Performance</h3>
                  <div className="flex items-center gap-2">
                    {['Daily', 'Weekly', 'Monthly'].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setSelectedPeriod(tab)}
                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                          selectedPeriod === tab
                            ? 'bg-primary-500 text-white'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                </div>
                {renderSalesChart(currentData, selectedPeriod)}
              </div>

              {/* Orders Breakdown and Revenue by Category */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Orders Breakdown */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">Orders Breakdown</h3>
                  <div className="flex flex-col items-center justify-center">
                    <div className="flex items-center justify-center mb-4 relative">
                      <svg viewBox="0 0 280 280" className="w-full max-w-[280px] h-auto">
                        {/* Pie Chart - Full Circle */}
                        {/* Center: (140, 140), Radius: 80 */}
                        {/* Calculations: Cancelled 2% (7.2°), Pending 5.5% (19.8°), Completed 92.5% (333°) */}
                        {/* Cancelled - 2% (7.2°) - Smallest slice, red, at top */}
                        <path
                          d="M 140 60 A 80 80 0 0 1 150.03 60.49 L 140 140 Z"
                          fill="#ef4444"
                        />
                        {/* Pending - 5.5% (19.8°) - Orange slice, top-left */}
                        <path
                          d="M 140 140 L 150.03 60.49 A 80 80 0 0 1 167.09 66.95 L 140 140 Z"
                          fill="#f59e0b"
                        />
                        {/* Completed - 92.5% (333°) - Largest slice, green, the rest */}
                        <path
                          d="M 140 140 L 167.09 66.95 A 80 80 0 1 1 140 60 L 140 140 Z"
                          fill="#22c55e"
                        />
                        
                        {/* Label lines and text for Cancelled - top, pointing up */}
                        <line x1="145" y1="60.25" x2="145" y2="25" stroke="#fecaca" strokeWidth="1.5" />
                        <text x="150" y="22" fontSize="13" fill="#ef4444" textAnchor="start" fontWeight="500">Cancelled</text>
                        
                        {/* Label lines and text for Pending - left side */}
                        <line x1="167" y1="67" x2="105" y2="55" stroke="#fde68a" strokeWidth="1.5" />
                        <text x="100" y="52" fontSize="13" fill="#f59e0b" textAnchor="start" fontWeight="500">Pending</text>
                        
                        {/* Label lines and text for Completed - bottom-right */}
                        <line x1="120" y1="130" x2="220" y2="230" stroke="#a7f3d0" strokeWidth="1.5" />
                        <text x="225" y="233" fontSize="13" fill="#22c55e" textAnchor="start" fontWeight="500">Completed</text>
                      </svg>
                    </div>
                    {/* Completion Rate Text Below Chart */}
                    <div className="text-center mt-4">
                      <p className="text-xl font-semibold text-[#22c55e]">92.5% Completion Rate</p>
                    </div>
                  </div>
                </div>

                {/* Revenue by Category */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">Revenue by Category</h3>
                  <div className="flex items-center justify-center relative">
                    <svg viewBox="0 0 280 280" className="w-full max-w-[280px] h-auto">
                      {/* Pie Chart - Full Circle */}
                      {/* Center: (140, 140), Radius: 80, Starting from top (12 o'clock) */}
                      {/* Electronics - 47% (169.2°) - Largest slice, blue, from top (12 o'clock) to ~5 o'clock */}
                      <path
                        d="M 140 60 A 80 80 0 1 1 155.1 218.5 L 140 140 Z"
                        fill="#3B82F6"
                      />
                      {/* Fashion - 33% (118.8°) - Second largest, purple, from ~5 o'clock to ~9 o'clock */}
                      <path
                        d="M 140 140 L 155.1 218.5 A 80 80 0 0 1 63.9 115.0 L 140 140 Z"
                        fill="#8B5CF6"
                      />
                      {/* Home Appliances - 20% (72°) - Smallest, green, from ~9 o'clock to top (12 o'clock) */}
                      <path
                        d="M 140 140 L 63.9 115.0 A 80 80 0 0 1 140 60 L 140 140 Z"
                        fill="#10B981"
                      />
                      
                      {/* Label lines and text for Electronics - right side, connected to blue slice */}
                      <line x1="170" y1="135" x2="240" y2="140" stroke="#3B82F6" strokeWidth="1.5" />
                      <text x="245" y="145" fontSize="13" fill="#000000" textAnchor="start" fontWeight="bold">Electronics</text>
                      
                      {/* Label lines and text for Fashion - below-left, connected to purple slice */}
                      <line x1="88" y1="162" x2="95" y2="240" stroke="#8B5CF6" strokeWidth="1.5" />
                      <text x="100" y="245" fontSize="13" fill="#000000" textAnchor="start" fontWeight="bold">Fashion</text>
                      
                      {/* Label lines and text for Home Appliances - top-left, connected to green slice */}
                      <line x1="102" y1="85" x2="70" y2="35" stroke="#10B981" strokeWidth="1.5" />
                      <text x="65" y="30" fontSize="13" fill="#000000" textAnchor="start" fontWeight="bold">Home Appliances</text>
                    </svg>
                  </div>
                </div>
              </div>

              {/* Recent Sales and Insights & Highlights */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Sales */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Recent Sales</h3>
                    <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">View all</button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-2 text-xs font-medium text-gray-500 uppercase">Order ID</th>
                          <th className="text-left py-3 px-2 text-xs font-medium text-gray-500 uppercase">Date</th>
                          <th className="text-left py-3 px-2 text-xs font-medium text-gray-500 uppercase">Customer</th>
                          <th className="text-left py-3 px-2 text-xs font-medium text-gray-500 uppercase">Amount</th>
                          <th className="text-left py-3 px-2 text-xs font-medium text-gray-500 uppercase">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        <tr>
                          <td className="py-3 px-2"><a href="#" className="text-sm text-blue-600 hover:underline">#OR345</a></td>
                          <td className="py-3 px-2 text-sm text-gray-600">Today</td>
                          <td className="py-3 px-2 text-sm text-gray-600">John Smith</td>
                          <td className="py-3 px-2 text-sm font-medium text-gray-900">$54.00</td>
                          <td className="py-3 px-2"><span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">Completed</span></td>
                        </tr>
                        <tr>
                          <td className="py-3 px-2"><a href="#" className="text-sm text-blue-600 hover:underline">#OR344</a></td>
                          <td className="py-3 px-2 text-sm text-gray-600">Yesterday</td>
                          <td className="py-3 px-2 text-sm text-gray-600">Sarah Johnson</td>
                          <td className="py-3 px-2 text-sm font-medium text-gray-900">$12.50</td>
                          <td className="py-3 px-2"><span className="px-2 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-700">Pending</span></td>
                        </tr>
                        <tr>
                          <td className="py-3 px-2"><a href="#" className="text-sm text-blue-600 hover:underline">#OR343</a></td>
                          <td className="py-3 px-2 text-sm text-gray-600">2 days ago</td>
                          <td className="py-3 px-2 text-sm text-gray-600">Adam Black</td>
                          <td className="py-3 px-2 text-sm font-medium text-gray-900">$78.20</td>
                          <td className="py-3 px-2"><span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">Completed</span></td>
                        </tr>
                        <tr>
                          <td className="py-3 px-2"><a href="#" className="text-sm text-blue-600 hover:underline">#OR342</a></td>
                          <td className="py-3 px-2 text-sm text-gray-600">3 days ago</td>
                          <td className="py-3 px-2 text-sm text-gray-600">Lisa Wilson</td>
                          <td className="py-3 px-2 text-sm font-medium text-gray-900">$29.90</td>
                          <td className="py-3 px-2"><span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-700">Cancelled</span></td>
                        </tr>
                        <tr>
                          <td className="py-3 px-2"><a href="#" className="text-sm text-blue-600 hover:underline">#OR341</a></td>
                          <td className="py-3 px-2 text-sm text-gray-600">4 days ago</td>
                          <td className="py-3 px-2 text-sm text-gray-600">Tara Brown</td>
                          <td className="py-3 px-2 text-sm font-medium text-gray-900">$56.75</td>
                          <td className="py-3 px-2"><span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">Completed</span></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Insights & Highlights */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">Insights & Highlights</h3>
                  <div className="space-y-4">
                    {/* Weekly Growth */}
                    <div className="p-4 rounded-lg bg-green-50 border border-green-100">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <TrendingUp size={20} className="text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 mb-1">Weekly Growth</p>
                          <p className="text-sm text-gray-600">New customers increased by 10% compared to last week.</p>
                        </div>
                      </div>
                    </div>

                    {/* Top Category */}
                    <div className="p-4 rounded-lg bg-blue-50 border border-blue-100">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <Crown size={20} className="text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 mb-1">Top Category</p>
                          <p className="text-sm text-gray-600">Electronics remains the top-selling category.</p>
                        </div>
                      </div>
                    </div>

                    {/* Peak Hours */}
                    <div className="p-4 rounded-lg bg-purple-50 border border-purple-100">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <Bell size={20} className="text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 mb-1">Peak Hours</p>
                          <p className="text-sm text-gray-600">Most sales occur between 2 PM and 5 PM.</p>
                        </div>
                      </div>
                    </div>

                    {/* Customer Retention */}
                    <div className="p-4 rounded-lg bg-orange-50 border border-orange-100">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <Users size={20} className="text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 mb-1">Customer Retention</p>
                          <p className="text-sm text-gray-600">Improved customer retention by 5% this month.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden">
        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 z-[45] bg-black bg-opacity-50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        
        {/* Mobile Sidebar */}
        <div className={`
          fixed inset-y-0 left-0 z-[60] w-64 transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <Sidebar onClose={() => setSidebarOpen(false)} currentPage="analyticsSales" />
        </div>

        {/* Mobile Main Content */}
        <div className="flex-1 flex flex-col min-h-screen bg-gray-50 pt-20 lg:pt-0">
          <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} isSidebarOpen={sidebarOpen} />
          <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 space-y-6">
            {/* Header Section */}
            <div>
              <h1 className="text-xl font-bold text-gray-900">Analytics & Reports</h1>
              <p className="text-xs text-gray-500 mt-1">Dashboard • Sales Overview</p>
            </div>

            {/* Sales Overview Card */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              {/* Card Header */}
              <div className="flex flex-col gap-3 mb-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Sales Overview</h2>
                  <p className="text-sm text-gray-500 mt-1">Track your sales performance and insights</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button className="px-3 py-2 text-sm rounded-md border border-gray-300 bg-white flex items-center gap-2 text-gray-700">
                    <Calendar size={16} />
                    Today
                    <ChevronDown size={16} className="text-gray-500" />
                  </button>
                  <button className="px-3 py-2 text-sm rounded-md bg-orange-500 text-white flex items-center gap-2">
                    <Download size={16} />
                    PDF
                  </button>
                  <button className="px-3 py-2 text-sm rounded-md border border-gray-300 bg-white flex items-center gap-2 text-gray-700">
                    <Table size={16} />
                    Excel
                  </button>
                  <button className="px-3 py-2 text-sm rounded-md border border-gray-300 bg-white flex items-center gap-2 text-gray-700">
                    <FileText size={16} />
                    CSV
                  </button>
                </div>
              </div>

              {/* Key Metrics Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                {/* Total Sales Card */}
                <div className="bg-green-50 rounded-lg border border-green-100 p-4 relative">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                      <DollarSign size={20} className="text-white" />
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp size={14} className="text-green-600" />
                      <span className="text-xs font-medium text-green-600">12.5%</span>
                    </div>
                  </div>
                  <p className="text-2xl font-semibold text-gray-900">$12,540</p>
                  <p className="text-sm text-gray-600 mt-1">Total Sales</p>
                </div>

              {/* Total Orders Card */}
              <div className="bg-white rounded-lg border border-gray-200 p-4 relative">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                    <ShoppingCart size={20} className="text-white" />
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingUp size={14} className="text-green-600" />
                    <span className="text-xs font-medium text-green-600">8.2%</span>
                  </div>
                </div>
                <p className="text-2xl font-semibold text-gray-900">452</p>
                <p className="text-sm text-gray-600 mt-1">Total Orders</p>
              </div>

              {/* Average Order Value Card */}
              <div className="bg-white rounded-lg border border-gray-200 p-4 relative">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                    <TrendingUp size={20} className="text-white" />
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingUp size={14} className="text-green-600" />
                    <span className="text-xs font-medium text-green-600">4.1%</span>
                  </div>
                </div>
                <p className="text-2xl font-semibold text-gray-900">$27.75</p>
                <p className="text-sm text-gray-600 mt-1">Average Order Value</p>
              </div>

              {/* Refunded Orders Card */}
              <div className="bg-white rounded-lg border border-gray-200 p-4 relative">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                    <RefreshCw size={20} className="text-white" />
                  </div>
                  <div>
                    <span className="text-xs font-medium text-red-600">3.1%</span>
                  </div>
                </div>
                <p className="text-2xl font-semibold text-gray-900">14</p>
                <p className="text-sm text-gray-600 mt-1">Refunded Orders</p>
              </div>
            </div>
            </div>

            {/* Sales Performance Section */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-3">
                <h3 className="text-lg font-semibold text-gray-900">Sales Performance</h3>
                <div className="flex items-center gap-2">
                {['Daily', 'Weekly', 'Monthly'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setSelectedPeriod(tab)}
                    className={`px-4 py-1.5 text-sm font-medium rounded-full transition-colors ${
                      selectedPeriod === tab
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>
              {renderSalesChart(currentData, selectedPeriod)}
            </div>

            {/* Orders Breakdown and Revenue by Category */}
            <div className="grid grid-cols-1 gap-6">
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Orders Breakdown</h3>
                <div className="flex flex-col items-center justify-center">
                  <div className="flex items-center justify-center mb-4 relative">
                  <svg viewBox="0 0 280 280" className="w-full max-w-[280px] h-auto">
                    {/* Pie Chart - Full Circle */}
                    {/* Center: (140, 140), Radius: 80 */}
                    {/* Calculations: Cancelled 2% (7.2°), Pending 5.5% (19.8°), Completed 92.5% (333°) */}
                    {/* Cancelled - 2% (7.2°) - Smallest slice, red, at top */}
                    <path
                      d="M 140 60 A 80 80 0 0 1 150.03 60.49 L 140 140 Z"
                      fill="#ef4444"
                    />
                    {/* Pending - 5.5% (19.8°) - Orange slice, top-left */}
                    <path
                      d="M 140 140 L 150.03 60.49 A 80 80 0 0 1 167.09 66.95 L 140 140 Z"
                      fill="#f59e0b"
                    />
                    {/* Completed - 92.5% (333°) - Largest slice, green, the rest */}
                    <path
                      d="M 140 140 L 167.09 66.95 A 80 80 0 1 1 140 60 L 140 140 Z"
                      fill="#22c55e"
                    />
                    
                    {/* Label lines and text for Cancelled - top, pointing up */}
                    <line x1="145" y1="60.25" x2="145" y2="25" stroke="#fecaca" strokeWidth="1.5" />
                    <text x="150" y="22" fontSize="13" fill="#ef4444" textAnchor="start" fontWeight="500">Cancelled</text>
                    
                    {/* Label lines and text for Pending - left side */}
                    <line x1="167" y1="67" x2="105" y2="55" stroke="#fde68a" strokeWidth="1.5" />
                    <text x="100" y="52" fontSize="13" fill="#f59e0b" textAnchor="start" fontWeight="500">Pending</text>
                    
                    {/* Label lines and text for Completed - bottom-right */}
                    <line x1="120" y1="130" x2="220" y2="230" stroke="#a7f3d0" strokeWidth="1.5" />
                    <text x="225" y="233" fontSize="13" fill="#22c55e" textAnchor="start" fontWeight="500">Completed</text>
                  </svg>
                </div>
                {/* Completion Rate Text Below Chart */}
                <div className="text-center mt-4">
                  <p className="text-xl font-semibold text-[#22c55e]">92.5% Completion Rate</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue by Category</h3>
              <div className="flex items-center justify-center relative">
                <svg viewBox="0 0 280 280" className="w-full max-w-[280px] h-auto">
                  {/* Pie Chart - Full Circle */}
                  {/* Center: (140, 140), Radius: 80, Starting from top (12 o'clock) */}
                  {/* Electronics - 47% (169.2°) - Largest slice, blue, from top (12 o'clock) to ~5 o'clock */}
                  <path
                    d="M 140 60 A 80 80 0 1 1 155.1 218.5 L 140 140 Z"
                    fill="#3B82F6"
                  />
                  {/* Fashion - 33% (118.8°) - Second largest, purple, from ~5 o'clock to ~9 o'clock */}
                  <path
                    d="M 140 140 L 155.1 218.5 A 80 80 0 0 1 63.9 115.0 L 140 140 Z"
                    fill="#8B5CF6"
                  />
                  {/* Home Appliances - 20% (72°) - Smallest, green, from ~9 o'clock to top (12 o'clock) */}
                  <path
                    d="M 140 140 L 63.9 115.0 A 80 80 0 0 1 140 60 L 140 140 Z"
                    fill="#10B981"
                  />
                  
                  {/* Label lines and text for Electronics - right side, connected to blue slice */}
                  <line x1="170" y1="135" x2="240" y2="140" stroke="#3B82F6" strokeWidth="1.5" />
                  <text x="245" y="145" fontSize="13" fill="#000000" textAnchor="start" fontWeight="bold">Electronics</text>
                  
                  {/* Label lines and text for Fashion - below-left, connected to purple slice */}
                  <line x1="88" y1="162" x2="95" y2="240" stroke="#8B5CF6" strokeWidth="1.5" />
                  <text x="100" y="245" fontSize="13" fill="#000000" textAnchor="start" fontWeight="bold">Fashion</text>
                  
                  {/* Label lines and text for Home Appliances - top-left, connected to green slice */}
                  <line x1="102" y1="85" x2="70" y2="35" stroke="#10B981" strokeWidth="1.5" />
                  <text x="65" y="30" fontSize="13" fill="#000000" textAnchor="start" fontWeight="bold">Home Appliances</text>
                </svg>
              </div>
            </div>
          </div>

          {/* Recent Sales and Insights */}
          <div className="grid grid-cols-1 gap-6">
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Recent Sales</h3>
                <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">View all</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[600px]">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 px-2 text-xs font-medium text-gray-500 uppercase">Order ID</th>
                      <th className="text-left py-2 px-2 text-xs font-medium text-gray-500 uppercase">Date</th>
                      <th className="text-left py-2 px-2 text-xs font-medium text-gray-500 uppercase">Customer</th>
                      <th className="text-left py-2 px-2 text-xs font-medium text-gray-500 uppercase">Amount</th>
                      <th className="text-left py-2 px-2 text-xs font-medium text-gray-500 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr>
                      <td className="py-2 px-2"><a href="#" className="text-sm text-blue-600 hover:underline">#82647</a></td>
                      <td className="py-2 px-2 text-sm text-gray-600">Today</td>
                      <td className="py-2 px-2 text-sm text-gray-600">John Smith</td>
                      <td className="py-2 px-2 text-sm font-medium text-gray-900">$45.00</td>
                      <td className="py-2 px-2"><span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">Completed</span></td>
                    </tr>
                    <tr>
                      <td className="py-2 px-2"><a href="#" className="text-sm text-blue-600 hover:underline">#82646</a></td>
                      <td className="py-2 px-2 text-sm text-gray-600">Yesterday</td>
                      <td className="py-2 px-2 text-sm text-gray-600">Sarah Johnson</td>
                      <td className="py-2 px-2 text-sm font-medium text-gray-900">$32.50</td>
                      <td className="py-2 px-2"><span className="px-2 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-700">Pending</span></td>
                    </tr>
                    <tr>
                      <td className="py-2 px-2"><a href="#" className="text-sm text-blue-600 hover:underline">#82645</a></td>
                      <td className="py-2 px-2 text-sm text-gray-600">2 days ago</td>
                      <td className="py-2 px-2 text-sm text-gray-600">Adam Black</td>
                      <td className="py-2 px-2 text-sm font-medium text-gray-900">$78.20</td>
                      <td className="py-2 px-2"><span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">Completed</span></td>
                    </tr>
                    <tr>
                      <td className="py-2 px-2"><a href="#" className="text-sm text-blue-600 hover:underline">#82644</a></td>
                      <td className="py-2 px-2 text-sm text-gray-600">3 days ago</td>
                      <td className="py-2 px-2 text-sm text-gray-600">Lisa Wilson</td>
                      <td className="py-2 px-2 text-sm font-medium text-gray-900">$29.90</td>
                      <td className="py-2 px-2"><span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-700">Cancelled</span></td>
                    </tr>
                    <tr>
                      <td className="py-2 px-2"><a href="#" className="text-sm text-blue-600 hover:underline">#82643</a></td>
                      <td className="py-2 px-2 text-sm text-gray-600">4 days ago</td>
                      <td className="py-2 px-2 text-sm text-gray-600">Tara Brown</td>
                      <td className="py-2 px-2 text-sm font-medium text-gray-900">$56.75</td>
                      <td className="py-2 px-2"><span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">Completed</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Insights & Highlights</h3>
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-green-50 border border-green-100">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <TrendingUp size={18} className="text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 mb-1 text-sm">Weekly Growth</p>
                      <p className="text-xs text-gray-600">Your sales increased by 5% compared to last week.</p>
                    </div>
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-blue-50 border border-blue-100">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <Crown size={18} className="text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 mb-1 text-sm">Top Category</p>
                      <p className="text-xs text-gray-600">Electronics sales increased by $2,450 this month.</p>
                    </div>
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-orange-50 border border-orange-100">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <Bell size={18} className="text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 mb-1 text-sm">Pending Orders</p>
                      <p className="text-xs text-gray-600">You have 15 new orders awaiting fulfillment.</p>
                    </div>
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-purple-50 border border-purple-100">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <Users size={18} className="text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 mb-1 text-sm">Customer Retention</p>
                      <p className="text-xs text-gray-600">8% of customers made repeat purchases.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      </div>
    </div>
  )
}




