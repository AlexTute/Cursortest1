"use client";

import { useState } from "react";
import { Shield, CreditCard, TrendingUp, AlertCircle } from "@/components/Icons";

export default function Billing() {
  const [selectedPlan, setSelectedPlan] = useState("researcher");

  const plans = [
    {
      id: "researcher",
      name: "Researcher",
      price: "$0",
      period: "month",
      description: "Perfect for developers and small projects",
      features: [
        "1,000 API calls/month",
        "Basic support",
        "Standard rate limits",
        "Community access"
      ],
      current: true
    },
    {
      id: "professional",
      name: "Professional",
      price: "$29",
      period: "month",
      description: "Ideal for growing applications",
      features: [
        "50,000 API calls/month",
        "Priority support",
        "Advanced rate limits",
        "Analytics dashboard",
        "Webhook support"
      ],
      current: false
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: "$99",
      period: "month",
      description: "For large-scale applications",
      features: [
        "Unlimited API calls",
        "24/7 dedicated support",
        "Custom rate limits",
        "Advanced analytics",
        "Custom integrations",
        "SLA guarantee"
      ],
      current: false
    }
  ];

  const usage = {
    current: 245,
    limit: 1000,
    resetDate: "2024-02-01"
  };

  return (
    <div className="font-sans mx-auto max-w-6xl px-6 py-10 fade-in">
      <div className="mb-8 slide-in">
        <div className="text-sm text-[color:var(--muted)] mb-1">Pages / Billing</div>
        <h1 className="text-3xl font-bold">Billing & Usage</h1>
        <p className="text-[color:var(--muted)] mt-2">Manage your subscription and monitor API usage</p>
      </div>

      {/* Current Usage */}
      <div className="mb-8 glass rounded-2xl p-6 fade-in">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Current Usage</h2>
          <div className="text-sm text-[color:var(--muted)]">
            Resets on {new Date(usage.resetDate).toLocaleDateString()}
          </div>
        </div>
        
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span>API Calls</span>
            <span>{usage.current.toLocaleString()} / {usage.limit.toLocaleString()}</span>
          </div>
          <div className="progress w-full">
            <span style={{ inset: `0 ${100 - (usage.current / usage.limit) * 100}% 0 0` }} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card p-4 rounded-lg">
            <div className="text-2xl font-bold text-[var(--marvel-red)]">{usage.current}</div>
            <div className="text-sm text-[color:var(--muted)]">Used this month</div>
          </div>
          <div className="card p-4 rounded-lg">
            <div className="text-2xl font-bold text-[var(--marvel-blue)]">{usage.limit - usage.current}</div>
            <div className="text-sm text-[color:var(--muted)]">Remaining</div>
          </div>
          <div className="card p-4 rounded-lg">
            <div className="text-2xl font-bold text-[var(--marvel-gold)]">24%</div>
            <div className="text-sm text-[color:var(--muted)]">Usage rate</div>
          </div>
        </div>
      </div>

      {/* Pricing Plans */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6">Choose Your Plan</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative p-6 rounded-2xl transition-all duration-200 cursor-pointer ${
                plan.current
                  ? "glass border-2 border-[var(--marvel-red)] scale-105"
                  : "card hover:scale-105"
              }`}
              onClick={() => setSelectedPlan(plan.id)}
            >
              {plan.current && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <div className="badge badge-hero">Current Plan</div>
                </div>
              )}
              
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <div className="text-3xl font-bold mb-1">{plan.price}</div>
                <div className="text-sm text-[color:var(--muted)]">per {plan.period}</div>
                <p className="text-sm text-[color:var(--muted)] mt-2">{plan.description}</p>
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-[var(--marvel-red)] rounded-full"></div>
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-3 rounded-lg font-semibold transition-all duration-200 ${
                  plan.current
                    ? "bg-[var(--marvel-red)] text-white"
                    : "btn-primary"
                }`}
                disabled={plan.current}
              >
                {plan.current ? "Current Plan" : "Upgrade"}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Method */}
      <div className="glass rounded-2xl p-6 fade-in">
        <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
        <div className="flex items-center gap-4 p-4 card rounded-lg">
          <CreditCard className="w-8 h-8 text-[var(--marvel-red)]" />
          <div>
            <div className="font-semibold">•••• •••• •••• 4242</div>
            <div className="text-sm text-[color:var(--muted)]">Expires 12/25</div>
          </div>
          <button className="action-btn ml-auto px-4 py-2 card">Update</button>
        </div>
      </div>

      {/* Billing History */}
      <div className="mt-8 glass rounded-2xl p-6 fade-in">
        <h2 className="text-xl font-semibold mb-4">Billing History</h2>
        <div className="space-y-3">
          {[
            { date: "2024-01-01", amount: "$0.00", status: "Paid" },
            { date: "2023-12-01", amount: "$0.00", status: "Paid" },
            { date: "2023-11-01", amount: "$0.00", status: "Paid" },
          ].map((invoice, index) => (
            <div key={index} className="flex items-center justify-between p-3 card rounded-lg">
              <div>
                <div className="font-semibold">Invoice #{invoice.date}</div>
                <div className="text-sm text-[color:var(--muted)]">{invoice.date}</div>
              </div>
              <div className="text-right">
                <div className="font-semibold">{invoice.amount}</div>
                <div className="text-sm text-green-400">{invoice.status}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
