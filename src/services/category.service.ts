import categoryRepository from '../repositories/category.repository';
import { Category } from '../models/category.model';

class CategoryService {
  async getAll(): Promise<Category[]> {
    return categoryRepository.findAll();
  }

  async getById(id: string): Promise<Category> {
    const category = await categoryRepository.findById(id);
    if (!category) {
      throw new Error('Category not found');
    }
    return category;
  }
}

export default new CategoryService();
