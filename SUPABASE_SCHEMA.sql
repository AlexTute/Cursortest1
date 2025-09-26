-- Create table for API keys (matching your Supabase schema)
create table if not exists public.api_keys (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  value text not null unique,
  usage integer,
  created_at timestamp with time zone not null default now()
);

-- Helpful index
create index if not exists idx_api_keys_created_at on public.api_keys(created_at desc);


