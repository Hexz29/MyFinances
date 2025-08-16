-- db/create_transactions_table.sql
-- Create extension (for gen_random_uuid)
create extension if not exists pgcrypto;

-- Create transactions table matching src/types/index.ts Transaction interface
create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  account_id text,
  type text not null check (type in ('income','expense')),
  category text,
  amount numeric not null,
  description text,
  date date,
  created_at timestamptz default now()
);

-- Development (permissive) policies
-- WARNING: The following policy allows public/anon full access. Use only for local/dev testing.
alter table public.transactions enable row level security;
-- Production-safe policies (require authenticated user and restrict to own rows)
-- NOTE: Use these policies when deploying with Supabase Auth.
alter table public.transactions enable row level security;

create policy "Select own" on public.transactions
  for select
  using (auth.uid() = user_id);

create policy "Insert own" on public.transactions
  for insert
  with check (auth.uid() = user_id);

create policy "Update own" on public.transactions
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Delete own" on public.transactions
  for delete
  using (auth.uid() = user_id);

-- Quick test insert (run in SQL Editor to verify)
-- insert into public.transactions (user_id, account_id, type, category, amount, description, date)
-- values ('user1', 'acc1', 'expense', 'Alimentação', 12.5, 'Teste insert', current_date)
-- returning *;
