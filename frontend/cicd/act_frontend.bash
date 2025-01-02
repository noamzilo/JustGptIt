cd ~/src/justgptit

# cat /home/noams/src/justgptit/frontend/.env \
# /home/noams/src/justgptit/frontend/.env.local-production \
# > /home/noams/src/justgptit/frontend/.env.temp

cat /home/noams/src/justgptit/frontend/.env \
/home/noams/src/justgptit/frontend/.env.local \
> /home/noams/src/justgptit/frontend/.env.temp

act -j build-and-deploy \
   -W .github/workflows/deploy_frontend.yml \
   --secret-file /home/noams/src/justgptit/frontend/.secrets_frontend \
   --env-file /home/noams/src/justgptit/frontend/.env.temp \
   --env ACT=TRUE \
   --artifact-server-path /tmp/artifacts \
   --verbose

rm -f /home/noams/src/justgptit/frontend/.env.temp