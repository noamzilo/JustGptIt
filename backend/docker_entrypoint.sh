#!/bin/bash

set -e  # Exit immediately if a command exits with a non-zero status

# Set build time environment variable if needed
if [ -f "/app/build_time.txt" ]; then
    export BUILD_TIME=$(cat /app/build_time.txt)
    echo "Build time set to: $BUILD_TIME"
else
    echo "ERROR: build_time.txt file not found."
    exit 1
fi

# Run collectstatic
echo "Collecting static files..."
python manage.py collectstatic --noinput -v 2

# Start the application
echo "Starting the application..."
exec gunicorn --bind 0.0.0.0:8080 --log-level debug --capture-output --enable-stdio-inheritance config.wsgi:application
