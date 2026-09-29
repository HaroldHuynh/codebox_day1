-- Rebuild the application profile table. Passwords belong only in auth.users,
-- managed by Supabase Auth; this table stores public profile fields.
drop table if exists public.users cascade;

create table public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  first_name text not null check (length(trim(first_name)) > 0),
  last_name text not null check (length(trim(last_name)) > 0),
  email text not null unique check (length(trim(email)) > 0),
  created_at timestamptz not null default timezone('utc', now())
);

alter table public.users enable row level security;

-- The backend uses the service-role key for profile creation and reads.
-- No client-side policy exposes profile rows directly.
