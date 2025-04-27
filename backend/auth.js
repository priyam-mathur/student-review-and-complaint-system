// backend/auth.js
import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();
const router = express.Router();

// Hardcoded users for testing
const hardcodedUsers = [
  {
    email: 'admin@example.com',
    password: 'admin123', // Plain text password for testing purposes
    role: 'admin',
    name: 'Admin User',
  },
  {
    email: 'student@example.com',
    password: 'student123', // Plain text password for testing purposes
    role: 'student',
    name: 'Student User',
  },
];

// @route   POST /api/login
// @desc    Authenticate user and get token
// @access  Public
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // First, check for hardcoded users
    const hardcodedUser = hardcodedUsers.find(
      (user) => user.email === email && user.password === password
    );
    
    if (hardcodedUser) {
      // If the user is found in hardcoded users, create a token
      const token = jwt.sign(
        { id: hardcodedUser.email, role: hardcodedUser.role }, 
        process.env.JWT_SECRET, 
        { expiresIn: '1d' }
      );
      
      return res.json({
        token,
        user: {
          id: hardcodedUser.email,
          email: hardcodedUser.email,
          role: hardcodedUser.role,
          name: hardcodedUser.name,
        },
      });
    }

    // Check if user exists in the database
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    // Validate password (for database user)
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    // Create token for database user
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        name: user.name,
      },
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Dummy middleware to extract token and user
export const authenticateUser = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ message: 'Invalid token' });
  }
};

// @route   GET /api/user
// @desc    Get user data (auth required)
// @access  Private
router.get('/user', authenticateUser, (req, res) => {
  // Send back user info from the token
  res.json({ user: req.user });
});

export default router;
