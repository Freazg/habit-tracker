import request from 'supertest';
import express from 'express';
import authRoutes from '../../routes/auth.routes';
import { errorHandler } from '../../middleware/error.middleware';
import { clearDatabase, closeDatabase } from '../helpers/test-db.helper';

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use(errorHandler);

describe('Auth Integration Tests', () => {
  beforeEach(async () => {
    await clearDatabase();
  });

  afterAll(async () => {
    await clearDatabase();
    await closeDatabase();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const response = await request(app).post('/api/auth/register').send({
        email: 'integration@test.com',
        password: 'password123',
        name: 'Integration Test',
        timezone: 'UTC',
      });

      expect(response.status).toBe(201);
      expect(response.body.user.email).toBe('integration@test.com');
      expect(response.body.token).toBeDefined();
    });

    it('should return 400 for invalid email', async () => {
      const response = await request(app).post('/api/auth/register').send({
        email: 'invalid-email',
        password: 'password123',
        name: 'Test User',
      });

      expect(response.status).toBe(400);
    });

    it('should return 400 for duplicate email', async () => {
      await request(app).post('/api/auth/register').send({
        email: 'duplicate@test.com',
        password: 'password123',
        name: 'Test User',
      });

      const response = await request(app).post('/api/auth/register').send({
        email: 'duplicate@test.com',
        password: 'password123',
        name: 'Test User',
      });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('already exists');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login existing user', async () => {
      await request(app).post('/api/auth/register').send({
        email: 'login@test.com',
        password: 'password123',
        name: 'Login Test',
      });

      const response = await request(app).post('/api/auth/login').send({
        email: 'login@test.com',
        password: 'password123',
      });

      expect(response.status).toBe(200);
      expect(response.body.user.email).toBe('login@test.com');
      expect(response.body.token).toBeDefined();
    });

    it('should return 401 for invalid credentials', async () => {
      await request(app).post('/api/auth/register').send({
        email: 'wrong@test.com',
        password: 'password123',
        name: 'Wrong Test',
      });

      const response = await request(app).post('/api/auth/login').send({
        email: 'wrong@test.com',
        password: 'wrong-password',
      });

      expect(response.status).toBe(401);
    });

    it('should return 401 for non-existent user', async () => {
      const response = await request(app).post('/api/auth/login').send({
        email: 'nonexistent@test.com',
        password: 'password123',
      });

      expect(response.status).toBe(401);
    });
  });
});
