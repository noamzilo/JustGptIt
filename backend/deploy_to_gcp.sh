#!/bin/bash

# GCP project and region
PROJECT_ID="academic-veld-436919-g0"
REGION="us-central1"

# Image and service details
LOCAL_IMAGE_NAME="personal-website-backend"
GCR_IMAGE_NAME="gcr.io/${PROJECT_ID}/${LOCAL_IMAGE_NAME}"
SERVICE_NAME="personal-website-backend"
SERVICE_ACCOUNT="personal-website-deployer@academic-veld-436919-g0.iam.gserviceaccount.com"

# GCP Credentials
GCP_CREDENTIALS_PATH="./creds/gcp-sa-key.json"

if [ ! -f "$GCP_CREDENTIALS_PATH" ]; then
    echo "Error: GCP credentials file not found at $GCP_CREDENTIALS_PATH"
    exit 1
fi

echo "Using GCP credentials file: $GCP_CREDENTIALS_PATH"

# Authenticate with GCP using the service account key
gcloud auth activate-service-account --key-file=$GCP_CREDENTIALS_PATH

# Configure Docker to use gcloud as a credential helper
gcloud auth configure-docker --quiet

# Build the Docker image
./run_docker.sh build

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
  --set-env-vars="DEBUG=1" \
  --port=8080 \
  --service-account=$SERVICE_ACCOUNT

# Print the service URL
gcloud run services describe $SERVICE_NAME \
  --project $PROJECT_ID \
  --region $REGION \
  --format="value(status.url)"