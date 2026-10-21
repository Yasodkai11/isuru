Add-Type -AssemblyName System.IO.Compression.FileSystem

$root = $PSScriptRoot | Split-Path -Parent
$sourceZipPath = Join-Path $root "isuru-gems-source-code.zip"

Write-Host "Creating clean source code zip..."

if (Test-Path $sourceZipPath) {
    [System.IO.File]::Delete($sourceZipPath)
}

$tempFolder = Join-Path $env:TEMP "isuru_source_$(Get-Random)"
New-Item -ItemType Directory -Path $tempFolder | Out-Null

$itemsToCopy = @(
    "src",
    "public",
    "scripts",
    "components",
    "supabase",
    "package.json",
    "package-lock.json",
    "next.config.ts",
    "tsconfig.json",
    "postcss.config.mjs",
    "eslint.config.mjs",
    "ecosystem.config.cjs",
    "server.js",
    ".htaccess.example",
    ".env.example",
    "HOSTINGER_DEPLOYMENT_GUIDE.md",
    "SEO-AUDIT-REPORT.md",
    "SEO-AUDIT.md",
    "SECURITY-AUDIT.md",
    "DATABASE-DATA-AUDIT.md",
    "AUDIT_REPORT.md",
    ".gitignore",
    "next-env.d.ts"
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
    Write-Host "Safeguard: Removed $($_.Name) from staging."
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
