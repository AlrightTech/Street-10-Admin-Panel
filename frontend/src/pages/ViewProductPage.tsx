import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Menu, Edit, Trash2, ArrowLeft, Plus, Youtube, Circle } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import ConfirmModal from '@/components/ui/ConfirmModal'

export default function ViewProductPage() {
  const navigate = useNavigate()
  const params = useParams()
  const productId = params?.id as string
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const { t, language, translateProduct } = useLanguage()

  // Product images array - different images for carousel
  const productImages = [
    'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1574717024653-430fd2b7316a?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=800&h=800&fit=crop'
  ]

  // Mock product data
  const mockProducts: any = {
    '1': { 
      id: 1, 
      name: 'Apple AirPods Pro (2nd Generation)', 
      sku: 'WH-001', 
      category: 'Electronics', 
      price: 249.99, 
      salePrice: 199.99,
      stock: 45, 
      status: false,
      condition: 'Excellent',
      brand: 'Apple',
      description: 'Experience next-level sound with the Apple AirPods Pro (2nd generation). Featuring personalized Spatial Audio, longer battery life, and the Apple H2 chip for a magical listening experience.',
      slug: 'apple-airpods-pro-2nd-generation',
      metaTitle: 'Apple AirPods Pro 2nd Gen - Premium Wireless Earbuds',
      metaDescription: 'Shop Apple AirPods Pro 2nd Generation with personalized Spatial Audio, Active Noise Cancellation, and up to 6 hours of listening time.',
      weight: '0.056 kg',
      dimensions: '3.05 x 2.18 x 2.40 cm',
      totalViews: '1,234',
      totalOrders: '89',
      revenue: '$17,791',
      conversionRate: '7.2%',
      totalSaved: '44',
      totalShared: '900',
      youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' // YouTube review video URL
    }
  }

  const rawProduct = mockProducts[productId] || mockProducts['1']
  const product = translateProduct(rawProduct)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
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
        
        {/* Desktop Sidebar Toggle Button */}
        {sidebarCollapsed && (
          <button
            onClick={() => setSidebarCollapsed(false)}
            className="hidden lg:block fixed left-0 top-4 z-30 bg-primary-500 text-white p-2 rounded-r-lg hover:bg-primary-600 transition-colors"
            aria-label="Toggle sidebar"
          >
            <Menu size={24} />
          </button>
        )}

        {/* Main Content - Visible on ALL screens */}
        <div className="flex-1 flex flex-col h-screen overflow-hidden bg-gray-50 w-full">
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
          
          <main className="flex-1 overflow-y-auto overflow-x-hidden p-3 sm:p-4 md:p-6 pt-16 lg:pt-6">
            <div className="space-y-4 sm:space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                <div>
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">{t('allProducts')}</h1>
                  <div className="text-xs sm:text-sm text-gray-500 mt-1">{t('dashboard')} <span className="font-semibold text-gray-700">/ {t('viewProduct')}</span></div>
                </div>
                <button
                  onClick={() => navigate('/products/add')}
                  className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm sm:text-base"
                >
                  <Plus size={18} className="sm:w-5 sm:h-5" />
                  <span className="font-medium">{t('addProduct')}</span>
                </button>
              </div>

              {/* Main Content - Two Column Layout (Left: Product Info, Right: Actions & Performance) */}
              <div className="grid grid-cols-12 gap-4 sm:gap-6">
                {/* Left Column - Product Images & Details */}
                <div className="col-span-12 lg:col-span-8">
                  <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
                    {/* Inner Grid - Images on Left, Details on Right */}
                    <div className="grid grid-cols-12 gap-4 sm:gap-6">
                      {/* Left Side - Product Images Carousel */}
                      <div className="col-span-12 md:col-span-5">
                        {/* Main Product Image */}
                        <div className="w-full bg-white rounded-lg mb-4 flex items-center justify-center">
                          <img 
                            src={productImages[selectedImageIndex]} 
                            alt={product.name}
                            className="w-full aspect-square object-contain rounded-lg"
                          />
                        </div>
                        {/* Thumbnails - Functional Carousel */}
                        <div className="flex gap-2 sm:gap-3 justify-center flex-wrap">
                          {productImages.map((image, index) => (
                            <button
                              key={index}
                              onClick={() => setSelectedImageIndex(index)}
                              className={`rounded-lg overflow-hidden border-2 transition-all ${
                                selectedImageIndex === index 
                                  ? 'border-orange-500 ring-2 ring-orange-200' 
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <img 
                                src={image} 
                                alt={`Product thumbnail ${index + 1}`} 
                                className="w-16 h-16 sm:w-20 sm:h-20 object-cover" 
                              />
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Right Side - Product Details */}
                      <div className="col-span-12 md:col-span-7">
                        {/* Product Title & Category */}
                        <div className="mb-4">
                          <h2 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h2>
                          <p className="text-sm text-gray-600">{product.category}</p>
                        </div>
                        
                        {/* Description */}
                        <p className="text-sm text-gray-700 mb-6 leading-relaxed">
                          {product.description}
                        </p>
                        
                        {/* Additional Documents */}
                        <div className="mb-6">
                          <h3 className="text-sm font-bold text-gray-900 mb-2">{t('additionalDocuments')}</h3>
                          <a href="#" className="text-sm text-gray-900 hover:underline flex items-center gap-1">
                            <span>{t('watchVideo')}</span>
                          </a>
                        </div>
                        
                        {/* Product Specifications */}
                        <div className="border-t border-gray-200 pt-4 mb-6">
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium text-gray-700">{t('condition')}</span>
                              <span className="text-sm text-gray-900">{product.condition}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium text-gray-700">{t('brand')}</span>
                              <span className="text-sm text-gray-900">{product.brand}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium text-gray-700">{t('regularPrice')}</span>
                              <span className="text-sm text-gray-600 line-through">${product.price}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium text-gray-700">{t('discountPrice')}</span>
                              <span className="text-sm font-bold text-green-600">${product.salePrice}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium text-gray-700">{t('stockQuantity')}</span>
                              <span className="text-sm text-gray-900">{product.stock}</span>
                            </div>
                          </div>
                        </div>

                        {/* Product Slug */}
                        <div className="pt-4 border-t border-gray-200">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-500">{t('productUrlSlug')}</span>
                            <span className="text-sm text-gray-900">{product.slug}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Admin Actions & Performance */}
                <div className="col-span-12 lg:col-span-4 space-y-4 sm:space-y-6">
                  {/* Admin Actions */}
                  <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
                    <h3 className="text-base font-bold text-gray-900 mb-4">{t('adminActions')}</h3>
                    <div className="space-y-3">
                      <button
                        onClick={() => navigate(`/products/${productId}/edit`)}
                        className="w-full px-4 py-2.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center justify-center gap-2 font-medium"
                      >
                        <Edit size={18} />
                        <span>{t('editProduct')}</span>
                      </button>
                      <button 
                        onClick={() => setShowDeleteModal(true)}
                        className="w-full px-4 py-2.5 border-2 border-red-300 bg-white text-red-600 rounded-lg hover:bg-red-50 hover:border-red-400 transition-colors flex items-center justify-center gap-2 font-medium"
                      >
                        <Trash2 size={18} />
                        <span>{t('deleteProduct')}</span>
                      </button>
                    </div>
                  </div>

                  {/* Performance */}
                  <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
                    <h3 className="text-base font-bold text-gray-900 mb-4">{t('performance')}</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-700">{t('totalViews')}</span>
                        <span className="text-sm font-medium text-gray-900">{product.totalViews}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-700">{t('totalOrders')}</span>
                        <span className="text-sm font-medium text-gray-900">{product.totalOrders}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-700">{t('revenue')}</span>
                        <span className="text-sm font-medium text-gray-900">{product.revenue}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-700">{t('conversionRate')}</span>
                        <span className="text-sm font-medium text-gray-900">{product.conversionRate}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-700">{t('totalSaved')}</span>
                        <span className="text-sm font-medium text-gray-900">{product.totalSaved}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-700">{t('totalShared')}</span>
                        <span className="text-sm font-medium text-gray-900">{product.totalShared}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* YouTube Review - Full Width */}
              <a 
                href={product.youtubeUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white rounded-lg shadow-sm p-4 block hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <Youtube size={20} className="text-red-500" />
                  <span className="text-sm font-medium text-gray-900">{t('youtubeReview')}</span>
                  <Circle size={8} className="text-red-500 fill-red-500 ml-auto" />
                </div>
              </a>

              {/* Bottom Section - Additional Information & SEO */}
              <div className="grid grid-cols-12 gap-4 sm:gap-6">
                {/* Additional Information */}
                <div className="col-span-12 lg:col-span-6">
                  <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
                    <h3 className="text-base font-bold text-gray-900 mb-4">{t('additionalInformation')}</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-700">{t('weight')}</span>
                        <span className="text-sm text-gray-900">{product.weight}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-700">{t('dimensions')}</span>
                        <span className="text-sm text-gray-900">{product.dimensions}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* SEO & Marketing */}
                <div className="col-span-12 lg:col-span-6">
                  <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
                    <h3 className="text-base font-bold text-gray-900 mb-4">{t('seoMarketing')}</h3>
                    <div className="space-y-4">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">{t('metaTitle')}</p>
                        <p className="text-sm text-gray-900">{product.metaTitle}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">{t('metaDescription')}</p>
                        <p className="text-sm text-gray-900">{product.metaDescription}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={() => {
          // Handle delete logic here
          navigate('/products')
        }}
        title={language === 'ar' ? 'حذف المنتج' : 'Delete Product'}
        message={language === 'ar' 
          ? 'هل أنت متأكد من حذف هذا المنتج؟ لا يمكن التراجع عن هذا الإجراء.' 
          : 'Are you sure you want to delete this product? This action cannot be undone.'}
        confirmText={language === 'ar' ? 'حذف' : 'Delete'}
        cancelText={language === 'ar' ? 'إلغاء' : 'Cancel'}
        confirmButtonColor="red"
      />
    </div>
  )
}