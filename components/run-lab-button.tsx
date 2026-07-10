"use client";

import { useState, useTransition } from "react";
import { runTheLab } from "@/app/(lab)/lab/actions";
import { randomOblique } from "@/content/oblique";

export function RunLabButton({ disabled }: { disabled: boolean }) {
  const [pending, startTransition] = useTransition();
  // The dealt curveball, shown before it rides into the run.
  const [dealt, setDealt] = useState<string | null>(null);

  const run = (curveball: string) =>
    startTransition(() => runTheLab(curveball));

  const dealCurveball = () => {
    const card = randomOblique();
    setDealt(card.text);
    run(card.text);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          disabled={disabled || pending}
          onClick={() => {
            setDealt(null);
            run("");
          }}
          className="border border-ink bg-transparent px-6 py-3 font-mono text-sm tracking-wide transition-colors duration-150 hover:bg-ink hover:text-paper disabled:cursor-not-allowed disabled:opacity-40"
        >
          {pending ? "Synthesizing — this takes a minute" : "Run the Lab"}
        </button>
        <button
          type="button"
          disabled={disabled || pending}
          onClick={dealCurveball}
          title="Deal one random Oblique-strategy constraint into this run"
          className="border border-signal bg-transparent px-6 py-3 font-mono text-sm tracking-wide text-signal transition-colors duration-150 hover:bg-signal hover:text-paper disabled:cursor-not-allowed disabled:opacity-40"
        >
          Deal a curveball
        </button>
      </div>
      {dealt ? (
        <p className="border-l-2 border-signal pl-3 font-mono text-xs leading-relaxed text-ink-soft">
          <span className="text-signal">Curveball dealt — </span>
          {dealt}
        </p>
      ) : null}
    </div>
  );
}
