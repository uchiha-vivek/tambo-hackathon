#!/bin/bash
# Setup script for tambo-hackathon after cloning

echo "🚀 Setting up tambo-hackathon..."

# Check if node is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "📝 Creating .env.local from example..."
    cp example.env.local .env.local
    echo "⚠️  Please edit .env.local and add your API keys!"
else
    echo "✅ .env.local already exists"
fi

# Verify environment variables
echo "🔍 Checking environment variables..."
if grep -q "your_tambo_api_key_here" .env.local 2>/dev/null; then
    echo "⚠️  WARNING: .env.local still has placeholder values!"
    echo "   Please edit .env.local and add your actual API keys"
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit .env.local with your API keys"
echo "2. Run: npm run dev"
echo "3. Visit: http://localhost:3000/study-genie"
echo ""

