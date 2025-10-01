"use client";

import { useState } from "react";
import { FileText, Link, Upload, Loader2 } from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function DocsSummaryPage() {
  const [url, setUrl] = useState("");
  const [file, setFile] = useState(null);
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("url"); // "url" or "pdf"
  const [apiKey, setApiKey] = useState("");
  const [usage, setUsage] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      setError("");
    } else {
      setError("Please select a valid PDF file");
      setFile(null);
    }
  };

  const handleUrlSubmit = async (e) => {
    e.preventDefault();
    if (!url.trim()) {
      setError("Please enter a valid URL");
      return;
    }
    if (!apiKey.trim()) {
      setError("Please enter your API key");
      return;
    }

    setLoading(true);
    setError("");
    setSummary("");

    try {
      const response = await fetch("/api/summarize", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "x-api-key": apiKey
        },
        body: JSON.stringify({ type: "url", content: url }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to summarize URL");
      }

      if (data.summary && data.summary.trim().length > 0) {
        setSummary(data.summary);
        if (data.usage) {
          setUsage(data.usage);
        }
      } else {
        setError("Summary was generated but appears to be empty. Please try again.");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePdfSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a PDF file");
      return;
    }
    if (!apiKey.trim()) {
      setError("Please enter your API key");
      return;
    }

    setLoading(true);
    setError("");
    setSummary("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", "pdf");

      const response = await fetch("/api/summarize", {
        method: "POST",
        headers: {
          "x-api-key": apiKey
        },
        body: formData,
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to summarize PDF");
      }

      setSummary(data.summary);
      if (data.usage) {
        setUsage(data.usage);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="font-sans mx-auto max-w-4xl px-6 py-10 fade-in">
      <div className="mb-8 slide-in">
        <div className="text-sm text-[color:var(--muted)] mb-1">Pages / Docs Summary</div>
        <h1 className="text-3xl font-bold">Document Summarizer</h1>
        <p className="text-[color:var(--muted)] mt-2">
          Get ultra-short summaries from web pages or PDF documents using AI
        </p>
      </div>

      <div className="glass rounded-2xl p-6 mb-8">
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">API Key</label>
          <input
            type="text"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter your API key"
            className="w-full card rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-[color:var(--accent)]"
            disabled={loading}
          />
          <p className="text-xs text-[color:var(--muted)] mt-1">
            Get your API key from the Overview page
          </p>
        </div>
        
        <div className="flex gap-1 mb-6">
          <button
            onClick={() => setActiveTab("url")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
              activeTab === "url"
                ? "bg-gradient-to-r from-[var(--marvel-red)] to-[var(--marvel-blue)] text-white"
                : "hover:bg-[rgba(255,255,255,0.1)]"
            }`}
          >
            <Link className="h-4 w-4" />
            Web Page
          </button>
          <button
            onClick={() => setActiveTab("pdf")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
              activeTab === "pdf"
                ? "bg-gradient-to-r from-[var(--marvel-red)] to-[var(--marvel-blue)] text-white"
                : "hover:bg-[rgba(255,255,255,0.1)]"
            }`}
          >
            <FileText className="h-4 w-4" />
            PDF Document
          </button>
        </div>

        {activeTab === "url" ? (
          <form onSubmit={handleUrlSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Web Page URL</label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/article"
                className="w-full card rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-[color:var(--accent)]"
                disabled={loading}
              />
            </div>
            <button
              type="submit"
              disabled={loading || !url.trim()}
              className="action-btn btn-primary px-6 py-3 rounded-lg disabled:opacity-60 flex items-center gap-2"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4" />}
              {loading ? "Summarizing..." : "Summarize Web Page"}
            </button>
          </form>
        ) : (
          <form onSubmit={handlePdfSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">PDF Document</label>
              <div className="relative">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="w-full card rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-[color:var(--accent)] file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-[color:var(--accent)] file:text-white hover:file:bg-[color:var(--accent)]/90"
                  disabled={loading}
                />
              </div>
              {file && (
                <p className="text-sm text-[color:var(--muted)] mt-2">
                  Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              )}
            </div>
            <button
              type="submit"
              disabled={loading || !file}
              className="action-btn btn-primary px-6 py-3 rounded-lg disabled:opacity-60 flex items-center gap-2"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
              {loading ? "Summarizing..." : "Summarize PDF"}
            </button>
          </form>
        )}
      </div>

      {error && (
        <div className="glass rounded-2xl p-4 mb-8 border-l-4 border-red-500 bg-red-500/10">
          <div className="text-red-400">{error}</div>
        </div>
      )}

      {summary && (
        <div className="glass rounded-2xl p-6 fade-in">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <FileText className="h-5 w-5" />
            AI Summary
          </h3>
          <div className="prose prose-invert max-w-none">
            <p className="text-[color:var(--muted)] leading-relaxed whitespace-pre-line">
              {summary}
            </p>
          </div>
          <div className="mt-4 pt-4 border-t border-[color:var(--glass-border)]">
            <div className="flex items-center gap-2 text-sm text-[color:var(--muted)]">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Summary generated successfully
            </div>
            {usage && (
              <div className="mt-2 text-xs text-[color:var(--muted)]">
                API Usage: {usage.current}/{usage.limit} requests used today ({usage.remaining} remaining)
              </div>
            )}
          </div>
        </div>
      )}
      </div>
    </ProtectedRoute>
  );
}
