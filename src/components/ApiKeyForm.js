import { useState } from "react";
import { Plus } from "@/components/Icons";

export default function ApiKeyForm({ onCreateKey, isBusy }) {
  const [newName, setNewName] = useState("");
  const [usageLimit, setUsageLimit] = useState("");

  async function handleCreateKey() {
    if (!newName.trim()) return;
    try {
      await onCreateKey(newName, usageLimit);
      setNewName("");
      setUsageLimit("");
    } catch (error) {
      // Error is handled by the hook
    }
  }

  return (
    <div className="glass rounded-2xl p-4 sm:p-6 mb-8 fade-in">
      <div className="flex items-center justify-between mb-4">
        <div className="text-lg font-semibold">API Keys</div>
        <button 
          onClick={handleCreateKey} 
          disabled={isBusy || !newName.trim()} 
          className="action-btn rounded-lg px-3 py-2 btn-primary disabled:opacity-60 flex items-center gap-2"
        >
          <Plus /> New Key
        </button>
      </div>
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <input
          className="card w-full sm:w-auto rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[color:var(--accent)]"
          placeholder="New API key name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleCreateKey();
          }}
          disabled={isBusy}
        />
        <input
          type="number"
          min="0"
          className="card w-full sm:w-48 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[color:var(--accent)]"
          placeholder="Usage limit (optional)"
          value={usageLimit}
          onChange={(e) => setUsageLimit(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleCreateKey();
          }}
          disabled={isBusy}
        />
        <button
          className="action-btn rounded-lg px-4 py-2 card"
          onClick={() => window.location.reload()}
          disabled={isBusy}
        >
          Refresh
        </button>
      </div>
    </div>
  );
}
