The frontend/.secrets_frontend file contains

REACT_APP_API_URL, GITHUB_TOKEN, ACTIONS_RUNTIME_TOKEN

Contents of files:




.env is located correctly and its contents are:

# frontend # REACT_APP_API_URL="https://personal-website-backend-839353010571.us-central1.run.app" ENVIRONMENT="local" REACT_APP_ENVIRONMENT="local" # backend DEBUG=1 #DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1 PORT=8080 # Specify frontend CORS_ALLOWED_ORIGINS=https://noamzilo.github.io/personal_website/,http://localhost:3000,http://localhost:8080,http://localhost:8081

The frontend/.secrets_frontend file contains

REACT_APP_API_URL, GITHUB_TOKEN, ACTIONS_RUNTIME_TOKEN

Locally, the app works correctly without errors.

Value of secrets is not shown in github. But I see it has a value