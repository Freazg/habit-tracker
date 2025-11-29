export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  timezone: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserDto {
  email: string;
  password: string;
  name: string;
  timezone?: string;
}

export interface UserResponse {
  id: string;
  email: string;
  name: string;
  timezone: string;
  createdAt: Date;
  updatedAt: Date;
}
