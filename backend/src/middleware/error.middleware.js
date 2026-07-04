import { ApiError } from '../utils/ApiError.js';
import logger from '../utils/logger.js';
import env from '../config/env.js';

/**
 * Global error handling middleware.
 * Catches all errors thrown in the application and returns standardized responses.
 */
// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, req, res, next) => {
  let error = err;

  // Log the error
  if (!(error instanceof ApiError)) {
    logger.error(error.message, {
      stack: error.stack,
      url: req.originalUrl,
      method: req.method,
    });
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
    error = ApiError.badRequest('Validation failed', errors);
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    error = ApiError.conflict(`A record with this ${field} already exists.`);
  }

  // Mongoose cast error (invalid ObjectId)
  if (err.name === 'CastError') {
    error = ApiError.badRequest(`Invalid ${err.path}: ${err.value}`);
  }

  // Multer file size error
  if (err.code === 'LIMIT_FILE_SIZE') {
    error = ApiError.badRequest('File size exceeds the allowed limit.');
  }

  // Multer file count error
  if (err.code === 'LIMIT_FILE_COUNT') {
    error = ApiError.badRequest('Too many files. Maximum 5 files allowed.');
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error = ApiError.unauthorized('Invalid token.');
  }

  if (err.name === 'TokenExpiredError') {
    error = ApiError.unauthorized('Token has expired.');
  }

  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal server error';

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    errors: error.errors || [],
    ...(env.isDev && { stack: error.stack }),
  });
};

/**
 * 404 handler for undefined routes.
 */
export const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    statusCode: 404,
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
};
