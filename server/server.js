const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
require('dotenv').config();

const app = express();

// Connect Database
connectDB();

// Init Middleware - IMPORTANT: Use body-parser like in the working example
app.use(express.json({ extended: false }));
app.use(express.urlencoded({ extended: true }));

// Simplified CORS Configuration - Match the working example exactly
app.use(cors({
  origin: [
    'http://localhost:5173',    // Vite dev server
    'http://localhost:5172',    // Alternative Vite port
    'http://localhost:3000',    // Create React App dev server
    'http://127.0.0.1:5173',    // Localhost with IP
    'http://127.0.0.1:5172',    // Localhost with IP
    'https://ite18-final-project-production-bb3c.wp.railway.app', // Your Railway URL
    'https://boat-runner.vercel.app'  // Vercel frontend
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// IMPORTANT: Handle preflight requests explicitly
app.options('*', cors());

// Logging middleware to see requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} from ${req.headers.origin || 'no origin'}`);
  console.log('Headers:', req.headers);
  next();
});

// Basic health check route - Railway needs this
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Server is healthy',
    timestamp: new Date().toISOString()
  });
});

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Backend API is running',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

// Define Routes
app.use('/api', require('./routes/authRoutes'));
app.use('/api', require('./routes/gameRoutes'));

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err.message);
  console.error('Error stack:', err.stack);
  
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({ 
      message: 'CORS error',
      allowedOrigins: [
        'http://localhost:5173',
        'http://localhost:5172',
        'http://localhost:3000',
        'http://127.0.0.1:5173',
        'http://127.0.0.1:5172',
        'https://ite18-final-project-production-bb3c.wp.railway.app',
        'https://boat-runner.vercel.app'
      ] 
    });
  }
  
  res.status(500).json({ 
    message: 'Server error', 
    error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message 
  });
});

const PORT = process.env.PORT || 5000;

// Railway-specific fixes:
// 1. Listen on all interfaces
// 2. Add keep-alive timeout settings
// 3. Handle SIGTERM for graceful shutdown

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server started on port ${PORT}`);
  console.log(`📡 Listening on 0.0.0.0:${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health check: http://0.0.0.0:${PORT}/health`);
});

// Railway sends SIGTERM to stop containers
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Keep-alive timeout for Railway's proxy
server.keepAliveTimeout = 120 * 1000; // 120 seconds
server.headersTimeout = 120 * 1000; // 120 seconds
