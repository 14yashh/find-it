/**
 * src/routes/health.js
 * GET /api/health – lightweight liveness / readiness probe.
 *
 * Returns basic server and database status so infrastructure can
 * determine whether the service is healthy without authentication.
 */
import { Router } from 'express';
import mongoose from 'mongoose';

const router = Router();

router.get('/', (_req, res) => {
  // mongoose.connection.readyState:
  //   0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
  const dbStates = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  const dbState  = dbStates[mongoose.connection.readyState] ?? 'unknown';

  const status = dbState === 'connected' ? 'ok' : 'degraded';

  res.status(status === 'ok' ? 200 : 503).json({
    success: true,
    data: {
      status,
      service:   'FindIt API',
      version:   '1.0.0',
      database:  dbState,
      timestamp: new Date().toISOString(),
      uptime:    `${Math.floor(process.uptime())}s`,
    },
  });
});

export default router;
