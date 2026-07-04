import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/ApiError.js';
import env from '../config/env.js';
import User from '../models/User.model.js';

/**
 * Verifies JWT access token from httpOnly cookie or Authorization header.
 * Attaches full user document to req.user.
 */
export const authenticate = async (req, res, next) => {
  try {
    // Try cookie first, then Authorization header
    const token =
      req.cookies?.accessToken ||
      (req.headers.authorization?.startsWith('Bearer ')
        ? req.headers.authorization.split(' ')[1]
        : null);

    if (!token) {
      throw ApiError.unauthorized('Authentication required. Please log in.');
    }

    const decoded = jwt.verify(token, env.jwtSecret);

    const user = await User.findById(decoded.id).select('-password -refreshToken');

    if (!user) {
      throw ApiError.unauthorized('User no longer exists.');
    }

    if (!user.isActive) {
      throw ApiError.forbidden('Your account has been deactivated.');
    }

    req.user = user;
    next();
  } catch (err) {
    if (err instanceof ApiError) {
      return next(err);
    }
    if (err.name === 'JsonWebTokenError') {
      return next(ApiError.unauthorized('Invalid token.'));
    }
    if (err.name === 'TokenExpiredError') {
      return next(ApiError.unauthorized('Token has expired. Please log in again.'));
    }
    next(ApiError.unauthorized('Authentication failed.'));
  }
};

/**
 * Optional authentication — doesn't fail if no token present.
 * Used for public routes that show different content for logged-in users.
 */
export const optionalAuth = async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      (req.headers.authorization?.startsWith('Bearer ')
        ? req.headers.authorization.split(' ')[1]
        : null);

    if (token) {
      const decoded = jwt.verify(token, env.jwtSecret);
      const user = await User.findById(decoded.id).select('-password -refreshToken');
      if (user && user.isActive) {
        req.user = user;
      }
    }
  } catch {
    // Silent fail — user remains unauthenticated
  }
  next();
};

/**
 * Authorize users based on their roles
 * @param {...string} roles - Roles allowed to access the route
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(ApiError.unauthorized('User not authenticated.'));
    }

    if (!roles.includes(req.user.role)) {
      return next(ApiError.forbidden(`Role '${req.user.role}' is not authorized to access this resource.`));
    }

    next();
  };
};
