#!/bin/bash

# Source the .secrets file
if [ -f "/app/.secrets" ]; then
    source /app/.secrets
    echo "Sourced .secrets file"
else
    echo "ERROR: .secrets file not found"
    exit 1
fi

# Decode the credentials from the environment variable
if [ -n "$GCP_SA_KEY" ]; then
    echo "Decoding credentials from GCP_SA_KEY..."
    echo "$GCP_SA_KEY" | base64 -d > /app/gcp-credentials.json
else
    echo "ERROR: GCP_SA_KEY not set in .secrets file"
    exit 1
fi

# Run the original command (this would typically be your application start command)
exec "$@"