import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'
import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Menu, Upload, X, ChevronDown, Info, FileText, Image as ImageIcon, CheckCircle2, Loader2 } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { ButtonLoader } from '@/components/ui/Loader'
import ErrorModal from '@/components/ui/ErrorModal'
import SuccessModal from '@/components/ui/SuccessModal'

interface UploadedFile {
  file: File
  preview: string
  name: string
  id: string
  size: number
  status?: 'uploading' | 'success' | 'error'
}

export default function AddProductPage() {
  const navigate = useNavigate()
  const { t } = useLanguage()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)
  const [errors, setErrors] = useState<{[key: string]: string}>({})
  const [successModal, setSuccessModal] = useState({ isOpen: false, message: '', title: '' })
  const [errorModal, setErrorModal] = useState({ isOpen: false, message: '', title: '' })
  
  // File upload refs and states
  const mediaInputRef = useRef<HTMLInputElement>(null)
  const documentInputRef = useRef<HTMLInputElement>(null)
  const [mediaFiles, setMediaFiles] = useState<UploadedFile[]>([])
  const [documentFiles, setDocumentFiles] = useState<UploadedFile[]>([])
  const [isDraggingMedia, setIsDraggingMedia] = useState(false)
  const [isDraggingDoc, setIsDraggingDoc] = useState(false)

  const [formData, setFormData] = useState({
    title: '',
    category: '',
    condition: '',
    description: '',
    price: '0.0',
    discountPrice: '0.0',
    stockQuantity: '0.0',
    stockStatus: '0.0',
    brand: '0.0',
    weight: '0.0',
    dimensions: '0.0',
    metaTitle: '',
    metaDescription: '',
    slug: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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

  // Validation function
  const validateForm = (): boolean => {
    const newErrors: {[key: string]: string} = {}

    // Required fields
    if (!formData.title.trim()) {
      newErrors.title = t('titleRequired') || 'Product title is required'
    }
    if (!formData.category) {
      newErrors.category = t('categoryRequired') || 'Category is required'
    }
    if (!formData.condition) {
      newErrors.condition = t('conditionRequired') || 'Condition is required'
    }
    if (!formData.description.trim()) {
      newErrors.description = t('descriptionRequired') || 'Description is required'
    }
    if (!formData.price.trim()) {
      newErrors.price = t('priceRequired') || 'Price is required'
    } else if (isNaN(parseFloat(formData.price)) || parseFloat(formData.price) <= 0) {
      newErrors.price = t('priceInvalid') || 'Price must be a valid positive number'
    }
    if (!formData.stockQuantity.trim()) {
      newErrors.stockQuantity = t('stockRequired') || 'Stock quantity is required'
    } else if (isNaN(parseInt(formData.stockQuantity)) || parseInt(formData.stockQuantity) < 0) {
      newErrors.stockQuantity = t('stockInvalid') || 'Stock quantity must be a valid non-negative number'
    }
    if (formData.discountPrice && (isNaN(parseFloat(formData.discountPrice)) || parseFloat(formData.discountPrice) <= 0)) {
      newErrors.discountPrice = t('discountPriceInvalid') || 'Discount price must be a valid positive number'
    }
    if (formData.discountPrice && formData.price && parseFloat(formData.discountPrice) >= parseFloat(formData.price)) {
      newErrors.discountPrice = t('discountPriceMustBeLess') || 'Discount price must be less than regular price'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handlePublish = async () => {
    // Validate form
    if (!validateForm()) {
      setErrorModal({
        isOpen: true,
        title: t('validationError') || 'Validation Error',
        message: t('pleaseFixErrors') || 'Please fix all errors before publishing'
      })
      // Scroll to first error
      setTimeout(() => {
        const firstErrorField = Object.keys(errors)[0]
        if (firstErrorField) {
          const element = document.querySelector(`[name="${firstErrorField}"]`)
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' })
            if (element instanceof HTMLElement) {
              element.focus()
            }
          }
        }
      }, 100)
      return
    }

    setIsPublishing(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800))
      setSuccessModal({
        isOpen: true,
        title: t('productPublished') || 'Product Published',
        message: t('productPublishedSuccess') || 'Product has been published successfully!'
      })
    } catch (error) {
      setErrorModal({
        isOpen: true,
        title: t('publishFailed') || 'Publish Failed',
        message: t('productPublishFailed') || 'Failed to publish product. Please try again.'
      })
    } finally {
      setIsPublishing(false)
    }
  }

  const handleCancel = () => {
    navigate('/products')
  }

  // File upload handlers - Opens file browser
  const handleMediaClick = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    if (mediaInputRef.current) {
      mediaInputRef.current.click()
    }
  }

  const handleDocumentClick = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    if (documentInputRef.current) {
      documentInputRef.current.click()
    }
  }

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  // Handle media file change
  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    files.forEach(file => {
      // Validate image file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
      if (!validTypes.includes(file.type.toLowerCase())) {
        alert(`${file.name}: Invalid file type. Please select JPEG, PNG, GIF, or WebP image.`)
        return
      }
      
      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024
      if (file.size > maxSize) {
        alert(`${file.name}: File size too large. Maximum size is 5MB.`)
        return
      }

      const fileId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      const newFile: UploadedFile = {
        file,
        preview: '',
        name: file.name,
        id: fileId,
        size: file.size,
        status: 'uploading'
      }

      setMediaFiles(prev => [...prev, newFile])

      const reader = new FileReader()
      reader.onloadend = () => {
        setMediaFiles(prev => prev.map(f => 
          f.id === fileId 
            ? { ...f, preview: reader.result as string, status: 'success' as const }
            : f
        ))
      }
      reader.onerror = () => {
        setMediaFiles(prev => prev.filter(f => f.id !== fileId))
        alert(`${file.name}: Failed to read file`)
      }
      reader.readAsDataURL(file)
    })

    // Reset input
    if (e.target) {
      e.target.value = ''
    }
  }

  // Handle document file change
  const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    files.forEach(file => {
      const validExtensions = ['.pdf', '.doc', '.docx', '.txt']
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase()
      
      if (!validExtensions.includes(fileExtension)) {
        alert(`${file.name}: Invalid file type. Please select PDF, DOC, DOCX, or TXT file.`)
        return
      }

      const maxSize = 10 * 1024 * 1024
      if (file.size > maxSize) {
        alert(`${file.name}: File size too large. Maximum size is 10MB.`)
        return
      }

      const fileId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      const newFile: UploadedFile = {
        file,
        preview: '',
        name: file.name,
        id: fileId,
        size: file.size,
        status: 'uploading'
      }

      setDocumentFiles(prev => [...prev, newFile])

      const reader = new FileReader()
      reader.onloadend = () => {
        setDocumentFiles(prev => prev.map(f => 
          f.id === fileId 
            ? { ...f, preview: reader.result as string, status: 'success' as const }
            : f
        ))
      }
      reader.onerror = () => {
        setDocumentFiles(prev => prev.filter(f => f.id !== fileId))
        alert(`${file.name}: Failed to read file`)
      }
      reader.readAsDataURL(file)
    })

    // Reset input
    if (e.target) {
      e.target.value = ''
    }
  }

  // Remove media file
  const removeMediaFile = (id: string) => {
    setMediaFiles(prev => prev.filter(f => f.id !== id))
  }

  // Remove document file
  const removeDocumentFile = (id: string) => {
    setDocumentFiles(prev => prev.filter(f => f.id !== id))
  }

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleMediaDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDraggingMedia(false)
    
    const files = Array.from(e.dataTransfer.files)
    if (files.length === 0) return

    files.forEach(file => {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
      if (!validTypes.includes(file.type.toLowerCase())) {
        alert(`${file.name}: Invalid file type`)
        return
      }
      
      const maxSize = 5 * 1024 * 1024
      if (file.size > maxSize) {
        alert(`${file.name}: File size too large (Max: 5MB)`)
        return
      }

      const fileId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      const newFile: UploadedFile = {
        file,
        preview: '',
        name: file.name,
        id: fileId,
        size: file.size,
        status: 'uploading'
      }

      setMediaFiles(prev => [...prev, newFile])

      const reader = new FileReader()
      reader.onloadend = () => {
        setMediaFiles(prev => prev.map(f => 
          f.id === fileId 
            ? { ...f, preview: reader.result as string, status: 'success' as const }
            : f
        ))
      }
      reader.readAsDataURL(file)
    })
  }

  const handleDocumentDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDraggingDoc(false)
    
    const files = Array.from(e.dataTransfer.files)
    if (files.length === 0) return

    files.forEach(file => {
      const validExtensions = ['.pdf', '.doc', '.docx', '.txt']
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase()
      
      if (!validExtensions.includes(fileExtension)) {
        alert(`${file.name}: Invalid file type`)
        return
      }

      const maxSize = 10 * 1024 * 1024
      if (file.size > maxSize) {
        alert(`${file.name}: File size too large (Max: 10MB)`)
        return
      }

      const fileId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      const newFile: UploadedFile = {
        file,
        preview: '',
        name: file.name,
        id: fileId,
        size: file.size,
        status: 'uploading'
      }

      setDocumentFiles(prev => [...prev, newFile])

      const reader = new FileReader()
      reader.onloadend = () => {
        setDocumentFiles(prev => prev.map(f => 
          f.id === fileId 
            ? { ...f, preview: reader.result as string, status: 'success' as const }
            : f
        ))
      }
      reader.readAsDataURL(file)
    })
  }

  const handleMediaDragEnter = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDraggingMedia(true)
  }

  const handleMediaDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX
    const y = e.clientY
    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      setIsDraggingMedia(false)
    }
  }

  const handleDocDragEnter = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDraggingDoc(true)
  }

  const handleDocDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX
    const y = e.clientY
    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      setIsDraggingDoc(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <div className={`fixed left-0 top-0 h-full w-64 bg-primary-500 z-50 transform transition-transform duration-300 ease-in-out lg:hidden ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <Sidebar onClose={() => setSidebarOpen(false)} currentPage="products" />
      </div>

      {/* Desktop & Mobile Layout */}
      <div className="flex h-screen overflow-hidden">
        {/* Desktop Sidebar */}
        {!sidebarCollapsed && (
          <div className="hidden lg:block w-64 flex-shrink-0 bg-primary-500 h-screen overflow-y-auto">
            <Sidebar onClose={() => setSidebarCollapsed(true)} currentPage="products" />
          </div>
        )}
        
        {sidebarCollapsed && (
          <button
            onClick={() => setSidebarCollapsed(false)}
            className="hidden lg:block fixed left-0 top-4 z-30 bg-primary-500 text-white p-2 rounded-r-lg"
            aria-label="Toggle sidebar"
          >
            <Menu size={24} />
          </button>
        )}

        <div className="flex-1 flex flex-col h-screen overflow-hidden bg-gray-50">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden fixed top-20 left-4 z-40 bg-primary-500 text-white p-2 rounded-lg shadow-lg"
            aria-label="Open sidebar"
          >
            <Menu size={24} />
          </button>

          <div className="flex-shrink-0 sticky top-0 z-50 bg-white border-b border-gray-200">
            <Header />
          </div>
          
          <main className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6 pt-16 lg:pt-6">
            <div className="max-w-5xl mx-auto space-y-4 sm:space-y-6">
              {/* Header */}
              <div>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">{t('allProducts')}</h1>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">{t('dashboard')} <span className="font-semibold text-gray-700">/ {t('addNewProduct')}</span></p>
              </div>

              {/* Form */}
              <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm space-y-4 sm:space-y-6">
                {/* Product Details */}
                <div className="space-y-3 sm:space-y-4">
                  <h2 className="text-base sm:text-lg font-bold text-gray-900">{t('productDetails')}</h2>
                  
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">{t('productTitle')}</label>
                    <input
                      name="title"
                      type="text"
                      placeholder={t('enterProductTitle')}
                      value={formData.title}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 bg-gray-100 border rounded-lg text-gray-700 focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-white text-sm ${
                        errors.title ? 'border-red-300 bg-red-50' : 'border-gray-200'
                      }`}
                    />
                    {errors.title && (
                      <p className="mt-1 text-xs text-red-600">{errors.title}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">{t('category')}</label>
                      <div className="relative">
                        <select
                          name="category"
                          value={formData.category}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-2 bg-gray-100 border rounded-lg text-gray-700 appearance-none focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-white text-sm ${
                            errors.category ? 'border-red-300 bg-red-50' : 'border-gray-200'
                          }`}
                          aria-label="Select category"
                        >
                          <option value="">{t('selectCategory')}</option>
                          <option>Electronic</option>
                          <option>Clothing</option>
                          <option>Sports</option>
                          <option>Home & Garden</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                      </div>
                      {errors.category && (
                        <p className="mt-1 text-xs text-red-600">{errors.category}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">{t('condition')}</label>
                      <div className="relative">
                        <select
                          name="condition"
                          value={formData.condition}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-2 bg-gray-100 border rounded-lg text-gray-700 appearance-none focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-white text-sm ${
                            errors.condition ? 'border-red-300 bg-red-50' : 'border-gray-200'
                          }`}
                          aria-label="Select condition"
                        >
                          <option value="">{t('selectCondition')}</option>
                          <option>Excellent</option>
                          <option>Good</option>
                          <option>Fair</option>
                          <option>Poor</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                      </div>
                      {errors.condition && (
                        <p className="mt-1 text-xs text-red-600">{errors.condition}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">{t('productDescription')}</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={4}
                      placeholder={t('enterDescription')}
                      className={`w-full px-3 py-2 bg-gray-100 border rounded-lg text-gray-700 focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-white text-sm ${
                        errors.description ? 'border-red-300 bg-red-50' : 'border-gray-200'
                      }`}
                    />
                    {errors.description && (
                      <p className="mt-1 text-xs text-red-600">{errors.description}</p>
                    )}
                  </div>
                </div>

                {/* Upload Media */}
                <div className="border-t pt-4 sm:pt-6">
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">{t('uploadMedia')}</h3>
                  <input
                    ref={mediaInputRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                    multiple
                    onChange={handleMediaChange}
                    className="hidden"
                    aria-label="Upload media files"
                  />
                  <div
                    onClick={(e) => {
                      const target = e.target as HTMLElement
                      if (target.closest('button')) {
                        return
                      }
                      handleMediaClick()
                    }}
                    onDrop={handleMediaDrop}
                    onDragOver={handleDragOver}
                    onDragEnter={handleMediaDragEnter}
                    onDragLeave={handleMediaDragLeave}
                    className={`border-2 border-dashed rounded-lg p-6 sm:p-8 text-center cursor-pointer transition-all ${
                      isDraggingMedia
                        ? 'border-amber-500 bg-amber-50 scale-[1.02]'
                        : 'border-gray-300 hover:border-amber-500 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex justify-center mb-3 sm:mb-4">
                      <Upload size={48} className="text-amber-600" />
                    </div>
                    <p className="text-gray-700 text-sm sm:text-base mb-1 font-medium">
                      {isDraggingMedia ? 'Drop images here' : t('dragDropImage') || 'Drag & drop images here'}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4">
                      {t('supportFormats') || 'Supports: JPEG, PNG, GIF, WebP (Max 5MB per file)'}
                    </p>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        handleMediaClick()
                      }}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-500 text-white rounded-lg hover:bg-amber-600 active:scale-95 transition-all text-sm font-medium shadow-md hover:shadow-lg"
                    >
                      <Upload size={18} />
                      <span>{t('addAnotherMedia') || 'Browse Files'}</span>
                    </button>
                    <p className="text-xs text-gray-400 mt-2">or click anywhere on this area to browse</p>
                  </div>
                  
                  {/* Media Preview */}
                  {mediaFiles.length > 0 && (
                    <div className="mt-4">
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-sm font-medium text-gray-700">
                          {mediaFiles.length} {mediaFiles.length === 1 ? 'image' : 'images'} uploaded
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`Remove all ${mediaFiles.length} images?`)) {
                              setMediaFiles([])
                            }
                          }}
                          className="text-xs text-red-600 hover:text-red-700 font-medium underline"
                        >
                          Clear All
                        </button>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {mediaFiles.map((media) => (
                          <div key={media.id} className="relative group">
                            <div className="aspect-square rounded-lg overflow-hidden border border-gray-200 bg-gray-100 relative">
                              {media.status === 'uploading' && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                                  <Loader2 className="animate-spin text-white" size={24} />
                                </div>
                              )}
                              {media.status === 'success' && media.preview && (
                                <>
                                  <img
                                    src={media.preview}
                                    alt={media.name}
                                    className="w-full h-full object-cover"
                                  />
                                  <div className="absolute top-1 left-1 bg-green-500 text-white rounded-full p-1">
                                    <CheckCircle2 size={12} />
                                  </div>
                                </>
                              )}
                              {!media.preview && (
                                <div className="w-full h-full flex items-center justify-center">
                                  <ImageIcon size={32} className="text-gray-400" />
                                </div>
                              )}
                            </div>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                removeMediaFile(media.id)
                              }}
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                              title="Remove"
                            >
                              <X size={16} />
                            </button>
                            <div className="mt-1">
                              <p className="text-xs text-gray-700 truncate font-medium">{media.name}</p>
                              <p className="text-xs text-gray-500">{formatFileSize(media.size)}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Upload Doc */}
                <div className="border-t pt-4 sm:pt-6">
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">{t('uploadDoc')}</h3>
                  <input
                    ref={documentInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx,.txt"
                    multiple
                    onChange={handleDocumentChange}
                    className="hidden"
                    aria-label="Upload documents"
                  />
                  <div
                    onClick={(e) => {
                      const target = e.target as HTMLElement
                      if (target.closest('button')) {
                        return
                      }
                      handleDocumentClick()
                    }}
                    onDrop={handleDocumentDrop}
                    onDragOver={handleDragOver}
                    onDragEnter={handleDocDragEnter}
                    onDragLeave={handleDocDragLeave}
                    className={`border-2 border-dashed rounded-lg p-6 sm:p-8 text-center cursor-pointer transition-all ${
                      isDraggingDoc
                        ? 'border-amber-500 bg-amber-50 scale-[1.02]'
                        : 'border-gray-300 hover:border-amber-500 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex justify-center mb-3 sm:mb-4">
                      <FileText size={48} className="text-amber-600" />
                    </div>
                    <p className="text-gray-700 text-sm sm:text-base mb-1 font-medium">
                      {isDraggingDoc ? 'Drop documents here' : t('dragDropDocument') || 'Drag & drop documents here'}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4">
                      {t('supportFormats') || 'Supports: PDF, DOC, DOCX, TXT (Max 10MB per file)'}
                    </p>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        handleDocumentClick()
                      }}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-500 text-white rounded-lg hover:bg-amber-600 active:scale-95 transition-all text-sm font-medium shadow-md hover:shadow-lg"
                    >
                      <Upload size={18} />
                      <span>{t('addAnotherDoc') || 'Browse Files'}</span>
                    </button>
                    <p className="text-xs text-gray-400 mt-2">or click anywhere on this area to browse</p>
                  </div>
                  
                  {/* Document Preview */}
                  {documentFiles.length > 0 && (
                    <div className="mt-4">
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-sm font-medium text-gray-700">
                          {documentFiles.length} {documentFiles.length === 1 ? 'document' : 'documents'} uploaded
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`Remove all ${documentFiles.length} documents?`)) {
                              setDocumentFiles([])
                            }
                          }}
                          className="text-xs text-red-600 hover:text-red-700 font-medium underline"
                        >
                          Clear All
                        </button>
                      </div>
                      <div className="space-y-2">
                        {documentFiles.map((doc) => (
                          <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 group">
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <div className="flex-shrink-0">
                                {doc.status === 'uploading' ? (
                                  <Loader2 className="animate-spin text-amber-600" size={20} />
                                ) : doc.status === 'success' ? (
                                  <div className="bg-green-100 rounded-full p-2">
                                    <CheckCircle2 size={16} className="text-green-600" />
                                  </div>
                                ) : (
                                  <FileText size={20} className="text-gray-400" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">{doc.name}</p>
                                <p className="text-xs text-gray-500">{formatFileSize(doc.size)}</p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                removeDocumentFile(doc.id)
                              }}
                              className="flex-shrink-0 ml-2 text-red-600 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                              title="Remove"
                            >
                              <X size={18} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* SEO & Marketing */}
                <div className="border-t pt-4 sm:pt-6 space-y-3 sm:space-y-4">
                  <h2 className="text-base sm:text-lg font-bold text-gray-900">{t('seoMarketing')}</h2>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">{t('metaTitle')}</label>
                      <input
                        name="metaTitle"
                        type="text"
                        placeholder={t('enterMetaTitle')}
                        value={formData.metaTitle}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg text-gray-700 focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-white text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">{t('metaDescription')}</label>
                      <input
                        name="metaDescription"
                        type="text"
                        placeholder={t('enterMetaDescription')}
                        value={formData.metaDescription}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg text-gray-700 focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-white text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">{t('productUrlSlug')}</label>
                    <input
                      name="slug"
                      type="text"
                      placeholder={t('enterSlug')}
                      value={formData.slug}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg text-gray-700 focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-white text-sm"
                    />
                  </div>
                </div>

                {/* Pricing & Stock */}
                <div className="border-t pt-4 sm:pt-6 space-y-3 sm:space-y-4">
                  <h2 className="text-base sm:text-lg font-bold text-gray-900">{t('pricingStock')}</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">{t('price')} ($)</label>
                      <input
                        name="price"
                        type="text"
                        value={formData.price}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 bg-gray-100 border rounded-lg text-gray-700 focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-white text-sm ${
                          errors.price ? 'border-red-300 bg-red-50' : 'border-gray-200'
                        }`}
                        aria-label="Product price"
                      />
                      {errors.price && (
                        <p className="mt-1 text-xs text-red-600">{errors.price}</p>
                      )}
                    </div>
                    <div>
                      <label className="flex items-center gap-1 text-xs sm:text-sm font-medium text-gray-700 mb-1">
                        {t('discountPrice')} ($)
                        <Info size={14} className="text-gray-400" />
                      </label>
                      <input
                        name="discountPrice"
                        type="text"
                        value={formData.discountPrice}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 bg-gray-100 border rounded-lg text-gray-700 focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-white text-sm ${
                          errors.discountPrice ? 'border-red-300 bg-red-50' : 'border-gray-200'
                        }`}
                        aria-label="Discount price"
                      />
                      {errors.discountPrice && (
                        <p className="mt-1 text-xs text-red-600">{errors.discountPrice}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">{t('stockQuantity')}</label>
                      <input
                        name="stockQuantity"
                        type="text"
                        value={formData.stockQuantity}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 bg-gray-100 border rounded-lg text-gray-700 focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-white text-sm ${
                          errors.stockQuantity ? 'border-red-300 bg-red-50' : 'border-gray-200'
                        }`}
                        aria-label="Stock quantity"
                      />
                      {errors.stockQuantity && (
                        <p className="mt-1 text-xs text-red-600">{errors.stockQuantity}</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">{t('stockStatus')}</label>
                    <input
                      name="stockStatus"
                      type="text"
                      value={formData.stockStatus}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg text-gray-700 focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-white text-sm max-w-xs"
                      aria-label="Stock status"
                    />
                  </div>
                </div>

                {/* Additional Information */}
                <div className="border-t pt-4 sm:pt-6 space-y-3 sm:space-y-4">
                  <h2 className="text-base sm:text-lg font-bold text-gray-900">{t('additionalInformation')}</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">{t('brand')}</label>
                      <input
                        name="brand"
                        type="text"
                        value={formData.brand}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg text-gray-700 focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-white text-sm"
                        aria-label="Product brand"
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">{t('weight')}</label>
                      <input
                        name="weight"
                        type="text"
                        value={formData.weight}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg text-gray-700 focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-white text-sm"
                        aria-label="Product weight"
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">{t('dimensions')}</label>
                      <input
                        name="dimensions"
                        type="text"
                        value={formData.dimensions}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg text-gray-700 focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-white text-sm"
                        aria-label="Product dimensions"
                      />
                    </div>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3 pt-4 sm:pt-6 border-t">
                  <button
                    onClick={handleCancel}
                    className="w-full sm:w-auto px-4 sm:px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm sm:text-base"
                  >
                    {t('cancel')}
                  </button>
                  <button
                    onClick={handlePublish}
                    disabled={isPublishing}
                    className="flex items-center justify-center gap-2 w-full sm:w-auto px-4 sm:px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base transition-colors"
                  >
                    {isPublishing ? <ButtonLoader size="sm" /> : null}
                    {isPublishing ? t('publishing') || 'Publishing...' : t('publishProduct')}
                  </button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Success Modal */}
      <SuccessModal
        isOpen={successModal.isOpen}
        onClose={() => {
          setSuccessModal({ isOpen: false, message: '', title: '' })
          navigate('/products')
        }}
        title={successModal.title}
        message={successModal.message}
      />

      {/* Error Modal */}
      <ErrorModal
        isOpen={errorModal.isOpen}
        onClose={() => setErrorModal({ isOpen: false, message: '', title: '' })}
        title={errorModal.title}
        message={errorModal.message}
      />
    </div>
  )
}

