import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

// We fall back to a dummy URL in case it's not set so the build doesn't fail,
// but the user MUST set this in .env.local to actually use the DB.
const sql = neon(process.env.DATABASE_URL || 'postgres://user:password@localhost/db');
export const db = drizzle(sql);
