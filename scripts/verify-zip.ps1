Add-Type -AssemblyName System.IO.Compression.FileSystem

$root = $PSScriptRoot | Split-Path -Parent
$zips = @("isuru-gems-hostinger-deploy.zip", "isuru-gems-source-code.zip")

foreach ($zipName in $zips) {
    $zipPath = Join-Path $root $zipName
    if (-not (Test-Path $zipPath)) {
        Write-Host "File not found: $zipPath"
        continue
    }
    $info = Get-Item $zipPath
    $sizeMB = [math]::Round($info.Length / 1MB, 2)
    Write-Host "=== $zipName ($sizeMB MB) ==="
    $zip = [System.IO.Compression.ZipFile]::OpenRead($zipPath)
    Write-Host "Total entries: $($zip.Entries.Count)"
    $topLevel = $zip.Entries | ForEach-Object {
        $parts = $_.FullName -split '[\\/]'
        if ($parts.Length -eq 1) {
            "(File) " + $parts[0]
        } else {
            "(Dir)  " + $parts[0]
        }
    } | Select-Object -Unique
    $topLevel | ForEach-Object { Write-Host "  $_" }
    $zip.Dispose()
    Write-Host ""
}
