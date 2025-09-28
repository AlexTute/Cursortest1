"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { AlertCircle, ArrowLeft, RefreshCw } from "lucide-react";
import { Suspense } from "react";

function AuthErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const getErrorMessage = (error) => {
    switch (error) {
      case "Configuration":
        return "There is a problem with the server configuration.";
      case "AccessDenied":
        return "Access denied. You do not have permission to sign in.";
      case "Verification":
        return "The verification token has expired or has already been used.";
      default:
        return "An error occurred during authentication. Please try again.";
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="glass rounded-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-full bg-red-500 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-2 text-red-400">Authentication Error</h1>
          <p className="text-gray-400">
            {getErrorMessage(error)}
          </p>
        </div>

        <div className="space-y-4">
          <Link
            href="/auth/signin"
            className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-lg bg-gradient-to-r from-[var(--marvel-red)] to-[var(--marvel-blue)] text-white font-medium transition-all duration-200 hover:shadow-lg"
          >
            <RefreshCw className="w-5 h-5" />
            Try Again
          </Link>

          <Link
            href="/"
            className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-lg bg-gray-600 hover:bg-gray-700 text-white font-medium transition-all duration-200"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </Link>
        </div>

        {error && (
          <div className="mt-6 p-4 bg-red-500/10 rounded-lg border border-red-500/20">
            <p className="text-sm text-red-300">
              <strong>Error Code:</strong> {error}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AuthError() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="glass rounded-2xl p-8 w-full max-w-md text-center">
          <div className="w-16 h-16 rounded-full bg-gray-500 flex items-center justify-center mx-auto mb-4 animate-pulse">
            <AlertCircle className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Loading...</h2>
          <p className="text-gray-400">Please wait while we load the error details.</p>
        </div>
      </div>
    }>
      <AuthErrorContent />
    </Suspense>
  );
}
