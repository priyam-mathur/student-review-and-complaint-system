import { Router } from 'express';
import * as notificationController from '../controllers/notification.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

router.use(authenticate);

router.get('/', notificationController.getUserNotifications);
router.get('/unread-count', notificationController.getUnreadCount);
router.patch('/read-all', notificationController.markAllAsRead);
router.patch('/:id/read', notificationController.markAsRead);

export default router;
