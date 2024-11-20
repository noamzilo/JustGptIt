import os
import sys

backend_version_name = "0.1.0"

# Paths to secret and env files
secret_file_path = os.path.expanduser("~/src/personal_website/backend/.secrets_backend")
env_file_path = os.path.expanduser("~/src/personal_website/backend/.env")

def parse_env_file(file_path):
    """
    Parses an environment file and returns a dictionary of key-value pairs.
    Ignores comments and empty lines.
    """
    env_vars = {}
    try:
        with open(file_path, "r") as f:
            for line in f:
                line = line.strip()
                if not line or line.startswith("#"):
                    continue
                if "=" in line:
                    key, value = line.split("=", 1)
                    env_vars[key.strip()] = clean_value(value.strip())
    except FileNotFoundError:
        print(f"{file_path} not found.", file=sys.stderr)
    return env_vars

def clean_value(value):
    """
    Cleans the environment variable value by removing surrounding quotes.
    """
    return value.replace('"', "").replace("'", "")

# Load environment variables from .env file into os.environ
if os.path.isfile(env_file_path):
    print(f"Reading environment variables from {env_file_path}", file=sys.stderr)
    env_vars = parse_env_file(env_file_path)
    os.environ.update(env_vars)

# Load secrets from .secrets_backend file into a dictionary
secrets = {}
if os.path.isfile(secret_file_path):
    secrets = parse_env_file(secret_file_path)
else:
    print(".secrets file not found", file=sys.stderr)  # Production environment

def read_env_variable(name, default=None):
    """
    Reads an environment variable with the following priority:
    1. os.environ
    2. secrets dictionary
    If not found, returns the default value.
    Cleans the value by removing quotes.
    """
    value = os.environ.get(name)
    source = "os.environ"
    if value is None:
        value = secrets.get(name)
        source = ".secrets_backend" if value is not None else None
    if value is not None:
        print(f"Environment variable {name}: [SET] (from {source})", file=sys.stderr)
    else:
        print(f"Environment variable {name}: [NOT SET]", file=sys.stderr)
    return value if value is not None else default

# Environment variables
PORT = int(read_env_variable("PORT", 8080))
DJANGO_SECRET_KEY = read_env_variable('DJANGO_SECRET_KEY', 'DJANGO_SECRET_KEY_NOT_READ_PROPERLY')
DEBUG = read_env_variable('DEBUG', 'False') == 'True'
LOG_LEVEL = 'DEBUG' if DEBUG else 'INFO'
USE_GCS = read_env_variable('USE_GCS', 'True') == 'True'

# CORS_ALLOWED_ORIGINS processing
CORS_ALLOWED_ORIGINS_ORIG = read_env_variable('CORS_ALLOWED_ORIGINS', None)
if not CORS_ALLOWED_ORIGINS_ORIG:
    raise ValueError("CORS_ALLOWED_ORIGINS environment variable is not set.")

CORS_ALLOWED_ORIGINS_ORIG = clean_value(CORS_ALLOWED_ORIGINS_ORIG)
CORS_ALLOWED_ORIGINS = [origin.strip() for origin in CORS_ALLOWED_ORIGINS_ORIG.split(',') if origin.strip()]
if not CORS_ALLOWED_ORIGINS:
    raise ValueError("CORS_ALLOWED_ORIGINS environment variable is not set or empty.")

print(f"DJANGO_SECRET_KEY is set: {'Yes' if DJANGO_SECRET_KEY else 'No'}", file=sys.stderr)
print(f"DEBUG: {DEBUG}", file=sys.stderr)

# Backend-specific secrets
GCP_SA_KEY = read_env_variable('GCP_SA_KEY')
GCP_PROJECT_ID = read_env_variable('GCP_PROJECT_ID')
GCP_CLOUD_RUN_SERVICE_ACCOUNT_NAME = read_env_variable('GCP_CLOUD_RUN_SERVICE_ACCOUNT_NAME')

DEPLOY_TIME = read_env_variable('DEPLOY_TIME', 'UNKNOWN DEPLOY TIME')
try:
    with open("/build_artifacts/build_time.txt", "r") as f:  # Created during docker build
        BUILD_TIME = f.read().strip()
except FileNotFoundError:
    BUILD_TIME = 'Build time not available'

# Not supported yet
GS_BUCKET_NAME = read_env_variable('GS_BUCKET_NAME', 'GS_BUCKET_NAME NOT READ PROPERLY')
URLDAY_API_KEY = read_env_variable('URLDAY_API_KEY', 'URLDAY_API_KEY NOT READ PROPERLY')

SUPABASE_API_KEY = read_env_variable('SUPABASE_API_KEY', 'SUPABASE_API_KEY NOT READ PROPERLY')
SUPABASE_PROJECT_URL = read_env_variable('SUPABASE_PROJECT_URL', 'SUPABASE_PROJECT_URL NOT READ PROPERLY')
SUPABASE_POSTGRESQL_CONNECTION_STRING = read_env_variable(
    'SUPABASE_POSTGRESQL_CONNECTION_STRING', 
    'SUPABASE_POSTGRESQL_CONNECTION_STRING NOT READ PROPERLY'
)
