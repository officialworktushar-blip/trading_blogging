# TradeLens

A trading education blog built with Next.js (App Router), TypeScript, Tailwind CSS, Supabase, and TipTap.

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in your Supabase credentials
npm run dev
```

Open http://localhost:3000.

## Environment variables

| Variable | Description |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon public key |
| `NEXT_PUBLIC_SITE_URL` | Public site URL (used for metadata/OG) |

## Database setup

1. Create a Supabase project.
2. Run `supabase/migrations/0001_init.sql` in the SQL editor (or `supabase db push`).
3. The migration creates a `posts` table with RLS policies: anonymous users can read published posts; authenticated users have full access.

## Project structure

```
app/                  App Router pages
  admin/              CMS (posts list, create/edit)
  blog/               Blog listing, post detail, category pages
components/           Shared UI components
components/admin/     TipTap editor, post form, delete button
components/animations/ Motion wrappers (reduced-motion aware)
lib/                  Site config, Supabase clients, shared types
supabase/migrations/  Database schema
```

## Scripts

- `npm run dev` — start the dev server
- `npm run build` — production build
- `npm run start` — serve the production build
- `npm run lint` — ESLint

## Notes

- Admin routes (`/admin/*`) currently rely on Supabase Auth being enabled and an authenticated session; add a login page/guard before exposing them publicly.
- Blog routes use `force-dynamic` and `revalidatePath` is called after admin mutations.
