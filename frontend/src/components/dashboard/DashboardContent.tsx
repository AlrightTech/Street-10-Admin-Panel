
import { 
  ShoppingCart, 
  TrendingUp, 
  DollarSign, 
  Clock,
  Laptop,
  Phone,
  Watch,
  AlertCircle,
  Circle,
  Info,
  CheckCircle,
  Star,
  Bell
} from 'lucide-react'
import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '@/contexts/LanguageContext'
import SalesChart from './SalesChart'

interface DashboardData {
  metrics?: any
  recentOrders?: any[]
  ordersStatus?: any
  bestSellingProducts?: any[]
  productInsights?: any
  customerInsights?: any
  notifications?: any[]
  topSellingProducts?: any[]
  newCustomers?: any[]
  recentReviews?: any[]
  salesPerformance?: any
}

export default function DashboardContent() {
  const { t, language } = useLanguage()
  const navigate = useNavigate()
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0)

  const fetchData = useCallback(async () => {
    // Frontend-only: Always use demo data
    const isArabic = language === 'ar'
    const demoData: DashboardData = {
        metrics: {
          uncompletedOrders: 24,
          totalOrders: 156,
          totalRevenue: 12450,
          pendingPayouts: 2340
        },
        recentOrders: [
          { id: '#ORD-89', customer: 'Sarah Johnson', amount: 84.56, status: 'Completed' },
          { id: '#ORD-803', customer: 'Mike Chen', amount: 324.00, status: 'Pending' },
          { id: '#ORD-805', customer: 'Emma Davis', amount: 47.21, status: 'Shipped' }
        ],
        ordersStatus: {},
        bestSellingProducts: [
          { name: isArabic ? 'سماعات لاسلكية' : 'Wireless Headphones', sales: 48, revenue: 1480 },
          { name: isArabic ? 'غلاف الهاتف' : 'Phone Case', sales: 38, revenue: 280 },
          { name: isArabic ? 'ساعة ذكية' : 'Smart Watch', sales: 34, revenue: 480 }
        ],
        productInsights: { lowStock: 8, outOfStock: 3 },
        customerInsights: { newCustomers: 12, returningRate: 68, topCustomer: { name: 'Rahul Choudhary', phone: '(+91) 9246 986 876' } },
        notifications: [
          { icon: 'payment', message: isArabic ? 'تم استلام الدفع' : 'Payment Received', detail: isArabic ? 'الطلب #ORD-004 - $89.50' : 'Order #ORD-004 - $89.50' },
          { icon: 'update', message: isArabic ? 'تحديث النظام' : 'System Update', detail: isArabic ? 'ميزات جديدة متاحة' : 'New features available' },
          { icon: 'shipped', message: isArabic ? 'تم شحن الطلب' : 'Order Shipped', detail: isArabic ? 'الطلب #ORD-001 - تم الشحن' : 'Order #ORD-001 - Shipped' }
        ],
        topSellingProducts: [
          { name: 'Mazad Hoodie', image: '/images/sidebar-topicon.png', size: 'L', sales: 120 },
          { name: 'Wireless Earbuds', image: '/images/sidebar-topicon.png', size: '—', sales: 210 },
          { name: 'Gaming Mouse', image: '/images/sidebar-topicon.png', size: '—', sales: 160 }
        ],
        newCustomers: [
          { name: 'Ayesha Khan', phone: '+92 300 0000000', image: '/images/sidebar-topicon.png' },
          { name: 'Ahmed Raza', phone: '+92 311 1111111', image: '/images/sidebar-topicon.png' },
          { name: 'Maryam Ali', phone: '+92 322 2222222', image: '/images/sidebar-topicon.png' },
          { name: 'Bilal Hassan', phone: '+92 333 3333333', image: '/images/sidebar-topicon.png' }
        ],
        recentReviews: [
          {
            name: 'Hira',
            phone: '+92 340 1234567',
            image: '/images/sidebar-topicon.png',
            rating: 5,
            review: isArabic ? 'جودة عالية وتوصيل سريع!' : 'Great quality and fast delivery!'
          },
          {
            name: 'Omar',
            phone: '+92 345 9876543',
            image: '/images/sidebar-topicon.png',
            rating: 4,
            review: isArabic ? 'المنتج كما هو موضح، سأشتريه مرة أخرى.' : 'Product as described, will buy again.'
          }
        ],
        salesPerformance: {
          labels: isArabic 
            ? ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو']
            : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          data: [1200, 2000, 3000, 4800, 3600, 4200]
        }
      }
      setDashboardData(demoData)
      setLoading(false)
  }, [language])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Auto-rotate reviews carousel
  useEffect(() => {
    if (dashboardData?.recentReviews && dashboardData.recentReviews.length > 1) {
      // Reset index when data changes
      setCurrentReviewIndex(0)
      
      const interval = setInterval(() => {
        setCurrentReviewIndex((prevIndex) => 
          (prevIndex + 1) % dashboardData.recentReviews!.length
        )
      }, 5000) // Change every 5 seconds

      return () => clearInterval(interval)
    }
  }, [dashboardData])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">{t('loading') || 'Loading dashboard data...'}</div>
      </div>
    )
  }

  if (!dashboardData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500">{t('failedToLoad')}</div>
      </div>
    )
  }

  const { metrics, recentOrders, ordersStatus, bestSellingProducts, productInsights, customerInsights, notifications, topSellingProducts, newCustomers, recentReviews } = dashboardData || {}

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gray-100 rounded-lg p-6">
        <p className="text-2xl font-bold text-gray-700 mb-1">{t('welcomeBack')}</p>
        <p className="text-lg text-gray-600">Abdullah</p>
      </div>

      {/* Top Row - Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Uncompleted Orders */}
        <div className="rounded-lg p-4 text-white relative overflow-hidden" style={{
          background: 'linear-gradient(135deg, #60A5FA 0%, #3B82F6 100%)'
        }}>
          <div className="relative z-10">
            <p className="text-sm font-medium mb-2">{t('uncompletedOrders')}</p>
            <p className="text-3xl font-bold">{metrics?.uncompletedOrders || 0}</p>
          </div>
          <div className="absolute bottom-4 right-4 p-3 rounded-lg" style={{
            backgroundColor: 'rgba(37, 99, 235, 0.8)'
          }}>
            <ShoppingCart size={28} />
          </div>
        </div>

        {/* Total Orders This Week */}
        <div className="rounded-lg p-4 text-white relative overflow-hidden" style={{
          background: 'linear-gradient(135deg, #34D399 0%, #10B981 100%)'
        }}>
          <div className="relative z-10">
            <p className="text-sm font-medium mb-2">{t('totalOrders')}</p>
            <p className="text-3xl font-bold">{metrics?.totalOrders || 0}</p>
          </div>
          <div className="absolute bottom-4 right-4 p-3 rounded-lg" style={{
            backgroundColor: 'rgba(5, 150, 105, 0.8)'
          }}>
            <TrendingUp size={28} />
          </div>
        </div>

        {/* Total Revenue */}
        <div className="rounded-lg p-4 text-white relative overflow-hidden" style={{
          background: 'linear-gradient(135deg, #A78BFA 0%, #8B5CF6 100%)'
        }}>
          <div className="relative z-10">
            <p className="text-sm font-medium mb-2">{t('totalRevenue')}</p>
            <p className="text-3xl font-bold">${(metrics?.totalRevenue || 0).toLocaleString()}</p>
          </div>
          <div className="absolute bottom-4 right-4 p-3 rounded-lg" style={{
            backgroundColor: 'rgba(124, 58, 237, 0.8)'
          }}>
            <DollarSign size={28} />
          </div>
        </div>

        {/* Pending Payouts */}
        <div className="rounded-lg p-4 text-white relative overflow-hidden" style={{
          background: 'linear-gradient(135deg, #FB923C 0%, #F97316 100%)'
        }}>
          <div className="relative z-10">
            <p className="text-sm font-medium mb-2">{t('pendingPayouts')}</p>
            <p className="text-3xl font-bold">${(metrics?.pendingPayouts || 0).toLocaleString()}</p>
          </div>
          <div className="absolute bottom-4 right-4 p-3 rounded-lg" style={{
            backgroundColor: 'rgba(217, 70, 22, 0.8)'
          }}>
            <Clock size={28} />
          </div>
        </div>
      </div>

      {/* Middle Row - Recent Orders and Sales Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">{t('recentOrders')}</h2>
            <button 
              onClick={() => navigate('/orders')}
              className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
              type="button"
            >
              {t('viewAll')} &gt;
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-600">{t('orderId')}</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-600">{t('customer')}</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-600">{t('amount')}</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-600">{t('status')}</th>
                </tr>
              </thead>
              <tbody className="text-gray-900">
                {(recentOrders || []).map((order, index) => {
                  // Extract order number from order.id (e.g., "#ORD-89" -> "89")
                  const orderNumber = order.id.replace(/[^0-9]/g, '')
                  return (
                    <tr 
                      key={index} 
                      onClick={() => navigate(`/orders/${orderNumber}`)}
                      className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <td className="py-3 px-4 font-medium">{order.id}</td>
                      <td className="py-3 px-4">{order.customer}</td>
                      <td className="py-3 px-4 font-semibold">${order.amount.toFixed(2)}</td>
                      <td className="py-3 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${
                          order.status === 'Completed' ? 'bg-green-500' :
                          order.status === 'Processing' ? 'bg-yellow-500' :
                          order.status === 'Shipped' ? 'bg-blue-500' : 'bg-red-500'
                        }`}>
                          {t(order.status.toLowerCase())}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sales Performance */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">{t('salesPerformance')}</h2>
          </div>
          <SalesChart salesData={dashboardData?.salesPerformance} />
        </div>
      </div>

      {/* Bottom Section - Multiple Cards */}
      {/* First Row - 2 Items */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Orders Status Breakdown */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">{t('ordersStatusBreakdown')}</h2>
          <div className="flex flex-col items-center">
            {/* Donut Chart */}
            <svg width="200" height="200" viewBox="0 0 200 200" className="mb-6">
              <circle cx="100" cy="100" r="90" fill="none" stroke="none" />
              
              {/* Completed (Green) - 45% - Starting from top */}
              <circle 
                cx="100" 
                cy="100" 
                r="35" 
                fill="none" 
                stroke="#10b981" 
                strokeWidth="20" 
                strokeDasharray={`${2 * Math.PI * 35 * 0.45} ${2 * Math.PI * 35}`}
                strokeDashoffset={0}
                transform="rotate(-90 100 100)"
              />
              
              {/* Processing (Orange) - 25% */}
              <circle 
                cx="100" 
                cy="100" 
                r="35" 
                fill="none" 
                stroke="#f59e0b" 
                strokeWidth="20" 
                strokeDasharray={`${2 * Math.PI * 35 * 0.25} ${2 * Math.PI * 35}`}
                strokeDashoffset={`${-2 * Math.PI * 35 * 0.45}`}
                transform="rotate(-90 100 100)"
              />
              
              {/* Shipped (Blue) - 20% */}
              <circle 
                cx="100" 
                cy="100" 
                r="35" 
                fill="none" 
                stroke="#3b82f6" 
                strokeWidth="20" 
                strokeDasharray={`${2 * Math.PI * 35 * 0.20} ${2 * Math.PI * 35}`}
                strokeDashoffset={`${-2 * Math.PI * 35 * 0.70}`}
                transform="rotate(-90 100 100)"
              />
              
              {/* Cancelled (Red) - 10% */}
              <circle 
                cx="100" 
                cy="100" 
                r="35" 
                fill="none" 
                stroke="#ef4444" 
                strokeWidth="20" 
                strokeDasharray={`${2 * Math.PI * 35 * 0.10} ${2 * Math.PI * 35}`}
                strokeDashoffset={`${-2 * Math.PI * 35 * 0.90}`}
                transform="rotate(-90 100 100)"
              />
            </svg>
            
            {/* Horizontal Legend */}
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">{t('completed')}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span className="text-sm text-gray-600">{t('processing')}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-600">{t('shipped')}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-sm text-gray-600">{t('cancelled')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Best-Selling Products */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('bestSellingProducts')}</h2>
          <div className="space-y-3">
            {(bestSellingProducts || []).map((product, index) => (
              <div 
                key={index} 
                onClick={() => navigate('/products')}
                className="bg-gray-50 rounded-lg p-3 flex items-center justify-between hover:bg-gray-100 cursor-pointer transition-colors"
              >
                <div className="flex items-center space-x-3 flex-1">
                  <div className={`p-2 rounded-lg ${
                    index === 0 ? 'bg-blue-500' :
                    index === 1 ? 'bg-green-500' :
                    'bg-purple-300'
                  }`}>
                    {index === 0 && <Laptop size={20} className="text-white" />}
                    {index === 1 && <Phone size={20} className="text-white" />}
                    {index === 2 && <Watch size={20} className="text-white" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{product.name}</p>
                    <p className="text-xs text-gray-500">{product.sales} {t('sold')}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">${product.revenue.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Second Row - 3 Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Product Insights */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('productInsights')}</h2>
          <div className="space-y-3">
            {/* Low Stock Item */}
            <button
              onClick={() => navigate('/products')}
              className="w-full flex items-center justify-between bg-pink-100 rounded-lg p-3 hover:bg-pink-200 transition-colors"
              type="button"
            >
              <div className="flex items-center space-x-3">
                <AlertCircle size={20} className="text-red-500" />
                <span className="text-sm font-medium text-gray-900">{t('lowStock')}</span>
              </div>
              <span className="text-sm font-medium text-red-600">8 {t('items')}</span>
            </button>
            
            {/* Out of Stock Item */}
            <button
              onClick={() => navigate('/products')}
              className="w-full flex items-center justify-between bg-orange-100 rounded-lg p-3 hover:bg-orange-200 transition-colors"
              type="button"
            >
              <div className="flex items-center space-x-3">
                <Circle size={20} className="text-orange-500" />
                <span className="text-sm font-medium text-gray-900">{t('outOfStock')}</span>
              </div>
              <span className="text-sm font-medium text-orange-600">3 {t('items')}</span>
            </button>
            
            {/* Quick Add Product Button */}
            <button 
              onClick={() => navigate('/products/add')}
              className="w-full bg-blue-100 py-3 px-4 rounded-lg hover:bg-blue-200 transition-colors flex items-center justify-center space-x-2"
              type="button"
            >
              <span className="text-2xl text-blue-600">+</span>
              <span className="text-blue-600 font-bold">{t('quickAddProduct')}</span>
            </button>
          </div>
        </div>

        {/* Customer Insights */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('customerInsights')}</h2>
          <div className="space-y-3">
            {/* New Customers Box */}
            <div className="bg-green-100 rounded-lg p-3 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-900">{t('newCustomers')}</p>
                <p className="text-xs text-gray-500 mt-0.5">{t('thisWeek')}</p>
              </div>
              <span className="text-2xl font-bold text-green-600">{customerInsights?.newCustomers || 0}</span>
            </div>
            
            {/* Returning Rate Box */}
            <div className="bg-blue-100 rounded-lg p-3 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-900">{t('returningRate')}</p>
                <p className="text-xs text-gray-500 mt-0.5">{t('customerRetention')}</p>
              </div>
              <span className="text-2xl font-bold text-blue-600">{customerInsights?.returningRate || 0}%</span>
            </div>
            
            {/* Top Customer Box */}
            <div className="bg-purple-100 rounded-lg p-3 flex items-center space-x-3">
              <img 
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(customerInsights?.topCustomer?.name || 'Customer')}&size=48&background=random`}
                alt={customerInsights?.topCustomer?.name || 'Customer'} 
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900">{t('topCustomer')}</p>
                <p className="text-xs text-gray-500">{customerInsights?.topCustomer?.name || 'N/A'} {customerInsights?.topCustomer?.phone ? `- ${customerInsights.topCustomer.phone}` : (typeof customerInsights?.topCustomer?.orders === 'string' ? customerInsights.topCustomer.orders : `$${customerInsights?.topCustomer?.orders || 0}`)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('notifications')}</h2>
          <div className="space-y-3">
            {(notifications || []).map((notif, index) => (
              <div key={index} className={`flex items-center space-x-3 p-3 rounded-lg ${
                notif.icon === 'payment' ? 'bg-yellow-100' :
                notif.icon === 'update' ? 'bg-blue-100' :
                'bg-green-100'
              }`}>
                <div className={`flex-shrink-0 p-2 rounded-lg ${
                  notif.icon === 'payment' ? 'bg-yellow-200' :
                  notif.icon === 'update' ? 'bg-blue-200' :
                  'bg-green-200'
                }`}>
                  {notif.icon === 'payment' && <Bell size={20} className="text-yellow-600" />}
                  {notif.icon === 'update' && <Info size={20} className="text-blue-600" />}
                  {notif.icon === 'shipped' && <CheckCircle size={20} className="text-green-600" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-gray-900">{notif.message}</p>
                  <p className="text-xs text-gray-600">{notif.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Section - Three Cards in a Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Selling Products */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('topSellingProductsTitle')}</h2>
          <div className="space-y-4">
            {(topSellingProducts || []).map((product, index) => (
              <div 
                key={index} 
                onClick={() => navigate('/products')}
                className="flex items-center justify-between hover:bg-gray-50 p-2 rounded-lg cursor-pointer transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-12 h-12 rounded object-cover"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{product.name}</p>
                    <p className="text-xs text-gray-500">{product.size}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">{product.sales} {t('sales')}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* New Customers */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('newCustomersTitlePage')}</h2>
          <div className="space-y-4">
            {(newCustomers || []).map((customer, index) => (
              <div key={index} className={`flex items-center space-x-3 py-2 px-2 rounded ${index === 3 ? 'bg-gray-50' : ''}`}>
                <img 
                  src={customer.image} 
                  alt={customer.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{customer.name}</p>
                  <p className="text-xs text-gray-500">{customer.phone}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Reviews */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">{t('recentReviewsTitle')}</h2>
          </div>
          {recentReviews && recentReviews.length > 0 && recentReviews[currentReviewIndex] && (
            <>
              <div className="flex items-center space-x-3 mb-4">
                <img 
                  src={recentReviews[currentReviewIndex].image} 
                  alt={recentReviews[currentReviewIndex].name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="text-sm font-medium text-gray-900">{recentReviews[currentReviewIndex].name}</p>
                  <p className="text-xs text-gray-500">{recentReviews[currentReviewIndex].phone}</p>
                </div>
              </div>
              <div className="flex items-center mb-3 space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={16} 
                    fill={i < recentReviews[currentReviewIndex].rating ? '#facc15' : 'none'}
                    className={i < recentReviews[currentReviewIndex].rating ? 'text-yellow-400' : 'text-gray-300'}
                  />
                ))}
              </div>
              <p className="text-sm text-gray-600 mb-4">{recentReviews[currentReviewIndex].review}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1">
                  {[...Array(recentReviews.length)].map((_, i) => (
                    <div 
                      key={i} 
                      className={`w-2 h-2 rounded-full transition-colors duration-300 ${i === currentReviewIndex ? 'bg-gray-800' : 'bg-gray-300'}`}
                    />
                  ))}
                </div>
                <button 
                  onClick={() => navigate('/products')}
                  className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                  type="button"
                >
                  {t('viewAll')} &gt;
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
