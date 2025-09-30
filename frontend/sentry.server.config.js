import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN,

  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: process.env.NODE_ENV === 'development',

  // Filter out sensitive information from server-side events
  beforeSend(event) {
    // Remove sensitive data from request headers
    if (event.request?.headers) {
      const sensitiveHeaders = ['authorization', 'cookie', 'x-api-key'];
      sensitiveHeaders.forEach(header => {
        if (event.request.headers[header]) {
          event.request.headers[header] = '[FILTERED]';
        }
      });
    }

    // Remove sensitive data from request data
    if (event.request?.data) {
      const sensitiveFields = ['password', 'token', 'secret', 'key'];
      const data = event.request.data;

      if (typeof data === 'object' && data !== null) {
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