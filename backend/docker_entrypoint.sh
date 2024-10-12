#!/bin/bash

set -e  # Exit immediately if a command exits with a non-zero status

# Source the .secrets file (if still needed)
# Since we're passing GCP_SA_KEY as an environment variable, you can remove this if not needed
# if [ -f "/app/.secrets" ]; then
#     source /app/.secrets
#     echo "Sourced .secrets file"
# else
#     echo "ERROR: .secrets file not found"
#     exit 1
# fi

# Check if GCP_SA_KEY is set
if [ -n "$GCP_SA_KEY" ]; then
    echo "Decoding GCP_SA_KEY and writing to /app/gcp-credentials.json..."
    echo "$GCP_SA_KEY" | base64 -d > /app/gcp-credentials.json
    export GOOGLE_APPLICATION_CREDENTIALS=/app/gcp-credentials.json
else
    echo "ERROR: GCP_SA_KEY environment variable is not set."
    exit 1
fi

# Set build time environment variable if needed
if [ -f "/app/build_time.txt" ]; then
    export BUILD_TIME=$(cat /app/build_time.txt)
    echo "Build time set to: $BUILD_TIME"
else
    echo "ERROR: build_time.txt file not found."
    exit 1
fi

# Run database migrations (if required)
# echo "Running database migrations..."
# python manage.py migrate --noinput

# Collect static files
echo "Collecting static files..."
python manage.py collectstatic --noinput -v 2

# Start the application
echo "Starting the application..."
exec gunicorn --bind 0.0.0.0:8080 --log-level debug --capture-output --enable-stdio-inheritance config.wsgi:application
