import { Router } from 'express';
import * as messageController from '../controllers/message.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { upload } from '../config/multer.js';
import { validate } from '../middleware/validate.middleware.js';
import { sendMessageSchema } from '../validators/message.validator.js';

const router = Router();

router.use(authenticate);

router.post('/', upload.array('attachments', 5), validate(sendMessageSchema), messageController.sendMessage);
router.get('/complaint/:complaintId', messageController.getComplaintMessages);
router.patch('/:id/read', messageController.markAsRead);

export default router;
