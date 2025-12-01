import categoryService from '../../services/category.service';
import categoryRepository from '../../repositories/category.repository';

jest.mock('../../repositories/category.repository');

describe('CategoryService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockCategories = [
    { id: 'cat-1', name: "Здоров'я", color: '#4CAF50', icon: 'health', createdAt: new Date() },
    { id: 'cat-2', name: 'Спорт', color: '#FF5722', icon: 'fitness', createdAt: new Date() },
  ];

  describe('getAll', () => {
    it('should return all categories after seeding', async () => {
      (categoryRepository.seed as jest.Mock).mockResolvedValue(undefined);
      (categoryRepository.findAll as jest.Mock).mockResolvedValue(mockCategories);

      const result = await categoryService.getAll();

      expect(result).toHaveLength(2);
      expect(categoryRepository.seed).toHaveBeenCalled();
      expect(categoryRepository.findAll).toHaveBeenCalled();
    });
  });

  describe('getById', () => {
    it('should return category by id', async () => {
      (categoryRepository.findById as jest.Mock).mockResolvedValue(mockCategories[0]);

      const result = await categoryService.getById('cat-1');

      expect(result.name).toBe("Здоров'я");
      expect(categoryRepository.findById).toHaveBeenCalledWith('cat-1');
    });

    it('should throw error if category not found', async () => {
      (categoryRepository.findById as jest.Mock).mockResolvedValue(null);

      await expect(categoryService.getById('invalid-id')).rejects.toThrow('Category not found');
    });
  });
});
