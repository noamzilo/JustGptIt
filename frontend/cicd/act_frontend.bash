cd ~/src/personal_website

# cat /home/noams/src/personal_website/frontend/.env \
# /home/noams/src/personal_website/frontend/.env.local-production \
# > /home/noams/src/personal_website/frontend/.env.temp

cat /home/noams/src/personal_website/frontend/.env \
/home/noams/src/personal_website/frontend/.env.local \
> /home/noams/src/personal_website/frontend/.env.temp

act -j build-and-deploy \
   -W .github/workflows/deploy_frontend.yml \
   --secret-file /home/noams/src/personal_website/frontend/.secrets_frontend \
   --env-file /home/noams/src/personal_website/frontend/.env.temp \
   --env ACT=TRUE \
   --artifact-server-path /tmp/artifacts \
   --verbose

rm -f /home/noams/src/personal_website/frontend/.env.temp