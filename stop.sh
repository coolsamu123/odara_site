#!/bin/bash

# Odara Site - Stop Script
# Stops the Vite development server

cd "$(dirname "$0")"

if [ -f ".server.pid" ]; then
    PID=$(cat .server.pid)
    if ps -p $PID > /dev/null 2>&1; then
        echo "Stopping server (PID: $PID)..."
        kill $PID
        sleep 1

        # Force kill if still running
        if ps -p $PID > /dev/null 2>&1; then
            kill -9 $PID
        fi

        rm .server.pid
        echo "Server stopped."
    else
        echo "Server not running (stale PID file)."
        rm .server.pid
    fi
else
    # Try to find and kill any running vite process for this project
    PIDS=$(pgrep -f "vite.*odara_site" 2>/dev/null)
    if [ -n "$PIDS" ]; then
        echo "Found running server processes: $PIDS"
        echo "Stopping..."
        kill $PIDS 2>/dev/null
        sleep 1
        echo "Server stopped."
    else
        echo "Server is not running."
    fi
fi
