# Use Python 3.11.3 as the base image
FROM python:3.11.3-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Set work directory
WORKDIR /app

# Install dependencies
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

# Copy project
COPY . /app/

# List contents of /app directory
RUN ls -R /app

# List contents and Python path for debugging
RUN echo $PYTHONPATH && python -c "import sys; print(sys.path)"

# Try to import Django and print its version
RUN python -c "import django; print(django.__version__)"

# Try to import the backend module (this will fail, but we'll keep it for reference)
RUN python -c "import backend; print(config.__file__)" || echo "Failed to import backend"

# Collect static files (commented out for now)
# RUN DJANGO_SETTINGS_MODULE=config.settings python manage.py collectstatic --noinput

# Run gunicorn
CMD ["gunicorn", "config.wsgi:application", "--bind", "0.0.0.0:8000"]