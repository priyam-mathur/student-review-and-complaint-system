import { Router } from 'express';
import * as userController from '../controllers/user.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { updateProfileSchema } from '../validators/auth.validator.js';

const router = Router();

router.use(authenticate);

router.patch('/profile', validate(updateProfileSchema), userController.updateProfile);

// Admin only routes
router.use(authorize('admin', 'superadmin'));
router.get('/', userController.listUsers);
router.get('/:id', userController.getUserById);

export default router;
