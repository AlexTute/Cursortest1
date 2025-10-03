"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import Link from "next/link";
import LoginButton from "@/components/LoginButton";

export default function ConditionalLayout({ children }) {
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (isHomePage) {
    // For homepage, render children directly (landing page has its own navigation)
    return <>{children}</>;
  }

  // For all other pages, render with sidebar and header
  return (
    <div className="mx-auto max-w-7xl flex relative">
      {/* Sidebar */}
      <div className={`transition-all duration-300 ease-in-out relative ${
        sidebarVisible 
          ? 'w-64 opacity-100 translate-x-0' 
          : 'w-0 opacity-0 -translate-x-full'
      } overflow-hidden`}>
        <Sidebar />
      </div>

      {/* Sidebar Toggle Button - always visible, positioned relative to sidebar */}
      <button
        onClick={() => setSidebarVisible(!sidebarVisible)}
        className={`fixed z-50 transition-all duration-300 ease-in-out ${
          sidebarVisible 
            ? 'left-[15.9375rem]' // Positioned EXACTLY on the right edge of sidebar (255px)
            : 'left-4' // Positioned at the left edge when sidebar is hidden
        }`}
        style={{
          top: `${Math.max(16, scrollY + 16)}px` // Follows scroll but stays at least 16px from top
        }}
        aria-label={sidebarVisible ? "Hide sidebar" : "Show sidebar"}
      >
        <div className="h-10 w-10 rounded-xl bg-gradient-to-r from-[var(--marvel-red)] to-[var(--marvel-blue)] flex items-center justify-center hover:shadow-lg transition-all duration-200 shadow-md">
          <svg 
            className={`w-5 h-5 text-white transition-transform duration-300 ${
              sidebarVisible ? 'rotate-180' : 'rotate-0'
            }`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </button>

      {/* Main Content */}
      <div className="flex-1 min-w-0">
        <header className="sticky top-0 z-40">
          <div className="glass m-4 rounded-2xl px-4 py-3 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-xl card flex items-center justify-center">
                <span className="gradient-text font-bold">A</span>
              </div>
              <span className="font-semibold tracking-wide">Avengers Dashboard</span>
            </Link>
            <div className="flex items-center gap-4">
              <nav className="flex items-center gap-2">
                <Link href="/" className="rounded-md px-3 py-2 hover:underline">Home</Link>
                <Link href="/dashboards" className="rounded-md px-3 py-2 hover:underline">Overview</Link>
              </nav>
              <LoginButton />
            </div>
          </div>
        </header>
        <main className="min-h-[calc(100vh-80px)]">{children}</main>
        <footer className="p-6 text-center text-sm text-[color:var(--muted)]">
          <span>Hero-grade UI, inspired by Marvel aesthetics.</span>
        </footer>
      </div>
    </div>
  );
}
