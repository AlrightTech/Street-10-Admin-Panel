"use client";

import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { useState } from 'react';
import {
  BarChart3,
  Download,
  Calendar,
  Plus,
  ChevronDown,
  LineChart,
  Users,
  ShoppingCart,
  DollarSign,
  RefreshCw,
  Star,
  MapPin,
  TrendingUp,
  Package,
  Edit,
  Trash2,
  Eye,
  FileSpreadsheet,
  FileText,
  FileCode,
  Clock,
} from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';

export default function CustomReportsPage() {
  const { t } = useLanguage();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Layout */}
      <div className="hidden lg:flex h-screen overflow-hidden">
        {!sidebarCollapsed && (
          <div className="w-64 flex-shrink-0 bg-primary-500 h-screen overflow-y-auto">
            <Sidebar onClose={() => setSidebarCollapsed(true)} currentPage="analyticsCustom" />
          </div>
        )}
        {sidebarCollapsed && (
          <button
            onClick={() => setSidebarCollapsed(false)}
            className="fixed left-0 top-4 z-30 bg-primary-500 text-white p-2 rounded-r-lg"
            aria-label="Toggle sidebar"
          >
            <BarChart3 size={24} />
          </button>
        )}
        <div className="flex-1 flex flex-col h-screen overflow-hidden bg-gray-50">
          <div className="flex-shrink-0 sticky top-0 z-10 bg-white border-b border-gray-200">
            <Header />
          </div>
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
            <div className="max-w-7xl mx-auto">
              {/* Main White Card Container */}
              <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
                {/* Header Section */}
                <div className="mb-6">
                  <div className="mb-2">
                    <h2 className="text-lg font-bold text-gray-900">{t('analyticsReports')}</h2>
                    <p className="text-sm text-gray-500 mt-0.5">{t('dashboard')} - {t('customReports')}</p>
                  </div>
                  <div className="flex flex-wrap justify-between items-center gap-4 mt-4">
                <div>
                      <h1 className="text-2xl font-bold text-gray-900 mb-1">{t('customReports')}</h1>
                      <p className="text-sm text-gray-500">{t('generatePersonalizedReports')}</p>
                </div>
                <Link href="/analytics/custom-reports/create">
                      <button className="px-4 py-2 rounded-md bg-orange-500 text-white flex items-center gap-2 font-medium hover:bg-orange-600 text-sm shadow-sm">
                    <Plus size={18} /> {t('createNewReport')}
                  </button>
                </Link>
              </div>
                </div>

            <div className="space-y-6">

              {/* Saved Reports - Full Row */}
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-0 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-base font-bold text-gray-900">{t('savedReports')}</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm text-left">
                    <thead className="bg-gray-50">
                      <tr className="text-xs font-semibold text-gray-700">
                        <th className="py-3 px-6">{t('reportName')}</th>
                        <th className="py-3 px-3">{t('reportType')}</th>
                        <th className="py-3 px-3">{t('createdOn')}</th>
                        <th className="py-3 px-3">{t('lastRun')}</th>
                        <th className="py-3 px-3">{t('actions')}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      <tr>
                        <td className="py-3 px-6 text-sm text-gray-900">Monthly Sales Report</td>
                        <td className="py-3 px-3">
                          <span className="inline-block px-2.5 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">{t('sales')}</span>
                        </td>
                        <td className="py-3 px-3 text-sm text-gray-700">Jan 01, 2023</td>
                        <td className="py-3 px-3 text-sm text-gray-700">Jan 25, 2023</td>
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-3 text-xs">
                            <button className="text-blue-600 hover:underline">{t('view')}</button>
                            <button className="text-blue-600 hover:underline">{t('edit')}</button>
                            <button className="text-blue-600 hover:underline">{t('export')}</button>
                            <button className="text-red-600 hover:underline">{t('delete')}</button>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td className="py-3 px-6 text-sm text-gray-900">Customer Insights - Q1</td>
                        <td className="py-3 px-3">
                          <span className="inline-block px-2.5 py-1 text-xs font-medium bg-purple-100 text-purple-700 rounded-full">{t('customers')}</span>
                        </td>
                        <td className="py-3 px-3 text-sm text-gray-700">Dec 10, 2024</td>
                        <td className="py-3 px-3 text-sm text-gray-700">Jan 17, 2023</td>
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-3 text-xs">
                            <button className="text-blue-600 hover:underline">{t('view')}</button>
                            <button className="text-blue-600 hover:underline">{t('edit')}</button>
                            <button className="text-blue-600 hover:underline">{t('export')}</button>
                            <button className="text-red-600 hover:underline">{t('delete')}</button>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td className="py-3 px-6 text-sm text-gray-900">Transactional Summary</td>
                        <td className="py-3 px-3">
                          <span className="inline-block px-2.5 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">{t('transactions')}</span>
                        </td>
                        <td className="py-3 px-3 text-sm text-gray-700">Jan 15, 2023</td>
                        <td className="py-3 px-3 text-sm text-gray-700">Jan 25, 2023</td>
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-3 text-xs">
                            <button className="text-blue-600 hover:underline">{t('view')}</button>
                            <button className="text-blue-600 hover:underline">{t('edit')}</button>
                            <button className="text-blue-600 hover:underline">{t('export')}</button>
                            <button className="text-red-600 hover:underline">{t('delete')}</button>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Report Builder and Smart Insights - Same Row */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                {/* Report Builder */}
                <div className="lg:col-span-2 bg-white border border-gray-200 rounded-lg shadow-sm p-6">
                    <h2 className="text-base font-bold text-gray-900 mb-5">{t('reportBuilder')}</h2>
                    
                      {/* Select Report Type */}
                    <div className="mb-5">
                      <label className="block text-sm font-medium text-gray-700 mb-3">{t('selectReportType')}</label>
                      <div className="flex gap-2 flex-wrap">
                        <button className="bg-blue-600 border-2 border-blue-600 px-4 py-3 rounded-md flex flex-col items-center min-w-[70px] hover:bg-blue-700">
                          <LineChart className="mb-1.5 text-white" size={20} />
                          <span className="text-xs font-medium text-white">{t('sales')}</span>
                          </button>
                        <button className="bg-gray-100 border border-gray-300 px-4 py-3 rounded-md flex flex-col items-center min-w-[70px] hover:bg-gray-50">
                          <ShoppingCart className="mb-1.5 text-gray-700" size={20} />
                          <span className="text-xs font-medium text-gray-700">{t('transactions')}</span>
                          </button>
                        <button className="bg-gray-100 border border-gray-300 px-4 py-3 rounded-md flex flex-col items-center min-w-[70px] hover:bg-gray-50">
                          <Users className="mb-1.5 text-gray-700" size={20} />
                          <span className="text-xs font-medium text-gray-700">{t('customers')}</span>
                          </button>
                        <button className="bg-gray-100 border border-gray-300 px-4 py-3 rounded-md flex flex-col items-center min-w-[70px] hover:bg-gray-50">
                          <Package className="mb-1.5 text-gray-700" size={20} />
                          <span className="text-xs font-medium text-gray-700">{t('inventory')}</span>
                          </button>
                        <button className="bg-gray-100 border border-gray-300 px-4 py-3 rounded-md flex flex-col items-center min-w-[70px] hover:bg-gray-50">
                          <RefreshCw className="mb-1.5 text-gray-700" size={20} />
                          <span className="text-xs font-medium text-gray-700">{t('refunds')}</span>
                          </button>
                        </div>
                      </div>
                      
                      {/* Date Range */}
                    <div className="mb-5">
                      <label className="block text-sm font-medium text-gray-700 mb-3">{t('dateRange')}</label>
                        <div className="flex gap-2 flex-wrap">
                        <button className="px-4 py-2 rounded-md bg-blue-600 text-white text-sm font-medium border border-blue-600">{t('today')}</button>
                        <button className="px-4 py-2 rounded-md bg-gray-100 border border-gray-300 text-sm font-medium text-gray-700">{t('last7Days')}</button>
                        <button className="px-4 py-2 rounded-md bg-gray-100 border border-gray-300 text-sm font-medium text-gray-700">{t('thisMonth')}</button>
                        <button className="px-4 py-2 rounded-md bg-gray-100 border border-gray-300 text-sm font-medium text-gray-700">{t('lastMonth')}</button>
                        <button className="px-4 py-2 rounded-md bg-gray-100 border border-gray-300 text-sm font-medium text-gray-700">{t('customRange')}</button>
                      </div>
                    </div>
                    
                    {/* Filters */}
                    <div className="mb-5">
                      <label className="block text-sm font-medium text-gray-700 mb-3">{t('filters')}</label>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="relative">
                          <label className="block text-xs font-medium text-gray-700 mb-2">{t('allProducts')}</label>
                          <select className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none" title={t('allProducts')}>
                              <option>{t('allProducts')}</option>
                              <option>Featured</option>
                            </select>
                          <ChevronDown className="absolute right-3 top-9 h-4 w-4 text-gray-500 pointer-events-none" />
                          </div>
                        <div className="relative">
                          <label className="block text-xs font-medium text-gray-700 mb-2">{t('allCategories')}</label>
                          <select className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none" title={t('allCategories')}>
                              <option>{t('allCategories')}</option>
                              <option>{t('electronics')}</option>
                            </select>
                          <ChevronDown className="absolute right-3 top-9 h-4 w-4 text-gray-500 pointer-events-none" />
                        </div>
                        <div className="relative">
                          <label className="block text-xs font-medium text-gray-700 mb-2">{t('allPaymentMethods')}</label>
                          <select className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none" title={t('allPaymentMethods')}>
                            <option>{t('allPaymentMethods')}</option>
                            <option>Cash</option>
                            </select>
                          <ChevronDown className="absolute right-3 top-9 h-4 w-4 text-gray-500 pointer-events-none" />
                          </div>
                        <div className="relative">
                          <label className="block text-xs font-medium text-gray-700 mb-2">{t('allRegions')}</label>
                          <select className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none" title={t('allRegions')}>
                            <option>{t('allRegions')}</option>
                            <option>Riyadh</option>
                            </select>
                          <ChevronDown className="absolute right-3 top-9 h-4 w-4 text-gray-500 pointer-events-none" />
                        </div>
                      </div>
                    </div>
                    
                    {/* Metrics */}
                    <div className="mb-5">
                      <label className="block text-sm font-medium text-gray-700 mb-3">{t('metrics')}</label>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          {label:t('revenue'), checked:true},
                          {label:t('refunds')},
                          {label:t('discounts')},
                          {label:t('orders'), checked:true},
                          {label:t('customerGrowth')},
                          {label:t('conversionRate')},
                        ].map(({label,checked}) => (
                          <label key={label} className={`flex items-center gap-2 px-3 py-2 border rounded-md cursor-pointer text-xs font-medium text-gray-700 transition-colors ${checked ? 'bg-blue-50 border-blue-300' : 'bg-white border-gray-300 hover:bg-gray-50'}`}>
                            <input type="checkbox" className={`w-4 h-4 rounded border-2 ${checked ? 'bg-blue-600 border-blue-600 text-white checked:bg-blue-600 checked:border-blue-600' : 'bg-white border-gray-300'}`} defaultChecked={checked} />
                            {label}
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Visualization */}
                    <div className="mb-5">
                      <label className="block text-sm font-medium text-gray-700 mb-3">{t('visualization')}</label>
                      <div className="flex gap-2">
                        <button className="px-4 py-2 rounded-md bg-gray-100 border border-gray-300 text-sm font-medium text-gray-700">{t('table')}</button>
                        <button className="px-4 py-2 rounded-md bg-blue-600 text-white text-sm font-medium">{t('chart')}</button>
                        <button className="px-4 py-2 rounded-md bg-gray-100 border border-gray-300 text-sm font-medium text-gray-700">{t('combined')}</button>
                      </div>
                    </div>
                    
                    {/* Generate Report Button */}
                    <div className="flex justify-end">
                      <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md font-semibold text-sm shadow-sm">
                        {t('generateReport')}
                      </button>
                    </div>
                </div>

                {/* Smart Insights */}
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                  <h2 className="text-base font-bold text-gray-900 mb-5">{t('smartInsights')}</h2>
                  <div className="space-y-4">
                    <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
                      <div className="flex items-start gap-3">
                        <TrendingUp className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
                        <div>
                          <p className="text-sm font-semibold text-blue-700 mb-1">{t('salesGrowth')}</p>
                          <p className="text-xs text-gray-700">{t('dataGrew')}</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-green-50 rounded-lg border border-green-200 p-4">
                      <div className="flex items-start gap-3">
                        <Users className="text-green-600 flex-shrink-0 mt-0.5" size={20} />
                        <div>
                          <p className="text-sm font-semibold text-green-700 mb-1">{t('customerLoyalty')}</p>
                          <p className="text-xs text-gray-700">{t('retainingCustomersGenerated')}</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-yellow-50 rounded-lg border border-yellow-200 p-4">
                      <div className="flex items-start gap-3">
                        <Clock className="text-yellow-600 flex-shrink-0 mt-0.5" size={20} />
                        <div>
                          <p className="text-sm font-semibold text-yellow-700 mb-1">{t('peakHoursOrders')}</p>
                          <p className="text-xs text-gray-700">{t('mostOrdersOccur')}</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-purple-50 rounded-lg border border-purple-200 p-4">
                      <div className="flex items-start gap-3">
                        <Star className="text-purple-600 flex-shrink-0 mt-0.5" size={20} />
                        <div>
                          <p className="text-sm font-semibold text-purple-700 mb-1">{t('topProduct')}</p>
                          <p className="text-xs text-gray-700">{t('electronicsShowsHigher')}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Report Preview - Below Report Builder and Smart Insights */}
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 max-w-2xl">
                <h2 className="text-base font-bold text-gray-900 mb-5">{t('reportPreview')}</h2>
                
                {/* Chart Section */}
                <div>
                  <h3 className="text-sm font-bold text-gray-900 mb-4">{t('salesTrend')} - {t('last7Days')}</h3>
                  
                  {/* Chart Container */}
                  <div className="relative">
                    {/* Y-axis Label */}
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 -rotate-90 text-xs font-medium text-gray-600 whitespace-nowrap">
                      {t('revenueK')}
                    </div>
                    
                    {/* Chart Area */}
                    <div className="ml-8 mr-4 mb-8">
                      {/* Y-axis values and grid lines */}
                      <div className="relative h-48">
                        {/* Grid lines */}
                        <div className="absolute inset-0 flex flex-col justify-between">
                          <div className="border-t border-gray-200"></div>
                          <div className="border-t border-gray-200"></div>
                          <div className="border-t border-gray-200"></div>
                          <div className="border-t border-gray-200"></div>
                        </div>
                        
                        {/* Y-axis labels */}
                        <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-600 -ml-6">
                          <span>20K</span>
                          <span>15K</span>
                          <span>10K</span>
                          <span>5K</span>
                          <span>0</span>
                        </div>
                        
                        {/* Chart Line */}
                        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 160" preserveAspectRatio="none">
                          {/* Data points - adjusted for the trend shown */}
                          <circle cx="28" cy="140" r="4" fill="#3b82f6" />
                          <circle cx="85" cy="100" r="4" fill="#3b82f6" />
                          <circle cx="142" cy="80" r="4" fill="#3b82f6" />
                          <circle cx="199" cy="112" r="4" fill="#3b82f6" />
                          <circle cx="256" cy="50" r="4" fill="#3b82f6" />
                          <circle cx="313" cy="30" r="4" fill="#3b82f6" />
                          <circle cx="370" cy="60" r="4" fill="#3b82f6" />
                          
                          {/* Line */}
                          <polyline
                            fill="none"
                            stroke="#3b82f6"
                            strokeWidth="2.5"
                            points="28,140 85,100 142,80 199,112 256,50 313,30 370,60"
                          />
                        </svg>
                      </div>
                      
                      {/* X-axis labels */}
                      <div className="flex justify-between mt-2 text-xs text-gray-600">
                        <span>Mon</span>
                        <span>Tue</span>
                        <span>Wed</span>
                        <span>Thu</span>
                        <span>Fri</span>
                        <span>Sat</span>
                        <span>Sun</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Legend */}
                  <div className="flex items-center gap-2 mt-4">
                    <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                    <span className="text-xs text-gray-700">{t('sales')}</span>
                  </div>
                </div>
              </div>

              {/* Export Options - Below Report Preview */}
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 max-w-2xl">
                <h2 className="text-base font-bold text-gray-900 mb-4">{t('exportOptions')}</h2>
                <div className="flex gap-2 flex-wrap">
                  <button className="flex items-center gap-2 px-4 py-2 rounded-md bg-green-600 text-white text-sm font-medium hover:bg-green-700">
                    <FileSpreadsheet size={16} />
                    {t('excel')}
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 rounded-md bg-red-600 text-white text-sm font-medium hover:bg-red-700">
                    <FileText size={16} />
                    {t('pdf')}
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 rounded-md bg-blue-600 text-white text-sm font-medium hover:bg-blue-700">
                    <FileCode size={16} />
                    {t('csv')}
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 rounded-md bg-purple-600 text-white text-sm font-medium hover:bg-purple-700">
                    <Clock size={16} />
                    {t('schedule')}
                  </button>
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
              <Sidebar onClose={() => setSidebarOpen(false)} currentPage="analyticsCustom" />
            </div>
          </div>
        )}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
          <Header onToggleSidebar={() => setSidebarOpen(true)} isSidebarOpen={sidebarOpen} />
        </div>
        <main className="p-4 sm:p-6 bg-gray-50 min-h-screen pt-20 sm:pt-4">
          {/* Main White Card Container */}
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="mb-4 sm:mb-6">
              <div className="mb-2">
                <h2 className="text-base sm:text-lg font-bold text-gray-900">{t('analyticsReports')}</h2>
                <p className="text-xs sm:text-sm text-gray-500 mt-0.5">{t('dashboard')} - {t('customReports')}</p>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4 mt-3 sm:mt-4">
            <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">{t('customReports')}</h1>
                  <p className="text-xs sm:text-sm text-gray-500">{t('generatePersonalizedReports')}</p>
            </div>
            <Link href="/analytics/custom-reports/create">
                  <button className="px-3 sm:px-4 py-2 rounded-md bg-orange-500 text-white flex items-center gap-2 font-medium hover:bg-orange-600 text-xs sm:text-sm shadow-sm">
                <Plus size={16} /> {t('createNewReport')}
              </button>
            </Link>
          </div>
            </div>

            <div className="space-y-4 sm:space-y-6">
            {/* Saved Reports */}
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-0 overflow-hidden">
                <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
                  <h2 className="text-sm sm:text-base font-bold text-gray-900">{t('savedReports')}</h2>
              </div>
              <div className="overflow-x-auto">
                  <table className="min-w-full text-xs sm:text-sm text-left">
                  <thead className="bg-gray-50">
                      <tr className="text-xs font-semibold text-gray-700">
                        <th className="py-3 px-4 sm:px-6">{t('reportName')}</th>
                        <th className="py-3 px-3">{t('reportType')}</th>
                        <th className="py-3 px-3">{t('createdOn')}</th>
                        <th className="py-3 px-3">{t('lastRun')}</th>
                        <th className="py-3 px-3">{t('actions')}</th>
                    </tr>
                  </thead>
                    <tbody className="divide-y divide-gray-200">
                      <tr>
                        <td className="py-3 px-4 sm:px-6 text-sm text-gray-900">Monthly Sales Report</td>
                        <td className="py-3 px-3">
                          <span className="inline-block px-2.5 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">{t('sales')}</span>
                      </td>
                        <td className="py-3 px-3 text-sm text-gray-700">Jan 01, 2023</td>
                        <td className="py-3 px-3 text-sm text-gray-700">Jan 25, 2023</td>
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2 sm:gap-3 text-xs flex-wrap">
                        <button className="text-blue-600 hover:underline">{t('view')}</button>
                            <button className="text-blue-600 hover:underline">{t('edit')}</button>
                            <button className="text-blue-600 hover:underline">{t('export')}</button>
                            <button className="text-red-600 hover:underline">{t('delete')}</button>
                          </div>
                      </td>
                    </tr>
                    <tr>
                        <td className="py-3 px-4 sm:px-6 text-sm text-gray-900">Customer Insights - Q1</td>
                        <td className="py-3 px-3">
                          <span className="inline-block px-2.5 py-1 text-xs font-medium bg-purple-100 text-purple-700 rounded-full">{t('customers')}</span>
                      </td>
                        <td className="py-3 px-3 text-sm text-gray-700">Dec 10, 2024</td>
                        <td className="py-3 px-3 text-sm text-gray-700">Jan 17, 2023</td>
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2 sm:gap-3 text-xs flex-wrap">
                        <button className="text-blue-600 hover:underline">{t('view')}</button>
                            <button className="text-blue-600 hover:underline">{t('edit')}</button>
                            <button className="text-blue-600 hover:underline">{t('export')}</button>
                            <button className="text-red-600 hover:underline">{t('delete')}</button>
                          </div>
                      </td>
                    </tr>
                    <tr>
                        <td className="py-3 px-4 sm:px-6 text-sm text-gray-900">Transactional Summary</td>
                        <td className="py-3 px-3">
                          <span className="inline-block px-2.5 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">{t('transactions')}</span>
                      </td>
                        <td className="py-3 px-3 text-sm text-gray-700">Jan 15, 2023</td>
                        <td className="py-3 px-3 text-sm text-gray-700">Jan 25, 2023</td>
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2 sm:gap-3 text-xs flex-wrap">
                        <button className="text-blue-600 hover:underline">{t('view')}</button>
                            <button className="text-blue-600 hover:underline">{t('edit')}</button>
                            <button className="text-blue-600 hover:underline">{t('export')}</button>
                            <button className="text-red-600 hover:underline">{t('delete')}</button>
                          </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
              {/* Report Builder */}
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 sm:p-6">
                <h2 className="text-sm sm:text-base font-bold text-gray-900 mb-4 sm:mb-5">{t('reportBuilder')}</h2>
                
                {/* Select Report Type */}
                <div className="mb-4 sm:mb-5">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-3">{t('selectReportType')}</label>
                  <div className="flex gap-2 flex-wrap">
                    <button className="bg-blue-600 border-2 border-blue-600 px-3 sm:px-4 py-2 sm:py-3 rounded-md flex flex-col items-center min-w-[60px] sm:min-w-[70px] hover:bg-blue-700">
                      <LineChart className="mb-1.5 text-white" size={18} />
                      <span className="text-xs font-medium text-white">{t('sales')}</span>
                    </button>
                    <button className="bg-gray-100 border border-gray-300 px-3 sm:px-4 py-2 sm:py-3 rounded-md flex flex-col items-center min-w-[60px] sm:min-w-[70px] hover:bg-gray-50">
                      <ShoppingCart className="mb-1.5 text-gray-700" size={18} />
                      <span className="text-xs font-medium text-gray-700">{t('transactions')}</span>
                    </button>
                    <button className="bg-gray-100 border border-gray-300 px-3 sm:px-4 py-2 sm:py-3 rounded-md flex flex-col items-center min-w-[60px] sm:min-w-[70px] hover:bg-gray-50">
                      <Users className="mb-1.5 text-gray-700" size={18} />
                      <span className="text-xs font-medium text-gray-700">{t('customers')}</span>
                    </button>
                    <button className="bg-gray-100 border border-gray-300 px-3 sm:px-4 py-2 sm:py-3 rounded-md flex flex-col items-center min-w-[60px] sm:min-w-[70px] hover:bg-gray-50">
                      <Package className="mb-1.5 text-gray-700" size={18} />
                      <span className="text-xs font-medium text-gray-700">{t('inventory')}</span>
                    </button>
                    <button className="bg-gray-100 border border-gray-300 px-3 sm:px-4 py-2 sm:py-3 rounded-md flex flex-col items-center min-w-[60px] sm:min-w-[70px] hover:bg-gray-50">
                      <RefreshCw className="mb-1.5 text-gray-700" size={18} />
                      <span className="text-xs font-medium text-gray-700">{t('refunds')}</span>
                    </button>
                  </div>
                </div>
                
                {/* Date Range */}
                <div className="mb-4 sm:mb-5">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-3">{t('dateRange')}</label>
                  <div className="flex gap-2 flex-wrap">
                    <button className="px-3 sm:px-4 py-2 rounded-md bg-blue-600 text-white text-xs sm:text-sm font-medium border border-blue-600">{t('today')}</button>
                    <button className="px-3 sm:px-4 py-2 rounded-md bg-gray-100 border border-gray-300 text-xs sm:text-sm font-medium text-gray-700">{t('last7Days')}</button>
                    <button className="px-3 sm:px-4 py-2 rounded-md bg-gray-100 border border-gray-300 text-xs sm:text-sm font-medium text-gray-700">{t('thisMonth')}</button>
                    <button className="px-3 sm:px-4 py-2 rounded-md bg-gray-100 border border-gray-300 text-xs sm:text-sm font-medium text-gray-700">{t('lastMonth')}</button>
                    <button className="px-3 sm:px-4 py-2 rounded-md bg-gray-100 border border-gray-300 text-xs sm:text-sm font-medium text-gray-700">{t('customRange')}</button>
                  </div>
                </div>
                
                {/* Filters */}
                <div className="mb-4 sm:mb-5">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-3">{t('filters')}</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="relative">
                      <label className="block text-xs font-medium text-gray-700 mb-2">{t('allProducts')}</label>
                      <select className="w-full rounded-md border border-gray-300 px-3 py-2 text-xs sm:text-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none" title={t('allProducts')}>
                      <option>{t('allProducts')}</option>
                      <option>Featured</option>
                    </select>
                      <ChevronDown className="absolute right-3 top-9 h-4 w-4 text-gray-500 pointer-events-none" />
                  </div>
                    <div className="relative">
                      <label className="block text-xs font-medium text-gray-700 mb-2">{t('allCategories')}</label>
                      <select className="w-full rounded-md border border-gray-300 px-3 py-2 text-xs sm:text-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none" title={t('allCategories')}>
                      <option>{t('allCategories')}</option>
                      <option>{t('electronics')}</option>
                    </select>
                      <ChevronDown className="absolute right-3 top-9 h-4 w-4 text-gray-500 pointer-events-none" />
                    </div>
                    <div className="relative">
                      <label className="block text-xs font-medium text-gray-700 mb-2">{t('allPaymentMethods')}</label>
                      <select className="w-full rounded-md border border-gray-300 px-3 py-2 text-xs sm:text-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none" title={t('allPaymentMethods')}>
                        <option>{t('allPaymentMethods')}</option>
                        <option>Cash</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-9 h-4 w-4 text-gray-500 pointer-events-none" />
                    </div>
                    <div className="relative">
                      <label className="block text-xs font-medium text-gray-700 mb-2">{t('allRegions')}</label>
                      <select className="w-full rounded-md border border-gray-300 px-3 py-2 text-xs sm:text-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none" title={t('allRegions')}>
                        <option>{t('allRegions')}</option>
                        <option>Riyadh</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-9 h-4 w-4 text-gray-500 pointer-events-none" />
                    </div>
                  </div>
                </div>
                
                {/* Metrics */}
                <div className="mb-4 sm:mb-5">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-3">{t('metrics')}</label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      {label:t('revenue'), checked:true},
                      {label:t('refunds')},
                      {label:t('discounts')},
                      {label:t('orders'), checked:true},
                      {label:t('customerGrowth')},
                      {label:t('conversionRate')},
                    ].map(({label,checked}) => (
                      <label key={label} className={`flex items-center gap-2 px-3 py-2 border rounded-md cursor-pointer text-xs font-medium text-gray-700 transition-colors ${checked ? 'bg-blue-50 border-blue-300' : 'bg-white border-gray-300 hover:bg-gray-50'}`}>
                        <input type="checkbox" className={`w-4 h-4 rounded border-2 ${checked ? 'bg-blue-600 border-blue-600 text-white checked:bg-blue-600 checked:border-blue-600' : 'bg-white border-gray-300'}`} defaultChecked={checked} />
                        {label}
                      </label>
                    ))}
                  </div>
                </div>
                
                {/* Visualization */}
                <div className="mb-4 sm:mb-5">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-3">{t('visualization')}</label>
                  <div className="flex gap-2">
                    <button className="px-3 sm:px-4 py-2 rounded-md bg-gray-100 border border-gray-300 text-xs sm:text-sm font-medium text-gray-700">{t('table')}</button>
                    <button className="px-3 sm:px-4 py-2 rounded-md bg-blue-600 text-white text-xs sm:text-sm font-medium">{t('chart')}</button>
                    <button className="px-3 sm:px-4 py-2 rounded-md bg-gray-100 border border-gray-300 text-xs sm:text-sm font-medium text-gray-700">{t('combined')}</button>
                  </div>
                </div>
                
                {/* Generate Report Button */}
                <div className="flex justify-end">
                  <button className="px-3 sm:px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md font-semibold text-xs sm:text-sm shadow-sm">
                    {t('generateReport')}
                  </button>
                </div>
              </div>

              {/* Report Preview */}
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 sm:p-6">
                <h2 className="text-sm sm:text-base font-bold text-gray-900 mb-4 sm:mb-5">{t('reportPreview')}</h2>
                
                {/* Chart Section */}
                  <div>
                  <h3 className="text-xs sm:text-sm font-bold text-gray-900 mb-4">{t('salesTrend')} - {t('last7Days')}</h3>
                  
                  {/* Chart Container */}
                  <div className="relative">
                    {/* Y-axis Label */}
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 -rotate-90 text-xs font-medium text-gray-600 whitespace-nowrap">
                      {t('revenueK')}
                    </div>
                    
                    {/* Chart Area */}
                    <div className="ml-8 mr-4 mb-8">
                      {/* Y-axis values and grid lines */}
                      <div className="relative h-40 sm:h-48">
                        {/* Grid lines */}
                        <div className="absolute inset-0 flex flex-col justify-between">
                          <div className="border-t border-gray-200"></div>
                          <div className="border-t border-gray-200"></div>
                          <div className="border-t border-gray-200"></div>
                          <div className="border-t border-gray-200"></div>
                        </div>
                        
                        {/* Y-axis labels */}
                        <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-600 -ml-6">
                          <span>20K</span>
                          <span>15K</span>
                          <span>10K</span>
                          <span>5K</span>
                          <span>0</span>
                        </div>
                        
                        {/* Chart Line */}
                        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 160" preserveAspectRatio="none">
                          {/* Data points */}
                          <circle cx="28" cy="140" r="4" fill="#3b82f6" />
                          <circle cx="85" cy="100" r="4" fill="#3b82f6" />
                          <circle cx="142" cy="80" r="4" fill="#3b82f6" />
                          <circle cx="199" cy="112" r="4" fill="#3b82f6" />
                          <circle cx="256" cy="50" r="4" fill="#3b82f6" />
                          <circle cx="313" cy="30" r="4" fill="#3b82f6" />
                          <circle cx="370" cy="60" r="4" fill="#3b82f6" />
                          
                          {/* Line */}
                          <polyline
                            fill="none"
                            stroke="#3b82f6"
                            strokeWidth="2.5"
                            points="28,140 85,100 142,80 199,112 256,50 313,30 370,60"
                          />
                        </svg>
                      </div>
                      
                      {/* X-axis labels */}
                      <div className="flex justify-between mt-2 text-xs text-gray-600">
                        <span>Mon</span>
                        <span>Tue</span>
                        <span>Wed</span>
                        <span>Thu</span>
                        <span>Fri</span>
                        <span>Sat</span>
                        <span>Sun</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Legend */}
                  <div className="flex items-center gap-2 mt-4">
                    <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                    <span className="text-xs text-gray-700">{t('sales')}</span>
                  </div>
                </div>
                  </div>

              {/* Export Options - Separate Section */}
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 sm:p-6">
                <h2 className="text-sm sm:text-base font-bold text-gray-900 mb-4">{t('exportOptions')}</h2>
                <div className="flex gap-2 flex-wrap">
                  <button className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-md bg-green-600 text-white text-xs sm:text-sm font-medium hover:bg-green-700">
                    <FileSpreadsheet size={16} />
                    {t('excel')}
                  </button>
                  <button className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-md bg-red-600 text-white text-xs sm:text-sm font-medium hover:bg-red-700">
                    <FileText size={16} />
                    {t('pdf')}
                  </button>
                  <button className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-md bg-blue-600 text-white text-xs sm:text-sm font-medium hover:bg-blue-700">
                    <FileCode size={16} />
                    {t('csv')}
                  </button>
                  <button className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-md bg-purple-600 text-white text-xs sm:text-sm font-medium hover:bg-purple-700">
                    <Clock size={16} />
                    {t('schedule')}
                  </button>
                </div>
              </div>

              {/* Smart Insights */}
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 sm:p-6">
                <h2 className="text-sm sm:text-base font-bold text-gray-900 mb-4 sm:mb-5">{t('smartInsights')}</h2>
                <div className="space-y-4">
                  <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
                    <div className="flex items-start gap-3">
                      <TrendingUp className="text-blue-600 flex-shrink-0 mt-0.5" size={18} />
                  <div>
                        <p className="text-xs sm:text-sm font-semibold text-blue-700 mb-1">{t('salesGrowth')}</p>
                        <p className="text-xs text-gray-700">{t('dataGrew')}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-green-50 rounded-lg border border-green-200 p-4">
                    <div className="flex items-start gap-3">
                      <Users className="text-green-600 flex-shrink-0 mt-0.5" size={18} />
                      <div>
                        <p className="text-xs sm:text-sm font-semibold text-green-700 mb-1">{t('customerLoyalty')}</p>
                        <p className="text-xs text-gray-700">{t('retainingCustomersGenerated')}</p>
                      </div>
                  </div>
                </div>
                  <div className="bg-yellow-50 rounded-lg border border-yellow-200 p-4">
                    <div className="flex items-start gap-3">
                      <Clock className="text-yellow-600 flex-shrink-0 mt-0.5" size={18} />
                  <div>
                        <p className="text-xs sm:text-sm font-semibold text-yellow-700 mb-1">{t('peakHoursOrders')}</p>
                        <p className="text-xs text-gray-700">{t('mostOrdersOccur')}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-purple-50 rounded-lg border border-purple-200 p-4">
                    <div className="flex items-start gap-3">
                      <Star className="text-purple-600 flex-shrink-0 mt-0.5" size={18} />
                      <div>
                        <p className="text-xs sm:text-sm font-semibold text-purple-700 mb-1">{t('topProduct')}</p>
                        <p className="text-xs text-gray-700">{t('electronicsShowsHigher')}</p>
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
  );
}
