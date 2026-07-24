import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import matter from 'gray-matter';

// ---------------------------------------------------------------------------
// Path alias resolver (tsx does not resolve `@/` automatically)
// ---------------------------------------------------------------------------
const SRC_ROOT = path.resolve(__dirname, '..', 'src');

function resolveAlias(id: string): string {
  if (id.startsWith('@/')) {
    return path.join(SRC_ROOT, id.slice(2));
  }
  return id;
}

// ---------------------------------------------------------------------------
// Load config
// ---------------------------------------------------------------------------
const configPath = path.join(__dirname, 'seed-config.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf-8')) as {
  categories: { name: string; slug: string; description: string }[];
  tags: { name: string; slug: string }[];
};

// ---------------------------------------------------------------------------
// Markdown frontmatter type
// ---------------------------------------------------------------------------
interface PostFrontmatter {
  title: string;
  slug: string;
  excerpt: string;
  date: string;
  category: string;
  tags: string[];
  published: boolean;
  featured?: boolean;
}

interface SeedPost extends PostFrontmatter {
  body_markdown: string;
}

// ---------------------------------------------------------------------------
// Load .env.local
// ---------------------------------------------------------------------------
const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const value = trimmed.slice(eqIdx + 1).trim();
    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function log(tag: string, msg: string): void {
  console.log(`\x1b[36m[${tag.toUpperCase()}]\x1b[0m ${msg}`);
}

async function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

