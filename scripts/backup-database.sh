#!/usr/bin/env bash
# ========================================================
# ISURU GEMS CEYLON - AUTOMATED DATABASE BACKUP & RESTORE UTILITY
# Standard: PostgreSQL 15+ / Supabase Cloud DB (DATA-11)
# ========================================================

set -euo pipefail

BACKUP_DIR="${BACKUP_DIR:-./backups}"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="${BACKUP_DIR}/isuru_gems_${TIMESTAMP}.dump"
LOG_FILE="${BACKUP_DIR}/backup_${TIMESTAMP}.log"

mkdir -p "${BACKUP_DIR}"

echo "[INFO] Initiating Isuru Gems Vault Database Backup at $(date)..." | tee -a "${LOG_FILE}"

if [ -z "${SUPABASE_DB_URL:-}" ] && [ -z "${PGHOST:-}" ]; then
  echo "[ERROR] Missing database connection credentials." | tee -a "${LOG_FILE}"
  echo "Please set SUPABASE_DB_URL (or standard PGHOST, PGPORT, PGDATABASE, PGUSER, PGPASSWORD)." | tee -a "${LOG_FILE}"
  exit 1
fi

if [ -n "${SUPABASE_DB_URL:-}" ]; then
  pg_dump "${SUPABASE_DB_URL}" \
    --format=custom \
    --blobs \
    --verbose \
    --no-owner \
    --no-privileges \
    --file="${BACKUP_FILE}" 2>> "${LOG_FILE}"
else
  pg_dump \
    --format=custom \
    --blobs \
    --verbose \
    --no-owner \
    --no-privileges \
    --file="${BACKUP_FILE}" 2>> "${LOG_FILE}"
fi

BACKUP_SIZE=$(du -h "${BACKUP_FILE}" | cut -f1)
echo "[SUCCESS] Backup complete: ${BACKUP_FILE} (${BACKUP_SIZE})" | tee -a "${LOG_FILE}"

# Retention Policy: keep snapshots from last 14 days
find "${BACKUP_DIR}" -name "isuru_gems_*.dump" -mtime +14 -exec rm {} \; 2>/dev/null || true
echo "[INFO] Retained snapshots within 14-day rolling window." | tee -a "${LOG_FILE}"
