'use client'

import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'
import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Menu, User, Shield, Activity, Key, UserX, Edit, Check, X, ArrowLeft, Info, Plus, Clock } from 'lucide-react'

// Mock data - in real app, fetch from API based on ID
const mockVendorData = {
  id: 1,
  name: 'Ali Khan',
  email: 'ali.khan@vendor.com',
  role: 'Product Manager',
  status: 'Active',
  description: 'Managing product catalog and inventory',
  joinDate: 'Jan 15, 2024',
  lastLogin: '2 hours ago',
  assignedByVendor: true,
  permissions: {
    viewProducts: true,
    addEditProducts: true,
    deleteProducts: false,
    approveProducts: true
  },
  activity: {
    productsAdded: 45,
    productsEdited: 30,
    productsApproved: 12,
    pendingProducts: 5
  }
}

export default function SubVendorDetailPage() {
  const router = useRouter()
  const params = useParams()
  const vendorId = params?.id
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [status, setStatus] = useState(mockVendorData.status === 'Active')

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
                onClick={() => router.push('/settings/profile')}
                className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 hover:text-gray-900 mb-2"
              >
                <ArrowLeft size={14} className="sm:w-4 sm:h-4" />
                <span>Back to Manage Sub Vendors</span>
              </button>
              <p className="text-xs sm:text-sm text-gray-500">Dashboard - Manage Sub Vendors</p>
            </div>

            {/* User Profile Header Card */}
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-4 sm:mb-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-start sm:justify-between gap-4">
                <div className="flex items-start gap-3 sm:gap-4 w-full sm:w-auto">
                  <div className="relative flex-shrink-0">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-base sm:text-xl font-bold">
                      {mockVendorData.name.charAt(0)}
                    </div>
                    <div className="absolute bottom-0 right-0 w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h1 className="text-lg sm:text-2xl font-bold text-gray-900 mb-2 break-words">{mockVendorData.name}</h1>
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="px-2 sm:px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium flex items-center gap-1 whitespace-nowrap">
                        <User size={10} className="sm:w-3 sm:h-3" />
                        {mockVendorData.role}
                      </span>
                      <span className="px-2 sm:px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium flex items-center gap-1 whitespace-nowrap">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        {mockVendorData.status}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600 break-words">{mockVendorData.description}</p>
                  </div>
                </div>
                <div className="flex flex-row sm:flex-col items-center sm:items-end gap-3 w-full sm:w-auto border-t sm:border-t-0 pt-4 sm:pt-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs sm:text-sm font-medium text-gray-700">Status</span>
                    <button
                      onClick={() => setStatus(!status)}
                      className={`relative w-10 h-5 sm:w-12 sm:h-6 rounded-full transition-colors ${
                        status ? 'bg-primary-500' : 'bg-gray-300'
                      }`}
                      aria-label="Toggle status"
                    >
                      <div
                        className={`absolute top-0.5 sm:top-1 left-0.5 sm:left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                          status ? 'transform translate-x-5 sm:translate-x-6' : ''
                        }`}
                      />
                    </button>
                  </div>
                  <button
                    onClick={() => router.push(`/settings/profile/vendors/${vendorId}/edit`)}
                    className="px-3 sm:px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors flex items-center gap-2 text-xs sm:text-sm font-medium w-full sm:w-auto justify-center"
                  >
                    <Edit size={14} className="sm:w-4 sm:h-4" />
                    <span>Edit User</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Info Cards Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
              {/* User Information Card */}
              <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Info className="text-blue-600" size={18} />
                  <h2 className="text-base sm:text-lg font-semibold text-gray-900">User Information</h2>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Email</p>
                    <p className="text-sm font-medium text-gray-900">{mockVendorData.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Join Date</p>
                    <p className="text-sm font-medium text-gray-900">{mockVendorData.joinDate}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Last Login</p>
                    <p className="text-sm font-medium text-gray-900">{mockVendorData.lastLogin}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Assigned by Vendor</p>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-gray-900">{mockVendorData.assignedByVendor ? 'Yes' : 'No'}</p>
                      {mockVendorData.assignedByVendor && (
                        <Check className="text-green-600" size={16} />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Role & Permissions Card */}
              <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Shield className="text-blue-600" size={18} />
                  <h2 className="text-base sm:text-lg font-semibold text-gray-900">Role & Permissions</h2>
                </div>
                <div className="mb-4">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                    {mockVendorData.role}
                  </span>
                </div>
                <div className="space-y-2">
                  {[
                    { key: 'viewProducts', label: 'View Products', allowed: mockVendorData.permissions.viewProducts },
                    { key: 'addEditProducts', label: 'Add/Edit Products', allowed: mockVendorData.permissions.addEditProducts },
                    { key: 'deleteProducts', label: 'Delete Products', allowed: mockVendorData.permissions.deleteProducts },
                    { key: 'approveProducts', label: 'Approve/Publish Products', allowed: mockVendorData.permissions.approveProducts }
                  ].map((perm) => (
                    <div
                      key={perm.key}
                      className={`flex items-center justify-between p-3 rounded-lg ${
                        perm.allowed ? 'bg-green-50' : 'bg-red-50'
                      }`}
                    >
                      <span className="text-sm font-medium text-gray-900">{perm.label}</span>
                      {perm.allowed ? (
                        <Check className="text-green-600" size={18} />
                      ) : (
                        <X className="text-red-600" size={18} />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Activity Overview Card */}
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-4 sm:mb-6">
              <div className="flex items-center gap-2 mb-4">
                <Activity className="text-blue-600" size={18} />
                <h2 className="text-base sm:text-lg font-semibold text-gray-900">Activity Overview</h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {/* Products Added - Blue */}
                <div className="bg-primary-500 rounded-lg p-4 relative overflow-hidden">
                  <div className="flex flex-col justify-between h-full relative z-10">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-white opacity-90">Products Added</span>
                      <div className="w-8 h-8 rounded-full bg-blue-400/30 flex items-center justify-center">
                        <Plus className="text-white" size={14} />
                      </div>
                    </div>
                    <p className="text-2xl sm:text-3xl font-bold text-white">{mockVendorData.activity.productsAdded}</p>
                  </div>
                </div>
                
                {/* Products Edited - Green */}
                <div className="bg-green-500 rounded-lg p-4 relative overflow-hidden">
                  <div className="flex flex-col justify-between h-full relative z-10">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-white opacity-90">Products Edited</span>
                      <div className="w-8 h-8 rounded-md bg-green-400/30 flex items-center justify-center">
                        <Edit className="text-white" size={14} />
                      </div>
                    </div>
                    <p className="text-2xl sm:text-3xl font-bold text-white">{mockVendorData.activity.productsEdited}</p>
                  </div>
                </div>
                
                {/* Products Approved - Purple */}
                <div className="bg-purple-500 rounded-lg p-4 relative overflow-hidden">
                  <div className="flex flex-col justify-between h-full relative z-10">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-white opacity-90">Products Approved</span>
                      <div className="w-8 h-8 rounded-full bg-purple-400/30 flex items-center justify-center">
                        <Check className="text-white" size={14} />
                      </div>
                    </div>
                    <p className="text-2xl sm:text-3xl font-bold text-white">{mockVendorData.activity.productsApproved}</p>
                  </div>
                </div>
                
                {/* Pending Products - Orange */}
                <div className="bg-orange-500 rounded-lg p-4 relative overflow-hidden">
                  <div className="flex flex-col justify-between h-full relative z-10">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-white opacity-90">Pending Products</span>
                      <div className="w-8 h-8 rounded-full bg-orange-400/30 flex items-center justify-center">
                        <Clock className="text-white" size={14} />
                      </div>
                    </div>
                    <p className="text-2xl sm:text-3xl font-bold text-white">{mockVendorData.activity.pendingProducts}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-end gap-3">
              <button
                onClick={() => router.push(`/settings/profile/vendors/${vendorId}/reset-password`)}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center justify-center gap-2 text-sm font-medium w-full sm:w-auto"
              >
                <Key size={16} />
                Reset Password
              </button>
              <button
                onClick={() => {
                  if (confirm('Are you sure you want to deactivate this user?')) {
                    // Handle deactivation
                    alert('User deactivated')
                  }
                }}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center gap-2 text-sm font-medium w-full sm:w-auto"
              >
                <UserX size={16} />
                Deactivate User
              </button>
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
            onClick={() => router.push('/settings/profile')}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft size={16} />
            <span>Back</span>
          </button>
          
          {/* Mobile content similar to desktop but stacked */}
          <div className="space-y-4">
            {/* Profile Header */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-lg font-bold">
                    {mockVendorData.name.charAt(0)}
                  </div>
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                <div className="flex-1">
                  <h1 className="text-lg font-bold text-gray-900">{mockVendorData.name}</h1>
                  <div className="flex flex-wrap gap-1 mt-1">
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs">{mockVendorData.role}</span>
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs">{mockVendorData.status}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => router.push(`/settings/profile/vendors/${vendorId}/edit`)}
                className="w-full px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors text-sm font-medium flex items-center justify-center gap-2"
              >
                <Edit size={14} />
                <span>Edit User</span>
              </button>
            </div>

            {/* Info Cards - Mobile */}
            <div className="space-y-4">
              <div className="bg-white rounded-lg shadow-sm p-4">
                <h2 className="text-base font-semibold text-gray-900 mb-3">User Information</h2>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-gray-500">Email</p>
                    <p className="font-medium">{mockVendorData.email}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Join Date</p>
                    <p className="font-medium">{mockVendorData.joinDate}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Last Login</p>
                    <p className="font-medium">{mockVendorData.lastLogin}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-4">
                <h2 className="text-base font-semibold text-gray-900 mb-3">Permissions</h2>
                <div className="space-y-2">
                  {Object.entries(mockVendorData.permissions).map(([key, value]) => (
                    <div key={key} className={`flex items-center justify-between p-2 rounded ${value ? 'bg-green-50' : 'bg-red-50'}`}>
                      <span className="text-sm">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                      {value ? <Check className="text-green-600" size={16} /> : <X className="text-red-600" size={16} />}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Buttons - Mobile */}
            <div className="flex flex-col gap-2">
              <button
                onClick={() => router.push(`/settings/profile/vendors/${vendorId}/reset-password`)}
                className="w-full px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium"
              >
                Reset Password
              </button>
              <button
                onClick={() => {
                  if (confirm('Are you sure?')) {
                    alert('User deactivated')
                  }
                }}
                className="w-full px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium"
              >
                Deactivate User
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
