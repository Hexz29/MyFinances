/*
  # Fix user_id column type for RLS compatibility

  1. Changes
    - Update `user_id` column type from `text` to `uuid` in transactions table
    - This ensures compatibility with Supabase's `auth.uid()` function used in RLS policies

  2. Security
    - Maintains existing RLS policies
    - Ensures proper type matching for authentication checks
*/

-- Drop existing table if it exists (safe for development)
DROP TABLE IF EXISTS public.transactions;

-- Create transactions table with correct uuid type for user_id
CREATE TABLE IF NOT EXISTS public.transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  account_id text,
  type text NOT NULL CHECK (type IN ('income','expense')),
  category text,
  amount numeric NOT NULL,
  description text,
  date date,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can select own transactions"
  ON public.transactions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own transactions"
  ON public.transactions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own transactions"
  ON public.transactions
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own transactions"
  ON public.transactions
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);