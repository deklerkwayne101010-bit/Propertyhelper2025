import * as Sentry from '@sentry/node';
import { ProfilingIntegration } from '@sentry/profiling-node';

export const initializeSentry = () => {
  if (process.env.SENTRY_DSN) {
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      environment: process.env.NODE_ENV || 'development',
      integrations: [
        // Add profiling integration
        new ProfilingIntegration(),
        // Add other integrations as needed
        new Sentry.Integrations.Http({ tracing: true }),
        new Sentry.Integrations.Console(),
        new Sentry.Integrations.OnUncaughtException(),
        new Sentry.Integrations.OnUnhandledRejection(),
      ],
      // Performance Monitoring
      tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
      // Release Health
      enableTracing: true,
      // Set profiling sample rate
      profilesSampleRate: 1.0,
      // Capture console logs
      beforeSend(event) {
        // Filter out sensitive information
        if (event.request?.data) {
          // Remove sensitive fields from request data
          const sensitiveFields = ['password', 'token', 'secret', 'key'];
          const data = event.request.data as any;

          if (typeof data === 'object') {
            sensitiveFields.forEach(field => {
              if (data[field]) {
                data[field] = '[FILTERED]';
              }
            });
          }
        }
        return event;
      },
    });

    console.log('Sentry initialized successfully');
  } else {
    console.log('Sentry DSN not provided, skipping initialization');
  }
};

export const captureException = (error: Error, context?: any) => {
  if (context) {
    Sentry.withScope(scope => {
      scope.setContext('additional_info', context);
      Sentry.captureException(error);
    });
  } else {
    Sentry.captureException(error);
  }
};

export const captureMessage = (message: string, level: Sentry.SeverityLevel = 'info', context?: any) => {
  if (context) {
    Sentry.withScope(scope => {
      scope.setContext('additional_info', context);
      Sentry.captureMessage(message, level);
    });
  } else {
    Sentry.captureMessage(message, level);
  }
};

export const setUser = (user: { id: string; email?: string; username?: string }) => {
  Sentry.setUser({
    id: user.id,
    email: user.email,
    username: user.username,
  });
};

export const setTag = (key: string, value: string) => {
  Sentry.setTag(key, value);
};

export const setContext = (key: string, context: any) => {
  Sentry.setContext(key, context);
};

// Performance monitoring middleware
export const sentryPerformanceMiddleware = (req: any, res: any, next: any) => {
  const transaction = Sentry.startTransaction({
    op: 'http.server',
    name: `${req.method} ${req.url}`,
  });

  res.on('finish', () => {
    transaction.setHttpStatus(res.statusCode);
    transaction.finish();
  });

  next();
};