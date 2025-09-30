#!/bin/bash

# Property Helper 2025 - Database Backup Script
# This script creates automated backups of the production database

set -e

# Configuration
ENV_FILE=".env.production"
BACKUP_DIR="./backups"
RETENTION_DAYS=30
COMPRESS_BACKUPS=true

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${GREEN}[INFO]${NC} $(date '+%Y-%m-%d %H:%M:%S') - $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $(date '+%Y-%m-%d %H:%M:%S') - $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $(date '+%Y-%m-%d %H:%M:%S') - $1"
}

log_debug() {
    echo -e "${BLUE}[DEBUG]${NC} $(date '+%Y-%m-%d %H:%M:%S') - $1"
}

# Load environment variables
load_environment() {
    if [ -f "$ENV_FILE" ]; then
        log_info "Loading environment from $ENV_FILE"
        export $(grep -v '^#' "$ENV_FILE" | xargs)
    else
        log_error "Environment file $ENV_FILE not found"
        exit 1
    fi
}

# Create backup directory
create_backup_dir() {
    if [ ! -d "$BACKUP_DIR" ]; then
        log_info "Creating backup directory: $BACKUP_DIR"
        mkdir -p "$BACKUP_DIR"
    fi
}

# Generate backup filename
generate_backup_filename() {
    local timestamp=$(date +%Y%m%d_%H%M%S)
    local type=${1:-"manual"}
    echo "${BACKUP_DIR}/property_helper_${type}_${timestamp}.sql"
}

# Check database connectivity
check_database() {
    log_info "Checking database connectivity..."

    if docker-compose -f infrastructure/docker-compose.prod.yml exec -T postgres pg_isready -U "$DB_USER" -d "$DB_NAME" >/dev/null 2>&1; then
        log_info "Database connection successful"
        return 0
    else
        log_error "Database connection failed"
        return 1
    fi
}

# Get database size
get_database_size() {
    log_info "Checking database size..."

    local size=$(docker-compose -f infrastructure/docker-compose.prod.yml exec -T postgres psql -U "$DB_USER" -d "$DB_NAME" -t -c "SELECT pg_size_pretty(pg_database_size('$DB_NAME'));" 2>/dev/null | tr -d ' ')

    if [ -n "$size" ]; then
        log_info "Database size: $size"
        echo "$size"
    else
        log_warn "Could not determine database size"
        echo "Unknown"
    fi
}

# Create database backup
create_backup() {
    local backup_type=${1:-"manual"}
    local backup_file=$(generate_backup_filename "$backup_type")

    log_info "Starting $backup_type backup..."
    log_info "Backup file: $backup_file"

    local start_time=$(date +%s)

    # Create backup using pg_dump
    if docker-compose -f infrastructure/docker-compose.prod.yml exec -T postgres pg_dump \
        -U "$DB_USER" \
        --no-password \
        --format=custom \
        --compress=9 \
        --verbose \
        --file="/tmp/backup.dump" \
        "$DB_NAME" >/dev/null 2>&1; then

        # Copy backup from container
        docker cp "$(docker-compose -f infrastructure/docker-compose.prod.yml ps -q postgres)":/tmp/backup.dump "$backup_file.dump" >/dev/null 2>&1

        local end_time=$(date +%s)
        local duration=$((end_time - start_time))

        log_info "Backup completed successfully in ${duration}s"

        # Compress if requested
        if [ "$COMPRESS_BACKUPS" = true ]; then
            log_info "Compressing backup..."
            gzip "$backup_file.dump"
            backup_file="${backup_file}.dump.gz"
            log_info "Backup compressed: $backup_file"
        fi

        # Verify backup integrity
        verify_backup "$backup_file"

        echo "$backup_file"
        return 0
    else
        log_error "Backup failed"
        return 1
    fi
}

# Verify backup integrity
verify_backup() {
    local backup_file=$1

    log_info "Verifying backup integrity..."

    if [ "$COMPRESS_BACKUPS" = true ]; then
        # For compressed backups, check if file exists and has content
        if [ -s "$backup_file" ]; then
            local size=$(stat -f%z "$backup_file" 2>/dev/null || stat -c%s "$backup_file" 2>/dev/null)
            log_info "Backup file size: $size bytes"
            return 0
        else
            log_error "Backup file is empty or does not exist"
            return 1
        fi
    else
        # For uncompressed backups, try to list contents
        if pg_restore --list "$backup_file" >/dev/null 2>&1; then
            log_info "Backup integrity verified"
            return 0
        else
            log_error "Backup integrity check failed"
            return 1
        fi
    fi
}

