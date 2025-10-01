-- Fix: Add missing updated_at column to api_keys table
-- Run this in your Supabase SQL Editor

-- Add the updated_at column if it doesn't exist
ALTER TABLE api_keys 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Update existing records to have updated_at = created_at
UPDATE api_keys 
SET updated_at = created_at 
WHERE updated_at IS NULL;

-- Make sure the column has a default value for future inserts
ALTER TABLE api_keys 
ALTER COLUMN updated_at SET DEFAULT NOW();

-- Verify the column exists and has data
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'api_keys' 
AND column_name IN ('created_at', 'updated_at');
