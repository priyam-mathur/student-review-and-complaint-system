import mongoose from 'mongoose';

const activityLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    action: {
      type: String,
      required: true,
      trim: true,
    },
    resource: {
      type: String,
      required: true,
      enum: ['complaint', 'user', 'message', 'department', 'category', 'system'],
    },
    resourceId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    details: {
      type: String,
      trim: true,
      default: '',
    },
    ipAddress: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

activityLogSchema.index({ user: 1, createdAt: -1 });
activityLogSchema.index({ resource: 1, createdAt: -1 });

const ActivityLog = mongoose.model('ActivityLog', activityLogSchema);
export default ActivityLog;
