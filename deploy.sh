#!/bin/bash

set -e

APP_DIR="$HOME/test/NATURA"

echo "==> Masuk ke project"
cd "$APP_DIR"

echo "==> Git pull"
git pull

echo "==> Install dependencies"
npm install

echo "==> Build Next.js"
npm run build

echo "==> Restart PM2"
pm2 restart natura --update-env

echo "==> Save PM2"
pm2 save

echo ""
echo "=================================="
echo "Deploy selesai!"
echo "=================================="

pm2 status
