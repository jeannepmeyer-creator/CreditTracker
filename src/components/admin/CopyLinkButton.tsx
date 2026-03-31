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
      className="text-sm text-brand-dark bg-brand/10 hover:bg-brand/20 px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors"
    >
      {copied ? "Copied!" : "Copy Client Link"}
    </button>
  );
}
