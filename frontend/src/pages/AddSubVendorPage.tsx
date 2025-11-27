import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'
import Modal from '@/components/ui/Modal'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Menu, Eye, EyeOff, Check, ChevronUp, ChevronDown, Shield, Package, CheckCircle } from 'lucide-react'
import { ButtonLoader } from '@/components/ui/Loader'

type SubVendor = {
  id: number
  name: string
  email?: string
  status: string
  role?: string
}

export default function AddSubVendorPage() {
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  
  // Step 1: Basic Info
  const [basicInfo, setBasicInfo] = useState({
    fullName: 'Touseef Ahmed',
    email: 'alice.johnson@example.com',
    password: '',
    confirmPassword: '',
    status: 'Active'
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
  // Step 2: Role Assignment
  const [selectedRole, setSelectedRole] = useState<string | null>(null)
  
  // Step 3: Permission Control
  const [expandedGroups, setExpandedGroups] = useState<{[key: string]: boolean}>({
    productManagement: true,
    orderManagement: false
  })
  const [permissions, setPermissions] = useState<{[key: string]: boolean}>({
    // Product Management
    'viewProducts': false,
    'editProducts': false,
    'deleteProducts': false,
    'approveProducts': false,
    // Order Management
    'viewOrders': false,
    'updateOrderStatus': false,
    'manageShipments': false,
    'viewPaymentMethods': false,
    'downloadInvoices': false,
    'respondToInquiries': false
  })
  const [selectAllGroups, setSelectAllGroups] = useState<{[key: string]: boolean}>({
    productManagement: false,
    orderManagement: false
  })
  const [passwordSetup, setPasswordSetup] = useState({
    sendInviteLink: false,
    password: '',
    confirmPassword: ''
  })
  const [showPasswordSetup, setShowPasswordSetup] = useState(false)
  const [showConfirmPasswordSetup, setShowConfirmPasswordSetup] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  // Frontend-only: No API calls needed

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSubmitError(null)
    setBasicInfo({
      ...basicInfo,
      [e.target.name]: e.target.value
    })
  }

  const togglePermission = (permissionKey: string) => {
    setSubmitError(null)
    setPermissions({
      ...permissions,
      [permissionKey]: !permissions[permissionKey]
    })
  }

  const toggleGroup = (groupKey: string) => {
    setSubmitError(null)
    setExpandedGroups({
      ...expandedGroups,
      [groupKey]: !expandedGroups[groupKey]
    })
  }

  const toggleSelectAll = (groupKey: string, permissionKeys: string[]) => {
    setSubmitError(null)
    const newSelectAll = !selectAllGroups[groupKey]
    setSelectAllGroups({
      ...selectAllGroups,
      [groupKey]: newSelectAll
    })
    
    const newPermissions = { ...permissions }
    permissionKeys.forEach(key => {
      newPermissions[key] = newSelectAll
    })
    setPermissions(newPermissions)
  }

  const getProductManagementPermissions = () => {
    const keys = ['viewProducts', 'editProducts', 'deleteProducts', 'approveProducts']
    const granted = keys.filter(key => permissions[key]).length
    return { keys, granted, total: keys.length }
  }

  const getOrderManagementPermissions = () => {
    const keys = ['viewOrders', 'updateOrderStatus', 'manageShipments', 'viewPaymentMethods', 'downloadInvoices', 'respondToInquiries']
    const granted = keys.filter(key => permissions[key]).length
    return { keys, granted, total: keys.length }
  }

  const nextStep = () => {
    setSubmitError(null)
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
    }
  }

  const previousStep = () => {
    setSubmitError(null)
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleInviteUser = async () => {
    setSubmitError(null)

    const trimmedName = basicInfo.fullName.trim()
    const trimmedEmail = basicInfo.email.trim()

    if (!trimmedName) {
      setSubmitError('Full name is required')
      setCurrentStep(1)
      return
    }

    if (!trimmedEmail) {
      setSubmitError('Email is required')
      setCurrentStep(1)
      return
    }

    const passwordCandidate = passwordSetup.password || basicInfo.password
    const confirmPasswordCandidate = passwordSetup.password
      ? passwordSetup.confirmPassword
      : basicInfo.confirmPassword

    if (!passwordCandidate) {
      setSubmitError('Password is required')
      setCurrentStep(1)
      return
    }

    if (passwordCandidate !== confirmPasswordCandidate) {
      setSubmitError('Passwords do not match')
      setCurrentStep(1)
      return
    }

    if (!selectedRole) {
      setSubmitError('Please select a role before inviting the user')
      setCurrentStep(2)
      return
    }

    const payload = {
      fullName: trimmedName,
      email: trimmedEmail,
      password: passwordCandidate,
      status: basicInfo.status,
      role: selectedRole,
      permissions
    }

    setIsSubmitting(true)

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800))

      // Load existing vendors from localStorage
      const storedVendors = typeof window !== 'undefined' ? localStorage.getItem('subVendors') : null
      const existingVendors: SubVendor[] = storedVendors ? JSON.parse(storedVendors) : []

      // Generate new ID
      const newId = existingVendors.length > 0 
        ? Math.max(...existingVendors.map(v => v.id)) + 1 
        : 1

      // Create new vendor
      const newVendor: SubVendor = {
        id: newId,
        name: trimmedName,
        email: trimmedEmail,
        status: basicInfo.status,
        role: selectedRole
      }

      // Add to list and save to localStorage
      const updatedVendors = [...existingVendors, newVendor]
      if (typeof window !== 'undefined') {
        localStorage.setItem('subVendors', JSON.stringify(updatedVendors))
      }

      setShowSuccessModal(true)
    } catch (error) {
      console.error('Failed to create vendor:', error)
      setSubmitError(error instanceof Error ? error.message : 'Failed to create vendor. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false)
    navigate('/settings/profile')
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
          
          <main className="flex-1 overflow-y-auto p-6">
            <div className="max-w-6xl mx-auto space-y-6">
              {/* Header */}
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Add New Sub Vendors</h1>
                <p className="text-sm mt-1">
                  <span className="text-gray-500">Dashboard</span>
                  <span className="text-gray-900"> • Add New Sub Vendors</span>
                </p>
                <p className="text-base text-gray-600 mt-2">Create a new Sub Vendors user with custom permissions</p>
              </div>

              {/* Step Content with Progress Indicator */}
              <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
                {/* Progress Indicator */}
                <div className="flex flex-col md:flex-row items-start gap-4 md:gap-8 mb-6 md:mb-8 pb-6 md:pb-8 border-b border-gray-200">
                  {/* Step 1 */}
                  <div className="flex items-start gap-4 flex-1">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${currentStep >= 1 ? 'bg-orange-500' : 'bg-gray-600'}`}>
                      <span className="text-white font-semibold text-lg">1</span>
                    </div>
                    <div>
                      <p className={`font-bold text-gray-900 mb-1 ${currentStep >= 1 ? 'text-gray-900' : 'text-gray-600'}`}>Basic Info</p>
                      <p className={`text-sm ${currentStep >= 1 ? 'text-gray-600' : 'text-gray-400'}`}>Personal details and credentials</p>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="flex items-start gap-4 flex-1">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${currentStep >= 2 ? 'bg-orange-500' : 'bg-gray-600'}`}>
                      <span className="text-white font-semibold text-lg">2</span>
                    </div>
                    <div>
                      <p className={`font-bold mb-1 ${currentStep >= 2 ? 'text-gray-900' : 'text-gray-600'}`}>Role Assignment</p>
                      <p className={`text-sm ${currentStep >= 2 ? 'text-gray-600' : 'text-gray-400'}`}>Select admin role and responsibilities</p>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="flex items-start gap-4 flex-1">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${currentStep >= 3 ? 'bg-orange-500' : 'bg-gray-600'}`}>
                      <span className="text-white font-semibold text-lg">3</span>
                    </div>
                    <div>
                      <p className={`font-bold mb-1 ${currentStep >= 3 ? 'text-gray-900' : 'text-gray-600'}`}>Permission Control</p>
                      <p className={`text-sm ${currentStep >= 3 ? 'text-gray-600' : 'text-gray-400'}`}>Customize access permissions</p>
                    </div>
                  </div>
                </div>
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div className="mb-6">
                      <h2 className="text-xl font-bold text-gray-900 mb-2">Basic Information</h2>
                      <p className="text-sm text-gray-600">Enter the Vendor user's personal details and login credentials</p>
                    </div>

                    <div className="space-y-5">
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">Full Name</label>
                        <input
                          type="text"
                          name="fullName"
                          value={basicInfo.fullName}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-orange-500 focus:border-transparent focus:bg-white transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">Email Address</label>
                        <input
                          type="email"
                          name="email"
                          value={basicInfo.email}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-orange-500 focus:border-transparent focus:bg-white transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">Password</label>
                        <div className="relative">
                          <input
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            value={basicInfo.password}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 pr-10 bg-gray-100 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-orange-500 focus:border-transparent focus:bg-white transition-colors"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                          >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">Confirm Password</label>
                        <div className="relative">
                          <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            name="confirmPassword"
                            value={basicInfo.confirmPassword}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 pr-10 bg-gray-100 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-orange-500 focus:border-transparent focus:bg-white transition-colors"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                          >
                            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-3">Status</label>
                        <div className="flex gap-6">
                          <label className="flex items-center cursor-pointer">
                            <input
                              type="radio"
                              name="status"
                              value="Active"
                              checked={basicInfo.status === 'Active'}
                              onChange={handleInputChange}
                              className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                            />
                            <span className="ml-2 text-gray-700">Active</span>
                          </label>
                          <label className="flex items-center cursor-pointer">
                            <input
                              type="radio"
                              name="status"
                              value="Inactive"
                              checked={basicInfo.status === 'Inactive'}
                              onChange={handleInputChange}
                              className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                            />
                            <span className="ml-2 text-gray-700">Inactive</span>
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end mt-6 md:mt-8">
                      <button
                        onClick={nextStep}
                        className="w-full sm:w-auto px-6 py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors"
                      >
                        Next Step
                      </button>
                    </div>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 mb-1">Role Assignment</h2>
                      <p className="text-sm text-gray-500">Select an admin role. Default permissions will be applied automatically.</p>
                    </div>

                    <div className="space-y-4">
                      <div
                        onClick={() => setSelectedRole('Product Manager')}
                        className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                          selectedRole === 'Product Manager' ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center">
                              <Shield className="text-pink-600" size={24} />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">Product Manager</h3>
                              <p className="text-sm text-gray-500">Handles product setup, content, and tracking.</p>
                            </div>
                          </div>
                          <input
                            type="checkbox"
                            checked={selectedRole === 'Product Manager'}
                            onChange={() => setSelectedRole('Product Manager')}
                            className="w-5 h-5 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                          />
                        </div>
                      </div>

                      <div
                        onClick={() => setSelectedRole('Order Manager')}
                        className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                          selectedRole === 'Order Manager' ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                              <Package className="text-blue-600" size={24} />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">Order Manager</h3>
                              <p className="text-sm text-gray-500">Manages customer orders, delivery, and operations.</p>
                            </div>
                          </div>
                          <input
                            type="checkbox"
                            checked={selectedRole === 'Order Manager'}
                            onChange={() => setSelectedRole('Order Manager')}
                            className="w-5 h-5 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 mt-6 md:mt-8">
                      <button
                        onClick={previousStep}
                        className="w-full sm:w-auto px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Previous
                      </button>
                      <button
                        onClick={nextStep}
                        disabled={!selectedRole}
                        className="w-full sm:w-auto px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next Step
                      </button>
                    </div>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 mb-1">Permission Control</h2>
                      <p className="text-sm text-gray-500">
                        Customize access permissions for the selected role: <span className="text-blue-600 font-semibold">{selectedRole}</span>
                      </p>
                    </div>

                    {/* Product Management Permissions */}
                    {(() => {
                      const pmPerms = getProductManagementPermissions()
                      return (
                        <div className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                                <span className="text-gray-600 font-semibold">C</span>
                              </div>
                              <div>
                                <h3 className="font-semibold text-gray-900">Product Management</h3>
                                <p className="text-sm text-gray-500">{pmPerms.granted} of {pmPerms.total} permissions granted</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <label className="flex items-center gap-2 cursor-pointer">
                                <span className="text-sm text-gray-700">Select All</span>
                                <input
                                  type="checkbox"
                                  checked={selectAllGroups.productManagement}
                                  onChange={() => toggleSelectAll('productManagement', pmPerms.keys)}
                                  className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                                />
                              </label>
                              <button
                                onClick={() => toggleGroup('productManagement')}
                                className="text-gray-500 hover:text-gray-700"
                              >
                                {expandedGroups.productManagement ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                              </button>
                            </div>
                          </div>
                          {expandedGroups.productManagement && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                              {[
                                { key: 'viewProducts', label: 'View Products' },
                                { key: 'editProducts', label: 'Edit Products' },
                                { key: 'deleteProducts', label: 'Delete Products' },
                                { key: 'approveProducts', label: 'Approve Products' }
                              ].map((perm) => (
                                <label key={perm.key} className="flex items-center gap-2 cursor-pointer p-2 border border-gray-200 rounded hover:bg-gray-50">
                                  <input
                                    type="checkbox"
                                    checked={permissions[perm.key]}
                                    onChange={() => togglePermission(perm.key)}
                                    className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                                  />
                                  <span className="text-sm text-gray-700">{perm.label}</span>
                                </label>
                              ))}
                            </div>
                          )}
                        </div>
                      )
                    })()}

                    {/* Order Management Permissions */}
                    {(() => {
                      const omPerms = getOrderManagementPermissions()
                      return (
                        <div className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                                <span className="text-gray-600 font-semibold">P</span>
                              </div>
                              <div>
                                <h3 className="font-semibold text-gray-900">Order Management</h3>
                                <p className="text-sm text-gray-500">{omPerms.granted} of {omPerms.total} permissions granted</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <label className="flex items-center gap-2 cursor-pointer">
                                <span className="text-sm text-gray-700">Select All</span>
                                <input
                                  type="checkbox"
                                  checked={selectAllGroups.orderManagement}
                                  onChange={() => toggleSelectAll('orderManagement', omPerms.keys)}
                                  className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                                />
                              </label>
                              <button
                                onClick={() => toggleGroup('orderManagement')}
                                className="text-gray-500 hover:text-gray-700"
                              >
                                {expandedGroups.orderManagement ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                              </button>
                            </div>
                          </div>
                          {expandedGroups.orderManagement && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                              {[
                                { key: 'viewOrders', label: 'View Orders' },
                                { key: 'updateOrderStatus', label: 'Update Order Status' },
                                { key: 'manageShipments', label: 'Manage Shipments' },
                                { key: 'viewPaymentMethods', label: 'View Payment Methods & Transactions' },
                                { key: 'downloadInvoices', label: 'Download Order Invoices/Reports' },
                                { key: 'respondToInquiries', label: 'Respond to Customer Inquiries (some elements)' }
                              ].map((perm) => (
                                <label key={perm.key} className="flex items-center gap-2 cursor-pointer p-2 border border-gray-200 rounded hover:bg-gray-50">
                                  <input
                                    type="checkbox"
                                    checked={permissions[perm.key]}
                                    onChange={() => togglePermission(perm.key)}
                                    className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                                  />
                                  <span className="text-sm text-gray-700">{perm.label}</span>
                                </label>
                              ))}
                            </div>
                          )}
                        </div>
                      )
                    })()}

                    {/* Password Setup */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-gray-900">Password Setup</h3>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={passwordSetup.sendInviteLink}
                          onChange={(e) => setPasswordSetup({ ...passwordSetup, sendInviteLink: e.target.checked })}
                          className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                        />
                        <span className="text-sm text-gray-700">Send invite link via email (user sets password later)</span>
                      </label>
                      {!passwordSetup.sendInviteLink && (
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                            <div className="relative">
                              <input
                                type={showPasswordSetup ? 'text' : 'password'}
                                name="password"
                                value={passwordSetup.password}
                                onChange={(e) => setPasswordSetup({ ...passwordSetup, password: e.target.value })}
                                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                              />
                              <button
                                type="button"
                                onClick={() => setShowPasswordSetup(!showPasswordSetup)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                              >
                                {showPasswordSetup ? <EyeOff size={18} /> : <Eye size={18} />}
                              </button>
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                            <div className="relative">
                              <input
                                type={showConfirmPasswordSetup ? 'text' : 'password'}
                                name="confirmPassword"
                                value={passwordSetup.confirmPassword}
                                onChange={(e) => setPasswordSetup({ ...passwordSetup, confirmPassword: e.target.value })}
                                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                              />
                              <button
                                type="button"
                                onClick={() => setShowConfirmPasswordSetup(!showConfirmPasswordSetup)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                              >
                                {showConfirmPasswordSetup ? <EyeOff size={18} /> : <Eye size={18} />}
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {submitError && (
                      <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-md px-3 py-2">
                        {submitError}
                      </p>
                    )}

                    <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-4 mt-6 md:mt-8">
                      <button
                        onClick={previousStep}
                        className="w-full sm:w-auto px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Previous
                      </button>
                      <button
                        onClick={handleInviteUser}
                        disabled={isSubmitting}
                        className={`w-full sm:w-auto px-6 py-2 rounded-lg transition-colors ${
                          isSubmitting
                            ? 'bg-orange-400 text-white cursor-not-allowed opacity-70'
                            : 'bg-orange-500 text-white hover:bg-orange-600'
                        }`}
                      >
                        {isSubmitting ? (
                          <>
                            <ButtonLoader size="sm" />
                            Inviting...
                          </>
                        ) : (
                          'Invite User'
                        )}
                      </button>
                    </div>
                  </div>
                )}
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
        <main className="p-4 space-y-4 pt-20 lg:pt-4">
          {/* Page header */}
          <div className="mb-4">
            <h1 className="text-xl font-bold text-gray-900">Add New Sub Vendors</h1>
            <p className="text-xs mt-1">
              <span className="text-gray-500">Dashboard</span>
              <span className="text-gray-900"> • Add New Sub Vendors</span>
            </p>
            <p className="text-sm text-gray-600 mt-2">Create a new Sub Vendors user with custom permissions</p>
          </div>

          {/* Step Content with Progress Indicator */}
          <div className="bg-white rounded-lg p-4 shadow-sm">
            {/* Progress Indicator */}
            <div className="flex flex-col gap-4 mb-6 pb-6 border-b border-gray-200">
              {/* Step 1 */}
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${currentStep >= 1 ? 'bg-orange-500' : 'bg-gray-600'}`}>
                  <span className="text-white font-semibold text-lg">1</span>
                </div>
                <div>
                  <p className={`font-bold text-gray-900 mb-1 ${currentStep >= 1 ? 'text-gray-900' : 'text-gray-600'}`}>Basic Info</p>
                  <p className={`text-xs ${currentStep >= 1 ? 'text-gray-600' : 'text-gray-400'}`}>Personal details and credentials</p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${currentStep >= 2 ? 'bg-orange-500' : 'bg-gray-600'}`}>
                  <span className="text-white font-semibold text-lg">2</span>
                </div>
                <div>
                  <p className={`font-bold mb-1 ${currentStep >= 2 ? 'text-gray-900' : 'text-gray-600'}`}>Role Assignment</p>
                  <p className={`text-xs ${currentStep >= 2 ? 'text-gray-600' : 'text-gray-400'}`}>Select admin role and responsibilities</p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${currentStep >= 3 ? 'bg-orange-500' : 'bg-gray-600'}`}>
                  <span className="text-white font-semibold text-lg">3</span>
                </div>
                <div>
                  <p className={`font-bold mb-1 ${currentStep >= 3 ? 'text-gray-900' : 'text-gray-600'}`}>Permission Control</p>
                  <p className={`text-xs ${currentStep >= 3 ? 'text-gray-600' : 'text-gray-400'}`}>Customize access permissions</p>
                </div>
              </div>
            </div>

            {/* Step Content - Same as desktop but with mobile optimizations */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="mb-4">
                  <h2 className="text-lg font-bold text-gray-900 mb-2">Basic Information</h2>
                  <p className="text-sm text-gray-600">Enter the Vendor user's personal details and login credentials</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Full Name</label>
                    <input
                      type="text"
                      name="fullName"
                      value={basicInfo.fullName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-orange-500 focus:border-transparent focus:bg-white transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={basicInfo.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-orange-500 focus:border-transparent focus:bg-white transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={basicInfo.password}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 pr-10 bg-gray-100 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-orange-500 focus:border-transparent focus:bg-white transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Confirm Password</label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        value={basicInfo.confirmPassword}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 pr-10 bg-gray-100 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-orange-500 focus:border-transparent focus:bg-white transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-3">Status</label>
                    <div className="flex gap-6">
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="status"
                          value="Active"
                          checked={basicInfo.status === 'Active'}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                        />
                        <span className="ml-2 text-gray-700">Active</span>
                      </label>
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="status"
                          value="Inactive"
                          checked={basicInfo.status === 'Inactive'}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                        />
                        <span className="ml-2 text-gray-700">Inactive</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end mt-6">
                  <button
                    onClick={nextStep}
                    className="w-full px-6 py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors"
                  >
                    Next Step
                  </button>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-gray-900 mb-1">Role Assignment</h2>
                  <p className="text-sm text-gray-500">Select an admin role. Default permissions will be applied automatically.</p>
                </div>

                <div className="space-y-4">
                  <div
                    onClick={() => setSelectedRole('Product Manager')}
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                      selectedRole === 'Product Manager' ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Shield className="text-pink-600" size={20} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold text-gray-900 text-sm">Product Manager</h3>
                          <p className="text-xs text-gray-500">Handles product setup, content, and tracking.</p>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={selectedRole === 'Product Manager'}
                        onChange={() => setSelectedRole('Product Manager')}
                        className="w-5 h-5 text-orange-600 border-gray-300 rounded focus:ring-orange-500 flex-shrink-0"
                      />
                    </div>
                  </div>

                  <div
                    onClick={() => setSelectedRole('Order Manager')}
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                      selectedRole === 'Order Manager' ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Package className="text-blue-600" size={20} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold text-gray-900 text-sm">Order Manager</h3>
                          <p className="text-xs text-gray-500">Manages customer orders, delivery, and operations.</p>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={selectedRole === 'Order Manager'}
                        onChange={() => setSelectedRole('Order Manager')}
                        className="w-5 h-5 text-orange-600 border-gray-300 rounded focus:ring-orange-500 flex-shrink-0"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3 mt-6">
                  <button
                    onClick={previousStep}
                    className="w-full px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Previous
                  </button>
                  <button
                    onClick={nextStep}
                    disabled={!selectedRole}
                    className="w-full px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next Step
                  </button>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-gray-900 mb-1">Permission Control</h2>
                  <p className="text-sm text-gray-500">
                    Customize access permissions for the selected role: <span className="text-blue-600 font-semibold">{selectedRole}</span>
                  </p>
                </div>

                {/* Product Management Permissions */}
                {(() => {
                  const pmPerms = getProductManagementPermissions()
                  return (
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex flex-col gap-3 mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <span className="text-gray-600 font-semibold">C</span>
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 text-sm">Product Management</h3>
                            <p className="text-xs text-gray-500">{pmPerms.granted} of {pmPerms.total} permissions granted</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <span className="text-xs text-gray-700">Select All</span>
                            <input
                              type="checkbox"
                              checked={selectAllGroups.productManagement}
                              onChange={() => toggleSelectAll('productManagement', pmPerms.keys)}
                              className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                            />
                          </label>
                          <button
                            onClick={() => toggleGroup('productManagement')}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            {expandedGroups.productManagement ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                          </button>
                        </div>
                      </div>
                      {expandedGroups.productManagement && (
                        <div className="grid grid-cols-1 gap-3 mt-4">
                          {[
                            { key: 'viewProducts', label: 'View Products' },
                            { key: 'editProducts', label: 'Edit Products' },
                            { key: 'deleteProducts', label: 'Delete Products' },
                            { key: 'approveProducts', label: 'Approve Products' }
                          ].map((perm) => (
                            <label key={perm.key} className="flex items-center gap-2 cursor-pointer p-2 border border-gray-200 rounded hover:bg-gray-50">
                              <input
                                type="checkbox"
                                checked={permissions[perm.key]}
                                onChange={() => togglePermission(perm.key)}
                                className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500 flex-shrink-0"
                              />
                              <span className="text-sm text-gray-700">{perm.label}</span>
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })()}

                {/* Order Management Permissions */}
                {(() => {
                  const omPerms = getOrderManagementPermissions()
                  return (
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex flex-col gap-3 mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <span className="text-gray-600 font-semibold">P</span>
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 text-sm">Order Management</h3>
                            <p className="text-xs text-gray-500">{omPerms.granted} of {omPerms.total} permissions granted</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <span className="text-xs text-gray-700">Select All</span>
                            <input
                              type="checkbox"
                              checked={selectAllGroups.orderManagement}
                              onChange={() => toggleSelectAll('orderManagement', omPerms.keys)}
                              className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                            />
                          </label>
                          <button
                            onClick={() => toggleGroup('orderManagement')}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            {expandedGroups.orderManagement ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                          </button>
                        </div>
                      </div>
                      {expandedGroups.orderManagement && (
                        <div className="grid grid-cols-1 gap-3 mt-4">
                          {[
                            { key: 'viewOrders', label: 'View Orders' },
                            { key: 'updateOrderStatus', label: 'Update Order Status' },
                            { key: 'manageShipments', label: 'Manage Shipments' },
                            { key: 'viewPaymentMethods', label: 'View Payment Methods & Transactions' },
                            { key: 'downloadInvoices', label: 'Download Order Invoices/Reports' },
                            { key: 'respondToInquiries', label: 'Respond to Customer Inquiries (some elements)' }
                          ].map((perm) => (
                            <label key={perm.key} className="flex items-center gap-2 cursor-pointer p-2 border border-gray-200 rounded hover:bg-gray-50">
                              <input
                                type="checkbox"
                                checked={permissions[perm.key]}
                                onChange={() => togglePermission(perm.key)}
                                className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500 flex-shrink-0"
                              />
                              <span className="text-sm text-gray-700">{perm.label}</span>
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })()}

                {/* Password Setup */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">Password Setup</h3>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={passwordSetup.sendInviteLink}
                      onChange={(e) => setPasswordSetup({ ...passwordSetup, sendInviteLink: e.target.checked })}
                      className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                    />
                    <span className="text-sm text-gray-700">Send invite link via email (user sets password later)</span>
                  </label>
                  {!passwordSetup.sendInviteLink && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <div className="relative">
                          <input
                            type={showPasswordSetup ? 'text' : 'password'}
                            name="password"
                            value={passwordSetup.password}
                            onChange={(e) => setPasswordSetup({ ...passwordSetup, password: e.target.value })}
                            className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPasswordSetup(!showPasswordSetup)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                          >
                            {showPasswordSetup ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                        <div className="relative">
                          <input
                            type={showConfirmPasswordSetup ? 'text' : 'password'}
                            name="confirmPassword"
                            value={passwordSetup.confirmPassword}
                            onChange={(e) => setPasswordSetup({ ...passwordSetup, confirmPassword: e.target.value })}
                            className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPasswordSetup(!showConfirmPasswordSetup)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                          >
                            {showConfirmPasswordSetup ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {submitError && (
                  <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-md px-3 py-2">
                    {submitError}
                  </p>
                )}

                <div className="flex flex-col gap-3 mt-6">
                  <button
                    onClick={previousStep}
                    className="w-full px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Previous
                  </button>
                  <button
                    onClick={handleInviteUser}
                    disabled={isSubmitting}
                    className={`w-full px-6 py-2 rounded-lg transition-colors ${
                      isSubmitting
                        ? 'bg-orange-400 text-white cursor-not-allowed opacity-70'
                        : 'bg-orange-500 text-white hover:bg-orange-600'
                    }`}
                  >
                    {isSubmitting ? 'Inviting...' : 'Invite User'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Success Modal */}
      <Modal
        isOpen={showSuccessModal}
        onClose={handleCloseSuccessModal}
        size="sm"
        showCloseButton={false}
      >
        <div className="text-center py-4 sm:py-6">
          <div className="flex justify-center mb-4 sm:mb-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="text-green-600" size={40} />
            </div>
          </div>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Success!</h3>
          <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8 px-2">
            User invited successfully! The new sub vendor has been added to your system.
          </p>
          <button
            onClick={handleCloseSuccessModal}
            className="w-full px-6 py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors text-sm sm:text-base"
          >
            Continue
          </button>
        </div>
      </Modal>
    </div>
  )
}

