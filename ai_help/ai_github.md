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
    - frontend

## GitHub Actions
1. "Build and Deploy" workflow
   - Defined in: .github/workflows/deploy.yml
   - Triggers on: Push to the backend branch
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
- Current process: Manual deployment using deploy_to_gcp.sh script
- Script location: backend folder
- Script functions:
  - Authenticates with GCP
  - Builds Docker image
  - Pushes to Google Container Registry
  - Deploys to Google Cloud Run
- Backend deploys using deploy_to_gcp.sh which in turn uses "run_docker.sh build" scripts.
- Currently, problems exist in the build and/or deploy process.

## GitHub Secrets
- Existing:
  (frontend)
  - PROD_API_URL
  - STAGING_API_URL
  (backend)
  - GCP_PROJECT_ID
  - GCP_SA_KEY (base64 encoded contents of the local backend/creds/gcp-sa-key.json)

## GCP Configuration
- Project ID: academic-veld-436919-g0
- Region: us-central1
- Service Account: personal-website-deployer@academic-veld-436919-g0.iam.gserviceaccount.com

## Action Items
1. Create a new GitHub Actions workflow (backend-deploy.yml) for automated backend deployment
2. Integrate the deploy_to_gcp.sh script into the new GitHub Actions workflow
3. Set up the workflow to trigger on pushes to the main and backend branches
4. Add necessary GCP-related secrets to the GitHub repository
5. Modify deploy_to_gcp.sh script to use GitHub Actions-provided credentials

## Notes
- The repository structure and branch naming could be improved for clarity
- The frontend deployment process is set up and working
- The backend deployment process needs to be automated. Currently, problems exist.