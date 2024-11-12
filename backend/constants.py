import os
import sys

backend_version_name = "0.0.2"

# Taking care of .env and .secret files for local development regardless of program arguments
secret_file_path = os.path.expanduser("~/src/personal_website/backend/.secrets_backend")
env_file_path = os.path.expanduser("~/src/personal_website/backend/.env")
if os.path.isfile(env_file_path):
    print(f"Reading environment variables from {env_file_path}", file=sys.stderr)
    with open(env_file_path, "r") as f:
        for line in f:
            if line.startswith("#"):
                continue
            if line.strip() == "":
                continue
            key, value = line.split("=", 1)
            os.environ[key] = value.strip()

# read environment variable from the environment. If it isn't there, try to read it from .secrets file (relevant only for local development)
# allow variables to look like "Value", and parse away the "".
def read_env_variable(name, default=None):    
    value = os.environ.get(name)
    if value is None:
        if os.path.isfile(secret_file_path):
            with open(secret_file_path, "r") as f: # yes, opening and iterating the file for every variable, whatever.
                for line in f:
                    if line.startswith(name):
                        value = line.split("=", 1)[1].strip()
                        value = value.replace('"', "").replace("'", "")
                        if "CORS_ALLOWED_ORIGINS" == name:
                            raise ValueError('wtf')
                        break
        else:
            print(".secrets file not found", file=sys.stderr) # production environment

    if value is None:
        value = default

    print(f"Environment variable {name}: {'[SET]' if value is not None else '[NOT SET]'}", file=sys.stderr)
    return value

    
# Environment variables
PORT = int(read_env_variable("PORT", 8080))
DJANGO_SECRET_KEY = read_env_variable('DJANGO_SECRET_KEY', 'DJANGO_SECRET_KEY_NOT_READ_PROPERLY')
DEBUG = read_env_variable('DEBUG', 'False') == 'True'
LOG_LEVEL = 'DEBUG' if DEBUG else 'INFO'
USE_GCS = read_env_variable('USE_GCS', 'True') == 'True'

CORS_ALLOWED_ORIGINS_ORIG = read_env_variable('CORS_ALLOWED_ORIGINS', None)
if not CORS_ALLOWED_ORIGINS_ORIG:
    raise ValueError(f"CORS_ALLOWED_ORIGINS environment variable is not set. {CORS_ALLOWED_ORIGINS_ORIG}")
CORS_ALLOWED_ORIGINS_ORIG = CORS_ALLOWED_ORIGINS_ORIG.replace('"', "").replace("'", "")
CORS_ALLOWED_ORIGINS = CORS_ALLOWED_ORIGINS_ORIG.split(',')
if not CORS_ALLOWED_ORIGINS:
    raise ValueError(f"CORS_ALLOWED_ORIGINS environment variable is not set or empty. {CORS_ALLOWED_ORIGINS}")
CORS_ALLOWED_ORIGINS = [origin for origin in CORS_ALLOWED_ORIGINS if origin]
if not CORS_ALLOWED_ORIGINS:
    raise ValueError(f"CORS_ALLOWED_ORIGINS environment variable contains only empty strings: {CORS_ALLOWED_ORIGINS}")

print(f"DJANGO_SECRET_KEY is set: {'Yes' if DJANGO_SECRET_KEY else 'No'}", file=sys.stderr)
print(f"DEBUG: {DEBUG}", file=sys.stderr)


# Backend-specific secrets
GCP_SA_KEY = read_env_variable('GCP_SA_KEY')
GCP_PROJECT_ID = read_env_variable('GCP_PROJECT_ID')
GCP_CLOUD_RUN_SERVICE_ACCOUNT_NAME = read_env_variable('GCP_CLOUD_RUN_SERVICE_ACCOUNT_NAME')

DEPLOY_TIME = read_env_variable('DEPLOY_TIME', 'UNKNOWN DEPLOY TIME')
try:
    with open("/build_artifacts/build_time.txt", "r") as f: # created during docker build
        BUILD_TIME = f.read().strip()
except FileNotFoundError:
    BUILD_TIME = 'Build time not available'

# Not supported yet
GS_BUCKET_NAME = read_env_variable('GS_BUCKET_NAME', 'GS_BUCKET_NAME NOT READ PROPERLY')
URLDAY_API_KEY = read_env_variable('URLDAY_API_KEY', 'URLDAY_API_KEY NOT READ PROPERLY')

SUPABASE_API_KEY = read_env_variable('SUPABASE_API_KEY', 'SUPABASE_API_KEY NOT READ PROPERLY')
SUPABASE_PROJECT_URL = read_env_variable('SUPABASE_PROJECT_URL', 'SUPABASE_PROJECT_URL NOT READ PROPERLY')
SUPABASE_POSTGRESQL_CONNECTION_STRING = read_env_variable('SUPABASE_POSTGRESQL_CONNECTION_STRING', 'SUPABASE_POSTGRESQL_CONNECTION_STRING NOT READ PROPERLY')
