-- Gift claims for limited wedding presents.
-- Run this in the Supabase SQL Editor.

create table if not exists public.gift_claims (
  gift_id text primary key,
  claimed_at timestamptz not null default now(),
  guest_name text null
);

alter table public.gift_claims enable row level security;

grant select, insert on table public.gift_claims to anon, authenticated;

-- Guests can read which gifts are already claimed.
drop policy if exists "Anyone can read gift claims" on public.gift_claims;
create policy "Anyone can read gift claims"
  on public.gift_claims
  for select
  to anon, authenticated
  using (true);

-- Guests can claim a gift once (PK enforces uniqueness).
drop policy if exists "Anyone can insert gift claims" on public.gift_claims;
create policy "Anyone can insert gift claims"
  on public.gift_claims
  for insert
  to anon, authenticated
  with check (true);

-- No public update/delete: reopen items from the Supabase dashboard
-- (Table Editor) or with the service role key.
