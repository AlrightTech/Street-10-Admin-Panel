import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Menu, Calendar, Send, X, ArrowLeft } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

export default function AddTrackingPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { t } = useLanguage()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [autoNotify, setAutoNotify] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [formData, setFormData] = useState({
    deliveryCompany: '',
    deliveryPerson: '',
    contact: '',
    estimatedDate: '',
    shippingNotes: ''
  })
  const [showDatePicker, setShowDatePicker] = useState(false)

  const orderSummary = {
    orderId: `#${id}`,
    customerName: 'Sarah Johnson',
    orderDate: 'Dec 15, 2024'
  }

  const deliveryCompanies = [
    'DHL',
    'FedEx',
    'UPS',
    'Leopard',
    'Aramex',
    'TNT',
    'USPS',
    'Other'
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      })
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.deliveryCompany.trim()) {
      newErrors.deliveryCompany = t('deliveryCompanyRequired')
    }

    if (!formData.deliveryPerson.trim()) {
      newErrors.deliveryPerson = t('deliveryPersonRequired')
    }

    if (!formData.contact.trim()) {
      newErrors.contact = t('contactRequired')
    } else if (!/^\+?[\d\s\-()]+$/.test(formData.contact)) {
      newErrors.contact = t('validPhoneNumber')
    }

    if (formData.estimatedDate) {
      // Check if date is in valid format (mm/dd/yyyy or already validated date input)
      const datePattern = /^\d{2}\/\d{2}\/\d{4}$/
      const dateInputPattern = /^\d{4}-\d{2}-\d{2}$/
      if (!datePattern.test(formData.estimatedDate) && !dateInputPattern.test(formData.estimatedDate)) {
        newErrors.estimatedDate = t('validDate')
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const formatDateForInput = (dateString: string): string => {
    if (!dateString) return ''
    // Convert mm/dd/yyyy to yyyy-mm-dd for date input
    if (dateString.includes('/')) {
      const parts = dateString.split('/')
      if (parts.length === 3) {
        return `${parts[2]}-${parts[0].padStart(2, '0')}-${parts[1].padStart(2, '0')}`
      }
    }
    return dateString
  }

  const formatDateForDisplay = (dateString: string): string => {
    if (!dateString) return ''
    // Convert yyyy-mm-dd to mm/dd/yyyy for display
    if (dateString.includes('-')) {
      const parts = dateString.split('-')
      if (parts.length === 3) {
        return `${parts[1]}/${parts[2]}/${parts[0]}`
      }
    }
    return dateString
  }

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateValue = e.target.value
    setFormData({
      ...formData,
      estimatedDate: dateValue ? formatDateForDisplay(dateValue) : ''
    })
    if (errors.estimatedDate) {
      setErrors({
        ...errors,
        estimatedDate: ''
      })
    }
    setShowDatePicker(false)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Here you would typically send data to your backend API
      // await fetch(`/api/orders/${id}/tracking`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     ...formData,
      //     autoNotify,
      //     orderId: id
      //   })
      // })

      // Success - navigate back to order detail page
      navigate(`/orders/${id}`)
    } catch (error) {
      console.error('Error saving tracking information:', error)
      alert(t('trackingAddedFailed'))
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    if (confirm(t('confirmCancel'))) {
      navigate(`/orders/${id}`)
    }
  }

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
            <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
              {/* Header */}
              <div>
                <button
                  onClick={() => navigate(`/orders/${id}`)}
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-2"
                >
                  <ArrowLeft size={16} />
                  <span>{t('back')} {t('to')} {t('orderDetails')}</span>
                </button>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">{t('orders')}</h1>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">{t('dashboard')} &gt; {t('addTracking')}</p>
              </div>

              {/* Order Summary */}
              <div className="bg-blue-50 rounded-lg p-4 sm:p-6 border border-blue-200">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">
                    <p className="text-white font-bold text-sm">O</p>
                  </div>
                  <h2 className="text-base sm:text-lg font-bold text-gray-900">{t('orderSummary')}</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs sm:text-sm">
                  <div>
                    <p className="text-gray-600 mb-1">{t('orderId')}</p>
                    <p className="font-medium text-gray-900">{orderSummary.orderId}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 mb-1">{t('customerName')}</p>
                    <p className="font-medium text-gray-900">{orderSummary.customerName}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 mb-1">{t('orderDate')}</p>
                    <p className="font-medium text-gray-900">{orderSummary.orderDate}</p>
                  </div>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSave} className="bg-white rounded-lg p-4 sm:p-6 shadow-sm space-y-4 sm:space-y-6">
                <h2 className="text-base sm:text-lg font-bold text-gray-900">{t('trackingInformation')}</h2>

                {/* Delivery Company */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Select Delivery Company*
                  </label>
                  <select
                    name="deliveryCompany"
                    value={formData.deliveryCompany}
                    onChange={handleInputChange}
                    aria-label="Select Delivery Company"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-xs sm:text-sm ${
                      errors.deliveryCompany ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select a company</option>
                    {deliveryCompanies.map((company: string) => (
                      <option key={company} value={company}>
                        {company}
                      </option>
                    ))}
                  </select>
                  {errors.deliveryCompany && (
                    <p className="mt-1 text-xs text-red-600">{errors.deliveryCompany}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Delivery Person */}
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                      Delivery Person*
                    </label>
                    <input
                      name="deliveryPerson"
                      type="text"
                      placeholder="Enter delivery person name"
                      value={formData.deliveryPerson}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-xs sm:text-sm ${
                        errors.deliveryPerson ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.deliveryPerson && (
                      <p className="mt-1 text-xs text-red-600">{errors.deliveryPerson}</p>
                    )}
                  </div>

                  {/* Contact */}
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                      Contact*
                    </label>
                    <input
                      name="contact"
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      value={formData.contact}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-xs sm:text-sm ${
                        errors.contact ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.contact && (
                      <p className="mt-1 text-xs text-red-600">{errors.contact}</p>
                    )}
                  </div>
                </div>

                {/* Estimated Delivery Date */}
                <div>
                  <label htmlFor="estimatedDate" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    {t('estimatedDate')}
                  </label>
                  <div className="relative">
                    <input
                      id="estimatedDate"
                      name="estimatedDate"
                      type="date"
                      value={formatDateForInput(formData.estimatedDate)}
                      onChange={handleDateChange}
                      min={new Date().toISOString().split('T')[0]}
                      className={`w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-xs sm:text-sm ${
                        errors.estimatedDate ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const dateInput = document.querySelector('input[name="estimatedDate"]') as HTMLInputElement
                        if (dateInput) {
                          try {
                            if ('showPicker' in dateInput && typeof dateInput.showPicker === 'function') {
                              dateInput.showPicker()
                            } else {
                              dateInput.click()
                            }
                          } catch {
                            dateInput.click()
                          }
                        }
                      }}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer z-10"
                      aria-label="Open calendar"
                    >
                      <Calendar size={18} />
                    </button>
                  </div>
                  {errors.estimatedDate && (
                    <p className="mt-1 text-xs text-red-600">{errors.estimatedDate}</p>
                  )}
                </div>

                {/* Shipping Notes */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Shipping Notes (Optional)
                  </label>
                  <textarea
                    name="shippingNotes"
                    placeholder="Add any special delivery instructions or notes for the customer"
                    value={formData.shippingNotes}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-xs sm:text-sm resize-none"
                  />
                </div>

                {/* Auto Notify Section */}
                <div className="bg-blue-50 rounded-lg p-3 sm:p-4 border border-blue-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 sm:w-6 sm:h-6 bg-blue-500 rounded flex items-center justify-center flex-shrink-0">
                        <p className="text-white text-xs">⚡</p>
                      </div>
                      <span className="text-xs sm:text-sm font-medium text-gray-900">
                        {t('autoNotifyCustomer')}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setAutoNotify(!autoNotify)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0 ${
                        autoNotify ? 'bg-[#5842B9]' : 'bg-gray-300'
                      }`}
                      aria-label="Toggle auto notify"
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        autoNotify ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>
                  <p className="text-xs text-gray-600">
                    Customer will receive an e-mail and SMS with tracking information
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3 pt-4 sm:pt-6 border-t">
                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={isLoading}
                    className="px-4 sm:px-6 py-2.5 sm:py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base transition-colors"
                  >
                    {t('cancel')}
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 active:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base transition-colors"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>{t('saving')}</span>
                      </>
                    ) : (
                      <>
                        <Send size={16} className="sm:w-[18px] sm:h-[18px]" />
                        <span>{t('submitTracking')}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
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
              <div>
                <button
                  onClick={() => navigate(`/orders/${id}`)}
                  className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 hover:text-gray-900 mb-2"
                >
                  <ArrowLeft size={14} className="sm:w-4 sm:h-4" />
                  <span>Back to Order Details</span>
                </button>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Orders</h1>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">Dashboard &gt; Add Tracking Information</p>
              </div>

              {/* Order Summary */}
              <div className="bg-blue-50 rounded-lg p-4 sm:p-6 border border-blue-200">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">
                    <p className="text-white font-bold text-sm">O</p>
                  </div>
                  <h2 className="text-base sm:text-lg font-bold text-gray-900">{t('orderSummary')}</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs sm:text-sm">
                  <div>
                    <p className="text-gray-600 mb-1">{t('orderId')}</p>
                    <p className="font-medium text-gray-900">{orderSummary.orderId}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 mb-1">{t('customerName')}</p>
                    <p className="font-medium text-gray-900">{orderSummary.customerName}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 mb-1">{t('orderDate')}</p>
                    <p className="font-medium text-gray-900">{orderSummary.orderDate}</p>
                  </div>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSave} className="bg-white rounded-lg p-4 sm:p-6 shadow-sm space-y-4 sm:space-y-6">
                <h2 className="text-base sm:text-lg font-bold text-gray-900">{t('trackingInformation')}</h2>

                {/* Delivery Company */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Select Delivery Company*
                  </label>
                  <select
                    name="deliveryCompany"
                    value={formData.deliveryCompany}
                    onChange={handleInputChange}
                    aria-label="Select Delivery Company"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-xs sm:text-sm ${
                      errors.deliveryCompany ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select a company</option>
                    {deliveryCompanies.map((company: string) => (
                      <option key={company} value={company}>
                        {company}
                      </option>
                    ))}
                  </select>
                  {errors.deliveryCompany && (
                    <p className="mt-1 text-xs text-red-600">{errors.deliveryCompany}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Delivery Person */}
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                      Delivery Person*
                    </label>
                    <input
                      name="deliveryPerson"
                      type="text"
                      placeholder="Enter delivery person name"
                      value={formData.deliveryPerson}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-xs sm:text-sm ${
                        errors.deliveryPerson ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.deliveryPerson && (
                      <p className="mt-1 text-xs text-red-600">{errors.deliveryPerson}</p>
                    )}
                  </div>

                  {/* Contact */}
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                      Contact*
                    </label>
                    <input
                      name="contact"
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      value={formData.contact}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-xs sm:text-sm ${
                        errors.contact ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.contact && (
                      <p className="mt-1 text-xs text-red-600">{errors.contact}</p>
                    )}
                  </div>
                </div>

                {/* Estimated Delivery Date */}
                <div>
                  <label htmlFor="estimatedDate" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    {t('estimatedDate')}
                  </label>
                  <div className="relative">
                    <input
                      id="estimatedDate"
                      name="estimatedDate"
                      type="date"
                      value={formatDateForInput(formData.estimatedDate)}
                      onChange={handleDateChange}
                      min={new Date().toISOString().split('T')[0]}
                      className={`w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-xs sm:text-sm ${
                        errors.estimatedDate ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const dateInput = document.querySelector('input[name="estimatedDate"]') as HTMLInputElement
                        if (dateInput) {
                          try {
                            if ('showPicker' in dateInput && typeof dateInput.showPicker === 'function') {
                              dateInput.showPicker()
                            } else {
                              dateInput.click()
                            }
                          } catch {
                            dateInput.click()
                          }
                        }
                      }}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer z-10"
                      aria-label="Open calendar"
                    >
                      <Calendar size={18} />
                    </button>
                  </div>
                  {errors.estimatedDate && (
                    <p className="mt-1 text-xs text-red-600">{errors.estimatedDate}</p>
                  )}
                </div>

                {/* Shipping Notes */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Shipping Notes (Optional)
                  </label>
                  <textarea
                    name="shippingNotes"
                    placeholder="Add any special delivery instructions or notes for the customer"
                    value={formData.shippingNotes}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-xs sm:text-sm resize-none"
                  />
                </div>

                {/* Auto Notify Section */}
                <div className="bg-blue-50 rounded-lg p-3 sm:p-4 border border-blue-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 sm:w-6 sm:h-6 bg-blue-500 rounded flex items-center justify-center flex-shrink-0">
                        <p className="text-white text-xs">⚡</p>
                      </div>
                      <span className="text-xs sm:text-sm font-medium text-gray-900">
                        {t('autoNotifyCustomer')}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setAutoNotify(!autoNotify)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0 ${
                        autoNotify ? 'bg-[#5842B9]' : 'bg-gray-300'
                      }`}
                      aria-label="Toggle auto notify"
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        autoNotify ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>
                  <p className="text-xs text-gray-600">
                    Customer will receive an e-mail and SMS with tracking information
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3 pt-4 sm:pt-6 border-t pb-6">
                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={isLoading}
                    className="px-4 sm:px-6 py-2.5 sm:py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base transition-colors"
                  >
                    {t('cancel')}
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 active:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base transition-colors"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>{t('saving')}</span>
                      </>
                    ) : (
                      <>
                        <Send size={16} className="sm:w-[18px] sm:h-[18px]" />
                        <span>{t('submitTracking')}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

