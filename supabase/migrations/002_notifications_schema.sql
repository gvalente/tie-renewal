-- Migration 002: notifications_log table + tie_records notify columns
-- These were applied directly to the DB; this file documents the schema for reference.

-- notifications_log: one row per email sent (deduplication + audit trail)
create table if not exists notifications_log (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null references profiles(id) on delete cascade,
  notification_type text not null,
  sent_at          timestamptz default now()
);

alter table notifications_log enable row level security;

-- Users can read their own notification history; writes are service-role only
create policy "Users can read own notifications"
  on notifications_log for select
  using (auth.uid() = user_id);

-- Index for the daily dedup query in the cron (gte sent_at)
create index if not exists notifications_log_sent_at_idx
  on notifications_log (user_id, notification_type, sent_at);

-- tie_records: notify preference columns (all default true = opted in)
-- These are already generated/defaulted in the live DB — here for completeness.
alter table tie_records
  add column if not exists notify_90_days boolean default true,
  add column if not exists notify_60_days boolean default true,
  add column if not exists notify_30_days boolean default true,
  add column if not exists notify_14_days boolean default true,
  add column if not exists notify_7_days  boolean default true;

-- Computed date columns (generated from tie_expiry_date)
alter table tie_records
  add column if not exists renewal_window_start date
    generated always as (tie_expiry_date - interval '60 days') stored,
  add column if not exists late_deadline date
    generated always as (tie_expiry_date + interval '90 days') stored;
