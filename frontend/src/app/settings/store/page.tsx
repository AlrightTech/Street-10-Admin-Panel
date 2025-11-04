'use client'

import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'
import { useState, useRef } from 'react'
import { Menu, HelpCircle, Upload, Image as ImageIcon, Save, ShoppingBag, FileText, Share2, Facebook, Instagram, Linkedin, Music2 } from 'lucide-react'
import TabsBar from '@/components/ui/TabsBar'

export default function StoreSettingsPage() {
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
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Store Setting</h1>
                  <p className="text-sm text-gray-500 mt-1">Dashboard - Store Setting</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    className="inline-flex items-center gap-2 text-xs sm:text-sm px-3 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
                    type="button"
                  >
                    <HelpCircle size={16} />
                    Help
                  </button>
                  <button
                    onClick={onSave}
                    disabled={saving}
                    className="inline-flex items-center gap-2 text-xs sm:text-sm px-3 py-2 rounded-md bg-primary-500 text-white hover:bg-primary-600 disabled:opacity-50"
                  >
                    <Save size={16} />
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>

              {/* Tabs */}
              <TabsBar
                tabs={[
                  { label: 'Store Settings', href: '/settings/store', active: true },
                  { label: 'Policy Settings', href: '/settings/policy' },
                  { label: 'Notification', href: '/settings/notifications' },
                ]}
                variant="underline"
              />

              {/* Section Header */}
              <div className="mt-6 mb-4">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">Store Settings</h2>
                <p className="text-sm text-gray-600">Customize and manage your storefront information.</p>
              </div>

              {/* Store Branding */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center gap-2 mb-1">
                    <ShoppingBag className="w-4 h-4 text-primary-500" />
                    <h2 className="text-base font-semibold text-gray-900">Store Branding</h2>
                  </div>
                  <p className="text-xs text-gray-600 ml-6">Upload your store logo and banner to showcase your form!</p>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Store Logo */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">Store Logo</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50 transition-colors"
                         onClick={() => logoInputRef.current?.click()}>
                      <Upload className="mx-auto text-gray-400 mb-2" size={24} />
                      <p className="text-xs text-gray-600 mt-2">Click to upload or drag and drop</p>
                      <p className="text-[10px] text-gray-500 mt-1">PNG, JPG up to 1MB recommended 200x200px</p>
                      <input ref={logoInputRef} type="file" accept="image/*" className="hidden" title="Upload store logo" />
                    </div>
                  </div>
                  {/* Store Banner */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">Store Banner</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50 transition-colors"
                         onClick={() => bannerInputRef.current?.click()}>
                      <ImageIcon className="mx-auto text-gray-400 mb-2" size={24} />
                      <p className="text-xs text-gray-600 mt-2">Click to upload banner</p>
                      <p className="text-[10px] text-gray-500 mt-1">PNG, JPG up to 1MB recommended 1200x400px</p>
                      <input ref={bannerInputRef} type="file" accept="image/*" className="hidden" title="Upload store banner" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Store Information */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center gap-2 mb-1">
                    <FileText className="w-4 h-4 text-primary-500" />
                    <h2 className="text-base font-semibold text-gray-900">Store Information</h2>
                  </div>
                  <p className="text-xs text-gray-600 ml-6">Provide essential details about your store</p>
                </div>
                <div className="p-6 space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-2">Store Name *</label>
                      <input name="storeName" value={form.storeName} onChange={onChange} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent" placeholder="Enter your store name" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-2">Contact Email *</label>
                      <input name="contactEmail" type="email" value={form.contactEmail} onChange={onChange} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent" placeholder="store@example.com" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">Contact Phone</label>
                    <input name="contactPhone" value={form.contactPhone} onChange={onChange} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent" placeholder="+1 (555) 123-4567" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">Store Description / About</label>
                    <textarea name="about" value={form.about} onChange={onChange} rows={4} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm resize-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" placeholder="Tell customers about your store, products, and what makes you unique." />
                    <p className="text-[10px] text-gray-500 mt-1">maximum 500 characters</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">Store Address</label>
                    <textarea name="address" value={form.address} onChange={onChange} rows={2} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm resize-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" placeholder="Enter your complete store address including street, city, state, and postal code." />
                  </div>
                </div>
              </div>

              {/* Social Media Links */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center gap-2 mb-1">
                    <Share2 className="w-4 h-4 text-pink-500" />
                    <h2 className="text-base font-semibold text-gray-900">Social Media Links</h2>
                  </div>
                  <p className="text-xs text-gray-600 ml-6">Connect your social media accounts (Optional)</p>
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
                  <span>Changes are automatically saved as draft. Click 'Save Changes' to publish.</span>
                </div>
                <div className="flex items-center gap-3">
                  <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">Cancel</button>
                  <button onClick={onSave} disabled={saving} className="px-4 py-2 text-sm font-medium rounded-lg bg-orange-500 text-white hover:bg-orange-600 disabled:opacity-50 transition-colors">
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>

              {/* Danger zone */}
              <div className="flex justify-end mb-6">
                <button className="px-4 py-2 text-sm font-medium text-red-700 border border-red-200 rounded-lg bg-red-50 hover:bg-red-100 transition-colors">
                  Delete My Store
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
            <h1 className="text-xl font-bold text-gray-900">Store Setting</h1>
            <p className="text-xs text-gray-500 mt-1">Dashboard - Store Setting</p>
          </div>

          {/* Tabs - mobile */}
          <div>
            <TabsBar
              tabs={[
                { label: 'Store Settings', href: '/settings/store', active: true },
                { label: 'Policy Settings', href: '/settings/policy' },
                { label: 'Notification', href: '/settings/notifications' },
              ]}
              variant="underline"
            />
          </div>

          {/* Section Header */}
          <div className="mt-4 mb-3">
            <h2 className="text-base font-bold text-gray-900 mb-1">Store Settings</h2>
            <p className="text-xs text-gray-600">Customize and manage your storefront information.</p>
          </div>

          {/* Store Branding */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-4 py-3 border-b border-gray-200">
              <div className="flex items-center gap-2 mb-1">
                <ShoppingBag className="w-4 h-4 text-primary-500" />
                <h2 className="text-sm font-semibold text-gray-900">Store Branding</h2>
              </div>
              <p className="text-xs text-gray-600 ml-6">Upload your store logo and banner to showcase your form!</p>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">Store Logo</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => logoInputRef.current?.click()}>
                  <Upload className="mx-auto text-gray-400 mb-2" size={24} />
                  <p className="text-xs text-gray-600 mt-2">Click to upload or drag and drop</p>
                  <p className="text-[10px] text-gray-500 mt-1">PNG, JPG up to 1MB recommended 200x200px</p>
                  <input ref={logoInputRef} type="file" accept="image/*" className="hidden" title="Upload store logo" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">Store Banner</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => bannerInputRef.current?.click()}>
                  <ImageIcon className="mx-auto text-gray-400 mb-2" size={24} />
                  <p className="text-xs text-gray-600 mt-2">Click to upload banner</p>
                  <p className="text-[10px] text-gray-500 mt-1">PNG, JPG up to 1MB recommended 1200x400px</p>
                  <input ref={bannerInputRef} type="file" accept="image/*" className="hidden" title="Upload store banner" />
                </div>
              </div>
            </div>
          </div>

          {/* Store Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-4 py-3 border-b border-gray-200">
              <div className="flex items-center gap-2 mb-1">
                <FileText className="w-4 h-4 text-primary-500" />
                <h2 className="text-sm font-semibold text-gray-900">Store Information</h2>
              </div>
              <p className="text-xs text-gray-600 ml-6">Provide essential details about your store</p>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">Store Name *</label>
                <input name="storeName" value={form.storeName} onChange={onChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" placeholder="Enter your store name" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">Contact Email *</label>
                <input name="contactEmail" type="email" value={form.contactEmail} onChange={onChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" placeholder="store@example.com" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">Contact Phone</label>
                <input name="contactPhone" value={form.contactPhone} onChange={onChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" placeholder="+1 (555) 123-4567" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">Store Description / About</label>
                <textarea name="about" value={form.about} onChange={onChange} rows={4} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none" placeholder="Tell customers about your store, products, and what makes you unique." />
                <p className="text-[10px] text-gray-500 mt-1">maximum 500 characters</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">Store Address</label>
                <textarea name="address" value={form.address} onChange={onChange} rows={2} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none" placeholder="Enter your complete store address including street, city, state, and postal code." />
              </div>
            </div>
          </div>

          {/* Social Media Links */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-4 py-3 border-b border-gray-200">
              <div className="flex items-center gap-2 mb-1">
                <Share2 className="w-4 h-4 text-pink-500" />
                <h2 className="text-sm font-semibold text-gray-900">Social Media Links</h2>
              </div>
              <p className="text-xs text-gray-600 ml-6">Connect your social media accounts (Optional)</p>
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
              <span>Changes are automatically saved as draft. Click 'Save Changes' to publish.</span>
            </div>
            <div className="flex items-center gap-3 justify-end">
              <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">Cancel</button>
              <button onClick={onSave} disabled={saving} className="px-4 py-2 text-sm font-medium rounded-lg bg-orange-500 text-white hover:bg-orange-600 disabled:opacity-50 transition-colors">
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>

          {/* Danger zone */}
          <div className="flex justify-end mb-4">
            <button className="px-4 py-2 text-sm font-medium text-red-700 border border-red-200 rounded-lg bg-red-50 hover:bg-red-100 transition-colors">
              Delete My Store
            </button>
          </div>
        </main>
      </div>
    </div>
  )
}


