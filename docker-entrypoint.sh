#!/bin/sh
set -e

# Read secrets and export as environment variables
if [ -f /run/secrets/confesercenti_vallo_db_user ]; then
    export DB_USER=$(cat /run/secrets/confesercenti_vallo_db_user)
fi

if [ -f /run/secrets/confesercenti_vallo_   db_password ]; then
    export DB_PASSWORD=$(cat /run/secrets/confesercenti_vallo_db_password)
fi

if [ -f /run/secrets/confesercenti_vallo_db_name ]; then
    export DB_NAME=$(cat /run/secrets/confesercenti_vallo_db_name)
fi

if [ -f /run/secrets/confesercenti_vallo_jwt_secret ]; then
    export JWT_SECRET=$(cat /run/secrets/confesercenti_vallo_jwt_secret)
fi

if [ -f /run/secrets/confesercenti_vallo_app_url ]; then
    export NEXT_PUBLIC_APP_URL=$(cat /run/secrets/confesercenti_vallo_app_url)
fi

# Build DATABASE_URL from secrets
if [ -n "$DB_USER" ] && [ -n "$DB_PASSWORD" ] && [ -n "$DB_NAME" ]; then
    DB_HOST=${DB_HOST:-confesercenti-vallo-pwa-db}
    DB_PORT=${DB_PORT:-5432}
    export DATABASE_URL="postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}"
fi

# Run database migrations before starting the app
if [ -f "./src/db/migrate.ts" ] && [ -d "./drizzle" ]; then
    echo "🔄 Running database migrations..."
    npx tsx ./src/db/migrate.ts || echo "⚠️  Migration failed or no migrations to run"
else
    echo "ℹ️  No migration script found, skipping..."
fi

# Execute the main command
exec "$@"

