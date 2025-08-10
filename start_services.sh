#!/bin/bash

# Benotia - Start Both Services
echo "🚀 Starting Benotia Skin Analysis Platform..."

# Function to check if a port is in use
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null ; then
        echo "❌ Port $1 is already in use"
        return 1
    else
        echo "✅ Port $1 is available"
        return 0
    fi
}

# Check if ports are available
echo "🔍 Checking port availability..."
if ! check_port 8000; then
    echo "Please stop the service using port 8000 and try again"
    exit 1
fi

if ! check_port 3000; then
    echo "Please stop the service using port 3000 and try again"
    exit 1
fi

# Start backend
echo "🐍 Starting Backend (FastAPI) on port 8000..."
cd "$(dirname "$0")/backend"
if [ ! -d ".venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv .venv
fi

echo "🔧 Activating virtual environment..."
source .venv/bin/activate

echo "📥 Installing Python dependencies..."
pip install -r requirements.txt

echo "🚀 Starting backend server..."
uvicorn app.main:app --reload --port 8000 &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

# Start frontend
echo "⚛️  Starting Frontend (React) on port 3000..."
cd "$(dirname "$0")/analysis-app"

if [ ! -d "node_modules" ]; then
    echo "📦 Installing Node.js dependencies..."
    npm install
fi

echo "🚀 Starting frontend server..."
npm run dev &
FRONTEND_PID=$!

echo ""
echo "🎉 Benotia is starting up!"
echo "📱 Frontend: http://localhost:3000"
echo "🔧 Backend API: http://localhost:8000"
echo "📚 API Docs: http://localhost:8000/docs"
echo ""
echo "Press Ctrl+C to stop both services"

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping services..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo "✅ Services stopped"
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Wait for both processes
wait
