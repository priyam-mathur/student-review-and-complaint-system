import jwt from 'jsonwebtoken';
import User from '../models/User.model.js';
import { ApiError } from '../utils/ApiError.js';
import env from '../config/env.js';
import ActivityLog from '../models/ActivityLog.model.js';

export const generateTokens = (userId) => {
  const accessToken = jwt.sign({ id: userId }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  });

  const refreshToken = jwt.sign({ id: userId }, env.jwtRefreshSecret, {
    expiresIn: env.jwtRefreshExpiresIn,
  });

  return { accessToken, refreshToken };
};

export const registerUser = async (userData) => {
  const existingUser = await User.findOne({ email: userData.email });
  if (existingUser) {
    throw ApiError.conflict('User with this email already exists');
  }

  const user = await User.create(userData);

  await ActivityLog.create({
    user: user._id,
    action: 'registered',
    resource: 'user',
    resourceId: user._id,
  });

  const { accessToken, refreshToken } = generateTokens(user._id);
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  return { user, accessToken, refreshToken };
};

export const loginUser = async (email, password) => {
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.comparePassword(password))) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  if (!user.isActive) {
    throw ApiError.forbidden('Your account has been deactivated');
  }

  const { accessToken, refreshToken } = generateTokens(user._id);

  user.refreshToken = refreshToken;
  user.lastLogin = new Date();
  await user.save({ validateBeforeSave: false });

  await ActivityLog.create({
    user: user._id,
    action: 'logged_in',
    resource: 'system',
  });

  return { user, accessToken, refreshToken };
};
