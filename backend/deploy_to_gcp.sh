# #!/bin/bash

# # Build the Docker image
# echo "Building Docker image..."
# docker compose build

# # GCP project and region
# PROJECT_ID="academic-veld-436919-g0"
# REGION="us-central1"

# # Image and service details
# LOCAL_IMAGE_NAME="personal-website-backend"
# GCR_IMAGE_NAME="gcr.io/${PROJECT_ID}/${LOCAL_IMAGE_NAME}"
# SERVICE_NAME="personal-website-backend"
# SERVICE_ACCOUNT="personal-website-deployer@academic-veld-436919-g0.iam.gserviceaccount.com"

# # Set GOOGLE_APPLICATION_CREDENTIALS
# export GOOGLE_APPLICATION_CREDENTIALS="/app/gcp-credentials.json"

# # GCP Credentials
# if [ -n "$GITHUB_ACTIONS" ]; then
#     # In GitHub Actions, use the environment variable
#     echo $GCP_SA_KEY | base64 -d > ./creds/gcp-sa-key.json
# else
#     # Locally, read from the base64 encoded file
#     GCP_CREDENTIALS_PATH="/home/noams/src/personal_website/backend/creds/gcp-sa-key.json.base64"
#     base64 -d $GCP_CREDENTIALS_PATH > ./creds/gcp-sa-key.json
# fi
# GCP_CREDENTIALS_PATH="./creds/gcp-sa-key.json"

# if [ ! -f "$GCP_CREDENTIALS_PATH" ]; then
#     echo "Error: GCP credentials file not found at $GCP_CREDENTIALS_PATH"
#     echo "Please ensure the file exists and the path is correct."
#     exit 1
# fi

# echo "Using GCP credentials file: $GCP_CREDENTIALS_PATH"

# # Authenticate with GCP using the service account key
# gcloud auth activate-service-account --key-file=$GCP_CREDENTIALS_PATH

# # Configure Docker to use gcloud as a credential helper
# gcloud auth configure-docker --quiet

# # Tag the Docker image for GCR
# docker tag ${LOCAL_IMAGE_NAME}:latest ${GCR_IMAGE_NAME}:latest

# # Push the Docker image to GCR
# docker push ${GCR_IMAGE_NAME}:latest

# # Deploy to Cloud Run
# gcloud run deploy $SERVICE_NAME \
#   --image ${GCR_IMAGE_NAME}:latest \
#   --project $PROJECT_ID \
#   --region $REGION \
#   --platform managed \
#   --allow-unauthenticated \
#   --set-env-vars="DEBUG=1,GOOGLE_APPLICATION_CREDENTIALS=$GOOGLE_APPLICATION_CREDENTIALS" \
#   --port=8080 \
#   --service-account=$SERVICE_ACCOUNT

# # Print the service URL
# gcloud run services describe $SERVICE_NAME \
#   --project $PROJECT_ID \
#   --region $REGION \
#   --format="value(status.url)"

# # Clean up
# rm -f ./creds/gcp-sa-key.json