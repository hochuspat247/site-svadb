#!/usr/bin/env bash
set -euo pipefail

APP_DIR="/opt/wedding-invite/app"

cd "$APP_DIR"

git pull --ff-only
npm ci
npm run build
pm2 startOrReload deploy/ecosystem.config.cjs
pm2 save

echo "Wedding invite app updated successfully."
