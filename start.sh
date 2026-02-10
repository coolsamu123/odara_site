#!/bin/bash

# Odara Site - Start Script
# Starts the Vite development server

cd "$(dirname "$0")"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

# Check if already running
if [ -f ".server.pid" ]; then
    PID=$(cat .server.pid)
    if ps -p $PID > /dev/null 2>&1; then
        echo "Server is already running (PID: $PID)"
        echo "Access at: http://localhost:5173"
        exit 0
    else
        rm .server.pid
    fi
fi

echo "Starting Odara site..."
nohup npm run dev -- --host > .server.log 2>&1 &
echo $! > .server.pid

sleep 2

if [ -f ".server.pid" ] && ps -p $(cat .server.pid) > /dev/null 2>&1; then
    echo "Server started successfully (PID: $(cat .server.pid))"
    echo ""
    echo "Access at:"
    echo "  Local:   http://localhost:5173"
    echo "  Network: http://$(hostname -I | awk '{print $1}'):5173"
    echo ""
    echo "To stop: ./stop.sh"
else
    echo "Failed to start server. Check .server.log for details."
    exit 1
fi
