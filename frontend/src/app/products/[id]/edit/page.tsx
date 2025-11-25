import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'
import { useState, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Menu, Upload, X, ChevronDown } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { ButtonLoader } from '@/components/ui/Loader'
import ErrorModal from '@/components/ui/ErrorModal'
import SuccessModal from '@/components/ui/SuccessModal'

export default function EditProductPage() {
  const navigate = useNavigate()
  const params = useParams()
  const productId = params?.id as string
  const { t, language } = useLanguage()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [errors, setErrors] = useState<{[key: string]: string}>({})
  const [successModal, setSuccessModal] = useState({ isOpen: false, message: '', title: '' })
  const [errorModal, setErrorModal] = useState({ isOpen: false, message: '', title: '' })
  
  // File input refs for image uploads
  const productImageInputRef = useRef<HTMLInputElement>(null)
  const variantImageInputRefs = useRef<{[key: number]: HTMLInputElement | null}>({})
  const documentInputRef = useRef<HTMLInputElement>(null)
  
  // Image states
  const [productImages, setProductImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1574717024653-430fd2b7316a?w=300&h=300&fit=crop',
  ])
  const [variantImages, setVariantImages] = useState<{[key: number]: string}>({})
  const [documents, setDocuments] = useState<string[]>([
    'document1.pdf',
    'document2.pdf'
  ])

  const [formData, setFormData] = useState({
    title: 'Apple AirPods Pro (2nd Generation)',
    category: 'Electronic',
    condition: 'Excellent',
    description: 'Experience next-level sound with the Apple AirPods Pro 2nd generation! Featuring personalized Spatial Audio, longer battery life, and the Apple H2 chip for a magical listening experience.',
    price: '89.99',
    discountPrice: '82.99',
    stockQuantity: '50',
    brand: 'Apple',
    weight: '0.056 kg',
    dimensions: '5.05 x 3.8 x 3.40 cm',
    metaTitle: 'Apple AirPods Pro 2nd Gen - Premium Wireless Earbuds',
    metaDescription: 'Shop Apple AirPods Pro 2nd Generation with personalized Spatial Audio, Active Noise Cancellation, and up to 6 hours of listening time.',
    sku: 'apple-airpodspro-2nd-generation'
  })

  const [variants, setVariants] = useState([
    { id: 1, color: 'Red', colorCode: 'red', size: 'S', price: '500', sku: 'TR-4545', stock: '30' },
    { id: 2, color: 'Red', colorCode: 'red', size: 'M', price: '500', sku: 'TR-4540', stock: '30' },
    { id: 3, color: 'Blue', colorCode: 'blue', size: 'S', price: '500', sku: 'SBJ-003', stock: '30' },
    { id: 4, color: 'Blue', colorCode: 'blue', size: 'M', price: '500', sku: 'SBJ-004', stock: '30' },
  ])

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

  const handleVariantChange = (id: number, field: string, value: string) => {
    setVariants(variants.map(v => 
      v.id === id ? { ...v, [field]: value } : v
    ))
    // Clear variant errors
    const errorKey = `variant_${id}_${field}`
    if (errors[errorKey]) {
      setErrors({ ...errors, [errorKey]: '' })
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
    if (formData.discountPrice && parseFloat(formData.discountPrice) >= parseFloat(formData.price)) {
      newErrors.discountPrice = t('discountPriceMustBeLess') || 'Discount price must be less than regular price'
    }

    // Validate variants
    variants.forEach((variant) => {
      if (!variant.price.trim() || isNaN(parseFloat(variant.price)) || parseFloat(variant.price) <= 0) {
        newErrors[`variant_${variant.id}_price`] = t('variantPriceInvalid') || 'Variant price must be a valid positive number'
      }
      if (!variant.sku.trim()) {
        newErrors[`variant_${variant.id}_sku`] = t('variantSkuRequired') || 'Variant SKU is required'
      }
      if (!variant.stock.trim() || isNaN(parseInt(variant.stock)) || parseInt(variant.stock) < 0) {
        newErrors[`variant_${variant.id}_stock`] = t('variantStockInvalid') || 'Variant stock must be a valid non-negative number'
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = async () => {
    // Validate form
    if (!validateForm()) {
      setErrorModal({
        isOpen: true,
        title: t('validationError') || 'Validation Error',
        message: t('pleaseFixErrors') || 'Please fix all errors before saving'
      })
      return
    }

    setIsSaving(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800))
      setSuccessModal({
        isOpen: true,
        title: t('productSaved') || 'Product Saved',
        message: t('productSavedSuccess') || 'Product has been saved successfully!'
      })
    } catch (error) {
      setErrorModal({
        isOpen: true,
        title: t('saveFailed') || 'Save Failed',
        message: t('productSaveFailed') || 'Failed to save product. Please try again.'
      })
    } finally {
      setIsSaving(false)
    }
  }

  // Handle image removal
  const handleRemoveImage = (index: number) => {
    setProductImages(productImages.filter((_, i) => i !== index))
  }

  // Handle image replacement
  const handleReplaceImage = (index: number) => {
    if (productImageInputRef.current) {
      productImageInputRef.current.setAttribute('data-index', index.toString())
      productImageInputRef.current.click()
    }
  }

  // Handle product image upload
  const handleProductImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      const file = files[0]
      const reader = new FileReader()
      reader.onloadend = () => {
        const index = parseInt(e.target.getAttribute('data-index') || '0')
        const newImages = [...productImages]
        newImages[index] = reader.result as string
        setProductImages(newImages)
      }
      reader.readAsDataURL(file)
    }
    // Reset input
    if (e.target) {
      e.target.value = ''
    }
  }

  // Handle variant image upload
  const handleVariantImageUpload = (variantId: number) => {
    const input = variantImageInputRefs.current[variantId]
    if (input) {
      input.click()
    }
  }

  // Handle variant image change
  const handleVariantImageChange = (variantId: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      const file = files[0]
      const reader = new FileReader()
      reader.onloadend = () => {
        setVariantImages({ ...variantImages, [variantId]: reader.result as string })
      }
      reader.readAsDataURL(file)
    }
    // Reset input
    if (e.target) {
      e.target.value = ''
    }
  }

  // Handle document removal
  const handleRemoveDocument = (index: number) => {
    setDocuments(documents.filter((_, i) => i !== index))
  }

  // Handle document upload
  const handleDocumentUpload = () => {
    if (documentInputRef.current) {
      documentInputRef.current.click()
    }
  }

  // Handle document change
  const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      const newDocuments = Array.from(files).map(file => file.name)
      setDocuments([...documents, ...newDocuments])
    }
    // Reset input
    if (e.target) {
      e.target.value = ''
    }
  }

  // Handle variant removal
  const handleRemoveVariant = (variantId: number) => {
    setVariants(variants.filter(v => v.id !== variantId))
    // Remove variant image if exists
    const newVariantImages = { ...variantImages }
    delete newVariantImages[variantId]
    setVariantImages(newVariantImages)
  }

  const handleCancel = () => {
    navigate(`/products/${productId}`)
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
                <p className="text-xs sm:text-sm text-gray-500 mt-1">{t('dashboard')} <span className="font-semibold text-gray-700">/ {t('editProduct')}</span></p>
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
                          className="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg text-gray-700 appearance-none focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-white text-sm"
                        >
                          <option>{language === 'ar' ? 'إلكترونيات' : 'Electronic'}</option>
                          <option>{language === 'ar' ? 'ملابس' : 'Clothing'}</option>
                          <option>{language === 'ar' ? 'رياضة' : 'Sports'}</option>
                          <option>{language === 'ar' ? 'المنزل والحديقة' : 'Home & Garden'}</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">{t('condition')}</label>
                      <div className="relative">
                        <select
                          name="condition"
                          value={formData.condition}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg text-gray-700 appearance-none focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-white text-sm"
                        >
                          <option>{language === 'ar' ? 'ممتاز' : 'Excellent'}</option>
                          <option>{language === 'ar' ? 'جيد' : 'Good'}</option>
                          <option>{language === 'ar' ? 'متوسط' : 'Fair'}</option>
                          <option>{language === 'ar' ? 'ضعيف' : 'Poor'}</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">{t('productDescription')}</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={4}
                      className={`w-full px-3 py-2 bg-gray-100 border rounded-lg text-gray-700 focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-white text-sm ${
                        errors.description ? 'border-red-300 bg-red-50' : 'border-gray-200'
                      }`}
                    />
                    {errors.description && (
                      <p className="mt-1 text-xs text-red-600">{errors.description}</p>
                    )}
                  </div>

                  {/* Product Images */}
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">{t('productImages')}</label>
                    <input
                      ref={productImageInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleProductImageChange}
                      className="hidden"
                    />
                    <div className="flex flex-wrap gap-2 sm:gap-3">
                      {productImages.map((image, index) => (
                        <div key={index} className="relative w-20 h-20 sm:w-24 sm:h-24">
                          <img 
                            src={image}
                            alt={`Product image ${index + 1}`}
                            className="w-full h-full object-cover rounded-lg border border-gray-200"
                          />
                          <button
                            onClick={() => handleRemoveImage(index)}
                            className="absolute -top-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-colors z-10"
                            aria-label="Delete image"
                            type="button"
                          >
                            <X size={12} />
                          </button>
                          <button
                            onClick={() => handleReplaceImage(index)}
                            className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[10px] py-0.5 rounded-b-lg hover:bg-black/70 transition-colors"
                            type="button"
                          >
                            {t('replace') || 'Replace'}
                          </button>
                        </div>
                      ))}
                      {productImages.length < 5 && (
                        <button
                          onClick={() => {
                            if (productImageInputRef.current) {
                              productImageInputRef.current.removeAttribute('data-index')
                              productImageInputRef.current.click()
                            }
                          }}
                          className="w-20 h-20 sm:w-24 sm:h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center hover:border-primary-500 hover:bg-primary-50 transition-colors"
                          type="button"
                        >
                          <Upload size={20} className="text-gray-400" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Document */}
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">{t('document')}</label>
                    <input
                      ref={documentInputRef}
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleDocumentChange}
                      className="hidden"
                      multiple
                    />
                    <div className="flex flex-wrap gap-2 sm:gap-3">
                      {documents.map((doc, index) => (
                        <div key={index} className="flex flex-col">
                          <div className="relative px-2 sm:px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg flex items-center gap-2 min-w-[100px] sm:min-w-[120px]">
                            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                            </svg>
                            <span className="text-xs sm:text-sm text-gray-700 truncate">{doc}</span>
                            <button
                              onClick={() => handleRemoveDocument(index)}
                              className="ml-auto w-5 h-5 sm:w-6 sm:h-6 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-colors flex-shrink-0"
                              aria-label="Delete document"
                              type="button"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        </div>
                      ))}
                      <button
                        onClick={handleDocumentUpload}
                        className="px-3 py-2 border-2 border-dashed border-gray-300 rounded-lg flex items-center gap-2 hover:border-primary-500 hover:bg-primary-50 transition-colors text-xs sm:text-sm text-gray-700"
                        type="button"
                      >
                        <Upload size={16} />
                        {t('addDocument') || 'Add Document'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* SEO & Marketing */}
                <div className="border-t pt-4 sm:pt-6 space-y-3 sm:space-y-4">
                  <h2 className="text-base sm:text-lg font-bold text-gray-900">{t('seoMarketing')}</h2>
                  
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">{t('metaTitle')}</label>
                    <input
                      name="metaTitle"
                      type="text"
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
                      value={formData.metaDescription}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg text-gray-700 focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-white text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">{t('productUrlSlug')}</label>
                    <input
                      name="sku"
                      type="text"
                      value={formData.sku}
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
                      />
                      {errors.price && (
                        <p className="mt-1 text-xs text-red-600">{errors.price}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">{t('discountPrice')} ($)</label>
                      <input
                        name="discountPrice"
                        type="text"
                        value={formData.discountPrice}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 bg-gray-100 border rounded-lg text-gray-700 focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-white text-sm ${
                          errors.discountPrice ? 'border-red-300 bg-red-50' : 'border-gray-200'
                        }`}
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
                      />
                      {errors.stockQuantity && (
                        <p className="mt-1 text-xs text-red-600">{errors.stockQuantity}</p>
                      )}
                    </div>
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
                      />
                    </div>
                  </div>
                </div>

                {/* Variant Combinations */}
                <div className="border-t pt-4 sm:pt-6">
                  <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">{t('variantCombinations')}</h2>
                  
                  {/* Desktop Table View */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-3 py-2 text-left text-xs sm:text-sm font-medium text-gray-700">{t('variant')}</th>
                          <th className="px-3 py-2 text-left text-xs sm:text-sm font-medium text-gray-700">{t('price')}</th>
                          <th className="px-3 py-2 text-left text-xs sm:text-sm font-medium text-gray-700">{t('skuCode')}</th>
                          <th className="px-3 py-2 text-left text-xs sm:text-sm font-medium text-gray-700">{t('stockQuantity')}</th>
                          <th className="px-3 py-2 text-left text-xs sm:text-sm font-medium text-gray-700">{t('image')}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {variants.map((variant) => (
                          <tr key={variant.id}>
                            <td className="px-3 py-2">
                              <div className="flex items-center gap-2">
                                <div 
                                  className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-semibold"
                                  style={{ backgroundColor: variant.colorCode === 'red' ? '#ef4444' : variant.colorCode === 'blue' ? '#3b82f6' : variant.colorCode === 'pink' ? '#ec4899' : '#6b7280' }}
                                >
                                  {variant.size}
                                </div>
                                <span className="text-xs sm:text-sm text-gray-700">{variant.color} {variant.size}</span>
                              </div>
                            </td>
                            <td className="px-3 py-2">
                              <div>
                                <input
                                  type="text"
                                  value={variant.price}
                                  onChange={(e) => handleVariantChange(variant.id, 'price', e.target.value)}
                                  className={`w-full sm:w-20 px-2 py-1 bg-gray-100 border rounded text-xs sm:text-sm text-gray-700 focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-white ${
                                    errors[`variant_${variant.id}_price`] ? 'border-red-300 bg-red-50' : 'border-gray-200'
                                  }`}
                                />
                                {errors[`variant_${variant.id}_price`] && (
                                  <p className="mt-1 text-[10px] text-red-600">{errors[`variant_${variant.id}_price`]}</p>
                                )}
                              </div>
                            </td>
                            <td className="px-3 py-2">
                              <div>
                                <input
                                  type="text"
                                  value={variant.sku}
                                  onChange={(e) => handleVariantChange(variant.id, 'sku', e.target.value)}
                                  className={`w-full sm:w-24 px-2 py-1 bg-gray-100 border rounded text-xs sm:text-sm text-gray-700 focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-white ${
                                    errors[`variant_${variant.id}_sku`] ? 'border-red-300 bg-red-50' : 'border-gray-200'
                                  }`}
                                />
                                {errors[`variant_${variant.id}_sku`] && (
                                  <p className="mt-1 text-[10px] text-red-600">{errors[`variant_${variant.id}_sku`]}</p>
                                )}
                              </div>
                            </td>
                            <td className="px-3 py-2">
                              <div>
                                <input
                                  type="text"
                                  value={variant.stock}
                                  onChange={(e) => handleVariantChange(variant.id, 'stock', e.target.value)}
                                  className={`w-full sm:w-20 px-2 py-1 bg-gray-100 border rounded text-xs sm:text-sm text-gray-700 focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-white ${
                                    errors[`variant_${variant.id}_stock`] ? 'border-red-300 bg-red-50' : 'border-gray-200'
                                  }`}
                                />
                                {errors[`variant_${variant.id}_stock`] && (
                                  <p className="mt-1 text-[10px] text-red-600">{errors[`variant_${variant.id}_stock`]}</p>
                                )}
                              </div>
                            </td>
                            <td className="px-3 py-2">
                              <div className="flex flex-col items-center gap-1">
                                <input
                                  ref={(el) => {
                                    variantImageInputRefs.current[variant.id] = el
                                  }}
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => handleVariantImageChange(variant.id, e)}
                                  className="hidden"
                                />
                                {variantImages[variant.id] ? (
                                  <div className="relative">
                                    <img 
                                      src={variantImages[variant.id]} 
                                      alt={`Variant ${variant.id}`}
                                      className="w-12 h-12 object-cover rounded border border-gray-200"
                                    />
                                    <button
                                      onClick={() => {
                                        const newImages = { ...variantImages }
                                        delete newImages[variant.id]
                                        setVariantImages(newImages)
                                      }}
                                      className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600"
                                      type="button"
                                    >
                                      <X size={10} />
                                    </button>
                                  </div>
                                ) : (
                                  <button 
                                    onClick={() => handleVariantImageUpload(variant.id)}
                                    className="px-2 sm:px-3 py-1 bg-orange-500 text-white rounded text-xs sm:text-sm flex items-center justify-center gap-1 hover:bg-orange-600 transition-colors"
                                    aria-label="Upload variant image"
                                    type="button"
                                  >
                                    <Upload size={12} />
                                  </button>
                                )}
                                <button
                                  onClick={() => handleRemoveVariant(variant.id)}
                                  className="text-xs text-red-600 hover:text-red-700 mt-1"
                                  type="button"
                                >
                                  {t('remove') || 'Remove'}
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Card View */}
                  <div className="md:hidden space-y-3">
                    {variants.map((variant) => (
                      <div key={variant.id} className="bg-gray-50 rounded-lg p-3 space-y-3 border border-gray-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-semibold"
                              style={{ backgroundColor: variant.colorCode === 'red' ? '#ef4444' : variant.colorCode === 'blue' ? '#3b82f6' : variant.colorCode === 'pink' ? '#ec4899' : '#6b7280' }}
                            >
                              {variant.size}
                            </div>
                            <span className="text-sm font-medium text-gray-700">{variant.color} {variant.size}</span>
                          </div>
                          <div className="flex flex-col items-center gap-1">
                            <input
                              ref={(el) => {
                                variantImageInputRefs.current[variant.id] = el
                              }}
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleVariantImageChange(variant.id, e)}
                              className="hidden"
                            />
                            {variantImages[variant.id] ? (
                              <div className="relative">
                                <img 
                                  src={variantImages[variant.id]} 
                                  alt={`Variant ${variant.id}`}
                                  className="w-12 h-12 object-cover rounded border border-gray-200"
                                />
                                <button
                                  onClick={() => {
                                    const newImages = { ...variantImages }
                                    delete newImages[variant.id]
                                    setVariantImages(newImages)
                                  }}
                                  className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600"
                                  type="button"
                                >
                                  <X size={10} />
                                </button>
                              </div>
                            ) : (
                              <button 
                                onClick={() => handleVariantImageUpload(variant.id)}
                                className="px-2 py-1 bg-orange-500 text-white rounded text-xs flex items-center justify-center gap-1 hover:bg-orange-600 transition-colors"
                                aria-label="Upload variant image"
                                type="button"
                              >
                                <Upload size={10} />
                              </button>
                            )}
                            <button
                              onClick={() => handleRemoveVariant(variant.id)}
                              className="text-xs text-red-600 hover:text-red-700"
                              type="button"
                            >
                              {t('remove') || 'Remove'}
                            </button>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">{t('price')}</label>
                            <input
                              type="text"
                              value={variant.price}
                              onChange={(e) => handleVariantChange(variant.id, 'price', e.target.value)}
                              className={`w-full px-2 py-1 bg-white border rounded text-sm text-gray-700 focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                                errors[`variant_${variant.id}_price`] ? 'border-red-300 bg-red-50' : 'border-gray-200'
                              }`}
                            />
                            {errors[`variant_${variant.id}_price`] && (
                              <p className="mt-1 text-[10px] text-red-600">{errors[`variant_${variant.id}_price`]}</p>
                            )}
                          </div>
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">{t('stock')}</label>
                            <input
                              type="text"
                              value={variant.stock}
                              onChange={(e) => handleVariantChange(variant.id, 'stock', e.target.value)}
                              className={`w-full px-2 py-1 bg-white border rounded text-sm text-gray-700 focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                                errors[`variant_${variant.id}_stock`] ? 'border-red-300 bg-red-50' : 'border-gray-200'
                              }`}
                            />
                            {errors[`variant_${variant.id}_stock`] && (
                              <p className="mt-1 text-[10px] text-red-600">{errors[`variant_${variant.id}_stock`]}</p>
                            )}
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">{t('skuCode')}</label>
                          <input
                            type="text"
                            value={variant.sku}
                            onChange={(e) => handleVariantChange(variant.id, 'sku', e.target.value)}
                            className={`w-full px-2 py-1 bg-white border rounded text-sm text-gray-700 focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                              errors[`variant_${variant.id}_sku`] ? 'border-red-300 bg-red-50' : 'border-gray-200'
                            }`}
                          />
                          {errors[`variant_${variant.id}_sku`] && (
                            <p className="mt-1 text-[10px] text-red-600">{errors[`variant_${variant.id}_sku`]}</p>
                          )}
                        </div>
                      </div>
                    ))}
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
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center justify-center gap-2 w-full sm:w-auto px-4 sm:px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base transition-colors"
                  >
                    {isSaving ? <ButtonLoader size="sm" /> : null}
                    {isSaving ? t('saving') : t('saveChanges')}
                  </button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Modals */}
      <SuccessModal
        isOpen={successModal.isOpen}
        onClose={() => {
          setSuccessModal({ isOpen: false, message: '', title: '' })
          navigate(`/products/${productId}`)
        }}
        title={successModal.title}
        message={successModal.message}
      />
      
      <ErrorModal
        isOpen={errorModal.isOpen}
        onClose={() => setErrorModal({ isOpen: false, message: '', title: '' })}
        title={errorModal.title}
        message={errorModal.message}
      />
    </div>
  )
}

