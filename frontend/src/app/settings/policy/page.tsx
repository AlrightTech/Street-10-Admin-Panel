'use client'

import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'
import { useState } from 'react'
import { Menu, Clock, Package, RefreshCw, Shield, Eye } from 'lucide-react'
import TabsBar from '@/components/ui/TabsBar'

export default function PolicySettingsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

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
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Store Setting</h1>
                <p className="text-sm text-gray-500 mt-1">Dashboard - Policy Settings</p>
              </div>

              {/* Tabs */}
              <TabsBar
                tabs={[
                  { label: 'Store Settings', href: '/settings/store' },
                  { label: 'Policy Settings', href: '/settings/policy', active: true },
                  { label: 'Notification', href: '/settings/notifications' },
                ]}
                variant="underline"
              />

              {/* Manage Your Policies */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="mb-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-1">Manage Your Policies</h2>
                  <p className="text-sm text-gray-600">Define and update your store policies to inform customers about shipping, returns, and other important terms.</p>
                </div>

                {/* Shipping Policy */}
                <div className="border border-gray-200 rounded-lg overflow-hidden mb-6">
                  <div className="px-6 py-4 border-b border-gray-200 bg-white">
                    <div className="flex items-start gap-3">
                      <Package className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h3 className="text-base font-semibold text-gray-900 mb-1">Shipping Policy</h3>
                        <p className="text-xs text-gray-600">Define your shipping terms, delivery times, and charges</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-2">Shipping Terms & Conditions</label>
                      <textarea rows={5} className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm resize-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" placeholder="We offer nationwide shipping with delivery within 2-7 business days. Free shipping on orders over $50. Express delivery available for an additional fee. International shipping takes 10-14 business days." />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-2">Standard Delivery Time</label>
                        <input className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent" placeholder="3-7 business days" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-2">Free Shipping Threshold</label>
                        <input className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent" placeholder="$50" />
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
                        <h3 className="text-base font-semibold text-gray-900 mb-1">Refund & Return Policy</h3>
                        <p className="text-xs text-gray-600">Set conditions for returns, exchanges, and refunds</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-2">Return & Refund Conditions</label>
                      <textarea rows={5} className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm resize-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" placeholder="Returns accepted within 30 days of purchase. Items must be in original condition with tags attached. Refunds processed within 5-7 business days. Return shipping costs are the customer's responsibility. Digital items and personalized products are non-returnable." />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-2">Return Window</label>
                        <input className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent" placeholder="30 days" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-2">Refund Processing Time</label>
                        <input className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent" placeholder="5-7 business days" />
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
                        <h3 className="text-base font-semibold text-gray-900 mb-1">Privacy & Other Policies</h3>
                        <p className="text-xs text-gray-600">Additional policies including privacy, terms of service, and custom policies</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 space-y-5">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-2">Privacy Policy</label>
                      <textarea rows={4} className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm resize-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" placeholder="We respect your privacy and commit to protecting your personal information. We collect data to improve our services and do not share your information with third parties." />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-2">Terms of Service</label>
                      <textarea rows={4} className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm resize-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" placeholder="By using our services, you agree to these terms. All sales are final unless otherwise stated. We reserve the right to refuse service." />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-2">Custom Policies</label>
                      <textarea rows={4} className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm resize-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" placeholder="Special handling fees may apply for fragile items. Bulk orders may require additional processing time. Custom orders cannot be cancelled once production begins." />
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex flex-col gap-2">
                    <button className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors">
                      <Eye size={16} />
                      Preview Policies
                    </button>
                    <p className="text-xs text-gray-500">Last updated: December 18, 2024 at 2:30 PM</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors">Cancel</button>
                    <button className="px-4 py-2 text-sm font-medium rounded-lg bg-orange-500 text-white hover:bg-orange-600 transition-colors">Save Policies</button>
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
            <h1 className="text-xl font-bold text-gray-900">Store Setting</h1>
            <p className="text-xs text-gray-500 mt-1">Dashboard - Policy Settings</p>
          </div>

          <div>
            <TabsBar
              tabs={[
                { label: 'Store Settings', href: '/settings/store' },
                { label: 'Policy Settings', href: '/settings/policy', active: true },
                { label: 'Notification', href: '/settings/notifications' },
              ]}
              variant="underline"
            />
          </div>

          {/* Manage Your Policies */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="mb-4">
              <h2 className="text-base font-bold text-gray-900 mb-1">Manage Your Policies</h2>
              <p className="text-xs text-gray-600">Define and update your store policies to inform customers about shipping, returns, and other important terms.</p>
            </div>

            {/* Shipping Policy */}
            <div className="border border-gray-200 rounded-lg overflow-hidden mb-4">
              <div className="px-4 py-3 border-b border-gray-200 bg-white">
                <div className="flex items-start gap-3">
                  <Package className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-1">Shipping Policy</h3>
                    <p className="text-xs text-gray-600">Define your shipping terms, delivery times, and charges</p>
                  </div>
                </div>
              </div>
              <div className="p-4 space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">Shipping Terms & Conditions</label>
                  <textarea rows={5} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none" placeholder="We offer nationwide shipping with delivery within 2-7 business days..." />
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">Standard Delivery Time</label>
                    <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" placeholder="3-7 business days" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">Free Shipping Threshold</label>
                    <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" placeholder="$50" />
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
                    <h3 className="text-sm font-semibold text-gray-900 mb-1">Refund & Return Policy</h3>
                    <p className="text-xs text-gray-600">Set conditions for returns, exchanges, and refunds</p>
                  </div>
                </div>
              </div>
              <div className="p-4 space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">Return & Refund Conditions</label>
                  <textarea rows={5} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none" placeholder="Returns accepted within 30 days of purchase..." />
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">Return Window</label>
                    <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" placeholder="30 days" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">Refund Processing Time</label>
                    <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" placeholder="5-7 business days" />
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
                    <h3 className="text-sm font-semibold text-gray-900 mb-1">Privacy & Other Policies</h3>
                    <p className="text-xs text-gray-600">Additional policies including privacy, terms of service, and custom policies</p>
                  </div>
                </div>
              </div>
              <div className="p-4 space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">Privacy Policy</label>
                  <textarea rows={4} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none" placeholder="We respect your privacy and commit to protecting your personal information..." />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">Terms of Service</label>
                  <textarea rows={4} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none" placeholder="By using our services, you agree to these terms..." />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">Custom Policies</label>
                  <textarea rows={4} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none" placeholder="Special handling fees may apply for fragile items..." />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-6 flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <button className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors w-fit">
                  <Eye size={16} />
                  Preview Policies
                </button>
                <p className="text-xs text-gray-500">Last updated: December 18, 2024 at 2:30 PM</p>
              </div>
              <div className="flex items-center gap-3 justify-end">
                <button className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors">Cancel</button>
                <button className="px-4 py-2 text-sm font-medium rounded-lg bg-orange-500 text-white hover:bg-orange-600 transition-colors">Save Policies</button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}


