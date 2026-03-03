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
        PORT=$(grep -oP 'Local:\s+http://localhost:\K[0-9]+' .server.log 2>/dev/null | head -1)
        PORT=${PORT:-5173}
        echo "Server is already running (PID: $PID)"
        echo "  Frontend: http://$(hostname -I | awk '{print $1}'):$PORT"
        exit 0
    else
        rm .server.pid
    fi
fi

echo "Starting Odara site..."
nohup npx vite --host > .server.log 2>&1 &
echo $! > .server.pid

# Wait for vite to be ready (up to 10s)
for i in $(seq 1 20); do
    if grep -q "Local:" .server.log 2>/dev/null; then
        break
    fi
    sleep 0.5
done

if [ -f ".server.pid" ] && ps -p $(cat .server.pid) > /dev/null 2>&1; then
    # Read the actual port from the log
    PORT=$(grep -oP 'Local:\s+http://localhost:\K[0-9]+' .server.log | head -1)
    PORT=${PORT:-5173}
    echo "Server started successfully (PID: $(cat .server.pid))"
    echo ""
    echo "  Frontend: http://$(hostname -I | awk '{print $1}'):$PORT"
    echo ""
    echo "To stop: ./stop.sh"
else
    echo "Failed to start server. Check .server.log for details."
    exit 1
fi
