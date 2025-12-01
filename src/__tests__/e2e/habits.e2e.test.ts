import request from 'supertest';
import express from 'express';
import authRoutes from '../../routes/auth.routes';
import habitRoutes from '../../routes/habit.routes';
import categoryRoutes from '../../routes/category.routes';
import { errorHandler } from '../../middleware/error.middleware';
import { clearDatabase, closeDatabase } from '../helpers/test-db.helper';

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/habits', habitRoutes);
app.use('/api/categories', categoryRoutes);
app.use(errorHandler);

describe('Habits E2E Tests', () => {
  let authToken: string;

  beforeEach(async () => {
    await clearDatabase();

    const registerResponse = await request(app).post('/api/auth/register').send({
      email: 'e2e@test.com',
      password: 'password123',
      name: 'E2E Test User',
    });

    authToken = registerResponse.body.token;
  });

  afterAll(async () => {
    await clearDatabase();
    await closeDatabase();
  });

  describe('Complete Habit Workflow', () => {
    let habitId: string;

    it('should create a new habit', async () => {
      const response = await request(app)
        .post('/api/habits')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Morning Exercise',
          description: '30 minutes workout',
          frequency: 'daily',
        });

      expect(response.status).toBe(201);
      expect(response.body.title).toBe('Morning Exercise');
      habitId = response.body.id;
    });

    it('should get all user habits', async () => {
      await request(app).post('/api/habits').set('Authorization', `Bearer ${authToken}`).send({
        title: 'Morning Exercise',
        description: '30 minutes workout',
        frequency: 'daily',
      });

      const response = await request(app)
        .get('/api/habits')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.length).toBeGreaterThan(0);
      habitId = response.body[0].id;
    });

    it('should get habit by id', async () => {
      const createResponse = await request(app)
        .post('/api/habits')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Morning Exercise',
          frequency: 'daily',
        });

      habitId = createResponse.body.id;

      const response = await request(app)
        .get(`/api/habits/${habitId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(habitId);
    });

    it('should update habit', async () => {
      const createResponse = await request(app)
        .post('/api/habits')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Morning Exercise',
          frequency: 'daily',
        });

      habitId = createResponse.body.id;

      const response = await request(app)
        .patch(`/api/habits/${habitId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Evening Exercise',
          description: '45 minutes workout',
        });

      expect(response.status).toBe(200);
      expect(response.body.title).toBe('Evening Exercise');
      expect(response.body.description).toBe('45 minutes workout');
    });

    it('should delete habit', async () => {
      const createResponse = await request(app)
        .post('/api/habits')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Morning Exercise',
          frequency: 'daily',
        });

      habitId = createResponse.body.id;

      const response = await request(app)
        .delete(`/api/habits/${habitId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(204);
    });

    it('should return 404 for deleted habit', async () => {
      const createResponse = await request(app)
        .post('/api/habits')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Morning Exercise',
          frequency: 'daily',
        });

      habitId = createResponse.body.id;

      await request(app)
        .delete(`/api/habits/${habitId}`)
        .set('Authorization', `Bearer ${authToken}`);

      const response = await request(app)
        .get(`/api/habits/${habitId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
    });
  });

  describe('Authorization tests', () => {
    it('should return 401 without token', async () => {
      const response = await request(app).get('/api/habits');

      expect(response.status).toBe(401);
    });

    it('should return 401 with invalid token', async () => {
      const response = await request(app)
        .get('/api/habits')
        .set('Authorization', 'Bearer invalid-token');

      expect(response.status).toBe(401);
    });
  });
});
