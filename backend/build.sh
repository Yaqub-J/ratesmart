#!/usr/bin/env bash
# Exit on error
set -o errexit

# Upgrade pip and setuptools
python -m pip install --upgrade pip setuptools wheel

# Install Python dependencies
pip install -r requirements.txt

# Download NLTK data required by TextBlob
python -m nltk.downloader punkt averaged_perceptron_tagger brown

# Create static directory if it doesn't exist
mkdir -p static

# Collect static files
python manage.py collectstatic --no-input

# Run migrations
python manage.py migrate