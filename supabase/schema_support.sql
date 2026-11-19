-- Support requests: anon can insert, admins can read and resolve.

create table if not exists public.support_requests (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  topic text not null,
  message text not null,
  resolved boolean not null default false,
  resolved_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.support_requests enable row level security;

grant insert on public.support_requests to anon, authenticated;
grant select, update (resolved, resolved_at) on public.support_requests to authenticated;

drop policy if exists "support_requests_insert_public" on public.support_requests;
create policy "support_requests_insert_public"
on public.support_requests for insert
to anon, authenticated
with check (true);

drop policy if exists "support_requests_select_admin" on public.support_requests;
create policy "support_requests_select_admin"
on public.support_requests for select
to authenticated
using (public.is_admin());

drop policy if exists "support_requests_update_admin" on public.support_requests;
create policy "support_requests_update_admin"
on public.support_requests for update
to authenticated
using (public.is_admin())
with check (public.is_admin());
