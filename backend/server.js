const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS Configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(morgan('dev'));
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection (Optional - App works without it)
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/street10-dashboard';

// Only try to connect if MongoDB URI is provided and not default
if (process.env.MONGODB_URI && process.env.MONGODB_URI !== 'mongodb://localhost:27017/street10-dashboard') {
  mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('✅ MongoDB connected successfully');
    console.log(`📊 Database: ${mongoURI}`);
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    console.log('⚠️  Running in mock mode without database');
  });
} else {
  console.log('ℹ️  Running in mock mode (no database connection)');
  console.log('   All data is returned as mock JSON responses');
}

// Routes
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/products', require('./routes/products'));
app.use('/api/customers', require('./routes/customers'));
app.use('/api/sales', require('./routes/sales'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/sub-admin', require('./routes/subadmin'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Street 10 API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Street 10 Vendor Dashboard API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      dashboard: '/api/dashboard',
      orders: '/api/orders',
      products: '/api/products',
      customers: '/api/customers',
      sales: '/api/sales',
      notifications: '/api/notifications',
      subAdmin: '/api/sub-admin'
    }
  });
});

// 404 handler - must be before error handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    message: 'Route not found',
    path: req.originalUrl,
    method: req.method
  });
});

// Error handling middleware - must be last
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.stack);
  
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Something went wrong!';
  
  res.status(statusCode).json({
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Start server
app.listen(PORT, () => {
  console.log('\n🚀 Street 10 Backend Server');
  console.log('═'.repeat(50));
  console.log(`📍 Server running on port ${PORT}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 API URL: http://localhost:${PORT}`);
  console.log(`❤️  Health check: http://localhost:${PORT}/api/health`);
  console.log('═'.repeat(50));
  console.log('');
});

