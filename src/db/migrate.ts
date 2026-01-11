import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { Pool } from 'pg';

async function runMigrations() {
  const connectionString = process.env.DATABASE_URL;
  
  if (!connectionString) {
    console.error('❌ DATABASE_URL is not set');
    process.exit(1);
  }

  console.log('🔌 Connecting to database...');
  
  const pool = new Pool({
    connectionString,
  });

  const db = drizzle(pool);

  try {
    console.log('⏳ Running migrations...');
    
    await migrate(db, { migrationsFolder: './drizzle' });
    
    console.log('✅ Migrations completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed!');
    console.error(error);
    await pool.end();
    process.exit(1);
  }

  await pool.end();
  console.log('👋 Database connection closed');
}

runMigrations();

