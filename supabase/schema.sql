-- ============================================================================
-- The Han Studio — Supabase schema
-- Run this in the SQL editor of your Supabase project (one-time setup).
-- ============================================================================

-- 1. Profiles (mirrors auth.users, holds role + display name)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  full_name text,
  role text not null default 'student' check (role in ('student','admin')),
  archived boolean not null default false,
  created_at timestamptz not null default now()
);

-- 2. Allowed-emails gate (who can create an account)
create table if not exists public.allowed_emails (
  email text primary key,
  full_name text,
  added_at timestamptz not null default now()
);

-- 3. Key/value settings (announcement, lessons_per_semester, studio defaults…)
create table if not exists public.settings (
  key text primary key,
  value text,
  updated_at timestamptz not null default now()
);

-- 4. Lesson slots
create table if not exists public.slots (
  id uuid primary key default gen_random_uuid(),
  slot_date date not null,
  slot_time time not null,
  duration_min int not null default 60,
  booked_by uuid references public.profiles(id) on delete set null,
  restricted_to uuid[],
  note text,
  created_at timestamptz not null default now(),
  unique (slot_date, slot_time)
);

-- 5. Studio class sessions
create table if not exists public.studio_class (
  id uuid primary key default gen_random_uuid(),
  session_date date not null,
  session_time time not null default '19:30',
  location text,
  cancelled boolean not null default false,
  created_at timestamptz not null default now()
);

-- 6. Studio class pieces (a student's sign-up for a session)
create table if not exists public.studio_pieces (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.studio_class(id) on delete cascade,
  student_id uuid not null references public.profiles(id) on delete cascade,
  piece text not null,
  created_at timestamptz not null default now()
);

-- 7. Swap requests (student ↔ student lesson swap, pending Chi Ho's policy)
create table if not exists public.swap_requests (
  id uuid primary key default gen_random_uuid(),
  requester_id uuid not null references public.profiles(id) on delete cascade,
  requester_slot_id uuid not null references public.slots(id) on delete cascade,
  target_id uuid not null references public.profiles(id) on delete cascade,
  target_slot_id uuid not null references public.slots(id) on delete cascade,
  message text,
  status text not null default 'pending' check (status in ('pending','accepted','declined','cancelled')),
  created_at timestamptz not null default now(),
  responded_at timestamptz
);

-- ----------------------------------------------------------------------------
-- accept_swap_request(req_id) — atomically swap booked_by on two slots
-- and mark the swap request as accepted.
-- ----------------------------------------------------------------------------
create or replace function public.accept_swap_request(req_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  r record;
begin
  select * into r from swap_requests where id = req_id and status = 'pending' for update;
  if not found then raise exception 'swap request not found or not pending'; end if;

  update slots set booked_by = r.target_id    where id = r.requester_slot_id;
  update slots set booked_by = r.requester_id where id = r.target_slot_id;
  update swap_requests set status = 'accepted', responded_at = now() where id = req_id;
end;
$$;

-- ----------------------------------------------------------------------------
-- Auto-create a profile row when a new user signs up.
-- Role is determined by email match with VITE_ADMIN_EMAIL (set at app layer)
-- OR by presence in allowed_emails. Admin privileges default off; flip manually
-- via: update profiles set role='admin' where email='chiho@example.com';
-- ----------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', ''));
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ----------------------------------------------------------------------------
-- RLS — basic policies (students read their own, admin reads all, etc.)
-- Tune these to your needs before going to production.
-- ----------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.settings enable row level security;
alter table public.slots enable row level security;
alter table public.studio_class enable row level security;
alter table public.studio_pieces enable row level security;
alter table public.swap_requests enable row level security;
alter table public.allowed_emails enable row level security;

create policy "profiles are readable by authenticated"
  on public.profiles for select to authenticated using (true);
create policy "users update own profile"
  on public.profiles for update to authenticated using (auth.uid() = id);

create policy "settings readable by authenticated"
  on public.settings for select to authenticated using (true);
create policy "settings writable by admin"
  on public.settings for all to authenticated
  using (exists (select 1 from profiles where id = auth.uid() and role = 'admin'))
  with check (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));

create policy "slots readable by authenticated"
  on public.slots for select to authenticated using (true);
create policy "students book/unbook their own slots"
  on public.slots for update to authenticated
  using (booked_by is null or booked_by = auth.uid()
         or exists (select 1 from profiles where id = auth.uid() and role = 'admin'))
  with check (true);
create policy "admin manages slots"
  on public.slots for insert to authenticated
  with check (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));
create policy "admin deletes slots"
  on public.slots for delete to authenticated
  using (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));

create policy "studio class readable" on public.studio_class for select to authenticated using (true);
create policy "admin writes studio class"
  on public.studio_class for all to authenticated
  using (exists (select 1 from profiles where id = auth.uid() and role = 'admin'))
  with check (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));

create policy "studio pieces readable" on public.studio_pieces for select to authenticated using (true);
create policy "students manage their own pieces"
  on public.studio_pieces for all to authenticated
  using (student_id = auth.uid()
         or exists (select 1 from profiles where id = auth.uid() and role = 'admin'))
  with check (student_id = auth.uid()
         or exists (select 1 from profiles where id = auth.uid() and role = 'admin'));

create policy "swap readable by involved parties" on public.swap_requests for select to authenticated
  using (requester_id = auth.uid() or target_id = auth.uid()
         or exists (select 1 from profiles where id = auth.uid() and role = 'admin'));
create policy "students create swaps" on public.swap_requests for insert to authenticated
  with check (requester_id = auth.uid());
create policy "target/requester update swap" on public.swap_requests for update to authenticated
  using (requester_id = auth.uid() or target_id = auth.uid());

create policy "allowed emails readable by authenticated" on public.allowed_emails for select to authenticated using (true);
create policy "admin manages allowed emails" on public.allowed_emails for all to authenticated
  using (exists (select 1 from profiles where id = auth.uid() and role = 'admin'))
  with check (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));

-- ----------------------------------------------------------------------------
-- Realtime — enable replication on mutable tables
-- ----------------------------------------------------------------------------
alter publication supabase_realtime add table public.slots;
alter publication supabase_realtime add table public.settings;
alter publication supabase_realtime add table public.studio_class;
alter publication supabase_realtime add table public.studio_pieces;
alter publication supabase_realtime add table public.swap_requests;

-- ----------------------------------------------------------------------------
-- Seed default settings
-- ----------------------------------------------------------------------------
insert into public.settings (key, value) values
  ('lessons_per_semester', '14'),
  ('studio_default_weekday', '3'),
  ('studio_default_time', '19:30'),
  ('studio_default_location', 'MA 405'),
  ('studio_default_weeks_ahead', '8'),
  ('studio_skip_dates', '[]'),
  ('announcement', ''),
  ('announcements_page', '')
on conflict (key) do nothing;
