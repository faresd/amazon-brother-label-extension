$ErrorActionPreference = 'Stop'

$source = Join-Path $PSScriptRoot '..\address-62mm-bottom-code128.lbx'
$destinationDirectory = 'C:\Users\Public\Documents\Chlabs\AmazonBrotherPackageLabel'
$destination = Join-Path $destinationDirectory 'address-62mm-bottom-code128.lbx'

if (-not (Test-Path -LiteralPath $source -PathType Leaf)) {
  throw "The P-touch template was not found beside this installer: $source"
}

New-Item -ItemType Directory -Force -Path $destinationDirectory | Out-Null
Copy-Item -LiteralPath $source -Destination $destination -Force

Write-Host ''
Write-Host 'Amazon Brother Package Label setup is ready.' -ForegroundColor Green
Write-Host "Template installed at: $destination"
Write-Host ''
Write-Host 'Required Brother software (install from Brother):'
Write-Host '  1. b-PAC Client Component 3.4 or later'
Write-Host '  2. Brother b-PAC Extension for Chrome/Brave'
Write-Host ''
Write-Host 'For a local extension install, open brave://extensions, enable Developer mode,'
Write-Host 'choose Load unpacked, and select the extracted package folder.'
