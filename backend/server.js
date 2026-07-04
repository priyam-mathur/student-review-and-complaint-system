import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';

import env from './src/config/env.js';
import connectDB from './src/config/db.js';
import logger from './src/utils/logger.js';
import { errorHandler, notFoundHandler } from './src/middleware/error.middleware.js';

// Routes
import authRoutes from './src/routes/auth.routes.js';
import complaintRoutes from './src/routes/complaint.routes.js';
import messageRoutes from './src/routes/message.routes.js';
import notificationRoutes from './src/routes/notification.routes.js';
import departmentRoutes from './src/routes/department.routes.js';
import categoryRoutes from './src/routes/category.routes.js';
import analyticsRoutes from './src/routes/analytics.routes.js';
import userRoutes from './src/routes/user.routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Connect to MongoDB
connectDB();

// 1. Security Middleware
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // limit each IP to 500 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes',
});
app.use('/api/', limiter);

app.use(cors({
  origin: env.corsOrigin,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// 2. Body Parsing
app.use(express.json({ limit: '10kb' })); // Limit body size to prevent DOS
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// 3. Data Sanitization
app.use(mongoSanitize()); // Prevent NoSQL Injection
app.use(xss()); // Prevent Cross-Site Scripting (XSS)

// 4. Static Files
const uploadsPath = path.join(__dirname, 'uploads');
app.use('/uploads', express.static(uploadsPath));

// 5. API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/analytics', analyticsRoutes);

// Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'success', message: 'API is running' });
});

// 6. Error Handling
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
const server = app.listen(env.port, () => {
  logger.info(`Server running in ${env.nodeEnv} mode on port ${env.port}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error('UNHANDLED REJECTION! Shutting down...', { error: err.name, message: err.message });
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error('UNCAUGHT EXCEPTION! Shutting down...', { error: err.name, message: err.message, stack: err.stack });
  process.exit(1);
});
