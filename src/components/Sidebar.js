"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();
  
  const items = [
    { href: "/dashboards", label: "Overview" },
    { href: "/api-playground", label: "API Playground" },
    { href: "/use-cases", label: "Use Cases" },
    { href: "/billing", label: "Billing" },
    { href: "/settings", label: "Settings" },
  ];

  return (
    <aside className="hidden md:flex md:flex-col w-64 shrink-0 px-4 py-6 bg-[rgba(255,255,255,0.08)] backdrop-blur-xl border-r border-[rgba(255,255,255,0.1)]">
      <div className="flex items-center gap-3 mb-8">
        <div className="h-10 w-10 rounded-xl flex items-center justify-center" style={{background:"linear-gradient(135deg, var(--marvel-red), var(--marvel-blue))"}}>
          <span className="text-white font-bold text-lg">A</span>
        </div>
        <div>
          <div className="font-semibold text-lg">Avengers Labs</div>
          <div className="chip mt-1">Personal</div>
        </div>
      </div>
      <nav className="flex flex-col gap-2">
        {items.map((it) => {
          const isActive = pathname === it.href;
          return (
            <Link 
              key={it.label} 
              href={it.href} 
              className={`rounded-lg px-4 py-3 transition-all duration-200 ${
                isActive 
                  ? "bg-gradient-to-r from-[var(--marvel-red)] to-[var(--marvel-blue)] text-white shadow-lg" 
                  : "hover:bg-[rgba(255,255,255,0.1)] hover:text-white"
              }`}
            >
              {it.label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto pt-6">
        <a href="#" target="_blank" rel="noopener noreferrer" className="rounded-lg px-4 py-2 hover:bg-[rgba(255,255,255,0.1)] text-sm transition-all duration-200">Documentation</a>
      </div>
    </aside>
  );
}


