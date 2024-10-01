# GCP State Summary

- Project ID: academic-veld-436919-g0
- Project Name: personal-website-backend
- Region: us-central1
- Service Account: personal-website-deployer@academic-veld-436919-g0.iam.gserviceaccount.com
- Service Account Key File: /home/noams/src/gcp/academic-veld-436919-g0-b0585aa23f8b.json
- Container Registry: gcr.io/academic-veld-436919-g0
- Docker Image: personal-website-backend:latest
- Full Image Path: gcr.io/academic-veld-436919-g0/personal-website-backend:latest
- Cloud Run Service Name: personal-website-backend
- Cloud Run Configuration: 
  - Platform: managed
  - Allow unauthenticated invocations
- Storage Bucket: gs://test-bucket-19044/
- Service Account Roles:
  - Storage Admin
  - Artifact Registry Writer
- GCP service account key file is /home/noams/src/personal_website/backend/creds/academic-veld-436919-g0-b0585aa23f8b.json


Note: The Cloud Run deployment encountered an error and needs to be resolved. Likely the docker fails on local as well.