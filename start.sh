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

# Activate virtual environment if it exists
if [ -d ".venv" ]; then
    echo "Activating virtual environment from .venv"
    source .venv/bin/activate
elif [ -d "venv" ]; then
    echo "Activating virtual environment from venv"
    source venv/bin/activate
else
    echo "No virtual environment found, proceeding without activation"
fi

# Add current directory to Python path to ensure modules can be found
export PYTHONPATH="$PYTHONPATH:$(pwd)"
echo "PYTHONPATH set to: $PYTHONPATH"

# Start gunicorn with the correct module path
echo "Starting gunicorn with backend.wsgi:application"
exec gunicorn backend.wsgi:application --bind 0.0.0.0:$PORT --log-level debug