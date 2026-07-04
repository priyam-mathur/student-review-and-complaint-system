import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    complaint: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Complaint',
      required: [true, 'Complaint reference is required'],
      index: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Sender is required'],
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Receiver is required'],
    },
    content: {
      type: String,
      required: [true, 'Message content is required'],
      trim: true,
      maxlength: [2000, 'Message cannot exceed 2000 characters'],
    },
    attachments: [
      {
        filename: String,
        originalName: String,
        mimetype: String,
        size: Number,
        url: String,
      },
    ],
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
messageSchema.index({ complaint: 1, createdAt: 1 });
messageSchema.index({ sender: 1 });
messageSchema.index({ receiver: 1, isRead: 1 });

const Message = mongoose.model('Message', messageSchema);
export default Message;
