#!/bin/bash

# Source the common entrypoint script
source /app/docker_entrypoint_common.sh

# Development-specific functionality

# Start Gunicorn with reload and debugpy for debugging
echo "Starting Gunicorn with reload and debugpy..."

# ENV DJANGO_SETTINGS_MODULE=config.settings
# ENV DJANGO_AUTORELOAD_MODE=stat

# Start debugpy in the background
# python -m debugpy --listen 0.0.0.0:5678 --wait-for-client &

# # Start Gunicorn with reload
# exec gunicorn --reload \
#     --bind 0.0.0.0:8080 \
#     --log-level debug \
#     --capture-output --enable-stdio-inheritance \
#     --error-logfile /var/log/gunicorn-error.log \
#     --access-logfile /var/log/gunicorn-access.log config.wsgi:application
#!/bin/bash

# Source the common entrypoint script
source /app/docker_entrypoint_common.sh

# Development-specific functionality

# Start Django development server with debugpy for debugging
echo "Starting Django development server with debugpy..."
exec python -m debugpy --listen 0.0.0.0:5678 manage.py runserver 0.0.0.0:8080 --reload
