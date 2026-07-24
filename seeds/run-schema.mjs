import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import pg from 'pg';

const { Client } = pg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env.local
const envPath = join(__dirname, '..', '.env.local');
if (existsSync(envPath)) {
  const envContent = readFileSync(envPath, 'utf-8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const value = trimmed.slice(eqIdx + 1).trim();
    if (!process.env[key]) process.env[key] = value;
  }
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const dbPassword = process.env.SUPABASE_DB_PASSWORD;

if (!supabaseUrl) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL in environment or .env.local');
  process.exit(1);
}
if (!dbPassword) {
  console.error('Missing SUPABASE_DB_PASSWORD in environment or .env.local');
  process.exit(1);
}

// Extract project ref from URL: https://<ref>.supabase.co
const projectRef = new URL(supabaseUrl).hostname.split('.')[0];
const encodedPassword = encodeURIComponent(dbPassword);
const CONNECTION_STRING = `postgresql://postgres:${encodedPassword}@db.${projectRef}.supabase.co:5432/postgres`;

async function main() {
  console.log('Connecting to Supabase database...');
  const client = new Client({ connectionString: CONNECTION_STRING });

  try {
    await client.connect();
    console.log('Connected successfully.');

    const sqlPath = join(__dirname, 'sql-schema.sql');
    const sql = readFileSync(sqlPath, 'utf-8');

    console.log('Executing schema...');
    await client.query(sql);
    console.log('Schema executed successfully.');
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();