#!/bin/bash

# Decode the credentials from the environment variable or file
if [ -n "$GCP_SA_KEY" ]; then
    echo "Decoding credentials from environment variable..."
    echo "$GCP_SA_KEY" | base64 -d > /app/gcp-credentials.json
#else
#    echo "Decoding credentials from local file..."
#    base64 -d /app/gcp-sa-key.json.base64 > /app/gcp-credentials.json
#fi
else
    echo "NO GCP_SA_KEY environment variable"
    exit(1)

# Run the original command (this would typically be your application start command)
exec "$@"
