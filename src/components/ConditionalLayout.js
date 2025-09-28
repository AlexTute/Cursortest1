"use client";

import { usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Link from "next/link";
import LoginButton from "@/components/LoginButton";

export default function ConditionalLayout({ children }) {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  if (isHomePage) {
    // For homepage, render children directly (landing page has its own navigation)
    return <>{children}</>;
  }

  // For all other pages, render with sidebar and header
  return (
    <div className="mx-auto max-w-7xl flex">
      <Sidebar />
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
