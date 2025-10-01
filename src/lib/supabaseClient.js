import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper function to get user from JWT token
export async function getUserFromToken(token) {
  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error) throw error;
    return user;
  } catch (error) {
    console.error('Error getting user from token:', error);
    return null;
  }
}

// Helper function to get user by email
export async function getUserByEmail(email) {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id, email, name')
      .eq('email', email)
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error getting user by email:', error);
    return null;
  }
}

// Helper function to create user if doesn't exist
export async function createUserIfNotExists(userData) {
  try {
    const { data, error } = await supabase
      .from('users')
      .upsert({
        id: userData.id,
        email: userData.email,
        name: userData.name || userData.email,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'id'
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating user:', error);
    return null;
  }
}
