#!/bin/bash

set -e  # Exit immediately if a command exits with a non-zero status

# Docker image and container names
IMAGE_NAME="personal-website-backend"
CONTAINER_NAME="personal-website-backend-container"

# Port mapping
HOST_PORT=8080
CONTAINER_PORT=8080

# Function to build the Docker image
build_image() {
    echo "Building Docker image..."
    docker build -t ${IMAGE_NAME}:latest .
}

# Function to run the Docker container
run_container() {
    echo "Running Docker container..."
    docker stop $CONTAINER_NAME 2>/dev/null || true
    docker rm $CONTAINER_NAME 2>/dev/null || true

    # Check if we're running in GitHub Actions
    if [ -n "$GITHUB_ACTIONS" ]; then
        # In GitHub Actions, use the environment variable
        CREDS_CONTENT=$GCP_SA_KEY
    else
        # Locally, read from the base64 encoded file
        CREDS_PATH="/home/noams/src/personal_website/backend/creds/gcp-sa-key.json.base64"
        CREDS_CONTENT=$(cat $CREDS_PATH)
    fi

    # Create a temporary file to store decoded credentials
    TEMP_CREDS=$(mktemp)
    echo $CREDS_CONTENT | base64 -d > $TEMP_CREDS

    docker run -d \
      --name $CONTAINER_NAME \
      -p ${HOST_PORT}:${CONTAINER_PORT} \
      -e PORT=8080 \
      -e DEBUG=1 \
      -e GOOGLE_APPLICATION_CREDENTIALS=/app/gcp-credentials.json \
      -v $TEMP_CREDS:/app/gcp-credentials.json:ro \
      ${IMAGE_NAME}:latest

    # Remove the temporary file
    rm $TEMP_CREDS

    echo "Container started. Printing logs:"
    docker logs $CONTAINER_NAME
}

# Main script logic
case "$1" in
    build)
        build_image
        ;;
    run)
        build_image
        run_container
        ;;
    *)
        echo "Usage: $0 {build|run}"
        exit 1
        ;;
esac