"use client";

import { useState } from "react";

export default function CopyLinkButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      onClick={handleCopy}
      className="text-sm text-teal-700 bg-teal-100 hover:bg-teal-200 px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors"
    >
      {copied ? "Copied!" : "Copy Link"}
    </button>
  );
}
