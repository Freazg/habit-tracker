import { Router } from 'express';
import habitController from '../controllers/habit.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';
import { createHabitSchema, updateHabitSchema } from '../validators/habit.validator';

const router = Router();

router.use(authMiddleware);

router.get('/', habitController.getAll.bind(habitController));
router.get('/:id', habitController.getById.bind(habitController));
router.post('/', validate(createHabitSchema), habitController.create.bind(habitController));
router.patch('/:id', validate(updateHabitSchema), habitController.update.bind(habitController));
router.delete('/:id', habitController.delete.bind(habitController));

export default router;
