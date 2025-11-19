import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'
import { useState } from 'react'
import { Menu } from 'lucide-react'

export default function SubAdminHostsProvidersPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

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
            <Sidebar onClose={() => setSidebarCollapsed(true)} currentPage="subAdminHosts" />
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
            <div className="bg-white rounded-lg shadow-md p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Hosts & Providers</h1>
              <p className="text-gray-600">Sub Admin - Hosts & Providers page content will go here</p>
            </div>
          </main>
        </div>
      </div>

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
          <Sidebar onClose={() => setSidebarOpen(false)} currentPage="subAdminHosts" />
        </div>

        <div className="flex-1 flex flex-col min-h-screen bg-gray-50 pt-20 lg:pt-0">
          <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} isSidebarOpen={sidebarOpen} />
          <main className="flex-1 overflow-x-hidden overflow-y-auto p-4">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Hosts & Providers</h1>
              <p className="text-gray-600">Sub Admin - Hosts & Providers page content will go here</p>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

