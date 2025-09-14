"""
Root WSGI config for deployment on Render.

This file imports the Django WSGI application from the backend directory.
"""

import os
import sys

# Add the backend directory to Python path
backend_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'backend')
sys.path.insert(0, backend_path)

# Import the Django WSGI application from backend
from backend.wsgi import application