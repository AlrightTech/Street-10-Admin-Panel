import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'
import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Menu, Upload, X, ChevronDown, Info, FileText, Image as ImageIcon, CheckCircle2, AlertCircle, Eye, Loader2 } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { ButtonLoader } from '@/components/ui/Loader'

interface UploadedFile {
  file: File
  preview: string
  name: string
  id: string
  size: number
  status?: 'uploading' | 'success' | 'error'
  error?: string
}

interface UploadError {
  message: string
  type: 'warning' | 'error'
}

export default function AddProductPage() {
  const navigate = useNavigate()
  const { t } = useLanguage()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)
  const [errors, setErrors] = useState<{[key: string]: string}>({})
  const [uploadErrors, setUploadErrors] = useState<UploadError[]>([])
  const [isDraggingMedia, setIsDraggingMedia] = useState(false)
  const [isDraggingDoc, setIsDraggingDoc] = useState(false)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  
  // File input refs
  const mediaInputRef = useRef<HTMLInputElement>(null)
  const documentInputRef = useRef<HTMLInputElement>(null)
  
  // File states
  const [mediaFiles, setMediaFiles] = useState<UploadedFile[]>([])
  const [documentFiles, setDocumentFiles] = useState<UploadedFile[]>([])

  const [formData, setFormData] = useState({
    title: '',
    category: '',
    condition: '',
    description: '',
    price: '',
    discountPrice: '',
    stockQuantity: '',
    stockStatus: '',
    brand: '',
    weight: '',
    dimensions: '',
    metaTitle: '',
    metaDescription: '',
    slug: ''
  })

  // Auto-generate slug from title
  useEffect(() => {
    if (formData.title && !formData.slug) {
      const slug = formData.title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '')
      setFormData(prev => ({ ...prev, slug }))
    }
  }, [formData.title])

  // Auto-generate meta title from title if empty
  useEffect(() => {
    if (formData.title && !formData.metaTitle) {
      setFormData(prev => ({ ...prev, metaTitle: formData.title }))
    }
  }, [formData.title])

  // Show toast-like error notifications
  const showError = (message: string, type: 'warning' | 'error' = 'error') => {
    const error: UploadError = { message, type }
    setUploadErrors(prev => [...prev, error])
    setTimeout(() => {
      setUploadErrors(prev => prev.filter(e => e !== error))
    }, 5000)
  }

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

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {}

    // Required fields
    if (!formData.title.trim()) {
      newErrors.title = 'Product title is required'
    }
    if (!formData.category) {
      newErrors.category = 'Category is required'
    }
    if (!formData.condition) {
      newErrors.condition = 'Condition is required'
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    }
    
    // Price validation
    if (!formData.price.trim()) {
      newErrors.price = 'Price is required'
    } else if (isNaN(parseFloat(formData.price)) || parseFloat(formData.price) < 0) {
      newErrors.price = 'Price must be a valid positive number'
    }
    
    // Stock quantity validation
    if (!formData.stockQuantity.trim()) {
      newErrors.stockQuantity = 'Stock quantity is required'
    } else if (isNaN(parseInt(formData.stockQuantity)) || parseInt(formData.stockQuantity) < 0) {
      newErrors.stockQuantity = 'Stock quantity must be a valid positive number'
    }

    // Discount price validation (if provided)
    if (formData.discountPrice.trim() && (isNaN(parseFloat(formData.discountPrice)) || parseFloat(formData.discountPrice) < 0)) {
      newErrors.discountPrice = 'Discount price must be a valid positive number'
    }

    setErrors(newErrors)
    return { isValid: Object.keys(newErrors).length === 0, errors: newErrors }
  }

  const handlePublish = async (e?: React.FormEvent) => {
    e?.preventDefault()
    const { isValid, errors: validationErrors } = validateForm()
    if (!isValid) {
      // Scroll to first error after state updates
      setTimeout(() => {
        const firstErrorField = Object.keys(validationErrors)[0]
        if (firstErrorField) {
          const element = document.querySelector(`[name="${firstErrorField}"]`)
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' })
            // Focus on the element if it's an input
            if (element instanceof HTMLElement && (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA' || element.tagName === 'SELECT')) {
              element.focus()
            }
          }
        }
      }, 100)
      return
    }

    setIsPublishing(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800))
    setIsPublishing(false)
    alert(t('productPublished') || 'Product published successfully!')
    navigate('/products')
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

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    
    if (files.length === 0) return

    files.forEach(file => {
      // Validate image file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
      if (!validTypes.includes(file.type.toLowerCase())) {
        showError(`${file.name}: Invalid file type. Please select JPEG, PNG, GIF, or WebP image.`, 'error')
        return
      }
      
      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024 // 5MB
      if (file.size > maxSize) {
        showError(`${file.name}: File size too large. Maximum size is 5MB (Current: ${formatFileSize(file.size)})`, 'error')
        return
      }

      // Create unique ID for file
      const fileId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      
      // Create file object with uploading status
      const newFile: UploadedFile = {
        file,
        preview: '',
        name: file.name,
        id: fileId,
        size: file.size,
        status: 'uploading'
      }

      // Add file immediately with uploading status
      setMediaFiles(prev => [...prev, newFile])

      // Read file and create preview
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
        showError(`${file.name}: Failed to read file`, 'error')
      }
      reader.readAsDataURL(file)
    })

    // Reset input to allow selecting the same file again
    if (e.target) {
      e.target.value = ''
    }
  }

  const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    
    if (files.length === 0) return

    files.forEach(file => {
      // Validate file type
      const validExtensions = ['.pdf', '.doc', '.docx', '.txt']
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase()
      
      if (!validExtensions.includes(fileExtension)) {
        showError(`${file.name}: Invalid file type. Please select PDF, DOC, DOCX, or TXT file.`, 'error')
        return
      }

      // Validate file size (max 10MB)
      const maxSize = 10 * 1024 * 1024 // 10MB
      if (file.size > maxSize) {
        showError(`${file.name}: File size too large. Maximum size is 10MB (Current: ${formatFileSize(file.size)})`, 'error')
        return
      }

      // Create unique ID for file
      const fileId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      
      // Create file object with uploading status
      const newFile: UploadedFile = {
        file,
        preview: '',
        name: file.name,
        id: fileId,
        size: file.size,
        status: 'uploading'
      }

      // Add file immediately with uploading status
      setDocumentFiles(prev => [...prev, newFile])

      // Read file
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
        showError(`${file.name}: Failed to read file`, 'error')
      }
      reader.readAsDataURL(file)
    })

    // Reset input to allow selecting the same file again
    if (e.target) {
      e.target.value = ''
    }
  }

  const removeMediaFile = (fileId: string) => {
    setMediaFiles(prev => prev.filter(f => f.id !== fileId))
  }

  const removeDocumentFile = (fileId: string) => {
    setDocumentFiles(prev => prev.filter(f => f.id !== fileId))
  }

  // Get total file sizes
  const getTotalMediaSize = () => {
    return mediaFiles.reduce((total, file) => total + file.size, 0)
  }

  const getTotalDocumentSize = () => {
    return documentFiles.reduce((total, file) => total + file.size, 0)
  }

  // Drag and drop handlers with visual feedback
  const handleMediaDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDraggingMedia(false)
    
    const files = Array.from(e.dataTransfer.files).filter(file => 
      file.type.startsWith('image/')
    )
    
    if (files.length === 0) {
      showError('Please drop valid image files only', 'warning')
      return
    }

    // Process files like regular file input
    files.forEach(file => {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
      if (!validTypes.includes(file.type.toLowerCase())) {
        showError(`${file.name}: Invalid file type`, 'error')
        return
      }
      
      const maxSize = 5 * 1024 * 1024
      if (file.size > maxSize) {
        showError(`${file.name}: File size too large (Max: 5MB)`, 'error')
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
        showError(`${file.name}: Failed to read file`, 'error')
      }
      reader.readAsDataURL(file)
    })
  }

  const handleDocumentDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDraggingDoc(false)
    
    const files = Array.from(e.dataTransfer.files)
    
    if (files.length === 0) return

    files.forEach(file => {
      const validExtensions = ['.pdf', '.doc', '.docx', '.txt']
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase()
      
      if (!validExtensions.includes(fileExtension)) {
        showError(`${file.name}: Invalid file type`, 'error')
        return
      }

      const maxSize = 10 * 1024 * 1024
      if (file.size > maxSize) {
        showError(`${file.name}: File size too large (Max: 10MB)`, 'error')
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
        showError(`${file.name}: Failed to read file`, 'error')
      }
      reader.readAsDataURL(file)
    })
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleMediaDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDraggingMedia(true)
  }

  const handleMediaDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    // Only set dragging to false if we're actually leaving the drop zone
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX
    const y = e.clientY
    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      setIsDraggingMedia(false)
    }
  }

  const handleDocDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDraggingDoc(true)
  }

  const handleDocDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    // Only set dragging to false if we're actually leaving the drop zone
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX
    const y = e.clientY
    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      setIsDraggingDoc(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Error Notifications */}
      {uploadErrors.length > 0 && (
        <div className="fixed top-20 right-4 z-[100] space-y-2 max-w-md">
          {uploadErrors.map((error, index) => (
            <div
              key={index}
              className={`flex items-start gap-3 p-4 rounded-lg shadow-lg border animate-in slide-in-from-right ${
                error.type === 'error' 
                  ? 'bg-red-50 border-red-200 text-red-800' 
                  : 'bg-yellow-50 border-yellow-200 text-yellow-800'
              }`}
            >
              <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
              <p className="text-sm flex-1">{error.message}</p>
              <button
                onClick={() => setUploadErrors(prev => prev.filter((_, i) => i !== index))}
                className="text-gray-400 hover:text-gray-600"
                aria-label="Close error notification"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Image Preview Modal */}
      {previewImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 z-[100] flex items-center justify-center p-4"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <img
              src={previewImage}
              alt="Preview"
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-4 right-4 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors"
              aria-label="Close image preview"
            >
              <X size={24} />
            </button>
          </div>
        </div>
      )}

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
              <form onSubmit={handlePublish} className="bg-white rounded-lg p-4 sm:p-6 shadow-sm space-y-4 sm:space-y-6">
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
                        errors.title ? 'border-red-500' : 'border-gray-200'
                      }`}
                    />
                    {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">{t('category')}</label>
                      <div className="relative">
                        <select
                          name="category"
                          value={formData.category}
                          onChange={handleInputChange}
                          aria-label="Select product category"
                          className={`w-full px-3 py-2 bg-gray-100 border rounded-lg text-gray-700 appearance-none focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-white text-sm ${
                            errors.category ? 'border-red-500' : 'border-gray-200'
                          }`}
                        >
                          <option value="">{t('selectCategory')}</option>
                          <option>Electronic</option>
                          <option>Clothing</option>
                          <option>Sports</option>
                          <option>Home & Garden</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                      </div>
                      {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">{t('condition')}</label>
                      <div className="relative">
                        <select
                          name="condition"
                          value={formData.condition}
                          onChange={handleInputChange}
                          aria-label="Select product condition"
                          className={`w-full px-3 py-2 bg-gray-100 border rounded-lg text-gray-700 appearance-none focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-white text-sm ${
                            errors.condition ? 'border-red-500' : 'border-gray-200'
                          }`}
                        >
                          <option value="">{t('selectCondition')}</option>
                          <option>Excellent</option>
                          <option>Good</option>
                          <option>Fair</option>
                          <option>Poor</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                      </div>
                      {errors.condition && <p className="text-red-500 text-xs mt-1">{errors.condition}</p>}
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
                        errors.description ? 'border-red-500' : 'border-gray-200'
                      }`}
                    />
                    {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
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
                      // Don't trigger if clicking on the button (button has its own handler)
                      if (target.closest('button')) {
                        return
                      }
                      handleMediaClick(e)
                    }}
                    aria-label="Upload media files - Click or drag and drop images here"
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
                      <Upload size={48} className={`transition-colors ${isDraggingMedia ? 'text-amber-600' : 'text-amber-600'}`} />
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
                        handleMediaClick(e)
                      }}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-500 text-white rounded-lg hover:bg-amber-600 active:scale-95 transition-all text-sm font-medium shadow-md hover:shadow-lg z-10 relative"
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
                          <span className="text-gray-500 ml-2">({formatFileSize(getTotalMediaSize())})</span>
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
                                    className="w-full h-full object-cover cursor-pointer"
                                    onClick={() => setPreviewImage(media.preview)}
                                  />
                                  <div className="absolute top-1 left-1 bg-green-500 text-white rounded-full p-1">
                                    <CheckCircle2 size={12} />
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => setPreviewImage(media.preview)}
                                    className="absolute bottom-1 left-1 bg-black bg-opacity-50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                    title="Preview"
                                  >
                                    <Eye size={12} />
                                  </button>
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
                      // Don't trigger if clicking on the button (button has its own handler)
                      if (target.closest('button')) {
                        return
                      }
                      handleDocumentClick(e)
                    }}
                    aria-label="Upload documents - Click or drag and drop documents here"
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
                      <FileText size={48} className={`transition-colors ${isDraggingDoc ? 'text-amber-600' : 'text-amber-600'}`} />
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
                        handleDocumentClick(e)
                      }}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-500 text-white rounded-lg hover:bg-amber-600 active:scale-95 transition-all text-sm font-medium shadow-md hover:shadow-lg z-10 relative"
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
                          <span className="text-gray-500 ml-2">({formatFileSize(getTotalDocumentSize())})</span>
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
                          <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 group hover:bg-gray-100 transition-colors">
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              {doc.status === 'uploading' && (
                                <Loader2 className="animate-spin text-amber-600 flex-shrink-0" size={24} />
                              )}
                              {doc.status === 'success' && (
                                <CheckCircle2 className="text-green-500 flex-shrink-0" size={24} />
                              )}
                              {!doc.status && (
                                <FileText size={24} className="text-blue-600 flex-shrink-0" />
                              )}
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">{doc.name}</p>
                                <p className="text-xs text-gray-500">
                                  {formatFileSize(doc.size)}
                                </p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                removeDocumentFile(doc.id)
                              }}
                              className="ml-2 p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors opacity-0 group-hover:opacity-100"
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
                        placeholder="0.00"
                        value={formData.price}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 bg-gray-100 border rounded-lg text-gray-700 focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-white text-sm ${
                          errors.price ? 'border-red-500' : 'border-gray-200'
                        }`}
                      />
                      {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
                    </div>
                    <div>
                      <label className="flex items-center gap-1 text-xs sm:text-sm font-medium text-gray-700 mb-1">
                        {t('discountPrice')} ($)
                        <Info size={14} className="text-gray-400" />
                      </label>
                      <input
                        name="discountPrice"
                        type="text"
                        placeholder="0.00"
                        value={formData.discountPrice}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 bg-gray-100 border rounded-lg text-gray-700 focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-white text-sm ${
                          errors.discountPrice ? 'border-red-500' : 'border-gray-200'
                        }`}
                      />
                      {errors.discountPrice && <p className="text-red-500 text-xs mt-1">{errors.discountPrice}</p>}
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">{t('stockQuantity')}</label>
                      <input
                        name="stockQuantity"
                        type="text"
                        placeholder="0"
                        value={formData.stockQuantity}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 bg-gray-100 border rounded-lg text-gray-700 focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-white text-sm ${
                          errors.stockQuantity ? 'border-red-500' : 'border-gray-200'
                        }`}
                      />
                      {errors.stockQuantity && <p className="text-red-500 text-xs mt-1">{errors.stockQuantity}</p>}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">{t('stockStatus')}</label>
                    <input
                      name="stockStatus"
                      type="text"
                      placeholder="In Stock"
                      value={formData.stockStatus}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg text-gray-700 focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-white text-sm max-w-xs"
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
                        placeholder="Enter brand name"
                        value={formData.brand}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg text-gray-700 focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-white text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">{t('weight')}</label>
                      <input
                        name="weight"
                        type="text"
                        placeholder="e.g., 1.5 kg"
                        value={formData.weight}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg text-gray-700 focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-white text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">{t('dimensions')}</label>
                      <input
                        name="dimensions"
                        type="text"
                        placeholder="e.g., 10 x 5 x 3 cm"
                        value={formData.dimensions}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg text-gray-700 focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-white text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3 pt-4 sm:pt-6 border-t">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="w-full sm:w-auto px-4 sm:px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm sm:text-base"
                  >
                    {t('cancel')}
                  </button>
                  <button
                    type="submit"
                    disabled={isPublishing}
                    className="flex items-center justify-center gap-2 w-full sm:w-auto px-4 sm:px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base transition-colors"
                  >
                    {isPublishing ? <ButtonLoader size="sm" /> : null}
                    {isPublishing ? t('publishing') || 'Publishing...' : t('publishProduct')}
                  </button>
                </div>
              </form>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

