# Use Python 3.11.3 as the base image
FROM python:3.11.3-slim

ENV DJANGO_SETTINGS_MODULE=config.settings

WORKDIR /app

# Install system dependencies and debugging tools
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    curl \
    netcat-openbsd \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt /app/
RUN pip install --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy project
COPY . /app/

# Create a directory for static files
RUN mkdir -p /app/staticfiles && chmod 755 /app/staticfiles

# Create log directory and file
RUN mkdir -p /var/log && \
    touch /var/log/app.log && \
    chmod 666 /var/log/app.log

# Add these lines to print some debug info
RUN echo "Python version:" && python --version
RUN echo "Pip packages:" && pip list
RUN echo "Contents of /app:" && ls -la /app

RUN python -c "import django; print(f'Django version: {django.__version__}')"
RUN python -c "import sys; print(f'Python path: {sys.path}')"

# Expose port
EXPOSE 8080

# This is important for the version endpoint
RUN mkdir /build_artifacts; TZ=America/Argentina/Buenos_Aires date +"%Y-%m-%d %H:%M:%S" > /build_artifacts/build_time.txt

COPY docker_entrypoint_common.sh /app/docker_entrypoint_common.sh
COPY docker_entrypoint.sh /app/docker_entrypoint.sh
RUN chmod +x /app/docker_entrypoint.sh /app/docker_entrypoint_common.sh

ENTRYPOINT ["/app/docker_entrypoint.sh"]