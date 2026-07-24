-- =============================================================================
-- Helvent Blog Database Schema
-- Supabase / PostgreSQL migration
-- =============================================================================

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Custom types
-- ---------------------------------------------------------------------------

create type public.content_status as enum ('draft', 'published', 'archived');

-- ---------------------------------------------------------------------------
-- Profiles (extends auth.users)
-- ---------------------------------------------------------------------------

create table public.profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  email      text    not null unique,
  full_name  text,
  headline   text,
  bio        text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.profiles is 'User profile information extending Supabase auth.users';

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data ->> 'full_name');
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Categories
-- ---------------------------------------------------------------------------

create table public.categories (
  id          uuid primary key default gen_random_uuid(),
  name        text    not null unique,
  slug        text    not null unique,
  description text,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

comment on table public.categories is 'Blog post categories (技术、前端、全栈等)';

-- ---------------------------------------------------------------------------
-- Tags
-- ---------------------------------------------------------------------------

create table public.tags (
  id         uuid primary key default gen_random_uuid(),
  name       text    not null unique,
  slug       text    not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.tags is 'Blog post tags for cross-category metadata';

-- ---------------------------------------------------------------------------
-- Posts
-- ---------------------------------------------------------------------------

create table public.posts (
  id              uuid primary key default gen_random_uuid(),
  title           text    not null,
  slug            text    not null unique,
  excerpt         text,
  body_markdown   text    not null default '',
  cover_image     text,
  status          content_status not null default 'draft',
  featured        boolean not null default false,
  published_at    timestamptz,
  author_id       uuid references public.profiles(id) on delete set null,
  meta_title      text,
  meta_description text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  deleted_at      timestamptz
);

comment on table public.posts is 'Blog posts with Markdown/MDX body content';

-- ---------------------------------------------------------------------------
-- Post-Category (many-to-many)
-- ---------------------------------------------------------------------------

create table public.post_categories (
  post_id     uuid not null references public.posts(id) on delete cascade,
  category_id uuid not null references public.categories(id) on delete cascade,
  primary key (post_id, category_id)
);

-- ---------------------------------------------------------------------------
-- Post-Tag (many-to-many)
-- ---------------------------------------------------------------------------

create table public.post_tags (
  post_id uuid not null references public.posts(id) on delete cascade,
  tag_id  uuid not null references public.tags(id) on delete cascade,
  primary key (post_id, tag_id)
);

-- ---------------------------------------------------------------------------
-- Comments
-- ---------------------------------------------------------------------------

create table public.comments (
  id              uuid primary key default gen_random_uuid(),
  post_id         uuid         not null references public.posts(id) on delete cascade,
  author_name     text         not null,
  author_email    text,
  content         text         not null,
  is_approved     boolean      not null default false,
  parent_comment_id uuid references public.comments(id) on delete cascade,
  created_at      timestamptz  not null default now(),
  updated_at      timestamptz  not null default now()
);

comment on table public.comments is 'Blog comments with nested reply support';

-- ---------------------------------------------------------------------------
-- Contact Messages
-- ---------------------------------------------------------------------------

create table public.contact_messages (
  id         uuid primary key default gen_random_uuid(),
  name       text    not null,
  email      text    not null,
  subject    text    not null,
  message    text    not null,
  is_read    boolean not null default false,
  created_at timestamptz not null default now()
);

comment on table public.contact_messages is 'Visitor contact form submissions';

-- ---------------------------------------------------------------------------
-- Media Assets
-- ---------------------------------------------------------------------------

create table public.media_assets (
  id           uuid primary key default gen_random_uuid(),
  label        text,
  alt_text     text,
  bucket_name  text    not null,
  object_path  text    not null,
  mime_type    text,
  file_size    integer,
  uploaded_by  uuid references public.profiles(id) on delete set null,
  is_public    boolean not null default true,
  created_at   timestamptz not null default now()
);

comment on table public.media_assets is 'Tracks media files stored in Supabase Storage';

-- ---------------------------------------------------------------------------
-- Row Level Security — enable on all tables
-- ---------------------------------------------------------------------------

alter table public.profiles                              enable row level security;
alter table public.posts                                 enable row level security;
alter table public.categories                            enable row level security;
alter table public.tags                                  enable row level security;
alter table public.post_categories                       enable row level security;
alter table public.post_tags                             enable row level security;
alter table public.comments                              enable row level security;
alter table public.contact_messages                      enable row level security;
alter table public.media_assets                          enable row level security;

-- ---------------------------------------------------------------------------
-- RLS Policies — Profiles
-- ---------------------------------------------------------------------------

create policy "Public profiles are viewable"
  on profiles for select
  using (true);

create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = id);

-- ---------------------------------------------------------------------------
-- RLS Policies — Posts
-- ---------------------------------------------------------------------------

create policy "Public reads published posts"
  on posts for select
  using (status = 'published' and deleted_at is null);

create policy "Authors manage own posts"
  on posts for all
  using (auth.uid() = author_id);

-- ---------------------------------------------------------------------------
-- RLS Policies — Categories & Tags
-- ---------------------------------------------------------------------------

create policy "Public reads categories"
  on categories for select
  using (true);

create policy "Public reads tags"
  on tags for select
  using (true);

-- ---------------------------------------------------------------------------
-- RLS Policies — Post-Category / Post-Tag
-- ---------------------------------------------------------------------------

create policy "Public reads post-categories"
  on post_categories for select
  using (exists (
    select 1 from public.posts p
    where p.id = post_categories.post_id
      and p.status = 'published'
      and p.deleted_at is null
  ));

create policy "Public reads post-tags"
  on post_tags for select
  using (exists (
    select 1 from public.posts p
    where p.id = post_tags.post_id
      and p.status = 'published'
      and p.deleted_at is null
  ));

-- ---------------------------------------------------------------------------
-- RLS Policies — Comments
-- ---------------------------------------------------------------------------

create policy "Public reads approved comments"
  on comments for select
  using (is_approved = true);

create policy "Users can create comments"
  on comments for insert
  with check (auth.role() = 'authenticated');

-- ---------------------------------------------------------------------------
-- RLS Policies — Contact Messages
-- ---------------------------------------------------------------------------

create policy "Anyone can submit contact messages"
  on contact_messages for insert
  with check (true);

-- ---------------------------------------------------------------------------
-- RLS Policies — Media Assets
-- ---------------------------------------------------------------------------

create policy "Public reads media"
  on media_assets for select
  using (is_public = true);

-- ---------------------------------------------------------------------------
-- Triggers: updated_at auto-update
-- ---------------------------------------------------------------------------

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

create trigger set_categories_updated_at
  before update on public.categories
  for each row execute function public.set_updated_at();

create trigger set_tags_updated_at
  before update on public.tags
  for each row execute function public.set_updated_at();

create trigger set_posts_updated_at
  before update on public.posts
  for each row execute function public.set_updated_at();

create trigger set_comments_updated_at
  before update on public.comments
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Indexes
-- ---------------------------------------------------------------------------

-- Posts indexes
create index idx_posts_slug on public.posts(slug);
create index idx_posts_status_published on public.posts(created_at desc)
  where status = 'published';
create index idx_posts_published_at on public.posts(published_at desc);
create index idx_posts_author on public.posts(author_id);
create index idx_posts_featured on public.posts(created_at desc)
  where featured = true;

-- Comments indexes
create index idx_comments_post on public.comments(post_id);
create index idx_comments_approved on public.comments(is_approved);
create index idx_comments_parent on public.comments(parent_comment_id);

-- Categories / Tags slugs
create index idx_categories_slug on public.categories(slug);
create index idx_tags_slug on public.tags(slug);

-- Author name search for comments
create index idx_comments_author_name on public.comments(author_name);

-- ---------------------------------------------------------------------------
-- Storage — blog-images bucket
-- ---------------------------------------------------------------------------

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'blog-images',
  'blog-images',
  true,
  52428800,  -- 50 MB
  array['image/png', 'image/jpeg', 'image/webp', 'image/avif', 'image/gif']
)
on conflict (id) do nothing;

create policy "Public reads blog images"
  on storage.objects for select
  using (bucket_id = 'blog-images');

create policy "Authenticated uploads"
  on storage.objects for insert
  with check (bucket_id = 'blog-images' and auth.role() = 'authenticated');

create policy "Authenticated updates"
  on storage.objects for update
  using (bucket_id = 'blog-images' and auth.role() = 'authenticated');

create policy "Authenticated deletes"
  on storage.objects for delete
  using (bucket_id = 'blog-images' and auth.role() = 'authenticated');
