#!/usr/bin/env bash

echo "Starting RateSmart backend deployment..."
echo "Current working directory: $(pwd)"
echo "Directory contents: $(ls -la)"

# Change to the backend directory
cd backend
echo "Changed to backend directory: $(pwd)"
echo "Backend directory contents: $(ls -la)"

# List the inner backend directory
echo "Inner backend directory contents: $(ls -la backend/)"

# Start gunicorn with the correct module path
echo "Starting gunicorn with backend.wsgi:application"
exec gunicorn backend.wsgi:application --bind 0.0.0.0:$PORT --log-level debug