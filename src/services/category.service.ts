import categoryRepository from '../repositories/category.repository';
import { Category } from '../models/category.model';
import cacheService from './cache.service';

class CategoryService {
  private readonly CACHE_KEY = 'categories:all';
  private readonly CACHE_TTL = 3600; // 1 hour

  async getAll(): Promise<Category[]> {
    const cached = cacheService.get<Category[]>(this.CACHE_KEY);
    if (cached) {
      return cached;
    }

    await categoryRepository.seed();
    const categories = await categoryRepository.findAll();
    cacheService.set(this.CACHE_KEY, categories, this.CACHE_TTL);
    return categories;
  }

  async getById(id: string): Promise<Category> {
    const category = await categoryRepository.findById(id);
    if (category === null) {
      throw new Error('Category not found');
    }
    return category;
  }
}

export default new CategoryService();
