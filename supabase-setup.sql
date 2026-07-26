-- Talbots Take Traverse City shared state
-- Run this entire script once in Supabase → SQL Editor → New query.

create table if not exists public.trip_app_state (
  state_key text primary key,
  state_value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.trip_app_state enable row level security;

-- This is a private, low-risk family vacation app without user accounts.
-- The public browser key may read and update only this app-state table.
create policy "family can read trip state"
on public.trip_app_state
for select
to anon, authenticated
using (true);

create policy "family can create trip state"
on public.trip_app_state
for insert
to anon, authenticated
with check (state_key in ('favorites', 'plan', 'bed_claims'));

create policy "family can update trip state"
on public.trip_app_state
for update
to anon, authenticated
using (state_key in ('favorites', 'plan', 'bed_claims'))
with check (state_key in ('favorites', 'plan', 'bed_claims'));

insert into public.trip_app_state (state_key, state_value)
values
  ('favorites', '[]'::jsonb),
  ('plan', '{}'::jsonb),
  ('bed_claims', '{}'::jsonb)
on conflict (state_key) do nothing;

-- Add this table to Supabase Realtime so updates appear on every phone.
alter publication supabase_realtime add table public.trip_app_state;
