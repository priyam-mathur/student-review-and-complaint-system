import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import Complaint from '../models/Complaint.model.js';
import Department from '../models/Department.model.js';

export const getOverview = asyncHandler(async (req, res) => {
  const total = await Complaint.countDocuments();
  const pending = await Complaint.countDocuments({ status: { $in: ['submitted', 'under_review'] } });
  const inProgress = await Complaint.countDocuments({ status: { $in: ['assigned', 'in_progress', 'waiting_student'] } });
  const resolved = await Complaint.countDocuments({ status: { $in: ['resolved', 'closed'] } });
  
  return ApiResponse.success(res, 'Overview fetched', {
    total,
    pending,
    inProgress,
    resolved,
  });
});

export const getDepartmentStats = asyncHandler(async (req, res) => {
  const stats = await Complaint.aggregate([
    {
      $group: {
        _id: '$department',
        total: { $sum: 1 },
        resolved: {
          $sum: { $cond: [{ $in: ['$status', ['resolved', 'closed']] }, 1, 0] }
        }
      }
    },
    {
      $lookup: {
        from: 'departments',
        localField: '_id',
        foreignField: '_id',
        as: 'departmentInfo'
      }
    },
    { $unwind: { path: '$departmentInfo', preserveNullAndEmptyArrays: true } },
    {
      $project: {
        name: { $ifNull: ['$departmentInfo.name', 'Unassigned'] },
        total: 1,
        resolved: 1,
        resolutionRate: {
          $cond: [
            { $eq: ['$total', 0] },
            0,
            { $multiply: [{ $divide: ['$resolved', '$total'] }, 100] }
          ]
        }
      }
    }
  ]);

  return ApiResponse.success(res, 'Department stats fetched', stats);
});
