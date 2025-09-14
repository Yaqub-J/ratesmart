#!/usr/bin/env bash
# Exit on error
set -o errexit

# Modify this line as needed for your package manager (pip, poetry, etc.)
pip install -r backend/requirements.txt

# Change to backend directory for Django commands
cd backend

# Add current directory to Python path for module imports
export PYTHONPATH="${PYTHONPATH}:$(pwd)"

# Convert static asset files
python manage.py collectstatic --no-input

# Apply any outstanding database migrations
python manage.py migrate

echo "Build completed successfully"
echo "Python path: $PYTHONPATH"
echo "Current directory: $(pwd)"
echo "Contents: $(ls -la)"