# Infra Notes (internal)

- The API stores its working copy in server/data/db.json
- Rebuild it any time with: npm run reset-db
- Club Pi handles attendly + pi-signage; portal runs on the lab desktop
- Nightly backup rsyncs /srv/focc to the spare SSD
