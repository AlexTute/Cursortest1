"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Shield, LogIn } from "lucide-react";

export default function ProtectedRoute({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return; // Still loading
    if (!session) {
      router.push("/auth/signin");
    }
  }, [session, status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass rounded-2xl p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[var(--marvel-red)] to-[var(--marvel-blue)] flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Loading...</h2>
          <p className="text-gray-400">Please wait while we verify your access.</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass rounded-2xl p-8 text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[var(--marvel-red)] to-[var(--marvel-blue)] flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-semibold mb-4">Access Required</h2>
          <p className="text-gray-400 mb-6">
            You need to sign in with Google to access the document summarization tool.
          </p>
          <button
            onClick={() => router.push("/auth/signin")}
            className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-[var(--marvel-red)] to-[var(--marvel-blue)] text-white font-medium mx-auto transition-all duration-200 hover:shadow-lg"
          >
            <LogIn className="w-5 h-5" />
            Sign in with Google
          </button>
        </div>
      </div>
    );
  }

  return children;
}
