import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import Message from '../models/Message.js';
import User from '../models/User.js';

const router = express.Router();

// Send message from admin to student
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { receiverId, content } = req.body;

    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can send messages' });
    }

    const receiver = await User.findById(receiverId);
    if (!receiver || receiver.role !== 'student') {
      return res.status(404).json({ message: 'Student not found' });
    }

    const message = new Message({
      sender: req.user._id,
      receiver: receiverId,
      content,
    });

    await message.save();
    res.status(201).json({ message: 'Message sent successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error sending message', error });
  }
});

// Get messages for logged-in student
router.get('/', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'student') {
      return res.status(403).json({ message: 'Only students can view messages' });
    }

    const messages = await Message.find({ receiver: req.user._id }).populate('sender', 'name');
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching messages', error });
  }
});

export default router;
