import { useState } from "react";
import { Eye, Copy, Pencil, Trash } from "@/components/Icons";
import EditModal from "./EditModal";

export default function ApiKeysTable({ 
  keys, 
  loading, 
  onUpdateName, 
  onDeleteKey, 
  isBusy, 
  busyId 
}) {
  const [revealedMap, setRevealedMap] = useState({});
  const [editModal, setEditModal] = useState({ show: false, key: null, name: "" });

  function formatDate(iso) {
    try {
      return new Date(iso).toLocaleString();
    } catch {
      return iso || "";
    }
  }

  function maskKey(key) {
    if (!key) return "";
    const len = key.length;
    if (len <= 8) return "*".repeat(Math.max(4, len));
    const start = key.slice(0, 6);
    const end = key.slice(-4);
    return `${start}${"*".repeat(Math.max(4, len - 10))}${end}`;
  }

  function isRevealed(id) {
    return Boolean(revealedMap[id]);
  }

  function toggleReveal(id) {
    setRevealedMap((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  async function copyToClipboard(text) {
    try {
      await navigator.clipboard?.writeText(text);
      // Toast notification would be handled by parent component
    } catch (e) {
      console.error(e);
    }
  }

  function openEditModal(key) {
    setEditModal({ show: true, key, name: key.name });
  }

  function closeEditModal() {
    setEditModal({ show: false, key: null, name: "" });
  }

  async function handleUpdateName(id, name) {
    try {
      await onUpdateName(id, name);
      closeEditModal();
    } catch (error) {
      // Error is handled by the hook
    }
  }

  if (loading) {
    return (
      <div className="glass rounded-2xl overflow-hidden">
        <div className="p-6 loading">Loading...</div>
      </div>
    );
  }

  if (keys.length === 0) {
    return (
      <div className="glass rounded-2xl overflow-hidden">
        <div className="p-6 text-sm text-[color:var(--muted)] fade-in">
          No API keys yet. Create one above.
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="glass rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left border-b border-[color:var(--glass-border)]">
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Usage</th>
                <th className="py-3 px-4">Key</th>
                <th className="py-3 px-4">Created</th>
                <th className="py-3 px-4">Updated</th>
                <th className="py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {keys.map((k, index) => (
                <tr 
                  key={k.id} 
                  className="border-b border-[color:var(--glass-border)] fade-in" 
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <td className="py-3 px-4">{k.name}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">
                        {(k.usageCount ?? 0)} / {k.usageLimit ?? "∞"}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-mono break-all">
                    {isRevealed(k.id) ? k.key : maskKey(k.key)}
                  </td>
                  <td className="py-3 px-4">{formatDate(k.createdAt)}</td>
                  <td className="py-3 px-4">{formatDate(k.updatedAt)}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <button 
                        className="action-btn rounded-md p-2 card" 
                        title={isRevealed(k.id) ? "Hide" : "Reveal"} 
                        onClick={() => toggleReveal(k.id)}
                      >
                        <Eye />
                      </button>
                      <button 
                        className="action-btn rounded-md p-2 card" 
                        title="Copy" 
                        onClick={() => copyToClipboard(k.key)}
                      >
                        <Copy />
                      </button>
                      <button 
                        className="action-btn rounded-md p-2 card" 
                        title="Rename" 
                        onClick={() => openEditModal(k)}
                      >
                        <Pencil />
                      </button>
                      <button 
                        className="action-btn rounded-md p-2 card" 
                        title="Delete" 
                        onClick={() => onDeleteKey(k.id)} 
                        disabled={isBusy}
                      >
                        <Trash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <EditModal
        show={editModal.show}
        key={editModal.key}
        name={editModal.name}
        onClose={closeEditModal}
        onSave={(name) => handleUpdateName(editModal.key.id, name)}
        isBusy={isBusy}
      />
    </>
  );
}
