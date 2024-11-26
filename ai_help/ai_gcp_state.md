# GCP State Summary

- Project ID: saved in the backend/.secrets as GCP_PROJECT_ID
- Project Name: personal-website-backend
- Region: us-central1
- Container Registry: gcr.io/academic-veld-436919-g0
- Cloud Run Service Name: personal-website-backend
- Cloud Run Configuration: 
  - Platform: managed
  - Allow unauthenticated invocations
- Storage Bucket: gs://test-bucket-19044/

- Project ID: academic-veld-436919-g0
- Region: us-central1
- Service accounts
  - personal-website-deployer - For running deploy.yaml, either in Github Actions or using act locally
    - Service Account Key File, encoded as base64: is saved in the backend/.secrets as GCP_SA_KEY
  - personal-website-cloud-run - For running the container itself without needing permissions to reside in docker images or be passed in, using Application Default Credentials (ADC).
  - personal-website-deployer is configured to impersonate personal-website-cloud-run at build time for permissions. 


  - A reverse proxy exists on CloudFlare. 
  	- mydomain.com/redirect/hashhash --> http://personal-website-backend-839353010571.us-central1.run.app/llm/redirect/hashhash
	- mydomain.com/any/path --> https://noamzilo.github.io/personal_website/#/gpt/any/path
