"use client";

import { useState } from "react";
import { Shield, Bell, Palette, User, Key, Globe } from "@/components/Icons";
import { useTheme } from "@/contexts/ThemeContext";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("profile");
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: false
  });
  const { theme, accentColor, changeTheme, changeAccentColor } = useTheme();

  const tabs = [
    { id: "profile", label: "Profile", icon: <User className="w-4 h-4" /> },
    { id: "security", label: "Security", icon: <Shield className="w-4 h-4" /> },
    { id: "notifications", label: "Notifications", icon: <Bell className="w-4 h-4" /> },
    { id: "appearance", label: "Appearance", icon: <Palette className="w-4 h-4" /> },
    { id: "api", label: "API Settings", icon: <Key className="w-4 h-4" /> },
    { id: "general", label: "General", icon: <Globe className="w-4 h-4" /> }
  ];

  return (
    <div className="font-sans mx-auto max-w-6xl px-6 py-10 fade-in">
      <div className="mb-8 slide-in">
        <div className="text-sm text-[color:var(--muted)] mb-1">Pages / Settings</div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-[color:var(--muted)] mt-2">Manage your account preferences and configuration</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Settings Navigation */}
        <div className="lg:col-span-1">
          <div className="glass rounded-2xl p-4">
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-[var(--marvel-red)] to-[var(--marvel-blue)] text-white"
                      : "hover:bg-[rgba(255,255,255,0.1)]"
                  }`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3">
          <div className="glass rounded-2xl p-6 fade-in">
            {activeTab === "profile" && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Profile Settings</h2>
                <div className="space-y-6">
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 bg-gradient-to-r from-[var(--marvel-red)] to-[var(--marvel-blue)] rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-2xl">A</span>
                    </div>
                    <div>
                      <button className="action-btn px-4 py-2 card">Change Avatar</button>
                      <p className="text-sm text-[color:var(--muted)] mt-1">JPG, PNG up to 2MB</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">First Name</label>
                      <input className="w-full card rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[color:var(--accent)]" defaultValue="Avengers" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Last Name</label>
                      <input className="w-full card rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[color:var(--accent)]" defaultValue="Labs" />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <input className="w-full card rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[color:var(--accent)]" defaultValue="avengers@labs.com" />
                  </div>
                  
                  <button className="action-btn btn-primary px-6 py-2">Save Changes</button>
                </div>
              </div>
            )}

            {activeTab === "security" && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Security Settings</h2>
                <div className="space-y-6">
                  <div className="card p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">Password</h3>
                    <p className="text-sm text-[color:var(--muted)] mb-3">Last changed 30 days ago</p>
                    <button className="action-btn px-4 py-2 card">Change Password</button>
                  </div>
                  
                  <div className="card p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">Two-Factor Authentication</h3>
                    <p className="text-sm text-[color:var(--muted)] mb-3">Add an extra layer of security</p>
                    <button className="action-btn px-4 py-2 btn-primary">Enable 2FA</button>
                  </div>
                  
                  <div className="card p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">API Keys</h3>
                    <p className="text-sm text-[color:var(--muted)] mb-3">Manage your API keys and permissions</p>
                    <button className="action-btn px-4 py-2 card">View API Keys</button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "notifications" && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Notification Preferences</h2>
                <div className="space-y-4">
                  {[
                    { key: "email", label: "Email Notifications", desc: "Receive updates via email" },
                    { key: "push", label: "Push Notifications", desc: "Get real-time updates" },
                    { key: "sms", label: "SMS Alerts", desc: "Critical alerts via SMS" }
                  ].map((notif) => (
                    <div key={notif.key} className="flex items-center justify-between p-4 card rounded-lg">
                      <div>
                        <h3 className="font-semibold">{notif.label}</h3>
                        <p className="text-sm text-[color:var(--muted)]">{notif.desc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={notifications[notif.key]}
                          onChange={(e) => setNotifications(prev => ({ ...prev, [notif.key]: e.target.checked }))}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[var(--marvel-red)]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--marvel-red)]"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "appearance" && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Appearance</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-4">Theme</h3>
                    <div className="grid grid-cols-3 gap-4">
                      {["Light", "Dark", "Auto"].map((themeOption) => (
                        <button 
                          key={themeOption} 
                          onClick={() => changeTheme(themeOption.toLowerCase())}
                          className={`action-btn p-4 card text-center transition-all duration-200 ${
                            theme === themeOption.toLowerCase() 
                              ? 'ring-2 ring-[var(--accent)] bg-[var(--accent)]/10' 
                              : 'hover:bg-[rgba(255,255,255,0.1)]'
                          }`}
                        >
                          <div className="w-8 h-8 bg-gradient-to-r from-[var(--marvel-red)] to-[var(--marvel-blue)] rounded-full mx-auto mb-2"></div>
                          {themeOption}
                          {theme === themeOption.toLowerCase() && (
                            <div className="text-xs text-[var(--accent)] font-medium mt-1">Selected</div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-4">Accent Color</h3>
                    <div className="flex gap-3">
                      {[
                        { color: "#e11d2b", name: "Red" },
                        { color: "#0a3d91", name: "Blue" },
                        { color: "#f6c445", name: "Yellow" },
                        { color: "#06b6d4", name: "Cyan" },
                        { color: "#8b5cf6", name: "Purple" }
                      ].map((colorOption) => (
                        <button
                          key={colorOption.color}
                          onClick={() => changeAccentColor(colorOption.color)}
                          className={`w-10 h-10 rounded-full border-2 transition-all duration-200 ${
                            accentColor === colorOption.color 
                              ? 'border-white ring-2 ring-[var(--accent)] scale-110' 
                              : 'border-white hover:scale-105'
                          }`}
                          style={{ backgroundColor: colorOption.color }}
                          title={colorOption.name}
                        />
                      ))}
                    </div>
                    <p className="text-sm text-[color:var(--muted)] mt-2">
                      Current accent color: <span style={{ color: accentColor }} className="font-medium">{accentColor}</span>
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "api" && (
              <div>
                <h2 className="text-2xl font-bold mb-6">API Settings</h2>
                <div className="space-y-6">
                  <div className="card p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">Rate Limiting</h3>
                    <p className="text-sm text-[color:var(--muted)] mb-3">Configure API rate limits</p>
                    <div className="flex gap-4">
                      <input className="card rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[color:var(--accent)]" placeholder="1000" />
                      <span className="text-sm text-[color:var(--muted)] self-center">requests per hour</span>
                    </div>
                  </div>
                  
                  <div className="card p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">Webhook URL</h3>
                    <p className="text-sm text-[color:var(--muted)] mb-3">Receive notifications for API events</p>
                    <input className="w-full card rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[color:var(--accent)]" placeholder="https://your-app.com/webhook" />
                  </div>
                  
                  <div className="card p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">API Version</h3>
                    <p className="text-sm text-[color:var(--muted)] mb-3">Select the API version to use</p>
                    <select className="w-full card rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[color:var(--accent)]">
                      <option>v1 (Current)</option>
                      <option>v2 (Beta)</option>
                    </select>
                  </div>
                  
                  <button className="action-btn btn-primary px-6 py-2">Save API Settings</button>
                </div>
              </div>
            )}

            {activeTab === "general" && (
              <div>
                <h2 className="text-2xl font-bold mb-6">General Settings</h2>
                <div className="space-y-6">
                  <div className="card p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">Language</h3>
                    <select className="w-full card rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[color:var(--accent)]">
                      <option>English</option>
                      <option>Spanish</option>
                      <option>French</option>
                      <option>German</option>
                    </select>
                  </div>
                  
                  <div className="card p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">Timezone</h3>
                    <select className="w-full card rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[color:var(--accent)]">
                      <option>UTC-8 (Pacific)</option>
                      <option>UTC-5 (Eastern)</option>
                      <option>UTC+0 (GMT)</option>
                      <option>UTC+1 (CET)</option>
                    </select>
                  </div>
                  
                  <div className="card p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">Data Export</h3>
                    <p className="text-sm text-[color:var(--muted)] mb-3">Download your data in JSON or CSV format</p>
                    <button className="action-btn px-4 py-2 card">Export Data</button>
                  </div>
                  
                  <div className="card p-4 rounded-lg border-red-500/20">
                    <h3 className="font-semibold mb-2 text-red-400">Danger Zone</h3>
                    <p className="text-sm text-[color:var(--muted)] mb-3">Permanently delete your account and all data</p>
                    <button className="action-btn px-4 py-2 bg-red-600 hover:bg-red-700 text-white">Delete Account</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
