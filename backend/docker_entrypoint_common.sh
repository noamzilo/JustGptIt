#!/bin/bash

set -e  # Exit immediately if a command exits with a non-zero status

# Common functionality for both production and development

# Set build time environment variable if needed
if [ -f "/app/build_time.txt" ]; then
    export BUILD_TIME=$(cat /app/build_time.txt)
    echo "Build time set to: $BUILD_TIME"
else
    echo "ERROR: build_time.txt file not found."
    exit 1
fi
