import authService from '../../services/auth.service';
import userRepository from '../../repositories/user.repository';
import * as passwordUtil from '../../utils/password.util';
import * as jwtUtil from '../../utils/jwt.util';

jest.mock('../../repositories/user.repository');
jest.mock('../../utils/password.util');
jest.mock('../../utils/jwt.util');

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const mockUser = {
        id: 'user-id',
        email: 'test@example.com',
        password: 'hashed-password',
        name: 'Test User',
        timezone: 'UTC',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (userRepository.findByEmail as jest.Mock).mockResolvedValue(null);
      (passwordUtil.hashPassword as jest.Mock).mockResolvedValue('hashed-password');
      (userRepository.create as jest.Mock).mockResolvedValue(mockUser);
      (jwtUtil.generateToken as jest.Mock).mockReturnValue('mock-token');

      const result = await authService.register({
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      });

      expect(result.user.email).toBe('test@example.com');
      expect(result.token).toBe('mock-token');
      expect(userRepository.findByEmail).toHaveBeenCalledWith('test@example.com');
      expect(passwordUtil.hashPassword).toHaveBeenCalledWith('password123');
    });

    it('should throw error if user already exists', async () => {
      (userRepository.findByEmail as jest.Mock).mockResolvedValue({ id: 'existing-user' });

      await expect(
        authService.register({
          email: 'test@example.com',
          password: 'password123',
          name: 'Test User',
        })
      ).rejects.toThrow('User with this email already exists');
    });
  });

  describe('login', () => {
    it('should login user successfully', async () => {
      const mockUser = {
        id: 'user-id',
        email: 'test@example.com',
        password: 'hashed-password',
        name: 'Test User',
        timezone: 'UTC',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (userRepository.findByEmail as jest.Mock).mockResolvedValue(mockUser);
      (passwordUtil.comparePassword as jest.Mock).mockResolvedValue(true);
      (jwtUtil.generateToken as jest.Mock).mockReturnValue('mock-token');

      const result = await authService.login('test@example.com', 'password123');

      expect(result.user.email).toBe('test@example.com');
      expect(result.token).toBe('mock-token');
    });

    it('should throw error if user not found', async () => {
      (userRepository.findByEmail as jest.Mock).mockResolvedValue(null);

      await expect(authService.login('test@example.com', 'password123')).rejects.toThrow(
        'Invalid credentials'
      );
    });

    it('should throw error if password is invalid', async () => {
      const mockUser = {
        id: 'user-id',
        email: 'test@example.com',
        password: 'hashed-password',
        name: 'Test User',
        timezone: 'UTC',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (userRepository.findByEmail as jest.Mock).mockResolvedValue(mockUser);
      (passwordUtil.comparePassword as jest.Mock).mockResolvedValue(false);

      await expect(authService.login('test@example.com', 'wrong-password')).rejects.toThrow(
        'Invalid credentials'
      );
    });
  });
});
