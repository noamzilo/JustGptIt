import os
from pathlib import Path

backend_version_name = "0.0.1"

def read_secret(name, default=None):
    return os.environ.get(name, default)

# Backend-specific secrets
GCP_SA_KEY = read_secret('GCP_SA_KEY')
GCP_PROJECT_ID = read_secret('GCP_PROJECT_ID')
GCP_CLOUD_RUN_SERVICE_ACCOUNT_NAME = read_secret('GCP_CLOUD_RUN_SERVICE_ACCOUNT_NAME')

# Add any other secrets here
