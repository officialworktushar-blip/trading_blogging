alter table public.posts
  add column if not exists sub_heading text,
  add column if not exists author text,
  add column if not exists featured boolean not null default false,
  add column if not exists cover_image_alt text,
  add column if not exists cover_image_note text;

create unique index if not exists posts_slug_key on public.posts (slug);
