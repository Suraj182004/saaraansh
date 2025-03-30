import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as dotenv from 'dotenv';
import * as schema from './schema'; // Import your schema definitions

dotenv.config({ path: '.env.local' });

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is required');
}

// Create the connection pool
const client = postgres(process.env.DATABASE_URL, { max: 1 }); // max: 1 is recommended for serverless

// Initialize Drizzle with the connection and schema
export const db = drizzle(client, { schema });

// Export the schema along with the db client if needed elsewhere
export * from './schema'; 