import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import logService from '../services/log.service';

class LogController {
  async getByHabitId(req: AuthRequest, res: Response): Promise<void> {
    try {
      const logs = await logService.getByHabitId(req.params.habitId, req.user!.userId);
      res.status(200).json(logs);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Failed to fetch logs' });
      }
    }
  }

  async create(req: AuthRequest, res: Response): Promise<void> {
    try {
      const log = await logService.create(req.body, req.user!.userId);
      res.status(201).json(log);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Failed to create log' });
      }
    }
  }

  async update(req: AuthRequest, res: Response): Promise<void> {
    try {
      const log = await logService.update(req.params.id, req.user!.userId, req.body);
      res.status(200).json(log);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Failed to update log' });
      }
    }
  }

  async delete(req: AuthRequest, res: Response): Promise<void> {
    try {
      await logService.delete(req.params.id, req.user!.userId);
      res.status(204).send();
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Failed to delete log' });
      }
    }
  }
}

export default new LogController();
