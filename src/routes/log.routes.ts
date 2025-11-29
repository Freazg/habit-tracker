import { Router } from 'express';
import logController from '../controllers/log.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';
import { createLogSchema, updateLogSchema } from '../validators/log.validator';

const router = Router();

router.use(authMiddleware);

router.get('/habit/:habitId', logController.getByHabitId.bind(logController));
router.post('/', validate(createLogSchema), logController.create.bind(logController));
router.patch('/:id', validate(updateLogSchema), logController.update.bind(logController));
router.delete('/:id', logController.delete.bind(logController));

export default router;
