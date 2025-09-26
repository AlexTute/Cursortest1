"use client";

import { useState } from "react";
import { useApiKeys } from "@/hooks/useApiKeys";
import ApiKeyForm from "@/components/ApiKeyForm";
import ApiKeysTable from "@/components/ApiKeysTable";
import HeroCard from "@/components/HeroCard";
import Toast from "@/components/Toast";

export default function ApiKeysDashboard() {
  const {
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
  } = useApiKeys();

  const [toast, setToast] = useState({ show: false, message: "" });

  async function handleCreateKey(name, usageLimit) {
    try {
      await createKey(name, usageLimit);
      setToast({ show: true, message: "API Key created successfully!" });
      setTimeout(() => setToast({ show: false, message: "" }), 3000);
    } catch (error) {
      // Error is handled by the hook
    }
  }

  async function handleUpdateName(id, name) {
    try {
      await updateName(id, name);
      setToast({ show: true, message: "API Key updated successfully!" });
      setTimeout(() => setToast({ show: false, message: "" }), 3000);
    } catch (error) {
      // Error is handled by the hook
    }
  }

  async function handleDeleteKey(id) {
    try {
      await deleteKey(id);
      setToast({ show: true, message: "API Key deleted successfully!" });
      setTimeout(() => setToast({ show: false, message: "" }), 3000);
    } catch (error) {
      // Error is handled by the hook
    }
  }

  return (
    <div className="font-sans mx-auto max-w-6xl px-6 py-10 fade-in">
      <div className="mb-6 slide-in">
        <div className="text-sm text-[color:var(--muted)] mb-1">Pages / Overview</div>
        <h1 className="text-3xl font-bold">Overview</h1>
      </div>

      <HeroCard />

      <ApiKeyForm onCreateKey={handleCreateKey} isBusy={isBusy} />

      {error ? (
        <div className="text-red-400 mb-4">{error}</div>
      ) : null}

      <ApiKeysTable
        keys={keys}
        loading={loading}
        onUpdateName={handleUpdateName}
        onDeleteKey={handleDeleteKey}
        isBusy={isBusy}
        busyId={busyId}
      />

      <Toast
        show={toast.show}
        message={toast.message}
        onClose={() => setToast({ show: false, message: "" })}
      />
    </div>
  );
}