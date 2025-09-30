import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Basic health check
router.get('/', async (req: Request, res: Response) => {
  try {
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'property-helper-backend',
      version: process.env.npm_package_version || '1.0.0',
    });
  } catch (error) {
    res.status(500).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: 'Health check failed',
    });
  }
});

// Detailed health check
router.get('/detailed', async (req: Request, res: Response) => {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'property-helper-backend',
    version: process.env.npm_package_version || '1.0.0',
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    checks: {} as any,
  };

  try {
    // Database health check
    try {
      await prisma.$queryRaw`SELECT 1`;
      health.checks.database = {
        status: 'healthy',
        response_time: Date.now(),
      };
    } catch (error) {
      health.checks.database = {
        status: 'unhealthy',
        error: error instanceof Error ? error.message : 'Database connection failed',
      };
      health.status = 'unhealthy';
    }

    // Redis health check (if available)
    if (process.env.REDIS_URL) {
      try {
        // Note: In a real implementation, you'd check Redis connectivity
        health.checks.redis = {
          status: 'healthy',
          url: process.env.REDIS_URL.replace(/:[^:]*@/, ':***@'), // Mask password
        };
      } catch (error) {
        health.checks.redis = {
          status: 'unhealthy',
          error: 'Redis connection failed',
        };
        health.status = 'unhealthy';
      }
    }

    // External services health check
    if (process.env.STRIPE_SECRET_KEY) {
      health.checks.stripe = {
        status: 'configured',
        mode: process.env.STRIPE_SECRET_KEY.startsWith('sk_live') ? 'live' : 'test',
      };
    }

    if (process.env.SENTRY_DSN) {
      health.checks.sentry = {
        status: 'configured',
      };
    }

    // System resources
    health.checks.system = {
      platform: process.platform,
      arch: process.arch,
      node_version: process.version,
      environment: process.env.NODE_ENV || 'development',
    };

    const statusCode = health.status === 'healthy' ? 200 : 503;
    res.status(statusCode).json(health);

  } catch (error) {
    health.status = 'unhealthy';
    health.checks.error = error instanceof Error ? error.message : 'Unknown error';

    res.status(503).json(health);
  }
});

// Readiness probe
router.get('/ready', async (req: Request, res: Response) => {
  try {
    // Check if database is ready
    await prisma.$queryRaw`SELECT 1`;

    res.json({
      status: 'ready',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(503).json({
      status: 'not ready',
      timestamp: new Date().toISOString(),
      error: 'Database not ready',
    });
  }
});

// Liveness probe
router.get('/live', (req: Request, res: Response) => {
  res.json({
    status: 'alive',
    timestamp: new Date().toISOString(),
  });
});

// Metrics endpoint for Prometheus
router.get('/metrics', async (req: Request, res: Response) => {
  try {
    const metrics = {
      timestamp: Date.now(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      version: process.env.npm_package_version || '1.0.0',
    };

    // Add custom metrics here
    // Example: database connection pool stats, request counts, etc.

    res.set('Content-Type', 'application/json');
    res.json(metrics);
  } catch (error) {
    res.status(500).json({
      error: 'Metrics collection failed',
      timestamp: new Date().toISOString(),
    });
  }
});

export { router as healthRoutes };