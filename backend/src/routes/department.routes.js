import { Router } from 'express';
import * as departmentController from '../controllers/department.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';

const router = Router();

// Publicly readable for registration
router.get('/', departmentController.list);
router.get('/:id', departmentController.getById);

// Admin only for modifications
router.use(authenticate, authorize('admin', 'superadmin'));
router.post('/', departmentController.create);
router.patch('/:id', departmentController.update);

export default router;
