import express from 'express';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import authRoutes from './routes/auth.routes';
import habitRoutes from './routes/habit.routes';
import logRoutes from './routes/log.routes';
import categoryRoutes from './routes/category.routes';
import { errorHandler } from './middleware/error.middleware';
import cacheService from './services/cache.service';

const app = express();
const PORT = process.env.PORT || 3000;

// Compression middleware
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // Limit auth attempts
  message: 'Too many authentication attempts, please try again later.',
});

app.use('/api/', limiter);
app.use('/api/auth', authLimiter);

app.use(express.json());

app.get('/', (_req, res) => {
  res.json({
    message: 'Habit Tracker API',
    version: '1.0.0',
    author: 'Sas Yevhenii (IO-31)',
    endpoints: {
      auth: '/api/auth (POST /register, POST /login)',
      habits: '/api/habits (GET, POST, PATCH /:id, DELETE /:id)',
      logs: '/api/logs (GET /habit/:habitId, POST, PATCH /:id, DELETE /:id)',
      categories: '/api/categories (GET, GET /:id)',
    },
  });
});

app.get('/health', (_req, res) => {
  const cacheStats = cacheService.getStats();
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    cache: {
      keys: cacheStats.keys,
      hits: cacheStats.hits,
      misses: cacheStats.misses,
    },
  });
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
