# GitHub Repository Summary

## Repository Information
- Name: personal_website
- Username: noamzilo
- URL: https://github.com/noamzilo/personal_website

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

## GitHub Actions
1. "Build and Deploy" workflow
   - Defined in: .github/workflows/deploy.yml
   - Triggers on: Push to the backend or main branch
   - Purpose: backend deployment only

2. pages-build-deployment 
   - Likely automated by GitHub Pages

## Existing Workflow Files
- Location: .github/workflows/
- Files:
  - deploy.yml (for backend deployment only)

## Frontend Deployment
- Deployed to: GitHub Pages
- Live URL: https://noamzilo.github.io/personal_website/
- Deploys from: main branch, root directory
- Process: Automated via "Build and Deploy" workflow

## Backend Deployment
- Current process: Manual deployment using act with the deploy.yml file, or automatic using github actions (on push)
- Deployment functions:
  - Authenticates with GCP
  - Builds Docker image
  - Pushes to Google Container Registry
  - Deploys to Google Cloud Run

## GitHub Secrets
- Existing:
  (frontend)
  - PROD_API_URL
  - STAGING_API_URL
  (backend)
  - GCP_PROJECT_ID
  - GCP_SA_KEY (base64 encoded contents of the local backend/creds/gcp-sa-key.json)
  - GCP_CLOUD_RUN_SERVICE_ACCOUNT_NAME

## GCP Configuration
- Project ID: academic-veld-436919-g0
- Region: us-central1
- Service accounts
   - personal-website-deployer - For running deploy.yaml, either in Github Actions or using act locally
   - personal-website-cloud-run - For running the container itself without needing permissions to reside in docker images or be passed in, using Application Default Credentials (ADC).
   - personal-website-deployer is configured to impersonate personal-website-cloud-run at build time for permissions. 

## Notes
- The repository structure and branch naming could be improved for clarity
- The frontend deployment process used to work but for some reason is not anymore.
- The backend deployment process is set up and working.