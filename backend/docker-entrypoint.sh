#!/bin/sh
set -e

echo "Running database migrations (prisma migrate deploy)..."
npx prisma migrate deploy

echo "Starting server..."
exec node dist/main.js
