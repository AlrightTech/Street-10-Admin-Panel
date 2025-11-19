import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Menu, ArrowLeft, Download, X, Check, Clock, FileText, Eye, AlertCircle, Info } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import React from 'react'

// TypeScript interfaces
type LucideIcon = React.ComponentType<{ size?: number; className?: string }>

interface WithdrawalTimelineStep {
  status: string
  date: string
  completed: boolean
  icon: LucideIcon
}

export default function WithdrawalDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { t } = useLanguage()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  // Mock withdrawal data - based on ID
  const withdrawalMap: Record<string, any> = {
    'WD-2024-001': {
      id: 'WO66789',
      amount: 1200.00,
      fees: 20.00,
      netAmount: 1180.00,
      status: 'Completed',
      method: 'Bank Transfer',
      requestDate: '15/05/2024',
      completedDate: '16/05/2024',
      bankName: 'Habib Bank Limited (HBL)',
      reference: 'TRX9867654321',
      accountNumber: '***3456',
      accountHolder: 'John Smith',
      timeline: [
        { status: 'Request Submitted', icon: FileText, date: '15/05/2024 10:00 AM', completed: true },
        { status: 'Under Review', icon: Eye, date: '15/05/2024 02:30 PM', completed: true },
        { status: 'Approved', icon: Check, date: '16/05/2024 09:45 AM', completed: true },
        { status: 'Processed', icon: Check, date: '16/05/2024 10:00 AM', completed: true }
      ],
      notes: 'Withdrawal approved and processed successfully. All verification checks passed. Amount transferred to vendor\'s registered bank account. - Admin Team, 16/05/2024'
    },
    'WD-2024-0156': {
      id: 'WD-2024-0156',
      amount: 2500.00,
      availableBalance: 3750.00,
      status: 'Pending',
      method: 'Bank Transfer',
      requestDate: 'Jan 15, 2024',
      requestTime: '2:30 PM',
      bankName: 'Chase Bank',
      accountHolder: 'John Michael Vendor',
      accountNumber: '****-****-****1234',
      routingNumber: '021000021',
      estimatedCompletion: 'January 20, 2024',
      vendorNote: 'Need funds for upcoming product inventory purchase. Urgent processing would be appreciated.',
      adminNote: 'No admin notes yet. Admin will update once reviewed.',
      timeline: [
        { status: 'Request Submitted', date: 'Jan 15, 2024 at 2:30 PM', completed: true }
      ]
    },
    'WD-2024-004': {
      id: 'WD-2024-004',
      amount: 450.00,
      status: 'Rejected',
      method: 'JazzCash',
      requestDate: 'Nov 28, 2024',
      rejectionReason: 'Account verification incomplete'
    }
  }

  const withdrawal = withdrawalMap[id || ''] || withdrawalMap['WD-2024-001']
  const isCompleted = withdrawal.status === 'Completed'
  const isPending = withdrawal.status === 'Pending'
  const isRejected = withdrawal.status === 'Rejected'

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setSidebarOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-64 bg-primary-500">
            <Sidebar onClose={() => setSidebarOpen(false)} currentPage="earningsOverview" />
          </div>
        </div>
      )}

      {/* Desktop Layout */}
      <div className="hidden lg:flex h-screen overflow-hidden">
        {!sidebarCollapsed && (
          <div className="w-64 flex-shrink-0 bg-primary-500 h-screen overflow-y-auto">
            <Sidebar onClose={() => setSidebarCollapsed(true)} currentPage="earningsOverview" />
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
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <button
                      onClick={() => navigate('/transactions/earnings/withdrawals')}
                      className="p-2 hover:bg-gray-100 rounded-lg"
                      aria-label="Go back to withdrawal history"
                    >
                      <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-3xl font-bold text-gray-900">{t('withdrawalHistory')}</h1>
                  </div>
                  <p className="text-sm text-gray-500">{t('dashboard')} {isPending ? '/ Requested Amount' : '> Withdrawal History'}</p>
                </div>
              </div>

              {/* Completed Withdrawal View */}
              {isCompleted && (
                <>
                  <div className="bg-white rounded-lg shadow-sm p-6 relative">
                    <div className="absolute top-6 right-6 px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium flex items-center gap-2">
                      <Check size={16} />
                      {withdrawal.status}
                    </div>
                    
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">{t('withdrawalSummary')}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <p className="text-sm text-gray-500 mb-2">{t('withdrawalId')}</p>
                        <p className="font-medium text-gray-900">#{withdrawal.id}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-2">{t('totalAmountRequested')}</p>
                        <p className="text-2xl font-bold text-gray-900">${withdrawal.amount.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-2">{t('processingFees')}</p>
                        <p className="font-medium text-red-600">-${withdrawal.fees.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-2">{t('paymentMethod')}</p>
                        <p className="font-medium text-gray-900">{withdrawal.method}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-2">{t('requestDate')}</p>
                        <p className="font-medium text-gray-900">{withdrawal.requestDate}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-2">{t('completedDate')}</p>
                        <p className="font-medium text-gray-900">{withdrawal.completedDate}</p>
                      </div>
                    </div>
                    <div className="mt-6 pt-6 border-t">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold text-green-600">{t('netAmountTransferred')}</span>
                        <span className="text-3xl font-bold text-green-600">${withdrawal.netAmount.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('transactionInformation')}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <p className="text-sm text-gray-500 mb-2">{t('bankName')}</p>
                        <p className="font-medium text-gray-900">{withdrawal.bankName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-2">{t('transactionReference')}</p>
                        <p className="font-medium text-gray-900">{withdrawal.reference}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-2">{t('accountNumber')}</p>
                        <p className="font-medium text-gray-900">{withdrawal.accountNumber}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-2">{t('accountHolder')}</p>
                        <p className="font-medium text-gray-900">{withdrawal.accountHolder}</p>
                      </div>
                    </div>
                  </div>

                  {withdrawal.timeline && (
                    <div className="bg-white rounded-lg shadow-sm p-6">
                      <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('processingTimeline')}</h2>
                      <div className="relative">
                        <div className="flex items-center justify-between">
                          {withdrawal.timeline.map((step: WithdrawalTimelineStep, index: number) => (
                            <div key={index} className="flex-1 relative">
                              <div className="flex flex-col items-center">
                                <div className="w-12 h-12 rounded-full bg-green-100 border-2 border-green-500 flex items-center justify-center text-green-600">
                                  <step.icon size={20} />
                                </div>
                                <div className="mt-2 text-center">
                                  <p className="text-sm font-medium text-green-600">{step.status}</p>
                                  <p className="text-xs text-gray-500 mt-1">{step.date}</p>
                                </div>
                              </div>
                              {index < withdrawal.timeline.length - 1 && (
                                <div className="absolute top-6 left-[60%] w-[80%] h-0.5 bg-green-500" />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {withdrawal.notes && (
                    <div className="bg-white rounded-lg shadow-sm p-6">
                      <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('adminNotesRemarks')}</h2>
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex gap-3">
                          <Check className="text-green-600 flex-shrink-0" size={20} />
                          <p className="text-sm text-green-800">{withdrawal.notes}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Pending Withdrawal View */}
              {isPending && (
                <>
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <p className="text-sm text-gray-500">{t('requestId')}</p>
                        <p className="text-xl font-bold text-gray-900">#{withdrawal.id}</p>
                      </div>
                      <span className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">
                        {withdrawal.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">Submitted on {withdrawal.requestDate} at {withdrawal.requestTime}</p>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('requestInformation')}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-gray-500 mb-2">{t('requestedAmount')}</p>
                          <p className="text-3xl font-bold text-gray-900">${withdrawal.amount.toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-2">{t('paymentMethod')}</p>
                          <p className="font-medium text-gray-900 flex items-center gap-2">
                            {withdrawal.method}
                          </p>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-gray-500 mb-2">{t('availableBalance')}</p>
                          <p className="text-2xl font-bold text-green-600">${withdrawal.availableBalance.toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-2">{t('requestDateTime')}</p>
                          <p className="font-medium text-gray-900">{withdrawal.requestDate} - {withdrawal.requestTime}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('bankAccountDetails')}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-gray-500 mb-2">{t('accountHolderName')}</p>
                          <p className="font-medium text-gray-900">{withdrawal.accountHolder}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-2">{t('bankName')}</p>
                          <p className="font-medium text-gray-900">{withdrawal.bankName}</p>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-gray-500 mb-2">{t('accountNumber')}</p>
                          <p className="font-medium text-gray-900">{withdrawal.accountNumber}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-2">{t('routingNumber')}</p>
                          <p className="font-medium text-gray-900">{withdrawal.routingNumber}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
                    <div className="flex gap-3 mb-4">
                      <Info className="text-blue-600 flex-shrink-0" size={20} />
                      <div>
                        <p className="text-blue-800 mb-2">{t('processingInformationPending')}</p>
                        <p className="text-sm text-blue-700">{t('estimatedCompletion')}: {withdrawal.estimatedCompletion}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('notes')}</h2>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">{t('vendorNote')}</p>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <p className="text-sm text-gray-700">{withdrawal.vendorNote}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">{t('adminNote')}</p>
                        <div className="bg-gray-50 rounded-lg p-4 flex items-start gap-2">
                          <Info className="text-gray-400 flex-shrink-0 mt-0.5" size={16} />
                          <p className="text-sm text-gray-600">{withdrawal.adminNote}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button className="flex items-center gap-2 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium border border-red-400">
                      <X size={18} />
                      {t('cancelRequest')}
                    </button>
                  </div>
                </>
              )}

              {/* Rejected Withdrawal View */}
              {isRejected && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <p className="text-lg font-semibold text-gray-900 mb-4">{t('withdrawalRejected')}</p>
                  <p className="text-red-600">{t('rejectionReason')}: {withdrawal.rejectionReason}</p>
                </div>
              )}

              {/* Action Buttons for Completed */}
              {isCompleted && (
                <div className="flex gap-4">
                  <button
                    onClick={() => navigate('/transactions/earnings/withdrawals')}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    {t('withdrawalHistory')}
                  </button>
                  <button className="flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium">
                    <Download size={18} />
                    {t('downloadReceipt')}
                  </button>
                  <button className="flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium">
                    <Download size={18} />
                    {t('exportDetails')}
                  </button>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden">
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
          <Header onToggleSidebar={() => setSidebarOpen(true)} isSidebarOpen={sidebarOpen} />
        </div>
        <main className="p-4">
          <div className="mb-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 hover:bg-gray-100 rounded-lg"
              aria-label="Open menu"
            >
              <Menu size={24} />
            </button>
          </div>
        </main>
      </div>
    </div>
  )
}

