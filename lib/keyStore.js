// Simple in-memory key store for demo purposes only
// Replace with a real database for production use

let apiKeys = [];

export function listKeys() {
  return apiKeys;
}

export function createKey(name, usageLimit) {
  const id = Math.random().toString(36).slice(2, 10);
  const key =
    "key_" + Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
  const now = new Date().toISOString();
  const limit = Number.isFinite(usageLimit) && usageLimit > 0 ? Math.floor(usageLimit) : null;
  const record = { id, name, key, usageLimit: limit, usageCount: 0, createdAt: now, updatedAt: now };
  apiKeys.unshift(record);
  return record;
}

export function updateKey(id, updates) {
  const index = apiKeys.findIndex((k) => k.id === id);
  if (index === -1) return null;
  apiKeys[index] = {
    ...apiKeys[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  return apiKeys[index];
}

export function deleteKey(id) {
  const index = apiKeys.findIndex((k) => k.id === id);
  if (index === -1) return null;
  const [removed] = apiKeys.splice(index, 1);
  return removed;
}

export function resetStore() {
  apiKeys = [];
}


