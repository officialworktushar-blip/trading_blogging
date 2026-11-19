-- TradeLens: posts table
-- Run in the Supabase SQL editor or via `supabase db push`.

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text,
  content text not null default '',
  cover_image_url text,
  category text not null default 'General',
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists posts_published_created_idx
  on public.posts (published, created_at desc);

create index if not exists posts_category_idx
  on public.posts (category);

-- Keep updated_at fresh
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists posts_set_updated_at on public.posts;
create trigger posts_set_updated_at
  before update on public.posts
  for each row execute function public.set_updated_at();

-- Row Level Security: public read of published posts, admin full access.
-- NOTE: replace 'authenticated' checks with your admin-user policy as needed.
alter table public.posts enable row level security;

create policy "Public can read published posts"
  on public.posts for select
  to anon
  using (published = true);

create policy "Authenticated can read all posts"
  on public.posts for select
  to authenticated
  using (true);

create policy "Authenticated can insert posts"
  on public.posts for insert
  to authenticated
  with check (true);

create policy "Authenticated can update posts"
  on public.posts for update
  to authenticated
  using (true)
  with check (true);

create policy "Authenticated can delete posts"
  on public.posts for delete
  to authenticated
  using (true);
