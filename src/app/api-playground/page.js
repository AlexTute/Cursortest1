"use client";

import { useState } from "react";
import { Plus, Play, Copy } from "@/components/Icons";

export default function ApiPlayground() {
  const [endpoint, setEndpoint] = useState("/api/keys");
  const [method, setMethod] = useState("GET");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  async function makeRequest() {
    setLoading(true);
    setResponse("");
    
    try {
      const options = {
        method,
        headers: { "Content-Type": "application/json" },
      };
      
      if (method === "POST") {
        options.body = JSON.stringify({ name: "Test Key", usageLimit: 1000 });
      }
      
      const res = await fetch(endpoint, options);
      const data = await res.json();
      
      setResponse(JSON.stringify(data, null, 2));
    } catch (error) {
      setResponse(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }

  function copyResponse() {
    navigator.clipboard.writeText(response);
  }

  return (
    <div className="font-sans mx-auto max-w-6xl px-6 py-10 fade-in">
      <div className="mb-6 slide-in">
        <div className="text-sm text-[color:var(--muted)] mb-1">Pages / API Playground</div>
        <h1 className="text-3xl font-bold">API Playground</h1>
        <p className="text-[color:var(--muted)] mt-2">Test your API endpoints in real-time</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Request Panel */}
        <div className="glass rounded-2xl p-6 fade-in">
          <h2 className="text-xl font-semibold mb-4">Request</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Method</label>
              <select 
                className="w-full card rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[color:var(--accent)]"
                value={method}
                onChange={(e) => setMethod(e.target.value)}
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PATCH">PATCH</option>
                <option value="DELETE">DELETE</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Endpoint</label>
              <input
                className="w-full card rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[color:var(--accent)]"
                value={endpoint}
                onChange={(e) => setEndpoint(e.target.value)}
                placeholder="/api/keys"
              />
            </div>

            <button
              className="action-btn w-full btn-primary py-3 flex items-center justify-center gap-2"
              onClick={makeRequest}
              disabled={loading}
            >
              {loading ? (
                <div className="loading w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Play className="w-4 h-4" />
              )}
              {loading ? "Sending..." : "Send Request"}
            </button>
          </div>
        </div>

        {/* Response Panel */}
        <div className="glass rounded-2xl p-6 fade-in">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Response</h2>
            {response && (
              <button
                className="action-btn rounded-lg px-3 py-2 card flex items-center gap-2"
                onClick={copyResponse}
              >
                <Copy className="w-4 h-4" />
                Copy
              </button>
            )}
          </div>
          
          <div className="bg-[rgba(0,0,0,0.3)] rounded-lg p-4 min-h-[200px]">
            <pre className="text-sm text-[color:var(--foreground)] whitespace-pre-wrap">
              {response || "Click 'Send Request' to see the response here..."}
            </pre>
          </div>
        </div>
      </div>

      {/* Quick Examples */}
      <div className="mt-8 glass rounded-2xl p-6 fade-in">
        <h2 className="text-xl font-semibold mb-4">Quick Examples</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { method: "GET", endpoint: "/api/keys", desc: "List all API keys" },
            { method: "POST", endpoint: "/api/keys", desc: "Create new API key" },
            { method: "PATCH", endpoint: "/api/keys/{id}", desc: "Update API key" },
            { method: "DELETE", endpoint: "/api/keys/{id}", desc: "Delete API key" },
          ].map((example, index) => (
            <button
              key={index}
              className="action-btn p-4 card text-left hover:scale-105 transition-transform"
              onClick={() => {
                setMethod(example.method);
                setEndpoint(example.endpoint);
              }}
            >
              <div className="font-mono text-sm font-semibold mb-1">{example.method}</div>
              <div className="text-xs text-[color:var(--muted)]">{example.desc}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
