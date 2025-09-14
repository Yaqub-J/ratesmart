#!/usr/bin/env bash

# Change to the backend directory
cd backend

# Set the Python path to include the current directory
export PYTHONPATH="$(pwd):$PYTHONPATH"

# Start gunicorn
exec gunicorn backend.wsgi:application --bind 0.0.0.0:$PORT