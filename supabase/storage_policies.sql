create table if not exists public.admin_users (
  email text primary key,
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;

drop policy if exists "admin_users_select_own" on public.admin_users;
create policy "admin_users_select_own"
on public.admin_users for select to authenticated
using (lower(email) = lower(coalesce(auth.jwt() ->> 'email', '')));

grant select on public.admin_users to authenticated;

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_users au
    where lower(au.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'blog-images',
  'blog-images',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']::text[]
)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

alter table storage.objects enable row level security;

drop policy if exists "blog_images_public_select" on storage.objects;
create policy "blog_images_public_select"
on storage.objects for select
using (bucket_id = 'blog-images');

drop policy if exists "blog_images_admin_insert" on storage.objects;
create policy "blog_images_admin_insert"
on storage.objects for insert to authenticated
with check (bucket_id = 'blog-images' and public.is_admin());

drop policy if exists "blog_images_admin_update" on storage.objects;
create policy "blog_images_admin_update"
on storage.objects for update to authenticated
using (bucket_id = 'blog-images' and public.is_admin())
with check (bucket_id = 'blog-images' and public.is_admin());

drop policy if exists "blog_images_admin_delete" on storage.objects;
create policy "blog_images_admin_delete"
on storage.objects for delete to authenticated
using (bucket_id = 'blog-images' and public.is_admin());
