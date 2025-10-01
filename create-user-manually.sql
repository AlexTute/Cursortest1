-- Manual user creation script
-- Replace 'your-email@gmail.com' and 'Your Name' with your actual Gmail and name

INSERT INTO users (id, email, name, created_at, updated_at)
VALUES (
  gen_random_uuid(), -- This will generate a new UUID
  'your-email@gmail.com', -- Replace with your actual Gmail
  'Your Name', -- Replace with your actual name
  NOW(),
  NOW()
) ON CONFLICT (email) DO NOTHING;

-- Verify the user was created
SELECT * FROM users WHERE email = 'your-email@gmail.com';
