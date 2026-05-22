# Production Deploy

This project should be deployed into its own folder and must not touch `/opt/tennis-project-backend`.

Recommended server path:

- `/opt/wedding-invite`

Recommended structure on the server:

- `/opt/wedding-invite/app` - this git repository
- `/opt/wedding-invite/shared` - optional shared files later

## First deploy

1. Create a separate directory:
   `mkdir -p /opt/wedding-invite`
2. Clone this repository there:
   `git clone <YOUR_GIT_REPO_URL> /opt/wedding-invite/app`
3. Go into the project:
   `cd /opt/wedding-invite/app`
4. Copy env:
   `cp .env.production.example .env`
5. Fill `.env` with real values.
6. Install dependencies:
   `npm ci`
7. Create tables in PostgreSQL using `server/schema.sql`.
8. Build frontend:
   `npm run build`
9. Start through PM2:
   `pm2 start deploy/ecosystem.config.cjs`
10. Save PM2 config:
   `pm2 save`

After build, backend serves the frontend from `dist/`, so one Node process is enough.

**Uploaded pictures** go to the `uploads/` folder next to `dist/` (created automatically when you upload from the admin). That folder is not in git — back it up on the server before migrations or reinstalls.

## Updates from git

From `/opt/wedding-invite/app`:

`bash deploy/update.sh`

This script:

- pulls the latest code
- installs dependencies
- rebuilds the frontend
- restarts PM2

## Nginx

Use [deploy/nginx/wedding-invite.conf](/c:/Users/kulag/Downloads/Свадебное приглашение сайт/deploy/nginx/wedding-invite.conf:1) as the site config.

Nginx proxies requests to `127.0.0.1:3001`, where the Node app serves both API and frontend.
