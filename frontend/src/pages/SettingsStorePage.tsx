import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'
import { useState, useRef } from 'react'
import { Menu, HelpCircle, Upload, Image as ImageIcon, Save, ShoppingBag, FileText, Share2, Facebook, Instagram, Linkedin, Music2, Palette, X } from 'lucide-react'
import TabsBar from '@/components/ui/TabsBar'
import { useLanguage } from '@/contexts/LanguageContext'
import { ButtonLoader } from '@/components/ui/Loader'
import SuccessModal from '@/components/ui/SuccessModal'
import ConfirmModal from '@/components/ui/ConfirmModal'

export default function SettingsStorePage() {
  const { t } = useLanguage()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [saving, setSaving] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showHelpModal, setShowHelpModal] = useState(false)

  const logoInputRef = useRef<HTMLInputElement>(null)
  const bannerInputRef = useRef<HTMLInputElement>(null)

  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [bannerPreview, setBannerPreview] = useState<string | null>(null)

  const [form, setForm] = useState({
    storeName: '',
    contactEmail: '',
    contactPhone: '',
    about: '',
    address: '',
    facebook: '',
    instagram: '',
    linkedin: '',
    tiktok: ''
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  // Validation functions
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validateURL = (url: string): boolean => {
    if (!url) return true // Optional field
    try {
      // Auto-add http:// if protocol is missing
      let urlToValidate = url.trim()
      if (!urlToValidate.startsWith('http://') && !urlToValidate.startsWith('https://')) {
        urlToValidate = 'https://' + urlToValidate
      }
      new URL(urlToValidate)
      return true
    } catch {
      return false
    }
  }

  const validatePhone = (phone: string): boolean => {
    if (!phone.trim()) return true // Optional field, but if provided must be valid
    // Remove all spaces, dashes, parentheses, and dots
    const cleaned = phone.replace(/[\s\-\(\)\.]/g, '')
    // Must start with + or digit, and contain only digits after that
    // Minimum 7 digits, maximum 15 digits (international standard)
    const phoneRegex = /^\+?[1-9]\d{6,14}$/
    return phoneRegex.test(cleaned)
  }

  const validateField = (name: string, value: string): string => {
    switch (name) {
      case 'storeName':
        if (!value.trim()) {
          return t('storeNameRequired') || 'Store name is required'
        }
        if (value.trim().length < 3) {
          return t('storeNameMinLength') || 'Store name must be at least 3 characters'
        }
        if (value.trim().length > 100) {
          return t('storeNameMaxLength') || 'Store name must be less than 100 characters'
        }
        return ''

      case 'contactEmail':
        if (!value.trim()) {
          return t('contactEmailRequired') || 'Contact email is required'
        }
        if (!validateEmail(value.trim())) {
          return t('invalidEmail') || 'Please enter a valid email address'
        }
        return ''

      case 'contactPhone':
        if (value.trim() && !validatePhone(value)) {
          return t('invalidPhone') || 'Please enter a valid phone number (7-15 digits, may include country code)'
        }
        return ''

      case 'about':
        if (value.length > 500) {
          return t('descriptionMaxLength') || 'Description must be less than 500 characters'
        }
        return ''

      case 'address':
        if (value.length > 200) {
          return t('addressMaxLength') || 'Address must be less than 200 characters'
        }
        return ''

      case 'facebook':
      case 'instagram':
      case 'linkedin':
      case 'tiktok':
        if (value.trim() && !validateURL(value.trim())) {
          return t('invalidURL') || 'Please enter a valid URL (e.g., https://facebook.com/yourstore)'
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

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, logo: t('invalidImageType') || 'Please upload an image file' }))
        if (logoInputRef.current) logoInputRef.current.value = ''
        return
      }
      
      // Validate file size (1MB limit)
      if (file.size > 1024 * 1024) {
        setErrors(prev => ({ ...prev, logo: t('fileTooLarge') || 'File size must be less than 1MB' }))
        if (logoInputRef.current) logoInputRef.current.value = ''
        return
      }
      
      // Clear any previous errors
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors.logo
        return newErrors
      })
      
      const reader = new FileReader()
      reader.onloadend = () => {
        setLogoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, banner: t('invalidImageType') || 'Please upload an image file' }))
        if (bannerInputRef.current) bannerInputRef.current.value = ''
        return
      }
      
      // Validate file size (2MB limit for banner)
      if (file.size > 2 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, banner: t('fileTooLarge') || 'File size must be less than 2MB' }))
        if (bannerInputRef.current) bannerInputRef.current.value = ''
        return
      }
      
      // Clear any previous errors
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors.banner
        return newErrors
      })
      
      const reader = new FileReader()
      reader.onloadend = () => {
        setBannerPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeLogo = () => {
    setLogoPreview(null)
    if (logoInputRef.current) {
      logoInputRef.current.value = ''
    }
  }

  const removeBanner = () => {
    setBannerPreview(null)
    if (bannerInputRef.current) {
      bannerInputRef.current.value = ''
    }
  }

  const onSave = async () => {
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
    await new Promise(r => setTimeout(r, 800))
    setSaving(false)
    setShowSuccessModal(true)
    setTimeout(() => setShowSuccessModal(false), 2000)
  }

  const onCancel = () => {
    // Reset form to original values (in real app, fetch from API)
    setForm({
      storeName: '',
      contactEmail: '',
      contactPhone: '',
      about: '',
      address: '',
      facebook: '',
      instagram: '',
      linkedin: '',
      tiktok: ''
    })
    setLogoPreview(null)
    setBannerPreview(null)
    setErrors({})
    setTouched({})
    if (logoInputRef.current) logoInputRef.current.value = ''
    if (bannerInputRef.current) bannerInputRef.current.value = ''
  }

  const isFormValid = (): boolean => {
    return Object.keys(form).every(key => {
      const error = validateField(key, form[key as keyof typeof form])
      return !error
    })
  }

  const onDeleteStore = () => {
    setShowDeleteConfirm(true)
  }

  const confirmDelete = async () => {
    // Simulate API call
    await new Promise(r => setTimeout(r, 500))
    setShowDeleteConfirm(false)
    alert(t('storeDeleted') || 'Store has been deleted successfully')
    // In real app, redirect to dashboard or another page
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Layout */}
      <div className="hidden lg:flex h-screen overflow-hidden">
        {!sidebarCollapsed && (
          <div className="w-64 flex-shrink-0 bg-primary-500 h-screen overflow-y-auto">
            <Sidebar onClose={() => setSidebarCollapsed(true)} currentPage="settingsStore" />
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
              {/* Page header */}
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('storeSetting')}</h1>
                <p className="text-sm text-gray-600">{t('dashboard')} • {t('storeSetting')}</p>
              </div>

              {/* Tabs */}
              <div className="mb-6">
                <TabsBar
                  tabs={[
                    { label: t('storeSettings'), href: '/settings/store', active: true },
                    { label: t('policySettings'), href: '/settings/policy' },
                    { label: t('notifications'), href: '/settings/notifications' },
                  ]}
                  variant="underline"
                />
              </div>

              {/* Section Header */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
                <div className="flex items-start justify-between px-6 py-6 border-b border-gray-200">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('storeSettings')}</h2>
                    <p className="text-sm text-gray-600">{t('customizeStorefront')}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setShowHelpModal(true)}
                      className="inline-flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900 transition-colors"
                      type="button"
                    >
                      <HelpCircle size={18} />
                      {t('help')}
                    </button>
                  </div>
                </div>
              </div>

              {/* Store Branding */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
                    <div className="px-6 py-4 border-b border-gray-200 bg-white">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Palette className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 mb-1">{t('storeBranding')}</h3>
                          <p className="text-sm text-gray-600">{t('uploadStoreLogoBanner')}</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Store Logo */}
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">{t('storeLogo')}</label>
                        {errors.logo && (
                          <p className="text-xs text-red-500 mb-2">{errors.logo}</p>
                        )}
                        {logoPreview ? (
                          <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-4">
                            <img src={logoPreview} alt="Store Logo" className="w-full h-32 object-contain rounded" />
                            <button
                              onClick={removeLogo}
                              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                              type="button"
                              aria-label={t('removeLogo') || 'Remove logo'}
                              title={t('removeLogo') || 'Remove logo'}
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ) : (
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center cursor-pointer hover:bg-gray-50 transition-colors"
                               onClick={() => logoInputRef.current?.click()}>
                            <div className="w-16 h-16 bg-gray-100 rounded-lg mx-auto mb-3 flex items-center justify-center shadow-sm">
                              <ImageIcon className="text-gray-400" size={32} />
                            </div>
                            <p className="text-xs text-gray-600 mt-2">{t('clickToUpload')}</p>
                            <p className="text-[10px] text-gray-500 mt-1">{t('pngJpgUpTo1MB')}</p>
                            <input ref={logoInputRef} type="file" accept="image/*" className="hidden" title={t('storeLogo')} onChange={handleLogoUpload} />
                          </div>
                        )}
                      </div>
                      {/* Store Banner */}
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">{t('storeBanner')}</label>
                        {errors.banner && (
                          <p className="text-xs text-red-500 mb-2">{errors.banner}</p>
                        )}
                        {bannerPreview ? (
                          <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-4">
                            <img src={bannerPreview} alt="Store Banner" className="w-full h-32 object-cover rounded" />
                            <button
                              onClick={removeBanner}
                              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                              type="button"
                              aria-label={t('removeBanner') || 'Remove banner'}
                              title={t('removeBanner') || 'Remove banner'}
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ) : (
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center cursor-pointer hover:bg-gray-50 transition-colors"
                               onClick={() => bannerInputRef.current?.click()}>
                            <div className="w-16 h-16 bg-gray-100 rounded-lg mx-auto mb-3 flex items-center justify-center shadow-sm">
                              <ImageIcon className="text-gray-400" size={32} />
                            </div>
                            <p className="text-xs text-gray-600 mt-2">{t('clickToUpload')}</p>
                            <p className="text-[10px] text-gray-500 mt-1">{t('pngJpgUpTo1MBBanner')}</p>
                            <input ref={bannerInputRef} type="file" accept="image/*" className="hidden" title={t('storeBanner')} onChange={handleBannerUpload} />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

              {/* Store Information */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
                <div className="px-6 py-4 border-b border-gray-200 bg-white">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-1">{t('storeInformation')}</h3>
                      <p className="text-sm text-gray-600">{t('provideEssentialDetails')}</p>
                    </div>
                  </div>
                </div>
                <div className="p-6 space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-2">
                        {t('storeNameRequired')}
                        <span className="text-red-500 ml-1">*</span>
                      </label>
                      <input 
                        name="storeName" 
                        value={form.storeName} 
                        onChange={onChange}
                        onBlur={onBlur}
                        className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                          errors.storeName ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder={t('enterStoreName')}
                      />
                      {errors.storeName && (
                        <p className="text-xs text-red-500 mt-1">{errors.storeName}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-2">
                        {t('contactEmailRequired')}
                        <span className="text-red-500 ml-1">*</span>
                      </label>
                      <input 
                        name="contactEmail" 
                        type="email" 
                        value={form.contactEmail} 
                        onChange={onChange}
                        onBlur={onBlur}
                        className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                          errors.contactEmail ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="store@example.com"
                      />
                      {errors.contactEmail && (
                        <p className="text-xs text-red-500 mt-1">{errors.contactEmail}</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">{t('contactPhone')}</label>
                    <input 
                      name="contactPhone" 
                      value={form.contactPhone} 
                      onChange={onChange}
                      onBlur={onBlur}
                      className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                        errors.contactPhone ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="+1 (555) 123-4567"
                    />
                    {errors.contactPhone && (
                      <p className="text-xs text-red-500 mt-1">{errors.contactPhone}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">{t('storeDescription')}</label>
                    <textarea 
                      name="about" 
                      value={form.about} 
                      onChange={onChange}
                      onBlur={onBlur}
                      rows={4} 
                      className={`w-full border rounded-lg px-4 py-2.5 text-sm resize-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                        errors.about ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder={t('tellCustomersAboutStore')}
                      maxLength={500}
                    />
                    <div className="flex items-center justify-between mt-1">
                      {errors.about ? (
                        <p className="text-xs text-red-500">{errors.about}</p>
                      ) : (
                        <p className="text-[10px] text-gray-500">{t('maximum500Characters')}</p>
                      )}
                      <p className={`text-[10px] ${form.about.length > 450 ? 'text-orange-500' : 'text-gray-500'}`}>
                        {form.about.length}/500
                      </p>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">{t('storeAddress')}</label>
                    <textarea 
                      name="address" 
                      value={form.address} 
                      onChange={onChange}
                      onBlur={onBlur}
                      rows={2} 
                      className={`w-full border rounded-lg px-4 py-2.5 text-sm resize-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                        errors.address ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder={t('enterCompleteAddress')}
                    />
                    {errors.address && (
                      <p className="text-xs text-red-500 mt-1">{errors.address}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Social Media Links */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
                <div className="px-6 py-4 border-b border-gray-200 bg-white">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Share2 className="w-5 h-5 text-pink-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-1">{t('socialMediaLinks')}</h3>
                      <p className="text-sm text-gray-600">{t('connectSocialMedia')}</p>
                    </div>
                  </div>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">Facebook</label>
                    <div className="relative">
                      <Facebook className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-600" size={18} />
                      <input 
                        name="facebook" 
                        value={form.facebook} 
                        onChange={onChange}
                        onBlur={onBlur}
                        className={`w-full border rounded-lg pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                          errors.facebook ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="https://facebook.com/yourstore"
                      />
                    </div>
                    {errors.facebook && (
                      <p className="text-xs text-red-500 mt-1">{errors.facebook}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">Instagram</label>
                    <div className="relative">
                      <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 text-pink-600" size={18} />
                      <input 
                        name="instagram" 
                        value={form.instagram} 
                        onChange={onChange}
                        onBlur={onBlur}
                        className={`w-full border rounded-lg pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                          errors.instagram ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="https://instagram.com/yourstore"
                      />
                    </div>
                    {errors.instagram && (
                      <p className="text-xs text-red-500 mt-1">{errors.instagram}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">LinkedIn</label>
                    <div className="relative">
                      <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-700" size={18} />
                      <input 
                        name="linkedin" 
                        value={form.linkedin} 
                        onChange={onChange}
                        onBlur={onBlur}
                        className={`w-full border rounded-lg pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                          errors.linkedin ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="https://linkedin.com/company/yourstore"
                      />
                    </div>
                    {errors.linkedin && (
                      <p className="text-xs text-red-500 mt-1">{errors.linkedin}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">TikTok</label>
                    <div className="relative">
                      <Music2 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-900" size={18} />
                      <input 
                        name="tiktok" 
                        value={form.tiktok} 
                        onChange={onChange}
                        onBlur={onBlur}
                        className={`w-full border rounded-lg pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                          errors.tiktok ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="https://tiktok.com/@yourstore"
                      />
                    </div>
                    {errors.tiktok && (
                      <p className="text-xs text-red-500 mt-1">{errors.tiktok}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Footer actions */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <span className="w-2 h-2 rounded-full bg-gray-400"></span>
                  <span>{t('changesAutoSaved')}</span>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={onCancel} className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">{t('cancel')}</button>
                  <button onClick={onSave} disabled={saving} className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-primary-500 text-white hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                    {saving ? <ButtonLoader size="sm" /> : <Save size={16} />}
                    {saving ? t('saving') : t('saveChanges')}
                  </button>
                </div>
              </div>

              {/* Danger zone */}
              <div className="flex justify-end mb-6">
                <button onClick={onDeleteStore} className="px-4 py-2 text-sm font-medium text-red-700 border border-red-200 rounded-lg bg-red-50 hover:bg-red-100 transition-colors">
                  {t('deleteMyStore')}
                </button>
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
              <Sidebar onClose={() => setSidebarOpen(false)} currentPage="settingsStore" />
            </div>
          </div>
        )}

        <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
          <Header onToggleSidebar={() => setSidebarOpen(true)} isSidebarOpen={sidebarOpen} />
        </div>
        <main className="p-4 space-y-4">
          {/* Page header */}
          <div className="mb-4">
            <h1 className="text-xl font-bold text-gray-900">{t('storeSetting')}</h1>
            <p className="text-xs text-gray-500 mt-1">{t('dashboard')} - {t('storeSetting')}</p>
          </div>

          {/* Tabs - mobile */}
          <div>
            <TabsBar
              tabs={[
                { label: t('storeSettings'), href: '/settings/store', active: true },
                { label: t('policySettings'), href: '/settings/policy' },
                { label: t('notifications'), href: '/settings/notifications' },
              ]}
              variant="underline"
            />
          </div>

          {/* Section Header */}
          <div className="mt-4 mb-3">
            <h2 className="text-base font-bold text-gray-900 mb-1">{t('storeSettings')}</h2>
            <p className="text-xs text-gray-600">{t('customizeStorefront')}</p>
          </div>

          {/* Store Branding */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-4 py-3 border-b border-gray-200">
              <div className="flex items-center gap-2 mb-1">
                <ShoppingBag className="w-4 h-4 text-primary-500" />
                <h2 className="text-sm font-semibold text-gray-900">{t('storeBranding')}</h2>
              </div>
              <p className="text-xs text-gray-600 ml-6">{t('uploadStoreLogoBanner')}</p>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">{t('storeLogo')}</label>
                {errors.logo && (
                  <p className="text-xs text-red-500 mb-2">{errors.logo}</p>
                )}
                {logoPreview ? (
                  <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-4">
                    <img src={logoPreview} alt="Store Logo" className="w-full h-24 object-contain rounded" />
                    <button
                      onClick={removeLogo}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                      type="button"
                      aria-label={t('removeLogo') || 'Remove logo'}
                      title={t('removeLogo') || 'Remove logo'}
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => logoInputRef.current?.click()}>
                    <Upload className="mx-auto text-gray-400 mb-2" size={24} />
                    <p className="text-xs text-gray-600 mt-2">{t('clickToUpload')}</p>
                    <p className="text-[10px] text-gray-500 mt-1">{t('pngJpgUpTo1MB')}</p>
                    <input ref={logoInputRef} type="file" accept="image/*" className="hidden" title={t('storeLogo')} onChange={handleLogoUpload} />
                  </div>
                )}
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">{t('storeBanner')}</label>
                {errors.banner && (
                  <p className="text-xs text-red-500 mb-2">{errors.banner}</p>
                )}
                {bannerPreview ? (
                  <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-4">
                    <img src={bannerPreview} alt="Store Banner" className="w-full h-24 object-cover rounded" />
                    <button
                      onClick={removeBanner}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                      type="button"
                      aria-label={t('removeBanner') || 'Remove banner'}
                      title={t('removeBanner') || 'Remove banner'}
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => bannerInputRef.current?.click()}>
                    <ImageIcon className="mx-auto text-gray-400 mb-2" size={24} />
                    <p className="text-xs text-gray-600 mt-2">{t('clickToUpload')}</p>
                    <p className="text-[10px] text-gray-500 mt-1">{t('pngJpgUpTo1MBBanner')}</p>
                    <input ref={bannerInputRef} type="file" accept="image/*" className="hidden" title={t('storeBanner')} onChange={handleBannerUpload} />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Store Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-4 py-3 border-b border-gray-200">
              <div className="flex items-center gap-2 mb-1">
                <FileText className="w-4 h-4 text-primary-500" />
                <h2 className="text-sm font-semibold text-gray-900">{t('storeInformation')}</h2>
              </div>
              <p className="text-xs text-gray-600 ml-6">{t('provideEssentialDetails')}</p>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  {t('storeNameRequired')}
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input 
                  name="storeName" 
                  value={form.storeName} 
                  onChange={onChange}
                  onBlur={onBlur}
                  className={`w-full border rounded-lg px-3 py-2 text-sm ${
                    errors.storeName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder={t('enterStoreName')}
                />
                {errors.storeName && (
                  <p className="text-xs text-red-500 mt-1">{errors.storeName}</p>
                )}
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  {t('contactEmailRequired')}
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input 
                  name="contactEmail" 
                  type="email" 
                  value={form.contactEmail} 
                  onChange={onChange}
                  onBlur={onBlur}
                  className={`w-full border rounded-lg px-3 py-2 text-sm ${
                    errors.contactEmail ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="store@example.com"
                />
                {errors.contactEmail && (
                  <p className="text-xs text-red-500 mt-1">{errors.contactEmail}</p>
                )}
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">{t('contactPhone')}</label>
                <input 
                  name="contactPhone" 
                  value={form.contactPhone} 
                  onChange={onChange}
                  onBlur={onBlur}
                  className={`w-full border rounded-lg px-3 py-2 text-sm ${
                    errors.contactPhone ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="+1 (555) 123-4567"
                />
                {errors.contactPhone && (
                  <p className="text-xs text-red-500 mt-1">{errors.contactPhone}</p>
                )}
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">{t('storeDescription')}</label>
                <textarea 
                  name="about" 
                  value={form.about} 
                  onChange={onChange}
                  onBlur={onBlur}
                  rows={4} 
                  className={`w-full border rounded-lg px-3 py-2 text-sm resize-none ${
                    errors.about ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder={t('tellCustomersAboutStore')}
                  maxLength={500}
                />
                <div className="flex items-center justify-between mt-1">
                  {errors.about ? (
                    <p className="text-xs text-red-500">{errors.about}</p>
                  ) : (
                    <p className="text-[10px] text-gray-500">{t('maximum500Characters')}</p>
                  )}
                  <p className={`text-[10px] ${form.about.length > 450 ? 'text-orange-500' : 'text-gray-500'}`}>
                    {form.about.length}/500
                  </p>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">{t('storeAddress')}</label>
                <textarea 
                  name="address" 
                  value={form.address} 
                  onChange={onChange}
                  onBlur={onBlur}
                  rows={2} 
                  className={`w-full border rounded-lg px-3 py-2 text-sm resize-none ${
                    errors.address ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder={t('enterCompleteAddress')}
                />
                {errors.address && (
                  <p className="text-xs text-red-500 mt-1">{errors.address}</p>
                )}
              </div>
            </div>
          </div>

          {/* Social Media Links */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-4 py-3 border-b border-gray-200">
              <div className="flex items-center gap-2 mb-1">
                <Share2 className="w-4 h-4 text-pink-500" />
                <h2 className="text-sm font-semibold text-gray-900">{t('socialMediaLinks')}</h2>
              </div>
              <p className="text-xs text-gray-600 ml-6">{t('connectSocialMedia')}</p>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">Facebook</label>
                <div className="relative">
                  <Facebook className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-600" size={18} />
                  <input 
                    name="facebook" 
                    value={form.facebook} 
                    onChange={onChange}
                    onBlur={onBlur}
                    className={`w-full border rounded-lg pl-10 pr-3 py-2 text-sm ${
                      errors.facebook ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="https://facebook.com/yourstore"
                  />
                </div>
                {errors.facebook && (
                  <p className="text-xs text-red-500 mt-1">{errors.facebook}</p>
                )}
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">Instagram</label>
                <div className="relative">
                  <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 text-pink-600" size={18} />
                  <input 
                    name="instagram" 
                    value={form.instagram} 
                    onChange={onChange}
                    onBlur={onBlur}
                    className={`w-full border rounded-lg pl-10 pr-3 py-2 text-sm ${
                      errors.instagram ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="https://instagram.com/yourstore"
                  />
                </div>
                {errors.instagram && (
                  <p className="text-xs text-red-500 mt-1">{errors.instagram}</p>
                )}
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">LinkedIn</label>
                <div className="relative">
                  <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-700" size={18} />
                  <input 
                    name="linkedin" 
                    value={form.linkedin} 
                    onChange={onChange}
                    onBlur={onBlur}
                    className={`w-full border rounded-lg pl-10 pr-3 py-2 text-sm ${
                      errors.linkedin ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="https://linkedin.com/company/yourstore"
                  />
                </div>
                {errors.linkedin && (
                  <p className="text-xs text-red-500 mt-1">{errors.linkedin}</p>
                )}
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">TikTok</label>
                <div className="relative">
                  <Music2 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-900" size={18} />
                  <input 
                    name="tiktok" 
                    value={form.tiktok} 
                    onChange={onChange}
                    onBlur={onBlur}
                    className={`w-full border rounded-lg pl-10 pr-3 py-2 text-sm ${
                      errors.tiktok ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="https://tiktok.com/@yourstore"
                  />
                </div>
                {errors.tiktok && (
                  <p className="text-xs text-red-500 mt-1">{errors.tiktok}</p>
                )}
              </div>
            </div>
          </div>

          {/* Footer actions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex flex-col gap-3">
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <span className="w-2 h-2 rounded-full bg-gray-400"></span>
              <span>{t('changesAutoSaved')}</span>
            </div>
            <div className="flex items-center gap-3 justify-end">
              <button onClick={onCancel} className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">{t('cancel')}</button>
              <button onClick={onSave} disabled={saving} className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-orange-500 text-white hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                {saving ? <ButtonLoader size="sm" /> : <Save size={16} />}
                {saving ? t('saving') : t('saveChanges')}
              </button>
            </div>
          </div>

          {/* Danger zone */}
          <div className="flex justify-end mb-4">
            <button onClick={onDeleteStore} className="px-4 py-2 text-sm font-medium text-red-700 border border-red-200 rounded-lg bg-red-50 hover:bg-red-100 transition-colors">
              {t('deleteMyStore')}
            </button>
          </div>
        </main>
      </div>

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        message={t('settingsSavedSuccessfully') || 'Store settings saved successfully!'}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={confirmDelete}
        title={t('deleteStore') || 'Delete Store'}
        message={t('deleteStoreConfirm') || 'Are you sure you want to delete your store? This action cannot be undone.'}
        confirmText={t('delete') || 'Delete'}
        cancelText={t('cancel') || 'Cancel'}
        confirmButtonColor="red"
      />

      {/* Help Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowHelpModal(false)} />
          <div className="relative bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">{t('help') || 'Help'}</h3>
              <button 
                onClick={() => setShowHelpModal(false)} 
                className="text-gray-400 hover:text-gray-600"
                aria-label={t('close') || 'Close'}
                title={t('close') || 'Close'}
              >
                <X size={24} />
              </button>
            </div>
            <div className="space-y-3 text-gray-600">
              <p><strong>{t('storeBranding') || 'Store Branding'}:</strong> {t('uploadStoreLogoBanner') || 'Upload your store logo and banner image.'}</p>
              <p><strong>{t('storeInformation') || 'Store Information'}:</strong> {t('provideEssentialDetails') || 'Fill in your store details including name, contact information, and description.'}</p>
              <p><strong>{t('socialMediaLinks') || 'Social Media Links'}:</strong> {t('connectSocialMedia') || 'Add links to your social media profiles to help customers find you.'}</p>
              <p className="text-sm text-gray-500 mt-4">{t('changesAutoSaved') || 'Changes are automatically saved when you click Save Changes.'}</p>
            </div>
            <button
              onClick={() => setShowHelpModal(false)}
              className="mt-6 w-full px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
            >
              {t('gotIt') || 'Got it'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}


