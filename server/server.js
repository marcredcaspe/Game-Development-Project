const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
require('dotenv').config();

const app = express();

// Connect Database
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS Configuration
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://ite18-final-project-frontend.vercel.app',
    'https://ite18-final-project-frontend-production.up.railway.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Handle preflight requests
app.options('*', cors());

// Health check endpoint - CRITICAL FOR RAILWAY
app.get('/health', (req, res) => {
  console.log('Health check called');
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Game Server API',
    version: '1.0.0',
    status: 'running'
  });
});

// Import routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/game', require('./routes/gameRoutes'));

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;

// Start server with proper Railway configuration
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🌐 Access at: http://0.0.0.0:${PORT}`);
  console.log(`❤️  Health check: http://0.0.0.0:${PORT}/health`);
});

// Railway-specific server settings
server.keepAliveTimeout = 120000; // 2 minutes
server.headersTimeout = 120000; // 2 minutes

// Graceful shutdown for Railway
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
