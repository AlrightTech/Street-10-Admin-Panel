
import { 
  ClipboardList, 
  CheckCircle2, 
  Clock,
  Users,
  FileCheck,
  AlertCircle,
  TrendingUp,
  Package,
  MessageSquare,
  Star
} from 'lucide-react'
import { useState, useEffect, useCallback } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'

interface SubAdminDashboardData {
  metrics?: {
    assignedTasks: number
    completedOrders: number
    pendingApprovals: number
    teamPerformance: number
  }
  recentTasks?: any[]
  pendingApprovals?: any[]
  teamActivity?: any[]
  recentOrders?: any[]
  notifications?: any[]
}

export default function SubAdminDashboardContent() {
  const { t, language } = useLanguage()
  const [dashboardData, setDashboardData] = useState<SubAdminDashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchData = useCallback(async () => {
    // Frontend-only: Always use demo data
    const isArabic = language === 'ar'
    const demoData: SubAdminDashboardData = {
        metrics: {
          assignedTasks: 18,
          completedOrders: 42,
          pendingApprovals: 7,
          teamPerformance: 87
        },
        recentTasks: [
          { id: 'TASK-001', title: 'Review Product Listings', status: 'In Progress', priority: 'High' },
          { id: 'TASK-002', title: 'Approve New Vendor', status: 'Pending', priority: 'Medium' },
          { id: 'TASK-003', title: 'Update Order Status', status: 'Completed', priority: 'Low' },
        ],
        pendingApprovals: [
          { id: 'APP-001', type: 'Product', title: 'New Product Submission', submittedBy: 'John Doe', date: '2 hours ago' },
          { id: 'APP-002', type: 'Vendor', title: 'Vendor Account Request', submittedBy: 'Jane Smith', date: '5 hours ago' },
          { id: 'APP-003', type: 'Order', title: 'Refund Request', submittedBy: 'Mike Johnson', date: '1 day ago' },
        ],
        teamActivity: [
          { name: 'Sarah Wilson', action: 'Completed order review', time: '30 mins ago' },
          { name: 'Tom Brown', action: 'Updated product status', time: '1 hour ago' },
          { name: 'Emma Davis', action: 'Approved vendor request', time: '2 hours ago' },
        ],
        recentOrders: [
          { id: '#ORD-89', customer: 'Customer A', items: 3, status: 'Pending Review' },
          { id: '#ORD-88', customer: 'Customer B', items: 1, status: 'Approved' },
          { id: '#ORD-87', customer: 'Customer C', items: 5, status: 'Pending Review' },
        ],
        notifications: [
          { icon: 'approval', message: 'New Approval Request', detail: 'Product #1234 needs review' },
          { icon: 'task', message: 'Task Assigned', detail: 'Review vendor documentation' },
          { icon: 'order', message: 'Order Update', detail: 'Order #ORD-89 requires attention' },
        ],
      }
      setDashboardData(demoData)
      setLoading(false)
  }, [language])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">{t('loading') || 'Loading dashboard data...'}</div>
      </div>
    )
  }

  if (!dashboardData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500">{t('failedToLoad')}</div>
      </div>
    )
  }

  const { metrics, recentTasks, pendingApprovals, teamActivity, recentOrders, notifications } = dashboardData || {}

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gray-100 rounded-lg p-6">
        <p className="text-2xl font-bold text-gray-700 mb-1">{t('welcomeBack')}</p>
        <p className="text-lg text-gray-600">Sub Admin Dashboard</p>
      </div>

      {/* Top Row - Metric Cards for Sub Admin */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Assigned Tasks */}
        <div className="rounded-lg p-4 text-white relative overflow-hidden" style={{
          background: 'linear-gradient(135deg, #60A5FA 0%, #3B82F6 100%)'
        }}>
          <div className="relative z-10">
            <p className="text-sm font-medium mb-2">{t('assignedTasks') || 'Assigned Tasks'}</p>
            <p className="text-3xl font-bold">{metrics?.assignedTasks || 0}</p>
          </div>
          <div className="absolute bottom-4 right-4 p-3 rounded-lg" style={{
            backgroundColor: 'rgba(37, 99, 235, 0.8)'
          }}>
            <ClipboardList size={28} />
          </div>
        </div>

        {/* Completed Orders */}
        <div className="rounded-lg p-4 text-white relative overflow-hidden" style={{
          background: 'linear-gradient(135deg, #34D399 0%, #10B981 100%)'
        }}>
          <div className="relative z-10">
            <p className="text-sm font-medium mb-2">{t('completedOrders') || 'Completed Orders'}</p>
            <p className="text-3xl font-bold">{metrics?.completedOrders || 0}</p>
          </div>
          <div className="absolute bottom-4 right-4 p-3 rounded-lg" style={{
            backgroundColor: 'rgba(5, 150, 105, 0.8)'
          }}>
            <CheckCircle2 size={28} />
          </div>
        </div>

        {/* Pending Approvals */}
        <div className="rounded-lg p-4 text-white relative overflow-hidden" style={{
          background: 'linear-gradient(135deg, #FBBF24 0%, #F59E0B 100%)'
        }}>
          <div className="relative z-10">
            <p className="text-sm font-medium mb-2">{t('pendingApprovals') || 'Pending Approvals'}</p>
            <p className="text-3xl font-bold">{metrics?.pendingApprovals || 0}</p>
          </div>
          <div className="absolute bottom-4 right-4 p-3 rounded-lg" style={{
            backgroundColor: 'rgba(217, 119, 6, 0.8)'
          }}>
            <FileCheck size={28} />
          </div>
        </div>

        {/* Team Performance */}
        <div className="rounded-lg p-4 text-white relative overflow-hidden" style={{
          background: 'linear-gradient(135deg, #A78BFA 0%, #8B5CF6 100%)'
        }}>
          <div className="relative z-10">
            <p className="text-sm font-medium mb-2">{t('teamPerformance') || 'Team Performance'}</p>
            <p className="text-3xl font-bold">{metrics?.teamPerformance || 0}%</p>
          </div>
          <div className="absolute bottom-4 right-4 p-3 rounded-lg" style={{
            backgroundColor: 'rgba(124, 58, 237, 0.8)'
          }}>
            <TrendingUp size={28} />
          </div>
        </div>
      </div>

      {/* Middle Row - Recent Tasks and Pending Approvals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Tasks */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">{t('recentTasks') || 'Recent Tasks'}</h2>
          </div>
          <div className="space-y-3">
            {(recentTasks || []).map((task, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">{task.title}</p>
                    <p className="text-xs text-gray-500 mt-1">ID: {task.id}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    task.priority === 'High' ? 'bg-red-100 text-red-600' :
                    task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-600' :
                    'bg-green-100 text-green-600'
                  }`}>
                    {task.priority}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    task.status === 'Completed' ? 'bg-green-100 text-green-700' :
                    task.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {task.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Approvals */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">{t('pendingApprovals') || 'Pending Approvals'}</h2>
            <span className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-xs font-semibold">
              {pendingApprovals?.length || 0}
            </span>
          </div>
          <div className="space-y-3">
            {(pendingApprovals || []).map((approval, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        approval.type === 'Product' ? 'bg-blue-100 text-blue-700' :
                        approval.type === 'Vendor' ? 'bg-purple-100 text-purple-700' :
                        'bg-orange-100 text-orange-700'
                      }`}>
                        {approval.type}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-gray-900">{approval.title}</p>
                    <p className="text-xs text-gray-500 mt-1">Submitted by: {approval.submittedBy}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-xs text-gray-500">{approval.date}</span>
                  <button className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors">
                    {t('review') || 'Review'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Section - Team Activity, Recent Orders, and Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Team Activity */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('teamActivity') || 'Team Activity'}</h2>
          <div className="space-y-4">
            {(teamActivity || []).map((activity, index) => (
              <div key={index} className="flex items-start space-x-3 pb-3 border-b border-gray-100 last:border-0">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Users size={20} className="text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{activity.name}</p>
                  <p className="text-xs text-gray-600 mt-0.5">{activity.action}</p>
                  <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Orders (Limited View) */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('recentOrders') || 'Recent Orders'}</h2>
          <div className="space-y-4">
            {(recentOrders || []).map((order, index) => (
              <div key={index} className="flex items-center justify-between pb-3 border-b border-gray-100 last:border-0">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{order.id}</p>
                  <p className="text-xs text-gray-500">{order.customer} • {order.items} items</p>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  order.status === 'Approved' ? 'bg-green-100 text-green-700' :
                  'bg-yellow-100 text-yellow-700'
                }`}>
                  {order.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('notifications') || 'Notifications'}</h2>
          <div className="space-y-3">
            {(notifications || []).map((notif, index) => (
              <div key={index} className={`flex items-start space-x-3 p-3 rounded-lg ${
                notif.icon === 'approval' ? 'bg-yellow-50 border border-yellow-200' :
                notif.icon === 'task' ? 'bg-blue-50 border border-blue-200' :
                'bg-green-50 border border-green-200'
              }`}>
                <div className={`flex-shrink-0 p-2 rounded-lg ${
                  notif.icon === 'approval' ? 'bg-yellow-200' :
                  notif.icon === 'task' ? 'bg-blue-200' :
                  'bg-green-200'
                }`}>
                  {notif.icon === 'approval' && <FileCheck size={18} className="text-yellow-600" />}
                  {notif.icon === 'task' && <ClipboardList size={18} className="text-blue-600" />}
                  {notif.icon === 'order' && <Package size={18} className="text-green-600" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-gray-900">{notif.message}</p>
                  <p className="text-xs text-gray-600 mt-0.5">{notif.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

