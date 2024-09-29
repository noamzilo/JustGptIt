#!/bin/bash

# Docker image and container names
IMAGE_NAME="personal-website-backend"
CONTAINER_NAME="personal-website-backend-test"

# Port mapping
HOST_PORT=8000
CONTAINER_PORT=8000

# GCP Credentials
GCP_CREDENTIALS_PATH="/home/noams/src/gcp/academic-veld-436919-g0-b0585aa23f8b.json"
CONTAINER_CREDENTIALS_PATH="/app/gcp-credentials.json"

# Generate a timestamp for the tag
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
IMAGE_TAG="local_${TIMESTAMP}"

# Function to check if build is necessary
need_to_build() {
    local last_build_time
    local last_file_change

    # Get the timestamp of the last build
    last_build_time=$(docker inspect -f '{{ .Created }}' ${IMAGE_NAME}:latest 2>/dev/null || echo "0001-01-01T00:00:00Z")

    # Get the timestamp of the last file change in the current directory
    last_file_change=$(find . -type f -not -path '*/\.*' -printf '%T@\n' | sort -n | tail -1)

    # Convert timestamps to seconds since epoch for comparison
    last_build_seconds=$(date -d "$last_build_time" +%s 2>/dev/null || echo 0)
    last_change_seconds=$(date -d "@$last_file_change" +%s)

    # Compare timestamps
    if [ $last_change_seconds -gt $last_build_seconds ]; then
        return 0  # Need to build
    else
        return 1  # No need to build
    fi
}

# Build the Docker image if necessary
if need_to_build; then
    echo "Changes detected. Building Docker image..."
    docker build -t ${IMAGE_NAME}:latest -t ${IMAGE_NAME}:${IMAGE_TAG} .
else
    echo "No changes detected. Using existing Docker image."
    # Tag the latest image with the new timestamp
    docker tag ${IMAGE_NAME}:latest ${IMAGE_NAME}:${IMAGE_TAG}
fi

# Remove existing container if it exists
docker rm -f $CONTAINER_NAME

# Run the new container
docker run -d \
  --name $CONTAINER_NAME \
  -p $HOST_PORT:$CONTAINER_PORT \
  -v $GCP_CREDENTIALS_PATH:$CONTAINER_CREDENTIALS_PATH \
  -e GOOGLE_APPLICATION_CREDENTIALS=$CONTAINER_CREDENTIALS_PATH \
  ${IMAGE_NAME}:${IMAGE_TAG}

# Print the container logs
echo "Container started. Printing logs:"
docker logs $CONTAINER_NAME