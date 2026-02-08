# Setup script for tambo-hackathon after cloning (PowerShell)

Write-Host "🚀 Setting up tambo-hackathon..." -ForegroundColor Cyan

# Check if node is installed
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js is not installed. Please install Node.js 18+ first." -ForegroundColor Red
    exit 1
}

# Install dependencies
Write-Host "`n📦 Installing dependencies..." -ForegroundColor Yellow
npm install

# Check if .env.local exists
if (-not (Test-Path ".env.local")) {
    Write-Host "`n📝 Creating .env.local from example..." -ForegroundColor Yellow
    Copy-Item example.env.local .env.local
    Write-Host "⚠️  Please edit .env.local and add your API keys!" -ForegroundColor Yellow
} else {
    Write-Host "`n✅ .env.local already exists" -ForegroundColor Green
}

# Verify environment variables
Write-Host "`n🔍 Checking environment variables..." -ForegroundColor Cyan
$envContent = Get-Content .env.local -ErrorAction SilentlyContinue
if ($envContent -match "your_tambo_api_key_here") {
    Write-Host "⚠️  WARNING: .env.local still has placeholder values!" -ForegroundColor Yellow
    Write-Host "   Please edit .env.local and add your actual API keys" -ForegroundColor Yellow
}

Write-Host "`n✅ Setup complete!" -ForegroundColor Green
Write-Host "`nNext steps:" -ForegroundColor Cyan
Write-Host "1. Edit .env.local with your API keys" -ForegroundColor White
Write-Host "2. Run: npm run dev" -ForegroundColor White
Write-Host "3. Visit: http://localhost:3000/study-genie" -ForegroundColor White
Write-Host ""

