#!/bin/bash

# Source the common entrypoint script
source /app/docker_entrypoint_common.sh

# Production-specific functionality

# Run collectstatic
echo "Collecting static files..."
python manage.py collectstatic --noinput -v 2

# Start the application with verbose logging
echo "Starting the application... (docker_entrypoint.sh is done)"
exec gunicorn --bind 0.0.0.0:8080 --log-level debug \
    --capture-output --enable-stdio-inheritance \
    --error-logfile /var/log/gunicorn-error.log \
    --access-logfile /var/log/gunicorn-access.log config.wsgi:application
