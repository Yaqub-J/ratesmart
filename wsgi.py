"""
Root WSGI config for deployment on Render.

This file sets up Django directly without complex imports.
"""

import os
import sys

# Add the Django project directory to Python path
backend_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'backend_project')
sys.path.insert(0, backend_path)

# Set Django settings module for the inner backend project
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

# Import and configure Django
from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()