"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { User, LogOut, LogIn } from "lucide-react";

export default function LoginButton() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex items-center gap-2 px-4 py-2">
        <div className="w-6 h-6 rounded-full bg-gray-300 animate-pulse"></div>
        <span className="text-sm text-gray-400">Loading...</span>
      </div>
    );
  }

  if (session) {
    return (
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[var(--marvel-red)] to-[var(--marvel-blue)] flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-white">
              {session.user.name}
            </p>
            <p className="text-xs text-gray-400">
              {session.user.email}
            </p>
          </div>
        </div>
        <button
          onClick={() => signOut()}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm transition-colors duration-200"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Sign Out</span>
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => signIn("google")}
      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white hover:bg-gray-100 text-gray-900 text-sm font-medium transition-colors duration-200 shadow-lg hover:shadow-xl"
    >
      <LogIn className="w-4 h-4" />
      <span>Sign in with Google</span>
    </button>
  );
}
