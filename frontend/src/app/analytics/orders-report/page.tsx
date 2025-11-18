'use client'

import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'
import { useState } from 'react'
import { Menu, Calendar, ChevronDown, Download, ShoppingCart, CheckCircle2, Clock, X } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

export default function OrdersReportPage() {
  const { t } = useLanguage()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [activeDateRange, setActiveDateRange] = useState('Last 7 Days')
  const [activeTrendTab, setActiveTrendTab] = useState('Daily')

  // Chart data for different time periods
  const chartData = {
    Daily: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      values: [45, 52, 38, 65, 49, 72, 58]
    },
    Weekly: {
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      values: [55, 62, 48, 68]
    },
    Monthly: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      values: [60, 55, 70, 65, 75, 68]
    }
  }

  const currentData = chartData[activeTrendTab as keyof typeof chartData]

  // Helper function to create donut chart arc
  const createDonutArc = (startAngle: number, endAngle: number, outerRadius: number, innerRadius: number) => {
    const centerX = 100
    const centerY = 100
    
    const toRadians = (angle: number) => (angle * Math.PI) / 180
    
    const startAngleRad = toRadians(startAngle)
    const endAngleRad = toRadians(endAngle)
    
    const x1 = centerX + outerRadius * Math.cos(startAngleRad)
    const y1 = centerY + outerRadius * Math.sin(startAngleRad)
    const x2 = centerX + outerRadius * Math.cos(endAngleRad)
    const y2 = centerY + outerRadius * Math.sin(endAngleRad)
    
    const x3 = centerX + innerRadius * Math.cos(endAngleRad)
    const y3 = centerY + innerRadius * Math.sin(endAngleRad)
    const x4 = centerX + innerRadius * Math.cos(startAngleRad)
    const y4 = centerY + innerRadius * Math.sin(startAngleRad)
    
    const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0
    
    return `M ${x1} ${y1} A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${x2} ${y2} L ${x3} ${y3} A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x4} ${y4} Z`
  }

  // Helper function to render the chart
  const renderChart = (data: typeof currentData) => {
    const chartWidth = 600
    const chartHeight = 180
    const padding = { top: 20, right: 40, bottom: 40, left: 50 }
    const graphWidth = chartWidth - padding.left - padding.right
    const graphHeight = chartHeight - padding.top - padding.bottom

    const minY = 30
    const maxY = 80
    const yRange = maxY - minY

    // Calculate positions
    const xStep = graphWidth / (data.labels.length - 1)
    const points = data.values.map((value, index) => {
      const x = padding.left + index * xStep
      const y = padding.top + graphHeight - ((value - minY) / yRange) * graphHeight
      return { x, y, value }
    })

    // Create path for line
    const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')

    // Y-axis labels and grid lines
    const yLabels = [30, 40, 50, 60, 70, 80]
    const gridLines = yLabels.map((label) => {
      const y = padding.top + graphHeight - ((label - minY) / yRange) * graphHeight
      return { y, label }
    })

    return (
      <div className="w-full overflow-x-auto">
        <div className="min-w-[320px]">
          <svg 
            viewBox={`0 0 ${chartWidth} ${chartHeight}`} 
            className="w-full h-40 sm:h-44 md:h-48 lg:h-52 max-h-[300px]" 
            preserveAspectRatio="xMidYMid meet"
          >
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
                  fontSize="10"
                  className="font-medium"
                >
                  {grid.label}
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
                  fontSize="10"
                  className="font-medium"
                >
                  {label}
                </text>
              )
            })}

            {/* Line */}
            <path
              d={linePath}
              fill="none"
              stroke="#3b82f6"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Data points (circles) */}
            {points.map((point, index) => (
              <circle
                key={index}
                cx={point.x}
                cy={point.y}
                r="4"
                fill="#3b82f6"
                stroke="#fff"
                strokeWidth="2"
              />
            ))}
          </svg>
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
            <Sidebar onClose={() => setSidebarCollapsed(true)} currentPage="analyticsOrders" />
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
              <div className="mb-6">
                <h2 className="text-lg font-bold text-gray-900">{t('analyticsReports')}</h2>
                <p className="text-sm text-gray-500 mt-0.5">{t('dashboard')} - {t('ordersReport')}</p>
              </div>

              {/* Title and actions */}
              <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-1">{t('ordersReport')}</h1>
                  <p className="text-sm text-gray-500">{t('deepInsightsOrderVolume')}</p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {['Today', 'Last 7 Days', 'This Month', 'Custom'].map((range) => (
                    <button
                      key={range}
                      onClick={() => setActiveDateRange(range)}
                      className={`px-4 py-2 text-sm rounded-md transition-colors ${
                        activeDateRange === range
                          ? 'bg-gray-200 text-gray-900 font-medium'
                          : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {range === 'Today' ? t('today') : range === 'Last 7 Days' ? t('last7Days') : range === 'This Month' ? t('thisMonth') : t('customRange')}
                  </button>
                  ))}
                  <button className="px-4 py-2 text-sm rounded-md bg-orange-500 text-white flex items-center gap-2 hover:bg-orange-600 shadow-sm">
                    <Download size={16} />
                    {t('export')}
                  </button>
                </div>
              </div>

              {/* KPI cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { 
                    label: t('totalOrders'), 
                    value: '780', 
                    chip: `+12% ${t('fromLastMonth')}`, 
                    chipColor: 'text-green-600',
                    icon: ShoppingCart, 
                    iconBg: 'bg-blue-100',
                    iconColor: 'text-blue-600'
                  },
                  { 
                    label: t('completedOrders'), 
                    value: '620', 
                    chip: `+8% ${t('fromLastMonth')}`, 
                    chipColor: 'text-green-600',
                    icon: CheckCircle2, 
                    iconBg: 'bg-green-100',
                    iconColor: 'text-green-600'
                  },
                  { 
                    label: t('pendingOrders'), 
                    value: '110', 
                    chip: `-5% ${t('fromLastMonth')}`, 
                    chipColor: 'text-red-600',
                    icon: Clock, 
                    iconBg: 'bg-yellow-100',
                    iconColor: 'text-yellow-600'
                  },
                  { 
                    label: t('cancelledOrders'), 
                    value: '50', 
                    chip: `+3% ${t('fromLastMonth')}`, 
                    chipColor: 'text-red-600',
                    icon: X, 
                    iconBg: 'bg-red-100',
                    iconColor: 'text-red-600'
                  }
                ].map((k, i) => (
                  <div key={i} className="bg-white rounded-lg border border-gray-200 shadow-sm p-5 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <p className="text-sm text-gray-700">{k.label}</p>
                      <div className={`w-10 h-10 ${k.iconBg} rounded-full flex items-center justify-center flex-shrink-0`}>
                        <k.icon className={k.iconColor} size={20} />
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-gray-900 mb-2">{k.value}</p>
                    <p className={`text-xs font-medium ${k.chipColor}`}>{k.chip}</p>
                  </div>
                ))}
              </div>

              {/* Trends and fulfillment */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 shadow-sm">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-4 sm:px-6 py-4 border-b border-gray-200">
                    <h2 className="text-sm font-semibold text-gray-900">{t('orderTrends')}</h2>
                    <div className="flex items-center gap-1 w-full sm:w-auto">
                      {['Daily', 'Weekly', 'Monthly'].map((tab) => (
                        <button
                          key={tab}
                          onClick={() => setActiveTrendTab(tab)}
                          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex-1 sm:flex-none ${
                            activeTrendTab === tab
                              ? 'bg-gray-100 text-gray-900'
                              : 'bg-transparent text-gray-500 hover:text-gray-700'
                          }`}
                        >
                          {t(tab.toLowerCase())}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="p-4 sm:p-6">
                    {renderChart(currentData)}
                  </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 sm:p-6">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">{t('orderFulfillmentRate')}</h3>
                  <div className="flex flex-col items-center justify-center">
                    {/* Gauge Chart */}
                    <div className="relative w-full max-w-[280px] mb-4">
                      <svg viewBox="0 0 200 120" className="w-full h-auto" preserveAspectRatio="xMidYMid meet">
                        {/* Background arc (gray) - full semi-circle */}
                        <path
                          d="M 20 100 A 80 80 0 0 1 180 100"
                          fill="none"
                          stroke="#e5e7eb"
                          strokeWidth="16"
                          strokeLinecap="round"
                        />
                        {/* Filled arc (orange) - 92% of 180 degrees = 165.6 degrees from left */}
                        {/* Center: (100, 100), radius: 80, start at left (20, 100) */}
                        {/* 92% of 180° = 165.6°, so end angle = 180° - 165.6° = 14.4° from positive x-axis */}
                        {/* End point: x = 100 + 80*cos(14.4°), y = 100 - 80*sin(14.4°) */}
                        {/* cos(14.4°) ≈ 0.968, sin(14.4°) ≈ 0.249 */}
                        {/* x ≈ 177.44, y ≈ 80.08 */}
                        <path
                          d="M 20 100 A 80 80 0 0 1 177.44 80.08"
                          fill="none"
                          stroke="#f59e0b"
                          strokeWidth="16"
                          strokeLinecap="round"
                        />
                        {/* Scale labels */}
                        <text
                          x="12"
                          y="115"
                          textAnchor="start"
                          fill="#6b7280"
                          fontSize="12"
                          className="font-medium"
                        >
                          0
                        </text>
                        <text
                          x="188"
                          y="115"
                          textAnchor="end"
                          fill="#6b7280"
                          fontSize="12"
                          className="font-medium"
                        >
                          100
                        </text>
                    </svg>
                    </div>
                    {/* Percentage value */}
                    <p className="text-4xl sm:text-5xl font-bold text-[#f59e0b] mb-2">92%</p>
                    {/* Contextual text */}
                    <p className="text-sm text-gray-600">{t('fulfillmentRateThisMonth')}</p>
                  </div>
                </div>
              </div>

              {/* Top customers & refunds */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 shadow-sm p-4 sm:p-6">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">{t('topCustomers')}</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left border-b border-gray-200">
                          <th className="py-3 px-2 text-xs font-medium text-gray-500">{t('customerName')}</th>
                          <th className="py-3 px-2 text-xs font-medium text-gray-500">{t('totalOrders')}</th>
                          <th className="py-3 px-2 text-xs font-medium text-gray-500">{t('totalSpend')}</th>
                          <th className="py-3 px-2 text-xs font-medium text-gray-500">{t('lastOrder')}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {[
                          { name: 'John Smith', orders: 45, total: '$3,200', last: `2 ${t('daysAgo')}` },
                          { name: 'Sarah Johnson', orders: 38, total: '$2,850', last: `1 ${t('daysAgo')}` },
                          { name: 'Mike Davis', orders: 32, total: '$2,400', last: `3 ${t('daysAgo')}` }
                        ].map((c: { name: string; orders: number; total: string; last: string }) => (
                          <tr key={c.name} className="hover:bg-gray-50 transition-colors">
                            <td className="py-3 px-2">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex-shrink-0" />
                                <span className="font-medium text-gray-900">{c.name}</span>
                              </div>
                            </td>
                            <td className="py-3 px-2 text-gray-700">{c.orders}</td>
                            <td className="py-3 px-2 font-medium text-gray-900">{c.total}</td>
                            <td className="py-3 px-2 text-gray-600">{c.last}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 sm:p-6">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">{t('refundsReturns')}</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">{t('totalRefundRequests')}</span>
                      <span className="text-sm font-medium text-gray-900">30</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">{t('approvedRefunds')}</span>
                      <span className="text-sm font-medium text-green-600">24</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">{t('refundAmount')}</span>
                      <span className="text-sm font-medium text-gray-900">$1,450</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">{t('approvalRate')}</span>
                      <span className="text-sm font-medium text-gray-900">80%</span>
                    </div>
                    {/* Progress bar */}
                    <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 rounded-full" style={{ width: '80%' }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Status breakdown & recent orders */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 sm:p-6">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">{t('orderStatusBreakdown')}</h3>
                  <div className="flex flex-col items-center justify-center">
                    {/* Donut Chart */}
                    <svg viewBox="0 0 200 200" className="w-48 h-48 sm:w-56 sm:h-56" preserveAspectRatio="xMidYMid meet">
                      {/* Center: (100, 100), Outer radius: 80, Inner radius: 50 */}
                      {/* Completed: 65% (green) - starts from top (-90°) */}
                      <path
                        d={createDonutArc(-90, -90 + (65 * 360 / 100), 80, 50)}
                        fill="#22c55e"
                        stroke="white"
                        strokeWidth="2"
                      />
                      {/* Pending: 20% (orange) - continues from 65% */}
                      <path
                        d={createDonutArc(-90 + (65 * 360 / 100), -90 + (85 * 360 / 100), 80, 50)}
                        fill="#f59e0b"
                        stroke="white"
                        strokeWidth="2"
                      />
                      {/* Cancelled: 15% (red) - continues from 85% */}
                      <path
                        d={createDonutArc(-90 + (85 * 360 / 100), -90 + 360, 80, 50)}
                        fill="#ef4444"
                        stroke="white"
                        strokeWidth="2"
                      />
                    </svg>
                    {/* Legend */}
                    <div className="mt-4 flex flex-row items-center justify-center gap-4 sm:gap-6 flex-wrap">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-green-500 flex-shrink-0"></div>
                        <span className="text-sm text-gray-700">{t('completed')}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-orange-500 flex-shrink-0"></div>
                        <span className="text-sm text-gray-700">{t('pending')}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500 flex-shrink-0"></div>
                        <span className="text-sm text-gray-700">{t('cancelled')}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 shadow-sm p-4 sm:p-6">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">{t('recentOrders')}</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left border-b border-gray-200">
                          <th className="py-3 px-2 text-xs font-medium text-gray-500">{t('orderId')}</th>
                          <th className="py-3 px-2 text-xs font-medium text-gray-500">{t('date')}</th>
                          <th className="py-3 px-2 text-xs font-medium text-gray-500">{t('customer')}</th>
                          <th className="py-3 px-2 text-xs font-medium text-gray-500">{t('amount')}</th>
                          <th className="py-3 px-2 text-xs font-medium text-gray-500">{t('status')}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {[
                          {id:'#ORD-001',date:'Dec 28, 2024',name:'John Smith',amount:'$125.00',status:'Completed'},
                          {id:'#ORD-002',date:'Dec 28, 2024',name:'Sarah Johnson',amount:'$89.50',status:'Pending'},
                          {id:'#ORD-003',date:'Dec 27, 2024',name:'Mike Davis',amount:'$245.00',status:'Completed'}
                        ].map((o: { id: string; date: string; name: string; amount: string; status: string }) => (
                          <tr key={o.id} className="hover:bg-gray-50 transition-colors">
                            <td className="py-3 px-2">
                              <a href="#" className="text-blue-600 hover:text-blue-800 underline text-sm font-medium">
                                {o.id}
                              </a>
                            </td>
                            <td className="py-3 px-2 text-gray-700">{o.date}</td>
                            <td className="py-3 px-2 text-gray-700">{o.name}</td>
                            <td className="py-3 px-2 text-gray-700">{o.amount}</td>
                            <td className="py-3 px-2">
                              <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                                o.status === 'Completed' 
                                  ? 'bg-green-100 text-green-700' 
                                  : o.status === 'Pending'
                                  ? 'bg-yellow-100 text-yellow-700'
                                  : 'bg-red-100 text-red-700'
                              }`}>
                                {o.status === 'Completed' ? t('completed') : o.status === 'Pending' ? t('pending') : t('cancelled')}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden">
        {sidebarOpen && (
          <div className="fixed inset-0 z-50">
            <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
            <div className="absolute left-0 top-0 bottom-0 w-64 bg-primary-500">
              <Sidebar onClose={() => setSidebarOpen(false)} currentPage="analyticsOrders" />
            </div>
          </div>
        )}

        <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
          <Header onToggleSidebar={() => setSidebarOpen(true)} isSidebarOpen={sidebarOpen} />
        </div>
        <main className="mt-14 p-4 sm:p-6 space-y-6">
          {/* Header Section */}
          <div className="mb-4">
            <h2 className="text-base sm:text-lg font-bold text-gray-900">{t('analyticsReports')}</h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">{t('dashboard')} - {t('ordersReport')}</p>
          </div>

          {/* Title and actions */}
          <div className="mb-6">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">{t('ordersReport')}</h1>
            <p className="text-xs sm:text-sm text-gray-500">{t('deepInsightsOrderVolume')}</p>
          </div>

          {/* Date Range Buttons */}
          <div className="flex items-center gap-2 flex-wrap mb-4">
            {['Today', 'Last 7 Days', 'This Month', 'Custom'].map((range) => (
              <button
                key={range}
                onClick={() => setActiveDateRange(range)}
                className={`px-3 sm:px-4 py-2 text-xs sm:text-sm rounded-md transition-colors ${
                  activeDateRange === range
                    ? 'bg-gray-200 text-gray-900 font-medium'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {range === 'Today' ? t('today') : range === 'Last 7 Days' ? t('last7Days') : range === 'This Month' ? t('thisMonth') : t('customRange')}
              </button>
            ))}
            <button className="px-3 sm:px-4 py-2 text-xs sm:text-sm rounded-md bg-orange-500 text-white flex items-center gap-2 hover:bg-orange-600 shadow-sm">
              <Download size={16} />
              {t('export')}
            </button>
          </div>

          {/* KPI cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { 
                label: t('totalOrders'), 
                value: '780', 
                chip: `+12% ${t('fromLastMonth')}`, 
                chipColor: 'text-green-600',
                icon: ShoppingCart, 
                iconBg: 'bg-blue-100',
                iconColor: 'text-blue-600'
              },
              { 
                label: t('completedOrders'), 
                value: '620', 
                chip: `+8% ${t('fromLastMonth')}`, 
                chipColor: 'text-green-600',
                icon: CheckCircle2, 
                iconBg: 'bg-green-100',
                iconColor: 'text-green-600'
              },
              { 
                label: t('pendingOrders'), 
                value: '110', 
                chip: `-5% ${t('fromLastMonth')}`, 
                chipColor: 'text-red-600',
                icon: Clock, 
                iconBg: 'bg-yellow-100',
                iconColor: 'text-yellow-600'
              },
              { 
                label: t('cancelledOrders'), 
                value: '50', 
                chip: `+3% ${t('fromLastMonth')}`, 
                chipColor: 'text-red-600',
                icon: X, 
                iconBg: 'bg-red-100',
                iconColor: 'text-red-600'
              }
            ].map((k, i) => (
              <div key={i} className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 sm:p-5 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <p className="text-xs sm:text-sm text-gray-700">{k.label}</p>
                  <div className={`w-10 h-10 ${k.iconBg} rounded-full flex items-center justify-center flex-shrink-0`}>
                    <k.icon className={k.iconColor} size={20} />
                  </div>
                </div>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">{k.value}</p>
                <p className={`text-xs font-medium ${k.chipColor}`}>{k.chip}</p>
              </div>
            ))}
          </div>

          {/* Order Trends */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
              <h2 className="text-sm font-semibold text-gray-900">{t('orderTrends')}</h2>
              <div className="flex items-center gap-1 w-full sm:w-auto">
                {['Daily', 'Weekly', 'Monthly'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTrendTab(tab)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex-1 sm:flex-none ${
                      activeTrendTab === tab
                        ? 'bg-gray-100 text-gray-900'
                        : 'bg-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {t(tab.toLowerCase())}
                  </button>
                ))}
              </div>
            </div>
            <div className="p-4 sm:p-6">
              {renderChart(currentData)}
            </div>
          </div>

          {/* Fulfillment Rate */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 sm:p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">{t('orderFulfillmentRate')}</h3>
            <div className="flex flex-col items-center justify-center">
              {/* Gauge Chart */}
              <div className="relative w-full max-w-[280px] mb-4">
                <svg viewBox="0 0 200 120" className="w-full h-auto" preserveAspectRatio="xMidYMid meet">
                  {/* Background arc (gray) - full semi-circle */}
                  <path
                    d="M 20 100 A 80 80 0 0 1 180 100"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="16"
                    strokeLinecap="round"
                  />
                  {/* Filled arc (orange) - 92% of 180 degrees = 165.6 degrees from left */}
                  {/* Center: (100, 100), radius: 80, start at left (20, 100) */}
                  {/* 92% of 180° = 165.6°, so end angle = 180° - 165.6° = 14.4° from positive x-axis */}
                  {/* End point: x = 100 + 80*cos(14.4°), y = 100 - 80*sin(14.4°) */}
                  <path
                    d="M 20 100 A 80 80 0 0 1 177.44 80.08"
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="16"
                    strokeLinecap="round"
                  />
                  {/* Scale labels */}
                  <text
                    x="12"
                    y="115"
                    textAnchor="start"
                    fill="#6b7280"
                    fontSize="12"
                    className="font-medium"
                  >
                    0
                  </text>
                  <text
                    x="188"
                    y="115"
                    textAnchor="end"
                    fill="#6b7280"
                    fontSize="12"
                    className="font-medium"
                  >
                    100
                  </text>
              </svg>
              </div>
              {/* Percentage value */}
              <p className="text-4xl sm:text-5xl font-bold text-[#f59e0b] mb-2">92%</p>
              {/* Contextual text */}
              <p className="text-sm text-gray-600">{t('fulfillmentRateThisMonth')}</p>
            </div>
          </div>

          {/* Top Customers */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 sm:p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">{t('topCustomers')}</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left border-b border-gray-200">
                    <th className="py-3 px-2 text-xs font-medium text-gray-500">{t('customerName')}</th>
                    <th className="py-3 px-2 text-xs font-medium text-gray-500">{t('totalOrders')}</th>
                    <th className="py-3 px-2 text-xs font-medium text-gray-500">{t('totalSpend')}</th>
                    <th className="py-3 px-2 text-xs font-medium text-gray-500">{t('lastOrder')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {[
                    { name: 'John Smith', orders: 45, total: '$3,200', last: `2 ${t('daysAgo')}` },
                    { name: 'Sarah Johnson', orders: 38, total: '$2,850', last: `1 ${t('daysAgo')}` },
                    { name: 'Mike Davis', orders: 32, total: '$2,400', last: `3 ${t('daysAgo')}` }
                  ].map((c) => (
                    <tr key={c.name} className="hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-2">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex-shrink-0" />
                          <span className="font-medium text-gray-900">{c.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-2 text-gray-700">{c.orders}</td>
                      <td className="py-3 px-2 font-medium text-gray-900">{c.total}</td>
                      <td className="py-3 px-2 text-gray-600">{c.last}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Refunds & Returns */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 sm:p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">{t('refundsReturns')}</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">{t('totalRefundRequests')}</span>
                <span className="text-sm font-medium text-gray-900">30</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">{t('approvedRefunds')}</span>
                <span className="text-sm font-medium text-green-600">24</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">{t('refundAmount')}</span>
                <span className="text-sm font-medium text-gray-900">$1,450</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">{t('approvalRate')}</span>
                <span className="text-sm font-medium text-gray-900">80%</span>
              </div>
              {/* Progress bar */}
              <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 rounded-full" style={{ width: '80%' }} />
              </div>
            </div>
          </div>

          {/* Status breakdown */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 sm:p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">{t('orderStatusBreakdown')}</h3>
            <div className="flex flex-col items-center justify-center">
              {/* Donut Chart */}
              <svg viewBox="0 0 200 200" className="w-48 h-48 sm:w-56 sm:h-56" preserveAspectRatio="xMidYMid meet">
                {/* Center: (100, 100), Outer radius: 80, Inner radius: 50 */}
                {/* Completed: 65% (green) - starts from top (-90°) */}
                <path
                  d={createDonutArc(-90, -90 + (65 * 360 / 100), 80, 50)}
                  fill="#22c55e"
                  stroke="white"
                  strokeWidth="2"
                />
                {/* Pending: 20% (orange) - continues from 65% */}
                <path
                  d={createDonutArc(-90 + (65 * 360 / 100), -90 + (85 * 360 / 100), 80, 50)}
                  fill="#f59e0b"
                  stroke="white"
                  strokeWidth="2"
                />
                {/* Cancelled: 15% (red) - continues from 85% */}
                <path
                  d={createDonutArc(-90 + (85 * 360 / 100), -90 + 360, 80, 50)}
                  fill="#ef4444"
                  stroke="white"
                  strokeWidth="2"
                />
              </svg>
              {/* Legend */}
              <div className="mt-4 flex flex-row items-center justify-center gap-4 sm:gap-6 flex-wrap">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500 flex-shrink-0"></div>
                  <span className="text-sm text-gray-700">{t('completed')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-orange-500 flex-shrink-0"></div>
                  <span className="text-sm text-gray-700">{t('pending')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500 flex-shrink-0"></div>
                  <span className="text-sm text-gray-700">{t('cancelled')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 sm:p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">{t('recentOrders')}</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left border-b border-gray-200">
                    <th className="py-3 px-2 text-xs font-medium text-gray-500">{t('orderId')}</th>
                    <th className="py-3 px-2 text-xs font-medium text-gray-500">{t('date')}</th>
                    <th className="py-3 px-2 text-xs font-medium text-gray-500">{t('customer')}</th>
                    <th className="py-3 px-2 text-xs font-medium text-gray-500">{t('amount')}</th>
                    <th className="py-3 px-2 text-xs font-medium text-gray-500">{t('status')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {[
                    {id:'#ORD-001',date:'Dec 28, 2024',name:'John Smith',amount:'$125.00',status:'Completed'},
                    {id:'#ORD-002',date:'Dec 28, 2024',name:'Sarah Johnson',amount:'$89.50',status:'Pending'},
                    {id:'#ORD-003',date:'Dec 27, 2024',name:'Mike Davis',amount:'$245.00',status:'Completed'}
                  ].map((o)=> (
                    <tr key={o.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-2">
                        <a href="#" className="text-blue-600 hover:text-blue-800 underline text-sm font-medium">
                          {o.id}
                        </a>
                      </td>
                      <td className="py-3 px-2 text-gray-700">{o.date}</td>
                      <td className="py-3 px-2 text-gray-700">{o.name}</td>
                      <td className="py-3 px-2 text-gray-700">{o.amount}</td>
                      <td className="py-3 px-2">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                          o.status === 'Completed' 
                            ? 'bg-green-100 text-green-700' 
                            : o.status === 'Pending'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {o.status === 'Completed' ? t('completed') : o.status === 'Pending' ? t('pending') : t('cancelled')}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}


