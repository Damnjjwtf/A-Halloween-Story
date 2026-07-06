"use client";

import { useState, useTransition } from "react";
import { castVote } from "@/app/(lab)/lab/actions";

const VERDICTS = ["keep", "kill", "mutate"] as const;
type Verdict = (typeof VERDICTS)[number];

export function VotePanel({
  candidateId,
  myVerdict,
  myNote,
  partnerName,
  partnerVerdict,
  partnerNote,
}: {
  candidateId: string;
  myVerdict: Verdict | null;
  myNote: string;
  partnerName: string;
  partnerVerdict: Verdict | null;
  partnerNote: string;
}) {
  const [pending, startTransition] = useTransition();
  const [note, setNote] = useState(myNote);
  const [verdict, setVerdict] = useState<Verdict | null>(myVerdict);

  const submit = (v: Verdict) => {
    setVerdict(v);
    startTransition(() => castVote(candidateId, v, note));
  };

  return (
    <div className="flex flex-col gap-2 border-t border-hairline px-4 py-3">
      <div className="flex flex-wrap items-center gap-1.5">
        {VERDICTS.map((v) => (
          <button
            key={v}
            type="button"
            disabled={pending}
            onClick={() => submit(v)}
            aria-pressed={verdict === v}
            className={`border px-3 py-1.5 font-mono text-xs capitalize transition-colors duration-150 ${
              verdict === v
                ? "border-ink bg-ink text-paper"
                : "border-hairline hover:border-ink"
            }`}
          >
            {v}
          </button>
        ))}
        <input
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          onBlur={() => {
            if (verdict) startTransition(() => castVote(candidateId, verdict, note));
          }}
          placeholder="Note — required to make mutate mean anything"
          aria-label="Vote note"
          className="min-w-0 flex-1 border border-hairline bg-paper px-2.5 py-1.5 font-mono text-xs placeholder:text-ink-faint"
        />
      </div>
      {partnerVerdict ? (
        <p className="font-mono text-[11px] leading-relaxed text-ink-soft">
          {partnerName}: <span className="uppercase">{partnerVerdict}</span>
          {partnerNote ? ` — ${partnerNote}` : ""}
        </p>
      ) : (
        <p className="font-mono text-[11px] text-ink-faint">
          {partnerName} has not voted.
        </p>
      )}
    </div>
  );
}
