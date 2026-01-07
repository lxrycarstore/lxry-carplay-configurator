import cors from 'cors';
import express from 'express';
import { configuratorRouter } from './routes/configurator';

export const createServer = () => {
  const app = express();
  const origin = process.env.FRONTEND_ORIGIN ?? 'http://localhost:5173';

  app.use(cors({ origin }));
  app.use(express.json());

  app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok' });
  });

  app.use('/api/configurator', configuratorRouter);

  return app;
};
