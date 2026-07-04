import { Router } from 'express';
import * as complaintController from '../controllers/complaint.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { upload } from '../config/multer.js';
import {
  createComplaintSchema,
  updateStatusSchema,
  listComplaintsSchema
} from '../validators/complaint.validator.js';

const router = Router();

router.use(authenticate);

router.post(
  '/',
  upload.array('attachments', 5),
  validate(createComplaintSchema),
  complaintController.create
);

router.get('/', validate(listComplaintsSchema), complaintController.list);
router.get('/:id', complaintController.getById);

// Admin only routes
router.patch(
  '/:id/status',
  authorize('admin', 'superadmin'),
  validate(updateStatusSchema),
  complaintController.updateStatus
);

export default router;
