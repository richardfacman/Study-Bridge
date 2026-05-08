const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const dotenv = require('dotenv');
const passport = require('passport');
const http = require('http');
const socketIO = require('socket.io');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
let MongoMemoryServer = null;
try {
  MongoMemoryServer = require('mongodb-memory-server').MongoMemoryServer;
} catch (e) {
  console.warn('⚠️  mongodb-memory-server not available for fallback');
}

// Load environment variables
dotenv.config();

console.log('MONGODB_URI:', process.env.MONGODB_URI);

// Import routes
const authRoutes = require('./routes/authRoutes');
const universityRoutes = require('./routes/universityRoutes');
const scholarshipRoutes = require('./routes/scholarshipRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const visaRoutes = require('./routes/visaRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

// Import middleware
const errorHandler = require('./middleware/errorHandler');
const rateLimiter = require('./middleware/rateLimiter');

// Import configs
const passportConfig = require('./config/passport');
const { initializeSocket } = require('./config/socket');
const cronJobs = require('./config/cronJobs');

// Initialize express app
const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: true,
    credentials: true
  }
});

// Initialize Socket.io
initializeSocket(io);

// Middleware
app.use(helmet());
app.use(compression());
app.use(morgan('dev'));
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(mongoSanitize());
app.use(xss());

// Passport middleware
app.use(passport.initialize());
passportConfig(passport);

// Static files
app.use('/uploads', express.static('uploads'));

// Apply rate limiting
app.use('/api', rateLimiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/universities', universityRoutes);
app.use('/api/scholarships', scholarshipRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/visa', visaRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/upload', uploadRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use(errorHandler);

// Helper to start the HTTP server and cron jobs
const PORT = process.env.PORT || 5000;

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use. Stop the process using it or change PORT in .env.`);
    process.exit(1);
  }
  console.error('❌ Server error:', err);
});

const startServer = () => {
  // Start cron jobs
  try { cronJobs.start(); } catch (e) { console.warn('Cron jobs failed to start:', e); }

  server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📱 Client URL: ${process.env.CLIENT_URL}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
  });
};

// MongoDB connection with multiple fallbacks
const connectMongo = async () => {
  const srvUri = process.env.MONGODB_URI; // Standard SRV URI
  // Direct connection URI bypassing SRV (works when DNS fails on SRV records)
  const directUri = 'mongodb://mdfaisala84_db_user:zDVll9xegq80aHHQ@cluster0-shard-00-00.erg33pk.mongodb.net:27017,cluster0-shard-00-01.erg33pk.mongodb.net:27017,cluster0-shard-00-02.erg33pk.mongodb.net:27017/studybridge?authSource=admin&replicaSet=atlas-11qpzc4&ssl=true&retryWrites=true&w=majority';
  const fallbackUri = 'mongodb://localhost:27017/studybridge';
  
  // Optimized connection options for MongoDB Atlas
  const atlasOptions = {
    serverSelectionTimeoutMS: 30000,
    socketTimeoutMS: 45000,
    connectTimeoutMS: 30000,
    maxPoolSize: 10,
    retryWrites: true,
    retryReads: true,
    w: 'majority',
    authSource: 'admin'
  };
  
  const localOptions = {
    serverSelectionTimeoutMS: 8000,
    socketTimeoutMS: 20000,
    connectTimeoutMS: 8000
  };

  console.log('🔄 Attempting to connect to MongoDB Atlas...');
  console.log('📍 Connection URI:', srvUri ? srvUri.substring(0, 50) + '...' : 'No URI provided');

  if (!srvUri) {
    console.log('ℹ️ No MONGODB_URI provided — attempting local MongoDB...');
  }

  // Try 1: Standard SRV connection
  try {
    console.log('⏳ [1/4] Trying Atlas with SRV (timeout: 15s)...');
    await Promise.race([
      mongoose.connect(srvUri || fallbackUri, atlasOptions),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('SRV connection timeout')), 15000)
      )
    ]);
    console.log('✅ Connected to MongoDB Atlas (SRV)');
    console.log('📊 Database:', mongoose.connection.name);
    console.log('📊 Host:', mongoose.connection.host);
    startServer();
    return;
  } catch (err) {
    console.error('❌ [1/4] Atlas SRV failed:', err.message);
    if (err.message.includes('querySrv') || err.message.includes('ECONNREFUSED')) {
      console.log('   ℹ️  DNS issue with SRV, trying direct connection to cluster nodes...');
    }
  }

  // Try 2: Direct connection (bypasses SRV DNS lookups)
  try {
    console.log('⏳ [2/4] Trying Atlas direct connection (timeout: 15s)...');
    await Promise.race([
      mongoose.connect(directUri, atlasOptions),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Direct connection timeout')), 15000)
      )
    ]);
    console.log('✅ Connected to MongoDB Atlas (Direct)');
    console.log('📊 Database:', mongoose.connection.name);
    console.log('📊 Host:', mongoose.connection.host);
    startServer();
    return;
  } catch (err) {
    console.error('❌ [2/4] Atlas direct connection failed:', err.message);
  }

  // Try 3: Local MongoDB
  if (srvUri && srvUri.includes('mongodb.net')) {
    try {
      console.log('⏳ [3/4] Trying local MongoDB (timeout: 8s)...');
      await Promise.race([
        mongoose.connect(fallbackUri, localOptions),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Local connection timeout')), 8000)
        )
      ]);
      console.log('✅ Connected to local MongoDB');
      startServer();
      return;
    } catch (err) {
      console.error('❌ [3/4] Local MongoDB failed:', err.message);
    }
  }

  // Try 4: In-memory MongoDB
  if (MongoMemoryServer) {
    try {
      console.log('⏳ [4/4] Starting in-memory MongoDB...');
      const mongoServer = await MongoMemoryServer.create();
      const memoryUri = mongoServer.getUri();
      console.log('✅ In-memory MongoDB started');
      await mongoose.connect(memoryUri, localOptions);
      console.log('✅ Connected to in-memory MongoDB');
      startServer();
      return;
    } catch (err) {
      console.error('❌ [4/4] In-memory MongoDB failed:', err.message);
    }
  }

  // Final fallback: mock data mode
  console.log('⚠️  All database connections failed. Running in mock data mode...');
  startServer();
};

// Start connection attempt
connectMongo();

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err);
  server.close(() => process.exit(1));
});

// Handle SIGTERM
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received. Shutting down gracefully');
  server.close(() => {
    console.log('💤 Process terminated');
  });
});

module.exports = { app, io };