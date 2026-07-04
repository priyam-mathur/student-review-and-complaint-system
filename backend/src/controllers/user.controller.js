import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import User from '../models/User.model.js';

export const listUsers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, role, search } = req.query;
  const skip = (page - 1) * limit;

  const filter = {};
  if (role) filter.role = role;
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { studentId: { $regex: search, $options: 'i' } }
    ];
  }

  const [users, total] = await Promise.all([
    User.find(filter)
      .select('-password -refreshToken')
      .populate('department', 'name')
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 }),
    User.countDocuments(filter)
  ]);

  return ApiResponse.paginated(res, 'Users fetched', users, {
    page: Number(page),
    limit: Number(limit),
    total,
    pages: Math.ceil(total / limit)
  });
});

export const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)
    .select('-password -refreshToken')
    .populate('department', 'name');
    
  return ApiResponse.success(res, 'User fetched', user);
});

export const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(req.user._id, req.body, { new: true, runValidators: true })
    .select('-password -refreshToken');
    
  return ApiResponse.success(res, 'Profile updated', user);
});
