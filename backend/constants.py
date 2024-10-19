import os
import sys

backend_version_name = "0.0.2"

def read_env_variable(name, default=None):
    value = os.environ.get(name, default)
    print(f"Environment variable {name}: {'[SET]' if value is not None else '[NOT SET]'}", file=sys.stderr)
    return value
    
# Environment variables
PORT = int(read_env_variable("PORT", 8080))
DJANGO_SECRET_KEY = read_env_variable('DJANGO_SECRET_KEY', 'DJANGO_SECRET_KEY_NOT_READ_PROPERLY')
DEBUG = read_env_variable('DEBUG', 'False') == 'True'
LOG_LEVEL = 'DEBUG' if DEBUG else 'INFO'
USE_GCS = read_env_variable('USE_GCS', 'True') == 'True'

print(f"DJANGO_SECRET_KEY is set: {'Yes' if DJANGO_SECRET_KEY else 'No'}", file=sys.stderr)
print(f"DEBUG: {DEBUG}", file=sys.stderr)


# Backend-specific secrets
GCP_SA_KEY = read_env_variable('GCP_SA_KEY')
GCP_PROJECT_ID = read_env_variable('GCP_PROJECT_ID')
GCP_CLOUD_RUN_SERVICE_ACCOUNT_NAME = read_env_variable('GCP_CLOUD_RUN_SERVICE_ACCOUNT_NAME')

# Not supported yet
GS_BUCKET_NAME = read_env_variable('GS_BUCKET_NAME', 'your-gcs-bucket-name')

