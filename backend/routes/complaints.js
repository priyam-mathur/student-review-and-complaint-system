// backend/routes/complaints.js
import express from 'express';
import multer from 'multer';
import path from 'path';
import Complaint from '../models/Complaint.js';

const router = express.Router();

// Setup multer storage to handle file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename with extension
  },
});

const upload = multer({ storage });

// Route to create a new complaint
router.post('/', upload.single('media'), async (req, res) => {
  try {
    const { title, complaintText } = req.body;
    let media = null;

    // If a media file is uploaded, store its filename
    if (req.file) {
      media = req.file.filename;
    }

    const newComplaint = new Complaint({
      title,
      complaintText,
      media,
    });

    await newComplaint.save();
    res.status(201).json({ message: 'Complaint submitted successfully', complaint: newComplaint });
  } catch (err) {
    console.error('Error submitting complaint:', err);
    res.status(500).json({ message: 'Error submitting complaint' });
  }
});

// Route to get all complaints for the logged-in student (if needed)
router.get('/', async (req, res) => {
  try {
    const complaints = await Complaint.find();
    res.status(200).json(complaints);
  } catch (err) {
    console.error('Error fetching complaints:', err);
    res.status(500).json({ message: 'Error fetching complaints' });
  }
});
router.put('/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const updated = await Complaint.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update status', error: err });
  }
});

export default router;
