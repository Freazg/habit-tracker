import prisma from '../utils/prisma.util';
import { Category, CreateCategoryDto } from '../models/category.model';

class CategoryRepository {
  async findAll(): Promise<Category[]> {
    return prisma.category.findMany();
  }

  async findById(id: string): Promise<Category | null> {
    return prisma.category.findUnique({ where: { id } });
  }

  async findByName(name: string): Promise<Category | null> {
    return prisma.category.findUnique({ where: { name } });
  }

  async create(data: CreateCategoryDto): Promise<Category> {
    return prisma.category.create({ data });
  }

  async seed(): Promise<void> {
    const categories = [
      { name: "Здоров'я", color: '#4CAF50', icon: 'health' },
      { name: 'Спорт', color: '#FF5722', icon: 'fitness' },
      { name: 'Навчання', color: '#2196F3', icon: 'school' },
      { name: 'Фінанси', color: '#FFC107', icon: 'money' },
    ];

    for (const cat of categories) {
      const exists = await this.findByName(cat.name);
      if (!exists) {
        await this.create(cat);
      }
    }
  }
}

export default new CategoryRepository();
