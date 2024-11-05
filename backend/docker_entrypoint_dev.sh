#!/bin/bash

# Source the common entrypoint script
source /app/docker_entrypoint_common.sh

# Development-specific functionality

# Start Django development server with debugpy for debugging
echo "Starting Django development server with debugpy..."
exec python -m debugpy --listen 0.0.0.0:5678 manage.py runserver 0.0.0.0:8080 --reload --noreload-watcher=watchdog
