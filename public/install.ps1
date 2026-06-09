# Odara CLI installer for Windows
#
#   irm https://odara.rs/install.ps1 | iex
#
# Env vars (optional):
#   ODARA_VERSION       Specific version (default: latest from odara.rs/version.txt)
#   ODARA_INSTALL_DIR   Install location (default: %LOCALAPPDATA%\Programs\Odara)
#   ODARA_RUN           "1" to launch Odara immediately after install
#
# This script bypasses Windows SmartScreen by:
#  - Running from memory (irm | iex), never written to disk
#  - Downloading the zip via System.Net.WebClient (no Mark-of-the-Web)
#  - Launching the .exe from the PowerShell process (no Explorer modal)

#requires -Version 5.1

$ErrorActionPreference = 'Stop'

# Force TLS 1.2 — some Win10 installs still default to 1.0/1.1 and Cloudflare rejects.
[Net.ServicePointManager]::SecurityProtocol = `
    [Net.ServicePointManager]::SecurityProtocol -bor [Net.SecurityProtocolType]::Tls12

# === Config ===
$BaseUrl    = 'https://pub-8227a3dbc0c64f88b0bbc027d1108f55.r2.dev/windows'
$VersionUrl = 'https://odara.rs/version.txt'
$Version    = if ($env:ODARA_VERSION) { $env:ODARA_VERSION } else { 'latest' }
$InstallDir = if ($env:ODARA_INSTALL_DIR) { $env:ODARA_INSTALL_DIR } else { Join-Path $env:LOCALAPPDATA 'Programs\Odara' }
$Run        = $env:ODARA_RUN -eq '1'
$Port       = 3002

# === Helpers ===
function Write-Step($m) { Write-Host "==> $m" -ForegroundColor Cyan }
function Write-OK($m)   { Write-Host "    $m" -ForegroundColor Green }
function Write-Fail($m) { Write-Host "ERROR: $m" -ForegroundColor Red }

# === Preflight ===
Write-Host ''
Write-Host '  Odara installer for Windows' -ForegroundColor Yellow
Write-Host ''

if ($env:PROCESSOR_ARCHITECTURE -ne 'AMD64') {
    Write-Fail "Architecture $env:PROCESSOR_ARCHITECTURE not supported. Only x64 (AMD64) is available right now."
    Write-Fail "ARM64 support is on the roadmap. Track at: https://github.com/coolsamu123/odara_community"
    exit 1
}

# === Resolve version ===
if ($Version -eq 'latest') {
    Write-Step 'Resolving latest version...'
    try {
        $Version = (New-Object System.Net.WebClient).DownloadString($VersionUrl).Trim()
    } catch {
        Write-Fail "Could not fetch $VersionUrl"
        Write-Fail "Workaround: rerun with `$env:ODARA_VERSION='X.Y.Z'; irm https://odara.rs/install.ps1 | iex"
        exit 1
    }
    if ([string]::IsNullOrWhiteSpace($Version)) {
        Write-Fail "version.txt is empty."
        exit 1
    }
}
Write-OK "Version: $Version"
Write-OK "Install dir: $InstallDir"

$ZipName = "odara_${Version}_windows_amd64.zip"
$ZipUrl  = "$BaseUrl/$ZipName"
$ShaUrl  = "$ZipUrl.sha256"

$TempDir = Join-Path $env:TEMP "odara-install-$([guid]::NewGuid().ToString('N').Substring(0,8))"
$null = New-Item -ItemType Directory -Path $TempDir -Force
$ZipPath = Join-Path $TempDir $ZipName
$ShaPath = "$ZipPath.sha256"

