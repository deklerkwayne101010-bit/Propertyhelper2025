import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: process.env.NODE_ENV === 'development',

  replaysOnErrorSampleRate: 1.0,

  // This sets the sample rate to be 10%. You may want this to be 100% while
  // in development and sample at a lower rate in production
  replaysSessionSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 0.1,

  // You can remove this option if you're not planning to use the Sentry Session Replay feature:
  integrations: [
    new Sentry.Replay({
      // Additional Replay configuration goes in here, for example:
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],

  // Filter out sensitive information
  beforeSend(event) {
    // Filter sensitive data from breadcrumbs and contexts
    if (event.breadcrumbs) {
      event.breadcrumbs = event.breadcrumbs.filter(breadcrumb => {
        // Filter out sensitive breadcrumb data
        if (breadcrumb.data) {
          const sensitiveKeys = ['password', 'token', 'secret', 'key', 'authorization'];
          sensitiveKeys.forEach(key => {
            if (breadcrumb.data[key]) {
              breadcrumb.data[key] = '[FILTERED]';
            }
          });
        }
        return true;
      });
    }

    return event;
  },
});