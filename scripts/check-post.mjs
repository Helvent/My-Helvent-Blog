import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load .env.local manually
const envPath = path.resolve(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
const env = {};
envContent.split('\n').forEach(line => {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith('#')) {
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx > 0) {
      env[trimmed.slice(0, eqIdx)] = trimmed.slice(eqIdx + 1).replace(/^['"]|['"]$/g, '');
    }
  }
});

const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY
);

async function main() {
  const slug = '测试';
  console.log('Querying slug:', slug);
  
  const { data, error } = await supabase
    .from('posts')
    .select('id,slug,status,title,body_markdown')
    .eq('slug', slug);
  
  console.log('Posts:', JSON.stringify(data, null, 2));
  console.log('Error:', error);
  console.log('Count:', data?.length);

  // Try with service_role key
  const { data: data2 } = await supabase
    .from('posts')
    .select('id,slug,status,title')
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle();
  
  console.log('Published match:', JSON.stringify(data2));
}

main().catch(console.error);
