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

    docker run -d \
      --name $CONTAINER_NAME \
      -p ${HOST_PORT}:${CONTAINER_PORT} \
      -e PORT=8080 \
      -e DEBUG=1 \
      ${IMAGE_NAME}:latest

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