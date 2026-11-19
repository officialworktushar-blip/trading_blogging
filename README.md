# TradeLens

A trading education blog built with Next.js 16 App Router, TypeScript, Tailwind CSS, Supabase, Motion, and TipTap.

## Local development

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy the environment template and fill in your values:

   ```bash
   cp .env.example .env.local
   ```

3. Run the Supabase SQL files in the order listed under [Supabase setup](#supabase-setup).

4. Start the app:

   ```bash
   npm run dev
   ```

5. Open `http://localhost:3000`. Admin login is at `http://localhost:3000/admin/login`.

## Environment variables

Use `.env.local` locally and Project Settings in Vercel for production. Never commit `.env.local`.

| Variable | Description |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Project URL, for example `https://your-project.supabase.co`. Used by the server client, browser client, middleware, and Next image remote patterns. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key. This is public by design; access control must be enforced with RLS. |
| `NEXT_PUBLIC_SITE_URL` | Public site URL used for canonical URLs, metadata, Open Graph, and robots. Use `http://localhost:3000` locally and the production domain in Vercel. |

No service-role key is required by this app. Do not add a Supabase service-role key to a `NEXT_PUBLIC_*` variable.

## Supabase setup

Run these files in the Supabase SQL editor in this order:

1. `supabase/migrations/0001_init.sql` — creates `public.posts`, indexes, the `updated_at` trigger, and base RLS policies.
2. `supabase/admin_schema.sql` — adds editor fields such as `sub_heading`, `author`, `featured`, `cover_image_alt`, and `cover_image_note`.
3. `supabase/storage_policies.sql` — creates `public.admin_users`, `public.is_admin()`, and the public `blog-images` bucket with admin-only write policies.
4. `supabase/schema_support.sql` — creates `public.support_requests` with public insert and admin-only read/update policies.
5. Optional: `supabase/seed.sql` — inserts 15 published educational sample articles. It also adds `author_name`, `published_at`, and `status` compatibility columns.

Security note: the base migration currently grants full post CRUD to any `authenticated` Supabase user. Before exposing the app to real users, replace those `posts` policies with admin-scoped policies using `public.is_admin()` so only allowlisted admins can read drafts or write posts.

## Add an admin

Admin access requires both a Supabase Auth user and a row in `public.admin_users`.

1. In Supabase, go to **Authentication → Users → Add user**.
2. Create a user with the admin email and password. Store the password only in Supabase Auth, not in this repository.
3. Confirm the user if email confirmation is enabled.
4. Add the same email to the admin allowlist:

   ```sql
   insert into public.admin_users (email)
   values ('admin@example.com')
   on conflict (email) do nothing;
   ```

5. Visit `/admin/login` and sign in with that Supabase Auth email and password.

The middleware and login action compare the authenticated user email against `public.admin_users`. The `public.is_admin()` database helper uses the same allowlist for Storage and support-request RLS policies.

## Add a blog post

1. Sign in at `/admin/login`.
2. Open **Add New Blog** from the admin navigation, or go to `/admin/blogs/new`.
3. Fill in the required fields:
   - Heading
   - Short description
   - Content
4. Optional fields:
   - Sub heading
   - Author
   - Category
   - Slug
   - Cover image, alt text, and image note
   - Featured flag
   - Status: Draft or Published
5. Cover images and inline editor images are uploaded to the `blog-images` Storage bucket. Uploaded images are converted to WebP and resized by the client before upload.
6. Save the post. The app redirects to `/admin/blogs` and revalidates the public pages.
7. Use **Publish** or **Unpublish** in the blog table to change visibility. Drafts are excluded from all public post queries and from anon RLS reads.

## Project structure

```text
app/                    App Router pages and server actions
  admin/                CMS pages, auth actions, blog actions
  blog/                 Public blog list and post detail
  [category]/           Public category landing pages
components/             Shared UI
components/admin/       Admin shell, blog form, TipTap editor
components/animations/  Motion wrappers and decorative animations
lib/                    Supabase clients, SEO helpers, site config, upload helpers
supabase/               SQL schema, policies, and seed content
```

## Scripts

- `npm run dev` — start the development server
- `npm run build` — create a production build
- `npm run start` — serve a production build
- `npm run lint` — run ESLint

## Vercel deployment

1. Push the project to GitHub, GitLab, or Bitbucket.
2. In Vercel, choose **Add New → Project** and import the repository.
3. Keep the framework preset as Next.js and the build command as `npm run build`.
4. Add these Vercel environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_SITE_URL=https://your-production-domain.com`
5. Deploy.
6. In the same Supabase project used by Vercel, run the SQL setup files and add the admin auth user plus the matching `public.admin_users` row.
7. Verify `/`, `/blog`, `/admin/login`, and the production canonical URL after deployment.

## Notes

- Blog and category routes use `export const dynamic = "force-dynamic"`; there is no static-generation step for posts.
- Server actions call `revalidatePath` after admin mutations.
- Public content is educational only; trading involves risk and is not financial advice.
