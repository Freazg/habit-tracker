import express, { Request, Response } from 'express';
import authRoutes from './routes/auth.routes';
import habitRoutes from './routes/habit.routes';
import logRoutes from './routes/log.routes';
import categoryRoutes from './routes/category.routes';
import { errorHandler } from './middleware/error.middleware';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (_req: Request, res: Response) => {
  res.json({
    message: 'Habit Tracker API',
    version: '1.0.0',
    author: 'Sas Yevhenii',
    endpoints: {
      auth: '/api/auth',
      habits: '/api/habits',
      logs: '/api/logs',
      categories: '/api/categories',
    },
  });
});

app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/habits', habitRoutes);
app.use('/api/logs', logRoutes);
app.use('/api/categories', categoryRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`API documentation available at http://localhost:${PORT}/`);
});
