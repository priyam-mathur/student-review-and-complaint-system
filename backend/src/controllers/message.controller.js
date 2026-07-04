import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import Message from '../models/Message.model.js';
import Complaint from '../models/Complaint.model.js';
import { ApiError } from '../utils/ApiError.js';
import { createNotification } from '../services/notification.service.js';

export const sendMessage = asyncHandler(async (req, res) => {
  const { complaint: complaintId, receiver, content } = req.body;
  const senderId = req.user._id;

  const complaint = await Complaint.findById(complaintId);
  if (!complaint) {
    throw ApiError.notFound('Complaint not found');
  }

  // Auth check: student can only send on own complaint
  if (req.user.role === 'student' && complaint.student.toString() !== senderId.toString()) {
    throw ApiError.forbidden('Cannot send messages for this complaint');
  }

  const attachments = req.files ? req.files.map(file => ({
    filename: file.filename,
    originalName: file.originalname,
    mimetype: file.mimetype,
    size: file.size,
    url: `/uploads/${file.filename}`
  })) : [];

  const message = await Message.create({
    complaint: complaintId,
    sender: senderId,
    receiver,
    content,
    attachments
  });

  await createNotification(
    receiver,
    'new_message',
    'New Message',
    `You have a new message regarding complaint: ${complaint.subject}`,
    'Message',
    message._id
  );

  return ApiResponse.created(res, 'Message sent successfully', message);
});

export const getComplaintMessages = asyncHandler(async (req, res) => {
  const { complaintId } = req.params;
  
  const complaint = await Complaint.findById(complaintId);
  if (!complaint) {
    throw ApiError.notFound('Complaint not found');
  }

  if (req.user.role === 'student' && complaint.student.toString() !== req.user._id.toString()) {
    throw ApiError.forbidden('Cannot view messages for this complaint');
  }

  const messages = await Message.find({ complaint: complaintId })
    .sort({ createdAt: 1 })
    .populate('sender', 'name role avatar')
    .populate('receiver', 'name role avatar');

  return ApiResponse.success(res, 'Messages fetched', messages);
});

export const markAsRead = asyncHandler(async (req, res) => {
  const message = await Message.findOneAndUpdate(
    { _id: req.params.id, receiver: req.user._id },
    { isRead: true, readAt: new Date() },
    { new: true }
  );

  if (!message) {
    throw ApiError.notFound('Message not found or unauthorized');
  }

  return ApiResponse.success(res, 'Message marked as read', message);
});
