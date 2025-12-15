# M&A Collections - Automated Clone and Setup Script
# For collaborators/testers who just cloned the repository

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  M&A Collections - Setup Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if we're in the right directory
if (!(Test-Path "mariem-store") -or !(Test-Path "mariem-store-storefront")) {
    Write-Host "ERROR: This script must be run from the project root directory!" -ForegroundColor Red
    Write-Host "Current directory: $PWD" -ForegroundColor Yellow
    Write-Host "Please run: cd ma-collections" -ForegroundColor Yellow
    exit 1
}

# Function to check if a command exists
function Test-CommandExists {
    param($command)
    $null = Get-Command $command -ErrorAction SilentlyContinue
    return $?
}

Write-Host "Step 1: Checking Prerequisites..." -ForegroundColor Yellow
Write-Host "-----------------------------------" -ForegroundColor Gray

# Check Node.js
if (Test-CommandExists "node") {
    $nodeVersion = node --version
    Write-Host "[✓] Node.js installed: $nodeVersion" -ForegroundColor Green
} else {
    Write-Host "[✗] Node.js not found! Please install Node.js 20.x" -ForegroundColor Red
    Write-Host "    Download: https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

# Check npm
if (Test-CommandExists "npm") {
    $npmVersion = npm --version
    Write-Host "[✓] npm installed: v$npmVersion" -ForegroundColor Green
} else {
    Write-Host "[✗] npm not found!" -ForegroundColor Red
    exit 1
}

# Check PostgreSQL
if (Test-CommandExists "psql") {
    $pgVersion = psql --version
    Write-Host "[✓] PostgreSQL installed: $pgVersion" -ForegroundColor Green
} else {
    Write-Host "[!] PostgreSQL not found in PATH" -ForegroundColor Yellow
    Write-Host "    If PostgreSQL is installed, make sure it's in your PATH" -ForegroundColor Yellow
    Write-Host "    Otherwise, download from: https://www.postgresql.org/download/" -ForegroundColor Yellow
    
    $continue = Read-Host "Continue anyway? (y/n)"
    if ($continue -ne "y") {
        exit 1
    }
}

Write-Host ""
Write-Host "Step 2: Setting up PostgreSQL Database..." -ForegroundColor Yellow
Write-Host "-----------------------------------" -ForegroundColor Gray

$dbName = Read-Host "Enter database name (default: medusa-store)"
if ([string]::IsNullOrWhiteSpace($dbName)) {
    $dbName = "medusa-store"
}

$dbUser = Read-Host "Enter PostgreSQL username (default: postgres)"
if ([string]::IsNullOrWhiteSpace($dbUser)) {
    $dbUser = "postgres"
}

$dbPassword = Read-Host "Enter PostgreSQL password" -AsSecureString
$dbPasswordPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
    [Runtime.InteropServices.Marshal]::SecureStringToBSTR($dbPassword)
)

Write-Host "Creating database '$dbName'..." -ForegroundColor Cyan

# Set PGPASSWORD for psql commands
$env:PGPASSWORD = $dbPasswordPlain

