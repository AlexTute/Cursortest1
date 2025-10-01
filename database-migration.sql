-- Migration script to add user_id to api_keys table and create users table

-- Step 1: Create users table if it doesn't exist
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 2: Add user_id column to api_keys table (nullable first)
ALTER TABLE api_keys 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES users(id) ON DELETE CASCADE;

-- Step 3: Handle existing API keys - either delete them or assign to a default user
-- Option A: Delete existing API keys (recommended for development)
-- Uncomment the next line if you want to delete existing API keys
-- DELETE FROM api_keys WHERE user_id IS NULL;

-- Option B: Create a default user and assign existing keys to them
-- Uncomment the following lines if you want to keep existing API keys
-- INSERT INTO users (id, email, name) 
-- VALUES ('00000000-0000-0000-0000-000000000000', 'default@example.com', 'Default User')
-- ON CONFLICT (id) DO NOTHING;

-- UPDATE api_keys 
-- SET user_id = '00000000-0000-0000-0000-000000000000'
-- WHERE user_id IS NULL;

-- Step 4: Now make user_id NOT NULL (only after handling existing data)
-- First, let's check if there are any NULL values
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM api_keys WHERE user_id IS NULL) THEN
    RAISE EXCEPTION 'Cannot proceed: There are still NULL user_id values in api_keys table. Please handle existing data first.';
  END IF;
END $$;

-- If we reach here, it's safe to make user_id NOT NULL
ALTER TABLE api_keys ALTER COLUMN user_id SET NOT NULL;

-- Step 5: Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_api_keys_user_id ON api_keys(user_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_value ON api_keys(value);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Step 6: Add RLS (Row Level Security) policies
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Policy for users table - users can only see their own data
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Policy for api_keys table - users can only see their own API keys
CREATE POLICY "Users can view own API keys" ON api_keys
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own API keys" ON api_keys
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own API keys" ON api_keys
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own API keys" ON api_keys
  FOR DELETE USING (auth.uid() = user_id);
