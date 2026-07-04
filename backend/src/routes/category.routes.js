import { Router } from 'express';
import * as categoryController from '../controllers/category.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';

const router = Router();

router.use(authenticate);

router.get('/', categoryController.list);

router.use(authorize('admin', 'superadmin'));
router.post('/', categoryController.create);
router.patch('/:id', categoryController.update);

export default router;
