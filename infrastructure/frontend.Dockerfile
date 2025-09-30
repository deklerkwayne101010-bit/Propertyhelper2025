# Frontend Dockerfile - Production Optimized
FROM node:18-alpine AS base

# Install security updates and required packages
RUN apk add --no-cache libc6-compat curl && \
    apk update && \
    apk upgrade

# Create app directory
WORKDIR /app

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Dependencies stage - separate for better caching
FROM base AS deps
COPY package*.json ./
RUN npm ci --no-audit --no-fund --prefer-offline && \
    npm cache clean --force

# Build stage
FROM base AS builder
WORKDIR /app

# Copy dependencies
COPY --from=deps /app/node_modules ./node_modules
COPY package*.json ./
COPY . .

# Disable Next.js telemetry
ENV NEXT_TELEMETRY_DISABLED=1

# Build the application
RUN npm run build

# Production stage - minimal final image
FROM base AS runner

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

WORKDIR /app

# Copy package files for potential runtime dependencies
COPY --from=builder --chown=nextjs:nodejs /app/package*.json ./

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create necessary directories with correct permissions
RUN mkdir -p .next && \
    chown -R nextjs:nodejs .next

# Copy the public folder
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Copy the built application
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Switch to non-root user
USER nextjs

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3000/api/health || exit 1

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "server.js"]