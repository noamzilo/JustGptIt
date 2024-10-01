#!/bin/bash

set -e  # Exit immediately if a command exits with a non-zero status

# Docker image and container names
IMAGE_NAME="personal-website-backend"
CONTAINER_NAME="personal-website-backend-test"

# Port mapping
HOST_PORT=8080
CONTAINER_PORT=8080

# GCP Credentials
GCP_CREDENTIALS_PATH="/home/noams/src/gcp/academic-veld-436919-g0-b0585aa23f8b.json"

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

# Function to build the Docker image
build_image() {
    if need_to_build; then
        echo "Changes detected. Building Docker image..."
        if ! docker build -t ${IMAGE_NAME}:latest -t ${IMAGE_NAME}:${IMAGE_TAG} .; then
            echo "Error: Docker build failed. Exiting."
            exit 1
        fi
    else
        echo "No changes detected. Using existing Docker image."
        # Tag the latest image with the new timestamp
        docker tag ${IMAGE_NAME}:latest ${IMAGE_NAME}:${IMAGE_TAG}
    fi
}

# Function to run the Docker container
run_container() {
    # Stop and remove the existing container if it's running
    docker stop $CONTAINER_NAME 2>/dev/null || true
    docker rm $CONTAINER_NAME 2>/dev/null || true

    echo "Docker run command:"
    if [ "$1" = "prod" ]; then
        echo "Running in production mode"
        docker run -d \
          --name $CONTAINER_NAME \
          -p ${HOST_PORT}:${CONTAINER_PORT} \
          -e DEBUG=0 \
          ${IMAGE_NAME}:${IMAGE_TAG}
    else
        echo "Running in development mode"
        docker run -d \
          --name $CONTAINER_NAME \
          -p ${HOST_PORT}:${CONTAINER_PORT} \
          -v ${GCP_CREDENTIALS_PATH}:/app/gcp-credentials.json \
          -e GOOGLE_APPLICATION_CREDENTIALS=/app/gcp-credentials.json \
          -e DEBUG=1 \
          ${IMAGE_NAME}:${IMAGE_TAG}
    fi

    # Wait for the container to start
    sleep 5

    # Print the container logs
    echo "Container started. Printing logs:"
    docker logs $CONTAINER_NAME
}


build_dev() {
    build_image
    docker build -t ${IMAGE_NAME}:dev -f Dockerfile.dev .
}

run_dev_container() {
    docker stop $CONTAINER_NAME 2>/dev/null || true
    docker rm $CONTAINER_NAME 2>/dev/null || true

    echo "Running development container"
    docker run -d \
      --name $CONTAINER_NAME \
      -p ${HOST_PORT}:${CONTAINER_PORT} \
      -v ${GCP_CREDENTIALS_PATH}:/app/gcp-credentials.json \
      -e GOOGLE_APPLICATION_CREDENTIALS=/app/gcp-credentials.json \
      -e DEBUG=1 \
      ${IMAGE_NAME}:dev
    
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
        run_container dev
        ;;
    run-prod)
        build_image
        run_container prod
        ;;
    build-dev)
        build_dev
        ;;
    run-dev)
        build_dev
        run_dev_container
        ;;
    *)
        echo "Usage: $0 {build|run|run-prod|build-dev|run-dev}"
        exit 1
        ;;
esac