const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
require('dotenv').config();

const app = express();

// Connect Database
connectDB();

// Init Middleware
app.use(express.json({ extended: false }));

// CORS Configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL, // e.g., 'https://your-frontend.vercel.app'
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Define Routes
app.use('/api', require('./routes/authRoutes'));
app.use('/api', require('./routes/gameRoutes'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
