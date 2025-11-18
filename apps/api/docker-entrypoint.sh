#!/bin/sh
set -e

echo "🔧 Generating Prisma Client..."
cd /app/packages/database
npx prisma generate

echo "🔄 Running database migrations..."
npx prisma migrate deploy

echo "✅ Migrations complete!"
echo "🚀 Starting application..."
cd /app/apps/api
exec node dist/main.js

