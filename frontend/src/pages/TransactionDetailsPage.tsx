import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Menu, ArrowLeft, Download, RefreshCw, Check, X, AlertTriangle, MessageCircle, Calendar, Clock, Headphones } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

// TypeScript interfaces
interface TransactionProduct {
  name: string
  qty: number
  price: number
}

interface TransactionTimelineStep {
  status: string
  date: string
  completed: boolean
  current?: boolean
  failed?: boolean
}

export default function TransactionDetailsPage({ params }: { params: { id: string } }) {
  const navigate = useNavigate()
  const { t } = useLanguage()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  // Mock transaction data - This would normally come from an API
  // Based on transaction ID, we determine the status
  const transactionMap: Record<string, any> = {
    'TXN001234': {
      id: 'TXN001234',
      orderId: 'ORD5678',
      type: 'Earning',
      amount: 150.00,
      paymentMethod: 'Credit Card',
      status: 'Completed',
      date: 'Dec 15, 2024',
      time: '10:45 AM',
      grossAmount: 150.00,
      commission: 5.00,
      commissionPercent: 3.3,
      netAmount: 145.00,
      reference: 'TRX967654321',
      customer: {
        name: 'John Smith',
        email: 'john@example.com'
      },
      products: [
        { name: 'Premium Web Design Package', qty: 1, price: 120.00 },
        { name: 'Logo Design Add-on', qty: 1, price: 30.00 }
      ],
      timeline: [
        { status: 'Initiated', date: 'Dec 15, 2024 - 10:45 AM', completed: true },
        { status: 'Processing', date: 'Dec 15, 2024 - 10:46 AM', completed: true },
        { status: 'Completed', date: 'Dec 15, 2024 - 10:47 AM', completed: true }
      ],
      notes: 'Payment settled successfully via Credit Card. Transaction processed through secure payment gateway with 3D authentication.'
    },
    'TXN001235': {
      id: 'TXN001235',
      orderId: 'ORD6679',
      type: 'Earning',
      amount: 75.50,
      paymentMethod: 'PayPal',
      status: 'Pending',
      date: 'Dec 14, 2024',
      time: '11:15 AM',
      grossAmount: 85.00,
      commission: 6.80,
      commissionPercent: 8,
      processingFee: 2.70,
      netAmount: 75.50,
      currentStatus: 'Payment verification in progress',
      estimatedSettlement: '2-3 business days',
      processingGateway: 'PayPal Payment Services',
      reference: '',
      timeline: [
        { status: 'Initiated', date: 'Dec 14, 11:15 AM', completed: true },
        { status: 'Pending', date: 'In Progress', completed: false, current: true },
        { status: 'Completed', date: 'Awaiting', completed: false }
      ],
      notes: 'Awaiting confirmation from PayPal gateway. Processing typically takes 2-3 business days for international transactions.'
    },
    'TXN001237': {
      id: 'TXN001237',
      orderId: 'ORD5680',
      type: 'Withdrawal',
      amount: 220.00,
      paymentMethod: 'Bank Transfer',
      status: 'Failed',
      date: 'Dec 12, 2024',
      time: '02:35 PM',
      grossAmount: 220.00,
      deductions: 0.00,
      netAmount: 0.00,
      reference: 'Not Available',
      failureReason: 'Bank rejected transaction due to insufficient account verification',
      adminRemarks: 'Please complete your bank account verification process before attempting another withdrawal. Contact support if you need assistance with verification documents.',
      timeline: [
        { status: 'Initiated', date: 'Dec 12, 2024 - 02:35 PM', completed: true },
        { status: 'Processing', date: 'Dec 12, 2024 - 02:36 PM', completed: true },
        { status: 'Failed', date: 'Dec 12, 2024 - 02:40 PM', completed: true, failed: true }
      ]
    }
  }

  const transaction = transactionMap[params.id] || transactionMap['TXN001234']
  const isCompleted = transaction.status === 'Completed'
  const isPending = transaction.status === 'Pending'
  const isFailed = transaction.status === 'Failed'

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setSidebarOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-64 bg-primary-500">
            <Sidebar onClose={() => setSidebarOpen(false)} currentPage="transactionHistory" />
          </div>
        </div>
      )}

      {/* Desktop Layout */}
      <div className="hidden lg:flex h-screen overflow-hidden">
        {!sidebarCollapsed && (
          <div className="w-64 flex-shrink-0 bg-primary-500 h-screen overflow-y-auto">
            <Sidebar onClose={() => setSidebarCollapsed(true)} currentPage="transactionHistory" />
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
              {/* Header */}
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Transactions & Finance</h1>
                <p className="text-sm text-gray-500 mt-1">Dashboard • Transaction Details</p>
              </div>

              {/* Transaction Summary Card */}
              <div className="bg-white rounded-lg shadow-sm p-6 relative">
                {transaction.status && (
                  <div className={`absolute top-6 right-6 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 ${
                    isCompleted ? 'bg-green-100 text-green-700' :
                    isPending ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {isFailed && <div className="w-2 h-2 bg-red-600 rounded-full"></div>}
                    {transaction.status}
                  </div>
                )}
                
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Transaction Summary</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500">Transaction ID</p>
                      <p className="font-medium text-gray-900">#{transaction.id}</p>
                    </div>
                    {transaction.orderId && (
                      <div>
                        <p className="text-sm text-gray-500">Linked Order ID</p>
                        <button
                          onClick={() => navigate(`/orders/${transaction.orderId?.replace(/[^0-9]/g, '')}`)}
                          className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
                        >
                          #{transaction.orderId}
                        </button>
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-gray-500">Transaction Type</p>
                      <p className="font-medium text-gray-900">{transaction.type}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500">Amount</p>
                      <p className={`text-2xl font-bold ${
                        isCompleted ? 'text-green-600' :
                        isPending ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        {(transaction.status !== 'Failed' ? '+' : '') + '$' + transaction.amount.toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Payment Method</p>
                      <p className="font-medium text-gray-900">{transaction.paymentMethod}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Date & Time</p>
                      <p className="font-medium text-gray-900">{transaction.date} - {transaction.time}</p>
                    </div>
                    {transaction.reference !== undefined && (
                      <div>
                        <p className="text-sm text-gray-500">Reference</p>
                        <p className="font-medium text-gray-900">{transaction.reference || '—'}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Processing Information (for Pending) */}
              {isPending && transaction.currentStatus && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Processing Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <p className="text-sm text-gray-500">Current Status</p>
                      <p className="font-medium text-gray-900">{transaction.currentStatus}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Estimated Settlement</p>
                      <p className="font-medium text-gray-900">{transaction.estimatedSettlement}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Processing Gateway</p>
                      <p className="font-medium text-gray-900">{transaction.processingGateway}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Failure Reason (for Failed) */}
              {isFailed && transaction.failureReason && (
                <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <AlertTriangle className="text-red-600" size={20} />
                    <h2 className="text-xl font-semibold text-red-900">Failure Reason</h2>
                  </div>
                  <p className="text-red-800 font-medium mb-4">{transaction.failureReason}</p>
                  {transaction.adminRemarks && (
                    <div className="mt-4">
                      <p className="text-sm font-medium text-red-900 mb-2">Admin Remarks</p>
                      <p className="text-red-800 text-sm">{transaction.adminRemarks}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Order & Reference Information (for Completed/Earning) */}
              {isCompleted && transaction.customer && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Order & Reference Information</h2>
                  <div className="space-y-4">
                    {transaction.products && (
                      <div>
                        <p className="text-sm text-gray-500 mb-2">Products Purchased</p>
                        <div className="space-y-2">
                          {transaction.products.map((product: TransactionProduct, index: number) => (
                            <div key={index} className="flex justify-between">
                              <span className="text-gray-900">{product.name}</span>
                              <span className="text-gray-600">(x {'$' + product.price.toFixed(2)})</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-gray-500">Customer Name</p>
                      <p className="font-medium text-gray-900">{transaction.customer.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Customer Email</p>
                      <p className="font-medium text-gray-900">{transaction.customer.email}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Payment Breakdown */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment Breakdown</h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Gross Amount</span>
                    <span className="font-medium text-gray-900">${transaction.grossAmount?.toFixed(2) || transaction.amount.toFixed(2)}</span>
                  </div>
                  {transaction.commission !== undefined && (
                    <div className="flex justify-between text-red-600">
                      <span>Platform Commission ({transaction.commissionPercent}%)</span>
                      <span>-${transaction.commission.toFixed(2)}</span>
                    </div>
                  )}
                  {transaction.processingFee !== undefined && (
                    <div className="flex justify-between text-red-600">
                      <span>Payment Processing Fee</span>
                      <span>-${transaction.processingFee.toFixed(2)}</span>
                    </div>
                  )}
                  {transaction.deductions !== undefined && (
                    <div className="flex justify-between text-red-600">
                      <span>Deductions</span>
                      <span>-${transaction.deductions.toFixed(2)}</span>
                    </div>
                  )}
                  <div className={`border-t-2 pt-3 ${isFailed ? 'border-red-300' : 'border-gray-200'}`}>
                    <div className={`flex justify-between ${isFailed ? 'bg-red-50 -mx-2 px-2 py-2 rounded' : ''}`}>
                      <span className={`font-semibold ${isFailed ? 'text-red-600' : isPending ? 'text-yellow-600' : 'text-green-600'}`}>
                        {isPending ? 'Net Amount (Pending)' : isFailed ? 'Net Amount Received' : 'Net Amount Received'}
                      </span>
                      <span className={`text-xl font-bold ${isFailed ? 'text-red-600' : isPending ? 'text-yellow-600' : 'text-green-600'}`}>
                        ${transaction.netAmount?.toFixed(2) || '0.00'}
                      </span>
                    </div>
                  </div>
                  {transaction.reference !== undefined && (
                    <div className="mt-4 pt-4 border-t">
                      <p className="text-sm text-gray-500">Transaction Reference</p>
                      <p className={`font-medium ${transaction.reference === 'Not Available' ? 'text-red-600' : 'text-gray-900'}`}>
                        {transaction.reference || '—'}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Status Timeline */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Status Timeline</h2>
                <div className="relative">
                  <div className="flex items-center justify-between">
                    {transaction.timeline.map((step: TransactionTimelineStep, index: number) => (
                      <div key={index} className="flex-1 relative">
                        <div className="flex flex-col items-center">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${
                            step.failed 
                              ? 'bg-red-100 border-red-500 text-red-600' :
                              step.completed 
                                ? 'bg-green-100 border-green-500 text-green-600' 
                                : step.current
                                  ? 'bg-yellow-100 border-yellow-500 text-yellow-600'
                                  : 'bg-gray-100 border-gray-300 text-gray-400'
                          }`}>
                            {step.failed ? <X size={20} className="text-white" /> : step.completed ? <Check size={20} className="text-white" /> : step.current ? <Clock size={20} className="text-white" /> : <Check size={20} />}
                          </div>
                          <div className="mt-2 text-center">
                            <p className={`text-sm font-medium ${step.completed ? 'text-green-600' : step.failed ? 'text-red-600' : step.current ? 'text-yellow-600' : 'text-gray-400'}`}>
                              {step.status}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">{step.date}</p>
                          </div>
                        </div>
                        {index < transaction.timeline.length - 1 && (
                          <div className={`absolute top-6 left-[60%] w-[80%] h-0.5 ${
                            step.failed || (transaction.timeline[index + 1]?.failed) ? 'bg-red-500' :
                            !step.completed && !step.current ? 'bg-gray-300' :
                            step.completed && (transaction.timeline[index + 1]?.completed || transaction.timeline[index + 1]?.current) ? 'bg-green-500' :
                            step.current ? 'bg-yellow-500' : 'bg-gray-300'
                          }`} />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Notes & Remarks */}
              {transaction.notes && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Notes & Remarks</h2>
                  <div className={`rounded-lg p-4 ${
                    isCompleted ? 'bg-blue-50 border border-blue-200' :
                    isPending ? 'bg-yellow-50 border border-yellow-200' :
                    'bg-red-50 border border-red-200'
                  }`}>
                    <div className="flex gap-3">
                      <MessageCircle className={`flex-shrink-0 ${isCompleted ? 'text-blue-600' : isPending ? 'text-yellow-600' : 'text-red-600'}`} size={20} />
                      <div>
                        <p className={`text-sm font-medium mb-1 ${isCompleted ? 'text-blue-900' : isPending ? 'text-yellow-900' : 'text-red-900'}`}>
                          {isPending ? 'Admin Note' : isFailed ? 'Admin Note' : ''}
                        </p>
                        <p className={`text-sm ${isCompleted ? 'text-blue-800' : isPending ? 'text-yellow-800' : 'text-red-800'}`}>
                          {transaction.notes}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Help Card (for Failed) */}
              {isFailed && (
                <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Headphones className="text-blue-600 flex-shrink-0" size={24} />
                    <div>
                      <h2 className="text-xl font-semibold text-blue-900">Need Help?</h2>
                      <p className="text-blue-800 text-sm mt-1">Our support team is here to help you resolve this issue and complete your transaction.</p>
                    </div>
                  </div>
                  <button 
                    className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
                    aria-label="Contact Support"
                  >
                    Contact Support
                  </button>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-4">
                {isCompleted && (
                  <>
                    <button className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium">
                      <Download size={18} />
                      Export Transaction
                    </button>
                    <button className="flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium">
                      <Download size={18} />
                      Download Receipt
                    </button>
                  </>
                )}
                {isFailed && (
                  <>
                    <button className="flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium">
                      <Download size={18} />
                      Download Failed Report
                    </button>
                    <button className="flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium">
                      <RefreshCw size={18} />
                      Retry Transaction
                    </button>
                  </>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden min-h-screen bg-gray-50">
        <Header onToggleSidebar={() => setSidebarOpen(true)} isSidebarOpen={sidebarOpen} />
        <main className="p-4 pt-20 space-y-4 pb-6">
          {/* Mobile Header */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Transactions & Finance</h1>
            <p className="text-sm text-gray-500 mt-1">Dashboard • Transaction Details</p>
          </div>

          {/* Mobile Transaction Summary */}
          <div className="bg-white rounded-lg shadow-sm p-4 relative">
            {transaction.status && (
              <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-2 ${
                isCompleted ? 'bg-green-100 text-green-700' :
                isPending ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'
              }`}>
                {isFailed && <div className="w-1.5 h-1.5 bg-red-600 rounded-full"></div>}
                {transaction.status}
              </div>
            )}
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Transaction Summary</h2>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-500">Transaction ID</p>
                <p className="font-medium text-gray-900 text-sm">#{transaction.id}</p>
              </div>
              {transaction.orderId && (
                <div>
                  <p className="text-xs text-gray-500">Linked Order ID</p>
                  <button
                    onClick={() => navigate(`/orders/${transaction.orderId?.replace(/[^0-9]/g, '')}`)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    #{transaction.orderId}
                  </button>
                </div>
              )}
              <div>
                <p className="text-xs text-gray-500">Amount</p>
                <p className={`text-xl font-bold ${
                  isCompleted ? 'text-green-600' :
                  isPending ? 'text-yellow-600' :
                  'text-red-600'
                }`}>
                  {(transaction.status !== 'Failed' ? '+' : '') + '$' + transaction.amount.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          {/* Mobile Action Buttons */}
          <div className="flex flex-col gap-2">
            {isCompleted && (
              <>
                <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-lg text-sm font-medium">
                  <Download size={16} />
                  Export Transaction
                </button>
                <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-orange-500 text-white rounded-lg text-sm font-medium">
                  <Download size={16} />
                  Download Receipt
                </button>
              </>
            )}
            {isFailed && (
              <>
                <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-600 text-white rounded-lg text-sm font-medium">
                  <Download size={16} />
                  Download Failed Report
                </button>
                <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-orange-500 text-white rounded-lg text-sm font-medium">
                  <RefreshCw size={16} />
                  Retry Transaction
                </button>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

