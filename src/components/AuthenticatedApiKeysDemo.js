"use client";

import { useState } from 'react';
import { useAuthenticatedApiKeys } from '@/hooks/useAuthenticatedApiKeys';
import { Plus, Trash, Edit, RefreshCw, Eye, Copy } from 'lucide-react';

export default function AuthenticatedApiKeysDemo() {
  const {
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
    refresh,
    setError
  } = useAuthenticatedApiKeys();

  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyLimit, setNewKeyLimit] = useState('');
  const [validationKey, setValidationKey] = useState('');
  const [validationResult, setValidationResult] = useState(null);
  const [editingKey, setEditingKey] = useState(null);
  const [editName, setEditName] = useState('');

  const handleCreateKey = async () => {
    if (!newKeyName.trim()) return;
    
    try {
      await createKey(newKeyName, newKeyLimit ? Number(newKeyLimit) : null);
      setNewKeyName('');
      setNewKeyLimit('');
    } catch (error) {
      console.error('Error creating key:', error);
    }
  };

  const handleUpdateKey = async (id, name) => {
    try {
      await updateKey(id, { name });
      setEditingKey(null);
      setEditName('');
    } catch (error) {
      console.error('Error updating key:', error);
    }
  };

  const handleDeleteKey = async (id) => {
    if (!confirm('Are you sure you want to delete this API key?')) return;
    
    try {
      await deleteKey(id);
    } catch (error) {
      console.error('Error deleting key:', error);
    }
  };

  const handleIncrementUsage = async (id) => {
    try {
      await incrementUsage(id, 1);
    } catch (error) {
      console.error('Error incrementing usage:', error);
    }
  };

  const handleResetUsage = async (id) => {
    if (!confirm('Are you sure you want to reset the usage count?')) return;
    
    try {
      await resetUsage(id);
    } catch (error) {
      console.error('Error resetting usage:', error);
    }
  };

  const handleValidateKey = async () => {
    if (!validationKey.trim()) return;
    
    try {
      const result = await validateKey(validationKey);
      setValidationResult(result);
    } catch (error) {
      setValidationResult({ valid: false, error: error.message });
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      // You could add a toast notification here
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  if (loading) {
    return (
      <div className="glass rounded-2xl p-6 text-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p>Loading your API keys...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Error Display */}
      {error && (
        <div className="glass rounded-2xl p-4 border-l-4 border-red-500 bg-red-500/10">
          <div className="text-red-400">{error}</div>
          <button 
            onClick={() => setError(null)}
            className="mt-2 text-sm text-red-300 hover:text-red-200"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Create New Key */}
      <div className="glass rounded-2xl p-6">
        <h3 className="text-xl font-semibold mb-4">Create New API Key</h3>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="API Key Name"
            value={newKeyName}
            onChange={(e) => setNewKeyName(e.target.value)}
            className="flex-1 card rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="number"
            placeholder="Usage Limit (optional)"
            value={newKeyLimit}
            onChange={(e) => setNewKeyLimit(e.target.value)}
            className="w-full sm:w-48 card rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleCreateKey}
            disabled={isBusy || !newKeyName.trim()}
            className="action-btn btn-primary px-4 py-2 rounded-lg disabled:opacity-60 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Create Key
          </button>
        </div>
      </div>

      {/* Validate Key */}
      <div className="glass rounded-2xl p-6">
        <h3 className="text-xl font-semibold mb-4">Validate API Key</h3>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Enter API key to validate"
            value={validationKey}
            onChange={(e) => setValidationKey(e.target.value)}
            className="flex-1 card rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleValidateKey}
            disabled={!validationKey.trim()}
            className="action-btn btn-primary px-4 py-2 rounded-lg disabled:opacity-60"
          >
            Validate
          </button>
        </div>
        {validationResult && (
          <div className={`mt-4 p-3 rounded-lg ${
            validationResult.valid 
              ? 'bg-green-500/10 border border-green-500/20' 
              : 'bg-red-500/10 border border-red-500/20'
          }`}>
            <p className={validationResult.valid ? 'text-green-400' : 'text-red-400'}>
              {validationResult.valid ? 'Valid API key' : validationResult.error}
            </p>
            {validationResult.keyData && (
              <div className="mt-2 text-sm text-gray-300">
                <p>Name: {validationResult.keyData.name}</p>
                <p>Usage: {validationResult.keyData.usageCount}/{validationResult.keyData.usageLimit || '∞'}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* API Keys List */}
      <div className="glass rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">Your API Keys</h3>
            <button
              onClick={refresh}
              className="action-btn px-3 py-2 rounded-lg flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </div>

        {keys.length === 0 ? (
          <div className="p-6 text-center text-gray-400">
            No API keys yet. Create one above.
          </div>
        ) : (
          <div className="divide-y divide-gray-700">
            {keys.map((key) => (
              <div key={key.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold text-lg">{key.name}</h4>
                      {busyId === key.id && (
                        <div className="animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-4 mb-3">
                      <div className="font-mono text-sm bg-gray-800 px-3 py-1 rounded">
                        {key.key}
                      </div>
                      <button
                        onClick={() => copyToClipboard(key.key)}
                        className="action-btn p-2 rounded-lg"
                        title="Copy to clipboard"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center gap-6 text-sm text-gray-400">
                      <div>
                        Usage: <span className="text-white">{key.usageCount}</span>
                        {key.usageLimit && (
                          <span> / {key.usageLimit}</span>
                        )}
                      </div>
                      <div>
                        Created: {new Date(key.createdAt).toLocaleDateString()}
                      </div>
                    </div>

                    {/* Usage Progress Bar */}
                    {key.usageLimit && (
                      <div className="mt-3">
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                            style={{ 
                              width: `${Math.min((key.usageCount / key.usageLimit) * 100, 100)}%` 
                            }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => handleIncrementUsage(key.id)}
                      disabled={isBusy}
                      className="action-btn px-3 py-1 rounded-lg text-sm disabled:opacity-60"
                    >
                      +1 Usage
                    </button>
                    
                    {key.usageCount > 0 && (
                      <button
                        onClick={() => handleResetUsage(key.id)}
                        disabled={isBusy}
                        className="action-btn px-3 py-1 rounded-lg text-sm disabled:opacity-60"
                      >
                        Reset
                      </button>
                    )}

                    <button
                      onClick={() => {
                        setEditingKey(key.id);
                        setEditName(key.name);
                      }}
                      disabled={isBusy}
                      className="action-btn p-2 rounded-lg disabled:opacity-60"
                      title="Edit name"
                    >
                      <Edit className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleDeleteKey(key.id)}
                      disabled={isBusy}
                      className="action-btn p-2 rounded-lg text-red-400 hover:text-red-300 disabled:opacity-60"
                      title="Delete key"
                    >
                      <Trash className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Edit Modal */}
                {editingKey === key.id && (
                  <div className="mt-4 p-4 bg-gray-800 rounded-lg">
                    <div className="flex items-center gap-3">
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="flex-1 card rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="New name"
                      />
                      <button
                        onClick={() => handleUpdateKey(key.id, editName)}
                        disabled={!editName.trim() || isBusy}
                        className="action-btn btn-primary px-4 py-2 rounded-lg disabled:opacity-60"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setEditingKey(null);
                          setEditName('');
                        }}
                        className="action-btn px-4 py-2 rounded-lg"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
