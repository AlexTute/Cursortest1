-- Create default user for backward compatibility
-- Run this in your Supabase SQL Editor

INSERT INTO users (id, email, name, created_at, updated_at) 
VALUES (
  '00000000-0000-0000-0000-000000000000', 
  'default@example.com', 
  'Default User',
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Verify the user was created
SELECT * FROM users WHERE id = '00000000-0000-0000-0000-000000000000';
