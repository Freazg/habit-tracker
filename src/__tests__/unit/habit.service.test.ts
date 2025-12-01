import habitService from '../../services/habit.service';
import habitRepository from '../../repositories/habit.repository';
import categoryRepository from '../../repositories/category.repository';

jest.mock('../../repositories/habit.repository');
jest.mock('../../repositories/category.repository');

describe('HabitService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockHabit = {
    id: 'habit-id',
    userId: 'user-id',
    categoryId: 'category-id',
    title: 'Morning Run',
    description: 'Run 5km',
    frequency: 'daily',
    targetDays: null,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  describe('getAll', () => {
    it('should return all habits for user', async () => {
      (habitRepository.findByUserId as jest.Mock).mockResolvedValue([mockHabit]);

      const result = await habitService.getAll('user-id');

      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('Morning Run');
      expect(habitRepository.findByUserId).toHaveBeenCalledWith('user-id');
    });
  });

  describe('getById', () => {
    it('should return habit if user owns it', async () => {
      (habitRepository.findById as jest.Mock).mockResolvedValue(mockHabit);

      const result = await habitService.getById('habit-id', 'user-id');

      expect(result.title).toBe('Morning Run');
    });

    it('should throw error if habit not found', async () => {
      (habitRepository.findById as jest.Mock).mockResolvedValue(null);

      await expect(habitService.getById('habit-id', 'user-id')).rejects.toThrow('Habit not found');
    });

    it('should throw error if user does not own habit', async () => {
      (habitRepository.findById as jest.Mock).mockResolvedValue({
        ...mockHabit,
        userId: 'other-user',
      });

      await expect(habitService.getById('habit-id', 'user-id')).rejects.toThrow('Access denied');
    });
  });

  describe('create', () => {
    it('should create daily habit', async () => {
      (categoryRepository.findById as jest.Mock).mockResolvedValue({ id: 'category-id' });
      (habitRepository.create as jest.Mock).mockResolvedValue(mockHabit);

      const result = await habitService.create('user-id', {
        title: 'Morning Run',
        frequency: 'daily',
        categoryId: 'category-id',
      });

      expect(result.title).toBe('Morning Run');
      expect(habitRepository.create).toHaveBeenCalled();
    });

    it('should throw error if category not found', async () => {
      (categoryRepository.findById as jest.Mock).mockResolvedValue(null);

      await expect(
        habitService.create('user-id', {
          title: 'Morning Run',
          frequency: 'daily',
          categoryId: 'invalid-category',
        })
      ).rejects.toThrow('Category not found');
    });

    it('should throw error for weekly habit without target days', async () => {
      await expect(
        habitService.create('user-id', {
          title: 'Weekly Habit',
          frequency: 'weekly',
        })
      ).rejects.toThrow('Target days are required for weekly habits');
    });
  });

  describe('delete', () => {
    it('should delete habit successfully', async () => {
      (habitRepository.findById as jest.Mock).mockResolvedValue(mockHabit);
      (habitRepository.delete as jest.Mock).mockResolvedValue(true);

      await habitService.delete('habit-id', 'user-id');

      expect(habitRepository.delete).toHaveBeenCalledWith('habit-id');
    });
  });
});
