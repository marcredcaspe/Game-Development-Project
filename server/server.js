const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
require('dotenv').config();

const app = express();

// Connect Database
connectDB();

// Init Middleware
app.use(express.json({ extended: false }));

// CORS Configuration - Works for both localhost and production
const allowedOrigins = [
  'http://localhost:5173',    // Vite dev server
  'http://localhost:3000',    // Create React App dev server
  'http://localhost:8080',    // Alternative port
  process.env.FRONTEND_URL    // Production Vercel URL
].filter(Boolean); // Remove undefined values

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      console.log('Blocked by CORS:', origin);
      return callback(new Error('Not allowed by CORS'), false);
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Logging middleware to see requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} from ${req.headers.origin || 'no origin'}`);
  next();
});

// Basic health check route
app.get('/', (req, res) => {
  res.json({
    message: 'Backend API is running',
    environment: process.env.NODE_ENV || 'development',
    frontend_url: process.env.FRONTEND_URL || 'localhost',
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
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({ 
      message: 'CORS error',
      allowedOrigins: allowedOrigins 
    });
  }
  res.status(500).json({ message: 'Server error', error: err.message });
});

const PORT = process.env.PORT || 8080;

// Listen on all network interfaces (required for Railway)
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server started on port ${PORT}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
  console.log(`✅ CORS Allowed Origins:`, allowedOrigins);
});
