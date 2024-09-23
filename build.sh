#!/bin/bash

# Build React frontend
echo "Building React frontend..."
cd frontend
npm run build
cd ..

# Collect Django static files
echo "Collecting Django static files..."
cd backend
python manage.py collectstatic --noinput
cd ..

echo "Build process completed!"