# ========================================================
# ISURU GEMS CEYLON - AUTOMATED DATABASE BACKUP UTILITY (PowerShell)
# Standard: PostgreSQL 15+ / Supabase Cloud DB (DATA-11)
# ========================================================

param (
    [string]$BackupDir = "./backups"
)

$ErrorActionPreference = "Stop"
$Timestamp = (Get-Date).ToString("yyyyMMdd_HHmmss")
$BackupFile = Join-Path $BackupDir "isuru_gems_$Timestamp.dump"
$LogFile = Join-Path $BackupDir "backup_$Timestamp.log"

if (-not (Test-Path $BackupDir)) {
    New-Item -ItemType Directory -Path $BackupDir | Out-Null
}

Write-Host "[INFO] Starting database backup: $BackupFile..." -ForegroundColor Cyan

$DbUrl = $env:SUPABASE_DB_URL
if (-not $DbUrl) {
    Write-Warning "SUPABASE_DB_URL environment variable is not defined."
    Write-Host "Set `$env:SUPABASE_DB_URL='postgresql://postgres:[password]@db.[ref].supabase.co:5432/postgres'" -ForegroundColor Yellow
    exit 1
}

try {
    & pg_dump $DbUrl --format=custom --blobs --verbose --no-owner --no-privileges --file=$BackupFile 2> $LogFile
    $FileItem = Get-Item $BackupFile
    $SizeMB = [math]::Round($FileItem.Length / 1MB, 2)
    Write-Host "[SUCCESS] Backup successfully created: $BackupFile ($SizeMB MB)" -ForegroundColor Green
} catch {
    Write-Error "[FAILED] Database backup encountered an error: $_"
}
