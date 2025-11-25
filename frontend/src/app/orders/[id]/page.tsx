import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'
import { useState, useMemo, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Menu, ArrowLeft, Download, Printer, RefreshCw, DollarSign, MapPin, Package, Truck, Home, Check, User, Phone, Mail, Settings, ChevronDown, PackageSearch, X } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import SuccessModal from '@/components/ui/SuccessModal'
import ErrorModal from '@/components/ui/ErrorModal'
import ConfirmModal from '@/components/ui/ConfirmModal'

// TypeScript interfaces
interface OrderItem {
  name: string
  sku: string
  qty: number
  unitPrice: string
  subtotal: string
  image?: string
}

interface TimelineStep {
  status: string
  date: string
  completed: boolean
  active: boolean
}

export default function OrderDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { t, translateOrder } = useLanguage()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [showStatusDropdown, setShowStatusDropdown] = useState(false)
  const [currentStatus, setCurrentStatus] = useState('Processing')
  const [isLoading, setIsLoading] = useState({ status: false, refund: false, download: false, print: false, tracking: false })
  const [successModal, setSuccessModal] = useState({ isOpen: false, message: '', title: '' })
  const [errorModal, setErrorModal] = useState({ isOpen: false, message: '', title: '' })
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, message: '', title: '', onConfirm: () => {}, type: 'refund' as 'refund' | 'status' })

  const rawOrder = {
    id: id || '',
    orderNumber: '#2345',
    orderDate: 'Dec 15, 2024',
    orderTime: '2:30 PM',
    totalAmount: '$247.50',
    customer: {
      name: 'Sarah Johnson',
      phone: '+1 (555) 123-4567',
      email: 'sarah.johnson@email.com',
      address: {
        line1: '123 Main Street, Apt 4B',
        line2: 'New York, NY 10001',
        line3: 'United States'
      }
    },
    items: [
      { name: 'Wireless Bluetooth Headphones', sku: 'WBH-001', qty: 2, unitPrice: '$89.99', subtotal: '$179.98', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop' },
      { name: 'Protective Phone Case', sku: 'PPC-003', qty: 1, unitPrice: '$24.99', subtotal: '$24.99', image: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=100&h=100&fit=crop' },
      { name: 'Wireless Charging Pad', sku: 'WCP-002', qty: 1, unitPrice: '$39.99', subtotal: '$39.99', image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=100&h=100&fit=crop' }
    ],
    shipping: '$2.54',
    payment: {
      method: 'VISA',
      cardLast4: '4532',
      transactionId: 'TXN-789456123',
      status: 'Paid'
    },
    delivery: {
      method: 'Express Delivery',
      courier: 'FedEx',
      trackingNumber: '1Z999AA1234567890',
      estDelivery: 'Dec 18, 2024'
    },
    timeline: [
      { status: 'Order Placed', date: 'Dec 15, 2024 at 2:30 PM', completed: true, active: false },
      { status: 'Payment Confirmed', date: 'Dec 15, 2024 at 2:32 PM', completed: true, active: false },
      { status: 'Processing', date: 'Dec 16, 2024 at 9:15 AM', completed: false, active: true },
      { status: 'Shipped', date: 'Pending', completed: false, active: false },
      { status: 'Delivered', date: 'Pending', completed: false, active: false }
    ]
  }

  // Automatically translate order data based on current language
  const order = useMemo(() => translateOrder(rawOrder), [rawOrder, translateOrder])

  // Status options
  const statusOptions = ['Pending', 'Processing', 'Shipped', 'Completed', 'Cancelled']

  // Update timeline based on current status
  const updatedTimeline = useMemo(() => {
    const statusMap: { [key: string]: number } = {
      'Pending': 0,      // Order Placed
      'Processing': 2,   // Processing
      'Shipped': 3,      // Shipped
      'Completed': 4,    // Delivered
      'Cancelled': 0    // Cancelled orders stay at Order Placed
    }
    
    const activeIndex = statusMap[currentStatus] ?? 2
    
    return rawOrder.timeline.map((step, index) => {
      // Order Placed and Payment Confirmed are always completed
      if (index <= 1) {
        return { ...step, completed: true, active: false }
      }
      
      // Map timeline index to status
      const stepStatusMap: { [key: number]: string } = {
        2: 'Processing',
        3: 'Shipped',
        4: 'Delivered'
      }
      
      const stepStatus = stepStatusMap[index]
      
      if (currentStatus === 'Cancelled') {
        return { ...step, completed: false, active: false }
      }
      
      if (index < activeIndex) {
        return { ...step, completed: true, active: false }
      } else if (index === activeIndex) {
        return { ...step, completed: false, active: true }
      } else {
        return { ...step, completed: false, active: false }
      }
    })
  }, [currentStatus, rawOrder.timeline])

  // Handle status update
  const handleUpdateStatus = async (newStatus: string) => {
    setShowStatusDropdown(false)
    setConfirmModal({
      isOpen: true,
      title: t('updateOrderStatus') || 'Update Order Status',
      message: t('confirmUpdateStatus') || `Are you sure you want to update the order status to ${newStatus}?`,
      type: 'status',
      onConfirm: async () => {
        setIsLoading(prev => ({ ...prev, status: true }))
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 800))
          setCurrentStatus(newStatus)
          
          // Update timeline based on new status
          const statusOrder = ['Pending', 'Processing', 'Shipped', 'Completed', 'Cancelled']
          const newStatusIndex = statusOrder.indexOf(newStatus)
          
          setSuccessModal({ 
            isOpen: true, 
            title: t('statusUpdated') || 'Status Updated',
            message: t('statusUpdatedSuccess') || `Order status has been updated to ${newStatus} successfully` 
          })
        } catch (error) {
          setErrorModal({ 
            isOpen: true, 
            title: t('updateFailed') || 'Update Failed',
            message: t('statusUpdateFailed') || 'Failed to update order status. Please try again.' 
          })
        } finally {
          setIsLoading(prev => ({ ...prev, status: false }))
        }
      }
    })
  }

  // Handle issue refund
  const handleIssueRefund = () => {
    setConfirmModal({
      isOpen: true,
      title: t('issueRefund') || 'Issue Refund',
      message: t('confirmRefundOrder') || `Are you sure you want to issue a refund of ${order.totalAmount} for this order? This action cannot be undone.`,
      type: 'refund',
      onConfirm: async () => {
        setIsLoading(prev => ({ ...prev, refund: true }))
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000))
          setSuccessModal({ 
            isOpen: true, 
            title: t('refundProcessed') || 'Refund Processed',
            message: t('refundProcessedSuccess') || `Refund of ${order.totalAmount} has been processed successfully. The customer will be notified.` 
          })
        } catch (error) {
          setErrorModal({ 
            isOpen: true, 
            title: t('refundFailed') || 'Refund Failed',
            message: t('refundProcessedFailed') || 'Failed to process refund. Please check your payment gateway connection and try again.' 
          })
        } finally {
          setIsLoading(prev => ({ ...prev, refund: false }))
        }
      }
    })
  }

  // Handle download invoice
  const handleDownloadInvoice = async () => {
    setIsLoading(prev => ({ ...prev, download: true }))
    try {
      // Simulate download preparation
      await new Promise(resolve => setTimeout(resolve, 500))
      navigate(`/orders/${id}/invoice`)
    } catch (error) {
      setErrorModal({ 
        isOpen: true, 
        title: t('downloadFailed') || 'Download Failed',
        message: t('invoiceDownloadFailed') || 'Failed to prepare invoice for download. Please try again.' 
      })
    } finally {
      setIsLoading(prev => ({ ...prev, download: false }))
    }
  }

  // Handle print order
  const handlePrintOrder = async () => {
    setIsLoading(prev => ({ ...prev, print: true }))
    try {
      // Simulate print preparation
      await new Promise(resolve => setTimeout(resolve, 300))
      window.print()
    } catch (error) {
      setErrorModal({ 
        isOpen: true, 
        title: t('printFailed') || 'Print Failed',
        message: t('printFailedMessage') || 'Failed to prepare order for printing. Please try again.' 
      })
    } finally {
      setIsLoading(prev => ({ ...prev, print: false }))
    }
  }

  // Handle add tracking
  const handleAddTracking = async () => {
    setIsLoading(prev => ({ ...prev, tracking: true }))
    try {
      // Simulate navigation delay
      await new Promise(resolve => setTimeout(resolve, 200))
      navigate(`/orders/${id}/tracking`)
    } catch (error) {
      setErrorModal({ 
        isOpen: true, 
        title: t('navigationFailed') || 'Navigation Failed',
        message: t('trackingPageFailed') || 'Failed to navigate to tracking page. Please try again.' 
      })
    } finally {
      setIsLoading(prev => ({ ...prev, tracking: false }))
    }
  }

  // Close status dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (showStatusDropdown && !target.closest('.status-dropdown-container')) {
        setShowStatusDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showStatusDropdown])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="hidden lg:flex h-screen overflow-hidden">
        {!sidebarCollapsed && (
          <div className="w-64 flex-shrink-0 bg-primary-500 h-screen overflow-y-auto">
            <Sidebar onClose={() => setSidebarCollapsed(true)} currentPage="orders" />
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
                <div>
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">{t('orders')}</h1>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1">{t('dashboard')} {'>'} {t('orderDetails')}</p>
                </div>
                <button
                  onClick={() => navigate(`/orders/${id}/invoice`)}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm sm:text-base"
                >
                  <Download size={16} className="sm:w-[18px] sm:h-[18px]" />
                  <span>{t('viewReceipt')}</span>
                </button>
              </div>

              {/* Order Details Section */}
              <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
                <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-4">{t('orderDetails')}</h2>
                <div className="border-b border-gray-200 mb-4 sm:mb-6"></div>
                {/* Order Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                  {/* Order ID Card */}
                  <div className="bg-blue-50 rounded-lg p-3 sm:p-4">
                    <p className="text-xs sm:text-sm font-medium text-blue-600 mb-1 sm:mb-2">{t('orderId')}</p>
                    <p className="text-lg sm:text-xl font-bold text-blue-900">{order.orderNumber}</p>
                  </div>
                  {/* Order Date Card */}
                  <div className="bg-green-50 rounded-lg p-3 sm:p-4">
                    <p className="text-xs sm:text-sm font-medium text-green-600 mb-1 sm:mb-2">{t('orderDate')}</p>
                    <p className="text-base sm:text-lg font-bold text-green-900">{order.orderDate}</p>
                    <p className="text-xs sm:text-sm font-medium text-green-900 mt-1">{order.orderTime}</p>
                  </div>
                  {/* Total Amount Card */}
                  <div className="bg-purple-50 rounded-lg p-3 sm:p-4">
                    <p className="text-xs sm:text-sm font-medium text-purple-600 mb-1 sm:mb-2">{t('totalAmount')}</p>
                    <p className="text-lg sm:text-xl font-bold text-purple-900">{order.totalAmount}</p>
                  </div>
                </div>
              </div>

              {/* Customer Information */}
              <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border-b border-gray-200">
                <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-4 sm:mb-6">{t('customerInformation')}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                  {/* Left Column - Contact Details */}
                  <div className="space-y-6">
                    {/* Name */}
                    <div className="flex items-start gap-3">
                      <User size={20} className="text-gray-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs text-gray-500 mb-1">{t('name')}</p>
                        <p className="text-sm font-medium text-gray-900">{order.customer.name}</p>
                      </div>
                    </div>
                    {/* Phone */}
                    <div className="flex items-start gap-3">
                      <Phone size={20} className="text-gray-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs text-gray-500 mb-1">{t('phone')}</p>
                        <p className="text-sm font-medium text-gray-900">{order.customer.phone}</p>
                      </div>
                    </div>
                    {/* Email */}
                    <div className="flex items-start gap-3">
                      <Mail size={20} className="text-gray-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs text-gray-500 mb-1">{t('email')}</p>
                        <p className="text-sm font-medium text-gray-900">{order.customer.email}</p>
                      </div>
                    </div>
                  </div>
                  {/* Right Column - Shipping Address */}
                  <div>
                    <div className="flex items-start gap-3">
                      <MapPin size={20} className="text-gray-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs text-gray-500 mb-1">{t('shippingAddress')}</p>
                        <div className="text-sm font-medium text-gray-900">
                          <p>{order.customer.address.line1}</p>
                          <p>{order.customer.address.line2}</p>
                          <p>{order.customer.address.line3}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
                <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-4">{t('orderItems')}</h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left py-3 px-3 sm:px-4 text-xs sm:text-sm font-medium text-gray-700 whitespace-nowrap">{t('product')}</th>
                      <th className="text-center py-3 px-3 sm:px-4 text-xs sm:text-sm font-medium text-gray-700 whitespace-nowrap">{t('qty')}</th>
                      <th className="text-right py-3 px-3 sm:px-4 text-xs sm:text-sm font-medium text-gray-700 whitespace-nowrap">{t('unitPrice')}</th>
                      <th className="text-right py-3 px-3 sm:px-4 text-xs sm:text-sm font-medium text-gray-700 whitespace-nowrap">{t('subtotal')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {order.items.map((item: OrderItem, index: number) => (
                      <tr key={index} className="bg-white">
                        <td className="py-3 px-3 sm:px-4">
                          <div className="flex items-center gap-2 sm:gap-3">
                            <img 
                              src={item.image || 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=100&h=100&fit=crop'} 
                              alt={item.name} 
                              className="w-10 h-10 sm:w-12 sm:h-12 rounded object-cover flex-shrink-0"
                            />
                            <div className="min-w-0">
                              <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">{item.name}</p>
                              <p className="text-xs text-gray-500 mt-0.5">{t('sku')}: {item.sku}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-3 sm:px-4 text-xs sm:text-sm text-gray-700 text-center whitespace-nowrap">{item.qty}</td>
                        <td className="py-3 px-3 sm:px-4 text-xs sm:text-sm text-gray-700 text-right whitespace-nowrap">{item.unitPrice}</td>
                        <td className="py-3 px-3 sm:px-4 text-xs sm:text-sm font-medium text-gray-900 text-right whitespace-nowrap">{item.subtotal}</td>
                      </tr>
                    ))}
                    {/* Shipping Row */}
                    <tr className="bg-gray-50 border-t-2 border-gray-300">
                      <td className="py-3 px-3 sm:px-4">
                        <p className="text-xs sm:text-sm text-gray-700">{t('shipping')}</p>
                      </td>
                      <td className="py-3 px-3 sm:px-4"></td>
                      <td className="py-3 px-3 sm:px-4"></td>
                      <td className="py-3 px-3 sm:px-4 text-xs sm:text-sm text-gray-700 text-right whitespace-nowrap">{order.shipping}</td>
                    </tr>
                    {/* Total Row */}
                    <tr className="bg-gray-50">
                      <td className="py-3 px-3 sm:px-4">
                        <p className="text-sm sm:text-base font-bold text-gray-900">{t('total')}</p>
                      </td>
                      <td className="py-3 px-3 sm:px-4"></td>
                      <td className="py-3 px-3 sm:px-4"></td>
                      <td className="py-3 px-3 sm:px-4 text-sm sm:text-base font-bold text-gray-900 text-right whitespace-nowrap">{order.totalAmount}</td>
                    </tr>
                  </tbody>
                  </table>
                </div>
              </div>

              {/* Payment & Delivery Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {/* Payment Information */}
                <div className="bg-gray-50 rounded-lg p-4 sm:p-6 shadow-sm">
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-4 sm:mb-6">{t('paymentInformation')}</h3>
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2">
                      <p className="text-xs sm:text-sm text-gray-600">{t('paymentMethod')}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-xs sm:text-sm font-medium text-gray-900">{order.payment.method}</span>
                        <span className="text-xs sm:text-sm font-medium text-gray-900">... {order.payment.cardLast4}</span>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2">
                      <p className="text-xs sm:text-sm text-gray-600">{t('transactionId')}</p>
                      <p className="text-xs sm:text-sm font-medium text-gray-900">{order.payment.transactionId}</p>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2">
                      <p className="text-xs sm:text-sm text-gray-600">{t('status')}</p>
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium w-fit">
                        {order.payment.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Delivery Information */}
                <div className="bg-gray-50 rounded-lg p-4 sm:p-6 shadow-sm">
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-4 sm:mb-6">{t('deliveryInformation')}</h3>
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2">
                      <p className="text-xs sm:text-sm text-gray-600">{t('shippingMethod')}</p>
                      <p className="text-xs sm:text-sm font-medium text-gray-900">{order.delivery.method}</p>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2">
                      <p className="text-xs sm:text-sm text-gray-600">{t('courier')}</p>
                      <p className="text-xs sm:text-sm font-medium text-gray-900">{order.delivery.courier}</p>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2">
                      <p className="text-xs sm:text-sm text-gray-600">{t('trackingNumber')}</p>
                      <button 
                        onClick={() => navigate(`/orders/${id}/tracking`)}
                        className="text-xs sm:text-sm font-medium text-blue-600 hover:text-blue-700 w-fit text-left sm:text-right"
                      >
                        #{order.delivery.trackingNumber}
                      </button>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2">
                      <p className="text-xs sm:text-sm text-gray-600">{t('estDelivery')}</p>
                      <p className="text-xs sm:text-sm font-medium text-gray-900">{order.delivery.estDelivery}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Timeline */}
              <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-4 sm:mb-6">{t('orderTimeline')}</h3>
                <div className="relative">
                  {/* Timeline line */}
                  <div className="absolute left-3 sm:left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                  
                  <div className="space-y-4 sm:space-y-6">
                    {updatedTimeline.map((step: TimelineStep, index: number) => {
                      let iconColor = 'bg-gray-300'
                      let IconComponent = Check
                      
                      if (step.completed) {
                        iconColor = 'bg-green-500'
                        IconComponent = Check
                      } else if (step.active) {
                        iconColor = 'bg-blue-500'
                        IconComponent = Settings
                      } else {
                        iconColor = 'bg-gray-300'
                        // Check original status from rawOrder for icon selection
                        const originalStep = rawOrder.timeline[index]
                        if (originalStep && originalStep.status === 'Shipped') {
                          IconComponent = Truck
                        } else if (originalStep && originalStep.status === 'Delivered') {
                          IconComponent = Home
                        } else {
                          IconComponent = Check
                        }
                      }
                      
                      // Translate status if needed
                      const displayStatus = t(step.status) || step.status
                      
                      return (
                        <div key={index} className="relative flex items-start gap-3 sm:gap-4">
                          <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${iconColor} transition-all duration-300`}>
                            <IconComponent size={14} className="sm:w-4 sm:h-4 text-white" />
                          </div>
                          <div className="flex-1 pt-0.5 sm:pt-1">
                            <p className="text-xs sm:text-sm font-medium text-gray-900">{displayStatus}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{step.date}</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 sm:flex sm:items-center sm:justify-end gap-2 sm:gap-3">
                <button 
                  onClick={handleAddTracking}
                  disabled={isLoading.tracking}
                  className="flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 sm:py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 active:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-xs sm:text-sm font-medium shadow-sm hover:shadow-md"
                >
                  {isLoading.tracking ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <PackageSearch size={14} className="sm:w-4 sm:h-4 flex-shrink-0" />
                  )}
                  <span className="truncate">{t('addTracking')}</span>
                </button>
                <div className="relative status-dropdown-container">
                  <button 
                    onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                    disabled={isLoading.status}
                    className="flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 sm:py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 active:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-xs sm:text-sm font-medium shadow-sm hover:shadow-md"
                    type="button"
                  >
                    {isLoading.status ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <span className="truncate">{t('updateStatus')}</span>
                        <ChevronDown size={14} className="sm:w-4 sm:h-4 flex-shrink-0" />
                      </>
                    )}
                  </button>
                  
                  {/* Status Dropdown */}
                  {showStatusDropdown && (
                    <>
                      <div 
                        className="fixed inset-0 z-40 lg:hidden"
                        onClick={() => setShowStatusDropdown(false)}
                      />
                      <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-[55]">
                        <div className="px-2">
                          {statusOptions.map((status) => (
                            <button
                              key={status}
                              onClick={() => handleUpdateStatus(status)}
                              className={`w-full px-4 py-2.5 text-left text-sm rounded-lg hover:bg-gray-50 active:scale-[0.98] transition-all duration-200 ${
                                currentStatus === status 
                                  ? 'bg-primary-50 text-primary-700 font-medium' 
                                  : 'text-gray-700'
                              }`}
                              type="button"
                            >
                              {status}
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
                <button 
                  onClick={handleIssueRefund}
                  disabled={isLoading.refund}
                  className="flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 sm:py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 active:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-xs sm:text-sm font-medium shadow-sm hover:shadow-md"
                  type="button"
                >
                  {isLoading.refund ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <RefreshCw size={14} className="sm:w-4 sm:h-4 flex-shrink-0" />
                  )}
                  <span className="truncate">{t('issueRefund')}</span>
                </button>
                <button 
                  onClick={handleDownloadInvoice}
                  disabled={isLoading.download}
                  className="flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 sm:py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 active:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-xs sm:text-sm font-medium shadow-sm hover:shadow-md"
                  type="button"
                >
                  {isLoading.download ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Download size={14} className="sm:w-4 sm:h-4 flex-shrink-0" />
                  )}
                  <span className="hidden md:inline truncate">{t('downloadInvoice')}</span>
                  <span className="hidden sm:inline md:hidden truncate">{t('downloadInvoice')}</span>
                  <span className="sm:hidden truncate">{t('downloadInvoice')}</span>
                </button>
                <button 
                  onClick={handlePrintOrder}
                  disabled={isLoading.print}
                  className="flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 sm:py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 active:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-xs sm:text-sm font-medium shadow-sm hover:shadow-md"
                  type="button"
                >
                  {isLoading.print ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Printer size={14} className="sm:w-4 sm:h-4 flex-shrink-0" />
                  )}
                  <span className="hidden md:inline truncate">{t('printOrder')}</span>
                  <span className="hidden sm:inline md:hidden truncate">{t('printOrder')}</span>
                  <span className="sm:hidden truncate">{t('printOrder')}</span>
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden min-h-screen bg-gray-50">
        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 z-40 bg-black bg-opacity-50"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Mobile Sidebar */}
        <div className={`fixed left-0 top-0 h-full w-64 bg-primary-500 z-50 transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <Sidebar onClose={() => setSidebarOpen(false)} currentPage="orders" />
        </div>

        {/* Main Content - Mobile */}
        <div className="flex flex-col min-h-screen bg-gray-50">
          {/* Mobile Header */}
          <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} isSidebarOpen={sidebarOpen} />
          
          <main className="flex-1 w-full overflow-y-auto p-3 sm:p-4 pt-20 sm:pt-20">
            <div className="max-w-full mx-auto space-y-4 sm:space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{t('orders')}</h1>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1">{t('dashboard')} {'>'} {t('orderDetails')}</p>
                </div>
                <button
                  onClick={() => navigate(`/orders/${id}/invoice`)}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm"
                >
                  <Download size={16} />
                  <span>{t('viewReceipt')}</span>
                </button>
              </div>

              {/* Order Details Section */}
              <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
                <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-4">{t('orderDetails')}</h2>
                <div className="border-b border-gray-200 mb-4 sm:mb-6"></div>
                {/* Order Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                  {/* Order ID Card */}
                  <div className="bg-blue-50 rounded-lg p-3 sm:p-4">
                    <p className="text-xs sm:text-sm font-medium text-blue-600 mb-1 sm:mb-2">{t('orderId')}</p>
                    <p className="text-lg sm:text-xl font-bold text-blue-900">{order.orderNumber}</p>
                  </div>
                  {/* Order Date Card */}
                  <div className="bg-green-50 rounded-lg p-3 sm:p-4">
                    <p className="text-xs sm:text-sm font-medium text-green-600 mb-1 sm:mb-2">{t('orderDate')}</p>
                    <p className="text-base sm:text-lg font-bold text-green-900">{order.orderDate}</p>
                    <p className="text-xs sm:text-sm font-medium text-green-900 mt-1">{order.orderTime}</p>
                  </div>
                  {/* Total Amount Card */}
                  <div className="bg-purple-50 rounded-lg p-3 sm:p-4">
                    <p className="text-xs sm:text-sm font-medium text-purple-600 mb-1 sm:mb-2">{t('totalAmount')}</p>
                    <p className="text-lg sm:text-xl font-bold text-purple-900">{order.totalAmount}</p>
                  </div>
                </div>
              </div>

              {/* Customer Information */}
              <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border-b border-gray-200">
                <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-4 sm:mb-6">{t('customerInformation')}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                  {/* Left Column - Contact Details */}
                  <div className="space-y-6">
                    {/* Name */}
                    <div className="flex items-start gap-3">
                      <User size={20} className="text-gray-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs text-gray-500 mb-1">{t('name')}</p>
                        <p className="text-sm font-medium text-gray-900">{order.customer.name}</p>
                      </div>
                    </div>
                    {/* Phone */}
                    <div className="flex items-start gap-3">
                      <Phone size={20} className="text-gray-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs text-gray-500 mb-1">{t('phone')}</p>
                        <p className="text-sm font-medium text-gray-900">{order.customer.phone}</p>
                      </div>
                    </div>
                    {/* Email */}
                    <div className="flex items-start gap-3">
                      <Mail size={20} className="text-gray-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs text-gray-500 mb-1">{t('email')}</p>
                        <p className="text-sm font-medium text-gray-900">{order.customer.email}</p>
                      </div>
                    </div>
                  </div>
                  {/* Right Column - Shipping Address */}
                  <div>
                    <div className="flex items-start gap-3">
                      <MapPin size={20} className="text-gray-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs text-gray-500 mb-1">{t('shippingAddress')}</p>
                        <div className="text-sm font-medium text-gray-900">
                          <p>{order.customer.address.line1}</p>
                          <p>{order.customer.address.line2}</p>
                          <p>{order.customer.address.line3}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
                <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-4">Order Items</h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left py-3 px-3 sm:px-4 text-xs sm:text-sm font-medium text-gray-700 whitespace-nowrap">Product</th>
                        <th className="text-center py-3 px-3 sm:px-4 text-xs sm:text-sm font-medium text-gray-700 whitespace-nowrap">Qty</th>
                        <th className="text-right py-3 px-3 sm:px-4 text-xs sm:text-sm font-medium text-gray-700 whitespace-nowrap">Unit Price</th>
                        <th className="text-right py-3 px-3 sm:px-4 text-xs sm:text-sm font-medium text-gray-700 whitespace-nowrap">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {order.items.map((item: OrderItem, index: number) => (
                        <tr key={index} className="bg-white">
                          <td className="py-3 px-3 sm:px-4">
                            <div className="flex items-center gap-2 sm:gap-3">
                              <img 
                                src={item.image || 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=100&h=100&fit=crop'} 
                                alt={item.name} 
                                className="w-10 h-10 sm:w-12 sm:h-12 rounded object-cover flex-shrink-0"
                              />
                              <div className="min-w-0">
                                <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">{item.name}</p>
                                <p className="text-xs text-gray-500 mt-0.5">SKU: {item.sku}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-3 sm:px-4 text-xs sm:text-sm text-gray-700 text-center whitespace-nowrap">{item.qty}</td>
                          <td className="py-3 px-3 sm:px-4 text-xs sm:text-sm text-gray-700 text-right whitespace-nowrap">{item.unitPrice}</td>
                          <td className="py-3 px-3 sm:px-4 text-xs sm:text-sm font-medium text-gray-900 text-right whitespace-nowrap">{item.subtotal}</td>
                        </tr>
                      ))}
                      {/* Shipping Row */}
                      <tr className="bg-gray-50 border-t-2 border-gray-300">
                        <td className="py-3 px-3 sm:px-4">
                          <p className="text-xs sm:text-sm text-gray-700">Shipping</p>
                        </td>
                        <td className="py-3 px-3 sm:px-4"></td>
                        <td className="py-3 px-3 sm:px-4"></td>
                        <td className="py-3 px-3 sm:px-4 text-xs sm:text-sm text-gray-700 text-right whitespace-nowrap">{order.shipping}</td>
                      </tr>
                      {/* Total Row */}
                      <tr className="bg-gray-50">
                        <td className="py-3 px-3 sm:px-4">
                          <p className="text-sm sm:text-base font-bold text-gray-900">Total</p>
                        </td>
                        <td className="py-3 px-3 sm:px-4"></td>
                        <td className="py-3 px-3 sm:px-4"></td>
                        <td className="py-3 px-3 sm:px-4 text-sm sm:text-base font-bold text-gray-900 text-right whitespace-nowrap">{order.totalAmount}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Payment & Delivery Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {/* Payment Information */}
                <div className="bg-gray-50 rounded-lg p-4 sm:p-6 shadow-sm">
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-4 sm:mb-6">{t('paymentInformation')}</h3>
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2">
                      <p className="text-xs sm:text-sm text-gray-600">{t('paymentMethod')}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-xs sm:text-sm font-medium text-gray-900">{order.payment.method}</span>
                        <span className="text-xs sm:text-sm font-medium text-gray-900">... {order.payment.cardLast4}</span>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2">
                      <p className="text-xs sm:text-sm text-gray-600">{t('transactionId')}</p>
                      <p className="text-xs sm:text-sm font-medium text-gray-900">{order.payment.transactionId}</p>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2">
                      <p className="text-xs sm:text-sm text-gray-600">{t('status')}</p>
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium w-fit">
                        {order.payment.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Delivery Information */}
                <div className="bg-gray-50 rounded-lg p-4 sm:p-6 shadow-sm">
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-4 sm:mb-6">{t('deliveryInformation')}</h3>
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2">
                      <p className="text-xs sm:text-sm text-gray-600">{t('shippingMethod')}</p>
                      <p className="text-xs sm:text-sm font-medium text-gray-900">{order.delivery.method}</p>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2">
                      <p className="text-xs sm:text-sm text-gray-600">{t('courier')}</p>
                      <p className="text-xs sm:text-sm font-medium text-gray-900">{order.delivery.courier}</p>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2">
                      <p className="text-xs sm:text-sm text-gray-600">{t('trackingNumber')}</p>
                      <button 
                        onClick={() => navigate(`/orders/${id}/tracking`)}
                        className="text-xs sm:text-sm font-medium text-blue-600 hover:text-blue-700 w-fit text-left sm:text-right"
                      >
                        #{order.delivery.trackingNumber}
                      </button>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2">
                      <p className="text-xs sm:text-sm text-gray-600">{t('estDelivery')}</p>
                      <p className="text-xs sm:text-sm font-medium text-gray-900">{order.delivery.estDelivery}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Timeline */}
              <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-4 sm:mb-6">{t('orderTimeline')}</h3>
                <div className="relative">
                  {/* Timeline line */}
                  <div className="absolute left-3 sm:left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                  
                  <div className="space-y-4 sm:space-y-6">
                    {updatedTimeline.map((step: TimelineStep, index: number) => {
                      let iconColor = 'bg-gray-300'
                      let IconComponent = Check
                      
                      if (step.completed) {
                        iconColor = 'bg-green-500'
                        IconComponent = Check
                      } else if (step.active) {
                        iconColor = 'bg-blue-500'
                        IconComponent = Settings
                      } else {
                        iconColor = 'bg-gray-300'
                        if (step.status === 'Shipped') {
                          IconComponent = Truck
                        } else if (step.status === 'Delivered') {
                          IconComponent = Home
                        } else {
                          IconComponent = Check
                        }
                      }
                      
                      return (
                        <div key={index} className="relative flex items-start gap-3 sm:gap-4">
                          <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${iconColor}`}>
                            <IconComponent size={14} className="sm:w-4 sm:h-4 text-white" />
                          </div>
                          <div className="flex-1 pt-0.5 sm:pt-1">
                            <p className="text-xs sm:text-sm font-medium text-gray-900">{step.status}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{step.date}</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 sm:flex sm:items-center sm:justify-end gap-2 sm:gap-3 pb-6">
                <button 
                  onClick={handleAddTracking}
                  disabled={isLoading.tracking}
                  className="flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 sm:py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 active:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-xs sm:text-sm font-medium shadow-sm hover:shadow-md"
                >
                  {isLoading.tracking ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <PackageSearch size={14} className="sm:w-4 sm:h-4 flex-shrink-0" />
                  )}
                  <span className="truncate">{t('addTracking')}</span>
                </button>
                <div className="relative status-dropdown-container">
                  <button 
                    onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                    disabled={isLoading.status}
                    className="flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 sm:py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 active:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-xs sm:text-sm font-medium shadow-sm hover:shadow-md"
                    type="button"
                  >
                    {isLoading.status ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <span className="truncate">{t('updateStatus')}</span>
                        <ChevronDown size={14} className="sm:w-4 sm:h-4 flex-shrink-0" />
                      </>
                    )}
                  </button>
                  
                  {/* Status Dropdown - Mobile */}
                  {showStatusDropdown && (
                    <>
                      <div 
                        className="fixed inset-0 z-40"
                        onClick={() => setShowStatusDropdown(false)}
                      />
                      <div className="fixed bottom-0 left-0 right-0 lg:absolute lg:bottom-auto lg:right-0 lg:top-full lg:mt-2 lg:w-56 bg-white rounded-t-xl lg:rounded-xl shadow-2xl border-t lg:border border-gray-200 py-2 z-[55]">
                        <div className="lg:hidden flex items-center justify-between px-4 py-3 border-b border-gray-200">
                          <h3 className="text-sm font-semibold text-gray-900">{t('updateStatus')}</h3>
                          <button
                            onClick={() => setShowStatusDropdown(false)}
                            className="p-1 rounded-md hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600"
                            type="button"
                            aria-label="Close status dropdown"
                          >
                            <X size={18} />
                          </button>
                        </div>
                        <div className="max-h-[60vh] overflow-y-auto px-2 py-2">
                          {statusOptions.map((status) => (
                            <button
                              key={status}
                              onClick={() => handleUpdateStatus(status)}
                              className={`w-full px-4 py-2.5 text-left text-sm rounded-lg hover:bg-gray-50 active:scale-[0.98] transition-all duration-200 ${
                                currentStatus === status 
                                  ? 'bg-primary-50 text-primary-700 font-medium' 
                                  : 'text-gray-700'
                              }`}
                              type="button"
                            >
                              {status}
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
                <button 
                  onClick={handleIssueRefund}
                  disabled={isLoading.refund}
                  className="flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 sm:py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 active:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-xs sm:text-sm font-medium shadow-sm hover:shadow-md"
                  type="button"
                >
                  {isLoading.refund ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <RefreshCw size={14} className="sm:w-4 sm:h-4 flex-shrink-0" />
                  )}
                  <span className="truncate">{t('issueRefund')}</span>
                </button>
                <button 
                  onClick={handleDownloadInvoice}
                  disabled={isLoading.download}
                  className="flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 sm:py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 active:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-xs sm:text-sm font-medium shadow-sm hover:shadow-md"
                  type="button"
                >
                  {isLoading.download ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Download size={14} className="sm:w-4 sm:h-4 flex-shrink-0" />
                  )}
                  <span className="hidden md:inline truncate">{t('downloadInvoice')}</span>
                  <span className="hidden sm:inline md:hidden truncate">{t('downloadInvoice')}</span>
                  <span className="sm:hidden truncate">{t('downloadInvoice')}</span>
                </button>
                <button 
                  onClick={handlePrintOrder}
                  disabled={isLoading.print}
                  className="flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 sm:py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 active:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-xs sm:text-sm font-medium shadow-sm hover:shadow-md"
                  type="button"
                >
                  {isLoading.print ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Printer size={14} className="sm:w-4 sm:h-4 flex-shrink-0" />
                  )}
                  <span className="hidden md:inline truncate">{t('printOrder')}</span>
                  <span className="hidden sm:inline md:hidden truncate">{t('printOrder')}</span>
                  <span className="sm:hidden truncate">{t('printOrder')}</span>
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Modals */}
      <SuccessModal
        isOpen={successModal.isOpen}
        onClose={() => setSuccessModal({ isOpen: false, message: '', title: '' })}
        title={successModal.title}
        message={successModal.message}
      />
      
      <ErrorModal
        isOpen={errorModal.isOpen}
        onClose={() => setErrorModal({ isOpen: false, message: '', title: '' })}
        title={errorModal.title}
        message={errorModal.message}
      />
      
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, message: '', title: '', onConfirm: () => {}, type: 'refund' })}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmText={t('confirm') || 'Confirm'}
        cancelText={t('cancel') || 'Cancel'}
        confirmButtonColor={confirmModal.type === 'refund' ? 'red' : 'orange'}
      />
    </div>
  )
}

