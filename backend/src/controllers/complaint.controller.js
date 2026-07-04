import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { createComplaint, getComplaintById, updateComplaintStatus } from '../services/complaint.service.js';
import Complaint from '../models/Complaint.model.js';

export const create = asyncHandler(async (req, res) => {
  const complaint = await createComplaint(req.body, req.user._id, req.files);
  return ApiResponse.created(res, 'Complaint submitted successfully', complaint);
});

export const getById = asyncHandler(async (req, res) => {
  const complaint = await getComplaintById(req.params.id, req.user);
  return ApiResponse.success(res, 'Complaint fetched successfully', complaint);
});

export const updateStatus = asyncHandler(async (req, res) => {
  const { status, note } = req.body;
  const complaint = await updateComplaintStatus(req.params.id, status, req.user._id, note);
  return ApiResponse.success(res, 'Status updated successfully', complaint);
});

export const list = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status, priority, department, category, search, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
  const skip = (page - 1) * limit;

  const filter = {};
  
  if (req.user.role === 'student') {
    filter.student = req.user._id;
  }
  
  if (status) filter.status = status;
  if (priority) filter.priority = priority;
  if (department) filter.department = department;
  if (category) filter.category = category;
  
  if (search) {
    filter.$text = { $search: search };
  }

  const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };
  if (search) {
    sort.score = { $meta: 'textScore' };
  }

  const [complaints, total] = await Promise.all([
    Complaint.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(Number(limit))
      .populate('category', 'name')
      .populate('department', 'name')
      .populate('student', 'name email studentId')
      .select('-internalNotes'),
    Complaint.countDocuments(filter)
  ]);

  return ApiResponse.paginated(res, 'Complaints fetched successfully', complaints, {
    page: Number(page),
    limit: Number(limit),
    total,
    pages: Math.ceil(total / limit)
  });
});
