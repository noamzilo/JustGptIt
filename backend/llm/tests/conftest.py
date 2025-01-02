import os
import sys
import pytest
import django
from django.db import connections

# Add the project root directory to Python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__))))

# Setup Django settings
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

@pytest.fixture(autouse=True)
def close_db_connections():
    try:
        yield  # Run the test
    finally:
        for conn in connections.all():
            conn.close()