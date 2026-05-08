const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000,  // 30 seconds for DNS lookup
      socketTimeoutMS: 60000,
      maxPoolSize: 5,
      minPoolSize: 1,
      autoIndex: true,
      connectTimeoutMS: 30000,
      retryWrites: false,
      retryReads: false,
      family: 4,  // IPv4 only
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📦 Database Name: ${conn.connection.name}`);

    // Connection events
    mongoose.connection.on('connected', () => {
      console.log('✅ Mongoose connected to MongoDB');
    });

    mongoose.connection.on('error', (err) => {
      console.error('❌ Mongoose connection error:', err.message);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️  Mongoose disconnected from MongoDB');
    });

    // Build indexes
    try {
      await mongoose.connection.collection.getIndexes();
      console.log('📑 Database indexes verified');
    } catch (indexErr) {
      console.warn('⚠️ Index verification warning:', indexErr.message);
    }

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('Mongoose connection closed due to app termination');
      process.exit(0);
    });

    return conn;
  } catch (error) {
    console.error(`❌ Error connecting to MongoDB: ${error.message}`);
    // Continue without DB instead of exiting
    return null;
  }
};

module.exports = connectDB;