try {
    # === Download ===
    Write-Step "Downloading $ZipName (~95 MB, please wait)..."
    $wc = New-Object System.Net.WebClient
    try {
        $wc.DownloadFile($ZipUrl, $ZipPath)
        $wc.DownloadFile($ShaUrl, $ShaPath)
    } catch {
        Write-Fail "Download failed: $($_.Exception.Message)"
        Write-Fail "Check your internet connection or try ODARA_VERSION=0.1.0"
        exit 1
    }
    Write-OK 'Download complete.'

    # === Verify hash ===
    Write-Step 'Verifying SHA256...'
    $shaLine = (Get-Content $ShaPath -Raw).Trim()
    # Format: "<hash>  <filename>" (sha256sum -c compatible)
    $expected = ($shaLine -split '\s+')[0].ToLower()
    $actual   = (Get-FileHash -Path $ZipPath -Algorithm SHA256).Hash.ToLower()
    if ($expected -ne $actual) {
        Write-Fail "SHA256 mismatch."
        Write-Fail "  expected: $expected"
        Write-Fail "  actual:   $actual"
        Write-Fail 'Refusing to install a tampered package.'
        exit 1
    }
    Write-OK 'Hash verified.'

    # === Backup existing data/ (preserve SQLite DB across reinstalls) ===
    $DataBackup = $null
    $existingData = Join-Path $InstallDir 'data'
    if (Test-Path $existingData) {
        $hasFiles = (Get-ChildItem -Path $existingData -Recurse -File -ErrorAction SilentlyContinue | Select-Object -First 1)
        if ($hasFiles) {
            Write-Step 'Preserving existing data/ folder...'
            $DataBackup = Join-Path $TempDir 'data-backup'
            Move-Item -Path $existingData -Destination $DataBackup -Force
            Write-OK 'Backed up.'
        }
    }

    # === Extract ===
    Write-Step "Extracting to $InstallDir..."
    $ExtractDir = Join-Path $TempDir 'extract'
    Expand-Archive -Path $ZipPath -DestinationPath $ExtractDir -Force

    # The zip's internal root is "odara/" — move that to $InstallDir.
    if (Test-Path $InstallDir) {
        Remove-Item -Path $InstallDir -Recurse -Force
    }
    $ParentDir = Split-Path -Parent $InstallDir
    if (-not (Test-Path $ParentDir)) {
        $null = New-Item -ItemType Directory -Path $ParentDir -Force
    }
    Move-Item -Path (Join-Path $ExtractDir 'odara') -Destination $InstallDir -Force
    Write-OK 'Installed.'

    # === Restore data/ ===
    if ($DataBackup) {
        Write-Step 'Restoring data/...'
        $target = Join-Path $InstallDir 'data'
        Remove-Item -Path $target -Recurse -Force -ErrorAction SilentlyContinue
        Move-Item -Path $DataBackup -Destination $target -Force
        Write-OK 'Restored.'
    }

    # === Shim so `odara` works from any terminal with sane defaults ===
    $shimPath = Join-Path $InstallDir 'odara.cmd'
    $shim = @'
@echo off
"%~dp0Odara.exe" --port 3002 --host 0.0.0.0 --config "%~dp0odara.conf" %*
'@
    Set-Content -Path $shimPath -Value $shim -Encoding ASCII

    # === Add to PATH (user scope, no admin needed) ===
    Write-Step 'Adding to PATH (user scope)...'
    $userPath = [Environment]::GetEnvironmentVariable('PATH', 'User')
    if (-not $userPath) { $userPath = '' }
    $entries = $userPath.Split(';') | Where-Object { $_ -ne '' }
    $alreadyOnPath = $false
    foreach ($e in $entries) {
        if ($e.TrimEnd('\') -ieq $InstallDir.TrimEnd('\')) {
            $alreadyOnPath = $true
            break
        }
    }
    if (-not $alreadyOnPath) {
        $newPath = if ($entries) { ($entries + $InstallDir) -join ';' } else { $InstallDir }
        [Environment]::SetEnvironmentVariable('PATH', $newPath, 'User')
        Write-OK 'PATH updated.'
    } else {
        Write-OK 'Already on PATH.'
    }

    # === Done ===
    Write-Host ''
    Write-Host "  Odara $Version installed at $InstallDir" -ForegroundColor Green
    Write-Host ''
    Write-Host '  Open a NEW terminal and run:' -ForegroundColor Yellow
    Write-Host '      odara' -ForegroundColor White
    Write-Host ''
    Write-Host "  Then open: http://localhost:$Port" -ForegroundColor Yellow
    Write-Host ''

    if ($Run) {
        Write-Step 'Launching now...'
        $exe = Join-Path $InstallDir 'Odara.exe'
        $conf = Join-Path $InstallDir 'odara.conf'
        Start-Process -FilePath $exe -ArgumentList @('--port', "$Port", '--host', '0.0.0.0', '--config', $conf) | Out-Null
        Start-Sleep -Seconds 2
        Start-Process "http://localhost:$Port"
    }
} finally {
    if (Test-Path $TempDir) {
        Remove-Item -Path $TempDir -Recurse -Force -ErrorAction SilentlyContinue
    }
}
