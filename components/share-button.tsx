"use client";

import { useState } from "react";

export function ShareButton({ candidateId }: { candidateId: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    const url = `${window.location.origin}/c/${candidateId}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      type="button"
      onClick={copy}
      className="border border-hairline px-2 py-1 font-mono text-[10px] tracking-widest uppercase transition-colors duration-150 hover:border-ink"
      title="Copy a public read-only link to this candidate"
    >
      {copied ? "Link copied" : "Share"}
    </button>
  );
}
