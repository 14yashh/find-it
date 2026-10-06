/**
 * src/app.js
 * Express application factory.
 * All middleware and routes are registered here; the server binding
 * lives in server.js so this file is importable in tests without
 * starting a real port listener.
 */
import express       from 'express';
import helmet        from 'helmet';
import cors          from 'cors';
import morgan        from 'morgan';
import cookieParser  from 'cookie-parser';
import mongoSanitize from 'express-mongo-sanitize';
import rateLimit     from 'express-rate-limit';

import { env }          from './config/env.js';
import healthRouter     from './routes/health.js';
import authRouter       from './routes/auth.js';
import adminRouter      from './routes/admin.js';
import itemRouter       from './routes/items.js';
import filesRouter      from './routes/files.js';
import claimRouter      from './routes/claims.js';
import notificationRouter from './routes/notifications.js';
import { notFound }     from './middleware/notFound.js';
import { errorHandler } from './middleware/errorHandler.js';

// ─── App factory ────────────────────────────────────────────────────────────

const app = express();

// ── Security headers ─────────────────────────────────────────────────────────
app.use(helmet());

// ── CORS ─────────────────────────────────────────────────────────────────────
app.use(
  cors({
    origin:      env.CLIENT_URL,
    credentials: true,            // Allow cookies to be sent cross-origin
    methods:     ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);

// ── Request logging ───────────────────────────────────────────────────────────
if (env.NODE_ENV !== 'test') {
  app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));
}

// ── Body parsing ──────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10kb' }));       // Reject oversized JSON bodies
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// ── NoSQL injection sanitisation ─────────────────────────────────────────────
app.use(mongoSanitize());

// ── Global rate limiter (relaxed; auth routes get a stricter one in phase 2) ─
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max:      process.env.NODE_ENV === 'test' ? 2000 : 200,
  standardHeaders: true,
  legacyHeaders:   false,
  message: {
    success: false,
    error: { code: 'TOO_MANY_REQUESTS', message: 'Too many requests, please try again later.' },
  },
});
app.use('/api', globalLimiter);

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/health', healthRouter);
app.use('/api/auth',   authRouter);
app.use('/api/admin',  adminRouter);
app.use('/api/items',  itemRouter);
app.use('/api/claims', claimRouter);
app.use('/api/files',  filesRouter);
app.use('/api/notifications', notificationRouter);

// ── Error handling (must be last) ──────────────────────────────────────────────

// ── 404 & error handling (must be last) ──────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

export default app;
