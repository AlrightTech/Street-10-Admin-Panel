import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'
import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Menu, Key, ArrowLeft, Check, X } from 'lucide-react'
import SuccessModal from '@/components/ui/SuccessModal'

type VendorPermissions = {
  viewProducts: boolean
  editProducts: boolean
  deleteProducts: boolean
  approveProducts: boolean
}

type SubVendor = {
  id: number
  name: string
  email?: string
  status: string
  role?: string
}

type VendorFormState = {
  fullName: string
  email: string
  role: string
  status: string
}

const defaultPermissions: VendorPermissions = {
  viewProducts: false,
  editProducts: false,
  deleteProducts: false,
  approveProducts: false
}

const defaultFormState: VendorFormState = {
  fullName: '',
  email: '',
  role: 'Product Manager',
  status: 'Active'
}

export default function EditSubVendorPage() {
  const navigate = useNavigate()
  const params = useParams()
  const vendorId = Array.isArray(params?.id) ? params?.id[0] : params?.id
  
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [formData, setFormData] = useState<VendorFormState>(defaultFormState)
  const [permissions, setPermissions] = useState<VendorPermissions>(defaultPermissions)
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  // Frontend-only: Load vendor from localStorage
  const fetchVendor = useCallback(async () => {
    if (!vendorId) {
      setLoadError('Vendor ID is missing')
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setLoadError(null)

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300))

      // Load from localStorage
      const storedVendors = typeof window !== 'undefined' ? localStorage.getItem('subVendors') : null
      const vendors: SubVendor[] = storedVendors ? JSON.parse(storedVendors) : []
      
      const vendor = vendors.find(v => v.id === parseInt(vendorId, 10))

      if (!vendor) {
        throw new Error('Vendor not found')
      }

      const normalizedStatus = (() => {
        const lower = (vendor.status || '').toLowerCase()
        if (lower === 'active' || lower === 'verified') return 'Active'
        if (lower === 'inactive' || lower === 'blocked') return 'Inactive'
        if (lower === 'pending') return 'Inactive'
        return 'Active'
      })()

      setFormData({
        fullName: vendor.name || defaultFormState.fullName,
        email: vendor.email || defaultFormState.email,
        role: vendor.role || defaultFormState.role,
        status: normalizedStatus
      })

      // Permissions are not stored in SubVendor type, so use defaults
      setPermissions(defaultPermissions)
    } catch (error) {
      console.error('Failed to load vendor:', error)
      setLoadError(error instanceof Error ? error.message : 'Failed to load vendor details')
      setFormData(defaultFormState)
      setPermissions(defaultPermissions)
    } finally {
      setIsLoading(false)
    }
  }, [vendorId])

  useEffect(() => {
    fetchVendor()
  }, [fetchVendor])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setSaveError(null)
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handlePermissionToggle = (key: keyof typeof permissions) => {
    setSaveError(null)
    setPermissions({ ...permissions, [key]: !permissions[key] })
  }

  const handleSave = async () => {
    if (!vendorId) {
      setSaveError('Vendor ID is missing')
      return
    }

    setIsSaving(true)
    setSaveError(null)

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800))

      // Load existing vendors from localStorage
      const storedVendors = typeof window !== 'undefined' ? localStorage.getItem('subVendors') : null
      const vendors: SubVendor[] = storedVendors ? JSON.parse(storedVendors) : []
      
      // Find and update the vendor
      const vendorIndex = vendors.findIndex(v => v.id === parseInt(vendorId, 10))
      
      if (vendorIndex === -1) {
        throw new Error('Vendor not found')
      }

      // Update vendor data
      vendors[vendorIndex] = {
        ...vendors[vendorIndex],
        name: formData.fullName,
        email: formData.email,
        role: formData.role,
        status: formData.status
      }

      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('subVendors', JSON.stringify(vendors))
      }

      setShowSuccessModal(true)
      setTimeout(() => {
        setShowSuccessModal(false)
        navigate(`/settings/profile/vendors/${vendorId}`)
      }, 1500)
    } catch (error) {
      console.error('Failed to save vendor:', error)
      setSaveError(error instanceof Error ? error.message : 'Failed to save changes')
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
            {isLoading ? (
              <div className="flex items-center justify-center py-16">
                <p className="text-gray-500 text-sm">Loading vendor details...</p>
              </div>
            ) : loadError ? (
              <div className="flex flex-col items-center justify-center py-16 space-y-4">
                <p className="text-sm text-red-600">{loadError}</p>
                <button
                  onClick={fetchVendor}
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                  type="button"
                >
                  Retry
                </button>
              </div>
            ) : (
              <>
                {/* Breadcrumb */}
                <div className="mb-4 sm:mb-6">
                  <button
                    onClick={() => navigate(`/settings/profile/vendors/${vendorId}`)}
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
                      onClick={() => navigate(`/settings/profile/vendors/${vendorId}/reset-password`)}
                      className="px-4 py-2 border border-orange-500 text-orange-500 rounded-lg hover:bg-orange-50 transition-colors flex items-center justify-center gap-2 text-sm font-medium w-full sm:w-auto"
                    >
                      <Key size={16} />
                      Reset Password
                    </button>
                    <div className="w-full sm:w-auto">
                      {saveError && (
                        <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-md px-3 py-2 mb-2">
                          {saveError}
                        </p>
                      )}
                      <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className={`px-6 py-2 w-full sm:w-auto rounded-lg transition-colors flex items-center justify-center gap-2 text-sm font-medium ${
                          isSaving
                            ? 'bg-gray-400 text-white cursor-not-allowed'
                            : 'bg-orange-500 text-white hover:bg-orange-600'
                        }`}
                      >
                        {isSaving ? 'Saving...' : 'Save Changes'}
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
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
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-gray-500 text-sm">Loading vendor details...</p>
            </div>
          ) : loadError ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <p className="text-sm text-red-600">{loadError}</p>
              <button
                onClick={fetchVendor}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                type="button"
              >
                Retry
              </button>
            </div>
          ) : (
            <>
              <button
                onClick={() => navigate(-1)}
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
                    onClick={() => navigate(`/settings/profile/vendors/${vendorId}/reset-password`)}
                    className="w-full px-4 py-2 border border-orange-500 text-orange-500 rounded-lg text-sm font-medium"
                  >
                    Reset Password
                  </button>
                  {saveError && (
                    <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-md px-3 py-2">
                      {saveError}
                    </p>
                  )}
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className={`w-full px-4 py-2 rounded-lg text-sm font-medium ${
                      isSaving ? 'bg-gray-400 text-white' : 'bg-orange-500 text-white'
                    }`}
                  >
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            </>
          )}
        </main>
      </div>

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false)
          navigate(`/settings/profile/vendors/${vendorId}`)
        }}
        message="Changes saved successfully!"
      />
    </div>
  )
}

