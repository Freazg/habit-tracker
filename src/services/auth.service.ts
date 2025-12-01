import userRepository from '../repositories/user.repository';
import { CreateUserDto, UserResponse } from '../models/user.model';
import { hashPassword, comparePassword } from '../utils/password.util';
import { generateToken } from '../utils/jwt.util';

class AuthService {
  async register(data: CreateUserDto): Promise<{ user: UserResponse; token: string }> {
    const existingUser = await userRepository.findByEmail(data.email);
    if (existingUser !== null) {
      throw new Error('User with this email already exists');
    }

    const hashedPassword = await hashPassword(data.password);
    const user = await userRepository.create({
      ...data,
      password: hashedPassword,
    });

    const token = generateToken({ userId: user.id, email: user.email });

    const userResponse: UserResponse = {
      id: user.id,
      email: user.email,
      name: user.name,
      timezone: user.timezone,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return { user: userResponse, token };
  }

  async login(email: string, password: string): Promise<{ user: UserResponse; token: string }> {
    const user = await userRepository.findByEmail(email);
    if (user === null) {
      throw new Error('Invalid credentials');
    }

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    const token = generateToken({ userId: user.id, email: user.email });

    const userResponse: UserResponse = {
      id: user.id,
      email: user.email,
      name: user.name,
      timezone: user.timezone,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return { user: userResponse, token };
  }
}

export default new AuthService();
