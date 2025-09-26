import { useState, useEffect, useMemo } from "react";

export function useApiKeys() {
  const [keys, setKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState("");

  async function refresh() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/keys", { cache: "no-store" });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Failed to load keys");
      setKeys(Array.isArray(json?.data) ? json.data : []);
    } catch (e) {
      setError(e.message || "Unexpected error");
    } finally {
      setLoading(false);
    }
  }

  async function createKey(name, usageLimit) {
    if (!name.trim()) return;
    setBusyId("create");
    setError("");
    try {
      const res = await fetch("/api/keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), usageLimit: usageLimit ? Number(usageLimit) : null }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Failed to create key");
      setKeys((prev) => [json.data, ...prev]);
      return json.data;
    } catch (e) {
      setError(e.message || "Unexpected error");
      throw e;
    } finally {
      setBusyId("");
    }
  }

  async function updateName(id, name) {
    if (!name.trim()) return;
    setBusyId(id);
    setError("");
    try {
      const res = await fetch(`/api/keys/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Failed to update key");
      setKeys((prev) => prev.map((k) => (k.id === id ? json.data : k)));
      return json.data;
    } catch (e) {
      setError(e.message || "Unexpected error");
      throw e;
    } finally {
      setBusyId("");
    }
  }

  async function deleteKey(id) {
    setBusyId(id);
    setError("");
    try {
      const res = await fetch(`/api/keys/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Failed to delete key");
      setKeys((prev) => prev.filter((k) => k.id !== id));
      return json.data;
    } catch (e) {
      setError(e.message || "Unexpected error");
      throw e;
    } finally {
      setBusyId("");
    }
  }

  const isBusy = useMemo(() => Boolean(busyId), [busyId]);

  useEffect(() => {
    refresh();
  }, []);

  return {
    keys,
    loading,
    error,
    isBusy,
    busyId,
    refresh,
    createKey,
    updateName,
    deleteKey,
    setError
  };
}
