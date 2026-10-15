Add-Type -AssemblyName System.IO.Compression.FileSystem

$root = $PSScriptRoot | Split-Path -Parent
$deployZipPath = Join-Path $root "isuru-gems-hostinger-deploy.zip"

Write-Host "Creating clean Hostinger deployment zip (without stale .next directory)..."

if (Test-Path $deployZipPath) {
    Remove-Item $deployZipPath -Force
}

$tempFolder = Join-Path $env:TEMP "isuru_deploy_$(Get-Random)"
New-Item -ItemType Directory -Path $tempFolder | Out-Null

# Items to include in the deployment package
$itemsToCopy = @(
    "src",
    "public",
    "components",
    "scripts",
    "supabase",
    "package.json",
    "package-lock.json",
    "server.js",
    "next.config.ts",
    "tsconfig.json",
    "postcss.config.mjs",
    "eslint.config.mjs",
    "ecosystem.config.cjs",
    ".htaccess.example",
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

# Verify .next and node_modules are NOT in tempFolder
Get-ChildItem -Path $tempFolder -Include "node_modules", ".next" -Recurse -Directory -Force -ErrorAction SilentlyContinue | ForEach-Object {
    Remove-Item -Path $_.FullName -Recurse -Force
    Write-Host "Safeguard: Removed $($_.Name) from deployment staging."
}

# Compress into isuru-gems-hostinger-deploy.zip
[System.IO.Compression.ZipFile]::CreateFromDirectory(
    $tempFolder,
    $deployZipPath,
    [System.IO.Compression.CompressionLevel]::Optimal,
    $false
)

Remove-Item -Path $tempFolder -Recurse -Force

$fileInfo = Get-Item $deployZipPath
$sizeMB = [math]::Round($fileInfo.Length / 1MB, 2)
Write-Host "Success: Created $deployZipPath ($sizeMB MB)"
