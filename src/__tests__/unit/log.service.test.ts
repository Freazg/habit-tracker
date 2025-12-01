import logService from '../../services/log.service';
import habitLogRepository from '../../repositories/habit-log.repository';
import habitRepository from '../../repositories/habit.repository';

jest.mock('../../repositories/habit-log.repository');
jest.mock('../../repositories/habit.repository');

describe('LogService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockHabit = {
    id: 'habit-id',
    userId: 'user-id',
    categoryId: null,
    title: 'Test Habit',
    description: null,
    frequency: 'daily',
    targetDays: null,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockLog = {
    id: 'log-id',
    habitId: 'habit-id',
    date: new Date('2025-12-01'),
    completed: true,
    note: null,
    createdAt: new Date(),
  };

  describe('getByHabitId', () => {
    it('should return logs for habit', async () => {
      (habitRepository.findById as jest.Mock).mockResolvedValue(mockHabit);
      (habitLogRepository.findByHabitId as jest.Mock).mockResolvedValue([mockLog]);

      const result = await logService.getByHabitId('habit-id', 'user-id');

      expect(result).toHaveLength(1);
      expect(result[0].habitId).toBe('habit-id');
    });

    it('should throw error if habit not found', async () => {
      (habitRepository.findById as jest.Mock).mockResolvedValue(null);

      await expect(logService.getByHabitId('habit-id', 'user-id')).rejects.toThrow(
        'Habit not found'
      );
    });

    it('should throw error if user does not own habit', async () => {
      (habitRepository.findById as jest.Mock).mockResolvedValue({
        ...mockHabit,
        userId: 'other-user',
      });

      await expect(logService.getByHabitId('habit-id', 'user-id')).rejects.toThrow('Access denied');
    });
  });

  describe('create', () => {
    it('should create new log', async () => {
      (habitRepository.findById as jest.Mock).mockResolvedValue(mockHabit);
      (habitLogRepository.findByHabitAndDate as jest.Mock).mockResolvedValue(null);
      (habitLogRepository.create as jest.Mock).mockResolvedValue(mockLog);

      const result = await logService.create(
        {
          habitId: 'habit-id',
          date: '2025-12-01',
          completed: true,
        },
        'user-id'
      );

      expect(result.habitId).toBe('habit-id');
      expect(habitLogRepository.create).toHaveBeenCalled();
    });

    it('should update existing log if already exists', async () => {
      (habitRepository.findById as jest.Mock).mockResolvedValue(mockHabit);
      (habitLogRepository.findByHabitAndDate as jest.Mock).mockResolvedValue(mockLog);
      (habitLogRepository.update as jest.Mock).mockResolvedValue({
        ...mockLog,
        completed: false,
      });

      const result = await logService.create(
        {
          habitId: 'habit-id',
          date: '2025-12-01',
          completed: false,
        },
        'user-id'
      );

      expect(habitLogRepository.update).toHaveBeenCalled();
      expect(result.completed).toBe(false);
    });

    it('should throw error if habit not found', async () => {
      (habitRepository.findById as jest.Mock).mockResolvedValue(null);

      await expect(
        logService.create(
          {
            habitId: 'habit-id',
            date: '2025-12-01',
            completed: true,
          },
          'user-id'
        )
      ).rejects.toThrow('Habit not found');
    });
  });

  describe('delete', () => {
    it('should delete log successfully', async () => {
      (habitLogRepository.findById as jest.Mock).mockResolvedValue(mockLog);
      (habitRepository.findById as jest.Mock).mockResolvedValue(mockHabit);
      (habitLogRepository.delete as jest.Mock).mockResolvedValue(true);

      await logService.delete('log-id', 'user-id');

      expect(habitLogRepository.delete).toHaveBeenCalledWith('log-id');
    });

    it('should throw error if log not found', async () => {
      (habitLogRepository.findById as jest.Mock).mockResolvedValue(null);

      await expect(logService.delete('log-id', 'user-id')).rejects.toThrow('Log not found');
    });
  });
});
