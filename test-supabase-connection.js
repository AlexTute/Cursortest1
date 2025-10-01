// Test script to verify Supabase connection
// Run with: node test-supabase-connection.js

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('Testing Supabase connection...');
console.log('URL:', supabaseUrl);
console.log('Service Key (first 20 chars):', supabaseServiceKey?.substring(0, 20) + '...');

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function testConnection() {
  try {
    // Test 1: Check if we can connect
    console.log('\n1. Testing basic connection...');
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1);
    
    if (error) {
      console.error('Connection test failed:', error);
      return;
    }
    
    console.log('✅ Basic connection successful');
    
    // Test 2: Try to insert a test user
    console.log('\n2. Testing user creation...');
    const testUser = {
      email: 'test@example.com',
      name: 'Test User',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    const { data: insertData, error: insertError } = await supabase
      .from('users')
      .insert(testUser)
      .select()
      .single();
    
    if (insertError) {
      console.error('User creation test failed:', insertError);
      return;
    }
    
    console.log('✅ User creation successful:', insertData);
    
    // Test 3: Clean up test user
    console.log('\n3. Cleaning up test user...');
    const { error: deleteError } = await supabase
      .from('users')
      .delete()
      .eq('email', 'test@example.com');
    
    if (deleteError) {
      console.error('Cleanup failed:', deleteError);
      return;
    }
    
    console.log('✅ Cleanup successful');
    console.log('\n🎉 All tests passed! Supabase connection is working correctly.');
    
  } catch (error) {
    console.error('Test failed with error:', error);
  }
}

testConnection();
