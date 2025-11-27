"use client";

import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import {
  ChevronRight,
  ChevronDown,
  X,
  Plus,
  BarChart3,
  FileText,
  Calendar,
  Users,
  DollarSign,
  ShoppingCart,
  RefreshCw,
  Star,
  PieChart,
  Sliders,
  Check,
  Table2,
  TrendingUp,
  PieChart as PieChartIcon,
  Layers,
  FileText as FileTextIcon,
  FileSpreadsheet,
  FileCode,
  Play,
  Save,
} from 'lucide-react';

export default function CreateReportPage() {
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
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 w-full">
            {/* Main White Card Container */}
            <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 md:p-8 max-w-7xl mx-auto">
              {/* Header Section */}
              <div className="mb-6">
                <div className="mb-2">
                  <h2 className="text-lg font-bold text-gray-900">Analytics & Reports</h2>
                  <p className="text-sm mt-0.5">
                    <span className="text-gray-500">Dashboard</span>
                    <span className="text-gray-900"> • Custom Reports</span>
                  </p>
                </div>
                <div className="flex flex-wrap justify-between items-start gap-4 mt-4">
              <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Create New Report</h1>
                    <nav className="text-xs text-gray-400 flex items-center gap-1.5" aria-label="breadcrumb">
                  <Link to="/analytics/custom-reports" className="hover:underline text-gray-500">Analytics & Reports</Link>
                  <ChevronRight size={14} />
                  <Link to="/analytics/custom-reports" className="hover:underline text-gray-500">Custom Reports</Link>
                  <ChevronRight size={14} />
                      <span className="text-orange-500">Create New Report</span>
                </nav>
              </div>
              <div className="flex gap-2">
                <Link to="/analytics/custom-reports">
                      <button className="border border-gray-300 px-4 py-2 rounded-md text-gray-700 bg-white text-sm font-medium hover:bg-gray-50 flex items-center">
                    Cancel
                  </button>
                </Link>
                    <button className="px-4 py-2 rounded-md bg-orange-500 text-white text-sm font-semibold hover:bg-orange-600">
                  Save Report
                </button>
              </div>
              </div>
            </div>

            {/* CARD: Report Details */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-base font-bold text-gray-900 mb-5">Report Details</h2>
              <div className="space-y-4">
                {/* First Row: Report Name and Report Type side by side */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Report Name</label>
                    <input className="w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Monthly Refund Overview" />
                </div>
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
                    <select title="Report Type" className="w-full rounded-md border border-gray-300 px-4 py-2.5 pr-10 text-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none">
                    <option>Sales</option>
                    <option>Customers</option>
                    <option>Transactions</option>
                    <option>Earnings</option>
                  </select>
                    <ChevronDown className="absolute right-3 top-9 h-4 w-4 text-gray-500 pointer-events-none" />
                  </div>
                </div>
                {/* Second Row: Description spanning full width */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description (Optional)</label>
                  <textarea rows={3} className="w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none" placeholder="Add notes about this report..."></textarea>
                </div>
              </div>
            </div>

            {/* CARD: Filters & Conditions */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-base font-bold text-gray-900 mb-5">Filters & Conditions</h2>
              
              {/* Date Range Section */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">Date Range</label>
                <div className="flex flex-wrap gap-2">
                  <button className="px-4 py-2 rounded-md bg-gray-100 border border-gray-300 text-sm font-medium text-gray-700">Today</button>
                  <button className="px-4 py-2 rounded-md bg-gray-100 border border-gray-300 text-sm font-medium text-gray-700">Last 7 Days</button>
                  <button className="px-4 py-2 rounded-md bg-blue-600 text-white text-sm font-medium border border-blue-600">This Month</button>
                  <button className="px-4 py-2 rounded-md bg-gray-100 border border-gray-300 text-sm font-medium text-gray-700">Last Month</button>
                  <button className="px-4 py-2 rounded-md bg-gray-100 border border-gray-300 text-sm font-medium text-gray-700">Custom Range</button>
                </div>
              </div>

              {/* Dropdown Filters Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Product / Category</label>
                  <select title="Product / Category" className="w-full rounded-md border border-gray-300 px-4 py-2.5 pr-10 text-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none">
                    <option>All Products</option>
                    <option>Electronics</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-9 h-4 w-4 text-gray-500 pointer-events-none" />
                </div>
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                  <select title="Payment Method" className="w-full rounded-md border border-gray-300 px-4 py-2.5 pr-10 text-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none">
                    <option>All Methods</option>
                    <option>Cash</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-9 h-4 w-4 text-gray-500 pointer-events-none" />
                </div>
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Order Status</label>
                  <select title="Order Status" className="w-full rounded-md border border-gray-300 px-4 py-2.5 pr-10 text-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none">
                    <option>All Status</option>
                    <option>Refunded</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-9 h-4 w-4 text-gray-500 pointer-events-none" />
                </div>
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Region / City</label>
                  <select title="Region / City" className="w-full rounded-md border border-gray-300 px-4 py-2.5 pr-10 text-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none">
                    <option>All Regions</option>
                    <option>Riyadh</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-9 h-4 w-4 text-gray-500 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* CARD: Metrics Selection */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-base font-bold text-gray-900 mb-5">Metrics Selection</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  {label:'Revenue', checked:true},
                  {label:'Discounts'},
                  {label:'Refunds', checked:true},
                  {label:'Tax'},
                  {label:'Orders', checked:true},
                  {label:'Net Profit'},
                  {label:'Processing Fees'},
                  {label:'Failed Trans.'},
                ].map(({label,checked}) => (
                  <label key={label} className={`flex items-center gap-2 px-4 py-3 border rounded-md cursor-pointer text-sm font-medium text-gray-700 transition-colors ${checked ? 'bg-blue-50 border-blue-300' : 'bg-white border-gray-300 hover:bg-gray-50'}`}>
                    <input type="checkbox" className={`w-4 h-4 rounded border-2 ${checked ? 'bg-blue-600 border-blue-600 text-white checked:bg-blue-600 checked:border-blue-600' : 'bg-white border-gray-300'}`} defaultChecked={checked} />
                    {label}
                  </label>
                ))}
              </div>
            </div>

            {/* CARD: Visualization Options */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-base font-bold text-gray-900 mb-5">Visualization Options</h2>
              <div className="flex gap-2 flex-wrap">
                <button className="px-4 py-2 rounded-md bg-blue-600 text-white text-sm font-medium flex items-center gap-2">
                  <BarChart3 size={16} />
                  Bar Chart
                </button>
                <button className="px-4 py-2 rounded-md border border-gray-300 bg-white text-gray-700 text-sm font-medium hover:bg-gray-50 flex items-center gap-2">
                  <Table2 size={16} className="text-gray-700" />
                  Table
                </button>
                <button className="px-4 py-2 rounded-md border border-gray-300 bg-white text-gray-700 text-sm font-medium hover:bg-gray-50 flex items-center gap-2">
                  <TrendingUp size={16} className="text-gray-700" />
                  Line Chart
                </button>
                <button className="px-4 py-2 rounded-md border border-gray-300 bg-white text-gray-700 text-sm font-medium hover:bg-gray-50 flex items-center gap-2">
                  <PieChartIcon size={16} className="text-gray-700" />
                  Donut Chart
                </button>
                <button className="px-4 py-2 rounded-md border border-gray-300 bg-white text-gray-700 text-sm font-medium hover:bg-gray-50 flex items-center gap-2">
                  <Layers size={16} className="text-gray-700" />
                  Combined View
                </button>
              </div>
            </div>

            {/* CARD: Report Preview */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
              <h2 className="text-base font-bold text-gray-900 mb-4">Report Preview</h2>
              
              {/* Subtitle */}
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-gray-700">Daily Revenue & Refunds - This Month</p>
                <span className="text-xs text-gray-400">Sample Data</span>
              </div>

              {/* Data Cards */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-5">
                {[
                  {label:'Week 1', barColor:'bg-blue-600', cardBg:'bg-blue-50'},
                  {label:'Week 2', barColor:'bg-blue-600', cardBg:'bg-blue-50'},
                  {label:'Week 3', barColor:'bg-blue-600', cardBg:'bg-blue-50'},
                  {label:'Week 4', barColor:'bg-blue-600', cardBg:'bg-blue-50'},
                  {label:'Refunds', barColor:'bg-red-600', cardBg:'bg-red-50'},
                ].map((card, i) => (
                  <div key={card.label} className={`${card.cardBg} rounded-md border border-gray-200 overflow-hidden`}>
                    <div className={`${card.barColor} h-16`}></div>
                    <div className="p-3">
                      <p className="text-sm font-medium text-gray-700">{card.label}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary Statistics */}
              <div className="flex flex-wrap items-center gap-4 text-sm mb-6">
                <span className="text-gray-700">Total Revenue: <span className="font-semibold text-gray-900">$45,230</span></span>
                <span className="text-gray-700">Total Orders: <span className="font-semibold text-gray-900">1,247</span></span>
                <span className="text-gray-700">Total Refunds: <span className="font-semibold text-red-600">$2,340</span></span>
                <span className="text-gray-700">Net Revenue: <span className="font-semibold text-green-600">$42,890</span></span>
              </div>

              {/* Bottom Section */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pt-4 border-t border-gray-200">
                {/* Export Options */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-700">Export Options:</span>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-gray-300 bg-white text-gray-700 text-xs font-medium hover:bg-gray-50">
                    <FileTextIcon size={14} className="text-red-600" />
                    <span>PDF</span>
                  </button>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-gray-300 bg-white text-gray-700 text-xs font-medium hover:bg-gray-50">
                    <FileSpreadsheet size={14} className="text-green-600" />
                    <span>EXCEL</span>
                  </button>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-gray-300 bg-white text-gray-700 text-xs font-medium hover:bg-gray-50">
                    <FileCode size={14} className="text-blue-600" />
                    <span>CSV</span>
                  </button>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-2 px-4 py-2 rounded-md bg-orange-500 text-white text-sm font-medium hover:bg-orange-600">
                    <Play size={16} />
                    Run Report Now
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 rounded-md bg-blue-700 text-white text-sm font-medium hover:bg-blue-800">
                    <Save size={16} />
                    Save Report
                  </button>
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
        <main className="p-4 sm:p-6 w-full bg-gray-50 min-h-screen mt-16 sm:mt-0">
          {/* Main White Card Container */}
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="mb-4 sm:mb-6">
              <div className="mb-2">
                <h2 className="text-base sm:text-lg font-bold text-gray-900">Analytics & Reports</h2>
                <p className="text-xs sm:text-sm mt-0.5">
                  <span className="text-gray-500">Dashboard</span>
                  <span className="text-gray-900"> • Custom Reports</span>
                </p>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 sm:gap-4 mt-3 sm:mt-4">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Create New Report</h1>
                  <nav className="text-xs text-gray-400 flex items-center gap-1.5" aria-label="breadcrumb">
                    <Link to="/analytics/custom-reports" className="hover:underline text-gray-500">Analytics & Reports</Link>
                    <ChevronRight size={14} />
                    <Link to="/analytics/custom-reports" className="hover:underline text-gray-500">Custom Reports</Link>
                    <ChevronRight size={14} />
                    <span className="text-orange-500">Create New Report</span>
                  </nav>
                </div>
                <div className="flex gap-2">
                  <Link to="/analytics/custom-reports">
                    <button className="border border-gray-300 px-3 sm:px-4 py-2 rounded-md text-gray-700 bg-white text-xs sm:text-sm font-medium hover:bg-gray-50 flex items-center">
                      Cancel
                    </button>
                  </Link>
                  <button className="px-3 sm:px-4 py-2 rounded-md bg-orange-500 text-white text-xs sm:text-sm font-semibold hover:bg-orange-600">
                    Save Report
                  </button>
                </div>
              </div>
            </div>

            {/* CARD: Report Details */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 sm:p-6 mb-4 sm:mb-6">
              <h2 className="text-sm sm:text-base font-bold text-gray-900 mb-4 sm:mb-5">Report Details</h2>
              <div className="space-y-4">
                {/* First Row: Report Name and Report Type side by side on larger screens */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Report Name</label>
                    <input className="w-full rounded-md border border-gray-300 px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Monthly Refund Overview" />
                  </div>
                  <div className="relative">
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Report Type</label>
                    <select title="Report Type" className="w-full rounded-md border border-gray-300 px-3 sm:px-4 py-2 sm:py-2.5 pr-10 text-xs sm:text-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none">
                      <option>Sales</option>
                      <option>Customers</option>
                      <option>Transactions</option>
                      <option>Earnings</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-9 sm:top-10 h-4 w-4 text-gray-500 pointer-events-none" />
                  </div>
                </div>
                {/* Second Row: Description spanning full width */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Description (Optional)</label>
                  <textarea rows={3} className="w-full rounded-md border border-gray-300 px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none" placeholder="Add notes about this report..."></textarea>
                </div>
              </div>
            </div>
            {/* CARD: Filters & Conditions */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 sm:p-6 mb-4 sm:mb-6">
              <h2 className="text-sm sm:text-base font-bold text-gray-900 mb-4 sm:mb-5">Filters & Conditions</h2>
              
              {/* Date Range Section */}
              <div className="mb-4 sm:mb-6">
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-3">Date Range</label>
                <div className="flex flex-wrap gap-2">
                  <button className="px-3 sm:px-4 py-2 rounded-md bg-gray-100 border border-gray-300 text-xs sm:text-sm font-medium text-gray-700">Today</button>
                  <button className="px-3 sm:px-4 py-2 rounded-md bg-gray-100 border border-gray-300 text-xs sm:text-sm font-medium text-gray-700">Last 7 Days</button>
                  <button className="px-3 sm:px-4 py-2 rounded-md bg-blue-600 text-white text-xs sm:text-sm font-medium border border-blue-600">This Month</button>
                  <button className="px-3 sm:px-4 py-2 rounded-md bg-gray-100 border border-gray-300 text-xs sm:text-sm font-medium text-gray-700">Last Month</button>
                  <button className="px-3 sm:px-4 py-2 rounded-md bg-gray-100 border border-gray-300 text-xs sm:text-sm font-medium text-gray-700">Custom Range</button>
                </div>
              </div>

              {/* Dropdown Filters Section */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="relative">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Product / Category</label>
                  <select title="Product / Category" className="w-full rounded-md border border-gray-300 px-3 sm:px-4 py-2 sm:py-2.5 pr-10 text-xs sm:text-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none">
                    <option>All Products</option>
                    <option>Electronics</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-9 sm:top-10 h-4 w-4 text-gray-500 pointer-events-none" />
                </div>
                <div className="relative">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                  <select title="Payment Method" className="w-full rounded-md border border-gray-300 px-3 sm:px-4 py-2 sm:py-2.5 pr-10 text-xs sm:text-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none">
                    <option>All Methods</option>
                    <option>Cash</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-9 sm:top-10 h-4 w-4 text-gray-500 pointer-events-none" />
                </div>
                <div className="relative">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Order Status</label>
                  <select title="Order Status" className="w-full rounded-md border border-gray-300 px-3 sm:px-4 py-2 sm:py-2.5 pr-10 text-xs sm:text-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none">
                    <option>All Status</option>
                    <option>Refunded</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-9 sm:top-10 h-4 w-4 text-gray-500 pointer-events-none" />
                </div>
                <div className="relative">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Region / City</label>
                  <select title="Region / City" className="w-full rounded-md border border-gray-300 px-3 sm:px-4 py-2 sm:py-2.5 pr-10 text-xs sm:text-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none">
                    <option>All Regions</option>
                    <option>Riyadh</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-9 sm:top-10 h-4 w-4 text-gray-500 pointer-events-none" />
                </div>
              </div>
            </div>
            {/* CARD: Metrics Selection */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 sm:p-6 mb-4 sm:mb-6">
              <h2 className="text-sm sm:text-base font-bold text-gray-900 mb-4 sm:mb-5">Metrics Selection</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  {label:'Revenue', checked:true},
                  {label:'Discounts'},
                  {label:'Refunds', checked:true},
                  {label:'Tax'},
                  {label:'Orders', checked:true},
                  {label:'Net Profit'},
                  {label:'Processing Fees'},
                  {label:'Failed Trans.'},
                ].map(({label,checked}) => (
                  <label key={label} className={`flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-3 border rounded-md cursor-pointer text-xs sm:text-sm font-medium text-gray-700 transition-colors ${checked ? 'bg-blue-50 border-blue-300' : 'bg-white border-gray-300 hover:bg-gray-50'}`}>
                    <input type="checkbox" className={`w-4 h-4 rounded border-2 ${checked ? 'bg-blue-600 border-blue-600 text-white checked:bg-blue-600 checked:border-blue-600' : 'bg-white border-gray-300'}`} defaultChecked={checked} />
                    {label}
                  </label>
                ))}
              </div>
            </div>

            {/* CARD: Visualization Options */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 sm:p-6 mb-4 sm:mb-6">
              <h2 className="text-sm sm:text-base font-bold text-gray-900 mb-4 sm:mb-5">Visualization Options</h2>
              <div className="flex gap-2 flex-wrap">
                <button className="px-3 sm:px-4 py-2 rounded-md bg-blue-600 text-white text-xs sm:text-sm font-medium flex items-center gap-2">
                  <BarChart3 size={16} />
                  Bar Chart
                </button>
                <button className="px-3 sm:px-4 py-2 rounded-md border border-gray-300 bg-white text-gray-700 text-xs sm:text-sm font-medium hover:bg-gray-50 flex items-center gap-2">
                  <Table2 size={16} className="text-gray-700" />
                  Table
                </button>
                <button className="px-3 sm:px-4 py-2 rounded-md border border-gray-300 bg-white text-gray-700 text-xs sm:text-sm font-medium hover:bg-gray-50 flex items-center gap-2">
                  <TrendingUp size={16} className="text-gray-700" />
                  Line Chart
                </button>
                <button className="px-3 sm:px-4 py-2 rounded-md border border-gray-300 bg-white text-gray-700 text-xs sm:text-sm font-medium hover:bg-gray-50 flex items-center gap-2">
                  <PieChartIcon size={16} className="text-gray-700" />
                  Donut Chart
                </button>
                <button className="px-3 sm:px-4 py-2 rounded-md border border-gray-300 bg-white text-gray-700 text-xs sm:text-sm font-medium hover:bg-gray-50 flex items-center gap-2">
                  <Layers size={16} className="text-gray-700" />
                  Combined View
                </button>
              </div>
            </div>

            {/* CARD: Report Preview */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 sm:p-6">
              <h2 className="text-sm sm:text-base font-bold text-gray-900 mb-4">Report Preview</h2>
              
              {/* Subtitle */}
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs sm:text-sm text-gray-700">Daily Revenue & Refunds - This Month</p>
                <span className="text-xs text-gray-400">Sample Data</span>
              </div>

              {/* Data Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mb-5">
                {[
                  {label:'Week 1', barColor:'bg-blue-600', cardBg:'bg-blue-50'},
                  {label:'Week 2', barColor:'bg-blue-600', cardBg:'bg-blue-50'},
                  {label:'Week 3', barColor:'bg-blue-600', cardBg:'bg-blue-50'},
                  {label:'Week 4', barColor:'bg-blue-600', cardBg:'bg-blue-50'},
                  {label:'Refunds', barColor:'bg-red-600', cardBg:'bg-red-50'},
                ].map((card, i) => (
                  <div key={card.label} className={`${card.cardBg} rounded-md border border-gray-200 overflow-hidden`}>
                    <div className={`${card.barColor} h-12 sm:h-16`}></div>
                    <div className="p-2 sm:p-3">
                      <p className="text-xs sm:text-sm font-medium text-gray-700">{card.label}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary Statistics */}
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm mb-4 sm:mb-6">
                <span className="text-gray-700">Total Revenue: <span className="font-semibold text-gray-900">$45,230</span></span>
                <span className="text-gray-700">Total Orders: <span className="font-semibold text-gray-900">1,247</span></span>
                <span className="text-gray-700">Total Refunds: <span className="font-semibold text-red-600">$2,340</span></span>
                <span className="text-gray-700">Net Revenue: <span className="font-semibold text-green-600">$42,890</span></span>
              </div>

              {/* Bottom Section */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t border-gray-200">
                {/* Export Options */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs sm:text-sm text-gray-700">Export Options:</span>
                  <button className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-md border border-gray-300 bg-white text-gray-700 text-xs font-medium hover:bg-gray-50">
                    <FileTextIcon size={14} className="text-red-600" />
                    <span>PDF</span>
                  </button>
                  <button className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-md border border-gray-300 bg-white text-gray-700 text-xs font-medium hover:bg-gray-50">
                    <FileSpreadsheet size={14} className="text-green-600" />
                    <span>EXCEL</span>
                  </button>
                  <button className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-md border border-gray-300 bg-white text-gray-700 text-xs font-medium hover:bg-gray-50">
                    <FileCode size={14} className="text-blue-600" />
                    <span>CSV</span>
                  </button>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 flex-wrap">
                  <button className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-md bg-orange-500 text-white text-xs sm:text-sm font-medium hover:bg-orange-600">
                    <Play size={16} />
                    Run Report Now
                  </button>
                  <button className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-md bg-blue-700 text-white text-xs sm:text-sm font-medium hover:bg-blue-800">
                    <Save size={16} />
                    Save Report
                  </button>
                </div>
              </div>
            </div>
            </div>
        </main>
      </div>
    </div>
  );
}

