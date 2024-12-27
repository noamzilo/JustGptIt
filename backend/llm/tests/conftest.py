import os
import sys
import django
from django.conf import settings

# Add the project root directory to Python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__))))

# Setup Django settings
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

# Remove the django_db_setup fixture - we'll let pytest-django handle the database setup