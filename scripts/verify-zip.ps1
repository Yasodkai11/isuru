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
    $zipArchive = [System.IO.Compression.ZipFile]::OpenRead($zipPath)
    Write-Host "Total entries: $($zipArchive.Entries.Count)"
    
    $hasDotNext = $zipArchive.Entries | Where-Object { $_.FullName -like ".next*" }
    if ($hasDotNext) {
        Write-Host "  WARNING: Contains .next directory!"
    } else {
        Write-Host "  SUCCESS: Stale .next directory is NOT present."
    }

    $entry = $zipArchive.GetEntry("package.json")
    if ($entry) {
        $stream = $entry.Open()
        $reader = New-Object System.IO.StreamReader($stream)
        $json = $reader.ReadToEnd() | ConvertFrom-Json
        $reader.Dispose()
        $stream.Dispose()
        Write-Host "  package.json -> start: '$($json.scripts.start)'"
        Write-Host "  package.json -> serve: '$($json.scripts.serve)'"
    }

    $topLevel = $zipArchive.Entries | ForEach-Object {
        $parts = $_.FullName -split '[\\/]'
        if ($parts.Length -eq 1) {
            "(File) " + $parts[0]
        } else {
            "(Dir)  " + $parts[0]
        }
    } | Select-Object -Unique
    $topLevel | ForEach-Object { Write-Host "    $_" }
    $zipArchive.Dispose()
    Write-Host ""
}
