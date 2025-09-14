#!/usr/bin/env bash

# Enable error handling
set -e
trap 'echo "❌ Error on line $LINENO. Exit code: $?"' ERR

echo "🚀 Starting Django application..."

# Set the port from environment variable or default
PORT=${PORT:-8000}

# Start Gunicorn
echo "🌟 Starting Gunicorn server on port $PORT..."
gunicorn backend.wsgi:application \
    --bind 0.0.0.0:$PORT \
    --workers 3 \
    --threads 2 \
    --timeout 120 \
    --access-logfile - \
    --error-logfile - \
    --capture-output \
    --enable-stdio-inheritance