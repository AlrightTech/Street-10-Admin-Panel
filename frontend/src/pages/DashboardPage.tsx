import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'
import DashboardContent from '@/components/dashboard/DashboardContent'
import { useRole } from '@/contexts/RoleContext'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Menu } from 'lucide-react'

export default function DashboardPage() {
  const { role, isSubAdmin, setRole } = useRole()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  // Auto-set vendor role if no role is selected
  useEffect(() => {
    if (!role) {
      setRole('vendor')
    }
  }, [role, setRole])

  // Redirect Sub Admin directly to users page
  useEffect(() => {
    if (isSubAdmin) {
      navigate('/sub-admin/users')
    }
  }, [isSubAdmin, navigate])

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
            <Sidebar onClose={() => setSidebarCollapsed(true)} currentPage="dashboard" />
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
            {!isSubAdmin && <DashboardContent />}
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
          <Sidebar onClose={() => setSidebarOpen(false)} currentPage="dashboard" />
        </div>

        {/* Mobile Main Content */}
        <div className="flex-1 flex flex-col min-h-screen bg-gray-50 pt-20 lg:pt-0">
          <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} isSidebarOpen={sidebarOpen} />
          <main className="flex-1 overflow-x-hidden overflow-y-auto p-4">
            {!isSubAdmin && <DashboardContent />}
          </main>
        </div>
      </div>
    </div>
  )
}

