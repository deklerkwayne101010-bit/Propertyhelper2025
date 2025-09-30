# Property Helper 2025 - Deployment Guide

## Overview

This document provides comprehensive instructions for deploying Property Helper 2025 to production environments.

## Prerequisites

### System Requirements
- Docker Engine 20.10+
- Docker Compose 2.0+
- 4GB RAM minimum (8GB recommended)
- 20GB disk space
- Linux/Windows/MacOS host system

### Required Services
- PostgreSQL 15+
- Redis 7+
- Nginx (for production proxy)

### Domain & SSL
- Registered domain name
- SSL certificate (Let's Encrypt recommended)

## Environment Setup

### 1. Clone Repository
```bash
git clone https://github.com/your-org/property-helper-2025.git
cd property-helper-2025
```

### 2. Environment Configuration

Copy and configure environment files:

```bash
cp .env.example .env.production
cp backend/.env.example backend/.env.production
cp frontend/.env.example frontend/.env.production
```

#### Required Environment Variables

Edit `.env.production` with your production values:

```bash
# Database
DB_PASSWORD=your_secure_db_password
DB_USER=property_helper_prod
DB_NAME=property_helper_prod

# Security
JWT_SECRET=your_256_bit_jwt_secret
STRIPE_SECRET_KEY=sk_live_your_stripe_secret
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Email
SMTP_HOST=smtp.your-email-provider.com
SMTP_USER=your_smtp_username
SMTP_PASS=your_smtp_password

# Monitoring
SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id
GRAFANA_ADMIN_PASSWORD=secure_grafana_password

# Domain
APP_URL=https://your-domain.com
```

### 3. SSL Certificate Setup

For production, set up SSL certificates:

```bash
# Using Let's Encrypt (recommended)
sudo certbot certonly --standalone -d your-domain.com

# Copy certificates to nginx directory
sudo cp /etc/letsencrypt/live/your-domain.com/fullchain.pem ./infrastructure/nginx/ssl/
sudo cp /etc/letsencrypt/live/your-domain.com/privkey.pem ./infrastructure/nginx/ssl/
```

## Deployment Options

### Option 1: Docker Compose (Recommended)

#### Production Deployment
```bash
# Build and deploy
docker-compose -f infrastructure/docker-compose.prod.yml up -d

# View logs
docker-compose -f infrastructure/docker-compose.prod.yml logs -f

# Scale services if needed
docker-compose -f infrastructure/docker-compose.prod.yml up -d --scale backend=3
```

#### Staging Deployment
```bash
# Deploy to staging
docker-compose -f infrastructure/docker-compose.staging.yml up -d
```

### Option 2: Kubernetes Deployment

For larger scale deployments, use the provided Kubernetes manifests:

```bash
# Apply Kubernetes manifests
kubectl apply -f k8s/

# Check deployment status
kubectl get pods
kubectl get services
```

### Option 3: Cloud Platform Deployment

#### AWS ECS
```bash
# Build and push images to ECR
aws ecr get-login-password --region your-region | docker login --username AWS --password-stdin your-account.dkr.ecr.your-region.amazonaws.com

# Deploy using AWS Copilot
copilot deploy
```

#### Google Cloud Run
```bash
# Build and deploy
gcloud run deploy property-helper-backend --source ./backend --platform managed
gcloud run deploy property-helper-frontend --source ./frontend --platform managed
```

## Database Setup

### Initial Database Setup
```bash
# Run database migrations
docker-compose -f infrastructure/docker-compose.prod.yml exec backend npm run db:migrate

# Seed initial data
docker-compose -f infrastructure/docker-compose.prod.yml exec backend npm run db:seed
```

### Database Backup Strategy

#### Automated Backups
```bash
# Create backup script
#!/bin/bash
BACKUP_DIR="/opt/backups"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/property_helper_$DATE.sql"

# Create backup
docker exec property-helper-prod-postgres pg_dump -U property_helper_user property_helper_prod > $BACKUP_FILE

# Compress
gzip $BACKUP_FILE

# Clean old backups (keep last 30 days)
find $BACKUP_DIR -name "*.sql.gz" -mtime +30 -delete
```

#### Restore from Backup
```bash
# Stop the application
docker-compose -f infrastructure/docker-compose.prod.yml down

# Restore database
gunzip backup_file.sql.gz
docker exec -i property-helper-prod-postgres psql -U property_helper_user property_helper_prod < backup_file.sql

# Restart application
docker-compose -f infrastructure/docker-compose.prod.yml up -d
```

## Monitoring Setup

### Prometheus & Grafana

Access monitoring dashboards:
- Grafana: http://your-domain.com/grafana (admin/admin123)
- Prometheus: http://your-domain.com/prometheus

### Sentry Error Tracking

Configure Sentry DSN in environment variables for error reporting.

### Health Checks

Monitor application health:
```bash
# API Health Check
curl https://your-domain.com/api/health

# Database Health Check
docker-compose -f infrastructure/docker-compose.prod.yml exec postgres pg_isready -U property_helper_user -d property_helper_prod
```

## Security Configuration

### SSL/TLS Setup
```nginx
# nginx.conf
server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /etc/nginx/ssl/fullchain.pem;
    ssl_certificate_key /etc/nginx/ssl/privkey.pem;

    # SSL Security Settings
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;

    # HSTS
    add_header Strict-Transport-Security "max-age=63072000" always;

    location / {
        proxy_pass http://frontend:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /api {
        proxy_pass http://backend:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### Security Headers
```nginx
# Security headers
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Referrer-Policy "no-referrer-when-downgrade" always;
add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
```

## Performance Optimization

### Database Optimization
```sql
-- Create indexes for better performance
CREATE INDEX CONCURRENTLY idx_properties_location ON properties USING GIST (location);
CREATE INDEX CONCURRENTLY idx_properties_price ON properties (price);
CREATE INDEX CONCURRENTLY idx_properties_status ON properties (status);
CREATE INDEX CONCURRENTLY idx_users_email ON users (email);
```

### Redis Caching Strategy
```javascript
// Implement Redis caching for frequently accessed data
const cache = require('redis').createClient();

app.get('/api/properties', async (req, res) => {
  const cacheKey = `properties:${JSON.stringify(req.query)}`;

  // Try cache first
  const cached = await cache.get(cacheKey);
  if (cached) {
    return res.json(JSON.parse(cached));
  }

  // Fetch from database
  const properties = await prisma.property.findMany(req.query);

  // Cache for 5 minutes
  await cache.setex(cacheKey, 300, JSON.stringify(properties));

  res.json(properties);
});
```

### CDN Setup
Configure CDN for static assets:
```javascript
// next.config.js
module.exports = {
  images: {
    domains: ['your-cdn-domain.com'],
  },
  assetPrefix: process.env.NODE_ENV === 'production' ? 'https://your-cdn-domain.com' : '',
};
```

## Scaling Strategies

### Horizontal Scaling
```bash
# Scale backend services
docker-compose -f infrastructure/docker-compose.prod.yml up -d --scale backend=5

# Load balancer configuration
upstream backend_servers {
    server backend:3001;
    server backend:3002;
    server backend:3003;
    server backend:3004;
    server backend:3005;
}
```

### Database Scaling
```bash
# Read replica setup
docker run --name postgres-replica \
  -e POSTGRES_PASSWORD=replica_password \
  -e POSTGRES_USER=replica_user \
  --link postgres-primary:primary \
  postgres:15 \
  -c wal_level=replica \
  -c hot_standby=on
```

## Backup & Recovery

### Automated Backup Schedule
```bash
# Add to crontab for daily backups at 2 AM
0 2 * * * /opt/scripts/backup.sh

# Weekly full backup on Sundays
0 3 * * 0 /opt/scripts/full-backup.sh
```

### Disaster Recovery Plan
1. **Immediate Response**: Stop affected services
2. **Assessment**: Determine scope of data loss
3. **Recovery**: Restore from latest backup
4. **Verification**: Test application functionality
5. **Communication**: Notify stakeholders

## Troubleshooting

### Common Issues

#### Database Connection Issues
```bash
# Check database connectivity
docker-compose -f infrastructure/docker-compose.prod.yml exec postgres pg_isready -U property_helper_user -d property_helper_prod

# View database logs
docker-compose -f infrastructure/docker-compose.prod.yml logs postgres
```

#### Application Startup Issues
```bash
# Check application logs
docker-compose -f infrastructure/docker-compose.prod.yml logs backend
docker-compose -f infrastructure/docker-compose.prod.yml logs frontend

# Verify environment variables
docker-compose -f infrastructure/docker-compose.prod.yml exec backend env | grep -E "(DB_|JWT_|STRIPE_)"
```

#### Performance Issues
```bash
# Monitor resource usage
docker stats

# Check application metrics
curl http://localhost:9090/metrics

# Database performance analysis
docker-compose -f infrastructure/docker-compose.prod.yml exec postgres psql -U property_helper_user -d property_helper_prod -c "SELECT * FROM pg_stat_activity;"
```

## Maintenance Procedures

### Regular Maintenance Tasks

#### Weekly Tasks
- Review error logs
- Check disk space usage
- Update security patches
- Review backup integrity

#### Monthly Tasks
- Database optimization
- Log rotation
- Security audit
- Performance review

#### Quarterly Tasks
- Major version updates
- Security assessment
- Disaster recovery testing

### Log Management
```bash
# Log rotation configuration
/var/log/property-helper/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 644 www-data www-data
    postrotate
        docker-compose -f /opt/property-helper/docker-compose.prod.yml restart nginx
    endscript
}
```

## Support & Monitoring

### Alert Configuration
Set up alerts for:
- Application downtime
- High error rates
- Database connection issues
- Disk space warnings
- Memory/CPU usage spikes

### Support Contacts
- Development Team: dev@yourcompany.com
- Infrastructure Team: infra@yourcompany.com
- Emergency Contact: emergency@yourcompany.com

---

## Quick Reference Commands

```bash
# Start production environment
docker-compose -f infrastructure/docker-compose.prod.yml up -d

# View logs
docker-compose -f infrastructure/docker-compose.prod.yml logs -f

# Restart services
docker-compose -f infrastructure/docker-compose.prod.yml restart

# Update application
git pull && docker-compose -f infrastructure/docker-compose.prod.yml up -d --build

# Backup database
docker exec property-helper-prod-postgres pg_dump -U property_helper_user property_helper_prod > backup.sql

# Health check
curl https://your-domain.com/api/health