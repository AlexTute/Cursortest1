import { NextResponse } from 'next/server';
import auth from './auth';
import { getAdminClient } from './supabaseAdmin';

/**
 * Middleware to authenticate requests and get user information from NextAuth session
 * @param {Request} request - The incoming request
 * @returns {Promise<{user: object|null, error: string|null}>}
 */
export async function authMiddleware(request) {
  try {
    // Get the session from NextAuth
    const session = await auth();
    
    if (!session || !session.user) {
      return { user: null, error: 'Unauthorized' };
    }

    // Get user from Supabase database
    const supabase = getAdminClient();
    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, name, created_at, updated_at')
      .eq('email', session.user.email)
      .single();

    if (error || !user) {
      console.error('Error fetching user from database:', error);
      return { user: null, error: 'User not found in database' };
    }

    return { user, error: null };

  } catch (error) {
    console.error('Authentication error:', error);
    return { user: null, error: 'Authentication failed' };
  }
}
