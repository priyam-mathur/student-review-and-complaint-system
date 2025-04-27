import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Corrected this to directly assign decoded data
    next();
  } catch (err) {
    console.error('JWT Verification Error:', err);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

export default authMiddleware;
