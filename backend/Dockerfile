# Use Python 3.11.3 as the base image
FROM python:3.11.3-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV DJANGO_SETTINGS_MODULE=config.settings

# Set work directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt /app/
RUN pip install --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy project
COPY . /app/

# Copy GCP credentials file temporarily
COPY /home/noams/src/gcp/academic-veld-436919-g0-b0585aa23f8b.json /app/gcp-credentials.json

# Set environment variable for GCP credentials
ENV GOOGLE_APPLICATION_CREDENTIALS=/app/gcp-credentials.json

# Create a directory for static files
RUN mkdir -p /app/staticfiles && chmod 755 /app/staticfiles

# Collect static files with verbose output
RUN python manage.py collectstatic --noinput -v 2

# Remove GCP credentials file after collectstatic
RUN rm -f /app/gcp-credentials.json

# Expose port
EXPOSE 8000

# Start command
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "config.wsgi:application"]