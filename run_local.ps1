# Quick script to run Next.js frontend locally (PowerShell)

Write-Host "🚀 Starting StudyGenie Frontend locally..." -ForegroundColor Cyan

# Check if node_modules exists
if (-not (Test-Path "node_modules")) {
    Write-Host "📥 Installing dependencies..." -ForegroundColor Yellow
    npm install
}

# Check for .env.local file
if (-not (Test-Path ".env.local")) {
    Write-Host "⚠️  .env.local file not found!" -ForegroundColor Yellow
    Write-Host "Creating .env.local from example..." -ForegroundColor Yellow
    
    if (Test-Path "example.env.local") {
        Copy-Item "example.env.local" ".env.local"
        Write-Host "✅ Created .env.local from example.env.local" -ForegroundColor Green
        Write-Host "⚠️  IMPORTANT: Update .env.local with:" -ForegroundColor Yellow
        Write-Host "   - NEXT_PUBLIC_STUDYGENIE_BACKEND_URL=http://localhost:5000" -ForegroundColor White
        Write-Host "   - Your MongoDB connection string" -ForegroundColor White
        Write-Host "   - Your API keys`n" -ForegroundColor White
    } else {
        @"
# MongoDB
MONGODB_URI="mongodb://localhost:27017/studygenie"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# Tambo AI
NEXT_PUBLIC_TAMBO_API_KEY=your_tambo_api_key_here

# StudyGenie Backend (LOCAL)
NEXT_PUBLIC_STUDYGENIE_BACKEND_URL=http://localhost:5000
"@ | Out-File -FilePath ".env.local" -Encoding utf8
        Write-Host "✅ Created .env.local file. Please update it!" -ForegroundColor Green
    }
}

# Check MongoDB connection
Write-Host "`n🔍 Checking MongoDB..." -ForegroundColor Cyan
try {
    $mongoUri = (Get-Content ".env.local" | Select-String "MONGODB_URI").ToString().Split("=")[1].Trim('"')
    Write-Host "   MongoDB URI: $mongoUri" -ForegroundColor White
} catch {
    Write-Host "   ⚠️  Could not read MongoDB URI from .env.local" -ForegroundColor Yellow
}

# Run the dev server
Write-Host "`n🌟 Starting Next.js dev server on http://localhost:3000" -ForegroundColor Green
Write-Host "Press Ctrl+C to stop`n" -ForegroundColor White
npm run dev

