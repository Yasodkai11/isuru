Add-Type -AssemblyName System.IO.Compression.FileSystem

$root = $PSScriptRoot | Split-Path -Parent
$sourceZipPath = Join-Path $root "isuru-gems-source-code.zip"

Write-Host "Creating clean source code zip..."

if (Test-Path $sourceZipPath) {
    Remove-Item $sourceZipPath -Force
}

$tempFolder = Join-Path $env:TEMP "isuru_source_$(Get-Random)"
New-Item -ItemType Directory -Path $tempFolder | Out-Null

$itemsToCopy = @(
    "src",
    "public",
    "scripts",
    "package.json",
    "package-lock.json",
    "next.config.ts",
    "tsconfig.json",
    "postcss.config.mjs",
    "eslint.config.mjs",
    ".env.example",
    "HOSTINGER_DEPLOYMENT_GUIDE.md"
)

foreach ($item in $itemsToCopy) {
    $srcPath = Join-Path $root $item
    if (Test-Path $srcPath) {
        $destPath = Join-Path $tempFolder $item
        Copy-Item -Path $srcPath -Destination $destPath -Recurse -Force
    }
}

[System.IO.Compression.ZipFile]::CreateFromDirectory(
    $tempFolder,
    $sourceZipPath,
    [System.IO.Compression.CompressionLevel]::Optimal,
    $false
)

Remove-Item -Path $tempFolder -Recurse -Force

$fileInfo = Get-Item $sourceZipPath
$sizeMB = [math]::Round($fileInfo.Length / 1MB, 2)
Write-Host "Success: Created $sourceZipPath ($sizeMB MB)"
