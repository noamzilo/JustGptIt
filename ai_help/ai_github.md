# GitHub Repository Summary

## Repository Information
- Name: justgptit
- Username: noamzilo
- URL: https://github.com/noamzilo/justgptit

## Branch Structure
- main: Latest stable deployed versions for both backend and frontend
- staging: (Misnamed, should be frontend) Used for new frontend release versions not yet in main
- backend: Used for backend development and testing

## Code Structure
- Main folder: personal_site
  - Subfolders: 
    - backend
      - .secrets (for backend local development. They are replcated in github secrets.)
    - frontend
    - .github/workflows
  - Dockerfile
  - 

## Frontend Deployment
- Deployed to: GitHub Pages
- Live URL: https://noamzilo.github.io/justgptit/
- Deploys from: main branch, root directory
- Process: Automated via deploy_frontend.yml workflow

## Backend Deployment
- Current process: Manual deployment using act with the deploy.yml file, or automatic using github actions (on push)
- Deployment functions:
  - Authenticates with GCP
  - Builds Docker image
  - Pushes to Google Container Registry
  - Deploys to Google Cloud Run
- Process: Automated via deploy_backend.yml workflow

## GitHub Secrets
- Repo secrets:
  (frontend)
  - PROD_API_URL - URL of the backend server in prod
  - STAGING_API_URL - URL of the backend server in staging
  (backend)
  - GCP_PROJECT_ID
  - GCP_SA_KEY (base64 encoded contents of the local backend/creds/gcp-sa-key.json)
  - GCP_CLOUD_RUN_SERVICE_ACCOUNT_NAME
- Environment secrets
  - DJANGO_SECRET_KEY
  - REACT_APP_API_URL (Where the app will be served)

  ## Github Repository Variables
  - DEBUG False
  - PORT 8080
  - USE_GCS True

  ## Github Environment Variables
  - ENVIRONMENT (prod or staging from github, or local from local)