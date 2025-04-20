import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import Complaint from '../models/Complaint.js';
import { fileURLToPath } from 'url';

// For __dirname support in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Set up multer storage with file type validation
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'video/mp4']; // Allowed file types
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, or MP4 files are allowed.'));
  }
};

const upload = multer({ storage, fileFilter });

// POST /api/complaints - submit complaint with media
router.post('/', upload.single('media'), async (req, res) => {
  const { title, category, details, userId } = req.body;
  const media = req.file ? req.file.filename : null;

  if (!title || !category || !details || !userId) {
    return res.status(400).json({ message: 'Missing required fields.' });
  }

  try {
    const newComplaint = new Complaint({
      title,
      category,
      description: details,
      media,
      userId,
    });

    await newComplaint.save();
    res.status(201).json({ message: 'Complaint submitted', complaint: newComplaint });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error submitting complaint' });
  }
});

// GET /api/complaints/stats - Get stats on complaints
router.get('/stats', async (req, res) => {
  try {
    const pending = await Complaint.countDocuments({ status: 'Pending' });
    const resolved = await Complaint.countDocuments({ status: 'Resolved' });
    res.status(200).json({ pending, resolved });
  } catch (err) {
    console.error('Error fetching stats:', err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// GET /api/complaints/recent - Get the 5 most recent complaints
router.get('/recent', async (req, res) => {
  try {
    const complaints = await Complaint.find().sort({ createdAt: -1 }).limit(5);
    res.status(200).json(complaints);
  } catch (err) {
    console.error('Error fetching recent complaints:', err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// GET /api/admin/complaints - Admin get all complaints
router.get('/admin/all', async (req, res) => {
  try {
    const complaints = await Complaint.find().sort({ createdAt: -1 });
    res.status(200).json(complaints);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching all complaints' });
  }
});

// PATCH /api/admin/complaints/:id - Admin update complaint status
router.patch('/admin/complaints/:id', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const updated = await Complaint.findByIdAndUpdate(id, { status }, { new: true });
    res.status(200).json({ message: 'Status updated', complaint: updated });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating complaint status' });
  }
});

// GET /api/complaints/:userId - Get complaints for a specific user
router.get('/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const complaints = await Complaint.find({ userId });
    res.status(200).json(complaints);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching complaints' });
  }
});

// Serve uploaded media files
router.use('/media', express.static(path.join(__dirname, '../uploads')));

export default router;