# Clean old backups
cleanup_old_backups() {
    log_info "Cleaning up old backups (retention: $RETENTION_DAYS days)..."

    local deleted_count=0

    # Find and delete old backups
    while IFS= read -r -d '' file; do
        log_info "Deleting old backup: $file"
        rm -f "$file"
        ((deleted_count++))
    done < <(find "$BACKUP_DIR" -name "property_helper_*.sql*" -mtime +$RETENTION_DAYS -print0)

    if [ $deleted_count -gt 0 ]; then
        log_info "Cleaned up $deleted_count old backup(s)"
    else
        log_info "No old backups to clean up"
    fi
}

# Send notification (placeholder for actual notification system)
send_notification() {
    local message=$1
    local level=${2:-"info"}

    # Placeholder - integrate with your notification system
    # Examples: Slack, Discord, email, etc.

    case $level in
        "success")
            log_info "NOTIFICATION: $message"
            ;;
        "warning")
            log_warn "NOTIFICATION: $message"
            ;;
        "error")
            log_error "NOTIFICATION: $message"
            ;;
        *)
            log_info "NOTIFICATION: $message"
            ;;
    esac
}

# Generate backup report
generate_report() {
    local backup_file=$1
    local backup_type=$2
    local db_size=$3
    local start_time=$4
    local end_time=$5

    local duration=$((end_time - start_time))
    local file_size=$(stat -f%z "$backup_file" 2>/dev/null || stat -c%s "$backup_file" 2>/dev/null)

    cat << EOF > "${backup_file}.report"
Property Helper 2025 - Backup Report
=====================================

Backup Details:
- Type: $backup_type
- Date: $(date -r "$start_time" '+%Y-%m-%d %H:%M:%S')
- Duration: ${duration}s
- Database Size: $db_size
- Backup File: $backup_file
- File Size: $file_size bytes

System Information:
- Hostname: $(hostname)
- User: $(whoami)
- Working Directory: $(pwd)

Backup Configuration:
- Retention Days: $RETENTION_DAYS
- Compression: $COMPRESS_BACKUPS
- Environment: ${NODE_ENV:-production}

EOF

    log_info "Backup report generated: ${backup_file}.report"
}

# Main backup function
perform_backup() {
    local backup_type=${1:-"manual"}

    log_info "=== Starting Property Helper Database Backup ==="
    log_info "Backup type: $backup_type"

    # Load environment
    load_environment

    # Create backup directory
    create_backup_dir

    # Check database connectivity
    if ! check_database; then
        send_notification "Database backup failed: Cannot connect to database" "error"
        exit 1
    fi

    # Get database size
    local db_size=$(get_database_size)

    # Create backup
    local start_time=$(date +%s)
    local backup_file

    if backup_file=$(create_backup "$backup_type"); then
        local end_time=$(date +%s)

        # Generate report
        generate_report "$backup_file" "$backup_type" "$db_size" "$start_time" "$end_time"

        # Clean up old backups
        cleanup_old_backups

        # Send success notification
        send_notification "Database backup completed successfully: $backup_file" "success"

        log_info "=== Backup completed successfully ==="
        echo "$backup_file"
        return 0
    else
        # Send failure notification
        send_notification "Database backup failed" "error"

        log_error "=== Backup failed ==="
        exit 1
    fi
}

# Scheduled backup function
scheduled_backup() {
    local backup_type="scheduled"

    # Add timestamp to log
    echo "=== $(date) ==="

    perform_backup "$backup_type"
}

# Manual backup function
manual_backup() {
    perform_backup "manual"
}

# Show usage
usage() {
    cat << EOF
Property Helper 2025 - Database Backup Script

Usage: $0 [OPTIONS]

Options:
    -m, --manual     Perform manual backup (default)
    -s, --scheduled  Perform scheduled backup
    -c, --cleanup    Only cleanup old backups
    -v, --verify     Verify existing backup file
    -h, --help       Show this help message

Examples:
    $0                          # Manual backup
    $0 --manual                 # Manual backup
    $0 --scheduled              # Scheduled backup
    $0 --cleanup                # Cleanup old backups
    $0 --verify backup.sql.gz   # Verify backup file

Environment:
    Set BACKUP_DIR to change backup directory (default: ./backups)
    Set RETENTION_DAYS to change retention period (default: 30)
    Set COMPRESS_BACKUPS to enable/disable compression (default: true)

EOF
}

# Parse command line arguments
main() {
    case "${1:-}" in
        -m|--manual)
            manual_backup
            ;;
        -s|--scheduled)
            scheduled_backup
            ;;
        -c|--cleanup)
            load_environment
            create_backup_dir
            cleanup_old_backups
            ;;
        -v|--verify)
            if [ -z "$2" ]; then
                log_error "Please specify backup file to verify"
                exit 1
            fi
            verify_backup "$2"
            ;;
        -h|--help)
            usage
            ;;
        *)
            manual_backup
            ;;
    esac
}

# Run main function with all arguments
main "$@"