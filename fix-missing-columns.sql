-- Fix: Add all missing columns to api_keys table
-- Run this in your Supabase SQL Editor

-- Add the updated_at column if it doesn't exist
ALTER TABLE api_keys 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Add the usage_count column if it doesn't exist
ALTER TABLE api_keys 
ADD COLUMN IF NOT EXISTS usage_count INTEGER DEFAULT 0;

-- Update existing records to have proper values
UPDATE api_keys 
SET updated_at = created_at,
    usage_count = 0
WHERE updated_at IS NULL OR usage_count IS NULL;

-- Make sure the columns have proper defaults
ALTER TABLE api_keys 
ALTER COLUMN updated_at SET DEFAULT NOW();

ALTER TABLE api_keys 
ALTER COLUMN usage_count SET DEFAULT 0;

-- Verify all columns exist and have the correct structure
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'api_keys' 
ORDER BY ordinal_position;