// ---------------------------------------------------------------------------
// Main seed function
// ---------------------------------------------------------------------------
async function seed() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    console.error(
      '\x1b[31mError:\x1b[0m Missing environment variables.\n' +
        '  NEXT_PUBLIC_SUPABASE_URL  — Supabase project URL\n' +
        '  SUPABASE_SERVICE_ROLE_KEY — Service role key (from Dashboard → Settings → API)\n'
    );
    process.exit(1);
  }

  const admin = createClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  log('init', `Connecting to Supabase at ${new URL(supabaseUrl).hostname}`);

  // -----------------------------------------------------------------------
  // 1. Ensure auth.users table exists by checking profiles
  // -----------------------------------------------------------------------
  const { error: profileCheckErr } = await admin
    .from('profiles')
    .select('id')
    .limit(1);

  if (profileCheckErr) {
    console.error('\x1b[31mError:\x1b[0m Cannot access profiles table.');
    console.error(profileCheckErr.message);
    console.error('\nMake sure you have run seeds/sql-schema.sql first.');
    process.exit(1);
  }
  log('init', 'Database tables accessible.');

  // -----------------------------------------------------------------------
  // 2. Seed categories
  // -----------------------------------------------------------------------
  log('categories', `Processing ${config.categories.length} categories...`);

  for (const cat of config.categories) {
    const { data: existing, error: fetchErr } = await admin
      .from('categories')
      .select('id')
      .eq('slug', cat.slug)
      .single();

    if (fetchErr && fetchErr.code !== 'PGRST116') {
      console.error(`Failed to query category "${cat.name}":`, fetchErr.message);
      continue;
    }

    const payload = {
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
    };

    let upsertResult: { id?: string } = {};
    let upsertErr: unknown;
    if (existing) {
      const result = await admin
        .from('categories')
        .update(payload)
        .eq('id', existing.id)
        .select()
        .single();
      upsertResult = (result.data as { id?: string }) ?? {};
      upsertErr = result.error;
    } else {
      const result = await admin
        .from('categories')
        .insert(payload)
        .select()
        .single();
      upsertResult = (result.data as { id?: string }) ?? {};
      upsertErr = result.error;
    }

    if (upsertErr) {
      console.error(`Failed to seed category "${cat.name}":`, String(upsertErr));
    } else {
      log('categories', `${existing ? 'Updated' : 'Created'} → ${cat.name}`);
    }
  }

  // -----------------------------------------------------------------------
  // 3. Seed tags
  // -----------------------------------------------------------------------
  log('tags', `Processing ${config.tags.length} tags...`);

  const tagMap = new Map<string, string>(); // slug → id

  for (const tag of config.tags) {
    const { data: existing, error: fetchErr } = await admin
      .from('tags')
      .select('id')
      .eq('slug', tag.slug)
      .single();

    if (fetchErr && fetchErr.code !== 'PGRST116') {
      console.error(`Failed to query tag "${tag.name}":`, fetchErr.message);
      continue;
    }

    const payload = { name: tag.name, slug: tag.slug };

    let upsertResult: { id: string } | undefined;
    let upsertErr: unknown;
    if (existing) {
      const result = await admin
        .from('tags')
        .update(payload)
        .eq('id', existing.id)
        .select()
        .single();
      upsertResult = result.data as { id: string } | undefined;
      upsertErr = result.error;
    } else {
      const result = await admin
        .from('tags')
        .insert(payload)
        .select()
        .single();
      upsertResult = result.data as { id: string } | undefined;
      upsertErr = result.error;
    }

    if (upsertErr) {
      console.error(`Failed to seed tag "${tag.name}":`, String(upsertErr));
    } else if (upsertResult?.id) {
      tagMap.set(tag.slug, upsertResult?.id ?? '');
      log('tags', `${existing ? 'Updated' : 'Created'} → ${tag.name}`);
    }
  }

  // -----------------------------------------------------------------------
  // 4. Load MDX posts
  // -----------------------------------------------------------------------
  const postsDir = path.join(__dirname, '..', 'content', 'posts');
  const mdxFiles = fs
    .readdirSync(postsDir)
    .filter((f) => f.endsWith('.mdx'))
    .sort();

  log('posts', `Found ${mdxFiles.length} MDX files to seed.`);

  const postIds: string[] = [];

  for (const filename of mdxFiles) {
    const filePath = path.join(postsDir, filename);
    const raw = fs.readFileSync(filePath, 'utf-8');
    const parsed = matter(raw);
    const fm = parsed.data as unknown as PostFrontmatter;
    const body = parsed.content;

    // Validate required fields
    if (!fm.title || !fm.slug) {
      console.error(`Skipping "${filename}" — missing title or slug in frontmatter.`);
      continue;
    }

    // Find category id by name (MDX frontmatter uses Chinese names)
    const categoryResult = await admin
      .from('categories')
      .select('id')
      .eq('name', fm.category)
      .single();

    const categoryId =
      categoryResult.data?.id ??
      (() => {
        console.warn(`Category "${fm.category}" not found, skipping post "${fm.slug}".`);
        return null;
      })();

    if (!categoryId) continue;

    // Find tag ids
    const tagIds = fm.tags
      .map((t) => tagMap.get(t))
      .filter((id): id is string => !!id);

    // Build post record
    const publishedAt = fm.date ? new Date(fm.date).toISOString() : new Date().toISOString();

    const postData = {
      title: fm.title,
      slug: fm.slug,
      excerpt: fm.excerpt,
      body_markdown: body,
      status: fm.published ? ('published' as const) : ('draft' as const),
      featured: fm.featured ?? false,
      published_at: publishedAt,
      meta_title: fm.title,
      meta_description: fm.excerpt,
    };

    // Upsert post by slug
    const { data: existingPost, error: fetchErr } = await admin
      .from('posts')
      .select('id')
      .eq('slug', fm.slug)
      .single();

    if (fetchErr && fetchErr.code !== 'PGRST116') {
      console.error(`Failed to query post "${fm.slug}":`, fetchErr.message);
      continue;
    }

    let postId: string;

    if (existingPost) {
      const { data: updated, error: upsertErr } = await admin
        .from('posts')
        .update(postData)
        .eq('id', existingPost.id)
        .select('id')
        .single();

      if (upsertErr) {
        console.error(`Failed to update post "${fm.slug}":`, String(upsertErr));
        continue;
      }
      postId = updated!.id;
      log('posts', `Updated → ${fm.title}`);
    } else {
      const { data: inserted, error: upsertErr } = await admin
        .from('posts')
        .insert({ ...postData })
        .select('id')
        .single();

      if (upsertErr) {
        console.error(`Failed to insert post "${fm.slug}":`, String(upsertErr));
        continue;
      }
      postId = inserted!.id;
      log('posts', `Created → ${fm.title}`);
    }

    postIds.push(postId);

    // Link post → category
    await sleep(50); // avoid tiny burst
    const { error: pcErr } = await admin.from('post_categories').insert({
      post_id: postId,
      category_id: categoryId,
    });
    if (pcErr) console.error(`post_categories insert failed for ${fm.slug}:`, pcErr.message);

    // Link post → tags
    for (const tagId of tagIds) {
      await sleep(50);
      const { error: ptErr } = await admin.from('post_tags').insert({
        post_id: postId,
        tag_id: tagId,
      });
      if (ptErr) console.error(`post_tags insert failed for ${fm.slug}:`, ptErr.message);
    }
  }

  // -----------------------------------------------------------------------
  // Summary
  // -----------------------------------------------------------------------
  log('done', `Seed complete. ${postIds.length} posts processed.`);
  console.log('\n\x1b[32m✓ Seed finished successfully.\x1b[0m');
}

seed().catch((err) => {
  console.error('\x1b[31mSeed failed:\x1b[0m', err);
  process.exit(1);
});
