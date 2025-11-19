import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'
import { useState } from 'react'
import { Menu, Clock, Package, RefreshCw, Shield, Eye, Save } from 'lucide-react'
import TabsBar from '@/components/ui/TabsBar'
import { useLanguage } from '@/contexts/LanguageContext'
import { ButtonLoader } from '@/components/ui/Loader'

export default function SettingsPolicyPage() {
  const { t } = useLanguage()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [saving, setSaving] = useState(false)

  const handleSavePolicies = async () => {
    setSaving(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800))
    setSaving(false)
    alert(t('settingsSavedSuccessfully') || 'Policies saved successfully!')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Layout */}
      <div className="hidden lg:flex h-screen overflow-hidden">
        {!sidebarCollapsed && (
          <div className="w-64 flex-shrink-0 bg-primary-500 h-screen overflow-y-auto">
            <Sidebar onClose={() => setSidebarCollapsed(true)} currentPage="settingsPolicy" />
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
            <div className="max-w-6xl mx-auto space-y-6">
              {/* Header */}
              <div className="mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{t('storeBuilder')}</h1>
                <p className="text-sm text-gray-500 mt-1">{t('dashboard')} - {t('policySettings')}</p>
              </div>

              {/* Tabs */}
              <TabsBar
                tabs={[
                  { label: t('storeSettings'), href: '/settings/store' },
                  { label: t('policySettings'), href: '/settings/policy', active: true },
                  { label: t('notifications'), href: '/settings/notifications' },
                ]}
                variant="underline"
              />

              {/* Manage Your Policies */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="mb-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-1">{t('manageYourPolicies')}</h2>
                  <p className="text-sm text-gray-600">{t('defineAndUpdatePolicies')}</p>
                </div>

                {/* Shipping Policy */}
                <div className="border border-gray-200 rounded-lg overflow-hidden mb-6">
                  <div className="px-6 py-4 border-b border-gray-200 bg-white">
                    <div className="flex items-start gap-3">
                      <Package className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h3 className="text-base font-semibold text-gray-900 mb-1">{t('shippingPolicy')}</h3>
                        <p className="text-xs text-gray-600">{t('defineShippingTerms')}</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-2">{t('shippingTermsConditions')}</label>
                      <textarea rows={5} className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm resize-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" placeholder={t('shippingTermsConditions')} />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-2">{t('standardDeliveryTime')}</label>
                        <input className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent" placeholder={t('standardDeliveryTime')} />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-2">{t('freeShippingThreshold')}</label>
                        <input className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent" placeholder={t('freeShippingThreshold')} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Refund & Return Policy */}
                <div className="border border-gray-200 rounded-lg overflow-hidden mb-6">
                  <div className="px-6 py-4 border-b border-gray-200 bg-white">
                    <div className="flex items-start gap-3">
                      <RefreshCw className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h3 className="text-base font-semibold text-gray-900 mb-1">{t('refundReturnPolicy')}</h3>
                        <p className="text-xs text-gray-600">{t('setReturnConditions')}</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-2">{t('returnRefundConditions')}</label>
                      <textarea rows={5} className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm resize-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" placeholder={t('returnRefundConditions')} />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-2">{t('returnWindow')}</label>
                        <input className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent" placeholder={t('returnWindow')} />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-2">{t('refundProcessingTime')}</label>
                        <input className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent" placeholder={t('refundProcessingTime')} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Privacy & Other Policies */}
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200 bg-white">
                    <div className="flex items-start gap-3">
                      <Shield className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h3 className="text-base font-semibold text-gray-900 mb-1">{t('privacyOtherPolicies')}</h3>
                        <p className="text-xs text-gray-600">{t('additionalPolicies')}</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 space-y-5">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-2">{t('privacyPolicy')}</label>
                      <textarea rows={4} className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm resize-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" placeholder={t('privacyPolicy')} />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-2">{t('termsOfService')}</label>
                      <textarea rows={4} className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm resize-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" placeholder={t('termsOfService')} />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-2">{t('customPolicies')}</label>
                      <textarea rows={4} className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm resize-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" placeholder={t('customPolicies')} />
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex flex-col gap-2">
                    <button className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors">
                      <Eye size={16} />
                      {t('previewPolicies')}
                    </button>
                    <p className="text-xs text-gray-500">{t('lastUpdated')}: December 18, 2024 at 2:30 PM</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors">{t('cancel')}</button>
                    <button 
                      onClick={handleSavePolicies}
                      disabled={saving}
                      className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-orange-500 text-white hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {saving ? <ButtonLoader size="sm" /> : <Save size={16} />}
                      {saving ? t('saving') : t('savePolicies')}
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
              <Sidebar onClose={() => setSidebarOpen(false)} currentPage="settingsPolicy" />
            </div>
          </div>
        )}

        <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
          <Header onToggleSidebar={() => setSidebarOpen(true)} isSidebarOpen={sidebarOpen} />
        </div>
        <main className="p-4 space-y-4">
          {/* Page header */}
          <div className="mb-4">
            <h1 className="text-xl font-bold text-gray-900">{t('storeBuilder')}</h1>
            <p className="text-xs text-gray-500 mt-1">{t('dashboard')} - {t('policySettings')}</p>
          </div>

          <div>
            <TabsBar
              tabs={[
                { label: t('storeSettings'), href: '/settings/store' },
                { label: t('policySettings'), href: '/settings/policy', active: true },
                { label: t('notifications'), href: '/settings/notifications' },
              ]}
              variant="underline"
            />
          </div>

          {/* Manage Your Policies */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="mb-4">
              <h2 className="text-base font-bold text-gray-900 mb-1">{t('manageYourPolicies')}</h2>
              <p className="text-xs text-gray-600">{t('defineAndUpdatePolicies')}</p>
            </div>

            {/* Shipping Policy */}
            <div className="border border-gray-200 rounded-lg overflow-hidden mb-4">
              <div className="px-4 py-3 border-b border-gray-200 bg-white">
                <div className="flex items-start gap-3">
                  <Package className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-1">{t('shippingPolicy')}</h3>
                    <p className="text-xs text-gray-600">{t('defineShippingTerms')}</p>
                  </div>
                </div>
              </div>
              <div className="p-4 space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">{t('shippingTermsConditions')}</label>
                  <textarea rows={5} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none" placeholder={t('shippingTermsConditions')} />
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">{t('standardDeliveryTime')}</label>
                    <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" placeholder={t('standardDeliveryTime')} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">{t('freeShippingThreshold')}</label>
                    <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" placeholder={t('freeShippingThreshold')} />
                  </div>
                </div>
              </div>
            </div>

            {/* Refund & Return Policy */}
            <div className="border border-gray-200 rounded-lg overflow-hidden mb-4">
              <div className="px-4 py-3 border-b border-gray-200 bg-white">
                <div className="flex items-start gap-3">
                  <RefreshCw className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-1">{t('refundReturnPolicy')}</h3>
                    <p className="text-xs text-gray-600">{t('setReturnConditions')}</p>
                  </div>
                </div>
              </div>
              <div className="p-4 space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">{t('returnRefundConditions')}</label>
                  <textarea rows={5} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none" placeholder={t('returnRefundConditions')} />
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">{t('returnWindow')}</label>
                    <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" placeholder={t('returnWindow')} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">{t('refundProcessingTime')}</label>
                    <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" placeholder={t('refundProcessingTime')} />
                  </div>
                </div>
              </div>
            </div>

            {/* Privacy & Other Policies */}
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-200 bg-white">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-1">{t('privacyOtherPolicies')}</h3>
                    <p className="text-xs text-gray-600">{t('additionalPolicies')}</p>
                  </div>
                </div>
              </div>
              <div className="p-4 space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">{t('privacyPolicy')}</label>
                  <textarea rows={4} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none" placeholder={t('privacyPolicy')} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">{t('termsOfService')}</label>
                  <textarea rows={4} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none" placeholder={t('termsOfService')} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">{t('customPolicies')}</label>
                  <textarea rows={4} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none" placeholder={t('customPolicies')} />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-6 flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <button className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors w-fit">
                  <Eye size={16} />
                  {t('previewPolicies')}
                </button>
                <p className="text-xs text-gray-500">{t('lastUpdated')}: December 18, 2024 at 2:30 PM</p>
              </div>
              <div className="flex items-center gap-3 justify-end">
                <button className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors">{t('cancel')}</button>
                <button className="px-4 py-2 text-sm font-medium rounded-lg bg-orange-500 text-white hover:bg-orange-600 transition-colors">{t('savePolicies')}</button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}


