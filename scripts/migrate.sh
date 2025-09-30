#!/bin/bash

# Property Helper 2025 - Database Migration Script
# This script handles database migrations for production deployments

set -e

# Configuration
ENV_FILE=".env.production"
BACKUP_BEFORE_MIGRATION=true
BACKUP_RETENTION_DAYS=30

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Load environment variables
if [ -f "$ENV_FILE" ]; then
    log_info "Loading environment from $ENV_FILE"
    export $(grep -v '^#' "$ENV_FILE" | xargs)
else
    log_error "Environment file $ENV_FILE not found"
    exit 1
fi

# Database connection check
check_db_connection() {
    log_info "Checking database connection..."
    if docker-compose -f infrastructure/docker-compose.prod.yml exec -T postgres pg_isready -U "$DB_USER" -d "$DB_NAME" >/dev/null 2>&1; then
        log_info "Database connection successful"
        return 0
    else
        log_error "Database connection failed"
        return 1
    fi
}

# Create backup before migration
create_backup() {
    if [ "$BACKUP_BEFORE_MIGRATION" = true ]; then
        log_info "Creating pre-migration backup..."

        BACKUP_DIR="./backups"
        TIMESTAMP=$(date +%Y%m%d_%H%M%S)
        BACKUP_FILE="$BACKUP_DIR/pre_migration_$TIMESTAMP.sql"

        mkdir -p "$BACKUP_DIR"

        if docker-compose -f infrastructure/docker-compose.prod.yml exec -T postgres pg_dump -U "$DB_USER" "$DB_NAME" > "$BACKUP_FILE"; then
            log_info "Backup created: $BACKUP_FILE"

            # Compress backup
            gzip "$BACKUP_FILE"
            log_info "Backup compressed: $BACKUP_FILE.gz"

            # Clean old backups
            find "$BACKUP_DIR" -name "pre_migration_*.sql.gz" -mtime +$BACKUP_RETENTION_DAYS -delete
            log_info "Old backups cleaned up (retention: $BACKUP_RETENTION_DAYS days)"
        else
            log_error "Failed to create backup"
            return 1
        fi
    fi
}

# Run Prisma migrations
run_migrations() {
    log_info "Running database migrations..."

    if docker-compose -f infrastructure/docker-compose.prod.yml exec -T backend npm run db:migrate; then
        log_info "Database migrations completed successfully"
        return 0
    else
        log_error "Database migrations failed"
        return 1
    fi
}

# Run database seeds (optional)
run_seeds() {
    if [ "$RUN_SEEDS" = true ]; then
        log_info "Running database seeds..."

        if docker-compose -f infrastructure/docker-compose.prod.yml exec -T backend npm run db:seed; then
            log_info "Database seeding completed successfully"
            return 0
        else
            log_error "Database seeding failed"
            return 1
        fi
    else
        log_info "Skipping database seeding (RUN_SEEDS=false)"
    fi
}

# Validate migration success
validate_migration() {
    log_info "Validating migration success..."

    # Check if backend can connect to database
    if docker-compose -f infrastructure/docker-compose.prod.yml exec -T backend npm run db:studio --version >/dev/null 2>&1; then
        log_info "Migration validation successful"
        return 0
    else
        log_error "Migration validation failed"
        return 1
    fi
}

# Rollback on failure
rollback_migration() {
    log_error "Migration failed, attempting rollback..."

    # Find latest backup
    LATEST_BACKUP=$(find ./backups -name "pre_migration_*.sql.gz" -type f -printf '%T@ %p\n' | sort -n | tail -1 | cut -d' ' -f2-)

    if [ -n "$LATEST_BACKUP" ]; then
        log_info "Found backup: $LATEST_BACKUP"

        # Stop backend service
        docker-compose -f infrastructure/docker-compose.prod.yml stop backend

        # Restore from backup
        gunzip -c "$LATEST_BACKUP" | docker-compose -f infrastructure/docker-compose.prod.yml exec -T postgres psql -U "$DB_USER" "$DB_NAME"

        # Restart backend service
        docker-compose -f infrastructure/docker-compose.prod.yml start backend

        log_info "Rollback completed"
    else
        log_error "No backup found for rollback"
    fi
}

# Main execution
main() {
    log_info "Starting database migration process..."

    # Parse command line arguments
    while [[ $# -gt 0 ]]; do
        case $1 in
            --no-backup)
                BACKUP_BEFORE_MIGRATION=false
                shift
                ;;
            --run-seeds)
                RUN_SEEDS=true
                shift
                ;;
            --help)
                echo "Usage: $0 [OPTIONS]"
                echo "Options:"
                echo "  --no-backup    Skip backup before migration"
                echo "  --run-seeds    Run database seeds after migration"
                echo "  --help         Show this help message"
                exit 0
                ;;
            *)
                log_error "Unknown option: $1"
                exit 1
                ;;
        esac
    done

    # Pre-migration checks
    if ! check_db_connection; then
        exit 1
    fi

    # Create backup
    if ! create_backup; then
        exit 1
    fi

    # Run migrations
    if run_migrations; then
        # Run seeds if requested
        run_seeds

        # Validate success
        if validate_migration; then
            log_info "Database migration process completed successfully! 🎉"
            exit 0
        fi
    fi

    # If we reach here, migration failed
    rollback_migration
    exit 1
}

# Run main function
main "$@"