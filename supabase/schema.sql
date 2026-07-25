-- Gift claims for limited wedding presents.
-- Run this in the Supabase SQL Editor.

-- ---------------------------------------------------------------------------
-- Table: one row per reservation (a gift may be claimed up to claimLimit times)
-- ---------------------------------------------------------------------------

create table if not exists public.gift_claims (
  id uuid primary key default gen_random_uuid(),
  gift_id text not null,
  claimed_at timestamptz not null default now(),
  guest_name text null
);

-- Migrate from the previous single-claim schema (gift_id as primary key).
do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'gift_claims'
      and column_name = 'gift_id'
  ) and not exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'gift_claims'
      and column_name = 'id'
  ) then
    alter table public.gift_claims add column id uuid;
    update public.gift_claims set id = gen_random_uuid() where id is null;
    alter table public.gift_claims drop constraint if exists gift_claims_pkey;
    alter table public.gift_claims alter column id set default gen_random_uuid();
    alter table public.gift_claims alter column id set not null;
    alter table public.gift_claims add primary key (id);
  end if;
end $$;

create index if not exists gift_claims_gift_id_idx
  on public.gift_claims (gift_id);

alter table public.gift_claims enable row level security;

grant select, insert on table public.gift_claims to anon, authenticated;

-- Guests can read which gifts are already claimed.
drop policy if exists "Anyone can read gift claims" on public.gift_claims;
create policy "Anyone can read gift claims"
  on public.gift_claims
  for select
  to anon, authenticated
  using (true);

-- Direct inserts remain allowed for backwards compatibility.
-- Prefer public.claim_gift for atomic limit checks.
drop policy if exists "Anyone can insert gift claims" on public.gift_claims;
create policy "Anyone can insert gift claims"
  on public.gift_claims
  for insert
  to anon, authenticated
  with check (true);

-- No public update/delete: reopen items from the Supabase dashboard
-- (Table Editor) or with the service role key.

-- ---------------------------------------------------------------------------
-- Atomic claim with a per-gift reservation limit
-- Returns: 'claimed' | 'already_claimed' | 'error'
-- ---------------------------------------------------------------------------

create or replace function public.claim_gift(
  p_gift_id text,
  p_claim_limit integer,
  p_guest_name text default null
)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  current_count integer;
  normalized_name text;
begin
  if p_gift_id is null or length(trim(p_gift_id)) = 0 then
    return 'error';
  end if;
  if p_claim_limit is null or p_claim_limit < 1 then
    return 'error';
  end if;

  perform pg_advisory_xact_lock(hashtext(trim(p_gift_id)));

  select count(*)::integer
  into current_count
  from public.gift_claims
  where gift_id = trim(p_gift_id);

  if current_count >= p_claim_limit then
    return 'already_claimed';
  end if;

  normalized_name := nullif(trim(coalesce(p_guest_name, '')), '');

  insert into public.gift_claims (gift_id, guest_name)
  values (trim(p_gift_id), normalized_name);

  return 'claimed';
end;
$$;

grant execute on function public.claim_gift(text, integer, text) to anon, authenticated;
