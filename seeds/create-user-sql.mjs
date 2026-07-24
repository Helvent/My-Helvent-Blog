import pg from 'pg';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const { Client } = pg;

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load .env.local
const envPath = join(__dirname, '..', '.env.local');
const envContent = readFileSync(envPath, 'utf-8');
for (const line of envContent.split('\n')) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) continue;
  const eqIdx = trimmed.indexOf('=');
  if (eqIdx === -1) continue;
  const key = trimmed.slice(0, eqIdx).trim();
  const value = trimmed.slice(eqIdx + 1).trim();
  process.env[key] = value;
}

const PASSWORD = encodeURIComponent('@Me_Helvent26%_x');
const CONNECTION_STRING = `postgresql://postgres:${PASSWORD}@db.svernsspkeauzeiooskd.supabase.co:5432/postgres`;

async function main() {
  console.log('Connecting...');
  const client = new Client({ connectionString: CONNECTION_STRING });
  await client.connect();
  console.log('Connected.');

  // Check if user already exists
  const { rows: existing } = await client.query(
    `SELECT id, email FROM auth.users WHERE email = $1`,
    ['helvent_art@163.com']
  );

  if (existing.length > 0) {
    console.log(`User already exists: ${existing[0].email} (id: ${existing[0].id})`);
    await client.end();
    return;
  }

  // Create user in auth.users with confirmed email
  const { rows } = await client.query(`
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, raw_user_meta_data, created_at, updated_at,
      confirmation_token, email_change, email_change_token_new, recovery_token
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'helvent_art@163.com',
      crypt('@Me_Helvent26%_x', gen_salt('bf')),
      now(),
      '{"full_name": "Helvent"}',
      now(),
      now(),
      '',
      '',
      '',
      ''
    )
    RETURNING id, email
  `);

  console.log(`User created: ${rows[0].email} (id: ${rows[0].id})`);

  // Also insert profile
  await client.query(`
    INSERT INTO public.profiles (id, email, full_name)
    VALUES ($1, 'helvent_art@163.com', 'Helvent')
    ON CONFLICT (id) DO UPDATE SET email = 'helvent_art@163.com', full_name = 'Helvent'
  `, [rows[0].id]);

  console.log('Profile created.');

  // Create some sample comments and contact messages
  const postsResult = await client.query(`SELECT id, slug FROM public.posts LIMIT 2`);
  if (postsResult.rows.length > 0) {
    for (const post of postsResult.rows) {
      await client.query(`
        INSERT INTO public.comments (post_id, author_name, author_email, content, is_approved)
        VALUES ($1, '访客', 'guest@example.com', '好文章！期待更多内容。', true)
      `, [post.id]);
    }
    console.log(`Created ${postsResult.rows.length} sample comments.`);
  }

  console.log('\nDone! You can now sign in with:');
  console.log('  Email:    helvent_art@163.com');
  console.log('  Password: @Me_Helvent26%_x');

  await client.end();
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
