"""
WSGI application for Render deployment.
This provides the backend.wsgi module that Render is trying to import.
"""

import os
import sys

# Add the Django project directory to Python path FIRST
backend_project_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'backend_project')
sys.path.insert(0, backend_project_dir)

# Set Django settings module (will resolve to backend_project/django_backend/settings.py)
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'django_backend.settings')

# Import and configure Django
from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()