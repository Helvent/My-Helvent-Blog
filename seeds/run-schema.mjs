import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import pg from 'pg';

const { Client } = pg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PASSWORD = encodeURIComponent('@Me_Helvent26%_x');
const CONNECTION_STRING = `postgresql://postgres:${PASSWORD}@db.svernsspkeauzeiooskd.supabase.co:5432/postgres`;

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