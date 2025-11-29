import express, { Request, Response } from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (_req: Request, res: Response) => {
  res.json({
    message: 'Habit Tracker API',
    version: '1.0.0',
    author: 'Sas Yevhenii',
  });
});

app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
