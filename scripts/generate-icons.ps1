Add-Type -AssemblyName System.Drawing

$symbolPath = (Resolve-Path "public\isuru_images\logo-isuru-symbol.png").Path
$symbolImg = [System.Drawing.Image]::FromFile($symbolPath)

function Save-Square-Png([System.Drawing.Image]$src, [int]$size, [string]$outPath) {
    $bmp = [System.Drawing.Bitmap]::new($size, $size, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.Clear([System.Drawing.Color]::Transparent)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality

    $targetW = [Math]::Round($size * 0.90)
    $targetH = [Math]::Round($targetW * ($src.Height / $src.Width))
    $posX = [Math]::Round(($size - $targetW) / 2)
    $posY = [Math]::Round(($size - $targetH) / 2)

    $g.DrawImage($src, $posX, $posY, $targetW, $targetH)
    $g.Dispose()

    $bmp.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()
    Write-Host "Created $outPath ($size x $size)"
}

function Save-Ico([System.Drawing.Image]$src, [int]$size, [string]$outPath) {
    $bmp = [System.Drawing.Bitmap]::new($size, $size, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality

    $targetW = [Math]::Round($size * 0.90)
    $targetH = [Math]::Round($targetW * ($src.Height / $src.Width))
    $posX = [Math]::Round(($size - $targetW) / 2)
    $posY = [Math]::Round(($size - $targetH) / 2)

    $g.DrawImage($src, $posX, $posY, $targetW, $targetH)
    $g.Dispose()

    $hIcon = $bmp.GetHicon()
    $icon = [System.Drawing.Icon]::FromHandle($hIcon)
    $fs = [System.IO.File]::Create($outPath)
    $icon.Save($fs)
    $fs.Dispose()
    $icon.Dispose()
    $bmp.Dispose()
    Write-Host "Created $outPath ($size x $size ICO)"
}

Save-Square-Png $symbolImg 512 "src\app\icon.png"
Save-Square-Png $symbolImg 512 "public\icon.png"
Save-Square-Png $symbolImg 180 "src\app\apple-icon.png"
Save-Square-Png $symbolImg 180 "public\apple-icon.png"

Save-Ico $symbolImg 48 "src\app\favicon.ico"
Save-Ico $symbolImg 48 "public\favicon.ico"

$symbolImg.Dispose()
Write-Host "All icons generated successfully!"
