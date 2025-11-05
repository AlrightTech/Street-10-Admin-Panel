const express = require('express');
const router = express.Router();

// Vendor/Super Admin Dashboard Data
router.get('/data', async (req, res) => {
  try {
    res.json({
      metrics: {
        uncompletedOrders: 24,
        totalOrders: 156,
        totalRevenue: 12450,
        pendingPayouts: 2340
      },
      recentOrders: [
        { id: 'aORD-003', customer: 'Sarah Johnson', amount: 89.00, status: 'Completed' },
        { id: 'aORD-002', customer: 'Mike Chen', amount: 24.00, status: 'Processing' },
        { id: 'aORD-001', customer: 'Emma Davis', amount: 67.20, status: 'Shipped' }
      ],
      salesPerformance: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        data: [1200, 1900, 3100, 4800, 3500, 4200]
      },
      ordersStatus: {
        completed: 45,
        processing: 25,
        shipped: 20,
        cancelled: 10
      },
      bestSellingProducts: [
        { name: 'Wireless Headphones', sales: 48, revenue: 2400 },
        { name: 'Phone Case', sales: 36, revenue: 1080 },
        { name: 'Smart Watch', sales: 24, revenue: 4800 }
      ],
      productInsights: {
        lowStock: 2,
        outOfStock: 0
      },
      customerInsights: {
        newCustomers: 2,
        returningRate: 68,
        topCustomer: {
          name: 'Sarah Johnson',
          orders: 20
        }
      },
      notifications: [
        { type: 'payment', message: 'Payment Received', detail: 'Order #ORD-2023-00782', icon: 'alert' },
        { type: 'system', message: 'System Update', detail: 'New features available', icon: 'info' },
        { type: 'shipped', message: 'Order Shipped', detail: 'Order #ORD-2023-00782 has been dispatched', icon: 'check' }
      ],
      topSellingProducts: [
        { name: 'Guava', size: '55g', sales: 92, image: 'https://images.unsplash.com/photo-1601076448547-0ec007e0e41e?w=100&h=100&fit=crop' },
        { name: 'Fresh Tender', size: '40ml', sales: 123, image: 'https://images.unsplash.com/photo-1607694432087-208ab6d2c1c3?w=100&h=100&fit=crop' },
        { name: 'Guava', size: '55g', sales: 92, image: 'https://images.unsplash.com/photo-1601076448547-0ec007e0e41e?w=100&h=100&fit=crop' },
        { name: 'Buffalo Milk', size: '1kg', sales: 75, image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=100&h=100&fit=crop' },
        { name: 'Guava', size: '55g', sales: 92, image: 'https://images.unsplash.com/photo-1601076448547-0ec007e0e41e?w=100&h=100&fit=crop' }
      ],
      newCustomers: [
        { name: 'Rahul Choudhary', phone: '(+91) 6246 198 874', image: 'https://i.pravatar.cc/150?img=12' },
        { name: 'Mamta Lodhi', phone: '(+91) 6246 198 874', image: 'https://i.pravatar.cc/150?img=47' },
        { name: 'Sunil Bhadouriya', phone: '(+91) 6246 198 874', image: 'https://i.pravatar.cc/150?img=33' },
        { name: 'Rahul Choudhary', phone: '(+91) 6246 198 874', image: 'https://i.pravatar.cc/150?img=12' },
        { name: 'Sunil Bhadouriya', phone: '(+91) 6246 198 874', image: 'https://i.pravatar.cc/150?img=68' }
      ],
      recentReviews: [
        {
          name: 'Ahmed Ali',
          phone: '(+91) 6246 198 874',
          image: 'https://i.pravatar.cc/150?img=69',
          rating: 4,
          review: 'Loream Ipsum Occaecati est et illo quibusdam accusamus qui. Incidunt aut et molestiae ut facere aut. Est quidem iusto praesentium.'
        },
        {
          name: 'Priya Sharma',
          phone: '(+91) 9834 567 890',
          image: 'https://i.pravatar.cc/150?img=68',
          rating: 5,
          review: 'Excellent quality and fast delivery! The products are fresh and exactly as described. Highly recommended for all.'
        },
        {
          name: 'Rajesh Kumar',
          phone: '(+91) 8765 432 109',
          image: 'https://i.pravatar.cc/150?img=45',
          rating: 4,
          review: 'Great experience shopping here. Good customer service and quality products. Will definitely order again.'
        }
      ]
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Sub Admin Dashboard Data
router.get('/sub-admin/data', async (req, res) => {
  try {
    res.json({
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
      ]
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

