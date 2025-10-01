import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

const API_BASE = '/api/user/api-keys';

export function useAuthenticatedApiKeys() {
  const { data: session, status } = useSession();
  const [keys, setKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isBusy, setIsBusy] = useState(false);
  const [busyId, setBusyId] = useState(null);

  // Generic API call helper
  const apiCall = async (url, options = {}) => {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }

    return response.json();
  };

  // Load API keys
  const loadKeys = async () => {
    if (status !== 'authenticated') return;
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await apiCall(API_BASE);
      setKeys(result.data || []);
    } catch (err) {
      setError(err.message);
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
      setError(err.message);
      throw err;
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
      setError(err.message);
      throw err;
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
      setError(err.message);
      throw err;
    } finally {
      setBusyId(null);
    }
  };

  // Increment usage
  const incrementUsage = async (id, increment = 1) => {
    setBusyId(id);
    setError(null);
    
    try {
      const result = await apiCall(`${API_BASE}/${id}/usage`, {
        method: 'POST',
        body: JSON.stringify({ increment }),
      });
      
      setKeys(prev => prev.map(key => key.id === id ? result.data : key));
      return result.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setBusyId(null);
    }
  };

  // Reset usage
  const resetUsage = async (id) => {
    setBusyId(id);
    setError(null);
    
    try {
      const result = await apiCall(`${API_BASE}/${id}/usage`, {
        method: 'DELETE',
      });
      
      setKeys(prev => prev.map(key => key.id === id ? result.data : key));
      return result.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setBusyId(null);
    }
  };

  // Validate API key
  const validateKey = async (apiKey) => {
    try {
      const result = await apiCall(`${API_BASE}/validate`, {
        method: 'POST',
        body: JSON.stringify({ apiKey }),
      });
      
      return result;
    } catch (err) {
      return { valid: false, error: err.message };
    }
  };

  // Load keys when session changes
  useEffect(() => {
    if (status === 'authenticated') {
      loadKeys();
    } else if (status === 'unauthenticated') {
      setKeys([]);
      setError(null);
    }
  }, [status]);

  return {
    keys,
    loading,
    error,
    isBusy,
    busyId,
    createKey,
    updateKey,
    deleteKey,
    incrementUsage,
    resetUsage,
    validateKey,
    refresh: loadKeys,
    setError,
  };
}
