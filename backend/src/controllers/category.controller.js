import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import Category from '../models/Category.model.js';

export const create = asyncHandler(async (req, res) => {
  const category = await Category.create(req.body);
  return ApiResponse.created(res, 'Category created successfully', category);
});

export const list = asyncHandler(async (req, res) => {
  const categories = await Category.find({ isActive: true }).populate('department', 'name code');
  return ApiResponse.success(res, 'Categories fetched successfully', categories);
});

export const update = asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
  return ApiResponse.success(res, 'Category updated successfully', category);
});
