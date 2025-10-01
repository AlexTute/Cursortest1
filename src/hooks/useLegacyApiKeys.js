import { useState, useEffect } from 'react';

const API_BASE = '/api/keys';

export function useLegacyApiKeys() {
  const [keys, setKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [busyId, setBusyId] = useState(null);

  // Load API keys
  const loadKeys = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(API_BASE, { cache: "no-store" });
      const json = await response.json();
      
      if (!response.ok) {
        throw new Error(json?.error || "Failed to load keys");
      }
      
      setKeys(Array.isArray(json?.data) ? json.data : []);
    } catch (err) {
      setError(err.message || "Unexpected error");
    } finally {
      setLoading(false);
    }
  };

  // Create new API key
  const createKey = async (name, usageLimit) => {
    if (!name.trim()) return;
    
    setBusyId("create");
    setError(null);
    
    try {
      const response = await fetch(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name: name.trim(), 
          usageLimit: usageLimit ? Number(usageLimit) : null 
        }),
      });
      
      const json = await response.json();
      
      if (!response.ok) {
        throw new Error(json?.error || "Failed to create key");
      }
      
      setKeys(prev => [json.data, ...prev]);
      return json.data;
    } catch (err) {
      setError(err.message || "Unexpected error");
      throw err;
    } finally {
      setBusyId(null);
    }
  };

  // Update API key
  const updateKey = async (id, updates) => {
    if (!updates.name?.trim()) return;
    
    setBusyId(id);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: updates.name.trim() }),
      });
      
      const json = await response.json();
      
      if (!response.ok) {
        throw new Error(json?.error || "Failed to update key");
      }
      
      setKeys(prev => prev.map(key => key.id === id ? json.data : key));
      return json.data;
    } catch (err) {
      setError(err.message || "Unexpected error");
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
      const response = await fetch(`${API_BASE}/${id}`, { 
        method: "DELETE" 
      });
      
      const json = await response.json();
      
      if (!response.ok) {
        throw new Error(json?.error || "Failed to delete key");
      }
      
      setKeys(prev => prev.filter(key => key.id !== id));
      return json.data;
    } catch (err) {
      setError(err.message || "Unexpected error");
      throw err;
    } finally {
      setBusyId(null);
    }
  };

  useEffect(() => {
    loadKeys();
  }, []);

  return {
    keys,
    loading,
    error,
    isBusy: Boolean(busyId),
    busyId,
    createKey,
    updateKey,
    deleteKey,
    refresh: loadKeys,
    setError,
    isAuthenticated: false, // Always false for legacy API
  };
}
