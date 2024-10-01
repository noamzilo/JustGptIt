#!/bin/bash

# GCP project and region
PROJECT_ID="academic-veld-436919-g0"
REGION="us-central1"

# Image and service details
LOCAL_IMAGE_NAME="personal-website-backend"
GCR_IMAGE_NAME="gcr.io/${PROJECT_ID}/${LOCAL_IMAGE_NAME}"
SERVICE_NAME="personal-website-backend"

# GCP Credentials
GCP_CREDENTIALS_PATH="creds/academic-veld-436919-g0-b0585aa23f8b.json"
if [ ! -f "$GCP_CREDENTIALS_PATH" ]; then
    echo "Error: GCP credentials file not found at $GCP_CREDENTIALS_PATH"
    echo "Please ensure the file exists and the path is correct."
    exit 1
fi

echo "GCP credentials file found at $GCP_CREDENTIALS_PATH"

# Authenticate with GCP using the service account key
gcloud auth activate-service-account --key-file=$GCP_CREDENTIALS_PATH

# Configure Docker to use gcloud as a credential helper
gcloud auth configure-docker --quiet

# Tag the Docker image for GCR
docker tag ${LOCAL_IMAGE_NAME}:latest ${GCR_IMAGE_NAME}:latest

# Push the Docker image to GCR
docker push ${GCR_IMAGE_NAME}:latest

# Deploy to Cloud Run
gcloud run deploy $SERVICE_NAME \
  --image ${GCR_IMAGE_NAME}:latest \
  --project $PROJECT_ID \
  --region $REGION \
  --platform managed \
  --allow-unauthenticated \
  --set-env-vars="GOOGLE_APPLICATION_CREDENTIALS=/app/gcp-credentials.json" \
  --set-cloudsql-instances="${PROJECT_ID}:${REGION}:your-sql-instance-name"

# Note: Replace "your-sql-instance-name" with your actual Cloud SQL instance name if you're using one.

# Print the service URL
gcloud run services describe $SERVICE_NAME \
  --project $PROJECT_ID \
  --region $REGION \
  --format="value(status.url)"