import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'
import { useState } from 'react'
import { Menu, Clock, Package, RefreshCw, Shield, Eye, Save, X } from 'lucide-react'
import TabsBar from '@/components/ui/TabsBar'
import { useLanguage } from '@/contexts/LanguageContext'
import { ButtonLoader } from '@/components/ui/Loader'
import SuccessModal from '@/components/ui/SuccessModal'

export default function SettingsPolicyPage() {
  const { t } = useLanguage()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [saving, setSaving] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [showPreviewModal, setShowPreviewModal] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  const [form, setForm] = useState({
    shippingTermsConditions: '',
    standardDeliveryTime: '',
    freeShippingThreshold: '',
    returnRefundConditions: '',
    returnWindow: '',
    refundProcessingTime: '',
    privacyPolicy: '',
    termsOfService: '',
    customPolicies: ''
  })

  const validateField = (name: string, value: string): string => {
    switch (name) {
      case 'shippingTermsConditions':
        if (value.trim().length > 2000) {
          return t('textTooLong') || 'Text must be less than 2000 characters'
        }
        return ''

      case 'standardDeliveryTime':
        if (value.trim() && value.trim().length > 100) {
          return t('textTooLong') || 'Text must be less than 100 characters'
        }
        return ''

      case 'freeShippingThreshold':
        if (value.trim()) {
          // Validate if it's a number or currency format
          const numValue = value.replace(/[^\d.]/g, '')
          if (numValue && (isNaN(parseFloat(numValue)) || parseFloat(numValue) < 0)) {
            return t('invalidAmount') || 'Please enter a valid amount'
          }
        }
        if (value.trim().length > 50) {
          return t('textTooLong') || 'Text must be less than 50 characters'
        }
        return ''

      case 'returnRefundConditions':
        if (value.trim().length > 2000) {
          return t('textTooLong') || 'Text must be less than 2000 characters'
        }
        return ''

      case 'returnWindow':
        if (value.trim() && value.trim().length > 100) {
          return t('textTooLong') || 'Text must be less than 100 characters'
        }
        return ''

      case 'refundProcessingTime':
        if (value.trim() && value.trim().length > 100) {
          return t('textTooLong') || 'Text must be less than 100 characters'
        }
        return ''

      case 'privacyPolicy':
        if (value.trim().length > 2000) {
          return t('textTooLong') || 'Text must be less than 2000 characters'
        }
        return ''

      case 'termsOfService':
        if (value.trim().length > 2000) {
          return t('textTooLong') || 'Text must be less than 2000 characters'
        }
        return ''

      case 'customPolicies':
        if (value.trim().length > 2000) {
          return t('textTooLong') || 'Text must be less than 2000 characters'
        }
        return ''

      default:
        return ''
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}
    
    Object.keys(form).forEach((key) => {
      const error = validateField(key, form[key as keyof typeof form])
      if (error) {
        newErrors[key] = error
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
    
    // Validate on change if field has been touched
    if (touched[name]) {
      const error = validateField(name, value)
      if (error) {
        setErrors(prev => ({
          ...prev,
          [name]: error
        }))
      }
    }
  }

  const onBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setTouched(prev => ({ ...prev, [name]: true }))
    
    const error = validateField(name, value)
    setErrors(prev => ({
      ...prev,
      [name]: error
    }))
  }

  const handleSavePolicies = async () => {
    // Mark all fields as touched
    const allTouched: Record<string, boolean> = {}
    Object.keys(form).forEach(key => {
      allTouched[key] = true
    })
    setTouched(allTouched)

    // Validate form
    if (!validateForm()) {
      // Scroll to first error
      const firstErrorField = Object.keys(errors)[0] || Object.keys(form).find(key => {
        const error = validateField(key, form[key as keyof typeof form])
        return error
      })
      if (firstErrorField) {
        const element = document.querySelector(`[name="${firstErrorField}"]`)
        element?.scrollIntoView({ behavior: 'smooth', block: 'center' })
        ;(element as HTMLElement)?.focus()
      }
      return
    }

    setSaving(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800))
    setSaving(false)
    setShowSuccessModal(true)
    setTimeout(() => setShowSuccessModal(false), 2000)
  }

  const onCancel = () => {
    setForm({
      shippingTermsConditions: '',
      standardDeliveryTime: '',
      freeShippingThreshold: '',
      returnRefundConditions: '',
      returnWindow: '',
      refundProcessingTime: '',
      privacyPolicy: '',
      termsOfService: '',
      customPolicies: ''
    })
    setErrors({})
    setTouched({})
  }

  const handlePreviewPolicies = () => {
    setShowPreviewModal(true)
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
                      <textarea 
                        name="shippingTermsConditions"
                        value={form.shippingTermsConditions}
                        onChange={onChange}
                        onBlur={onBlur}
                        rows={5} 
                        maxLength={2000}
                        className={`w-full border rounded-lg px-4 py-3 text-sm resize-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                          errors.shippingTermsConditions ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder={t('shippingTermsConditions')}
                      />
                      <div className="flex items-center justify-between mt-1">
                        {errors.shippingTermsConditions ? (
                          <p className="text-xs text-red-500">{errors.shippingTermsConditions}</p>
                        ) : (
                          <p className="text-[10px] text-gray-500">{t('maximum2000Characters') || 'Maximum 2000 characters'}</p>
                        )}
                        <p className={`text-[10px] ${form.shippingTermsConditions.length > 1800 ? 'text-orange-500' : 'text-gray-500'}`}>
                          {form.shippingTermsConditions.length}/2000
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-2">{t('standardDeliveryTime')}</label>
                        <input 
                          name="standardDeliveryTime"
                          value={form.standardDeliveryTime}
                          onChange={onChange}
                          onBlur={onBlur}
                          maxLength={100}
                          className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                            errors.standardDeliveryTime ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder={t('standardDeliveryTime')}
                        />
                        {errors.standardDeliveryTime && (
                          <p className="text-xs text-red-500 mt-1">{errors.standardDeliveryTime}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-2">{t('freeShippingThreshold')}</label>
                        <input 
                          name="freeShippingThreshold"
                          value={form.freeShippingThreshold}
                          onChange={onChange}
                          onBlur={onBlur}
                          maxLength={50}
                          className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                            errors.freeShippingThreshold ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder={t('freeShippingThreshold')}
                        />
                        {errors.freeShippingThreshold && (
                          <p className="text-xs text-red-500 mt-1">{errors.freeShippingThreshold}</p>
                        )}
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
                      <textarea 
                        name="returnRefundConditions"
                        value={form.returnRefundConditions}
                        onChange={onChange}
                        onBlur={onBlur}
                        rows={5}
                        maxLength={2000}
                        className={`w-full border rounded-lg px-4 py-3 text-sm resize-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                          errors.returnRefundConditions ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder={t('returnRefundConditions')}
                      />
                      <div className="flex items-center justify-between mt-1">
                        {errors.returnRefundConditions ? (
                          <p className="text-xs text-red-500">{errors.returnRefundConditions}</p>
                        ) : (
                          <p className="text-[10px] text-gray-500">{t('maximum2000Characters') || 'Maximum 2000 characters'}</p>
                        )}
                        <p className={`text-[10px] ${form.returnRefundConditions.length > 1800 ? 'text-orange-500' : 'text-gray-500'}`}>
                          {form.returnRefundConditions.length}/2000
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-2">{t('returnWindow')}</label>
                        <input 
                          name="returnWindow"
                          value={form.returnWindow}
                          onChange={onChange}
                          onBlur={onBlur}
                          maxLength={100}
                          className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                            errors.returnWindow ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder={t('returnWindow')}
                        />
                        {errors.returnWindow && (
                          <p className="text-xs text-red-500 mt-1">{errors.returnWindow}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-2">{t('refundProcessingTime')}</label>
                        <input 
                          name="refundProcessingTime"
                          value={form.refundProcessingTime}
                          onChange={onChange}
                          onBlur={onBlur}
                          maxLength={100}
                          className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                            errors.refundProcessingTime ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder={t('refundProcessingTime')}
                        />
                        {errors.refundProcessingTime && (
                          <p className="text-xs text-red-500 mt-1">{errors.refundProcessingTime}</p>
                        )}
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
                      <textarea 
                        name="privacyPolicy"
                        value={form.privacyPolicy}
                        onChange={onChange}
                        onBlur={onBlur}
                        rows={4}
                        maxLength={2000}
                        className={`w-full border rounded-lg px-4 py-3 text-sm resize-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                          errors.privacyPolicy ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder={t('privacyPolicy')}
                      />
                      <div className="flex items-center justify-between mt-1">
                        {errors.privacyPolicy ? (
                          <p className="text-xs text-red-500">{errors.privacyPolicy}</p>
                        ) : (
                          <p className="text-[10px] text-gray-500">{t('maximum2000Characters') || 'Maximum 2000 characters'}</p>
                        )}
                        <p className={`text-[10px] ${form.privacyPolicy.length > 1800 ? 'text-orange-500' : 'text-gray-500'}`}>
                          {form.privacyPolicy.length}/2000
                        </p>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-2">{t('termsOfService')}</label>
                      <textarea 
                        name="termsOfService"
                        value={form.termsOfService}
                        onChange={onChange}
                        onBlur={onBlur}
                        rows={4}
                        maxLength={2000}
                        className={`w-full border rounded-lg px-4 py-3 text-sm resize-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                          errors.termsOfService ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder={t('termsOfService')}
                      />
                      <div className="flex items-center justify-between mt-1">
                        {errors.termsOfService ? (
                          <p className="text-xs text-red-500">{errors.termsOfService}</p>
                        ) : (
                          <p className="text-[10px] text-gray-500">{t('maximum2000Characters') || 'Maximum 2000 characters'}</p>
                        )}
                        <p className={`text-[10px] ${form.termsOfService.length > 1800 ? 'text-orange-500' : 'text-gray-500'}`}>
                          {form.termsOfService.length}/2000
                        </p>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-2">{t('customPolicies')}</label>
                      <textarea 
                        name="customPolicies"
                        value={form.customPolicies}
                        onChange={onChange}
                        onBlur={onBlur}
                        rows={4}
                        maxLength={2000}
                        className={`w-full border rounded-lg px-4 py-3 text-sm resize-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                          errors.customPolicies ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder={t('customPolicies')}
                      />
                      <div className="flex items-center justify-between mt-1">
                        {errors.customPolicies ? (
                          <p className="text-xs text-red-500">{errors.customPolicies}</p>
                        ) : (
                          <p className="text-[10px] text-gray-500">{t('maximum2000Characters') || 'Maximum 2000 characters'}</p>
                        )}
                        <p className={`text-[10px] ${form.customPolicies.length > 1800 ? 'text-orange-500' : 'text-gray-500'}`}>
                          {form.customPolicies.length}/2000
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex flex-col gap-2">
                    <button 
                      onClick={handlePreviewPolicies}
                      className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <Eye size={16} />
                      {t('previewPolicies')}
                    </button>
                    <p className="text-xs text-gray-500">{t('lastUpdated')}: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} at {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button onClick={onCancel} className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors">{t('cancel')}</button>
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
                  <textarea 
                    name="shippingTermsConditions"
                    value={form.shippingTermsConditions}
                    onChange={onChange}
                    onBlur={onBlur}
                    rows={5}
                    maxLength={2000}
                    className={`w-full border rounded-lg px-3 py-2 text-sm resize-none ${
                      errors.shippingTermsConditions ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder={t('shippingTermsConditions')}
                  />
                  <div className="flex items-center justify-between mt-1">
                    {errors.shippingTermsConditions ? (
                      <p className="text-xs text-red-500">{errors.shippingTermsConditions}</p>
                    ) : (
                      <p className="text-[10px] text-gray-500">{t('maximum2000Characters') || 'Maximum 2000 characters'}</p>
                    )}
                    <p className={`text-[10px] ${form.shippingTermsConditions.length > 1800 ? 'text-orange-500' : 'text-gray-500'}`}>
                      {form.shippingTermsConditions.length}/2000
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">{t('standardDeliveryTime')}</label>
                    <input 
                      name="standardDeliveryTime"
                      value={form.standardDeliveryTime}
                      onChange={onChange}
                      onBlur={onBlur}
                      maxLength={100}
                      className={`w-full border rounded-lg px-3 py-2 text-sm ${
                        errors.standardDeliveryTime ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder={t('standardDeliveryTime')}
                    />
                    {errors.standardDeliveryTime && (
                      <p className="text-xs text-red-500 mt-1">{errors.standardDeliveryTime}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">{t('freeShippingThreshold')}</label>
                    <input 
                      name="freeShippingThreshold"
                      value={form.freeShippingThreshold}
                      onChange={onChange}
                      onBlur={onBlur}
                      maxLength={50}
                      className={`w-full border rounded-lg px-3 py-2 text-sm ${
                        errors.freeShippingThreshold ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder={t('freeShippingThreshold')}
                    />
                    {errors.freeShippingThreshold && (
                      <p className="text-xs text-red-500 mt-1">{errors.freeShippingThreshold}</p>
                    )}
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
                  <textarea 
                    name="returnRefundConditions"
                    value={form.returnRefundConditions}
                    onChange={onChange}
                    onBlur={onBlur}
                    rows={5}
                    maxLength={2000}
                    className={`w-full border rounded-lg px-3 py-2 text-sm resize-none ${
                      errors.returnRefundConditions ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder={t('returnRefundConditions')}
                  />
                  <div className="flex items-center justify-between mt-1">
                    {errors.returnRefundConditions ? (
                      <p className="text-xs text-red-500">{errors.returnRefundConditions}</p>
                    ) : (
                      <p className="text-[10px] text-gray-500">{t('maximum2000Characters') || 'Maximum 2000 characters'}</p>
                    )}
                    <p className={`text-[10px] ${form.returnRefundConditions.length > 1800 ? 'text-orange-500' : 'text-gray-500'}`}>
                      {form.returnRefundConditions.length}/2000
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">{t('returnWindow')}</label>
                    <input 
                      name="returnWindow"
                      value={form.returnWindow}
                      onChange={onChange}
                      onBlur={onBlur}
                      maxLength={100}
                      className={`w-full border rounded-lg px-3 py-2 text-sm ${
                        errors.returnWindow ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder={t('returnWindow')}
                    />
                    {errors.returnWindow && (
                      <p className="text-xs text-red-500 mt-1">{errors.returnWindow}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">{t('refundProcessingTime')}</label>
                    <input 
                      name="refundProcessingTime"
                      value={form.refundProcessingTime}
                      onChange={onChange}
                      onBlur={onBlur}
                      maxLength={100}
                      className={`w-full border rounded-lg px-3 py-2 text-sm ${
                        errors.refundProcessingTime ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder={t('refundProcessingTime')}
                    />
                    {errors.refundProcessingTime && (
                      <p className="text-xs text-red-500 mt-1">{errors.refundProcessingTime}</p>
                    )}
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
                  <textarea 
                    name="privacyPolicy"
                    value={form.privacyPolicy}
                    onChange={onChange}
                    onBlur={onBlur}
                    rows={4}
                    maxLength={2000}
                    className={`w-full border rounded-lg px-3 py-2 text-sm resize-none ${
                      errors.privacyPolicy ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder={t('privacyPolicy')}
                  />
                  <div className="flex items-center justify-between mt-1">
                    {errors.privacyPolicy ? (
                      <p className="text-xs text-red-500">{errors.privacyPolicy}</p>
                    ) : (
                      <p className="text-[10px] text-gray-500">{t('maximum2000Characters') || 'Maximum 2000 characters'}</p>
                    )}
                    <p className={`text-[10px] ${form.privacyPolicy.length > 1800 ? 'text-orange-500' : 'text-gray-500'}`}>
                      {form.privacyPolicy.length}/2000
                    </p>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">{t('termsOfService')}</label>
                  <textarea 
                    name="termsOfService"
                    value={form.termsOfService}
                    onChange={onChange}
                    onBlur={onBlur}
                    rows={4}
                    maxLength={2000}
                    className={`w-full border rounded-lg px-3 py-2 text-sm resize-none ${
                      errors.termsOfService ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder={t('termsOfService')}
                  />
                  <div className="flex items-center justify-between mt-1">
                    {errors.termsOfService ? (
                      <p className="text-xs text-red-500">{errors.termsOfService}</p>
                    ) : (
                      <p className="text-[10px] text-gray-500">{t('maximum2000Characters') || 'Maximum 2000 characters'}</p>
                    )}
                    <p className={`text-[10px] ${form.termsOfService.length > 1800 ? 'text-orange-500' : 'text-gray-500'}`}>
                      {form.termsOfService.length}/2000
                    </p>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">{t('customPolicies')}</label>
                  <textarea 
                    name="customPolicies"
                    value={form.customPolicies}
                    onChange={onChange}
                    onBlur={onBlur}
                    rows={4}
                    maxLength={2000}
                    className={`w-full border rounded-lg px-3 py-2 text-sm resize-none ${
                      errors.customPolicies ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder={t('customPolicies')}
                  />
                  <div className="flex items-center justify-between mt-1">
                    {errors.customPolicies ? (
                      <p className="text-xs text-red-500">{errors.customPolicies}</p>
                    ) : (
                      <p className="text-[10px] text-gray-500">{t('maximum2000Characters') || 'Maximum 2000 characters'}</p>
                    )}
                    <p className={`text-[10px] ${form.customPolicies.length > 1800 ? 'text-orange-500' : 'text-gray-500'}`}>
                      {form.customPolicies.length}/2000
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-6 flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <button 
                  onClick={handlePreviewPolicies}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors w-fit"
                >
                  <Eye size={16} />
                  {t('previewPolicies')}
                </button>
                <p className="text-xs text-gray-500">{t('lastUpdated')}: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} at {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</p>
              </div>
              <div className="flex items-center gap-3 justify-end">
                <button onClick={onCancel} className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors">{t('cancel')}</button>
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
        </main>
      </div>

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        message={t('settingsSavedSuccessfully') || 'Policies saved successfully!'}
      />

      {/* Preview Policies Modal */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowPreviewModal(false)} />
          <div className="relative bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{t('previewPolicies') || 'Preview Policies'}</h3>
                <p className="text-sm text-gray-500 mt-1">{t('previewPoliciesDescription') || 'Preview how your policies will appear to customers'}</p>
              </div>
              <button 
                onClick={() => setShowPreviewModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label={t('close') || 'Close'}
                title={t('close') || 'Close'}
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Shipping Policy */}
              {form.shippingTermsConditions || form.standardDeliveryTime || form.freeShippingThreshold ? (
                <div className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-start gap-3 mb-4">
                    <Package className="w-6 h-6 text-blue-600 mt-0.5 flex-shrink-0" />
                    <h4 className="text-lg font-bold text-gray-900">{t('shippingPolicy') || 'Shipping Policy'}</h4>
                  </div>
                  {form.shippingTermsConditions && (
                    <div className="mb-4">
                      <h5 className="text-sm font-semibold text-gray-700 mb-2">{t('shippingTermsConditions') || 'Shipping Terms & Conditions'}</h5>
                      <p className="text-sm text-gray-600 whitespace-pre-wrap">{form.shippingTermsConditions || t('notSet') || 'Not set'}</p>
                    </div>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {form.standardDeliveryTime && (
                      <div>
                        <h5 className="text-sm font-semibold text-gray-700 mb-1">{t('standardDeliveryTime') || 'Standard Delivery Time'}</h5>
                        <p className="text-sm text-gray-600">{form.standardDeliveryTime}</p>
                      </div>
                    )}
                    {form.freeShippingThreshold && (
                      <div>
                        <h5 className="text-sm font-semibold text-gray-700 mb-1">{t('freeShippingThreshold') || 'Free Shipping Threshold'}</h5>
                        <p className="text-sm text-gray-600">{form.freeShippingThreshold}</p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="border border-gray-200 rounded-lg p-6 text-center text-gray-500">
                  <Package className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm">{t('shippingPolicy') || 'Shipping Policy'} - {t('notSet') || 'Not set'}</p>
                </div>
              )}

              {/* Refund & Return Policy */}
              {form.returnRefundConditions || form.returnWindow || form.refundProcessingTime ? (
                <div className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-start gap-3 mb-4">
                    <RefreshCw className="w-6 h-6 text-green-600 mt-0.5 flex-shrink-0" />
                    <h4 className="text-lg font-bold text-gray-900">{t('refundReturnPolicy') || 'Refund & Return Policy'}</h4>
                  </div>
                  {form.returnRefundConditions && (
                    <div className="mb-4">
                      <h5 className="text-sm font-semibold text-gray-700 mb-2">{t('returnRefundConditions') || 'Return & Refund Conditions'}</h5>
                      <p className="text-sm text-gray-600 whitespace-pre-wrap">{form.returnRefundConditions}</p>
                    </div>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {form.returnWindow && (
                      <div>
                        <h5 className="text-sm font-semibold text-gray-700 mb-1">{t('returnWindow') || 'Return Window'}</h5>
                        <p className="text-sm text-gray-600">{form.returnWindow}</p>
                      </div>
                    )}
                    {form.refundProcessingTime && (
                      <div>
                        <h5 className="text-sm font-semibold text-gray-700 mb-1">{t('refundProcessingTime') || 'Refund Processing Time'}</h5>
                        <p className="text-sm text-gray-600">{form.refundProcessingTime}</p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="border border-gray-200 rounded-lg p-6 text-center text-gray-500">
                  <RefreshCw className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm">{t('refundReturnPolicy') || 'Refund & Return Policy'} - {t('notSet') || 'Not set'}</p>
                </div>
              )}

              {/* Privacy Policy */}
              {form.privacyPolicy ? (
                <div className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-start gap-3 mb-4">
                    <Shield className="w-6 h-6 text-purple-600 mt-0.5 flex-shrink-0" />
                    <h4 className="text-lg font-bold text-gray-900">{t('privacyPolicy') || 'Privacy Policy'}</h4>
                  </div>
                  <p className="text-sm text-gray-600 whitespace-pre-wrap">{form.privacyPolicy}</p>
                </div>
              ) : (
                <div className="border border-gray-200 rounded-lg p-6 text-center text-gray-500">
                  <Shield className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm">{t('privacyPolicy') || 'Privacy Policy'} - {t('notSet') || 'Not set'}</p>
                </div>
              )}

              {/* Terms of Service */}
              {form.termsOfService ? (
                <div className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-start gap-3 mb-4">
                    <Shield className="w-6 h-6 text-purple-600 mt-0.5 flex-shrink-0" />
                    <h4 className="text-lg font-bold text-gray-900">{t('termsOfService') || 'Terms of Service'}</h4>
                  </div>
                  <p className="text-sm text-gray-600 whitespace-pre-wrap">{form.termsOfService}</p>
                </div>
              ) : (
                <div className="border border-gray-200 rounded-lg p-6 text-center text-gray-500">
                  <Shield className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm">{t('termsOfService') || 'Terms of Service'} - {t('notSet') || 'Not set'}</p>
                </div>
              )}

              {/* Custom Policies */}
              {form.customPolicies && (
                <div className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-start gap-3 mb-4">
                    <Shield className="w-6 h-6 text-purple-600 mt-0.5 flex-shrink-0" />
                    <h4 className="text-lg font-bold text-gray-900">{t('customPolicies') || 'Custom Policies'}</h4>
                  </div>
                  <p className="text-sm text-gray-600 whitespace-pre-wrap">{form.customPolicies}</p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowPreviewModal(false)}
                className="px-6 py-2 text-sm font-medium rounded-lg bg-orange-500 text-white hover:bg-orange-600 transition-colors"
              >
                {t('close') || 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


