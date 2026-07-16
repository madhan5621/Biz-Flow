import { app } from './src/app.js';
import config from './src/config/index.js';

const startServer = async () => {
  try {
    app.listen(config.port, () => {
      console.log(`
  ┌─────────────────────────────────────────────┐
  │                                             │
  │   🚀 BizFlow API Server                    │
  │                                             │
  │   Port:        ${String(config.port).padEnd(28)}│
  │   Environment: ${config.nodeEnv.padEnd(28)}│
  │   Health:      http://localhost:${config.port}/api/health │
  │                                             │
  └─────────────────────────────────────────────┘
      `);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
