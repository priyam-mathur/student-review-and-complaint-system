import Complaint from '../models/Complaint.model.js';
import { ApiError } from '../utils/ApiError.js';
import ActivityLog from '../models/ActivityLog.model.js';
import { createNotification } from './notification.service.js';

export const createComplaint = async (complaintData, studentId, files = []) => {
  const attachments = files.map(file => ({
    filename: file.filename,
    originalName: file.originalname,
    mimetype: file.mimetype,
    size: file.size,
    url: `/uploads/${file.filename}`
  }));

  const complaint = await Complaint.create({
    ...complaintData,
    student: studentId,
    attachments,
  });

  await ActivityLog.create({
    user: studentId,
    action: 'created_complaint',
    resource: 'complaint',
    resourceId: complaint._id,
  });

  return complaint;
};

export const getComplaintById = async (complaintId, user) => {
  const complaint = await Complaint.findById(complaintId)
    .populate('student', 'name email avatar department')
    .populate('category', 'name')
    .populate('department', 'name')
    .populate('assignedTo', 'name email avatar')
    .populate('timeline.changedBy', 'name role')
    .populate('internalNotes.author', 'name role avatar');

  if (!complaint) {
    throw ApiError.notFound('Complaint not found');
  }

  if (user.role === 'student' && complaint.student._id.toString() !== user._id.toString()) {
    throw ApiError.forbidden('You can only view your own complaints');
  }

  return complaint;
};

export const updateComplaintStatus = async (complaintId, status, adminId, note = '') => {
  const complaint = await Complaint.findById(complaintId);
  
  if (!complaint) {
    throw ApiError.notFound('Complaint not found');
  }

  const oldStatus = complaint.status;
  complaint.status = status;
  
  complaint.timeline.push({
    status,
    note,
    changedBy: adminId
  });

  if (status === 'resolved') {
    complaint.resolution = {
      resolvedBy: adminId,
      resolvedAt: new Date(),
      resolutionNote: note
    };
  }

  await complaint.save();

  await ActivityLog.create({
    user: adminId,
    action: 'updated_status',
    resource: 'complaint',
    resourceId: complaint._id,
    details: `Status changed from ${oldStatus} to ${status}`
  });

  // Notify student
  await createNotification(
    complaint.student,
    status === 'resolved' ? 'complaint_resolved' : 'status_changed',
    `Complaint ${status === 'resolved' ? 'Resolved' : 'Status Updated'}`,
    `Your complaint "${complaint.subject}" is now ${status}. ${note}`,
    'Complaint',
    complaint._id
  );

  return complaint;
};
