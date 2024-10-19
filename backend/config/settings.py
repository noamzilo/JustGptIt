# Full path: ~/src/personal_website/backend/personal_website/settings.py

import os
from pathlib import Path
import logging
import sys
from constants import LOG_LEVEL, GCP_PROJECT_ID, USE_GCS, DJANGO_SECRET_KEY
SECRET_KEY = DJANGO_SECRET_KEY
if not SECRET_KEY:
    raise ValueError("No SECRET_KEY set for Django application")

print("Settings module loaded", file=sys.stderr)
print(f"SECRET_KEY from settings: {DJANGO_SECRET_KEY}", file=sys.stderr)

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

ALLOWED_HOSTS = ['*']  # For testing
# ALLOWED_HOSTS = ['personal-website-backend-839353010571.us-central1.run.app', 'personal-website-backend-bbwuvruncq-uc.a.run.app', 'localhost']

# CORS settings
CORS_ALLOW_ALL_ORIGINS = True  # For development only. In production, specify exact origins.
# CORS settings
CORS_ALLOWED_ORIGINS = [
    "https://noamzilo.github.io",
    "http://localhost:3000",
]
CORS_ALLOW_CREDENTIALS = True

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
        },
    },
    'root': {
        'handlers': ['console'],
        'level': LOG_LEVEL,
    },
    'loggers': {
        'django': {
            'handlers': ['console'],
            'level': LOG_LEVEL,
            'propagate': True,
        },
        'gunicorn': {
            'handlers': ['console'],
            'level': LOG_LEVEL,
            'propagate': True,
        },
    },
}

# Application definition
INSTALLED_APPS = [
    'corsheaders',
    'api',
    'rest_framework',
    'storages',  # Ensure 'storages' is included
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    # Add your apps here
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'middleware.cors_debug.CORSDebugMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware', 
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'config.urls'

REST_FRAMEWORK = {
    'DEFAULT_RENDERER_CLASSES': [
        'rest_framework.renderers.JSONRenderer',
    ],
}

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],  # Add template directories here if needed
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',  # Required by Django Allauth
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'config.wsgi.application'

# Database
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',  # Update this if you use a different database
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# Password validation
AUTH_PASSWORD_VALIDATORS = [
    # Include password validators if needed
]

# Internationalization
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'  # Adjust as needed
USE_I18N = True
USE_TZ = True

# Static files (CSS, JavaScript, Images)
STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
STATICFILES_DIRS = [os.path.join(BASE_DIR, 'static')]  # Include if you have a 'static' directory

# Static files storage using WhiteNoise
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

# Default primary key field type
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# Google Cloud Storage Configuration
if USE_GCS:
    DEFAULT_FILE_STORAGE = 'storages.backends.gcloud.GoogleCloudStorage'
    GS_PROJECT_ID = GCP_PROJECT_ID
    # Do not set GS_CREDENTIALS; let ADC handle it
else:
    # Use default file storage (e.g., local filesystem)
    DEFAULT_FILE_STORAGE = 'django.core.files.storage.FileSystemStorage'

# Additional settings can go here