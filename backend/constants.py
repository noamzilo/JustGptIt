import os
import sys
from llm.version import version as llm_version

backend_version_name = llm_version

# Paths to secret and env files
SECRET_FILE_PATH = os.path.expanduser("~/src/justgptit/backend/.secrets_backend") 
ENV_FILE_PATH = os.path.expanduser("~/src/justgptit/backend/.env")

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
                    env_vars[key.strip()] = value.strip()
    except FileNotFoundError:
        print(f"{file_path} not found.", file=sys.stderr)
    return env_vars

def clean_value(value):
    """
    Cleans the environment variable value by removing surrounding quotes.
    """
    return value.replace('"', "").replace("'", "")

# Step 1: Parse all sources
env_file_vars = parse_env_file(ENV_FILE_PATH)
secret_file_vars = parse_env_file(SECRET_FILE_PATH)
os_env_vars = dict(os.environ)  # Capture current environment variables

# Step 2: Merge variables with correct priority
# Priority: os.environ > env_file_vars > secret_file_vars
merged_vars = {**secret_file_vars, **env_file_vars, **os_env_vars}

# Step 3: Clean all values
cleaned_vars = {key: clean_value(value) for key, value in merged_vars.items()}

# Step 4: Update os.environ with cleaned variables
os.environ.update(cleaned_vars)

def read_env_variable(name, default=None):
    """
    Reads an environment variable from os.environ.
    If not found, returns the default value.
    """
    value = os.environ.get(name, default)
    if value is not None:
        print(f"Environment variable {name}: [SET]", file=sys.stderr)
    else:
        print(f"Environment variable {name}: [NOT SET]", file=sys.stderr)
    return value

# Environment variables
PORT = int(read_env_variable("PORT", 8080))
DJANGO_SECRET_KEY = read_env_variable('DJANGO_SECRET_KEY', 'DJANGO_SECRET_KEY_NOT_READ_PROPERLY')
DEBUG = read_env_variable('DEBUG', 'False') == 'True'
LOG_LEVEL = 'DEBUG' if DEBUG else 'INFO'
USE_GCS = read_env_variable('USE_GCS', 'True') == 'True'
OPENAI_API_KEY = read_env_variable('OPENAI_API_KEY', 'OPENAI_API_KEY_COULD_NOT_BE_READ_PROPERLY')

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

SUPABASE_API_KEY = read_env_variable('SUPABASE_API_KEY', 'SUPABASE_API_KEY NOT READ_PROPERLY')
SUPABASE_PROJECT_URL = read_env_variable('SUPABASE_PROJECT_URL', 'SUPABASE_PROJECT_URL NOT READ_PROPERLY')
SUPABASE_POSTGRESQL_CONNECTION_STRING = read_env_variable(
    'SUPABASE_POSTGRESQL_CONNECTION_STRING', 
    'SUPABASE_POSTGRESQL_CONNECTION_STRING NOT READ PROPERLY'
)

ZOHO_MAIL_PASSWORD = read_env_variable(
    'ZOHO_MAIL_PASSWORD', 
    'ZOHO_MAIL_PASSWORD NOT READ PROPERLY'
)
ZOHO_MAIL_USERNAME = read_env_variable(
    'ZOHO_MAIL_USERNAME', 
    'ZOHO_MAIL_USERNAME NOT READ PROPERLY'
)