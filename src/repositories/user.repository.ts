import { User, CreateUserDto } from '../models/user.model';
import { v4 as uuidv4 } from 'uuid';

class UserRepository {
  private users: User[] = [];

  async findAll(): Promise<User[]> {
    return this.users;
  }

  async findById(id: string): Promise<User | undefined> {
    return this.users.find((user) => user.id === id);
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.users.find((user) => user.email === email);
  }

  async create(data: CreateUserDto): Promise<User> {
    const user: User = {
      id: uuidv4(),
      email: data.email,
      password: data.password,
      name: data.name,
      timezone: data.timezone || 'UTC',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.push(user);
    return user;
  }

  async update(id: string, data: Partial<User>): Promise<User | undefined> {
    const index = this.users.findIndex((user) => user.id === id);
    if (index === -1) return undefined;

    this.users[index] = {
      ...this.users[index],
      ...data,
      updatedAt: new Date(),
    };
    return this.users[index];
  }

  async delete(id: string): Promise<boolean> {
    const index = this.users.findIndex((user) => user.id === id);
    if (index === -1) return false;
    this.users.splice(index, 1);
    return true;
  }
}

export default new UserRepository();
