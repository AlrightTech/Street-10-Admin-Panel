'use client'

import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'
import Modal from '@/components/ui/Modal'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Menu, Eye, EyeOff, Check, ChevronUp, ChevronDown, Megaphone, Settings, DollarSign, Headphones, FolderOpen, Users as UsersIcon, ShoppingCart, Ticket, CheckCircle } from 'lucide-react'

export default function AddNewSubAdminPage() {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  
  // Step 1: Basic Info
  const [basicInfo, setBasicInfo] = useState({
    fullName: 'Touseef Ahmed',
    email: 'alice.johnson@example.com',
    password: '********',
    confirmPassword: '********',
    status: 'active'
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
  // Step 2: Role Assignment
  const [selectedRole, setSelectedRole] = useState<string | null>('marketing-admin')
  
  // Step 3: Permission Control
  const [expandedGroups, setExpandedGroups] = useState<{[key: string]: boolean}>({
    productManagement: true,
    userManagement: false,
    orderManagement: false,
    supportTickets: false
  })
  const [permissions, setPermissions] = useState<{[key: string]: boolean}>({
    // Product Management
    'viewProducts': true,
    'editProducts': false,
    'deleteProducts': false,
    'approveProducts': false,
    // User Management
    'viewUsers': true,
    'editUsers': false,
    'deleteUsers': false,
    'manageRoles': false,
    // Order Management
    'viewOrders': true,
    'updateOrderStatus': false,
    'manageShipments': false,
    'viewPaymentMethods': false,
    // Support Tickets
    'viewTickets': false,
    'respondTickets': false,
    'assignTickets': false,
    'closeTickets': false
  })
  const [selectAllGroups, setSelectAllGroups] = useState<{[key: string]: boolean}>({
    productManagement: false,
    userManagement: false,
    orderManagement: false,
    supportTickets: false
  })

  const handleBasicInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setBasicInfo({
      ...basicInfo,
      [name]: value
    })
  }

  const togglePermission = (permissionKey: string) => {
    setPermissions({
      ...permissions,
      [permissionKey]: !permissions[permissionKey]
    })
  }

  const toggleGroup = (groupKey: string) => {
    setExpandedGroups({
      ...expandedGroups,
      [groupKey]: !expandedGroups[groupKey]
    })
  }

  const toggleSelectAll = (groupKey: string, permissionKeys: string[]) => {
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

  const getPermissionCount = (permissionKeys: string[]) => {
    const granted = permissionKeys.filter(key => permissions[key]).length
    return { granted, total: permissionKeys.length }
  }

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
    }
  }

  const previousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = () => {
    // Handle form submission
    setShowSuccessModal(true)
  }

  const handleSuccessClose = () => {
    setShowSuccessModal(false)
    router.push('/sub-admin/users')
  }

  const roleOptions = [
    {
      id: 'marketing-admin',
      title: 'Marketing Admin',
      description: 'Manages campaigns, content, and marketing analytics.',
      icon: Megaphone,
      color: 'bg-pink-100 text-pink-600'
    },
    {
      id: 'operation-admin',
      title: 'Operation Admin',
      description: 'Handles products, orders, and operational tasks.',
      icon: Settings,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      id: 'finance-admin',
      title: 'Finance Admin',
      description: 'Access to financial reports and budget management.',
      icon: DollarSign,
      color: 'bg-green-100 text-green-600'
    },
    {
      id: 'support-admin',
      title: 'Support Admin',
      description: 'Manages customer support and ticket resolution.',
      icon: Headphones,
      color: 'bg-orange-100 text-orange-600'
    }
  ]

  const permissionGroups = [
    {
      key: 'productManagement',
      title: 'Product Management',
      icon: FolderOpen,
      permissions: [
        { key: 'viewProducts', label: 'View Products' },
        { key: 'editProducts', label: 'Edit Products' },
        { key: 'deleteProducts', label: 'Delete Products' },
        { key: 'approveProducts', label: 'Approve Products' }
      ]
    },
    {
      key: 'userManagement',
      title: 'User Management',
      icon: UsersIcon,
      permissions: [
        { key: 'viewUsers', label: 'View Users' },
        { key: 'editUsers', label: 'Edit Users' },
        { key: 'deleteUsers', label: 'Delete Users' },
        { key: 'manageRoles', label: 'Manage Roles' }
      ]
    },
    {
      key: 'orderManagement',
      title: 'Order Management',
      icon: ShoppingCart,
      permissions: [
        { key: 'viewOrders', label: 'View Orders' },
        { key: 'updateOrderStatus', label: 'Update Order Status' },
        { key: 'manageShipments', label: 'Manage Shipments' },
        { key: 'viewPaymentMethods', label: 'View Payment Methods' }
      ]
    },
    {
      key: 'supportTickets',
      title: 'Support Tickets',
      icon: Ticket,
      permissions: [
        { key: 'viewTickets', label: 'View Tickets' },
        { key: 'respondTickets', label: 'Respond Tickets' },
        { key: 'assignTickets', label: 'Assign Tickets' },
        { key: 'closeTickets', label: 'Close Tickets' }
      ]
    }
  ]

  const selectedRoleName = roleOptions.find(r => r.id === selectedRole)?.title || 'Marketing Admin'

  return (
    <div className="min-h-screen bg-gray-50">
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-[45] bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      <div className="hidden lg:flex h-screen overflow-hidden">
        {!sidebarCollapsed && (
          <div className="w-64 flex-shrink-0 bg-primary-500 h-screen overflow-y-auto">
            <Sidebar onClose={() => setSidebarCollapsed(true)} currentPage="subAdminUsers" />
          </div>
        )}
        
        {sidebarCollapsed && (
          <button
            onClick={() => setSidebarCollapsed(false)}
            className="fixed left-0 top-4 z-30 bg-primary-500 text-white p-2 rounded-r-lg hover:bg-primary-600 transition-colors"
            aria-label="Toggle sidebar"
          >
            <Menu size={24} />
          </button>
        )}

        <div className={`flex-1 flex flex-col h-screen overflow-hidden bg-gray-50 ${sidebarCollapsed ? 'w-full' : ''}`}>
          <div className="flex-shrink-0 sticky top-0 z-10 bg-white border-b border-gray-200">
            <Header />
          </div>
          
          <main className="flex-1 overflow-y-auto overflow-x-hidden p-6">
            <div className="max-w-4xl mx-auto">
              {/* Breadcrumb */}
              <div className="mb-2">
                <p className="text-sm text-gray-500">Dashboard - Users</p>
              </div>

              {/* Page Title */}
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Add New Sub Admin</h1>
              <p className="text-gray-600 mb-8">Create a new admin user with custom permissions</p>

              {/* Multi-step Progress Indicator */}
              <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                <div className="flex items-center justify-between">
                  {/* Step 1: Basic Info */}
                  <div className="flex flex-col items-center flex-1">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg mb-2 ${
                      currentStep > 1 ? 'bg-orange-500' : currentStep === 1 ? 'bg-orange-500' : 'bg-gray-300'
                    }`}>
                      {currentStep > 1 ? (
                        <Check className="text-white" size={20} />
                      ) : (
                        <span className="text-white">1</span>
                      )}
                    </div>
                    <p className={`font-semibold text-center mb-1 ${
                      currentStep >= 1 ? 'text-gray-900' : 'text-gray-500'
                    }`}>
                      Basic Info
                    </p>
                    <p className="text-xs text-gray-500 text-center">Personal details and credentials</p>
                  </div>

                  <div className={`flex-1 h-0.5 mx-4 ${currentStep >= 2 ? 'bg-orange-500' : 'bg-gray-300'}`} />

                  {/* Step 2: Role Assignment */}
                  <div className="flex flex-col items-center flex-1">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg mb-2 ${
                      currentStep > 2 ? 'bg-orange-500' : currentStep === 2 ? 'bg-orange-500' : 'bg-gray-300'
                    }`}>
                      {currentStep > 2 ? (
                        <Check className="text-white" size={20} />
                      ) : (
                        <span className={currentStep >= 2 ? 'text-white' : 'text-gray-600'}>2</span>
                      )}
                    </div>
                    <p className={`font-semibold text-center mb-1 ${
                      currentStep >= 2 ? 'text-gray-900' : 'text-gray-500'
                    }`}>
                      Role Assignment
                    </p>
                    <p className="text-xs text-gray-500 text-center">Select admin role and responsibilities</p>
                  </div>

                  <div className={`flex-1 h-0.5 mx-4 ${currentStep >= 3 ? 'bg-orange-500' : 'bg-gray-300'}`} />

                  {/* Step 3: Permission Control */}
                  <div className="flex flex-col items-center flex-1">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg mb-2 ${
                      currentStep === 3 ? 'bg-orange-500' : 'bg-gray-300'
                    }`}>
                      <span className={currentStep === 3 ? 'text-white' : 'text-gray-600'}>3</span>
                    </div>
                    <p className={`font-semibold text-center mb-1 ${
                      currentStep === 3 ? 'text-gray-900' : 'text-gray-500'
                    }`}>
                      Permission Control
                    </p>
                    <p className="text-xs text-gray-500 text-center">Customize access permissions</p>
                  </div>
                </div>
              </div>

              {/* Step 1: Basic Information */}
              {currentStep === 1 && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">Basic Information</h2>
                  <p className="text-gray-600 mb-6">Enter the admin user's personal details and login credentials</p>

                  <div className="space-y-6">
                    {/* Full Name */}
                    <div>
                      <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={basicInfo.fullName}
                        onChange={handleBasicInfoChange}
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                        placeholder="Enter full name"
                      />
                    </div>

                    {/* Email Address */}
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={basicInfo.email}
                        onChange={handleBasicInfoChange}
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                        placeholder="Enter email address"
                      />
                    </div>

                    {/* Password */}
                    <div>
                      <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                        Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          id="password"
                          name="password"
                          value={basicInfo.password}
                          onChange={handleBasicInfoChange}
                          className="mt-1 block w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                          placeholder="Enter password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                          aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>

                    {/* Confirm Password */}
                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          id="confirmPassword"
                          name="confirmPassword"
                          value={basicInfo.confirmPassword}
                          onChange={handleBasicInfoChange}
                          className="mt-1 block w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                          placeholder="Confirm password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                          aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                        >
                          {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>

                    {/* Status */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Status
                      </label>
                      <div className="flex items-center space-x-4">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="status"
                            value="active"
                            checked={basicInfo.status === 'active'}
                            onChange={handleBasicInfoChange}
                            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300"
                          />
                          <span className="ml-2 text-sm text-gray-700">Active</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="status"
                            value="inactive"
                            checked={basicInfo.status === 'inactive'}
                            onChange={handleBasicInfoChange}
                            className="h-4 w-4 text-gray-600 focus:ring-gray-500 border-gray-300"
                          />
                          <span className="ml-2 text-sm text-gray-700">Inactive</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Next Step Button */}
                  <div className="mt-8 flex justify-end">
                    <button
                      type="button"
                      onClick={nextStep}
                      className="px-6 py-2 bg-orange-500 text-white rounded-lg shadow-sm hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                    >
                      Next Step
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Role Assignment */}
              {currentStep === 2 && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">Role Assignment</h2>
                  <p className="text-gray-600 mb-6">Select an admin role. Default permissions will be applied automatically.</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    {roleOptions.map((role) => {
                      const Icon = role.icon
                      const isSelected = selectedRole === role.id
                      return (
                        <div
                          key={role.id}
                          onClick={() => setSelectedRole(role.id)}
                          className={`relative border-2 rounded-lg p-4 cursor-pointer transition-all ${
                            isSelected 
                              ? 'border-orange-500 bg-orange-50' 
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3 flex-1">
                              <div className={`p-2 rounded-lg ${role.color}`}>
                                <Icon size={24} />
                              </div>
                              <div className="flex-1">
                                <h3 className="font-semibold text-gray-900 mb-1">{role.title}</h3>
                                <p className="text-sm text-gray-600">{role.description}</p>
                              </div>
                            </div>
                            <div className={`w-5 h-5 border-2 rounded flex items-center justify-center flex-shrink-0 ${
                              isSelected 
                                ? 'border-orange-500 bg-orange-500' 
                                : 'border-gray-300'
                            }`}>
                              {isSelected && <Check size={14} className="text-white" />}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  {/* Navigation Buttons */}
                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={previousStep}
                      className="px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                    >
                      Previous
                    </button>
                    <button
                      type="button"
                      onClick={nextStep}
                      className="px-6 py-2 bg-orange-500 text-white rounded-lg shadow-sm hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                    >
                      Next Step
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Permission Control */}
              {currentStep === 3 && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">Permission Control</h2>
                  <p className="text-gray-600 mb-6">
                    Customize access permissions for the selected role:{' '}
                    <span className="text-blue-600 font-semibold">{selectedRoleName}</span>
                  </p>

                  <div className="space-y-4">
                    {permissionGroups.map((group) => {
                      const Icon = group.icon
                      const permissionKeys = group.permissions.map(p => p.key)
                      const { granted, total } = getPermissionCount(permissionKeys)
                      const isExpanded = expandedGroups[group.key]
                      const allSelected = selectAllGroups[group.key]

                      return (
                        <div key={group.key} className="border border-gray-200 rounded-lg overflow-hidden">
                          {/* Header */}
                          <div 
                            className="flex items-center justify-between p-4 bg-gray-50 cursor-pointer"
                            onClick={() => toggleGroup(group.key)}
                          >
                            <div className="flex items-center gap-3 flex-1">
                              <Icon size={20} className="text-gray-600" />
                              <div>
                                <h3 className="font-semibold text-gray-900">{group.title}</h3>
                                <p className="text-xs text-gray-500">{granted} of {total} permissions granted</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-700">Select All</span>
                                <input
                                  type="checkbox"
                                  checked={allSelected}
                                  onChange={(e) => {
                                    e.stopPropagation()
                                    toggleSelectAll(group.key, permissionKeys)
                                  }}
                                  className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                                />
                              </div>
                              {isExpanded ? (
                                <ChevronUp size={20} className="text-gray-400" />
                              ) : (
                                <ChevronDown size={20} className="text-gray-400" />
                              )}
                            </div>
                          </div>

                          {/* Permissions Grid */}
                          {isExpanded && (
                            <div className="p-4 bg-white">
                              <div className="grid grid-cols-2 gap-4">
                                {group.permissions.map((permission) => (
                                  <label
                                    key={permission.key}
                                    className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50"
                                  >
                                    <input
                                      type="checkbox"
                                      checked={permissions[permission.key]}
                                      onChange={() => togglePermission(permission.key)}
                                      className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                                    />
                                    <span className="text-sm text-gray-700">{permission.label}</span>
                                  </label>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>

                  {/* Navigation Buttons */}
                  <div className="mt-8 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={previousStep}
                      className="px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                    >
                      Previous
                    </button>
                    <button
                      type="button"
                      onClick={handleSubmit}
                      className="px-6 py-2 bg-orange-500 text-white rounded-lg shadow-sm hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                    >
                      Next Step
                    </button>
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden">
        {sidebarOpen && (
          <div 
            className="fixed inset-0 z-[45] bg-black bg-opacity-50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        
        <div className={`
          fixed inset-y-0 left-0 z-[60] w-64 transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <Sidebar onClose={() => setSidebarOpen(false)} currentPage="subAdminUsers" />
        </div>

        <div className="flex-1 flex flex-col min-h-screen bg-gray-50 pt-20 lg:pt-0">
          <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} isSidebarOpen={sidebarOpen} />
          <main className="flex-1 overflow-x-hidden overflow-y-auto p-4">
            <div className="max-w-4xl mx-auto">
              <div className="mb-2">
                <p className="text-xs text-gray-500">Dashboard - Users</p>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Add New Sub Admin</h1>
              <p className="text-gray-600 mb-6 text-sm">Create a new admin user with custom permissions</p>

              {/* Mobile Progress Indicator */}
              <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                <div className="flex justify-between items-center text-xs">
                  <div className="flex flex-col items-center flex-1">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold mb-1 ${
                      currentStep >= 1 ? 'bg-orange-500 text-white' : 'bg-gray-300 text-gray-600'
                    }`}>
                      {currentStep > 1 ? <Check size={12} /> : '1'}
                    </div>
                    <p className="font-semibold text-center">Basic</p>
                  </div>
                  <div className={`flex-1 h-0.5 mx-2 ${currentStep >= 2 ? 'bg-orange-500' : 'bg-gray-300'}`} />
                  <div className="flex flex-col items-center flex-1">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold mb-1 ${
                      currentStep >= 2 ? 'bg-orange-500 text-white' : 'bg-gray-300 text-gray-600'
                    }`}>
                      {currentStep > 2 ? <Check size={12} /> : '2'}
                    </div>
                    <p className="font-semibold text-center">Role</p>
                  </div>
                  <div className={`flex-1 h-0.5 mx-2 ${currentStep >= 3 ? 'bg-orange-500' : 'bg-gray-300'}`} />
                  <div className="flex flex-col items-center flex-1">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold mb-1 ${
                      currentStep === 3 ? 'bg-orange-500 text-white' : 'bg-gray-300 text-gray-600'
                    }`}>
                      3
                    </div>
                    <p className="font-semibold text-center">Permissions</p>
                  </div>
                </div>
              </div>

              {/* Mobile Step Content - Same as desktop but with responsive adjustments */}
              {currentStep === 1 && (
                <div className="bg-white rounded-lg shadow-sm p-4">
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">Basic Information</h2>
                  <p className="text-gray-600 mb-4 text-sm">Enter the admin user's personal details and login credentials</p>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                      <input
                        type="text"
                        name="fullName"
                        value={basicInfo.fullName}
                        onChange={handleBasicInfoChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        value={basicInfo.email}
                        onChange={handleBasicInfoChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          name="password"
                          value={basicInfo.password}
                          onChange={handleBasicInfoChange}
                          className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg text-sm"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400"
                        >
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          name="confirmPassword"
                          value={basicInfo.confirmPassword}
                          onChange={handleBasicInfoChange}
                          className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg text-sm"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400"
                        >
                          {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                      <div className="flex gap-4">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="status"
                            value="active"
                            checked={basicInfo.status === 'active'}
                            onChange={handleBasicInfoChange}
                            className="h-4 w-4 text-purple-600"
                          />
                          <span className="ml-2 text-sm">Active</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="status"
                            value="inactive"
                            checked={basicInfo.status === 'inactive'}
                            onChange={handleBasicInfoChange}
                            className="h-4 w-4 text-gray-600"
                          />
                          <span className="ml-2 text-sm">Inactive</span>
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 flex justify-end">
                    <button
                      onClick={nextStep}
                      className="px-5 py-2 bg-orange-500 text-white rounded-lg text-sm"
                    >
                      Next Step
                    </button>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="bg-white rounded-lg shadow-sm p-4">
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">Role Assignment</h2>
                  <p className="text-gray-600 mb-4 text-sm">Select an admin role. Default permissions will be applied automatically.</p>
                  <div className="space-y-3 mb-6">
                    {roleOptions.map((role) => {
                      const Icon = role.icon
                      const isSelected = selectedRole === role.id
                      return (
                        <div
                          key={role.id}
                          onClick={() => setSelectedRole(role.id)}
                          className={`border-2 rounded-lg p-3 ${isSelected ? 'border-orange-500 bg-orange-50' : 'border-gray-200'}`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 flex-1">
                              <div className={`p-2 rounded-lg ${role.color}`}>
                                <Icon size={20} />
                              </div>
                              <div>
                                <h3 className="font-semibold text-sm">{role.title}</h3>
                                <p className="text-xs text-gray-600">{role.description}</p>
                              </div>
                            </div>
                            <div className={`w-5 h-5 border-2 rounded ${isSelected ? 'border-orange-500 bg-orange-500' : 'border-gray-300'}`}>
                              {isSelected && <Check size={12} className="text-white" />}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={previousStep}
                      className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm"
                    >
                      Previous
                    </button>
                    <button
                      onClick={nextStep}
                      className="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm"
                    >
                      Next Step
                    </button>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="bg-white rounded-lg shadow-sm p-4">
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">Permission Control</h2>
                  <p className="text-gray-600 mb-4 text-sm">
                    Customize access permissions for the selected role:{' '}
                    <span className="text-blue-600 font-semibold">{selectedRoleName}</span>
                  </p>
                  <div className="space-y-3">
                    {permissionGroups.map((group) => {
                      const Icon = group.icon
                      const permissionKeys = group.permissions.map(p => p.key)
                      const { granted, total } = getPermissionCount(permissionKeys)
                      const isExpanded = expandedGroups[group.key]
                      const allSelected = selectAllGroups[group.key]

                      return (
                        <div key={group.key} className="border border-gray-200 rounded-lg overflow-hidden">
                          <div 
                            className="flex items-center justify-between p-3 bg-gray-50"
                            onClick={() => toggleGroup(group.key)}
                          >
                            <div className="flex items-center gap-2 flex-1">
                              <Icon size={18} className="text-gray-600" />
                              <div>
                                <h3 className="font-semibold text-sm">{group.title}</h3>
                                <p className="text-xs text-gray-500">{granted} of {total} granted</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs">Select All</span>
                              <input
                                type="checkbox"
                                checked={allSelected}
                                onChange={(e) => {
                                  e.stopPropagation()
                                  toggleSelectAll(group.key, permissionKeys)
                                }}
                                className="h-3 w-3"
                              />
                              {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                            </div>
                          </div>
                          {isExpanded && (
                            <div className="p-3 space-y-2">
                              {group.permissions.map((permission) => (
                                <label key={permission.key} className="flex items-center gap-2 p-2 border rounded">
                                  <input
                                    type="checkbox"
                                    checked={permissions[permission.key]}
                                    onChange={() => togglePermission(permission.key)}
                                    className="h-3 w-3"
                                  />
                                  <span className="text-xs">{permission.label}</span>
                                </label>
                              ))}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                  <div className="mt-6 flex justify-end gap-2">
                    <button
                      onClick={previousStep}
                      className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm"
                    >
                      Previous
                    </button>
                    <button
                      onClick={handleSubmit}
                      className="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm"
                    >
                      Next Step
                    </button>
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      {/* Success Modal */}
      <Modal
        isOpen={showSuccessModal}
        onClose={handleSuccessClose}
        title="Success"
        size="sm"
      >
        <div className="text-center py-4">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Sub Admin Created Successfully!</h3>
          <p className="text-sm text-gray-600 mb-6">
            The new sub admin user has been created and can now access the system with the assigned permissions.
          </p>
          <button
            onClick={handleSuccessClose}
            className="w-full px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            Continue
          </button>
        </div>
      </Modal>
    </div>
  )
}

