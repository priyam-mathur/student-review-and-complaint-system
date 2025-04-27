// backend/routes/testimonials.js
import express from 'express';

const router = express.Router();

// Dummy testimonials data
const testimonials = [
  {
    _id: '1',
    studentName: 'Alice Johnson',
    content: 'This platform really helped me communicate my concerns effectively!',
  },
  {
    _id: '2',
    studentName: 'Rahul Mehta',
    content: 'Very responsive system. My complaint was resolved within days.',
  },
];

router.get('/', (req, res) => {
  res.json(testimonials);
});

export default router;
