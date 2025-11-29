import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import habitService from '../services/habit.service';

class HabitController {
  async getAll(req: AuthRequest, res: Response): Promise<void> {
    try {
      const habits = await habitService.getAll(req.user!.userId);
      res.status(200).json(habits);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Failed to fetch habits' });
      }
    }
  }

  async getById(req: AuthRequest, res: Response): Promise<void> {
    try {
      const habit = await habitService.getById(req.params.id, req.user!.userId);
      res.status(200).json(habit);
    } catch (error) {
      if (error instanceof Error) {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Failed to fetch habit' });
      }
    }
  }

  async create(req: AuthRequest, res: Response): Promise<void> {
    try {
      const habit = await habitService.create(req.user!.userId, req.body);
      res.status(201).json(habit);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Failed to create habit' });
      }
    }
  }

  async update(req: AuthRequest, res: Response): Promise<void> {
    try {
      const habit = await habitService.update(req.params.id, req.user!.userId, req.body);
      res.status(200).json(habit);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Failed to update habit' });
      }
    }
  }

  async delete(req: AuthRequest, res: Response): Promise<void> {
    try {
      await habitService.delete(req.params.id, req.user!.userId);
      res.status(204).send();
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Failed to delete habit' });
      }
    }
  }
}

export default new HabitController();
