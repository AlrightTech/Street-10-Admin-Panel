'use client'

import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'
import { useState, useRef } from 'react'
import { Menu, HelpCircle, Upload, Image as ImageIcon, Save, ShoppingBag, FileText, Share2, Facebook, Instagram, Linkedin, Music2, Palette } from 'lucide-react'
import TabsBar from '@/components/ui/TabsBar'
import { useLanguage } from '@/contexts/LanguageContext'

export default function StoreSettingsPage() {
  const { t } = useLanguage()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [saving, setSaving] = useState(false)
  const [autoSave, setAutoSave] = useState(true)

  const logoInputRef = useRef<HTMLInputElement>(null)
  const bannerInputRef = useRef<HTMLInputElement>(null)

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

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const onSave = async () => {
    setSaving(true)
    await new Promise(r => setTimeout(r, 800))
    setSaving(false)
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
                      className="inline-flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900 transition-colors"
                      type="button"
                    >
                      <HelpCircle size={18} />
                      {t('help')}
                    </button>
                    <button
                      onClick={onSave}
                      disabled={saving}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary-500 text-white hover:bg-primary-600 disabled:opacity-50 transition-colors font-medium"
                    >
                      <Save size={18} />
                      {saving ? t('saving') : t('saveChanges')}
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
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center cursor-pointer hover:bg-gray-50 transition-colors"
                             onClick={() => logoInputRef.current?.click()}>
                          <div className="w-16 h-16 bg-gray-100 rounded-lg mx-auto mb-3 flex items-center justify-center shadow-sm">
                            <ImageIcon className="text-gray-400" size={32} />
                          </div>
                          <p className="text-xs text-gray-600 mt-2">{t('clickToUpload')}</p>
                          <p className="text-[10px] text-gray-500 mt-1">{t('pngJpgUpTo1MB')}</p>
                          <input ref={logoInputRef} type="file" accept="image/*" className="hidden" title={t('storeLogo')} />
                        </div>
                      </div>
                      {/* Store Banner */}
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">{t('storeBanner')}</label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center cursor-pointer hover:bg-gray-50 transition-colors"
                             onClick={() => bannerInputRef.current?.click()}>
                          <div className="w-16 h-16 bg-gray-100 rounded-lg mx-auto mb-3 flex items-center justify-center shadow-sm">
                            <ImageIcon className="text-gray-400" size={32} />
                          </div>
                          <p className="text-xs text-gray-600 mt-2">{t('clickToUpload')}</p>
                          <p className="text-[10px] text-gray-500 mt-1">{t('pngJpgUpTo1MBBanner')}</p>
                          <input ref={bannerInputRef} type="file" accept="image/*" className="hidden" title={t('storeBanner')} />
                        </div>
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
                      <label className="block text-xs font-medium text-gray-700 mb-2">{t('storeNameRequired')}</label>
                      <input name="storeName" value={form.storeName} onChange={onChange} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent" placeholder={t('enterStoreName')} />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-2">{t('contactEmailRequired')}</label>
                      <input name="contactEmail" type="email" value={form.contactEmail} onChange={onChange} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent" placeholder="store@example.com" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">{t('contactPhone')}</label>
                    <input name="contactPhone" value={form.contactPhone} onChange={onChange} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent" placeholder="+1 (555) 123-4567" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">{t('storeDescription')}</label>
                    <textarea name="about" value={form.about} onChange={onChange} rows={4} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm resize-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" placeholder={t('tellCustomersAboutStore')} />
                    <p className="text-[10px] text-gray-500 mt-1">{t('maximum500Characters')}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">{t('storeAddress')}</label>
                    <textarea name="address" value={form.address} onChange={onChange} rows={2} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm resize-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" placeholder={t('enterCompleteAddress')} />
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
                      <input name="facebook" value={form.facebook} onChange={onChange} className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent" placeholder="https://facebook.com/yourstore" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">Instagram</label>
                    <div className="relative">
                      <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 text-pink-600" size={18} />
                      <input name="instagram" value={form.instagram} onChange={onChange} className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent" placeholder="https://instagram.com/yourstore" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">LinkedIn</label>
                    <div className="relative">
                      <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-700" size={18} />
                      <input name="linkedin" value={form.linkedin} onChange={onChange} className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent" placeholder="https://linkedin.com/company/yourstore" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">TikTok</label>
                    <div className="relative">
                      <Music2 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-900" size={18} />
                      <input name="tiktok" value={form.tiktok} onChange={onChange} className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent" placeholder="https://tiktok.com/@yourstore" />
                    </div>
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
                  <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">{t('cancel')}</button>
                  <button onClick={onSave} disabled={saving} className="px-4 py-2 text-sm font-medium rounded-lg bg-primary-500 text-white hover:bg-primary-600 disabled:opacity-50 transition-colors">
                    {saving ? t('saving') : t('saveChanges')}
                  </button>
                </div>
              </div>

              {/* Danger zone */}
              <div className="flex justify-end mb-6">
                <button className="px-4 py-2 text-sm font-medium text-red-700 border border-red-200 rounded-lg bg-red-50 hover:bg-red-100 transition-colors">
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
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => logoInputRef.current?.click()}>
                  <Upload className="mx-auto text-gray-400 mb-2" size={24} />
                  <p className="text-xs text-gray-600 mt-2">{t('clickToUpload')}</p>
                  <p className="text-[10px] text-gray-500 mt-1">{t('pngJpgUpTo1MB')}</p>
                  <input ref={logoInputRef} type="file" accept="image/*" className="hidden" title={t('storeLogo')} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">{t('storeBanner')}</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => bannerInputRef.current?.click()}>
                  <ImageIcon className="mx-auto text-gray-400 mb-2" size={24} />
                  <p className="text-xs text-gray-600 mt-2">{t('clickToUpload')}</p>
                  <p className="text-[10px] text-gray-500 mt-1">{t('pngJpgUpTo1MBBanner')}</p>
                  <input ref={bannerInputRef} type="file" accept="image/*" className="hidden" title={t('storeBanner')} />
                </div>
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
                <label className="block text-xs font-medium text-gray-700 mb-2">{t('storeNameRequired')}</label>
                <input name="storeName" value={form.storeName} onChange={onChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" placeholder={t('enterStoreName')} />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">{t('contactEmailRequired')}</label>
                <input name="contactEmail" type="email" value={form.contactEmail} onChange={onChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" placeholder="store@example.com" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">{t('contactPhone')}</label>
                <input name="contactPhone" value={form.contactPhone} onChange={onChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" placeholder="+1 (555) 123-4567" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">{t('storeDescription')}</label>
                <textarea name="about" value={form.about} onChange={onChange} rows={4} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none" placeholder={t('tellCustomersAboutStore')} />
                <p className="text-[10px] text-gray-500 mt-1">{t('maximum500Characters')}</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">{t('storeAddress')}</label>
                <textarea name="address" value={form.address} onChange={onChange} rows={2} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none" placeholder={t('enterCompleteAddress')} />
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
                  <input name="facebook" value={form.facebook} onChange={onChange} className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2 text-sm" placeholder="https://facebook.com/yourstore" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">Instagram</label>
                <div className="relative">
                  <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 text-pink-600" size={18} />
                  <input name="instagram" value={form.instagram} onChange={onChange} className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2 text-sm" placeholder="https://instagram.com/yourstore" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">LinkedIn</label>
                <div className="relative">
                  <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-700" size={18} />
                  <input name="linkedin" value={form.linkedin} onChange={onChange} className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2 text-sm" placeholder="https://linkedin.com/company/yourstore" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">TikTok</label>
                <div className="relative">
                  <Music2 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-900" size={18} />
                  <input name="tiktok" value={form.tiktok} onChange={onChange} className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2 text-sm" placeholder="https://tiktok.com/@yourstore" />
                </div>
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
              <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">{t('cancel')}</button>
              <button onClick={onSave} disabled={saving} className="px-4 py-2 text-sm font-medium rounded-lg bg-orange-500 text-white hover:bg-orange-600 disabled:opacity-50 transition-colors">
                {saving ? t('saving') : t('saveChanges')}
              </button>
            </div>
          </div>

          {/* Danger zone */}
          <div className="flex justify-end mb-4">
            <button className="px-4 py-2 text-sm font-medium text-red-700 border border-red-200 rounded-lg bg-red-50 hover:bg-red-100 transition-colors">
              {t('deleteMyStore')}
            </button>
          </div>
        </main>
      </div>
    </div>
  )
}


