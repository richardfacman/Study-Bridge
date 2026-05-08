const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log to console for dev
  if (process.env.NODE_ENV === 'development') {
    console.error('Error:', err);
  }

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = { statusCode: 404, message };
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `${field} already exists`;
    error = { statusCode: 400, message };
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    error = { statusCode: 400, message };
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    const message = 'Invalid token';
    error = { statusCode: 401, message };
  }

  if (err.name === 'TokenExpiredError') {
    const message = 'Token expired';
    error = { statusCode: 401, message };
  }

  // Multer errors
  if (err.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') {
      error = { statusCode: 400, message: 'File size too large' };
    } else if (err.code === 'LIMIT_FILE_COUNT') {
      error = { statusCode: 400, message: 'Too many files' };
    } else {
      error = { statusCode: 400, message: err.message };
    }
  }

  // Mongoose MongooseServerSelectionError (connection timeout)
  if (err.name === 'MongooseServerSelectionError' || err.name === 'MongoNetworkError') {
    error = {
      statusCode: 503,
      message: 'Database connection timeout. Please try again later.'
    };
  }

  // Query timeout error (maxTimeMS exceeded)
  if (err.name === 'MongoServerError' && err.message.includes('exceeded time limit')) {
    error = {
      statusCode: 504,
      message: 'Request timeout. The database query took too long. Please try again.'
    };
  }

  // Generic timeout handling
  if (err.message && (err.message.includes('timeout') || err.message.includes('Time limit'))) {
    error = {
      statusCode: 504,
      message: 'Request timeout. Please try again.'
    };
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler;