import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'
import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Menu, Download, Printer, Mail, Phone, Globe, Laptop, Mouse, Shield } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import React from 'react'

// TypeScript interfaces
type LucideIcon = React.ComponentType<React.SVGProps<SVGSVGElement> & { size?: number | string; className?: string }>

interface InvoiceItem {
  product: string
  details: string
  sku: string
  qty: number
  unitPrice: string
  subtotal: string
  icon?: LucideIcon
}

export default function InvoicePage({ params }: { params: { id: string } }) {
  const navigate = useNavigate()
  const { t, language } = useLanguage()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const rawInvoice = {
    invoiceNo: 'INV-2024-00047',
    date: 'September 20, 2024',
    dueDate: 'October 20, 2024',
    company: {
      name: 'TechMart Solutions',
      tagline: 'Premium Electronics & Gadgets',
      address: '1237 Technology Drive',
      city: 'San Francisco, CA 94105',
      country: 'United States',
      email: 'contact@techmart.com',
      phone: '+1 (555) 123-4567',
      website: 'www.techmart.com'
    },
    customer: {
      name: 'Sarah Johnson',
      address: '456 Oak Street, Apt 2B',
      city: 'New York, NY 10003',
      country: 'United States',
      email: 'sarahjohnson@email.com',
      phone: '+1 (555) 987-6543'
    },
    items: [
      { product: 'MacBook Pro 16" M3', details: 'Space Gray, 512GB SSD', sku: 'MBP-M3-16-512', qty: 1, unitPrice: '$2,499.00', subtotal: '$2,499.00', icon: Laptop },
      { product: 'Magic Mouse 3', details: 'White, Wireless', sku: 'MM3-WHT', qty: 1, unitPrice: '$79.00', subtotal: '$79.00', icon: Mouse },
      { product: 'Extended Warranty', details: '2 Years Coverage', sku: 'EW-2YR', qty: 1, unitPrice: '$199.00', subtotal: '$199.00', icon: Shield }
    ],
    summary: {
      subtotal: '$2,777.00',
      shipping: '$30.00',
      tax: '$236.08',
      discount: '-$143.88',
      total: '$2,899.20'
    },
    payment: {
      method: 'Visa ending in 4242',
      date: 'Charged on Sep 20, 2024',
      transactionId: 'TXN-78945623'
    }
  }

  // Translate invoice data
  const invoice = useMemo(() => {
    if (language === 'ar') {
      return {
        ...rawInvoice,
        company: {
          ...rawInvoice.company,
          tagline: t('premiumElectronics'),
          country: t('unitedStates')
        },
        customer: {
          ...rawInvoice.customer,
          country: t('unitedStates')
        }
      }
    }
    return rawInvoice
  }, [rawInvoice, language, t])

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
            <div className="max-w-5xl mx-auto space-y-4 sm:space-y-6">
              {/* Header */}
              <div>
                <p className="text-xs sm:text-sm text-gray-500">{t('dashboard')} &gt; {t('orderDetails')}</p>
              </div>

              {/* Invoice Card */}
              <div className="bg-white rounded-lg p-4 sm:p-6 md:p-8 shadow-sm border border-gray-200">
                {/* Company Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6 mb-6 sm:mb-8 pb-6 sm:pb-8 border-b border-gray-200">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-violet-700 rounded flex items-center justify-center flex-shrink-0">
                      <p className="text-white font-bold text-sm sm:text-base">T</p>
                    </div>
                    <div className="min-w-0">
                      <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 truncate">{invoice.company.name}</h2>
                      <p className="text-xs sm:text-sm text-gray-600 truncate">{invoice.company.tagline}</p>
                    </div>
                  </div>
                  <div className="text-left sm:text-right">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{t('invoice')}</h1>
                    <div className="text-xs sm:text-sm text-gray-600 mt-2 space-y-1">
                      <p>{t('invoiceNumber')}: {invoice.invoiceNo}</p>
                      <p>{t('invoiceDate')}: {invoice.date}</p>
                      <p>{t('dueDate')}: {invoice.dueDate}</p>
                    </div>
                  </div>
                </div>

                {/* From & To */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
                  <div className="border border-gray-200 rounded-lg p-3 sm:p-4">
                    <h3 className="text-xs sm:text-sm font-bold text-gray-700 mb-2 sm:mb-3">{t('from')}</h3>
                    <p className="text-sm sm:text-base font-bold text-gray-900">{invoice.company.name}</p>
                    <p className="text-xs sm:text-sm text-gray-700">{invoice.company.address}</p>
                    <p className="text-xs sm:text-sm text-gray-700">{invoice.company.city}</p>
                    <p className="text-xs sm:text-sm text-gray-700 mb-2 sm:mb-3">{invoice.company.country}</p>
                    <div className="space-y-1 text-xs sm:text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Mail size={12} className="sm:w-3.5 sm:h-3.5 flex-shrink-0" />
                        <span className="break-all">{invoice.company.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone size={12} className="sm:w-3.5 sm:h-3.5 flex-shrink-0" />
                        <span>{invoice.company.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Globe size={12} className="sm:w-3.5 sm:h-3.5 flex-shrink-0" />
                        <span>{invoice.company.website}</span>
                      </div>
                    </div>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-3 sm:p-4">
                    <h3 className="text-xs sm:text-sm font-bold text-gray-700 mb-2 sm:mb-3">{t('to')}</h3>
                    <p className="text-sm sm:text-base font-bold text-gray-900">{invoice.customer.name}</p>
                    <p className="text-xs sm:text-sm text-gray-700">{invoice.customer.address}</p>
                    <p className="text-xs sm:text-sm text-gray-700">{invoice.customer.city}</p>
                    <p className="text-xs sm:text-sm text-gray-700 mb-2 sm:mb-3">{invoice.customer.country}</p>
                    <div className="space-y-1 text-xs sm:text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Mail size={12} className="sm:w-3.5 sm:h-3.5 flex-shrink-0" />
                        <span className="break-all">{invoice.customer.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone size={12} className="sm:w-3.5 sm:h-3.5 flex-shrink-0" />
                        <span>{invoice.customer.phone}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Details Table */}
                <div className="mb-8">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">{t('orderDetails')}</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="text-left py-3 px-3 sm:px-4 text-xs sm:text-sm font-medium text-gray-700 whitespace-nowrap">Product</th>
                          <th className="text-left py-3 px-3 sm:px-4 text-xs sm:text-sm font-medium text-gray-700 whitespace-nowrap">SKU</th>
                          <th className="text-left py-3 px-3 sm:px-4 text-xs sm:text-sm font-medium text-gray-700 whitespace-nowrap">Qty</th>
                          <th className="text-left py-3 px-3 sm:px-4 text-xs sm:text-sm font-medium text-gray-700 whitespace-nowrap">Unit Price</th>
                          <th className="text-left py-3 px-3 sm:px-4 text-xs sm:text-sm font-medium text-gray-700 whitespace-nowrap">Subtotal</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {invoice.items.map((item: InvoiceItem, index: number) => {
                          const IconComponent = item.icon || Laptop
                          return (
                            <tr key={index} className="bg-white">
                              <td className="py-4 px-3 sm:px-4">
                                <div className="flex items-center gap-2 sm:gap-3">
                                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <IconComponent size={16} className="sm:w-5 sm:h-5 text-gray-400" />
                                  </div>
                                  <div className="min-w-0">
                                    <p className="text-xs sm:text-sm font-semibold text-gray-900">{item.product}</p>
                                    <p className="text-xs text-gray-600 mt-0.5">{item.details}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="py-4 px-3 sm:px-4 text-xs sm:text-sm text-gray-700 whitespace-nowrap">{item.sku}</td>
                              <td className="py-4 px-3 sm:px-4 text-xs sm:text-sm text-gray-700 whitespace-nowrap">{item.qty}</td>
                              <td className="py-4 px-3 sm:px-4 text-xs sm:text-sm text-gray-700 whitespace-nowrap">{item.unitPrice}</td>
                              <td className="py-4 px-3 sm:px-4 text-xs sm:text-sm text-gray-700 whitespace-nowrap">{item.subtotal}</td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Summary */}
                <div className="flex justify-end mb-6 sm:mb-8">
                  <div className="w-full sm:w-64 space-y-2">
                    <div className="flex justify-between text-xs sm:text-sm">
                      <span className="text-gray-600">{t('subtotal')}:</span>
                      <span className="text-gray-900">{invoice.summary.subtotal}</span>
                    </div>
                    <div className="flex justify-between text-xs sm:text-sm">
                      <span className="text-gray-600">{t('shipping')}:</span>
                      <span className="text-gray-900">{invoice.summary.shipping}</span>
                    </div>
                    <div className="flex justify-between text-xs sm:text-sm">
                      <span className="text-gray-600">{t('tax')} (8.5%):</span>
                      <span className="text-gray-900">{invoice.summary.tax}</span>
                    </div>
                    <div className="flex justify-between text-xs sm:text-sm">
                      <span className="text-gray-600">{t('discount')} (5%):</span>
                      <span className="text-red-600">{invoice.summary.discount}</span>
                    </div>
                    <div className="flex justify-between text-base sm:text-lg font-bold pt-2 border-t border-gray-200">
                      <span className="text-gray-900">{t('total')}:</span>
                      <span className="text-gray-900">{invoice.summary.total}</span>
                    </div>
                  </div>
                </div>

                {/* Payment Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6">
                  <div className="border border-gray-200 rounded-lg p-3 sm:p-4">
                    <h4 className="text-sm sm:text-base font-bold text-gray-900 mb-2">{t('paymentMethod')}</h4>
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 sm:w-6 sm:h-6 bg-blue-500 rounded flex-shrink-0"></div>
                      <div className="min-w-0">
                        <p className="text-xs sm:text-sm font-medium text-gray-900">{invoice.payment.method}</p>
                        <p className="text-xs sm:text-sm text-gray-600">{invoice.payment.date}</p>
                      </div>
                    </div>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-3 sm:p-4">
                    <h4 className="text-sm sm:text-base font-bold text-gray-900 mb-2">{t('status')}</h4>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded-full flex-shrink-0"></div>
                      <p className="text-xs sm:text-sm font-medium text-gray-900">{t('paid')}</p>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600 mt-1 break-all">{t('transactionId')}: {invoice.payment.transactionId}</p>
                  </div>
                </div>

                {/* Thank You Message */}
                <div className="text-center mb-4 sm:mb-6">
                  <p className="text-sm sm:text-base font-bold text-gray-900 mb-1 sm:mb-2">{t('thankYouShopping')}</p>
                  <p className="text-xs sm:text-sm text-gray-600">{t('appreciateBusiness')}</p>
                </div>

                {/* Terms & Support */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 pt-4 sm:pt-6 border-t border-gray-200">
                  <div className="border border-gray-200 rounded-lg p-3 sm:p-4">
                    <h4 className="text-sm sm:text-base font-bold text-gray-900 mb-2">{t('termsConditions')}</h4>
                    <p className="text-xs sm:text-sm text-gray-600">
                      {t('paymentDue')}
                    </p>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-3 sm:p-4">
                    <h4 className="text-sm sm:text-base font-bold text-gray-900 mb-2">{t('supportContact')}</h4>
                    <p className="text-xs sm:text-sm text-gray-600 break-words">
                      {t('supportMessage')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Footer Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center sm:justify-end gap-2 sm:gap-3">
                <button className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 active:bg-orange-700 transition-colors text-sm sm:text-base">
                  <Download size={16} className="sm:w-[18px] sm:h-[18px]" />
                  {t('downloadPdf')}
                </button>
                <button className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 active:bg-gray-900 transition-colors text-sm sm:text-base">
                  <Printer size={16} className="sm:w-[18px] sm:h-[18px]" />
                  {t('printInvoice')}
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
              <div>
                <p className="text-xs sm:text-sm text-gray-500">{t('dashboard')} &gt; {t('orderDetails')}</p>
              </div>

              {/* Invoice Card */}
              <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-gray-200">
                {/* Company Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6 mb-6 sm:mb-8 pb-6 sm:pb-8 border-b border-gray-200">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-violet-700 rounded flex items-center justify-center flex-shrink-0">
                      <p className="text-white font-bold text-sm sm:text-base">T</p>
                    </div>
                    <div className="min-w-0">
                      <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 truncate">{invoice.company.name}</h2>
                      <p className="text-xs sm:text-sm text-gray-600 truncate">{invoice.company.tagline}</p>
                    </div>
                  </div>
                  <div className="text-left sm:text-right">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{t('invoice')}</h1>
                    <div className="text-xs sm:text-sm text-gray-600 mt-2 space-y-1">
                      <p>{t('invoiceNumber')}: {invoice.invoiceNo}</p>
                      <p>{t('invoiceDate')}: {invoice.date}</p>
                      <p>{t('dueDate')}: {invoice.dueDate}</p>
                    </div>
                  </div>
                </div>

                {/* From & To */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
                  <div className="border border-gray-200 rounded-lg p-3 sm:p-4">
                    <h3 className="text-xs sm:text-sm font-bold text-gray-700 mb-2 sm:mb-3">{t('from')}</h3>
                    <p className="text-sm sm:text-base font-bold text-gray-900">{invoice.company.name}</p>
                    <p className="text-xs sm:text-sm text-gray-700">{invoice.company.address}</p>
                    <p className="text-xs sm:text-sm text-gray-700">{invoice.company.city}</p>
                    <p className="text-xs sm:text-sm text-gray-700 mb-2 sm:mb-3">{invoice.company.country}</p>
                    <div className="space-y-1 text-xs sm:text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Mail size={12} className="sm:w-3.5 sm:h-3.5 flex-shrink-0" />
                        <span className="break-all">{invoice.company.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone size={12} className="sm:w-3.5 sm:h-3.5 flex-shrink-0" />
                        <span>{invoice.company.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Globe size={12} className="sm:w-3.5 sm:h-3.5 flex-shrink-0" />
                        <span>{invoice.company.website}</span>
                      </div>
                    </div>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-3 sm:p-4">
                    <h3 className="text-xs sm:text-sm font-bold text-gray-700 mb-2 sm:mb-3">{t('to')}</h3>
                    <p className="text-sm sm:text-base font-bold text-gray-900">{invoice.customer.name}</p>
                    <p className="text-xs sm:text-sm text-gray-700">{invoice.customer.address}</p>
                    <p className="text-xs sm:text-sm text-gray-700">{invoice.customer.city}</p>
                    <p className="text-xs sm:text-sm text-gray-700 mb-2 sm:mb-3">{invoice.customer.country}</p>
                    <div className="space-y-1 text-xs sm:text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Mail size={12} className="sm:w-3.5 sm:h-3.5 flex-shrink-0" />
                        <span className="break-all">{invoice.customer.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone size={12} className="sm:w-3.5 sm:h-3.5 flex-shrink-0" />
                        <span>{invoice.customer.phone}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Details Table */}
                <div className="mb-6 sm:mb-8">
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-4">Order Details</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="text-left py-3 px-3 sm:px-4 text-xs sm:text-sm font-medium text-gray-700 whitespace-nowrap">Product</th>
                          <th className="text-left py-3 px-3 sm:px-4 text-xs sm:text-sm font-medium text-gray-700 whitespace-nowrap">SKU</th>
                          <th className="text-left py-3 px-3 sm:px-4 text-xs sm:text-sm font-medium text-gray-700 whitespace-nowrap">Qty</th>
                          <th className="text-left py-3 px-3 sm:px-4 text-xs sm:text-sm font-medium text-gray-700 whitespace-nowrap">Unit Price</th>
                          <th className="text-left py-3 px-3 sm:px-4 text-xs sm:text-sm font-medium text-gray-700 whitespace-nowrap">Subtotal</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {invoice.items.map((item: InvoiceItem, index: number) => {
                          const IconComponent = item.icon || Laptop
                          return (
                            <tr key={index} className="bg-white">
                              <td className="py-4 px-3 sm:px-4">
                                <div className="flex items-center gap-2 sm:gap-3">
                                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <IconComponent size={16} className="sm:w-5 sm:h-5 text-gray-400" />
                                  </div>
                                  <div className="min-w-0">
                                    <p className="text-xs sm:text-sm font-semibold text-gray-900">{item.product}</p>
                                    <p className="text-xs text-gray-600 mt-0.5">{item.details}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="py-4 px-3 sm:px-4 text-xs sm:text-sm text-gray-700 whitespace-nowrap">{item.sku}</td>
                              <td className="py-4 px-3 sm:px-4 text-xs sm:text-sm text-gray-700 whitespace-nowrap">{item.qty}</td>
                              <td className="py-4 px-3 sm:px-4 text-xs sm:text-sm text-gray-700 whitespace-nowrap">{item.unitPrice}</td>
                              <td className="py-4 px-3 sm:px-4 text-xs sm:text-sm text-gray-700 whitespace-nowrap">{item.subtotal}</td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Summary */}
                <div className="flex justify-end mb-6 sm:mb-8">
                  <div className="w-full sm:w-64 space-y-2">
                    <div className="flex justify-between text-xs sm:text-sm">
                      <span className="text-gray-600">{t('subtotal')}:</span>
                      <span className="text-gray-900">{invoice.summary.subtotal}</span>
                    </div>
                    <div className="flex justify-between text-xs sm:text-sm">
                      <span className="text-gray-600">{t('shipping')}:</span>
                      <span className="text-gray-900">{invoice.summary.shipping}</span>
                    </div>
                    <div className="flex justify-between text-xs sm:text-sm">
                      <span className="text-gray-600">{t('tax')} (8.5%):</span>
                      <span className="text-gray-900">{invoice.summary.tax}</span>
                    </div>
                    <div className="flex justify-between text-xs sm:text-sm">
                      <span className="text-gray-600">{t('discount')} (5%):</span>
                      <span className="text-red-600">{invoice.summary.discount}</span>
                    </div>
                    <div className="flex justify-between text-base sm:text-lg font-bold pt-2 border-t border-gray-200">
                      <span className="text-gray-900">{t('total')}:</span>
                      <span className="text-gray-900">{invoice.summary.total}</span>
                    </div>
                  </div>
                </div>

                {/* Payment Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6">
                  <div className="border border-gray-200 rounded-lg p-3 sm:p-4">
                    <h4 className="text-sm sm:text-base font-bold text-gray-900 mb-2">{t('paymentMethod')}</h4>
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 sm:w-6 sm:h-6 bg-blue-500 rounded flex-shrink-0"></div>
                      <div className="min-w-0">
                        <p className="text-xs sm:text-sm font-medium text-gray-900">{invoice.payment.method}</p>
                        <p className="text-xs sm:text-sm text-gray-600">{invoice.payment.date}</p>
                      </div>
                    </div>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-3 sm:p-4">
                    <h4 className="text-sm sm:text-base font-bold text-gray-900 mb-2">{t('status')}</h4>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded-full flex-shrink-0"></div>
                      <p className="text-xs sm:text-sm font-medium text-gray-900">{t('paid')}</p>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600 mt-1 break-all">{t('transactionId')}: {invoice.payment.transactionId}</p>
                  </div>
                </div>

                {/* Thank You Message */}
                <div className="text-center mb-4 sm:mb-6">
                  <p className="text-sm sm:text-base font-bold text-gray-900 mb-1 sm:mb-2">{t('thankYouShopping')}</p>
                  <p className="text-xs sm:text-sm text-gray-600">{t('appreciateBusiness')}</p>
                </div>

                {/* Terms & Support */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 pt-4 sm:pt-6 border-t border-gray-200">
                  <div className="border border-gray-200 rounded-lg p-3 sm:p-4">
                    <h4 className="text-sm sm:text-base font-bold text-gray-900 mb-2">{t('termsConditions')}</h4>
                    <p className="text-xs sm:text-sm text-gray-600">
                      {t('paymentDue')}
                    </p>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-3 sm:p-4">
                    <h4 className="text-sm sm:text-base font-bold text-gray-900 mb-2">{t('supportContact')}</h4>
                    <p className="text-xs sm:text-sm text-gray-600 break-words">
                      {t('supportMessage')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Footer Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center sm:justify-end gap-2 sm:gap-3 pb-6">
                <button className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 active:bg-orange-700 transition-colors text-sm sm:text-base">
                  <Download size={16} className="sm:w-[18px] sm:h-[18px]" />
                  {t('downloadPdf')}
                </button>
                <button className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 active:bg-gray-900 transition-colors text-sm sm:text-base">
                  <Printer size={16} className="sm:w-[18px] sm:h-[18px]" />
                  {t('printInvoice')}
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

