import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'
import { useState, Fragment, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Menu, ChevronLeft, ChevronRight, Search, Plus, Edit, Trash2, ChevronDown, Filter, AlertTriangle, X } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { ButtonLoader } from '@/components/ui/Loader'

export default function ProductsPage() {
  const navigate = useNavigate()
  const { t, language, translateProduct } = useLanguage()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [activeTab, setActiveTab] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [productToDelete, setProductToDelete] = useState<number | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [togglingProductId, setTogglingProductId] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterCategory, setFilterCategory] = useState('All Categories')
  const [filterStatus, setFilterStatus] = useState('All Status')
  const [filterStock, setFilterStock] = useState('All Stock')
  const [sortBy, setSortBy] = useState('Sort by: Date Added')
  const [showFilterDropdown, setShowFilterDropdown] = useState(false)
  const itemsPerPage = 5

  // Mock product data - matching the image EXACTLY
  const [rawProducts, setRawProducts] = useState([
    { id: 1, name: 'Apple AirPods Pro (2nd)', sku: 'WH-001', category: 'Electronics', price: 200, orders: 5, stock: 752, status: false, slug: 'apple-airpods-pro-2nd' },
    { id: 2, name: 'Premium T-Shirt', sku: 'TS-002', category: 'Clothing', price: 200, orders: 55, stock: 554, status: true, slug: 'premium-t-shirt' },
    { id: 3, name: 'Running Shoes', sku: 'YM-003', category: 'Sports', price: 200, orders: 6, stock: 156, status: true, slug: 'running-shoes' },
    { id: 4, name: 'Yoga Mat Pro', sku: 'RS-004', category: 'Sports', price: 200, orders: 45, stock: 528, status: true, slug: 'yoga-mat-pro' },
    { id: 5, name: 'Coffee Mug Set', sku: 'CM-005', category: 'Home & Garden', price: 200, orders: 23, stock: 276, status: false, slug: 'coffee-mug-set' },
  ])

  // Automatically translate products based on current language
  const products = useMemo(() => {
    return rawProducts.map(product => translateProduct(product))
  }, [rawProducts, translateProduct, language])

  const activeCount = products.filter(p => p.status).length
  const inactiveCount = products.filter(p => !p.status).length
  
  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = products

    // Filter by active tab
    if (activeTab === 'active') {
      result = result.filter(p => p.status)
    } else if (activeTab === 'inactive') {
      result = result.filter(p => !p.status)
    }

    // Filter by search query
    if (searchQuery && searchQuery.trim().length > 0) {
      const query = searchQuery.toLowerCase().trim()
      result = result.filter(p => {
        const productName = (p.name || '').toLowerCase()
        const productSku = (p.sku || '').toLowerCase()
        const productCategory = (p.category || '').toLowerCase()
        
        return productName.includes(query) || productSku.includes(query) || productCategory.includes(query)
      })
    }

    // Filter by category
    if (filterCategory !== 'All Categories') {
      result = result.filter(p => p.category === filterCategory)
    }

    // Filter by status
    if (filterStatus === 'Active') {
      result = result.filter(p => p.status)
    } else if (filterStatus === 'Inactive') {
      result = result.filter(p => !p.status)
    }

    // Filter by stock
    if (filterStock === 'In Stock') {
      result = result.filter(p => p.stock > 0)
    } else if (filterStock === 'Low Stock') {
      result = result.filter(p => p.stock > 0 && p.stock < 200)
    } else if (filterStock === 'Out of Stock') {
      result = result.filter(p => p.stock === 0)
    }

    // Sort products
    if (sortBy === 'Sort by: Name') {
      result = [...result].sort((a, b) => a.name.localeCompare(b.name))
    } else if (sortBy === 'Sort by: Price') {
      result = [...result].sort((a, b) => a.price - b.price)
    } else if (sortBy === 'Sort by: Orders') {
      result = [...result].sort((a, b) => b.orders - a.orders)
    }

    return result
  }, [products, activeTab, searchQuery, filterCategory, filterStatus, filterStock, sortBy])

  // Calculate total pages based on filtered products
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, filterCategory, filterStatus, filterStock, sortBy, activeTab])

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchQuery(value)
    setCurrentPage(1)
  }

  // Pagination
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex)

  // Toggle product status
  const handleToggleStatus = async (productId: number) => {
    setTogglingProductId(productId)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 300))
    setRawProducts(rawProducts.map(p => 
      p.id === productId ? { ...p, status: !p.status } : p
    ))
    setTogglingProductId(null)
  }

  // Handle view product
  const handleViewProduct = (productId: number) => {
    navigate(`/products/${productId}`)
  }

  // Handle edit
  const handleEdit = (productId: number) => {
    navigate(`/products/${productId}/edit`)
  }

  // Handle delete - open modal
  const handleDelete = (productId: number) => {
    setProductToDelete(productId)
    setDeleteModalOpen(true)
  }

  // Confirm delete
  const confirmDelete = async () => {
    if (productToDelete === null) return
    
    setIsDeleting(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))
    
    setRawProducts(rawProducts.filter(p => p.id !== productToDelete))
    setDeleteModalOpen(false)
    setProductToDelete(null)
    setIsDeleting(false)
  }

  // Cancel delete
  const cancelDelete = () => {
    setDeleteModalOpen(false)
    setProductToDelete(null)
  }

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (deleteModalOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [deleteModalOpen])

  // Get visible pages for pagination
  const getVisiblePages = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }
    if (currentPage <= 3) {
      return [1, 2, 3, null, totalPages - 1, totalPages]
    } else if (currentPage >= totalPages - 2) {
      return [1, 2, null, totalPages - 2, totalPages - 1, totalPages]
    } else {
      return [1, 2, null, currentPage - 1, currentPage, currentPage + 1, null, totalPages - 1, totalPages]
    }
  }

  const visiblePages = getVisiblePages()

  // Close filter dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (showFilterDropdown && !target.closest('.filter-dropdown-container')) {
        setShowFilterDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showFilterDropdown])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-[45] bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Desktop Layout - Side by Side */}
      <div className="hidden lg:flex h-screen overflow-hidden">
        {/* Sidebar - Collapsible */}
        {!sidebarCollapsed && (
          <div className="w-64 flex-shrink-0 bg-primary-500 h-screen overflow-y-auto">
            <Sidebar onClose={() => setSidebarCollapsed(true)} currentPage="products" />
          </div>
        )}
        
        {/* Sidebar Toggle Button - Show when collapsed */}
        {sidebarCollapsed && (
          <button
            onClick={() => setSidebarCollapsed(false)}
            className="fixed left-0 top-4 z-30 bg-primary-500 text-white p-2 rounded-r-lg hover:bg-primary-600 transition-colors"
            aria-label="Toggle sidebar"
          >
            <Menu size={24} />
          </button>
        )}

        {/* Main Content - Takes remaining space, independently scrollable */}
        <div className={`flex-1 flex flex-col h-screen overflow-hidden bg-gray-50 ${sidebarCollapsed ? 'w-full' : ''}`}>
          {/* Fixed Header */}
          <div className="flex-shrink-0 sticky top-0 z-10 bg-white border-b border-gray-200">
            <Header />
          </div>
          
          {/* Scrollable Main Content */}
          <main className="flex-1 overflow-y-auto overflow-x-hidden p-6">
            <div className="space-y-4 sm:space-y-6">
              {/* Title and Breadcrumbs */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4">
                <div>
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">All Products</h1>
                  <div className="text-xs sm:text-sm mt-1">
                    <span className="text-gray-500">Dashboard</span>
                    <span className="text-gray-900"> • All Products</span>
                  </div>
                </div>
                <button
                  onClick={() => navigate('/products/add')}
                  className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm sm:text-base"
                >
                  <Plus size={18} className="sm:w-5 sm:h-5" />
                  <span className="font-medium">{t('Add Product')}</span>
                </button>
              </div>

              {/* Filter Dropdowns - Hidden on mobile */}
              <div className="hidden md:block bg-white rounded-lg p-4 shadow-sm mb-4">
                <div className="flex items-center gap-3 flex-wrap">
                  <select 
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-xs sm:text-sm text-gray-700 bg-white cursor-pointer" 
                    aria-label="Filter by category"
                    title="Filter by category"
                  >
                    <option>All Categories</option>
                    <option>Electronics</option>
                    <option>Clothing</option>
                    <option>Sports</option>
                    <option>Home & Garden</option>
                  </select>
                  
                  <select 
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-xs sm:text-sm text-gray-700 bg-white cursor-pointer" 
                    aria-label="Filter by status"
                    title="Filter by status"
                  >
                    <option>All Status</option>
                    <option>Active</option>
                    <option>Inactive</option>
                  </select>
                  
                  <select 
                    value={filterStock}
                    onChange={(e) => setFilterStock(e.target.value)}
                    className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-xs sm:text-sm text-gray-700 bg-white cursor-pointer" 
                    aria-label="Filter by stock"
                    title="Filter by stock"
                  >
                    <option>All Stock</option>
                    <option>In Stock</option>
                    <option>Low Stock</option>
                    <option>Out of Stock</option>
                  </select>
                  
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-xs sm:text-sm text-gray-700 bg-white cursor-pointer" 
                    aria-label="Sort products"
                    title="Sort products"
                  >
                    <option>Sort by: Date Added</option>
                    <option>Sort by: Name</option>
                    <option>Sort by: Price</option>
                    <option>Sort by: Orders</option>
                  </select>
                </div>
              </div>

              {/* Status Tabs */}
              <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4">
                  {/* Status Tabs */}
                  <div className="flex flex-wrap gap-2">
                    <div className="flex flex-col">
                      <button 
                        onClick={() => setActiveTab('all')}
                          className="px-3 sm:px-4 py-2 rounded-lg transition-colors text-gray-700 hover:bg-gray-50 text-sm"
                      >
                        All <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                            activeTab === 'all' ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-700'
                        }`}>{products.length}</span>
                      </button>
                        {activeTab === 'all' && <div className="w-full h-0.5 bg-primary-500 mt-1"></div>}
                    </div>
                    <div className="flex flex-col">
                      <button 
                        onClick={() => setActiveTab('active')}
                          className="px-3 sm:px-4 py-2 rounded-lg transition-colors text-gray-700 hover:bg-gray-50 text-sm"
                      >
                        Active <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                            activeTab === 'active' ? 'bg-green-600 text-white' : 'bg-green-100 text-green-700'
                        }`}>{activeCount}</span>
                      </button>
                        {activeTab === 'active' && <div className="w-full h-0.5 bg-green-600 mt-1"></div>}
                    </div>
                    <div className="flex flex-col">
                      <button 
                        onClick={() => setActiveTab('inactive')}
                          className="px-3 sm:px-4 py-2 rounded-lg transition-colors text-gray-700 hover:bg-gray-50 text-sm"
                      >
                        Inactive <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                            activeTab === 'inactive' ? 'bg-red-600 text-white' : 'bg-red-100 text-red-700'
                        }`}>{inactiveCount}</span>
                      </button>
                        {activeTab === 'inactive' && <div className="w-full h-0.5 bg-red-600 mt-1"></div>}
                    </div>
                  </div>
                
                  {/* Search and Filter */}
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="relative flex-1 sm:flex-initial">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        placeholder={t('Search Transaction')}
                        className={`w-full sm:w-48 md:w-64 pl-9 sm:pl-10 ${searchQuery ? 'pr-8' : 'pr-3'} py-2 border ${searchQuery ? 'border-primary-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm transition-colors`}
                        autoComplete="off"
                      />
                      {searchQuery && (
                        <button
                          onClick={() => {
                            setSearchQuery('')
                            setCurrentPage(1)
                          }}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
                          type="button"
                          aria-label="Clear search"
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>
                    {searchQuery && (
                      <div className="hidden sm:block text-xs text-gray-500 whitespace-nowrap">
                        {filteredProducts.length} {filteredProducts.length === 1 ? 'result' : 'results'}
                      </div>
                    )}
                    <div className="relative filter-dropdown-container">
                      <button 
                        onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                        className={`hidden sm:flex items-center gap-2 px-3 sm:px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm ${showFilterDropdown ? 'bg-gray-100' : ''}`}
                        aria-label="Filter"
                        type="button"
                      >
                        <Filter size={18} />
                        <span className="hidden md:inline">Filter</span>
                      </button>
                      
                      {/* Filter Dropdown */}
                      {showFilterDropdown && (
                        <>
                          <div 
                            className="fixed inset-0 z-40 lg:hidden"
                            onClick={() => setShowFilterDropdown(false)}
                          />
                          <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-[60]">
                            <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                              <h3 className="text-sm font-semibold text-gray-900">{t('filterProducts') || 'Filter Products'}</h3>
                              <button
                                onClick={() => setShowFilterDropdown(false)}
                                className="p-1 rounded-md hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600"
                                type="button"
                                aria-label="Close filter"
                              >
                                <X size={18} />
                              </button>
                            </div>
                            <div className="px-4 py-3 space-y-4 max-h-[60vh] overflow-y-auto">
                              {/* Category Filter */}
                              <div>
                                <label className="text-xs font-medium text-gray-700 mb-2 block">{t('category') || 'Category'}</label>
                                <select
                                  value={filterCategory}
                                  onChange={(e) => setFilterCategory(e.target.value)}
                                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white cursor-pointer"
                                >
                                  <option>All Categories</option>
                                  <option>Electronics</option>
                                  <option>Clothing</option>
                                  <option>Sports</option>
                                  <option>Home & Garden</option>
                                </select>
                              </div>
                              {/* Status Filter */}
                              <div>
                                <label className="text-xs font-medium text-gray-700 mb-2 block">{t('status') || 'Status'}</label>
                                <select
                                  value={filterStatus}
                                  onChange={(e) => setFilterStatus(e.target.value)}
                                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white cursor-pointer"
                                >
                                  <option>All Status</option>
                                  <option>Active</option>
                                  <option>Inactive</option>
                                </select>
                              </div>
                              {/* Stock Filter */}
                              <div>
                                <label className="text-xs font-medium text-gray-700 mb-2 block">{t('stock') || 'Stock'}</label>
                                <select
                                  value={filterStock}
                                  onChange={(e) => setFilterStock(e.target.value)}
                                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white cursor-pointer"
                                >
                                  <option>All Stock</option>
                                  <option>In Stock</option>
                                  <option>Low Stock</option>
                                  <option>Out of Stock</option>
                                </select>
                              </div>
                              {/* Sort */}
                              <div>
                                <label className="text-xs font-medium text-gray-700 mb-2 block">{t('sortBy') || 'Sort By'}</label>
                                <select
                                  value={sortBy}
                                  onChange={(e) => setSortBy(e.target.value)}
                                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white cursor-pointer"
                                >
                                  <option>Sort by: Date Added</option>
                                  <option>Sort by: Name</option>
                                  <option>Sort by: Price</option>
                                  <option>Sort by: Orders</option>
                                </select>
                              </div>
                            </div>
                            <div className="px-4 py-3 border-t border-gray-200 flex gap-2 bg-gray-50">
                              <button
                                onClick={() => {
                                  setFilterCategory('All Categories')
                                  setFilterStatus('All Status')
                                  setFilterStock('All Stock')
                                  setSortBy('Sort by: Date Added')
                                  setShowFilterDropdown(false)
                                }}
                                className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 active:scale-[0.98] transition-all duration-200"
                                type="button"
                              >
                                {t('reset') || 'Reset'}
                              </button>
                              <button
                                onClick={() => setShowFilterDropdown(false)}
                                className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-primary-500 rounded-lg hover:bg-primary-600 active:scale-[0.98] transition-all duration-200 shadow-sm hover:shadow-md"
                                type="button"
                              >
                                {t('apply') || 'Apply'}
                              </button>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Product Table - Desktop View */}
              <div className="hidden md:block bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-white border-b border-gray-300">
                      <tr>
                        <th className="text-left py-3 px-3 sm:px-4 text-xs sm:text-sm font-medium text-gray-700">Product</th>
                        <th className="text-left py-3 px-3 sm:px-4 text-xs sm:text-sm font-medium text-gray-700">Category</th>
                        <th className="text-left py-3 px-3 sm:px-4 text-xs sm:text-sm font-medium text-gray-700">Price</th>
                        <th className="text-left py-3 px-3 sm:px-4 text-xs sm:text-sm font-medium text-gray-700">Orders</th>
                        <th className="text-left py-3 px-3 sm:px-4 text-xs sm:text-sm font-medium text-gray-700">Stock</th>
                        <th className="text-left py-3 px-3 sm:px-4 text-xs sm:text-sm font-medium text-gray-700">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {paginatedProducts.map((product: { id: number; name: string; sku: string; category: string; price: number; orders: number; stock: number; status: boolean; slug: string }) => (
                        <tr key={product.id} className="hover:bg-gray-50">
                          {/* Product Column - Clickable */}
                          <td className="py-3 px-3 sm:px-4 cursor-pointer" onClick={() => handleViewProduct(product.id)}>
                            <div className="flex items-center space-x-2 sm:space-x-3">
                              <img 
                                src={`https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=100&h=100&fit=crop`} 
                                alt={product.name} 
                                className="w-10 h-10 sm:w-12 sm:h-12 rounded object-cover" 
                              />
                              <div>
                                <p className="text-xs sm:text-sm font-medium text-gray-900">{product.name}</p>
                                <p className="text-xs text-gray-500">{t('sku')}: {product.sku}</p>
                              </div>
                            </div>
                          </td>
                          
                          {/* Category */}
                          <td className="py-3 px-3 sm:px-4 text-xs sm:text-sm text-gray-700">{product.category}</td>
                          
                          {/* Price */}
                          <td className="py-3 px-3 sm:px-4 text-xs sm:text-sm font-medium text-gray-900">${product.price}</td>
                          
                          {/* Orders */}
                          <td className="py-3 px-3 sm:px-4 text-xs sm:text-sm text-gray-700">{String(product.orders).padStart(2, '0')}</td>
                          
                          {/* Stock */}
                          <td className="py-3 px-3 sm:px-4 text-xs sm:text-sm text-gray-700">{product.stock}</td>
                          
                          {/* Status - All in one column */}
                          <td className="py-3 px-3 sm:px-4">
                            <div className="flex items-center justify-between gap-2">
                              {/* Toggle Switch */}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleToggleStatus(product.id)
                                }}
                                disabled={togglingProductId === product.id}
                                className={`relative inline-flex h-5 w-11 items-center rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${product.status ? 'bg-primary-500' : 'bg-gray-300'}`}
                                aria-label="Toggle status"
                              >
                                {togglingProductId === product.id ? (
                                  <span className="absolute inset-0 flex items-center justify-center">
                                    <ButtonLoader size="sm" />
                                  </span>
                                ) : (
                                  <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${product.status ? 'translate-x-6' : 'translate-x-1'}`} />
                                )}
                              </button>
                              
                              {/* Edit and Delete Buttons */}
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleEdit(product.id)
                                  }}
                                  className="text-gray-600 hover:text-blue-600 transition-colors"
                                  aria-label="Edit product"
                                >
                                  <Edit size={14} className="sm:w-4 sm:h-4" />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleDelete(product.id)
                                  }}
                                  className="text-gray-600 hover:text-red-600 transition-colors"
                                  aria-label="Delete product"
                                >
                                  <Trash2 size={14} className="sm:w-4 sm:h-4" />
                              </button>
                              </div>
                            </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                {/* Pagination - RIGHT Side */}
                <div className="border-t border-gray-200 bg-white px-3 sm:px-4 py-3 flex items-center justify-end gap-1 sm:gap-2 flex-wrap">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="flex items-center gap-1 text-xs sm:text-sm text-gray-700 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft size={14} className="sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">{t('back')}</span>
                          </button>

                  <div className="flex items-center gap-1 sm:gap-2">
                    {visiblePages.map((page: number | null, index: number) => {
                      if (page === null) return null
                      const prevPage = visiblePages[index - 1]
                      const showEllipsis = index > 0 && prevPage !== null && page - prevPage > 1
                      
                      return (
                        <div key={page} className="flex items-center gap-1 sm:gap-2">
                          {showEllipsis && <span className="text-gray-500 text-xs">...</span>}
                          <button
                            onClick={() => setCurrentPage(page)}
                            className={`min-w-[28px] sm:min-w-[32px] px-2 sm:px-3 py-1 rounded text-xs sm:text-sm ${
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
                  </div>

                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-1 text-xs sm:text-sm text-gray-700 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="hidden sm:inline">{t('next')}</span>
                    <ChevronRight size={14} className="sm:w-4 sm:h-4" />
                  </button>
                </div>
              </div>

              {/* Mobile Product Cards */}
              <div className="md:hidden space-y-3">
                {paginatedProducts.map((product: { id: number; name: string; sku: string; category: string; price: number; orders: number; stock: number; status: boolean; slug: string }) => (
                  <div 
                    key={product.id} 
                    className="bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer"
                    onClick={() => handleViewProduct(product.id)}
                  >
                    <div className="p-4 space-y-3">
                      {/* Product Info */}
                      <div className="flex items-start gap-3">
                        <img 
                          src={`https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=100&h=100&fit=crop`} 
                          alt={product.name} 
                          className="w-16 h-16 rounded object-cover flex-shrink-0" 
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">{product.name}</p>
                          <p className="text-xs text-gray-500">{t('sku')}: {product.sku}</p>
                          <p className="text-xs text-gray-600 mt-1">{product.category}</p>
                        </div>
                      </div>

                      {/* Stats Row */}
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div>
                          <p className="text-gray-500 text-xs">{t('price')}</p>
                          <p className="font-medium text-gray-900">${product.price}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs">{t('orders')}</p>
                          <p className="font-medium text-gray-900">{product.orders}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs">{t('stock')}</p>
                          <p className="font-medium text-gray-900">{product.stock}</p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-between pt-2 border-t" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs px-2 py-1 rounded-full ${product.status ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                            {product.status ? t('active') : t('inactive')}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleToggleStatus(product.id)}
                            disabled={togglingProductId === product.id}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${product.status ? 'bg-primary-500' : 'bg-gray-300'}`}
                            aria-label="Toggle product status"
                          >
                            {togglingProductId === product.id ? (
                              <span className="absolute inset-0 flex items-center justify-center">
                                <ButtonLoader size="sm" />
                              </span>
                            ) : (
                              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${product.status ? 'translate-x-6' : 'translate-x-1'}`} />
                            )}
                          </button>
                          <button
                            onClick={() => handleEdit(product.id)}
                            className="text-gray-600 hover:text-blue-600"
                            aria-label="Edit product"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="text-gray-600 hover:text-red-600"
                            aria-label="Delete product"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Mobile Pagination */}
              <div className="md:hidden flex items-center justify-between mt-6 bg-white rounded-lg p-4">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="flex items-center gap-1 text-sm text-gray-700 disabled:opacity-50"
                >
                  <ChevronLeft size={16} />
                  {t('back')}
                </button>
                <span className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-1 text-sm text-gray-700 disabled:opacity-50"
                >
                  {t('next')}
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Mobile Layout - Stacked */}
      <div className="lg:hidden">
        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 z-[45] bg-black bg-opacity-50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        
        {/* Mobile Sidebar */}
        <div className={`
          fixed inset-y-0 left-0 z-[60] w-64 transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <Sidebar onClose={() => setSidebarOpen(false)} currentPage="products" />
        </div>

        {/* Mobile Main Content */}
        <div className="flex-1 flex flex-col min-h-screen bg-gray-50 pt-20 lg:pt-0">
          <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} isSidebarOpen={sidebarOpen} />
          <main className="flex-1 overflow-x-hidden overflow-y-auto p-4">
            <div className="space-y-4 sm:space-y-6">
              {/* Title and Breadcrumbs */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4">
                <div>
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">All Products</h1>
                  <div className="text-xs sm:text-sm mt-1">
                    <span className="text-gray-500">Dashboard</span>
                    <span className="text-gray-900"> • All Products</span>
                  </div>
                </div>
                <button
                  onClick={() => navigate('/products/add')}
                  className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm sm:text-base"
                >
                  <Plus size={18} className="sm:w-5 sm:h-5" />
                  <span className="font-medium">{t('addProduct')}</span>
                </button>
              </div>

              {/* Filter Dropdowns - Hidden on mobile */}
              <div className="hidden md:block bg-white rounded-lg p-4 shadow-sm mb-4">
                <div className="flex items-center gap-3 flex-wrap">
                  <select 
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-xs sm:text-sm text-gray-700 bg-white cursor-pointer" 
                    aria-label="Filter by category"
                    title="Filter by category"
                  >
                    <option>All Categories</option>
                    <option>Electronics</option>
                    <option>Clothing</option>
                    <option>Sports</option>
                    <option>Home & Garden</option>
                  </select>
                  
                  <select 
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-xs sm:text-sm text-gray-700 bg-white cursor-pointer" 
                    aria-label="Filter by status"
                    title="Filter by status"
                  >
                    <option>All Status</option>
                    <option>Active</option>
                    <option>Inactive</option>
                  </select>
                  
                  <select 
                    value={filterStock}
                    onChange={(e) => setFilterStock(e.target.value)}
                    className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-xs sm:text-sm text-gray-700 bg-white cursor-pointer" 
                    aria-label="Filter by stock"
                    title="Filter by stock"
                  >
                    <option>All Stock</option>
                    <option>In Stock</option>
                    <option>Low Stock</option>
                    <option>Out of Stock</option>
                  </select>
                  
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-xs sm:text-sm text-gray-700 bg-white cursor-pointer" 
                    aria-label="Sort products"
                    title="Sort products"
                  >
                    <option>Sort by: Date Added</option>
                    <option>Sort by: Name</option>
                    <option>Sort by: Price</option>
                    <option>Sort by: Orders</option>
                  </select>
                </div>
              </div>

              {/* Status Tabs */}
              <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4">
                  {/* Status Tabs */}
                  <div className="flex flex-wrap gap-2">
                    <div className="flex flex-col">
                      <button 
                        onClick={() => setActiveTab('all')}
                        className="px-3 sm:px-4 py-2 rounded-lg transition-colors text-gray-700 hover:bg-gray-50 text-sm"
                      >
                        {t('all')} <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                          activeTab === 'all' ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-700'
                        }`}>{products.length}</span>
                      </button>
                      {activeTab === 'all' && <div className="w-full h-0.5 bg-primary-500 mt-1"></div>}
                    </div>
                    <div className="flex flex-col">
                      <button 
                        onClick={() => setActiveTab('active')}
                        className="px-3 sm:px-4 py-2 rounded-lg transition-colors text-gray-700 hover:bg-gray-50 text-sm"
                      >
                        {t('active')} <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                          activeTab === 'active' ? 'bg-green-600 text-white' : 'bg-green-100 text-green-700'
                        }`}>{activeCount}</span>
                      </button>
                      {activeTab === 'active' && <div className="w-full h-0.5 bg-green-600 mt-1"></div>}
                    </div>
                    <div className="flex flex-col">
                      <button 
                        onClick={() => setActiveTab('inactive')}
                        className="px-3 sm:px-4 py-2 rounded-lg transition-colors text-gray-700 hover:bg-gray-50 text-sm"
                      >
                        {t('inactive')} <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                          activeTab === 'inactive' ? 'bg-red-600 text-white' : 'bg-red-100 text-red-700'
                        }`}>{inactiveCount}</span>
                      </button>
                      {activeTab === 'inactive' && <div className="w-full h-0.5 bg-red-600 mt-1"></div>}
                    </div>
                  </div>
                  
                  {/* Search and Filter */}
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="relative flex-1 sm:flex-initial">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        placeholder={t('searchTransactionProducts')}
                        className={`w-full sm:w-48 md:w-64 pl-9 sm:pl-10 ${searchQuery ? 'pr-8' : 'pr-3'} py-2 border ${searchQuery ? 'border-primary-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm transition-colors`}
                        autoComplete="off"
                      />
                      {searchQuery && (
                        <button
                          onClick={() => {
                            setSearchQuery('')
                            setCurrentPage(1)
                          }}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
                          type="button"
                          aria-label="Clear search"
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>
                    {searchQuery && (
                      <div className="hidden sm:block text-xs text-gray-500 whitespace-nowrap">
                        {filteredProducts.length} {filteredProducts.length === 1 ? 'result' : 'results'}
                      </div>
                    )}
                    <div className="relative filter-dropdown-container">
                      <button 
                        onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                        className={`hidden sm:flex items-center gap-2 px-3 sm:px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm ${showFilterDropdown ? 'bg-gray-100' : ''}`}
                        aria-label="Filter"
                        type="button"
                      >
                        <Filter size={18} />
                        <span className="hidden md:inline">Filter</span>
                      </button>
                      
                      {/* Filter Dropdown */}
                      {showFilterDropdown && (
                        <>
                          <div 
                            className="fixed inset-0 z-40 lg:hidden"
                            onClick={() => setShowFilterDropdown(false)}
                          />
                          <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-[60]">
                            <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                              <h3 className="text-sm font-semibold text-gray-900">{t('filterProducts') || 'Filter Products'}</h3>
                              <button
                                onClick={() => setShowFilterDropdown(false)}
                                className="p-1 rounded-md hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600"
                                type="button"
                                aria-label="Close filter"
                              >
                                <X size={18} />
                              </button>
                            </div>
                            <div className="px-4 py-3 space-y-4 max-h-[60vh] overflow-y-auto">
                              {/* Category Filter */}
                              <div>
                                <label className="text-xs font-medium text-gray-700 mb-2 block">{t('category') || 'Category'}</label>
                                <select
                                  value={filterCategory}
                                  onChange={(e) => setFilterCategory(e.target.value)}
                                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white cursor-pointer"
                                >
                                  <option>All Categories</option>
                                  <option>Electronics</option>
                                  <option>Clothing</option>
                                  <option>Sports</option>
                                  <option>Home & Garden</option>
                                </select>
                              </div>
                              {/* Status Filter */}
                              <div>
                                <label className="text-xs font-medium text-gray-700 mb-2 block">{t('status') || 'Status'}</label>
                                <select
                                  value={filterStatus}
                                  onChange={(e) => setFilterStatus(e.target.value)}
                                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white cursor-pointer"
                                >
                                  <option>All Status</option>
                                  <option>Active</option>
                                  <option>Inactive</option>
                                </select>
                              </div>
                              {/* Stock Filter */}
                              <div>
                                <label className="text-xs font-medium text-gray-700 mb-2 block">{t('stock') || 'Stock'}</label>
                                <select
                                  value={filterStock}
                                  onChange={(e) => setFilterStock(e.target.value)}
                                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white cursor-pointer"
                                >
                                  <option>All Stock</option>
                                  <option>In Stock</option>
                                  <option>Low Stock</option>
                                  <option>Out of Stock</option>
                                </select>
                              </div>
                              {/* Sort */}
                              <div>
                                <label className="text-xs font-medium text-gray-700 mb-2 block">{t('sortBy') || 'Sort By'}</label>
                                <select
                                  value={sortBy}
                                  onChange={(e) => setSortBy(e.target.value)}
                                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white cursor-pointer"
                                >
                                  <option>Sort by: Date Added</option>
                                  <option>Sort by: Name</option>
                                  <option>Sort by: Price</option>
                                  <option>Sort by: Orders</option>
                                </select>
                              </div>
                            </div>
                            <div className="px-4 py-3 border-t border-gray-200 flex gap-2 bg-gray-50">
                              <button
                                onClick={() => {
                                  setFilterCategory('All Categories')
                                  setFilterStatus('All Status')
                                  setFilterStock('All Stock')
                                  setSortBy('Sort by: Date Added')
                                  setShowFilterDropdown(false)
                                }}
                                className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 active:scale-[0.98] transition-all duration-200"
                                type="button"
                              >
                                {t('reset') || 'Reset'}
                              </button>
                              <button
                                onClick={() => setShowFilterDropdown(false)}
                                className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-primary-500 rounded-lg hover:bg-primary-600 active:scale-[0.98] transition-all duration-200 shadow-sm hover:shadow-md"
                                type="button"
                              >
                                {t('apply') || 'Apply'}
                              </button>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Products Table - Desktop */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-semibold text-gray-600">{t('product')}</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-600">{t('sku')}</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-600">{t('category')}</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-600">{t('price')}</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-600">{t('orders')}</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-600">{t('stock')}</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-600">{t('status')}</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-600">{t('actions')}</th>
                      </tr>
                    </thead>
                    <tbody className="text-gray-900">
                      {paginatedProducts.map((product: { id: number; name: string; sku: string; category: string; price: number; orders: number; stock: number; status: boolean; slug: string }) => (
                        <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <img 
                                src={`https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=100&h=100&fit=crop`} 
                                alt={product.name} 
                                className="w-10 h-10 rounded object-cover" 
                              />
                              <span className="font-medium">{product.name}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-gray-600">{product.sku}</td>
                          <td className="py-3 px-4 text-gray-600">{product.category}</td>
                          <td className="py-3 px-4 font-semibold">${product.price}</td>
                          <td className="py-3 px-4">{product.orders}</td>
                          <td className="py-3 px-4">{product.stock}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${product.status ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                              {product.status ? t('active') : t('inactive')}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleToggleStatus(product.id)}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${product.status ? 'bg-primary-500' : 'bg-gray-300'}`}
                                aria-label="Toggle product status"
                              >
                                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${product.status ? 'translate-x-6' : 'translate-x-1'}`} />
                              </button>
                              <button
                                onClick={() => handleEdit(product.id)}
                                className="text-gray-600 hover:text-blue-600"
                                aria-label="Edit product"
                              >
                                <Edit size={18} />
                              </button>
                              <button
                                onClick={() => handleDelete(product.id)}
                                className="text-gray-600 hover:text-red-600"
                                aria-label="Delete product"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Products Cards - Mobile */}
                <div className="md:hidden space-y-3">
                  {paginatedProducts.map((product: { id: number; name: string; sku: string; category: string; price: number; orders: number; stock: number; status: boolean; slug: string }) => (
                    <div
                      key={product.id}
                      className="bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer"
                      onClick={() => handleViewProduct(product.id)}
                    >
                      <div className="p-4 space-y-3">
                        {/* Product Info */}
                        <div className="flex items-start gap-3">
                          <img 
                            src={`https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=100&h=100&fit=crop`} 
                            alt={product.name} 
                            className="w-16 h-16 rounded object-cover flex-shrink-0" 
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900">{product.name}</p>
                            <p className="text-xs text-gray-500">{t('sku')}: {product.sku}</p>
                            <p className="text-xs text-gray-600 mt-1">{product.category}</p>
                          </div>
                        </div>

                        {/* Stats Row */}
                        <div className="grid grid-cols-3 gap-2 text-sm">
                          <div>
                            <p className="text-gray-500 text-xs">{t('price')}</p>
                            <p className="font-medium text-gray-900">${product.price}</p>
                          </div>
                          <div>
                            <p className="text-gray-500 text-xs">{t('orders')}</p>
                            <p className="font-medium text-gray-900">{product.orders}</p>
                          </div>
                          <div>
                            <p className="text-gray-500 text-xs">{t('stock')}</p>
                            <p className="font-medium text-gray-900">{product.stock}</p>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-between pt-2 border-t" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center gap-2">
                            <span className={`text-xs px-2 py-1 rounded-full ${product.status ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                              {product.status ? t('active') : t('inactive')}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleToggleStatus(product.id)}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${product.status ? 'bg-primary-500' : 'bg-gray-300'}`}
                              aria-label="Toggle product status"
                            >
                              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${product.status ? 'translate-x-6' : 'translate-x-1'}`} />
                            </button>
                            <button
                              onClick={() => handleEdit(product.id)}
                              className="text-gray-600 hover:text-blue-600"
                              aria-label="Edit product"
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              onClick={() => handleDelete(product.id)}
                              className="text-gray-600 hover:text-red-600"
                              aria-label="Delete product"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                <div className="hidden md:flex items-center justify-between mt-6 pt-4 border-t">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="flex items-center gap-1 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft size={16} />
                      {t('back')}
                    </button>
                    <div className="flex items-center gap-1">
                      {visiblePages.map((page: number | null, idx: number) => (
                        <Fragment key={idx}>
                          {page === null ? (
                            <span className="px-2">...</span>
                          ) : (
                            <button
                              onClick={() => setCurrentPage(page)}
                              className={`px-3 py-1 rounded text-sm ${
                                currentPage === page
                                  ? 'bg-primary-500 text-white'
                                  : 'text-gray-700 hover:bg-gray-100'
                              }`}
                            >
                              {page}
                            </button>
                          )}
                        </Fragment>
                      ))}
                    </div>
                    <button
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="flex items-center gap-1 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {t('next')}
                      <ChevronRight size={16} />
                    </button>
                  </div>
                  <span className="text-sm text-gray-600">
                    {t('pageOf', { current: currentPage, total: totalPages })}
                  </span>
                </div>

                {/* Mobile Pagination */}
                <div className="md:hidden flex items-center justify-between mt-6 bg-white rounded-lg p-4">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="flex items-center gap-1 text-sm text-gray-700 disabled:opacity-50"
                  >
                    <ChevronLeft size={16} />
                    {t('back')}
                  </button>
                  <span className="text-sm text-gray-600">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-1 text-sm text-gray-700 disabled:opacity-50"
                  >
                    {t('next')}
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex items-center justify-center p-4"
            onClick={cancelDelete}
          >
            {/* Modal */}
            <div 
              className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 transform transition-all"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="text-red-600" size={20} />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                    {t('confirmDelete')}
                  </h3>
                </div>
                <button
                  onClick={cancelDelete}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600"
                  aria-label="Close"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-4 sm:p-6">
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  {t('deleteProductConfirm')}
                </p>
              </div>

              {/* Modal Footer */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3 p-4 sm:p-6 border-t border-gray-200 bg-gray-50 sm:bg-white">
                <button
                  onClick={cancelDelete}
                  disabled={isDeleting}
                  className="w-full sm:w-auto px-4 sm:px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t('cancel')}
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={isDeleting}
                  className="w-full sm:w-auto px-4 sm:px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isDeleting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>{t('deleting')}</span>
                    </>
                  ) : (
                    <>
                      <Trash2 size={18} />
                      <span>{t('delete')}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
