-- Fix users table to auto-generate UUIDs
-- Run this in your Supabase SQL Editor

-- First, let's check the current structure
SELECT column_name, data_type, column_default, is_nullable
FROM information_schema.columns
WHERE table_name = 'users'
ORDER BY ordinal_position;

-- Update the id column to have a default UUID generation
ALTER TABLE users 
ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- If the column is not UUID type, convert it
-- (This might fail if there's existing data, so we'll handle that)
DO $$ 
BEGIN
    -- Check if the column is already UUID type
    IF (SELECT data_type FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'id') != 'uuid' THEN
        
        -- Convert to UUID type
        ALTER TABLE users ALTER COLUMN id TYPE UUID USING id::UUID;
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        -- If conversion fails, we'll need to handle it manually
        RAISE NOTICE 'Could not convert id column to UUID: %', SQLERRM;
END $$;

-- Verify the changes
SELECT column_name, data_type, column_default, is_nullable
FROM information_schema.columns
WHERE table_name = 'users'
ORDER BY ordinal_position;
