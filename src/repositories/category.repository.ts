import { Category, CreateCategoryDto } from '../models/category.model';
import { v4 as uuidv4 } from 'uuid';

class CategoryRepository {
  private categories: Category[] = [
    {
      id: uuidv4(),
      name: "Здоров'я",
      color: '#4CAF50',
      icon: 'health',
      createdAt: new Date(),
    },
    {
      id: uuidv4(),
      name: 'Спорт',
      color: '#FF5722',
      icon: 'fitness',
      createdAt: new Date(),
    },
    {
      id: uuidv4(),
      name: 'Навчання',
      color: '#2196F3',
      icon: 'school',
      createdAt: new Date(),
    },
    {
      id: uuidv4(),
      name: 'Фінанси',
      color: '#FFC107',
      icon: 'money',
      createdAt: new Date(),
    },
  ];

  async findAll(): Promise<Category[]> {
    return this.categories;
  }

  async findById(id: string): Promise<Category | undefined> {
    return this.categories.find((cat) => cat.id === id);
  }

  async findByName(name: string): Promise<Category | undefined> {
    return this.categories.find((cat) => cat.name === name);
  }

  async create(data: CreateCategoryDto): Promise<Category> {
    const category: Category = {
      id: uuidv4(),
      name: data.name,
      color: data.color,
      icon: data.icon,
      createdAt: new Date(),
    };
    this.categories.push(category);
    return category;
  }
}

export default new CategoryRepository();
