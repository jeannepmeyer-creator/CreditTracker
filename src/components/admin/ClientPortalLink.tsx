"use client";

import { useState } from "react";

export default function ClientPortalLink({ token }: { token: string }) {
  const [copied, setCopied] = useState(false);
  const path = `/client/${token}`;
  const fullUrl = typeof window !== "undefined" ? window.location.origin + path : path;

  async function handleCopy() {
    const url = window.location.origin + path;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="bg-brand/5 border border-brand/20 rounded-xl p-4">
      <p className="text-sm font-semibold text-brand-dark mb-2">Client Portal Link</p>
      <div className="flex items-center gap-2">
        <code className="text-xs text-gray-600 bg-white border border-gray-200 rounded-lg px-3 py-2 flex-1 truncate">
          {fullUrl}
        </code>
        <button
          onClick={handleCopy}
          className="text-sm text-brand-dark bg-brand/10 hover:bg-brand/20 px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors"
        >
          {copied ? "Copied!" : "Copy Client Link"}
        </button>
      </div>
    </div>
  );
}
