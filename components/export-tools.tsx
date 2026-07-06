"use client";

import { useState } from "react";

export function ExportTools({ markdown }: { markdown: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const download = () => {
    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `structure-lab-export-${new Date().toISOString().slice(0, 10)}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex gap-2">
      <button
        type="button"
        onClick={copy}
        className="border border-ink px-4 py-2.5 font-mono text-xs tracking-wide transition-colors duration-150 hover:bg-ink hover:text-paper"
      >
        {copied ? "Copied" : "Copy markdown"}
      </button>
      <button
        type="button"
        onClick={download}
        className="border border-ink px-4 py-2.5 font-mono text-xs tracking-wide transition-colors duration-150 hover:bg-ink hover:text-paper"
      >
        Download .md
      </button>
    </div>
  );
}
