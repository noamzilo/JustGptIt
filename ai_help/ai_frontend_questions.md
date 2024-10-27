The frontend/.secrets_frontend file contains

REACT_APP_API_URL, GITHUB_TOKEN, ACTIONS_RUNTIME_TOKEN

Contents of files:




.env is located correctly and its contents are:

# frontend # REACT_APP_API_URL="https://personal-website-backend-839353010571.us-central1.run.app" ENVIRONMENT="local" REACT_APP_ENVIRONMENT="local" # backend DEBUG=1 #DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1 PORT=8080 # Specify frontend CORS_ALLOWED_ORIGINS=https://noamzilo.github.io/personal_website/,http://localhost:3000,http://localhost:8080,http://localhost:8081

The frontend/.secrets_frontend file contains

REACT_APP_API_URL, GITHUB_TOKEN, ACTIONS_RUNTIME_TOKEN

Locally, the app works correctly without errors.

I see in github, the value of REACT_APP_API_URL is not shown even though act does show it as ***. Deployment with act still doesn't show the value propagates, so I am assuming there are two separate problems.

With the latest code, with the first failing step commented out, the build failed, but i don't know why

[Deploy Frontend/build-and-deploy] [DEBUG] Loading revision from git directory
[Deploy Frontend/build-and-deploy] [DEBUG] Found revision: b242bddc649a4a35b04b3596e451b2ccb377b99f
[Deploy Frontend/build-and-deploy] [DEBUG] HEAD points to 'b242bddc649a4a35b04b3596e451b2ccb377b99f'
[Deploy Frontend/build-and-deploy] [DEBUG] using github ref: refs/heads/frontend
[Deploy Frontend/build-and-deploy] [DEBUG] Found revision: b242bddc649a4a35b04b3596e451b2ccb377b99f
[Deploy Frontend/build-and-deploy] [DEBUG] Loading revision from git directory
[Deploy Frontend/build-and-deploy] [DEBUG] Found revision: b242bddc649a4a35b04b3596e451b2ccb377b99f
[Deploy Frontend/build-and-deploy] [DEBUG] HEAD points to 'b242bddc649a4a35b04b3596e451b2ccb377b99f'
[Deploy Frontend/build-and-deploy] [DEBUG] using github ref: refs/heads/frontend
[Deploy Frontend/build-and-deploy] [DEBUG] Found revision: b242bddc649a4a35b04b3596e451b2ccb377b99f
[Deploy Frontend/build-and-deploy] [DEBUG] evaluating expression 'success()'
[Deploy Frontend/build-and-deploy] [DEBUG] expression 'success()' evaluated to 'false'
[Deploy Frontend/build-and-deploy] [DEBUG] Skipping step 'Set up Node.js' due to 'success()'
[Deploy Frontend/build-and-deploy] [DEBUG] skipping post step for 'actions/checkout@v4': no action model available
[Deploy Frontend/build-and-deploy] 🏁  Job failed
[Deploy Frontend/build-and-deploy] [DEBUG] Loading revision from git directory
[Deploy Frontend/build-and-deploy] [DEBUG] Found revision: b242bddc649a4a35b04b3596e451b2ccb377b99f
[Deploy Frontend/build-and-deploy] [DEBUG] HEAD points to 'b242bddc649a4a35b04b3596e451b2ccb377b99f'
[Deploy Frontend/build-and-deploy] [DEBUG] using github ref: refs/heads/frontend
[Deploy Frontend/build-and-deploy] [DEBUG] Found revision: b242bddc649a4a35b04b3596e451b2ccb377b99f

so can't see the index.html