# Create database
$createDbCmd = "CREATE DATABASE `"$dbName`";"
echo $createDbCmd | psql -U $dbUser -h localhost -p 5432 postgres 2>$null

if ($LASTEXITCODE -eq 0) {
    Write-Host "[✓] Database created successfully" -ForegroundColor Green
} else {
    Write-Host "[!] Database might already exist (this is OK)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Step 3: Configuring Backend (.env)..." -ForegroundColor Yellow
Write-Host "-----------------------------------" -ForegroundColor Gray

$backendEnvPath = "mariem-store\.env"

if (Test-Path $backendEnvPath) {
    Write-Host "[!] .env file already exists. Backing up..." -ForegroundColor Yellow
    Copy-Item $backendEnvPath "$backendEnvPath.backup"
}

# Generate JWT secret
$jwtSecret = -join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | ForEach-Object {[char]$_})
$cookieSecret = -join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | ForEach-Object {[char]$_})

$backendEnvContent = @"
# Database Configuration
DATABASE_URL=postgres://${dbUser}:${dbPasswordPlain}@localhost:5432/${dbName}

# Redis (optional for development)
REDIS_URL=redis://localhost:6379

# Server Configuration
PORT=9000

# JWT Secrets
JWT_SECRET=$jwtSecret
COOKIE_SECRET=$cookieSecret

# Store Configuration
STORE_CORS=http://localhost:8000

# Admin Configuration
ADMIN_CORS=http://localhost:7001
"@

Set-Content -Path $backendEnvPath -Value $backendEnvContent -Encoding UTF8
Write-Host "[✓] Backend .env file created" -ForegroundColor Green

Write-Host ""
Write-Host "Step 4: Configuring Frontend (.env.local)..." -ForegroundColor Yellow
Write-Host "-----------------------------------" -ForegroundColor Gray

$frontendEnvPath = "mariem-store-storefront\.env.local"

if (Test-Path $frontendEnvPath) {
    Write-Host "[!] .env.local file already exists. Backing up..." -ForegroundColor Yellow
    Copy-Item $frontendEnvPath "$frontendEnvPath.backup"
}

$frontendEnvContent = @"
NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000
NEXT_PUBLIC_BASE_URL=http://localhost:8000
NEXT_PUBLIC_DEFAULT_REGION=tn
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_01JFBR4K9VXQZ8N2Y3W5T6P7M8
REVALIDATE_SECRET=supersecret
"@

Set-Content -Path $frontendEnvPath -Value $frontendEnvContent -Encoding UTF8
Write-Host "[✓] Frontend .env.local file created" -ForegroundColor Green

Write-Host ""
Write-Host "Step 5: Installing Backend Dependencies..." -ForegroundColor Yellow
Write-Host "-----------------------------------" -ForegroundColor Gray

Set-Location mariem-store
Write-Host "Running npm install..." -ForegroundColor Cyan
npm install

if ($LASTEXITCODE -eq 0) {
    Write-Host "[✓] Backend dependencies installed" -ForegroundColor Green
} else {
    Write-Host "[✗] Failed to install backend dependencies" -ForegroundColor Red
    Set-Location ..
    exit 1
}

Write-Host ""
Write-Host "Step 6: Running Database Migrations..." -ForegroundColor Yellow
Write-Host "-----------------------------------" -ForegroundColor Gray

Write-Host "Running migrations..." -ForegroundColor Cyan
npm run db:migrate

if ($LASTEXITCODE -eq 0) {
    Write-Host "[✓] Migrations completed" -ForegroundColor Green
} else {
    Write-Host "[✗] Migration failed" -ForegroundColor Red
    Set-Location ..
    exit 1
}

Write-Host ""
Write-Host "Step 7: Seeding Database..." -ForegroundColor Yellow
Write-Host "-----------------------------------" -ForegroundColor Gray

Write-Host "Creating sample products and data..." -ForegroundColor Cyan
npm run seed

if ($LASTEXITCODE -eq 0) {
    Write-Host "[✓] Database seeded successfully" -ForegroundColor Green
} else {
    Write-Host "[!] Seeding failed or partially completed" -ForegroundColor Yellow
}

Set-Location ..

Write-Host ""
Write-Host "Step 8: Installing Frontend Dependencies..." -ForegroundColor Yellow
Write-Host "-----------------------------------" -ForegroundColor Gray

Set-Location mariem-store-storefront
Write-Host "Running npm install..." -ForegroundColor Cyan
npm install

if ($LASTEXITCODE -eq 0) {
    Write-Host "[✓] Frontend dependencies installed" -ForegroundColor Green
} else {
    Write-Host "[✗] Failed to install frontend dependencies" -ForegroundColor Red
    Set-Location ..
    exit 1
}

Set-Location ..

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  ✓ Setup Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Start the Backend:" -ForegroundColor Yellow
Write-Host "   cd mariem-store" -ForegroundColor White
Write-Host "   npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "2. In a NEW terminal, start the Frontend:" -ForegroundColor Yellow
Write-Host "   cd mariem-store-storefront" -ForegroundColor White
Write-Host "   npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "3. Open your browser:" -ForegroundColor Yellow
Write-Host "   http://localhost:8000" -ForegroundColor White
Write-Host ""
Write-Host "Admin Panel (optional):" -ForegroundColor Yellow
Write-Host "   http://localhost:9000/app" -ForegroundColor White
Write-Host "   Email: admin@medusa-test.com" -ForegroundColor White
Write-Host "   Password: supersecret" -ForegroundColor White
Write-Host ""
Write-Host "Enjoy testing M&A Collections! 🎉" -ForegroundColor Magenta
Write-Host ""

# Clean up
Remove-Variable dbPasswordPlain -ErrorAction SilentlyContinue
$env:PGPASSWORD = $null
