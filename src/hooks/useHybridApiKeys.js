import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

const AUTHENTICATED_API_BASE = '/api/user/api-keys';
const LEGACY_API_BASE = '/api/keys';

export function useHybridApiKeys() {
  const { data: session, status } = useSession();
  const [keys, setKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isBusy, setIsBusy] = useState(false);
  const [busyId, setBusyId] = useState(null);

  // Determine which API to use based on authentication status
  const isAuthenticated = status === 'authenticated' && session?.user;
  const API_BASE = isAuthenticated ? AUTHENTICATED_API_BASE : LEGACY_API_BASE;

  // Get auth token for authenticated API calls
  const getAuthToken = async () => {
    if (!session?.accessToken) {
      // For NextAuth, we need to get the token differently
      // For now, we'll use a placeholder or skip auth
      return null;
    }
    return session.accessToken;
  };

  // Generic API call helper
  const apiCall = async (url, options = {}) => {
    let headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    // Add auth header only for authenticated endpoints
    if (isAuthenticated && API_BASE === AUTHENTICATED_API_BASE) {
      try {
        const token = await getAuthToken();
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
      } catch (error) {
        console.warn('No auth token available, falling back to legacy API');
        // Fall back to legacy API
        const legacyUrl = url.replace(AUTHENTICATED_API_BASE, LEGACY_API_BASE);
        return fetch(legacyUrl, { ...options, headers });
      }
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }

    return response.json();
  };

  // Load API keys
  const loadKeys = async () => {
    if (status === 'loading') return;
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await apiCall(API_BASE);
      setKeys(result.data || []);
    } catch (err) {
      // If authenticated API fails, try legacy API
      if (isAuthenticated) {
        try {
          const result = await apiCall(LEGACY_API_BASE);
          setKeys(result.data || []);
        } catch (legacyErr) {
          setError(legacyErr.message);
        }
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // Create new API key
  const createKey = async (name, usageLimit) => {
    setIsBusy(true);
    setError(null);
    
    try {
      const result = await apiCall(API_BASE, {
        method: 'POST',
        body: JSON.stringify({ name, usageLimit }),
      });
      
      setKeys(prev => [result.data, ...prev]);
      return result.data;
    } catch (err) {
      // If authenticated API fails, try legacy API
      if (isAuthenticated) {
        try {
          const result = await apiCall(LEGACY_API_BASE, {
            method: 'POST',
            body: JSON.stringify({ name, usageLimit }),
          });
          
          setKeys(prev => [result.data, ...prev]);
          return result.data;
        } catch (legacyErr) {
          setError(legacyErr.message);
          throw legacyErr;
        }
      } else {
        setError(err.message);
        throw err;
      }
    } finally {
      setIsBusy(false);
    }
  };

  // Update API key
  const updateKey = async (id, updates) => {
    setBusyId(id);
    setError(null);
    
    try {
      const result = await apiCall(`${API_BASE}/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(updates),
      });
      
      setKeys(prev => prev.map(key => key.id === id ? result.data : key));
      return result.data;
    } catch (err) {
      // If authenticated API fails, try legacy API
      if (isAuthenticated) {
        try {
          const result = await apiCall(`${LEGACY_API_BASE}/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(updates),
          });
          
          setKeys(prev => prev.map(key => key.id === id ? result.data : key));
          return result.data;
        } catch (legacyErr) {
          setError(legacyErr.message);
          throw legacyErr;
        }
      } else {
        setError(err.message);
        throw err;
      }
    } finally {
      setBusyId(null);
    }
  };

  // Delete API key
  const deleteKey = async (id) => {
    setBusyId(id);
    setError(null);
    
    try {
      await apiCall(`${API_BASE}/${id}`, {
        method: 'DELETE',
      });
      
      setKeys(prev => prev.filter(key => key.id !== id));
    } catch (err) {
      // If authenticated API fails, try legacy API
      if (isAuthenticated) {
        try {
          await apiCall(`${LEGACY_API_BASE}/${id}`, {
            method: 'DELETE',
          });
          
          setKeys(prev => prev.filter(key => key.id !== id));
        } catch (legacyErr) {
          setError(legacyErr.message);
          throw legacyErr;
        }
      } else {
        setError(err.message);
        throw err;
      }
    } finally {
      setBusyId(null);
    }
  };

  // Load keys when session changes
  useEffect(() => {
    if (status !== 'loading') {
      loadKeys();
    }
  }, [status, isAuthenticated]);

  return {
    keys,
    loading,
    error,
    isBusy,
    busyId,
    createKey,
    updateKey,
    deleteKey,
    refresh: loadKeys,
    setError,
    isAuthenticated,
  };
}
