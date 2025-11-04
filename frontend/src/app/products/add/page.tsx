'use client'

import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Menu, Upload, X, ChevronDown, Info } from 'lucide-react'

export default function AddProductPage() {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

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
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handlePublish = () => {
    alert('Product published!')
    router.push('/products')
  }

  const handleCancel = () => {
    router.push('/products')
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
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">All Products</h1>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">Dashboard <span className="font-semibold text-gray-700">/ Add New Product</span></p>
              </div>

              {/* Form */}
              <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm space-y-4 sm:space-y-6">
                {/* Product Details */}
                <div className="space-y-3 sm:space-y-4">
                  <h2 className="text-base sm:text-lg font-bold text-gray-900">Product Details</h2>
                  
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Product Title</label>
                    <input
                      name="title"
                      type="text"
                      placeholder="Enter Product Title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg text-gray-700 focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-white text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Category</label>
                      <div className="relative">
                        <select
                          name="category"
                          value={formData.category}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg text-gray-700 appearance-none focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-white text-sm"
                        >
                          <option value="">Select Category</option>
                          <option>Electronic</option>
                          <option>Clothing</option>
                          <option>Sports</option>
                          <option>Home & Garden</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Condition</label>
                      <div className="relative">
                        <select
                          name="condition"
                          value={formData.condition}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg text-gray-700 appearance-none focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-white text-sm"
                        >
                          <option value="">Select Condition</option>
                          <option>Excellent</option>
                          <option>Good</option>
                          <option>Fair</option>
                          <option>Poor</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Product Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={4}
                      placeholder="Enter Product Description"
                      className="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg text-gray-700 focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-white text-sm"
                    />
                  </div>
                </div>

                {/* Upload Media */}
                <div className="border-t pt-4 sm:pt-6">
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">Upload Media</h3>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 sm:p-8 text-center">
                    <div className="flex justify-center mb-3 sm:mb-4">
                      <Upload size={48} className="text-amber-600" />
                    </div>
                    <p className="text-gray-700 text-sm sm:text-base mb-1">Drag & drop for image</p>
                    <p className="text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4">
                      Support JPG, PNG, WEBP up to 10MB each. Max 10 images.
                    </p>
                    <a href="#" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                      + Add Another Media
                    </a>
                  </div>
                </div>

                {/* Upload Doc */}
                <div className="border-t pt-4 sm:pt-6">
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">Upload Doc</h3>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 sm:p-8 text-center">
                    <div className="flex justify-center mb-3 sm:mb-4">
                      <Upload size={48} className="text-amber-600" />
                    </div>
                    <p className="text-gray-700 text-sm sm:text-base mb-1">Drag & drop for Document</p>
                    <a href="#" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                      + Add Another Doc And Title
                    </a>
                  </div>
                </div>

                {/* SEO & Marketing */}
                <div className="border-t pt-4 sm:pt-6 space-y-3 sm:space-y-4">
                  <h2 className="text-base sm:text-lg font-bold text-gray-900">SEO & Marketing</h2>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Meta Title</label>
                      <input
                        name="metaTitle"
                        type="text"
                        placeholder="Enter Meta Title"
                        value={formData.metaTitle}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg text-gray-700 focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-white text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Meta Description</label>
                      <input
                        name="metaDescription"
                        type="text"
                        placeholder="Enter Description"
                        value={formData.metaDescription}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg text-gray-700 focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-white text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Product URL Slug</label>
                    <input
                      name="slug"
                      type="text"
                      placeholder="Product URL Slug"
                      value={formData.slug}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg text-gray-700 focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-white text-sm"
                    />
                  </div>
                </div>

                {/* Pricing & Stock */}
                <div className="border-t pt-4 sm:pt-6 space-y-3 sm:space-y-4">
                  <h2 className="text-base sm:text-lg font-bold text-gray-900">Pricing & Stock</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                      <input
                        name="price"
                        type="text"
                        value={formData.price}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg text-gray-700 focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-white text-sm"
                      />
                    </div>
                    <div>
                      <label className="flex items-center gap-1 text-xs sm:text-sm font-medium text-gray-700 mb-1">
                        Discount Price ($)
                        <Info size={14} className="text-gray-400" />
                      </label>
                      <input
                        name="discountPrice"
                        type="text"
                        value={formData.discountPrice}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg text-gray-700 focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-white text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Stock Quantity</label>
                      <input
                        name="stockQuantity"
                        type="text"
                        value={formData.stockQuantity}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg text-gray-700 focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-white text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Stock Status</label>
                    <input
                      name="stockStatus"
                      type="text"
                      value={formData.stockStatus}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg text-gray-700 focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-white text-sm max-w-xs"
                    />
                  </div>
                </div>

                {/* Additional Information */}
                <div className="border-t pt-4 sm:pt-6 space-y-3 sm:space-y-4">
                  <h2 className="text-base sm:text-lg font-bold text-gray-900">Additional Information</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Brand</label>
                      <input
                        name="brand"
                        type="text"
                        value={formData.brand}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg text-gray-700 focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-white text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Weight</label>
                      <input
                        name="weight"
                        type="text"
                        value={formData.weight}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg text-gray-700 focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-white text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Dimensions</label>
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

                {/* Footer Buttons */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3 pt-4 sm:pt-6 border-t">
                  <button
                    onClick={handleCancel}
                    className="w-full sm:w-auto px-4 sm:px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm sm:text-base"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handlePublish}
                    className="w-full sm:w-auto px-4 sm:px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 text-sm sm:text-base"
                  >
                    Publish Product
                  </button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

