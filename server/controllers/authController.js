// authController.js with enhanced error handling
const path = require('path');

console.log('🔧 Loading authController.js from:', __dirname);
console.log('🔧 Environment check - JWT_SECRET exists:', !!process.env.JWT_SECRET);
console.log('🔧 NODE_ENV:', process.env.NODE_ENV);

// Try to load dependencies with error handling
let User, bcrypt, jwt;
let dependenciesLoaded = false;

try {
  console.log('🔧 Attempting to load dependencies...');
  User = require('../models/user');
  console.log('✅ User model loaded');
  bcrypt = require('bcryptjs');
  console.log('✅ bcrypt loaded');
  jwt = require('jsonwebtoken');
  console.log('✅ jwt loaded');
  dependenciesLoaded = true;
  console.log('✅ All dependencies loaded successfully');
} catch (error) {
  console.error('❌ ERROR loading dependencies:', error.message);
  console.error('❌ Error stack:', error.stack);
  
  // Provide more specific error messages
  if (error.code === 'MODULE_NOT_FOUND') {
    const missingModule = error.message.match(/'([^']+)'/)?.[1];
    console.error(`❌ Missing module: ${missingModule}`);
    console.error('❌ Check if package is installed: npm install', missingModule);
  }
}

// Check for required environment variables
if (!process.env.JWT_SECRET) {
  console.warn('⚠️  WARNING: JWT_SECRET environment variable is not set!');
  console.warn('⚠️  This will cause authentication to fail');
  console.warn('⚠️  Set it in Railway dashboard: Settings → Environment Variables');
}

