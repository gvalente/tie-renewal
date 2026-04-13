-- Step 1: profiles table (1:1 with auth.users)
-- Run this in the Supabase SQL editor (Dashboard → SQL Editor → New query)

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  subscription_tier text not null default 'free', -- 'free' | 'pro'
  stripe_customer_id text,
  stripe_payment_intent_id text,
  pro_activated_at timestamptz,
  created_at timestamptz default now()
);

-- Auto-create a 'free' profile row whenever a new user signs up
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into profiles (id) values (new.id)
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- RLS: users can only read their own profile row
alter table profiles enable row level security;

create policy "Users can read own profile"
  on profiles for select
  using (auth.uid() = id);

-- Only the service role (webhook handler) can update subscription_tier
-- No UPDATE policy for authenticated users — upgrades happen only via webhook
