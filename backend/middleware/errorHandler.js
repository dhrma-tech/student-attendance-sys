const { AppError } = require('../utils/errorHandler');
const { logger, errorLogger, securityLogger } = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error with context
  const errorContext = {
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    userId: req.user?.id,
    role: req.user?.role,
    timestamp: new Date().toISOString()
  };

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = new AppError(message, 404, 'INVALID_ID');
    errorLogger.warn('Invalid ObjectId', { ...errorContext, error: err.message });
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const value = err.keyValue[field];
    const message = `Duplicate field value: ${field} with value: ${value}`;
    error = new AppError(message, 400, 'DUPLICATE_FIELD');
    errorLogger.warn('Duplicate field error', { ...errorContext, field, value });
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(val => ({
      field: val.path,
      message: val.message,
      value: val.value
    }));
    const message = 'Validation failed';
    error = new AppError(message, 400, 'VALIDATION_ERROR');
    errorLogger.warn('Validation error', { ...errorContext, errors });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    const message = 'Invalid token';
    error = new AppError(message, 401, 'INVALID_TOKEN');
    securityLogger.warn('Invalid JWT token', { ...errorContext, error: err.message });
  }

  if (err.name === 'TokenExpiredError') {
    const message = 'Token expired';
    error = new AppError(message, 401, 'TOKEN_EXPIRED');
    securityLogger.warn('JWT token expired', { ...errorContext, expiredAt: err.expiredAt });
  }

  // Rate limiting errors
  if (err.status === 429) {
    const message = 'Too many requests';
    error = new AppError(message, 429, 'RATE_LIMIT_EXCEEDED');
    securityLogger.warn('Rate limit exceeded', { ...errorContext, limit: err.limit });
  }

  // Database connection errors
  if (err.name === 'MongoNetworkError' || err.name === 'MongoTimeoutError') {
    const message = 'Database connection error';
    error = new AppError(message, 503, 'DATABASE_ERROR');
    errorLogger.error('Database connection error', { ...errorContext, error: err.message });
  }

  // File upload errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    const message = 'File too large';
    error = new AppError(message, 413, 'FILE_TOO_LARGE');
    errorLogger.warn('File upload size exceeded', { ...errorContext, maxSize: err.limit });
  }

  // Default error logging
  if (!error.statusCode || error.statusCode >= 500) {
    errorLogger.error('Unhandled server error', {
      ...errorContext,
      error: err.message,
      stack: err.stack
    });
  }

  // Send standardized error response
  const response = {
    success: false,
    error: {
      code: error.code || 'INTERNAL_ERROR',
      message: error.message || 'Internal server error'
    }
  };

  // Include stack trace in development
  if (process.env.NODE_ENV === 'development') {
    response.error.stack = err.stack;
  }

  res.status(error.statusCode || 500).json(response);
};

// Async error wrapper for routes
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// 404 handler
const notFoundHandler = (req, res, next) => {
  const error = new AppError(`Route ${req.originalUrl} not found`, 404, 'ROUTE_NOT_FOUND');
  
  logger.warn('Route not found', {
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString()
  });
  
  next(error);
};

module.exports = {
  errorHandler,
  asyncHandler,
  notFoundHandler
};
