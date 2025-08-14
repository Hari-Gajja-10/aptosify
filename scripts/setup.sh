#!/bin/bash

echo "🎵 Setting up Aptos Music Platform..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18 or higher."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm."
    exit 1
fi

# Check if Aptos CLI is installed
if ! command -v aptos &> /dev/null; then
    echo "⚠️  Aptos CLI is not installed. Installing..."
    curl -fsSL "https://aptos.dev/scripts/install_cli.py" | python3
fi

echo "📦 Installing dependencies..."

# Install root dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..

# Install backend dependencies
cd backend
npm install
cd ..

echo "🔧 Setting up environment..."

# Copy environment file if it doesn't exist
if [ ! -f .env ]; then
    cp .env.example .env
    echo "✅ Created .env file from .env.example"
    echo "📝 Please edit .env file with your configuration"
fi

echo "🏗️  Building contracts..."

# Build Move contracts
cd contracts
aptos move compile
cd ..

echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit .env file with your configuration"
echo "2. Run 'npm run deploy' to deploy the smart contract"
echo "3. Run 'npm run dev' to start the development servers"
echo ""
echo "The application will be available at:"
echo "- Frontend: http://localhost:3000"
echo "- Backend API: http://localhost:3001"