import { Router } from 'express';
import mongoose from 'mongoose';

const healthRouter = Router();

// Mounted by server.js at /health, therefore this handler is /health.
healthRouter.get('/', (_req, res) => {
  const connected = mongoose.connection.readyState === 1;

  return res.status(connected ? 200 : 503).json({
    status: connected ? 'ok' : 'degraded',
    database: connected ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
  });
});

export default healthRouter;
