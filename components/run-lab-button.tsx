"use client";

import { useTransition } from "react";
import { runTheLab } from "@/app/(lab)/lab/actions";

export function RunLabButton({ disabled }: { disabled: boolean }) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={disabled || pending}
      onClick={() => startTransition(() => runTheLab())}
      className="border border-ink bg-transparent px-6 py-3 font-mono text-sm tracking-wide transition-colors duration-150 hover:bg-ink hover:text-paper disabled:cursor-not-allowed disabled:opacity-40"
    >
      {pending ? "Synthesizing — this takes a minute" : "Run the Lab"}
    </button>
  );
}
