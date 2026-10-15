Add-Type -AssemblyName System.IO.Compression.FileSystem

$root = $PSScriptRoot | Split-Path -Parent
$standalonePath = Join-Path $root ".next\standalone"
$deployZipPath = Join-Path $root "isuru-gems-hostinger-deploy.zip"

Write-Host "Creating standalone deployment zip from $standalonePath..."

if (Test-Path $deployZipPath) {
    Remove-Item $deployZipPath -Force
}

[System.IO.Compression.ZipFile]::CreateFromDirectory(
    $standalonePath,
    $deployZipPath,
    [System.IO.Compression.CompressionLevel]::Optimal,
    $false
)

$fileInfo = Get-Item $deployZipPath
$sizeMB = [math]::Round($fileInfo.Length / 1MB, 2)
Write-Host "Success: Created $deployZipPath ($sizeMB MB)"
