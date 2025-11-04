'use client'

import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'
import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Menu, Key, ArrowLeft, Check, X } from 'lucide-react'

// Mock data - in real app, fetch from API
const mockVendorData = {
  id: 1,
  fullName: 'John Doe',
  email: 'john.doe@example.com',
  role: 'Product Manager',
  status: 'Active',
  permissions: {
    viewProducts: true,
    editProducts: false,
    deleteProducts: true,
    approveProducts: false
  }
}

export default function EditSubVendorPage() {
  const router = useRouter()
  const params = useParams()
  const vendorId = params?.id
  
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [formData, setFormData] = useState({
    fullName: mockVendorData.fullName,
    email: mockVendorData.email,
    role: mockVendorData.role,
    status: mockVendorData.status
  })
  const [permissions, setPermissions] = useState(mockVendorData.permissions)
  const [isSaving, setIsSaving] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handlePermissionToggle = (key: keyof typeof permissions) => {
    setPermissions({ ...permissions, [key]: !permissions[key] })
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      alert('Changes saved successfully!')
      router.push(`/settings/profile/vendors/${vendorId}`)
    } catch (error) {
      alert('Failed to save changes')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Layout */}
      <div className="hidden lg:flex h-screen overflow-hidden">
        {!sidebarCollapsed && (
          <div className="w-64 flex-shrink-0 bg-primary-500 h-screen overflow-y-auto">
            <Sidebar onClose={() => setSidebarCollapsed(true)} currentPage="settings" />
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
          
          <main className="flex-1 overflow-y-auto p-4 sm:p-6">
            {/* Breadcrumb */}
            <div className="mb-4 sm:mb-6">
              <button
                onClick={() => router.push(`/settings/profile/vendors/${vendorId}`)}
                className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 hover:text-gray-900 mb-2"
              >
                <ArrowLeft size={14} className="sm:w-4 sm:h-4" />
                <span>Back to Sub Vendor Detail</span>
              </button>
              <p className="text-xs sm:text-sm text-gray-500">Dashboard • Edit Sub Vendor</p>
            </div>

            <div className="max-w-4xl mx-auto">
              {/* Basic Information */}
              <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-4 sm:mb-6">
                <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="John Doe"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="john.doe@example.com"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="Product Manager">Product Manager</option>
                      <option value="Order Manager">Order Manager</option>
                      <option value="Admin">Admin</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Permissions */}
              <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-4 sm:mb-6">
                <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Permissions</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { key: 'viewProducts' as const, label: 'View Products' },
                    { key: 'editProducts' as const, label: 'Edit Products' },
                    { key: 'deleteProducts' as const, label: 'Delete Products' },
                    { key: 'approveProducts' as const, label: 'Approve Products' }
                  ].map((perm) => (
                    <label
                      key={perm.key}
                      className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                        permissions[perm.key]
                          ? 'border-primary-300 bg-primary-50'
                          : 'border-gray-200 bg-white hover:bg-gray-50'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={permissions[perm.key]}
                        onChange={() => handlePermissionToggle(perm.key)}
                        className="w-5 h-5 text-primary-500 border-gray-300 rounded focus:ring-primary-500 focus:ring-2 cursor-pointer accent-primary-500"
                      />
                      <span className="text-sm font-medium text-gray-900">{perm.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Status */}
              <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-4 sm:mb-6">
                <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Status</h2>
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      value="Active"
                      checked={formData.status === 'Active'}
                      onChange={handleInputChange}
                      className="w-4 h-4"
                    />
                    <span className="text-sm font-medium text-gray-900">Active</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      value="Inactive"
                      checked={formData.status === 'Inactive'}
                      onChange={handleInputChange}
                      className="w-4 h-4"
                    />
                    <span className="text-sm font-medium text-gray-900">Inactive</span>
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-end gap-3">
                <button
                  onClick={() => router.push(`/settings/profile/vendors/${vendorId}/reset-password`)}
                  className="px-4 py-2 border border-orange-500 text-orange-500 rounded-lg hover:bg-orange-50 transition-colors flex items-center justify-center gap-2 text-sm font-medium w-full sm:w-auto"
                >
                  <Key size={16} />
                  Reset Password
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className={`px-6 py-2 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm font-medium w-full sm:w-auto ${
                    isSaving
                      ? 'bg-gray-400 text-white cursor-not-allowed'
                      : 'bg-orange-500 text-white hover:bg-orange-600'
                  }`}
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
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
              <Sidebar onClose={() => setSidebarOpen(false)} currentPage="settings" />
            </div>
          </div>
        )}
        
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
          <Header onToggleSidebar={() => setSidebarOpen(true)} isSidebarOpen={sidebarOpen} />
        </div>
        
        <main className="p-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft size={16} />
            <span>Back</span>
          </button>

          <div className="space-y-4">
            {/* Basic Info - Mobile */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h2 className="text-base font-semibold text-gray-900 mb-3">Basic Information</h2>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Role</label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  >
                    <option value="Product Manager">Product Manager</option>
                    <option value="Order Manager">Order Manager</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Permissions - Mobile */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h2 className="text-base font-semibold text-gray-900 mb-3">Permissions</h2>
              <div className="space-y-2">
                {[
                  { key: 'viewProducts' as const, label: 'View Products' },
                  { key: 'editProducts' as const, label: 'Edit Products' },
                  { key: 'deleteProducts' as const, label: 'Delete Products' },
                  { key: 'approveProducts' as const, label: 'Approve Products' }
                ].map((perm) => (
                  <label
                    key={perm.key}
                    className={`flex items-center gap-2 p-2 border rounded-lg cursor-pointer transition-colors ${
                      permissions[perm.key] ? 'border-primary-300 bg-primary-50' : 'border-gray-200 bg-white'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={permissions[perm.key]}
                      onChange={() => handlePermissionToggle(perm.key)}
                      className="w-4 h-4 text-primary-500 border-gray-300 rounded focus:ring-primary-500 focus:ring-2 cursor-pointer accent-primary-500"
                    />
                    <span className="text-sm font-medium text-gray-900">{perm.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Status - Mobile */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h2 className="text-base font-semibold text-gray-900 mb-3">Status</h2>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    value="Active"
                    checked={formData.status === 'Active'}
                    onChange={handleInputChange}
                    className="w-4 h-4"
                  />
                  <span className="text-sm font-medium text-gray-900">Active</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    value="Inactive"
                    checked={formData.status === 'Inactive'}
                    onChange={handleInputChange}
                    className="w-4 h-4"
                  />
                  <span className="text-sm font-medium text-gray-900">Inactive</span>
                </label>
              </div>
            </div>

            {/* Buttons - Mobile */}
            <div className="flex flex-col gap-2">
              <button
                onClick={() => router.push(`/settings/profile/vendors/${vendorId}/reset-password`)}
                className="w-full px-4 py-2 border border-orange-500 text-orange-500 rounded-lg text-sm font-medium"
              >
                Reset Password
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className={`w-full px-4 py-2 rounded-lg text-sm font-medium ${
                  isSaving ? 'bg-gray-400' : 'bg-orange-500 text-white'
                }`}
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

