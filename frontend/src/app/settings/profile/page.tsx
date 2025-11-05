'use client'

import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'
import { useState, useRef } from 'react'
import { Menu, Camera, Upload, Download, Check, X, Eye, EyeOff, Plus, Trash2, Edit, Search, MoreVertical, ChevronDown, ChevronLeft, ChevronRight, Clock, Bold, Italic, Underline, FileText, Image } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function SettingsProfilePage() {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [activeTab, setActiveTab] = useState('personal')
  
  // Form states
  const [formData, setFormData] = useState({
    fullName: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    streetAddress: '123 Main Street, Apt 4B',
    city: 'New York',
    country: 'United States'
  })

  // File upload states
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [idDocument, setIdDocument] = useState<{
    fileName: string | null
    uploadedDate: string | null
    verified: boolean
    file: File | null
    fileType: string | null
  }>({
    fileName: 'passport_john_doe.pdf',
    uploadedDate: 'Jan 15 2024',
    verified: true,
    file: null,
    fileType: 'pdf'
  })

  // Password states
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  })

  // Sub vendors state
  const [subVendors, setSubVendors] = useState([
    { id: 1, name: 'Touseef Ahmed', role: 'Math', status: 'Active' },
    { id: 2, name: 'Qasim Muneer', role: 'Math', status: 'Active' },
    { id: 3, name: 'Yasir Hafeez', role: 'Math', status: 'Pending' },
    { id: 4, name: 'Junaid Akhtar Butt', role: 'Math', status: 'Active' },
    { id: 5, name: 'Tariq Iqbal', role: 'Math', status: 'Active' },
    { id: 6, name: 'Muhammed Saeed', role: 'Math', status: 'Blocked' },
    { id: 7, name: 'Abdurrahman', role: 'Math', status: 'Active' },
    { id: 8, name: 'Ahmed Ali', role: 'Math', status: 'Pending' },
    { id: 9, name: 'Hassan Khan', role: 'Math', status: 'Active' },
    { id: 10, name: 'Usman Malik', role: 'Math', status: 'Active' },
    { id: 11, name: 'Bilal Sheikh', role: 'Math', status: 'Blocked' },
    { id: 12, name: 'Zain Abbas', role: 'Math', status: 'Active' },
    { id: 13, name: 'Faisal Iqbal', role: 'Math', status: 'Pending' },
    { id: 14, name: 'Imran Khan', role: 'Math', status: 'Active' },
    { id: 15, name: 'Nadeem Ali', role: 'Math', status: 'Active' },
    { id: 16, name: 'Rashid Ahmad', role: 'Math', status: 'Blocked' },
    { id: 17, name: 'Sajid Mahmood', role: 'Math', status: 'Active' },
    { id: 18, name: 'Tahir Hussain', role: 'Math', status: 'Pending' }
  ])

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRow, setSelectedRow] = useState<number | null>(5)
  const [currentPage, setCurrentPage] = useState(1)
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const itemsPerPage = 3 // Show 3 vendors per page (can be adjusted)

  // Refs for textareas
  const termsTextareaRef = useRef<HTMLTextAreaElement>(null)
  const privacyTextareaRef = useRef<HTMLTextAreaElement>(null)

  // Policies form state
  const [policiesData, setPoliciesData] = useState({
    // Business Information
    storeName: '',
    businessEmail: '',
    storeDescription: '',
    businessPhone: '',
    supportHours: '',
    storeAddress: '',
    // Shipping Policy
    estimatedDeliveryTime: '',
    shippingMethod: 'Standard',
    deliveryCoverage: '',
    shippingCharges: '',
    freeShipping: false,
    shippingNotes: '',
    // Refund & Return Policy
    refundEligibility: 'Within 7 days',
    refundMethod: 'To Wallet',
    refundConditions: '',
    returnPolicy: '',
    cancellationPolicy: '',
    returnContactEmail: '',
    // Terms & Additional
    termsAndConditions: '',
    privacyPolicy: '',
    customNotes: ''
  })

  // Form validation
  const [errors, setErrors] = useState<{[key: string]: string}>({})
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  // Refs for file inputs
  const profileImageRef = useRef<HTMLInputElement>(null)
  const idDocumentRef = useRef<HTMLInputElement>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
    // Clear error when user types
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' })
    }
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPasswordData({
      ...passwordData,
      [name]: value
    })
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' })
    }
  }

  const handleProfileImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.match('image/(jpeg|jpg|png|gif)')) {
        alert('Please select a valid image file (JPG, PNG, or GIF)')
        return
      }
      // Validate file size (1MB max)
      if (file.size > 1024 * 1024) {
        alert('File size must be less than 1MB')
        return
      }
      
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfileImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleIdDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      const validTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png']
      if (!validTypes.includes(file.type)) {
        alert('Please select a valid file (PDF, JPG, or PNG)')
        return
      }
      // Validate file size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB')
        return
      }
      
      // Detect file type
      let fileType = 'pdf'
      if (file.type === 'application/pdf') {
        fileType = 'pdf'
      } else if (file.type === 'image/png') {
        fileType = 'png'
      } else if (file.type === 'image/jpeg' || file.type === 'image/jpg') {
        fileType = 'jpg'
      }
      
      setIdDocument({
        fileName: file.name,
        uploadedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        verified: false,
        file: file,
        fileType: fileType
      })
    }
  }

  // Get file icon and label based on file type
  const getFileIcon = (fileType: string | null) => {
    if (!fileType) return { Icon: FileText, label: 'PDF', bgColor: 'bg-teal-500' }
    
    switch (fileType.toLowerCase()) {
      case 'pdf':
        return { Icon: FileText, label: 'PDF', bgColor: 'bg-teal-500' }
      case 'png':
        return { Icon: Image, label: 'PNG', bgColor: 'bg-blue-500' }
      case 'jpg':
      case 'jpeg':
        return { Icon: Image, label: 'JPG', bgColor: 'bg-purple-500' }
      default:
        return { Icon: FileText, label: 'FILE', bgColor: 'bg-gray-500' }
    }
  }

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {}
    
    if (activeTab === 'personal') {
      if (!formData.fullName.trim()) {
        newErrors.fullName = 'Full name is required'
      }
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required'
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Invalid email format'
      }
      if (!formData.phone.trim()) {
        newErrors.phone = 'Phone number is required'
      }
    } else if (activeTab === 'password') {
      if (!passwordData.currentPassword) {
        newErrors.currentPassword = 'Current password is required'
      }
      if (!passwordData.newPassword) {
        newErrors.newPassword = 'New password is required'
      } else if (passwordData.newPassword.length < 8) {
        newErrors.newPassword = 'Password must be at least 8 characters'
      }
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match'
      }
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = async () => {
    if (activeTab === 'policies') {
      // Policies form doesn't require strict validation
      // User can save with empty fields
    } else if (!validateForm()) {
      return
    }

    setIsSaving(true)
    setSaveSuccess(false)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      if (activeTab === 'personal') {
        console.log('Saving personal info:', formData)
        console.log('Profile image:', profileImage ? 'Uploaded' : 'Not changed')
        console.log('ID document:', idDocument.fileName)
      } else if (activeTab === 'password') {
        console.log('Changing password')
        // Reset password form
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
      } else if (activeTab === 'policies') {
        console.log('Saving policies:', policiesData)
      }
      
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (error) {
      console.error('Error saving:', error)
      alert('Failed to save changes. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleAddSubVendor = () => {
    router.push('/settings/profile/add')
  }

  const handleDeleteSubVendor = (id: number) => {
    if (confirm('Are you sure you want to delete this sub vendor?')) {
      setSubVendors(subVendors.filter(v => v.id !== id))
    }
  }

  const filteredVendors = subVendors.filter(vendor =>
    vendor.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getStatusBadgeColor = (status: string) => {
    switch(status) {
      case 'Active':
        return 'bg-green-100 text-green-700'
      case 'Pending':
        return 'bg-yellow-100 text-yellow-700'
      case 'Blocked':
        return 'bg-red-100 text-red-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const getVisiblePages = (totalPages: number) => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }
    if (currentPage <= 3) {
      return [1, 2, 3, null, 7, 8]
    } else if (currentPage >= totalPages - 2) {
      return [1, 2, null, totalPages - 2, totalPages - 1, totalPages]
    } else {
      return [1, 2, null, currentPage - 1, currentPage, currentPage + 1, null, totalPages - 1, totalPages]
    }
  }

  const renderPersonalInfo = () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-1">Personal Information</h2>
        <p className="text-sm text-gray-500">Update your profile details and personal information.</p>
      </div>

      {/* Profile Picture */}
      <div className="flex items-start gap-6 flex-wrap">
        <div className="relative">
          <img 
            src={profileImage || "https://ui-avatars.com/api/?name=John+Doe&size=120&background=random"} 
            alt="Profile" 
            className="w-32 h-32 rounded-full object-cover border-4 border-gray-100"
          />
          <button 
            onClick={() => profileImageRef.current?.click()}
            className="absolute bottom-0 right-0 w-10 h-10 bg-primary-500 text-white rounded-full flex items-center justify-center border-4 border-white hover:bg-primary-600 transition-colors"
            aria-label="Change profile picture"
          >
            <Camera size={18} />
          </button>
          <input
            ref={profileImageRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/gif"
            onChange={handleProfileImageUpload}
            title="Upload profile image"
            className="hidden"
          />
        </div>
        <div className="flex-1 min-w-[200px]">
          <button 
            onClick={() => profileImageRef.current?.click()}
            className="px-6 py-2.5 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-medium mb-2"
          >
            Upload New Photo
          </button>
          <p className="text-xs text-gray-500">JPG, GIF or PNG. 1MB max.</p>
        </div>
      </div>

      {/* Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="fullName">Full Name</label>
          <input
            id="fullName"
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
              errors.fullName ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="email">Email Address</label>
          <input
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="phone">Phone Number</label>
          <input
            id="phone"
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
              errors.phone ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="password">Password</label>
          <div className="flex items-center gap-3">
            <input
              id="password"
              type="password"
              value="---"
              disabled
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
            />
            <button 
              onClick={() => setActiveTab('password')}
              className="text-purple-600 hover:text-purple-700 font-medium text-sm whitespace-nowrap"
            >
              Change
            </button>
          </div>
        </div>
      </div>

      {/* Address Information */}
      <div className="pt-6 border-t border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Address Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="streetAddress">Street Address</label>
            <input
              id="streetAddress"
              type="text"
              name="streetAddress"
              value={formData.streetAddress}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="city">City</label>
            <input
              id="city"
              type="text"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="country">Country</label>
            <select
              id="country"
              name="country"
              value={formData.country}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="United States">United States</option>
              <option value="Canada">Canada</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="Australia">Australia</option>
              <option value="Germany">Germany</option>
              <option value="France">France</option>
            </select>
          </div>
        </div>
      </div>

      {/* ID Verification */}
      <div className="pt-6 border-t border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4">ID Verification</h3>
        
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 sm:p-12 text-center mb-4">
          <div className="flex flex-col items-center justify-center mb-4">
            <Upload className="text-gray-400 mb-2" size={48} />
            <p className="text-lg font-medium text-gray-900 mb-1">Upload ID Document</p>
            <p className="text-sm text-gray-500 mb-4">Upload your CNIC, Passport or any valid government ID.</p>
            <button 
              onClick={() => idDocumentRef.current?.click()}
              className="px-6 py-2.5 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-medium"
            >
              Choose File
            </button>
            <p className="text-xs text-gray-500 mt-3">PDF, JPG, PNG up to 10MB.</p>
          </div>
        </div>
        <input
          ref={idDocumentRef}
          type="file"
          accept="application/pdf,image/jpeg,image/jpg,image/png"
          onChange={handleIdDocumentUpload}
          title="Upload ID document"
          className="hidden"
        />
        
        {idDocument.fileName && (
          <div className={`rounded-lg p-4 flex items-center justify-between gap-4 ${
            idDocument.verified 
              ? 'bg-green-50 border border-green-200' 
              : 'bg-yellow-50 border border-yellow-200'
          }`}>
            {/* Left Section - File Information */}
            <div className="flex items-center gap-4 flex-1 min-w-0">
              {/* File Type Icon */}
              {(() => {
                const { Icon, label, bgColor } = getFileIcon(idDocument.fileType)
                return (
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 relative overflow-hidden ${
                    idDocument.verified ? bgColor : 'bg-yellow-500'
                  }`}>
                    <Icon className="text-white" size={28} />
                    <span className="absolute bottom-0.5 right-0.5 text-[7px] font-bold text-white leading-none">
                      {label}
                    </span>
                  </div>
                )
              })()}
              
              {/* File Name and Status */}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">{idDocument.fileName}</p>
                <p className={`text-sm ${
                  idDocument.verified ? 'text-teal-600' : 'text-yellow-600'
                }`}>
                  {idDocument.verified ? 'Verified' : 'Pending Verification'} - Uploaded on {idDocument.uploadedDate}
                </p>
              </div>
            </div>
            
            {/* Right Section - Status Badge and Download */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                idDocument.verified 
                  ? 'bg-green-100 text-teal-600' 
                  : 'bg-yellow-100 text-yellow-600'
              }`}>
                {idDocument.verified ? 'Verified' : 'Pending'}
              </span>
              {idDocument.file && (
                <button 
                  onClick={() => {
                    const url = URL.createObjectURL(idDocument.file!)
                    const a = document.createElement('a')
                    a.href = url
                    a.download = idDocument.fileName || 'document'
                    a.click()
                    URL.revokeObjectURL(url)
                  }}
                  className={`p-2 rounded-lg transition-colors ${
                    idDocument.verified 
                      ? 'text-teal-600 hover:bg-green-100' 
                      : 'text-yellow-600 hover:bg-yellow-100'
                  }`}
                  aria-label="Download document"
                >
                  <Download size={20} />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )

  const renderPasswordChange = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Update Your Password</h2>

        <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="currentPassword">Current Password</label>
          <div className="relative">
            <input
              id="currentPassword"
              type={showPasswords.current ? 'text' : 'password'}
              name="currentPassword"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              placeholder="Enter Your Current Password"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent pr-10 bg-white"
            />
            <button
              type="button"
              onClick={() => setShowPasswords({...showPasswords, current: !showPasswords.current})}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              aria-label="Toggle password visibility"
            >
              {showPasswords.current ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.currentPassword && <p className="text-red-500 text-xs mt-1">{errors.currentPassword}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="newPassword">New Password</label>
          <div className="relative">
            <input
              id="newPassword"
              type={showPasswords.new ? 'text' : 'password'}
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              placeholder="Enter New Password"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent pr-10 bg-white"
            />
            <button
              type="button"
              onClick={() => setShowPasswords({...showPasswords, new: !showPasswords.new})}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              aria-label="Toggle password visibility"
            >
              {showPasswords.new ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.newPassword && <p className="text-red-500 text-xs mt-1">{errors.newPassword}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="confirmPassword">Confirm Password</label>
          <div className="relative">
            <input
              id="confirmPassword"
              type={showPasswords.confirm ? 'text' : 'password'}
              name="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              placeholder="Confirm New Password"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent pr-10 bg-white"
            />
            <button
              type="button"
              onClick={() => setShowPasswords({...showPasswords, confirm: !showPasswords.confirm})}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              aria-label="Toggle password visibility"
            >
              {showPasswords.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
        </div>

        </div>

        <div className="flex justify-between gap-4 mt-8">
          <button
            onClick={() => {
              setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
              setErrors({})
            }}
            className="px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            Save Password
          </button>
        </div>
      </div>
    </div>
  )

  const renderSubVendors = () => {
    const sortedVendors = [...filteredVendors].sort((a, b) => {
      if (sortOrder === 'asc') {
        return a.name.localeCompare(b.name)
      }
      return b.name.localeCompare(a.name)
    })
    
    // Calculate pagination
    const totalPages = Math.ceil(sortedVendors.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const paginatedVendors = sortedVendors.slice(startIndex, endIndex)
    const visiblePages = getVisiblePages(totalPages)
    
    return (
      <div className="space-y-6">
        {/* Search and Add New Bar */}
        <div className="flex items-center justify-end gap-4">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by Name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={handleAddSubVendor}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2"
          >
            <Plus size={18} />
            <span>Add New</span>
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white border-b border-gray-200">
                <tr>
                  <th className="text-left py-3 px-6 text-sm font-medium text-gray-700">ID:</th>
                  <th className="text-left py-3 px-6 text-sm font-medium text-gray-700">
                    <button
                      onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                      className="flex items-center gap-1 hover:text-gray-900"
                    >
                      Name
                      <ChevronDown size={14} className={sortOrder === 'desc' ? 'transform rotate-180' : ''} />
                    </button>
                  </th>
                  <th className="text-left py-3 px-6 text-sm font-medium text-gray-700">Role</th>
                  <th className="text-left py-3 px-6 text-sm font-medium text-gray-700">Status</th>
                  <th className="text-left py-3 px-6 text-sm font-medium text-gray-700">Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedVendors.map((vendor, index) => {
                  // Calculate sequential ID number based on current page
                  const sequentialId = startIndex + index + 1
                  const isEven = sequentialId % 2 === 0
                  const isSelected = selectedRow === vendor.id
                  
                  return (
                  <tr
                    key={vendor.id}
                    onClick={() => {
                      setSelectedRow(vendor.id)
                      router.push(`/settings/profile/vendors/${vendor.id}`)
                    }}
                    className={`cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-gray-100'
                        : isEven
                        ? 'bg-white'
                        : 'bg-gray-50'
                    } ${isSelected ? 'font-medium' : ''}`}
                  >
                    <td className={`py-3 px-6 text-sm ${isSelected ? 'text-gray-900' : 'text-gray-700'}`}>{sequentialId}</td>
                    <td className={`py-3 px-6 ${isSelected ? 'bg-gray-100' : ''}`}>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center text-white text-xs font-semibold">
                          {vendor.name.charAt(0)}
                        </div>
                        <span className={`text-sm ${isSelected ? 'text-gray-900' : 'text-gray-700'}`}>{vendor.name}</span>
                      </div>
                    </td>
                    <td className={`py-3 px-6 text-sm ${isSelected ? 'bg-gray-100 text-gray-900' : 'text-gray-700'}`}>{vendor.role}</td>
                    <td className={`py-3 px-6 ${isSelected ? 'bg-gray-100' : ''}`}>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(vendor.status)} ${isSelected ? 'bg-gray-100' : ''}`}>
                        {vendor.status}
                      </span>
                    </td>
                    <td className="py-3 px-6">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          router.push(`/settings/profile/vendors/${vendor.id}`)
                        }}
                        className="text-gray-500 hover:text-gray-700"
                        aria-label="More options"
                      >
                        <MoreVertical size={18} />
                      </button>
                    </td>
                  </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="border-t border-gray-200 bg-white px-4 py-3 flex flex-wrap items-center justify-center sm:justify-end gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              type="button"
              className="flex items-center gap-1 text-gray-700 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed px-2 py-1 rounded"
            >
              <ChevronLeft size={16} />
              <span>Back</span>
            </button>

            {visiblePages.map((page, index) => {
              if (page === null) return null
              const showEllipsis = index > 0 && visiblePages[index - 1] !== null && page - visiblePages[index - 1]! > 1
              
              return (
                <div key={page} className="flex items-center gap-2">
                  {showEllipsis && <span className="text-gray-500">...</span>}
            <button
              onClick={() => setCurrentPage(page)}
              type="button"
              className={`min-w-[32px] px-3 py-1 rounded text-sm ${
                currentPage === page
                  ? 'bg-primary-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
                    {page}
                  </button>
                </div>
              )
            })}

            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              type="button"
              className="flex items-center gap-1 text-gray-700 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed px-2 py-1 rounded"
            >
              <span>Next</span>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    )
  }

  const handlePoliciesChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked
    
    setPoliciesData({
      ...policiesData,
      [name]: type === 'checkbox' ? checked : value
    })
  }

  // Format text in textarea
  const formatText = (textareaRef: React.RefObject<HTMLTextAreaElement>, formatType: string) => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = textarea.value.substring(start, end)
    let formattedText = ''

    switch (formatType) {
      case 'bold':
        formattedText = selectedText ? `**${selectedText}**` : '****'
        break
      case 'italic':
        formattedText = selectedText ? `*${selectedText}*` : '**'
        break
      case 'underline':
        formattedText = selectedText ? `<u>${selectedText}</u>` : '<u></u>'
        break
      case 'h1':
        formattedText = selectedText ? `# ${selectedText}` : '# '
        break
      case 'h2':
        formattedText = selectedText ? `## ${selectedText}` : '## '
        break
      case 'h3':
        formattedText = selectedText ? `### ${selectedText}` : '### '
        break
      default:
        return
    }

    // Insert formatted text
    const textBefore = textarea.value.substring(0, start)
    const textAfter = textarea.value.substring(end)
    const newValue = textBefore + formattedText + textAfter

    // Update the textarea value
    if (textarea.name === 'termsAndConditions') {
      setPoliciesData({ ...policiesData, termsAndConditions: newValue })
    } else if (textarea.name === 'privacyPolicy') {
      setPoliciesData({ ...policiesData, privacyPolicy: newValue })
    }

    // Restore cursor position after state update
    setTimeout(() => {
      if (selectedText) {
        textarea.focus()
        textarea.setSelectionRange(start + formattedText.length, start + formattedText.length)
      } else {
        // If no text selected, position cursor between tags
        const cursorPos = formatType === 'bold' ? start + 2 : formatType === 'italic' ? start + 1 : 
                         formatType === 'underline' ? start + 3 : formatType === 'h1' ? start + 2 :
                         formatType === 'h2' ? start + 3 : start + 4
        textarea.focus()
        textarea.setSelectionRange(cursorPos, cursorPos)
      }
    }, 0)
  }

  const renderPolicies = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-1">Vendor Policies & Information</h2>
        <p className="text-sm text-gray-500 mb-2">Manage your business info, shipping policy, refund policy, and other terms, in one place.</p>
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <Clock size={14} />
          <span>Last saved 2 minutes ago</span>
        </div>
      </div>

      <div className="space-y-6 sm:space-y-8">
        {/* Business Information */}
        <div className="bg-white rounded-lg p-4 sm:p-6 space-y-4">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900">Business Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="storeName">Store Name</label>
              <input
                id="storeName"
                type="text"
                name="storeName"
                value={policiesData.storeName}
                onChange={handlePoliciesChange}
                placeholder="TechNova Description"
                tabIndex={0}
                className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent focus:outline-none"
                aria-label="Store name input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="businessEmail">Business Email</label>
              <input
                id="businessEmail"
                type="email"
                name="businessEmail"
                value={policiesData.businessEmail}
                onChange={handlePoliciesChange}
                placeholder="business@yourmail.com"
                tabIndex={0}
                className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent focus:outline-none"
                aria-label="Business email input"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="storeDescription">Store Description</label>
            <textarea
              id="storeDescription"
              name="storeDescription"
              value={policiesData.storeDescription}
              onChange={handlePoliciesChange}
              placeholder="Describe your store, services, and offerings."
              rows={4}
              tabIndex={0}
              className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent focus:outline-none resize-y"
              aria-label="Store description input"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Business Phone (Optional)</label>
              <input
                type="tel"
                name="businessPhone"
                value={policiesData.businessPhone}
                onChange={handlePoliciesChange}
                placeholder="+1 (232) 123-4567"
                className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Support Hours</label>
              <input
                type="text"
                name="supportHours"
                value={policiesData.supportHours}
                onChange={handlePoliciesChange}
                placeholder="Mon-Fri, 9 AM - 5 PM"
                className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Store Address (Optional)</label>
            <input
              type="text"
              name="storeAddress"
              value={policiesData.storeAddress}
              onChange={handlePoliciesChange}
              placeholder="123 Business St, City, State 12345"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Shipping Policy */}
        <div className="bg-white rounded-lg p-4 sm:p-6 space-y-4">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900">Shipping Policy</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Delivery Time</label>
              <input
                type="text"
                name="estimatedDeliveryTime"
                value={policiesData.estimatedDeliveryTime}
                onChange={handlePoliciesChange}
                placeholder="2-5 business days"
                className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Shipping Method</label>
              <select
                name="shippingMethod"
                value={policiesData.shippingMethod}
                onChange={handlePoliciesChange}
                title="Shipping Method"
                className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="Standard">Standard</option>
                <option value="Express">Express</option>
                <option value="Overnight">Overnight</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Coverage</label>
              <input
                type="text"
                name="deliveryCoverage"
                value={policiesData.deliveryCoverage}
                onChange={handlePoliciesChange}
                placeholder="Worldwide"
                className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Shipping Charges</label>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                <input
                  type="text"
                  name="shippingCharges"
                  value={policiesData.shippingCharges}
                  onChange={handlePoliciesChange}
                  placeholder="$5.00"
                  className="flex-1 w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="freeShipping"
                    checked={policiesData.freeShipping}
                    onChange={handlePoliciesChange}
                    className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                  />
                  <span className="text-sm text-gray-700 whitespace-nowrap">Free Shipping</span>
                </label>
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Shipping Notes/Description</label>
            <textarea
              name="shippingNotes"
              value={policiesData.shippingNotes}
              onChange={handlePoliciesChange}
              placeholder="Add detailed shipping conditions, country details, or other policies."
                rows={4}
                className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-y"
            />
          </div>
        </div>

        {/* Refund & Return Policy */}
        <div className="bg-white rounded-lg p-4 sm:p-6 space-y-4">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900">Refund & Return Policy</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Refund Eligibility</label>
              <select
                name="refundEligibility"
                value={policiesData.refundEligibility}
                onChange={handlePoliciesChange}
                title="Refund Eligibility"
                className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="Within 7 days">Within 7 days</option>
                <option value="Within 14 days">Within 14 days</option>
                <option value="Within 30 days">Within 30 days</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Refund Method</label>
              <select
                name="refundMethod"
                value={policiesData.refundMethod}
                onChange={handlePoliciesChange}
                title="Refund Method"
                className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="To Wallet">To Wallet</option>
                <option value="Original Payment">Original Payment</option>
                <option value="Store Credit">Store Credit</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Refund Conditions</label>
            <textarea
              name="refundConditions"
              value={policiesData.refundConditions}
              onChange={handlePoliciesChange}
              placeholder="Detail the when a refund is accepted (e.g., product damaged, wrong item, etc.)"
                rows={4}
                className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-y"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Return Policy</label>
            <textarea
              name="returnPolicy"
              value={policiesData.returnPolicy}
              onChange={handlePoliciesChange}
              placeholder="Mention if items can be returned, how, and under what conditions."
                rows={4}
                className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-y"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cancellation Policy</label>
            <textarea
              name="cancellationPolicy"
              value={policiesData.cancellationPolicy}
              onChange={handlePoliciesChange}
              placeholder="How customers can cancel orders before shipping."
                rows={4}
                className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-y"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Return Contact Email (Optional)</label>
            <input
              type="email"
              name="returnContactEmail"
              value={policiesData.returnContactEmail}
              onChange={handlePoliciesChange}
              placeholder="refunds@yourmail.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Terms & Additional Information */}
        <div className="bg-white rounded-lg p-4 sm:p-6 space-y-4">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900">Terms & Additional Information</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="termsAndConditions">Terms & Conditions</label>
            <div className="border border-gray-300 rounded-lg overflow-hidden">
              <div className="flex items-center gap-1 p-2 border-b border-gray-300 bg-gray-50 overflow-x-auto" role="toolbar" aria-label="Text formatting">
                <button 
                  type="button" 
                  className="p-1.5 hover:bg-gray-200 rounded flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-orange-500" 
                  title="Bold"
                  aria-label="Bold"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); } }}
                >
                  <Bold size={14} className="sm:w-4 sm:h-4" />
                </button>
                <button 
                  type="button" 
                  className="p-1.5 hover:bg-gray-200 rounded flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-orange-500" 
                  title="Italic"
                  aria-label="Italic"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); } }}
                >
                  <Italic size={14} className="sm:w-4 sm:h-4" />
                </button>
                <button 
                  type="button" 
                  className="p-1.5 hover:bg-gray-200 rounded flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-orange-500" 
                  title="Underline"
                  aria-label="Underline"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); } }}
                >
                  <Underline size={14} className="sm:w-4 sm:h-4" />
                </button>
                <div className="h-4 w-px bg-gray-300 mx-1 flex-shrink-0" aria-hidden="true" />
                <button 
                  type="button" 
                  className="px-2 py-1 text-xs hover:bg-gray-200 rounded flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-orange-500" 
                  title="Heading 1"
                  aria-label="Heading 1"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); } }}
                >
                  H1
                </button>
                <button 
                  type="button" 
                  className="px-2 py-1 text-xs hover:bg-gray-200 rounded flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-orange-500" 
                  title="Heading 2"
                  aria-label="Heading 2"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); } }}
                >
                  H2
                </button>
                <button 
                  type="button" 
                  className="px-2 py-1 text-xs hover:bg-gray-200 rounded flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-orange-500" 
                  title="Heading 3"
                  aria-label="Heading 3"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); } }}
                >
                  H3
                </button>
              </div>
              <textarea
                ref={termsTextareaRef}
                id="termsAndConditions"
                name="termsAndConditions"
                value={policiesData.termsAndConditions}
                onChange={handlePoliciesChange}
                placeholder="Enter your terms and conditions..."
                rows={6}
                tabIndex={0}
                className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base focus:ring-2 focus:ring-orange-500 focus:border-transparent focus:outline-none resize-y"
                aria-label="Terms and conditions text input"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="privacyPolicy">Privacy Policy</label>
            <div className="border border-gray-300 rounded-lg overflow-hidden">
              <div className="flex items-center gap-1 p-2 border-b border-gray-300 bg-gray-50 overflow-x-auto" role="toolbar" aria-label="Text formatting">
                <button 
                  type="button" 
                  className="p-1.5 hover:bg-gray-200 rounded flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-orange-500" 
                  title="Bold"
                  aria-label="Bold"
                  tabIndex={0}
                  onClick={() => formatText(privacyTextareaRef, 'bold')}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); formatText(privacyTextareaRef, 'bold'); } }}
                >
                  <Bold size={14} className="sm:w-4 sm:h-4" />
                </button>
                <button 
                  type="button" 
                  className="p-1.5 hover:bg-gray-200 rounded flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-orange-500" 
                  title="Italic"
                  aria-label="Italic"
                  tabIndex={0}
                  onClick={() => formatText(privacyTextareaRef, 'italic')}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); formatText(privacyTextareaRef, 'italic'); } }}
                >
                  <Italic size={14} className="sm:w-4 sm:h-4" />
                </button>
                <button 
                  type="button" 
                  className="p-1.5 hover:bg-gray-200 rounded flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-orange-500" 
                  title="Underline"
                  aria-label="Underline"
                  tabIndex={0}
                  onClick={() => formatText(privacyTextareaRef, 'underline')}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); formatText(privacyTextareaRef, 'underline'); } }}
                >
                  <Underline size={14} className="sm:w-4 sm:h-4" />
                </button>
                <div className="h-4 w-px bg-gray-300 mx-1 flex-shrink-0" aria-hidden="true" />
                <button 
                  type="button" 
                  className="px-2 py-1 text-xs hover:bg-gray-200 rounded flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-orange-500" 
                  title="Heading 1"
                  aria-label="Heading 1"
                  tabIndex={0}
                  onClick={() => formatText(privacyTextareaRef, 'h1')}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); formatText(privacyTextareaRef, 'h1'); } }}
                >
                  H1
                </button>
                <button 
                  type="button" 
                  className="px-2 py-1 text-xs hover:bg-gray-200 rounded flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-orange-500" 
                  title="Heading 2"
                  aria-label="Heading 2"
                  tabIndex={0}
                  onClick={() => formatText(privacyTextareaRef, 'h2')}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); formatText(privacyTextareaRef, 'h2'); } }}
                >
                  H2
                </button>
                <button 
                  type="button" 
                  className="px-2 py-1 text-xs hover:bg-gray-200 rounded flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-orange-500" 
                  title="Heading 3"
                  aria-label="Heading 3"
                  tabIndex={0}
                  onClick={() => formatText(privacyTextareaRef, 'h3')}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); formatText(privacyTextareaRef, 'h3'); } }}
                >
                  H3
                </button>
              </div>
              <textarea
                ref={privacyTextareaRef}
                id="privacyPolicy"
                name="privacyPolicy"
                value={policiesData.privacyPolicy}
                onChange={handlePoliciesChange}
                placeholder="Enter your privacy policy..."
                rows={6}
                tabIndex={0}
                className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base focus:ring-2 focus:ring-orange-500 focus:border-transparent focus:outline-none resize-y"
                aria-label="Privacy policy text input"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="customNotes">Custom Notes</label>
            <textarea
              id="customNotes"
              name="customNotes"
              value={policiesData.customNotes}
              onChange={handlePoliciesChange}
              placeholder="Add any other policies or statements relevant to your business."
              rows={4}
              tabIndex={0}
              className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent focus:outline-none resize-y"
              aria-label="Custom notes text input"
            />
          </div>
        </div>

        {/* Review & Save */}
        <div className="bg-white rounded-lg p-4 sm:p-6">
          <p className="text-xs sm:text-sm text-gray-500 mb-4">Make sure all information is accurate before saving.</p>
          <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-4">
            <button
              onClick={() => {
                // Reset form
                setPoliciesData({
                  storeName: '',
                  businessEmail: '',
                  storeDescription: '',
                  businessPhone: '',
                  supportHours: '',
                  storeAddress: '',
                  estimatedDeliveryTime: '',
                  shippingMethod: 'Standard',
                  deliveryCoverage: '',
                  shippingCharges: '',
                  freeShipping: false,
                  shippingNotes: '',
                  refundEligibility: 'Within 7 days',
                  refundMethod: 'To Wallet',
                  refundConditions: '',
                  returnPolicy: '',
                  cancellationPolicy: '',
                  returnContactEmail: '',
                  termsAndConditions: '',
                  privacyPolicy: '',
                  customNotes: ''
                })
              }}
              type="button"
              tabIndex={0}
              className="w-full sm:w-auto px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-orange-500"
              aria-label="Cancel changes"
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.currentTarget.click(); } }}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              tabIndex={0}
              className={`w-full sm:w-auto px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-orange-500`}
              aria-label={isSaving ? 'Saving changes' : 'Save changes'}
              onKeyDown={(e) => { if ((e.key === 'Enter' || e.key === ' ') && !isSaving) { e.preventDefault(); e.currentTarget.click(); } }}
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  const renderTabContent = () => {
    switch (activeTab) {
      case 'personal':
        return renderPersonalInfo()
      case 'password':
        return renderPasswordChange()
      case 'vendors':
        return renderSubVendors()
      case 'policies':
        return renderPolicies()
      default:
        return renderPersonalInfo()
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
          
          <main className="flex-1 overflow-y-auto p-6">
            <div className="w-full space-y-6">
              {/* Header */}
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
                <p className="text-sm text-gray-500 mt-1">
                  Dashboard {activeTab === 'vendors' ? '> Manage Sub Vendors' : activeTab === 'password' ? '> Change Password' : activeTab === 'policies' ? '> Vendor & Information' : '- Personal Information'}
                </p>
              </div>

              {/* Success Message */}
              {saveSuccess && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
                  <Check className="text-green-600" size={20} />
                  <p className="text-green-800 font-medium">Settings saved successfully!</p>
                </div>
              )}

              {/* Tabs */}
              <div className="bg-white rounded-lg shadow-sm border-b border-gray-200">
                <div className="flex space-x-1 px-6 overflow-x-auto">
                  <button
                    onClick={() => setActiveTab('personal')}
                    className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                      activeTab === 'personal'
                        ? 'border-orange-500 text-orange-500'
                        : 'border-transparent text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Personal Information
                  </button>
                  <button
                    onClick={() => setActiveTab('vendors')}
                    className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                      activeTab === 'vendors'
                        ? 'border-orange-500 text-orange-500'
                        : 'border-transparent text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Manage Sub Vendors
                  </button>
                  <button
                    onClick={() => setActiveTab('password')}
                    className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                      activeTab === 'password'
                        ? 'border-orange-500 text-orange-500'
                        : 'border-transparent text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Change Password
                  </button>
                  <button
                    onClick={() => setActiveTab('policies')}
                    className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                      activeTab === 'policies'
                        ? 'border-orange-500 text-orange-500'
                        : 'border-transparent text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Vendor & Information
                  </button>
                </div>
              </div>

              {/* Main Content Card */}
              <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8">
                {renderTabContent()}

                {/* Action Buttons */}
                {(activeTab === 'personal' || activeTab === 'password') && (
                  <div className="flex items-center justify-between gap-4 pt-6 mt-6 border-t border-gray-200">
                    <button
                      onClick={() => router.back()}
                      className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={isSaving}
                      className={`px-6 py-2.5 rounded-lg transition-colors font-medium ${
                        isSaving
                          ? 'bg-gray-400 text-white cursor-not-allowed'
                          : 'bg-orange-500 text-white hover:bg-orange-600'
                      }`}
                    >
                      {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
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
        
        <main className="mt-14 p-4">
          {/* Header */}
          <div className="mb-4">
            <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
            <p className="text-sm text-gray-500">
              {activeTab === 'vendors' ? 'Manage Sub Vendors' : activeTab === 'password' ? 'Change Password' : activeTab === 'policies' ? 'Vendor & Information' : 'Personal Information'}
            </p>
          </div>

          {/* Success Message */}
          {saveSuccess && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4 flex items-center gap-2">
              <Check className="text-green-600" size={18} />
              <p className="text-green-800 text-sm font-medium">Saved successfully!</p>
            </div>
          )}

          {/* Mobile Tabs */}
          <div className="flex overflow-x-auto gap-2 mb-4 pb-2 scrollbar-hide">
            <button
              onClick={() => setActiveTab('personal')}
              className={`px-4 py-2 text-sm font-medium whitespace-nowrap border-b-2 ${
                activeTab === 'personal' ? 'border-orange-500 text-orange-500' : 'border-transparent text-gray-600'
              }`}
            >
              Personal
            </button>
            <button
              onClick={() => setActiveTab('vendors')}
              className={`px-4 py-2 text-sm font-medium whitespace-nowrap border-b-2 ${
                activeTab === 'vendors' ? 'border-orange-500 text-orange-500' : 'border-transparent text-gray-600'
              }`}
            >
              Sub Vendors
            </button>
            <button
              onClick={() => setActiveTab('password')}
              className={`px-4 py-2 text-sm font-medium whitespace-nowrap border-b-2 ${
                activeTab === 'password' ? 'border-orange-500 text-orange-500' : 'border-transparent text-gray-600'
              }`}
            >
              Password
            </button>
            <button
              onClick={() => setActiveTab('policies')}
              className={`px-4 py-2 text-sm font-medium whitespace-nowrap border-b-2 ${
                activeTab === 'policies' ? 'border-orange-500 text-orange-500' : 'border-transparent text-gray-600'
              }`}
            >
              Policies
            </button>
          </div>

          {/* Mobile Content */}
          <div className="bg-white rounded-lg shadow-sm p-4 space-y-6">
            {renderTabContent()}

            {/* Action Buttons - Mobile */}
            {(activeTab === 'personal' || activeTab === 'password' || activeTab === 'policies') && (
              <div className="flex gap-3 pt-4 border-t">
                <button
                  onClick={() => {
                    if (activeTab === 'policies') {
                      // Reset policies form
                      setPoliciesData({
                        storeName: '',
                        businessEmail: '',
                        storeDescription: '',
                        businessPhone: '',
                        supportHours: '',
                        storeAddress: '',
                        estimatedDeliveryTime: '',
                        shippingMethod: 'Standard',
                        deliveryCoverage: '',
                        shippingCharges: '',
                        freeShipping: false,
                        shippingNotes: '',
                        refundEligibility: 'Within 7 days',
                        refundMethod: 'To Wallet',
                        refundConditions: '',
                        returnPolicy: '',
                        cancellationPolicy: '',
                        returnContactEmail: '',
                        termsAndConditions: '',
                        privacyPolicy: '',
                        customNotes: ''
                      })
                    } else {
                      router.back()
                    }
                  }}
                  className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className={`flex-1 px-4 py-2.5 rounded-lg font-medium ${
                    isSaving
                      ? 'bg-gray-400 text-white cursor-not-allowed'
                      : 'bg-orange-500 text-white hover:bg-orange-600'
                    }`}
                >
                  {isSaving ? 'Saving...' : activeTab === 'policies' ? 'Save Changes' : 'Save'}
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
