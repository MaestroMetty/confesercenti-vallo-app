# Database Migrations with Drizzle

This project uses Drizzle ORM with SQL migrations for production deployments.

## Overview

**Development**: Uses `drizzle-kit push` (schema directly pushed to DB)  
**Production**: Uses generated SQL migrations (tracked in git, runs on container startup)

## 📋 Available Commands

```bash
# Generate new migration from schema changes
npm run db:generate

# Run migrations (apply pending migrations to database)
npm run db:migrate

# Push schema directly to database (development only)
npm run db:push
```

## 🔄 Workflow

### Making Schema Changes

1. **Edit your schema** in `src/db/schema.ts`
   ```typescript
   export const users = pgTable('users', {
     id: serial('id').primaryKey(),
     username: text('username').notNull(),
     email: text('email').notNull(), // ← New field
   });
   ```

2. **Generate migration**
   ```bash
   npm run db:generate
   ```
   This creates a new SQL file in `drizzle/` folder like `0001_fancy_name.sql`

3. **Review the SQL**
   ```bash
   cat drizzle/0001_fancy_name.sql
   ```
   Make sure it looks correct!

4. **Commit the migration**
   ```bash
   git add drizzle/
   git commit -m "Add email field to users table"
   ```

### Applying Migrations

**In Production:**
Migrations run automatically on container startup via `docker-entrypoint.sh`

**Locally (for testing):**
```bash
npm run db:migrate
```

## 🐳 How It Works in Production

1. Docker container starts
2. `docker-entrypoint.sh` runs
3. Reads Docker secrets → sets environment variables
4. Runs `npx tsx ./src/db/migrate.ts`
5. Drizzle applies pending migrations from `./drizzle` folder
6. App starts with `node server.js`

### Migration Flow
```
drizzle/
├── 0000_curly_cerebro.sql      ← Initial schema
├── 0001_next_migration.sql     ← Your changes
└── meta/
    ├── _journal.json           ← Migration tracking
    └── 0000_snapshot.json
```

## 🔧 Migration Script

The migration runner is at `src/db/migrate.ts`:

```typescript
import { migrate } from 'drizzle-orm/node-postgres/migrator';

async function runMigrations() {
  await migrate(db, { migrationsFolder: './drizzle' });
}
```

This script:
- ✅ Connects to the database
- ✅ Reads all SQL files from `./drizzle`
- ✅ Applies only pending migrations (tracks what's been run)
- ✅ Exits with error code if migration fails

## ⚠️ Important Notes

### DO:
- ✅ Always generate migrations before deploying
- ✅ Review generated SQL before committing
- ✅ Commit migration files to git
- ✅ Test migrations locally first
- ✅ Use descriptive commit messages

### DON'T:
- ❌ Don't manually edit generated SQL (unless necessary)
- ❌ Don't delete migration files
- ❌ Don't use `drizzle-kit push` in production
- ❌ Don't skip migrations (they must run in order)

## 🚨 Troubleshooting

### Migration Fails on Startup

Check container logs:
```bash
docker service logs confesercenti-vallo-pwa_app
```

Look for:
```
🔄 Running database migrations...
❌ Migration failed!
```

### Manually Run Migration

Connect to the container:
```bash
docker exec -it <container-id> sh
npx tsx ./src/db/migrate.ts
```

### Reset Development Database

⚠️ **Warning: Destroys all data!**

```bash
# Stop containers
docker compose -f compose.dev.yaml down

# Remove database volume
rm -rf db-data/

# Start fresh
docker compose -f compose.dev.yaml up
```

## 📦 What's Included in Docker Image

The production Dockerfile copies:
- `drizzle/` - All migration SQL files
- `src/db/migrate.ts` - Migration runner script
- `drizzle.config.ts` - Drizzle configuration
- `tsx` package - TypeScript executor

## 🎯 Best Practices

1. **Always test locally first**
   ```bash
   npm run db:generate
   npm run db:migrate
   ```

2. **Review SQL before deploying**
   - Check for data loss (DROP, ALTER TABLE DROP COLUMN)
   - Ensure indexes are added
   - Verify foreign keys

3. **Incremental changes**
   - Make small, frequent migrations
   - Don't batch too many changes together

4. **Backup before major migrations**
   ```bash
   docker exec postgres-db-confesercenti-vallo-app pg_dump -U user dbname > backup.sql
   ```

## 📚 Resources

- [Drizzle ORM Docs](https://orm.drizzle.team/)
- [Drizzle Kit Migrations](https://orm.drizzle.team/kit-docs/overview#migrations)
- [PostgreSQL Migration Best Practices](https://www.postgresql.org/docs/current/ddl.html)

