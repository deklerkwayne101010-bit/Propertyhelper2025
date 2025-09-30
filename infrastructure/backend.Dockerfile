# Backend Dockerfile - Production Optimized
FROM node:18-alpine AS base

# Install security updates and required packages
RUN apk add --no-cache libc6-compat curl && \
    apk update && \
    apk upgrade

# Create app directory with correct permissions
WORKDIR /app

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Dependencies stage - separate for better caching
FROM base AS deps
COPY package*.json ./
RUN npm ci --only=production --no-audit --no-fund && \
    npm cache clean --force

# Build stage
FROM base AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --no-audit --no-fund
COPY . .
RUN npm run build && \
    npm prune --production

# Production stage - minimal final image
FROM base AS production

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Copy package files
COPY --from=deps --chown=nodejs:nodejs /app/package*.json ./

# Copy production dependencies
COPY --from=deps --chown=nodejs:nodejs /app/node_modules ./node_modules

# Copy built application
COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist

# Copy Prisma files
COPY --from=builder --chown=nodejs:nodejs /app/prisma ./prisma

# Copy any other required files
COPY --from=builder --chown=nodejs:nodejs /app/src/prisma/seed.ts ./src/prisma/

# Switch to non-root user
USER nodejs

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3001/health || exit 1

EXPOSE 3001

ENV PORT=3001
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/index.js"]