#!/usr/bin/env bash

echo "🚀 Starting build process..."

# Enable error handling
set -e
trap 'echo "❌ Error on line $LINENO. Exit code: $?"' ERR

# Create necessary directories
echo "📁 Creating necessary directories..."
mkdir -p static media logs

# Install Python dependencies (skip pip upgrade in CI/CD)
echo "📦 Installing Python dependencies..."
pip install -r requirements.txt

# Download NLTK data required by TextBlob
echo "📚 Downloading NLTK data..."
python -m nltk.downloader -q punkt averaged_perceptron_tagger brown

# Verify Django configuration
echo "🔍 Verifying Django configuration..."
python manage.py check --deploy

# Collect static files
echo "📝 Collecting static files..."
python manage.py collectstatic --no-input --clear

# Run migrations
echo "🔄 Running database migrations..."
python manage.py migrate --no-input

# Create superuser if environment variables are set
if [ -n "$DJANGO_SUPERUSER_EMAIL" ] && [ -n "$DJANGO_SUPERUSER_PASSWORD" ]; then
    echo "👤 Creating superuser..."
    python manage.py shell -c "
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(email='$DJANGO_SUPERUSER_EMAIL').exists():
    User.objects.create_superuser(email='$DJANGO_SUPERUSER_EMAIL', password='$DJANGO_SUPERUSER_PASSWORD')
    print('Superuser created successfully')
else:
    print('Superuser already exists')
"
fi

echo "✅ Build process completed successfully!"