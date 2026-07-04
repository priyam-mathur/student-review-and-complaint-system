import mongoose from 'mongoose';
import { generateComplaintId } from '../utils/generateId.js';

const COMPLAINT_STATUSES = [
  'draft',
  'submitted',
  'under_review',
  'assigned',
  'in_progress',
  'waiting_student',
  'resolved',
  'rejected',
  'closed',
];

const PRIORITIES = ['low', 'medium', 'high', 'urgent'];

const timelineEntrySchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: COMPLAINT_STATUSES,
      required: true,
    },
    note: {
      type: String,
      default: '',
    },
    changedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

const internalNoteSchema = new mongoose.Schema(
  {
    note: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

const attachmentSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  originalName: { type: String, required: true },
  mimetype: { type: String, required: true },
  size: { type: Number, required: true },
  url: { type: String, required: true },
});

const complaintSchema = new mongoose.Schema(
  {
    complaintId: {
      type: String,
      unique: true,
      default: generateComplaintId,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Student reference is required'],
    },
    subject: {
      type: String,
      required: [true, 'Subject is required'],
      trim: true,
      minlength: [5, 'Subject must be at least 5 characters'],
      maxlength: [200, 'Subject cannot exceed 200 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      minlength: [10, 'Description must be at least 10 characters'],
      maxlength: [5000, 'Description cannot exceed 5000 characters'],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
    },
    priority: {
      type: String,
      enum: {
        values: PRIORITIES,
        message: '{VALUE} is not a valid priority',
      },
      default: 'medium',
    },
    status: {
      type: String,
      enum: {
        values: COMPLAINT_STATUSES,
        message: '{VALUE} is not a valid status',
      },
      default: 'submitted',
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    isAnonymous: {
      type: Boolean,
      default: false,
    },
    attachments: [attachmentSchema],
    expectedResolution: {
      type: Date,
    },
    timeline: [timelineEntrySchema],
    internalNotes: [internalNoteSchema],
    resolution: {
      resolvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      resolvedAt: Date,
      resolutionNote: String,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
complaintSchema.index({ complaintId: 1 }, { unique: true });
complaintSchema.index({ student: 1 });
complaintSchema.index({ status: 1 });
complaintSchema.index({ priority: 1 });
complaintSchema.index({ department: 1 });
complaintSchema.index({ category: 1 });
complaintSchema.index({ assignedTo: 1 });
complaintSchema.index({ createdAt: -1 });
complaintSchema.index({ subject: 'text', description: 'text' });

// Virtual: age in days
complaintSchema.virtual('ageDays').get(function () {
  return Math.floor((Date.now() - this.createdAt) / (1000 * 60 * 60 * 24));
});

// Auto-add initial timeline entry on create
complaintSchema.pre('save', function (next) {
  if (this.isNew && this.timeline.length === 0) {
    this.timeline.push({
      status: this.status,
      note: 'Complaint created',
      changedBy: this.student,
    });
  }
  next();
});

// Ensure unique complaintId on save retry
complaintSchema.pre('save', async function (next) {
  if (this.isNew) {
    let attempts = 0;
    while (attempts < 5) {
      try {
        const exists = await mongoose.model('Complaint').findOne({ complaintId: this.complaintId });
        if (!exists) break;
        this.complaintId = generateComplaintId();
        attempts++;
      } catch {
        break;
      }
    }
  }
  next();
});

export { COMPLAINT_STATUSES, PRIORITIES };

const Complaint = mongoose.model('Complaint', complaintSchema);
export default Complaint;
