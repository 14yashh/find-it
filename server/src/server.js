/**
 * src/server.js
 * Entry point – connects to MongoDB, then starts the HTTP server.
 * All application logic lives in app.js.
 */
import { connectDB } from './config/db.js';
import { env } from './config/env.js';
import app from './app.js';
import { registerListeners } from './events/listeners.js';
import { startCronJobs } from './jobs/expireItems.js';

const PORT = Number(env.PORT);

async function main() {
  // 1. Connect to the database first; process.exit(1) on failure
  await connectDB();
  registerListeners();
  startCronJobs();

  // 2. Start listening
  const server = app.listen(PORT, () => {
    console.log(`🚀  FindIt API listening on http://localhost:${PORT}`);
    console.log(`    Environment : ${env.NODE_ENV}`);
    console.log(`    Client URL  : ${env.CLIENT_URL}`);
  });

  // ── Graceful shutdown ─────────────────────────────────────────────────────
  const gracefulShutdown = (signal) => {
    console.log(`\n[${signal}] Shutting down gracefully…`);
    server.close(() => {
      console.log('✅  HTTP server closed.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));
}

main();
