"use client";

import { useEffect, useState, useTransition } from "react";
import { runTheLab } from "@/app/(lab)/lab/actions";
import { randomOblique } from "@/content/oblique";

// A single synthesis call has no real progress signal — these stages give
// honest "still alive" feedback without faking a percentage.
const STAGES = [
  "Reading both workbooks…",
  "Loading the starred systems…",
  "Building the morphological box…",
  "Generating candidate structures…",
  "Checking novelty and failure modes…",
  "Still going — some runs take a bit longer…",
];

function RunProgress() {
  const [elapsed, setElapsed] = useState(0);
  const [stageIndex, setStageIndex] = useState(0);

  useEffect(() => {
    const start = Date.now();
    const clock = setInterval(
      () => setElapsed(Math.floor((Date.now() - start) / 1000)),
      1000,
    );
    const stage = setInterval(
      () => setStageIndex((i) => Math.min(i + 1, STAGES.length - 1)),
      7000,
    );
    return () => {
      clearInterval(clock);
      clearInterval(stage);
    };
  }, []);

  return (
    <div
      role="status"
      aria-live="polite"
      className="flex flex-col gap-2 border border-hairline bg-paper px-4 py-3"
    >
      <div className="flex items-center justify-between gap-3">
        <p className="font-mono text-xs tracking-wide text-ink">
          {STAGES[stageIndex]}
        </p>
        <p className="font-mono text-[11px] tabular-nums text-ink-faint">
          {elapsed}s
        </p>
      </div>
      <div className="h-1 w-full overflow-hidden bg-hairline">
        <div className="h-full w-1/5 bg-ink animate-progress-sweep" />
      </div>
    </div>
  );
}

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
          {pending ? "Synthesizing…" : "Run the Lab"}
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
      {pending ? <RunProgress /> : null}
    </div>
  );
}
