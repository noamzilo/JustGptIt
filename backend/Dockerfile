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
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt /app/
RUN pip install --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy project
COPY . /app/

# Copy GCP credentials
COPY ./creds/academic-veld-436919-g0-b0585aa23f8b.json /app/gcp-credentials.json

# Set environment variable for GCP credentials
ENV GOOGLE_APPLICATION_CREDENTIALS=/app/gcp-credentials.json

# Create a directory for static files
RUN mkdir -p /app/staticfiles && chmod 755 /app/staticfiles

# Collect static files with verbose output
RUN python manage.py collectstatic --noinput -v 2
RUN rm -f /app/gcp-credentials

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

# Start command
CMD ["gunicorn", "--bind", "0.0.0.0:8080", "--log-level", "debug", "--capture-output", "--enable-stdio-inheritance", "config.wsgi:application"]