exports.register = async (req, res) => {
  console.log('📝 Register endpoint called');
  console.log('📝 Request body:', req.body);
  console.log('📝 Request headers:', req.headers);
  
  // Check if dependencies loaded
  if (!dependenciesLoaded) {
    console.error('❌ Register: Dependencies not loaded');
    return res.status(500).json({ 
      success: false,
      msg: 'Server configuration error',
      error: 'Required dependencies not loaded',
      timestamp: new Date().toISOString()
    });
  }
  
  // Check for JWT_SECRET
  if (!process.env.JWT_SECRET) {
    console.error('❌ Register: JWT_SECRET missing');
    return res.status(500).json({ 
      success: false,
      msg: 'Server configuration error',
      error: 'JWT_SECRET environment variable not configured',
      timestamp: new Date().toISOString()
    });
  }
  
  const { username, password } = req.body;
  
  // Input validation
  if (!username || !password) {
    console.warn('⚠️  Register: Missing username or password');
    return res.status(400).json({ 
      success: false,
      msg: 'Please provide both username and password',
      timestamp: new Date().toISOString()
    });
  }
  
  console.log(`🔧 Register attempt for username: ${username}`);
  
  try {
    // Check if user exists
    console.log('🔧 Checking if user exists in database...');
    let user = await User.findOne({ username });
    
    if (user) {
      console.warn(`⚠️  User ${username} already exists`);
      return res.status(400).json({ 
        success: false,
        msg: 'User already exists',
        timestamp: new Date().toISOString()
      });
    }
    
    console.log('🔧 User does not exist, creating new user...');
    
    // Hash password
    console.log('🔧 Generating salt...');
    const salt = await bcrypt.genSalt(10);
    console.log('🔧 Hashing password...');
    const passwordHash = await bcrypt.hash(password, salt);
    
    // Create user
    console.log('🔧 Creating new user object...');
    user = new User({
      username,
      passwordHash,
    });
    
    // Save to database
    console.log('🔧 Saving user to database...');
    await user.save();
    console.log(`✅ User ${username} saved with ID: ${user.id}`);
    
    // Create JWT token
    console.log('🔧 Creating JWT token...');
    const payload = {
      user: {
        id: user.id,
        username: user.username
      },
    };
    
    // Using promise-based jwt.sign instead of callback
    console.log('🔧 Signing JWT...');
    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    console.log(`✅ Registration successful for ${username}`);
    
    res.json({ 
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (err) {
    console.error('❌ Register error:', err.message);
    console.error('❌ Error stack:', err.stack);
    
    // More specific error messages
    if (err.name === 'MongoError' || err.name === 'MongoServerError') {
      console.error('❌ Database error occurred');
      return res.status(500).json({ 
        success: false,
        msg: 'Database error',
        error: err.message,
        timestamp: new Date().toISOString()
      });
    }
    
    if (err.name === 'ValidationError') {
      console.error('❌ Validation error');
      return res.status(400).json({ 
        success: false,
        msg: 'Validation error',
        error: err.message,
        timestamp: new Date().toISOString()
      });
    }
    
    res.status(500).json({ 
      success: false,
      msg: 'Server error during registration',
      error: err.message,
      timestamp: new Date().toISOString()
    });
  }
};

exports.login = async (req, res) => {
  console.log('🔑 Login endpoint called');
  console.log('🔑 Request body:', req.body);
  
  // Check if dependencies loaded
  if (!dependenciesLoaded) {
    console.error('❌ Login: Dependencies not loaded');
    return res.status(500).json({ 
      success: false,
      msg: 'Server configuration error',
      error: 'Required dependencies not loaded',
      timestamp: new Date().toISOString()
    });
  }
  
  // Check for JWT_SECRET
  if (!process.env.JWT_SECRET) {
    console.error('❌ Login: JWT_SECRET missing');
    return res.status(500).json({ 
      success: false,
      msg: 'Server configuration error',
      error: 'JWT_SECRET environment variable not configured',
      timestamp: new Date().toISOString()
    });
  }
  
  const { username, password } = req.body;
  
  // Input validation
  if (!username || !password) {
    console.warn('⚠️  Login: Missing username or password');
    return res.status(400).json({ 
      success: false,
      msg: 'Please provide both username and password',
      timestamp: new Date().toISOString()
    });
  }
  
  console.log(`🔑 Login attempt for username: ${username}`);
  
  try {
    // Find user
    console.log('🔑 Looking up user in database...');
    let user = await User.findOne({ username });
    
    if (!user) {
      console.warn(`⚠️  User ${username} not found`);
      return res.status(400).json({ 
        success: false,
        msg: 'Invalid credentials',
        timestamp: new Date().toISOString()
      });
    }
    
    console.log(`🔑 User found: ${user.username} (ID: ${user.id})`);
    
    // Check password
    console.log('🔑 Comparing passwords...');
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    
    if (!isMatch) {
      console.warn(`⚠️  Password mismatch for user ${username}`);
      return res.status(400).json({ 
        success: false,
        msg: 'Invalid credentials',
        timestamp: new Date().toISOString()
      });
    }
    
    console.log('✅ Password matches');
    
    // Create JWT token
    console.log('🔑 Creating JWT payload...');
    const payload = {
      user: {
        id: user.id,
        username: user.username
      },
    };
    
    console.log('🔑 Signing JWT token...');
    // Using promise-based jwt.sign
    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    console.log(`✅ Login successful for ${username}`);
    
    res.json({ 
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (err) {
    console.error('❌ Login error:', err.message);
    console.error('❌ Error stack:', err.stack);
    
    // More specific error messages
    if (err.name === 'MongoError' || err.name === 'MongoServerError') {
      console.error('❌ Database error occurred');
      return res.status(500).json({ 
        success: false,
        msg: 'Database error',
        error: err.message,
        timestamp: new Date().toISOString()
      });
    }
    
    res.status(500).json({ 
      success: false,
      msg: 'Server error during login',
      error: err.message,
      timestamp: new Date().toISOString()
    });
  }
};

// Export a test function to check if controller loads
exports.test = () => {
  return {
    dependenciesLoaded,
    hasJwtSecret: !!process.env.JWT_SECRET,
    loadedAt: new Date().toISOString()
  };
};

console.log('✅ authController.js loaded successfully');
console.log('✅ Dependencies loaded:', dependenciesLoaded);
console.log('✅ JWT_SECRET configured:', !!process.env.JWT_SECRET);
