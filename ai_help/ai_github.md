# GitHub Repository Summary

## Repository Information
- Name: personal_website
- Username: noamzilo

## Branch Structure
- main: Latest stable deployed versions for both backend and frontend
- staging: (Misnamed.) Used for new frontend release versions not yet in main
- backend: Used for backend development and testing

## Code Structure
- Main folder: personal_site
  - Subfolders: backend, frontend

## Existing GitHub Actions
1. pages-build-deployment (purpose unknown, possibly deletable)
2. Build and Deploy (for frontend deployment)

## GitHub Secrets
- PROD_API_URL
- STAGING_API_URL

## Workflows
- Location: .github/workflows/
- Files:
  - deploy.yml (for backend deployment to GCP)

## Current Backend Deployment Workflow (deploy.yml)
- Triggers on push to main branch, only for changes in the backend folder
- Uses Google Cloud SDK for authentication
- Builds and pushes Docker image to Google Container Registry
- Deploys to Google Cloud Run

## Notes
- The existing backend deployment workflow needs to be updated to include the staging branch and use the run_docker script for building.
- The frontend deployment process is already set up but not fully understood.
- The repository structure and branch naming could be improved for clarity.