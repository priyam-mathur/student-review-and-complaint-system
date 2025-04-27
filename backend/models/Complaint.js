// backend/models/Complaint.js
import mongoose from 'mongoose';

const complaintSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    complaintText: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: 'Pending', // Default status is Pending
    },
    media: {
      type: String, // For storing the filename of the media uploaded
      required: false, // Media is optional
    },
  },
  { timestamps: true }
);

const Complaint = mongoose.model('Complaint', complaintSchema);

export default Complaint;
