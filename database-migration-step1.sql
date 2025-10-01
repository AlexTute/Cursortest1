-- STEP 1: Handle existing API keys before adding user_id constraint
-- Run this first to clean up existing data

-- Option A: Delete all existing API keys (recommended for development)
-- This will remove all existing API keys so you can start fresh
DELETE FROM api_keys;

-- Option B: If you want to keep existing API keys, uncomment the lines below instead:
-- First, create a default user
-- INSERT INTO users (id, email, name) 
-- VALUES ('00000000-0000-0000-0000-000000000000', 'default@example.com', 'Default User')
-- ON CONFLICT (id) DO NOTHING;

-- Then assign all existing API keys to this default user
-- UPDATE api_keys 
-- SET user_id = '00000000-0000-0000-0000-000000000000'
-- WHERE user_id IS NULL;

-- Verify no NULL values remain
SELECT COUNT(*) as null_user_ids FROM api_keys WHERE user_id IS NULL;
