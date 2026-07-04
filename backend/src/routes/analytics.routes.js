import { Router } from 'express';
import * as analyticsController from '../controllers/analytics.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';

const router = Router();

router.use(authenticate, authorize('admin', 'superadmin'));

router.get('/overview', analyticsController.getOverview);
router.get('/departments', analyticsController.getDepartmentStats);

export default router;
