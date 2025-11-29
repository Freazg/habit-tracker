import { Request, Response } from 'express';
import categoryService from '../services/category.service';

class CategoryController {
  async getAll(_req: Request, res: Response): Promise<void> {
    try {
      const categories = await categoryService.getAll();
      res.status(200).json(categories);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Failed to fetch categories' });
      }
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const category = await categoryService.getById(req.params.id);
      res.status(200).json(category);
    } catch (error) {
      if (error instanceof Error) {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Failed to fetch category' });
      }
    }
  }
}

export default new CategoryController();
