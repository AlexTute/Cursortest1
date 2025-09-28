import { useState, useEffect } from "react";

export default function EditModal({ show, name, onClose, onSave, isBusy }) {
  const [editName, setEditName] = useState(name || "");

  useEffect(() => {
    setEditName(name || "");
  }, [name]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative glass rounded-2xl p-6 w-full max-w-md modal-enter">
        <h3 className="text-xl font-semibold mb-4">Edit API Key</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Name</label>
            <input
              className="w-full card rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[color:var(--accent)]"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") onSave(editName);
                if (e.key === "Escape") onClose();
              }}
              autoFocus
            />
          </div>
          <div className="flex gap-3 justify-end">
            <button
              className="action-btn px-4 py-2 card"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="action-btn px-4 py-2 btn-primary disabled:opacity-60"
              onClick={() => onSave(editName)}
              disabled={!editName.trim() || isBusy}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
