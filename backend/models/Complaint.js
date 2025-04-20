import mongoose from 'mongoose';

const complaintSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,  // Ensure title is required
  },
  description: {
    type: String,
    required: true,  // Ensure description is required
  },
  category: {
    type: String,
    required: true,  // Ensure category is required
  },
  media: {
    type: String,
    required: false,  // Media is optional
  },
  userId: {
    type: String,
    required: true,  // Ensure userId is required
  },
  status: {
    type: String,
    default: 'Pending',  // Default status
  },
}, { timestamps: true });

const Complaint = mongoose.model('Complaint', complaintSchema);

export default Complaint;
