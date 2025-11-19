import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'
import { useState } from 'react'
import { Menu, Calendar, ChevronDown, Download, Users, UserPlus, RotateCcw, TrendingUp, MoreVertical, AlignJustify, User, ShoppingCart, Star } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

export default function CustomerInsightsPage() {
  const { t } = useLanguage()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  // Helper function to create donut chart arc
  const createArc = (startAngle: number, endAngle: number, outerRadius: number, innerRadius: number) => {
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
  
  // Calculate angles (starting from top: -90 degrees)
  // New: 62% = 223.2 degrees (starts first, appears on left)
  // Returning: 38% = 136.8 degrees (appears on right)
  const newStart = -90
  const newEnd = -90 + (62 * 360 / 100)
  const returningStart = newEnd
  const returningEnd = newStart + 360

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Layout */}
      <div className="hidden lg:flex h-screen overflow-hidden">
        {!sidebarCollapsed && (
          <div className="w-64 flex-shrink-0 bg-primary-500 h-screen overflow-y-auto">
            <Sidebar onClose={() => setSidebarCollapsed(true)} currentPage="analyticsCustomers" />
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

          <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
            <div className="max-w-7xl mx-auto">
              {/* Header Section - Outside white card */}
              <div className="mb-6">
                <h2 className="text-lg font-bold text-gray-900">{t('analyticsReports')}</h2>
                <p className="text-sm text-gray-500 mt-0.5">{t('dashboard')} - {t('customerInsights')}</p>
              </div>

              {/* Main White Card Container */}
              <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
              {/* Title and actions */}
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">{t('customerInsights')}</h1>
                    <p className="text-sm text-gray-500">{t('understandCustomerBase')}</p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="relative">
                      <button className="px-4 py-2 text-sm rounded-md border border-gray-300 bg-white text-gray-700 flex items-center gap-2 hover:bg-gray-50">
                    {t('last7Days')}
                    <ChevronDown size={16} className="text-gray-500" />
                  </button>
                    </div>
                    <button className="px-4 py-2 text-sm rounded-md bg-orange-500 text-white flex items-center gap-2 hover:bg-orange-600 shadow-sm">
                    <Download size={16} />
                    {t('export')}
                  </button>
                </div>
              </div>

              {/* KPI cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  {[
                    {label:t('totalCustomers'), value:'1,850', icon: Users, iconColor:'text-blue-500', iconBg:'bg-blue-50'},
                    {label:t('newCustomers'), value:'320', icon: UserPlus, iconColor:'text-green-500', iconBg:'bg-green-50'},
                    {label:t('returningCustomers'), value:'540', icon: RotateCcw, iconColor:'text-purple-500', iconBg:'bg-purple-50'},
                    {label:t('retentionRate'), value:'38%', icon: TrendingUp, iconColor:'text-orange-500', iconBg:'bg-orange-50'},
                  ].map((k,i)=> (
                    <div key={i} className="bg-white rounded-lg border border-gray-200 shadow-sm p-5 hover:shadow-md transition-shadow">
                      <div className={`w-10 h-10 ${k.iconBg} rounded-lg flex items-center justify-center mb-3`}>
                        <k.icon className={`${k.iconColor}`} size={20} />
                      </div>
                      <p className="text-sm text-gray-700 mb-1">{k.label}</p>
                      <p className="text-2xl font-bold text-gray-900">{k.value}</p>
                  </div>
                ))}
              </div>

              {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                  {/* New vs Returning Customers */}
                  <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-sm font-semibold text-gray-900">{t('newVsReturningCustomers')}</h3>
                      <button className="text-gray-500 hover:text-gray-700" aria-label="More options">
                        <AlignJustify size={18} />
                      </button>
                    </div>
                    {/* Chart Container */}
                    <div className="flex flex-col items-center justify-center py-6">
                      {/* Donut Chart */}
                      <div className="relative mb-6">
                        <svg viewBox="0 0 200 200" className="w-56 h-56" preserveAspectRatio="xMidYMid meet">
                          {/* Outer radius = 80, Inner radius = 50 */}
                          {/* New Customers - 62% (blue) - appears on left */}
                          <path
                            d={createArc(newStart, newEnd, 80, 50)}
                            fill="#4285F4"
                            stroke="white"
                            strokeWidth="2"
                          />
                          {/* Returning Customers - 38% (green) - appears on right */}
                          <path
                            d={createArc(returningStart, returningEnd, 80, 50)}
                            fill="#34A853"
                            stroke="white"
                            strokeWidth="2"
                          />
                        </svg>
                        {/* Center text */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                          <p className="text-2xl font-bold text-gray-900">1,850</p>
                          <p className="text-xs text-gray-500 mt-1">{t('totalCustomers')}</p>
                        </div>
                      </div>
                      
                      {/* Legend */}
                      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md justify-center">
                        <div className="flex items-center gap-3">
                          <div className="w-4 h-4 rounded-full bg-[#4285F4] flex-shrink-0"></div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-gray-700">{t('newCustomers')}</span>
                              <span className="text-sm font-bold text-gray-900 ml-2">62%</span>
                            </div>
                            <p className="text-xs text-gray-500 mt-0.5">1,147 {t('customers')}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-4 h-4 rounded-full bg-[#34A853] flex-shrink-0"></div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-gray-700">{t('returningCustomers')}</span>
                              <span className="text-sm font-bold text-gray-900 ml-2">38%</span>
                            </div>
                            <p className="text-xs text-gray-500 mt-0.5">703 {t('customers')}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                </div>

                  {/* Geographic Distribution */}
                  <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                    <h3 className="text-sm font-semibold text-gray-900 mb-6">{t('geographicDistribution')}</h3>
                    <div className="space-y-4">
                      {[
                        { city: 'Karachi', value: 420, color: '#4285F4', width: 75 },
                        { city: 'Lahore', value: 350, color: '#34A853', width: 62 },
                        { city: 'Dubai', value: 180, color: '#9933FF', width: 32 }
                    ].map((r) => (
                      <div key={r.city}>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-900 font-medium">{r.city}</span>
                            <span className="text-sm text-gray-900 font-medium">{r.value}</span>
                          </div>
                          <div className="h-2.5 rounded-full overflow-hidden" style={{ backgroundColor: '#EBEBEB' }}>
                            <div 
                              className="h-full rounded-full" 
                              style={{ 
                                width: `${r.width}%`,
                                backgroundColor: r.color
                              }} 
                            />
                        </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>

              {/* Top Customers table */}
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 mb-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">{t('topCustomers')}</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-xs text-gray-500 border-b border-gray-200">
                        <th className="py-3 px-2 font-medium">{t('customer')}</th>
                        <th className="py-3 px-2 font-medium">Email</th>
                        <th className="py-3 px-2 font-medium">{t('orders')}</th>
                        <th className="py-3 px-2 font-medium">{t('totalSpend')}</th>
                        <th className="py-3 px-2 font-medium">{t('lastOrder')}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {[{name:'Sarah Khan',email:'sarah@email.com',orders:18,total:'$2,450',last:'Jan 8, 2025'},{name:'Ahmed Ali',email:'ahmed@email.com',orders:15,total:'$2,120',last:'Jan 10, 2025'},{name:'Maria Garcia',email:'maria@email.com',orders:12,total:'$1,890',last:'Jan 12, 2025'}].map((u: { name: string; email: string; orders: number; total: string; last: string }) => (
                        <tr key={u.email} className="text-gray-700 hover:bg-gray-50 transition-colors">
                          <td className="py-3 px-2">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                                <User size={16} className="text-gray-500" />
                              </div>
                              <span className="font-medium text-gray-900">{u.name}</span>
                            </div>
                          </td>
                          <td className="py-3 px-2 text-gray-700">{u.email}</td>
                          <td className="py-3 px-2 text-gray-700">{u.orders}</td>
                          <td className="py-3 px-2 text-gray-700 font-medium">{u.total}</td>
                          <td className="py-3 px-2 text-gray-700">{u.last}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Bottom grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">{t('recentActivity')}</h3>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                        <User size={18} className="text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">Ali Raza {t('placedOrder')}</p>
                        <p className="text-xs text-gray-500 mt-1">Jan 12, 2025</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                        <ShoppingCart size={18} className="text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{t('newCustomerSignup')}</p>
                        <p className="text-xs text-gray-500 mt-1">Jan 11, 2025</p>
                      </div>
                    </li>
                  </ul>
                </div>

                  <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">{t('customerFeedback')}</h3>
                  <div>
                    <div className="flex items-baseline gap-2 mb-2">
                      <p className="text-3xl font-semibold text-gray-900">4.6</p>
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 mb-4">240 {t('totalReviews')}</p>
                    <div className="space-y-2">
                      <div>
                        <p className="text-sm font-medium text-green-600">{t('positive')}</p>
                        <p className="text-xs text-gray-500">75%</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-orange-500">{t('neutral')}</p>
                        <p className="text-xs text-gray-500">15%</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-red-600">{t('negative')}</p>
                        <p className="text-xs text-gray-500">10%</p>
                      </div>
                    </div>
                  </div>
                </div>

                  <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">{t('loyaltyMetrics')}</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-700 mb-1">{t('averageCLV')}</p>
                      <p className="text-xl font-semibold text-gray-900">$82.50</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-700 mb-1">{t('topSpender')}</p>
                      <p className="text-sm font-medium text-gray-900">John Doe - $3,200</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-700 mb-1">{t('repeatPurchaseRate')}</p>
                      <p className="text-sm font-medium text-gray-900">32%</p>
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
        {sidebarOpen && (
          <div className="fixed inset-0 z-50">
            <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
            <div className="absolute left-0 top-0 bottom-0 w-64 bg-primary-500">
              <Sidebar onClose={() => setSidebarOpen(false)} currentPage="analyticsCustomers" />
            </div>
          </div>
        )}

        <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
          <Header onToggleSidebar={() => setSidebarOpen(true)} isSidebarOpen={sidebarOpen} />
        </div>
        <main className="p-4 sm:p-6 bg-gray-50 min-h-screen pt-20 sm:pt-4">
          {/* Header Section - Outside white card */}
          <div className="mb-4 sm:mb-6">
            <h2 className="text-base sm:text-lg font-bold text-gray-900">{t('analyticsReports')}</h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">{t('dashboard')} - {t('customerInsights')}</p>
          </div>

          {/* Main White Card Container */}
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 max-w-7xl mx-auto">
            {/* Title and actions */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 sm:mb-6">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">{t('customerInsights')}</h1>
                <p className="text-xs sm:text-sm text-gray-500">{t('understandCustomerBase')}</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <button className="px-3 sm:px-4 py-2 text-xs sm:text-sm rounded-md border border-gray-300 bg-white text-gray-700 flex items-center gap-2 hover:bg-gray-50">
                    {t('last7Days')}
                    <ChevronDown size={16} className="text-gray-500" />
                  </button>
                </div>
                <button className="px-3 sm:px-4 py-2 text-xs sm:text-sm rounded-md bg-orange-500 text-white flex items-center gap-2 hover:bg-orange-600 shadow-sm">
                  <Download size={16} />
                  {t('export')}
                </button>
              </div>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4 sm:mb-6">
              {[
                {label:t('totalCustomers'), value:'1,850', icon: Users, iconColor:'text-blue-500', iconBg:'bg-blue-50'},
                {label:t('newCustomers'), value:'320', icon: UserPlus, iconColor:'text-green-500', iconBg:'bg-green-50'},
                {label:t('returningCustomers'), value:'540', icon: RotateCcw, iconColor:'text-purple-500', iconBg:'bg-purple-50'},
                {label:t('retentionRate'), value:'38%', icon: TrendingUp, iconColor:'text-orange-500', iconBg:'bg-orange-50'},
              ].map((k,i)=> (
                <div key={i} className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 sm:p-5 hover:shadow-md transition-shadow">
                  <div className={`w-10 h-10 ${k.iconBg} rounded-lg flex items-center justify-center mb-3`}>
                    <k.icon className={`${k.iconColor}`} size={20} />
                  </div>
                  <p className="text-xs sm:text-sm text-gray-700 mb-1">{k.label}</p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">{k.value}</p>
                </div>
              ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 gap-4 mb-4 sm:mb-6">
              {/* New vs Returning Customers */}
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <h3 className="text-sm font-semibold text-gray-900">{t('newVsReturningCustomers')}</h3>
                  <button className="text-gray-500 hover:text-gray-700" aria-label="More options">
                    <AlignJustify size={18} />
                  </button>
                </div>
                {/* Chart Container */}
                <div className="flex flex-col items-center justify-center py-4 sm:py-6">
                  {/* Donut Chart */}
                  <div className="relative mb-4 sm:mb-6">
                    <svg viewBox="0 0 200 200" className="w-48 h-48 sm:w-56 sm:h-56" preserveAspectRatio="xMidYMid meet">
                      {/* Outer radius = 80, Inner radius = 50 */}
                      {/* New Customers - 62% (blue) - appears on left */}
                      <path
                        d={createArc(newStart, newEnd, 80, 50)}
                        fill="#4285F4"
                        stroke="white"
                        strokeWidth="2"
                      />
                      {/* Returning Customers - 38% (green) - appears on right */}
                      <path
                        d={createArc(returningStart, returningEnd, 80, 50)}
                        fill="#34A853"
                        stroke="white"
                        strokeWidth="2"
                      />
                    </svg>
                    {/* Center text */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <p className="text-xl sm:text-2xl font-bold text-gray-900">1,850</p>
                      <p className="text-xs text-gray-500 mt-1">{t('totalCustomers')}</p>
                    </div>
                  </div>
                  
                  {/* Legend */}
                  <div className="flex flex-col gap-4 w-full max-w-md justify-center">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded-full bg-[#4285F4] flex-shrink-0"></div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700">{t('newCustomers')}</span>
                          <span className="text-sm font-bold text-gray-900 ml-2">62%</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">1,147 {t('customers')}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded-full bg-[#34A853] flex-shrink-0"></div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700">{t('returningCustomers')}</span>
                          <span className="text-sm font-bold text-gray-900 ml-2">38%</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">703 {t('customers')}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Geographic Distribution */}
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 sm:p-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-4 sm:mb-6">{t('geographicDistribution')}</h3>
                <div className="space-y-4">
                  {[
                    { city: 'Karachi', value: 420, color: '#4285F4', width: 75 },
                    { city: 'Lahore', value: 350, color: '#34A853', width: 62 },
                    { city: 'Dubai', value: 180, color: '#9933FF', width: 32 }
                  ].map((r) => (
                    <div key={r.city}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-900 font-medium">{r.city}</span>
                        <span className="text-sm text-gray-900 font-medium">{r.value}</span>
                      </div>
                      <div className="h-2.5 rounded-full overflow-hidden" style={{ backgroundColor: '#EBEBEB' }}>
                        <div 
                          className="h-full rounded-full" 
                          style={{ 
                            width: `${r.width}%`,
                            backgroundColor: r.color
                          }} 
                        />
                    </div>
                  </div>
                ))}
                </div>
            </div>
          </div>

          {/* Top Customers table */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 sm:p-6 mb-4 sm:mb-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">{t('topCustomers')}</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-gray-500 border-b border-gray-200">
                    <th className="py-3 px-2 font-medium">{t('customer')}</th>
                    <th className="py-3 px-2 font-medium">Email</th>
                    <th className="py-3 px-2 font-medium">{t('orders')}</th>
                    <th className="py-3 px-2 font-medium">{t('totalSpend')}</th>
                    <th className="py-3 px-2 font-medium">{t('lastOrder')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {[{name:'Sarah Khan',email:'sarah@email.com',orders:18,total:'$2,450',last:'Jan 8, 2025'},{name:'Ahmed Ali',email:'ahmed@email.com',orders:15,total:'$2,120',last:'Jan 10, 2025'},{name:'Maria Garcia',email:'maria@email.com',orders:12,total:'$1,890',last:'Jan 12, 2025'}].map((u)=> (
                    <tr key={u.email} className="text-gray-700 hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-2">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                            <User size={16} className="text-gray-500" />
                          </div>
                          <span className="font-medium text-gray-900">{u.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-2 text-gray-700">{u.email}</td>
                      <td className="py-3 px-2 text-gray-700">{u.orders}</td>
                      <td className="py-3 px-2 text-gray-700 font-medium">{u.total}</td>
                      <td className="py-3 px-2 text-gray-700">{u.last}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Bottom grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">{t('recentActivity')}</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                    <User size={18} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Ali Raza {t('placedOrder')}</p>
                    <p className="text-xs text-gray-500 mt-1">Jan 12, 2025</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                    <ShoppingCart size={18} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{t('newCustomerSignup')}</p>
                    <p className="text-xs text-gray-500 mt-1">Jan 11, 2025</p>
                  </div>
                </li>
              </ul>
            </div>

              <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">{t('customerFeedback')}</h3>
              <div>
                <div className="flex items-baseline gap-2 mb-2">
                  <p className="text-3xl font-semibold text-gray-900">4.6</p>
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-gray-700 mb-4">240 {t('totalReviews')}</p>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm font-medium text-green-600">{t('positive')}</p>
                    <p className="text-xs text-gray-500">75%</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-orange-500">{t('neutral')}</p>
                    <p className="text-xs text-gray-500">15%</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-red-600">{t('negative')}</p>
                    <p className="text-xs text-gray-500">10%</p>
                  </div>
                </div>
              </div>
            </div>

              <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">{t('loyaltyMetrics')}</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-700 mb-1">{t('averageCLV')}</p>
                  <p className="text-xl font-semibold text-gray-900">$82.50</p>
                </div>
                <div>
                  <p className="text-sm text-gray-700 mb-1">{t('topSpender')}</p>
                  <p className="text-sm font-medium text-gray-900">John Doe - $3,200</p>
                </div>
                <div>
                  <p className="text-sm text-gray-700 mb-1">{t('repeatPurchaseRate')}</p>
                  <p className="text-sm font-medium text-gray-900">32%</p>
                </div>
              </div>
            </div>
          </div>
          </div>
        </main>
      </div>
    </div>
  )
}


