import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import Department from '../models/Department.model.js';

export const create = asyncHandler(async (req, res) => {
  const department = await Department.create(req.body);
  return ApiResponse.created(res, 'Department created successfully', department);
});

export const list = asyncHandler(async (req, res) => {
  const departments = await Department.find({ isActive: true }).populate('head', 'name email');
  return ApiResponse.success(res, 'Departments fetched successfully', departments);
});

export const getById = asyncHandler(async (req, res) => {
  const department = await Department.findById(req.params.id).populate('head', 'name email');
  return ApiResponse.success(res, 'Department fetched successfully', department);
});

export const update = asyncHandler(async (req, res) => {
  const department = await Department.findByIdAndUpdate(req.params.id, req.body, { new: true });
  return ApiResponse.success(res, 'Department updated successfully', department);
});
