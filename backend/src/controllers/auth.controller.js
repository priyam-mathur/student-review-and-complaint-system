import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { registerUser, loginUser } from '../services/auth.service.js';
import env from '../config/env.js';
import User from '../models/User.model.js';

const setCookies = (res, accessToken, refreshToken) => {
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: env.isProd,
    sameSite: env.isProd ? 'none' : 'lax',
    maxAge: 15 * 60 * 1000, // 15 mins
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: env.isProd,
    sameSite: env.isProd ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

export const register = asyncHandler(async (req, res) => {
  const { user, accessToken, refreshToken } = await registerUser(req.body);
  
  setCookies(res, accessToken, refreshToken);
  
  user.password = undefined;
  return ApiResponse.created(res, 'Registration successful', { user });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const { user, accessToken, refreshToken } = await loginUser(email, password);
  
  setCookies(res, accessToken, refreshToken);
  
  user.password = undefined;
  return ApiResponse.success(res, 'Login successful', { user });
});

export const logout = asyncHandler(async (req, res) => {
  if (req.user) {
    await User.findByIdAndUpdate(req.user._id, { $unset: { refreshToken: 1 } });
  }

  res.cookie('accessToken', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.cookie('refreshToken', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  return ApiResponse.success(res, 'Logged out successfully');
});

export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate('department', 'name code');
  return ApiResponse.success(res, 'User data fetched successfully', { user });
});
