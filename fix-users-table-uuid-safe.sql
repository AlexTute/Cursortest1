-- Safe fix for users table UUID issue
-- Run this in your Supabase SQL Editor

-- Step 1: Check current table structure
SELECT column_name, data_type, column_default, is_nullable
FROM information_schema.columns
WHERE table_name = 'users'
ORDER BY ordinal_position;

-- Step 2: Temporarily disable RLS policies
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- Step 3: Drop existing policies (we'll recreate them)
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Users can insert own profile" ON users;

-- Step 4: Check if id column is already UUID type
DO $$ 
DECLARE
    current_type text;
BEGIN
    SELECT data_type INTO current_type
    FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'id';
    
    RAISE NOTICE 'Current id column type: %', current_type;
    
    -- If it's not UUID, convert it
    IF current_type != 'uuid' THEN
        ALTER TABLE users ALTER COLUMN id TYPE UUID USING id::UUID;
        RAISE NOTICE 'Converted id column to UUID type';
    ELSE
        RAISE NOTICE 'id column is already UUID type';
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Error converting id column: %', SQLERRM;
END $$;

-- Step 5: Set default UUID generation for new records
ALTER TABLE users ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- Step 6: Re-enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Step 7: Recreate the policies
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Step 8: Verify the changes
SELECT column_name, data_type, column_default, is_nullable
FROM information_schema.columns
WHERE table_name = 'users'
ORDER BY ordinal_position;

-- Step 9: Test with a sample insert (this should work now)
INSERT INTO users (email, name, created_at, updated_at)
VALUES ('test@example.com', 'Test User', NOW(), NOW())
ON CONFLICT (email) DO NOTHING;

-- Clean up test record
DELETE FROM users WHERE email = 'test@example.com';

RAISE NOTICE 'Users table UUID fix completed successfully!';

