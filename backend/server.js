// backend/server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import mongoose from 'mongoose';
import authRoutes from './auth.js';
import complaintRoutes from './routes/complaints.js';
import messageRoutes from './routes/messages.js';
import testimonialRoutes from './routes/testimonials.js';
import { fileURLToPath } from 'url';
import path from 'path';

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Static folder for uploaded media files
const __dirnamePath = path.resolve(); // workaround for __dirname in ES modules
app.use('/uploads', express.static(path.join(__dirnamePath, 'uploads')));

// Connect to DB
const dbURI = 'mongodb://localhost:27017/student-grievances-system'; // Change the DB name here
mongoose.connect(dbURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected :)'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/complaints', complaintRoutes); // Complaint routes


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// Root route
app.get('/', (req, res) => {
  res.send('Student Complaint System API is running');
});


// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
