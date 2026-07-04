import mongoose from 'mongoose';

const NOTIFICATION_TYPES = [
  'complaint_submitted',
  'complaint_assigned',
  'status_changed',
  'complaint_resolved',
  'complaint_rejected',
  'new_message',
  'announcement',
];

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: NOTIFICATION_TYPES,
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    reference: {
      model: {
        type: String,
        enum: ['Complaint', 'Message', 'User'],
      },
      id: {
        type: mongoose.Schema.Types.ObjectId,
      },
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    readAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
notificationSchema.index({ user: 1, isRead: 1 });
notificationSchema.index({ user: 1, createdAt: -1 });

export { NOTIFICATION_TYPES };

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
