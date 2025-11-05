const express = require('express');
const router = express.Router();

// Sub Admin Dashboard Data
router.get('/dashboard/data', async (req, res) => {
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

// Sub Admin Users Management
router.get('/users', async (req, res) => {
  try {
    // Mock users data
    const users = [
      { 
        id: 1, 
        name: 'Touseef Ahmed', 
        username: 'Touseeef', 
        email: 'alice.johnson@example.com', 
        phone: '+1 234 567 8900', 
        status: 'Verified', 
        orders: 12, 
        biddingWins: 22, 
        interests: [{ name: 'Cars', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=150&fit=crop' }],
        profileImage: 'https://i.pravatar.cc/150?img=33'
      },
      { 
        id: 2, 
        name: 'John Doe', 
        username: 'johndoe', 
        email: 'john.doe@example.com', 
        phone: '+1 234 567 8901', 
        status: 'Verified', 
        orders: 8, 
        biddingWins: 15, 
        interests: [{ name: 'Electronics', image: 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=200&h=150&fit=crop' }],
        profileImage: 'https://i.pravatar.cc/150?img=12'
      },
      { 
        id: 3, 
        name: 'Jane Smith', 
        username: 'janesmith', 
        email: 'jane.smith@example.com', 
        phone: '+1 234 567 8902', 
        status: 'Pending', 
        orders: 5, 
        biddingWins: 8, 
        interests: [{ name: 'Fashion', image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200&h=150&fit=crop' }],
        profileImage: 'https://i.pravatar.cc/150?img=47'
      },
      { 
        id: 4, 
        name: 'Mike Johnson', 
        username: 'mikejohnson', 
        email: 'mike.j@example.com', 
        phone: '+1 234 567 8903', 
        status: 'Verified', 
        orders: 20, 
        biddingWins: 35, 
        interests: [{ name: 'Sports', image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=200&h=150&fit=crop' }],
        profileImage: 'https://i.pravatar.cc/150?img=45'
      },
    ];

    // Apply search filter if provided
    const searchQuery = req.query.search || '';
    let filteredUsers = users;
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filteredUsers = users.filter(user => 
        user.name.toLowerCase().includes(query) || 
        user.email.toLowerCase().includes(query) ||
        user.username.toLowerCase().includes(query)
      );
    }

    res.json({
      users: filteredUsers,
      total: filteredUsers.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get Single User by ID
router.get('/users/:id', async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    
    // Mock user data
    const user = {
      id: userId,
      name: 'Touseef Ahmed',
      username: 'Touseeef',
      email: 'alice.johnson@example.com',
      phone: '+1 234 567 8900',
      status: 'Verified',
      orders: 12,
      biddingWins: 22,
      interests: [
        { name: 'Cars', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=150&fit=crop' }
      ],
      profileImage: 'https://i.pravatar.cc/150?img=33'
    };

    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create New User
router.post('/users', async (req, res) => {
  try {
    const { fullName, email, password, status, role, permissions } = req.body;

    // Validate required fields
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: 'Full name, email, and password are required' });
    }

    // Mock response - In real app, save to database
    const newUser = {
      id: Date.now(),
      name: fullName,
      email,
      status: status || 'active',
      role: role || 'marketing-admin',
      permissions: permissions || {},
      createdAt: new Date().toISOString()
    };

    res.status(201).json({
      message: 'User created successfully',
      user: newUser
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Assign Role to Users
router.post('/users/assign-role', async (req, res) => {
  try {
    const { userIds, role } = req.body;

    // Validate required fields
    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({ message: 'User IDs array is required' });
    }

    if (!role) {
      return res.status(400).json({ message: 'Role is required' });
    }

    // Mock response - In real app, update users in database
    res.json({
      message: 'Role assigned successfully',
      assignedCount: userIds.length,
      role
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update User
router.put('/users/:id', async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const updates = req.body;

    // Mock response - In real app, update user in database
    res.json({
      message: 'User updated successfully',
      userId,
      updates
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete User
router.delete('/users/:id', async (req, res) => {
  try {
    const userId = parseInt(req.params.id);

    // Mock response - In real app, delete user from database
    res.json({
      message: 'User deleted successfully',
      userId
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

