import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'
import { useState } from 'react'
import { Menu, Calendar, ChevronDown, Download, DollarSign, Clock, ArrowDown, Percent } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

export default function EarningsReportPage() {
  const { t } = useLanguage()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [activeDateRange, setActiveDateRange] = useState('Today')
  const [activeTrendTab, setActiveTrendTab] = useState('Daily')

  // Chart data for different time periods
  const earningsChartData = {
    Daily: {
      labels: ['Dec 1', 'Dec 2', 'Dec 3', 'Dec 4', 'Dec 5', 'Dec 6', 'Dec 7', 'Dec 8', 'Dec 9', 'Dec 10', 'Dec 11', 'Dec 12', 'Dec 13', 'Dec 14', 'Dec 15'],
      values: [850, 980, 1200, 800, 1100, 880, 1380, 930, 1080, 1250, 2080, 1200, 850, 1150, 1200]
    },
    Weekly: {
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      values: [3500, 4200, 3800, 4500]
    },
    Monthly: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      values: [18500, 22000, 19500, 24000, 21000, 25000]
    }
  }

  const currentEarningsData = earningsChartData[activeTrendTab as keyof typeof earningsChartData]

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

  // Helper function to render the earnings chart
  const renderEarningsChart = (data: typeof currentEarningsData, tab: string) => {
    const chartWidth = 700
    const chartHeight = 250
    const padding = { top: 30, right: 50, bottom: 50, left: 70 }
    const graphWidth = chartWidth - padding.left - padding.right
    const graphHeight = chartHeight - padding.top - padding.bottom

    // For Daily: max is around 2500, for Weekly/Monthly we'll scale differently
    const maxValue = Math.max(...data.values)
    const minY = 0
    let maxY: number
    if (tab === 'Daily') {
      maxY = 2500
    } else if (tab === 'Weekly') {
      maxY = 5000
    } else {
      maxY = 30000
    }
    const yRange = maxY - minY

    // Calculate positions
    const xStep = graphWidth / (data.labels.length - 1)
    const points = data.values.map((value, index) => {
      const x = padding.left + index * xStep
      const y = padding.top + graphHeight - ((value - minY) / yRange) * graphHeight
      return { x, y, value }
    })

    // Create path for line and area
    const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
    const areaPath = `${linePath} L ${points[points.length - 1].x} ${padding.top + graphHeight} L ${points[0].x} ${padding.top + graphHeight} Z`

    // Y-axis labels and grid lines
    const yLabels = tab === 'Daily' 
      ? [0, 500, 1000, 1500, 2000, 2500]
      : tab === 'Weekly'
      ? [0, 1000, 2000, 3000, 4000, 5000]
      : [0, 5000, 10000, 15000, 20000, 30000]
    
    const gridLines = yLabels
      .filter(label => label <= maxY)
      .map((label) => {
        const y = padding.top + graphHeight - ((label - minY) / yRange) * graphHeight
        return { y, label }
      })

    return (
      <div className="w-full overflow-x-auto">
        <div className="min-w-[320px]">
          <svg 
            viewBox={`0 0 ${chartWidth} ${chartHeight}`} 
            className="w-full h-64 sm:h-72 md:h-80 lg:h-96" 
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
              {t('amount')}
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
                  fill="#374151"
                  fontSize="11"
                  className="font-medium"
                >
                  {grid.label.toLocaleString()}
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
                  fill="#374151"
                  fontSize="11"
                  className="font-medium"
                >
                  {label}
                </text>
              )
            })}

            {/* Area fill with gradient */}
            <defs>
              <linearGradient id={`earningsGradient-${tab}`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#6366F1" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#6366F1" stopOpacity="0.05" />
              </linearGradient>
            </defs>
            <path
              d={areaPath}
              fill={`url(#earningsGradient-${tab})`}
            />

            {/* Line */}
            <path
              d={linePath}
              fill="none"
              stroke="#6366F1"
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
                fill="#6366F1"
                stroke="#fff"
                strokeWidth="2"
              />
            ))}
          </svg>
        </div>
        {/* Legend */}
        <div className="flex items-center justify-center mt-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#6366F1' }}></div>
            <span className="text-sm text-gray-700 font-medium">
              {tab === 'Daily' ? t('dailyEarnings') : tab === 'Weekly' ? t('weeklyEarnings') : t('monthlyEarnings')}
            </span>
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
            <Sidebar onClose={() => setSidebarCollapsed(true)} currentPage="analyticsEarnings" />
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
                <p className="text-sm text-gray-500 mt-0.5">{t('dashboard')} &gt; <span className="font-semibold">{t('earningsReport')}</span></p>
              </div>

              {/* Title and actions */}
              <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-1">{t('earningsReport')}</h1>
                  <p className="text-sm text-gray-500">{t('monitorRevenuePerformance')}</p>
                </div>
                <div className="bg-gray-100 rounded-lg p-2 flex items-center gap-2 flex-wrap">
                  {['Today', 'Last 7 Days', 'This Month', 'Custom'].map((range) => (
                    <button
                      key={range}
                      onClick={() => setActiveDateRange(range)}
                      className={`px-4 py-2 text-sm rounded-lg transition-colors font-medium ${
                        activeDateRange === range
                          ? 'bg-primary-500 text-white'
                          : 'text-gray-600 hover:text-gray-700'
                      }`}
                    >
                      {range === 'Today' ? t('today') : range === 'Last 7 Days' ? t('last7Days') : range === 'This Month' ? t('thisMonth') : t('custom')}
                    </button>
                  ))}
                  <button className="px-4 py-2 text-sm rounded-md bg-gray-800 text-white flex items-center gap-2 hover:bg-gray-900 shadow-sm">
                    <Download size={16} />
                    {t('export')}
                  </button>
                </div>
              </div>

              {/* KPI cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { 
                    label: t('totalEarnings'), 
                    value: '$18,750', 
                    chip: `+12.5% ${t('fromLastMonth')}`,
                    chipColor: '#22c55e',
                    labelColor: '#22c55e',
                    icon: DollarSign,
                    iconBg: '#33CC66',
                    bgColor: '#E6FAE6',
                    valueColor: '#22c55e'
                  },
                  { 
                    label: t('pendingBalance'), 
                    value: '$2,150', 
                    chip: t('awaitingClearance'),
                    chipColor: '#ea580c',
                    labelColor: '#ea580c',
                    icon: Clock,
                    iconBg: '#FF8C33',
                    bgColor: '#FFF0E6',
                    valueColor: '#ea580c'
                  },
                  { 
                    label: t('withdrawnAmount'), 
                    value: '$16,200', 
                    chip: t('successfullyWithdrawn'),
                    chipColor: '#2563eb',
                    labelColor: '#2563eb',
                    icon: ArrowDown,
                    iconBg: '#338CFF',
                    bgColor: '#E6F0FF',
                    valueColor: '#2563eb'
                  },
                  { 
                    label: t('platformFees'), 
                    value: '$400', 
                    chip: `2.1% ${t('ofTotalEarnings')}`,
                    chipColor: '#9333ea',
                    labelColor: '#9333ea',
                    icon: Percent,
                    iconBg: '#8C33FF',
                    bgColor: '#F0E6FF',
                    valueColor: '#9333ea'
                  }
                ].map((k, i) => (
                  <div 
                    key={i} 
                    className="rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow"
                    style={{ backgroundColor: k.bgColor }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <p className="text-sm font-medium" style={{ color: k.labelColor }}>{k.label}</p>
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: k.iconBg }}
                      >
                        <k.icon className="text-white" size={20} />
                      </div>
                    </div>
                    <p className="text-3xl font-bold mb-2" style={{ color: k.valueColor }}>{k.value}</p>
                    <p className="text-xs font-medium" style={{ color: k.chipColor }}>{k.chip}</p>
                  </div>
                ))}
              </div>

              {/* Earnings trend */}
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-6 py-4 border-b border-gray-200">
                  <h2 className="text-sm font-semibold text-gray-900">{t('earningsTrend')}</h2>
                  <div className="flex items-center gap-1">
                    {['Daily', 'Weekly', 'Monthly'].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTrendTab(tab)}
                        className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                          activeTrendTab === tab
                            ? 'text-white'
                            : 'bg-white text-gray-600 hover:text-gray-900'
                        }`}
                        style={activeTrendTab === tab ? { backgroundColor: '#6366F1' } : {}}
                      >
                        {t(tab.toLowerCase())}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="p-6">
                  {renderEarningsChart(currentEarningsData, activeTrendTab)}
                </div>
              </div>

              {/* Best products and earnings by category */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 sm:p-6">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">{t('bestPerformingProducts')}</h3>
                  <div className="space-y-3">
                    {[
                      { name: 'iPhone 14', units: 120, revenue: '$12,000', percentage: 35, iconBg: 'from-purple-100 to-purple-200', borderColor: 'border-purple-200', emoji: '📱' },
                      { name: 'Samsung Galaxy S23', units: 85, revenue: '$4,250', percentage: 23, iconBg: 'from-blue-100 to-blue-200', borderColor: 'border-blue-200', emoji: '📱' },
                      { name: 'MacBook Air', units: 32, revenue: '$2,500', percentage: 13, iconBg: 'from-gray-100 to-gray-200', borderColor: 'border-gray-200', emoji: '💻' }
                    ].map((p: { name: string; units: number; revenue: string; percentage: number; iconBg: string; borderColor: string; emoji: string }) => (
                      <div key={p.name} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 flex-1">
                            <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${p.iconBg} flex-shrink-0 overflow-hidden border ${p.borderColor}`}>
                              <div className="w-full h-full flex items-center justify-center">
                                <span className="text-lg">{p.emoji}</span>
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-gray-900 mb-1">{p.name}</p>
                              <p className="text-xs text-gray-500">{p.units} {t('unitsSold')}</p>
                            </div>
                          </div>
                          <div className="text-right ml-4">
                            <p className="text-sm font-bold text-gray-900 mb-1">{p.revenue}</p>
                            <p className="text-xs font-medium text-green-600">{p.percentage}% {t('revenue')}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 sm:p-6">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">{t('earningsByCategory')}</h3>
                  <div className="flex flex-col items-center justify-center">
                    {/* Donut Chart */}
                    <svg viewBox="0 0 200 200" className="w-48 h-48 sm:w-56 sm:h-56" preserveAspectRatio="xMidYMid meet">
                      {/* Center: (100, 100), Outer radius: 80, Inner radius: 50 */}
                      {/* Electronics: 54% (blue) - starts from top (-90°) */}
                      <path
                        d={createDonutArc(-90, -90 + (54 * 360 / 100), 80, 50)}
                        fill="#3b82f6"
                        stroke="white"
                        strokeWidth="2"
                      />
                      {/* Fashion: 28% (green) - continues from 54% */}
                      <path
                        d={createDonutArc(-90 + (54 * 360 / 100), -90 + (82 * 360 / 100), 80, 50)}
                        fill="#22c55e"
                        stroke="white"
                        strokeWidth="2"
                      />
                      {/* Home: 18% (orange) - continues from 82% */}
                      <path
                        d={createDonutArc(-90 + (82 * 360 / 100), -90 + 360, 80, 50)}
                        fill="#f97316"
                        stroke="white"
                        strokeWidth="2"
                      />
                    </svg>
                    {/* Legend */}
                    <div className="mt-4 w-full space-y-2">
                      {[
                        { category: t('electronics'), earnings: '$10,000', percentage: 54, color: '#3b82f6' },
                        { category: t('fashion'), earnings: '$5,200', percentage: 28, color: '#22c55e' },
                        { category: t('home'), earnings: '$3,550', percentage: 18, color: '#f97316' }
                      ].map((item: { category: string; earnings: string; percentage: number; color: string }) => (
                        <div key={item.category} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }}></div>
                            <span className="text-sm text-gray-700 font-medium">{item.category}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-sm text-gray-700 font-medium">{item.earnings}</span>
                            <span className="text-sm text-gray-500 ml-1">({item.percentage}%)</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Customer insights */}
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 sm:p-6">
                <h3 className="text-base font-semibold text-gray-900 mb-4">{t('customerInsights')}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Average Revenue per Customer */}
                  <div className="rounded-lg p-4 text-center shadow-sm" style={{ backgroundColor: '#F0F5FF' }}>
                    <p className="text-2xl font-bold mb-1" style={{ color: '#3b82f6' }}>$78.40</p>
                    <p className="text-xs text-gray-500">{t('averageRevenuePerCustomer')}</p>
                  </div>
                  {/* Highest Spending Customer */}
                  <div className="rounded-lg p-4 text-center shadow-sm" style={{ backgroundColor: '#F0FFF0' }}>
                    <p className="text-base font-semibold mb-1" style={{ color: '#22c55e' }}>John Smith</p>
                    <p className="text-2xl font-bold mb-1" style={{ color: '#22c55e' }}>$1,240</p>
                    <p className="text-xs text-gray-500">{t('highestSpendingCustomer')}</p>
                  </div>
                  {/* Repeat Purchase Rate */}
                  <div className="rounded-lg p-4 text-center shadow-sm" style={{ backgroundColor: '#F8F0FF' }}>
                    <p className="text-2xl font-bold mb-1" style={{ color: '#a855f7' }}>32%</p>
                    <p className="text-xs text-gray-500">{t('repeatPurchaseRate')}</p>
                  </div>
                </div>
              </div>

              {/* Recent transactions */}
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 sm:p-6">
                <h3 className="text-base font-semibold text-gray-900 mb-4">{t('recentTransactions')}</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left border-b border-gray-200">
                        <th className="py-3 text-xs font-semibold text-gray-900">{t('transactionId')}</th>
                        <th className="py-3 text-xs font-semibold text-gray-900">{t('date')}</th>
                        <th className="py-3 text-xs font-semibold text-gray-900">{t('type')}</th>
                        <th className="py-3 text-xs font-semibold text-gray-900">{t('amount')}</th>
                        <th className="py-3 text-xs font-semibold text-gray-900">{t('status')}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {[
                        {id:'#TXN-2024-001',date:'Dec 15, 2024',type:t('earning'),amount:'+$1,200',amountColor:'text-green-600',status:t('completed')},
                        {id:'#TXN-2024-002',date:'Dec 14, 2024',type:t('withdrawal'),amount:'-$5,000',amountColor:'text-red-600',status:t('completed')},
                        {id:'#TXN-2024-003',date:'Dec 13, 2024',type:t('earning'),amount:'+$850',amountColor:'text-green-600',status:t('completed')},
                        {id:'#TXN-2024-004',date:'Dec 12, 2024',type:t('refund'),amount:'-$150',amountColor:'text-red-600',status:t('processing')},
                        {id:'#TXN-2024-005',date:'Dec 11, 2024',type:t('earning'),amount:'+$2,100',amountColor:'text-green-600',status:t('completed')}
                      ].map((trans: { id: string; date: string; type: string; amount: string; amountColor: string; status: string }) => (
                        <tr key={trans.id} className="text-gray-700 hover:bg-gray-50">
                          <td className="py-3 text-sm">{trans.id}</td>
                          <td className="py-3 text-sm text-gray-600">{trans.date}</td>
                          <td className="py-3">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                              trans.type === t('earning') ? 'bg-green-100 text-green-700' :
                              trans.type === t('withdrawal') ? 'bg-blue-100 text-blue-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {trans.type}
                            </span>
                          </td>
                          <td className={`py-3 text-sm font-semibold ${trans.amountColor}`}>{trans.amount}</td>
                          <td className="py-3">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                              trans.status === t('completed') ? 'bg-green-100 text-green-700' :
                              'bg-orange-100 text-orange-700'
                            }`}>
                              {trans.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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
              <Sidebar onClose={() => setSidebarOpen(false)} currentPage="analyticsEarnings" />
            </div>
          </div>
        )}

        <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
          <Header onToggleSidebar={() => setSidebarOpen(true)} isSidebarOpen={sidebarOpen} />
        </div>
        <main className="mt-14 p-4 sm:p-6 space-y-6">
          {/* Header Section */}
          <div className="mb-4">
            <h2 className="text-base sm:text-lg font-bold text-gray-900">Analytics & Reports</h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">Dashboard &gt; <span className="font-semibold">Earnings Report</span></p>
          </div>

          {/* Title and actions */}
          <div className="mb-6">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">Earnings Report</h1>
            <p className="text-xs sm:text-sm text-gray-500">Monitor your revenue performance and financial insights</p>
          </div>

          {/* Date Range Buttons */}
          <div className="bg-gray-100 rounded-lg p-2 flex items-center gap-2 flex-wrap mb-4">
            {['Today', 'Last 7 Days', 'This Month', 'Custom'].map((range) => (
              <button
                key={range}
                onClick={() => setActiveDateRange(range)}
                className={`px-3 sm:px-4 py-2 text-xs sm:text-sm rounded-lg transition-colors font-medium ${
                  activeDateRange === range
                    ? 'bg-primary-500 text-white'
                    : 'text-gray-600 hover:text-gray-700'
                }`}
              >
                {range}
              </button>
            ))}
            <button className="px-3 sm:px-4 py-2 text-xs sm:text-sm rounded-md bg-gray-800 text-white flex items-center gap-2 hover:bg-gray-900 shadow-sm">
              <Download size={16} />
              Export
            </button>
          </div>

          {/* KPI cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { 
                label: 'Total Earnings', 
                value: '$18,750', 
                chip: '+12.5% from last month',
                chipColor: '#22c55e',
                labelColor: '#22c55e',
                icon: DollarSign,
                iconBg: '#33CC66',
                bgColor: '#E6FAE6',
                valueColor: '#22c55e'
              },
              { 
                label: 'Pending Balance', 
                value: '$2,150', 
                chip: 'Awaiting clearance',
                chipColor: '#ea580c',
                labelColor: '#ea580c',
                icon: Clock,
                iconBg: '#FF8C33',
                bgColor: '#FFF0E6',
                valueColor: '#ea580c'
              },
              { 
                label: 'Withdrawn Amount', 
                value: '$16,200', 
                chip: 'Successfully withdrawn',
                chipColor: '#2563eb',
                labelColor: '#2563eb',
                icon: ArrowDown,
                iconBg: '#338CFF',
                bgColor: '#E6F0FF',
                valueColor: '#2563eb'
              },
              { 
                label: 'Platform Fees', 
                value: '$400', 
                chip: '2.1% of total earnings',
                chipColor: '#9333ea',
                labelColor: '#9333ea',
                icon: Percent,
                iconBg: '#8C33FF',
                bgColor: '#F0E6FF',
                valueColor: '#9333ea'
              }
            ].map((k, i) => (
              <div 
                key={i} 
                className="rounded-lg p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow"
                style={{ backgroundColor: k.bgColor }}
              >
                <div className="flex items-start justify-between mb-3">
                  <p className="text-xs sm:text-sm font-medium" style={{ color: k.labelColor }}>{k.label}</p>
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: k.iconBg }}
                  >
                    <k.icon className="text-white" size={20} />
                  </div>
                </div>
                <p className="text-2xl sm:text-3xl font-bold mb-2" style={{ color: k.valueColor }}>{k.value}</p>
                <p className="text-xs font-medium" style={{ color: k.chipColor }}>{k.chip}</p>
              </div>
            ))}
          </div>

          

          {/* Best Products */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 sm:p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Best Performing Products</h3>
            <div className="space-y-3">
              {[
                { name: 'iPhone 14', units: 120, revenue: '$12,000', percentage: 35, iconBg: 'from-purple-100 to-purple-200', borderColor: 'border-purple-200', emoji: '📱' },
                { name: 'Samsung Galaxy S23', units: 85, revenue: '$4,250', percentage: 23, iconBg: 'from-blue-100 to-blue-200', borderColor: 'border-blue-200', emoji: '📱' },
                { name: 'MacBook Air', units: 32, revenue: '$2,500', percentage: 13, iconBg: 'from-gray-100 to-gray-200', borderColor: 'border-gray-200', emoji: '💻' }
              ].map((p: { name: string; units: number; revenue: string; percentage: number; iconBg: string; borderColor: string; emoji: string }) => (
                <div key={p.name} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${p.iconBg} flex-shrink-0 overflow-hidden border ${p.borderColor}`}>
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-lg">{p.emoji}</span>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 mb-1">{p.name}</p>
                        <p className="text-xs text-gray-500">{p.units} units sold</p>
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <p className="text-sm font-bold text-gray-900 mb-1">{p.revenue}</p>
                      <p className="text-xs font-medium text-green-600">{p.percentage}% revenue</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Earnings by Category */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 sm:p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Earnings by Category</h3>
            <div className="flex flex-col items-center justify-center">
              {/* Donut Chart */}
              <svg viewBox="0 0 200 200" className="w-48 h-48 sm:w-56 sm:h-56" preserveAspectRatio="xMidYMid meet">
                {/* Center: (100, 100), Outer radius: 80, Inner radius: 50 */}
                {/* Electronics: 54% (blue) - starts from top (-90°) */}
                <path
                  d={createDonutArc(-90, -90 + (54 * 360 / 100), 80, 50)}
                  fill="#3b82f6"
                  stroke="white"
                  strokeWidth="2"
                />
                {/* Fashion: 28% (green) - continues from 54% */}
                <path
                  d={createDonutArc(-90 + (54 * 360 / 100), -90 + (82 * 360 / 100), 80, 50)}
                  fill="#22c55e"
                  stroke="white"
                  strokeWidth="2"
                />
                {/* Home: 18% (orange) - continues from 82% */}
                <path
                  d={createDonutArc(-90 + (82 * 360 / 100), -90 + 360, 80, 50)}
                  fill="#f97316"
                  stroke="white"
                  strokeWidth="2"
                />
              </svg>
              {/* Legend */}
              <div className="mt-4 w-full space-y-2">
                {[
                  { category: 'Electronics', earnings: '$10,000', percentage: 54, color: '#3b82f6' },
                  { category: 'Fashion', earnings: '$5,200', percentage: 28, color: '#22c55e' },
                  { category: 'Home', earnings: '$3,550', percentage: 18, color: '#f97316' }
                ].map((item) => (
                  <div key={item.category} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }}></div>
                      <span className="text-sm text-gray-700 font-medium">{item.category}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm text-gray-700 font-medium">{item.earnings}</span>
                      <span className="text-sm text-gray-500 ml-1">({item.percentage}%)</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Customer Insights */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 sm:p-6">
            <h3 className="text-base font-semibold text-gray-900 mb-4">Customer Insights</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Average Revenue per Customer */}
              <div className="rounded-lg p-4 text-center shadow-sm" style={{ backgroundColor: '#F0F5FF' }}>
                <p className="text-2xl font-bold mb-1" style={{ color: '#3b82f6' }}>$78.40</p>
                <p className="text-xs text-gray-500">Average Revenue per Customer</p>
              </div>
              {/* Highest Spending Customer */}
              <div className="rounded-lg p-4 text-center shadow-sm" style={{ backgroundColor: '#F0FFF0' }}>
                <p className="text-base font-semibold mb-1" style={{ color: '#22c55e' }}>John Smith</p>
                <p className="text-2xl font-bold mb-1" style={{ color: '#22c55e' }}>$1,240</p>
                <p className="text-xs text-gray-500">Highest Spending Customer</p>
              </div>
              {/* Repeat Purchase Rate */}
              <div className="rounded-lg p-4 text-center shadow-sm" style={{ backgroundColor: '#F8F0FF' }}>
                <p className="text-2xl font-bold mb-1" style={{ color: '#a855f7' }}>32%</p>
                <p className="text-xs text-gray-500">Repeat Purchase Rate</p>
              </div>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 sm:p-6">
            <h3 className="text-base font-semibold text-gray-900 mb-4">Recent Transactions</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left border-b border-gray-200">
                    <th className="py-3 text-xs font-semibold text-gray-900">Transaction ID</th>
                    <th className="py-3 text-xs font-semibold text-gray-900">Date</th>
                    <th className="py-3 text-xs font-semibold text-gray-900">Type</th>
                    <th className="py-3 text-xs font-semibold text-gray-900">Amount</th>
                    <th className="py-3 text-xs font-semibold text-gray-900">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {[
                    {id:'#TXN-2024-001',date:'Dec 15, 2024',type:'Earning',amount:'+$1,200',amountColor:'text-green-600',status:'Completed'},
                    {id:'#TXN-2024-002',date:'Dec 14, 2024',type:'Withdrawal',amount:'-$5,000',amountColor:'text-red-600',status:'Completed'},
                    {id:'#TXN-2024-003',date:'Dec 13, 2024',type:'Earning',amount:'+$850',amountColor:'text-green-600',status:'Completed'},
                    {id:'#TXN-2024-004',date:'Dec 12, 2024',type:'Refund',amount:'-$150',amountColor:'text-red-600',status:'Processing'},
                    {id:'#TXN-2024-005',date:'Dec 11, 2024',type:'Earning',amount:'+$2,100',amountColor:'text-green-600',status:'Completed'}
                  ].map((trans)=> (
                    <tr key={trans.id} className="text-gray-700 hover:bg-gray-50">
                      <td className="py-3 text-sm">{trans.id}</td>
                      <td className="py-3 text-sm text-gray-600">{trans.date}</td>
                      <td className="py-3">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                          trans.type === t('earning') ? 'bg-green-100 text-green-700' :
                          trans.type === t('withdrawal') ? 'bg-blue-100 text-blue-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {trans.type}
                        </span>
                      </td>
                      <td className={`py-3 text-sm font-semibold ${trans.amountColor}`}>{trans.amount}</td>
                      <td className="py-3">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                          trans.status === t('completed') ? 'bg-green-100 text-green-700' :
                          'bg-orange-100 text-orange-700'
                        }`}>
                          {trans.status}
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


