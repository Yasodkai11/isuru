Add-Type -AssemblyName System.IO.Compression.FileSystem

$root = $PSScriptRoot | Split-Path -Parent
$deployZipPath = Join-Path $root "isuru-gems-hostinger-deploy.zip"

$zip = [System.IO.Compression.ZipFile]::OpenRead($deployZipPath)
Write-Host "Total entries in zip:" $zip.Entries.Count

$topLevel = $zip.Entries | ForEach-Object {
    $parts = $_.FullName -split '/'
    $parts[0]
} | Select-Object -Unique

Write-Host "Top level items:"
$topLevel | ForEach-Object { Write-Host " - $_" }

$zip.Dispose()
