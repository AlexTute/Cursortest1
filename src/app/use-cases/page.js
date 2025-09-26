"use client";

import { useState } from "react";
import { Shield, Zap, Globe, Database } from "@/components/Icons";

export default function UseCases() {
  const [selectedCase, setSelectedCase] = useState(0);

  const useCases = [
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Authentication & Authorization",
      description: "Secure your applications with API key-based authentication",
      features: [
        "User authentication",
        "Role-based access control",
        "Session management",
        "Token validation"
      ],
      code: `// Example: Validate API key
const response = await fetch('/api/validate', {
  headers: {
    'Authorization': 'Bearer ${'${API_KEY}'}'
  }
});`
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Rate Limiting",
      description: "Control API usage and prevent abuse with intelligent rate limiting",
      features: [
        "Per-user rate limits",
        "Burst protection",
        "Usage analytics",
        "Automatic throttling"
      ],
      code: `// Example: Check rate limit
const usage = await fetch('/api/usage', {
  headers: { 'X-API-Key': '${'${API_KEY}'}' }
});
if (usage.remaining === 0) {
  throw new Error('Rate limit exceeded');
}`
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Third-party Integrations",
      description: "Connect with external services and APIs seamlessly",
      features: [
        "Webhook management",
        "Data synchronization",
        "Error handling",
        "Retry mechanisms"
      ],
      code: `// Example: Webhook integration
const webhook = await fetch('https://api.service.com/webhook', {
  method: 'POST',
  headers: { 'X-API-Key': '${'${API_KEY}'}' },
  body: JSON.stringify(payload)
});`
    },
    {
      icon: <Database className="w-8 h-8" />,
      title: "Data Management",
      description: "Efficiently manage and process data with your API keys",
      features: [
        "CRUD operations",
        "Data validation",
        "Batch processing",
        "Real-time updates"
      ],
      code: `// Example: Data operations
const data = await fetch('/api/data', {
  method: 'POST',
  headers: { 
    'X-API-Key': '${'${API_KEY}'}',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ action: 'create', data: payload })
});`
    }
  ];

  return (
    <div className="font-sans mx-auto max-w-6xl px-6 py-10 fade-in">
      <div className="mb-8 slide-in">
        <div className="text-sm text-[color:var(--muted)] mb-1">Pages / Use Cases</div>
        <h1 className="text-3xl font-bold">Use Cases</h1>
        <p className="text-[color:var(--muted)] mt-2">Discover how to leverage your API keys for various applications</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Use Cases List */}
        <div className="space-y-4">
          {useCases.map((useCase, index) => (
            <button
              key={index}
              className={`w-full p-6 rounded-2xl text-left transition-all duration-200 ${
                selectedCase === index
                  ? "glass border-2 border-[var(--marvel-red)]"
                  : "card hover:scale-[1.02]"
              }`}
              onClick={() => setSelectedCase(index)}
            >
              <div className="flex items-start gap-4">
                <div className="text-[var(--marvel-red)]">{useCase.icon}</div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">{useCase.title}</h3>
                  <p className="text-sm text-[color:var(--muted)]">{useCase.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Selected Use Case Details */}
        <div className="glass rounded-2xl p-6 fade-in">
          <div className="flex items-center gap-4 mb-6">
            <div className="text-[var(--marvel-red)]">{useCases[selectedCase].icon}</div>
            <div>
              <h2 className="text-2xl font-bold">{useCases[selectedCase].title}</h2>
              <p className="text-[color:var(--muted)]">{useCases[selectedCase].description}</p>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Key Features</h3>
            <ul className="space-y-2">
              {useCases[selectedCase].features.map((feature, index) => (
                <li key={index} className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-[var(--marvel-red)] rounded-full"></div>
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Code Example</h3>
            <div className="bg-[rgba(0,0,0,0.3)] rounded-lg p-4">
              <pre className="text-sm text-[color:var(--foreground)] whitespace-pre-wrap">
                {useCases[selectedCase].code}
              </pre>
            </div>
          </div>
        </div>
      </div>

      {/* Getting Started */}
      <div className="mt-12 glass rounded-2xl p-8 fade-in">
        <h2 className="text-2xl font-bold mb-4">Getting Started</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-[var(--marvel-red)] to-[var(--marvel-blue)] rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-xl">1</span>
            </div>
            <h3 className="font-semibold mb-2">Create API Key</h3>
            <p className="text-sm text-[color:var(--muted)]">Generate your first API key in the dashboard</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-[var(--marvel-red)] to-[var(--marvel-blue)] rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-xl">2</span>
            </div>
            <h3 className="font-semibold mb-2">Test Integration</h3>
            <p className="text-sm text-[color:var(--muted)]">Use the API Playground to test your endpoints</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-[var(--marvel-red)] to-[var(--marvel-blue)] rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-xl">3</span>
            </div>
            <h3 className="font-semibold mb-2">Deploy & Monitor</h3>
            <p className="text-sm text-[color:var(--muted)]">Deploy your application and monitor usage</p>
          </div>
        </div>
      </div>
    </div>
  );
}
