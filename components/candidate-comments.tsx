"use client";

import { useOptimistic, useRef, useState, useTransition } from "react";
import { addComment } from "@/app/(lab)/lab/actions";

export type CommentItem = {
  id: string;
  authorName: string;
  body: string;
  createdAt: string; // ISO
  mine: boolean;
};

export function CandidateComments({
  candidateId,
  comments,
  myName,
}: {
  candidateId: string;
  comments: CommentItem[];
  myName: string;
}) {
  const [pending, startTransition] = useTransition();
  const [draft, setDraft] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [optimistic, addOptimistic] = useOptimistic(
    comments,
    (state, next: CommentItem) => [...state, next],
  );

  const submit = () => {
    const body = draft.trim();
    if (!body) return;
    setDraft("");
    startTransition(() => {
      addOptimistic({
        id: `tmp-${Date.now()}`,
        authorName: myName,
        body,
        createdAt: new Date().toISOString(),
        mine: true,
      });
      void addComment(candidateId, body);
    });
    inputRef.current?.focus();
  };

  return (
    <details className="border-t border-hairline">
      <summary className="cursor-pointer px-4 py-2 font-mono text-[11px] tracking-widest text-ink-soft uppercase select-none hover:text-ink">
        Thread{optimistic.length ? ` — ${optimistic.length}` : ""}
      </summary>
      <div className="flex flex-col gap-2 px-4 pt-1 pb-3">
        {optimistic.length ? (
          <ul className="flex flex-col gap-2">
            {optimistic.map((c) => (
              <li key={c.id} className="font-mono text-[11px] leading-relaxed">
                <span className={c.mine ? "text-ink" : "text-signal"}>
                  {c.authorName}
                </span>
                <span className="text-ink-faint">
                  {" · "}
                  {c.createdAt.slice(0, 16).replace("T", " ")}
                </span>
                <p className="mt-0.5 whitespace-pre-wrap text-ink-soft">
                  {c.body}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="font-mono text-[11px] text-ink-faint">
            No replies yet. Start the thread.
          </p>
        )}
        <div className="mt-1 flex items-center gap-1.5">
          <input
            ref={inputRef}
            type="text"
            value={draft}
            disabled={pending}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                submit();
              }
            }}
            placeholder="Reply…"
            aria-label="Add a reply"
            className="min-w-0 flex-1 border border-hairline bg-paper px-2.5 py-1.5 font-mono text-[11px] placeholder:text-ink-faint disabled:opacity-50"
          />
          <button
            type="button"
            onClick={submit}
            disabled={pending || !draft.trim()}
            className="border border-ink px-3 py-1.5 font-mono text-[11px] tracking-wide transition-colors duration-150 hover:bg-ink hover:text-paper disabled:cursor-not-allowed disabled:opacity-40"
          >
            Send
          </button>
        </div>
      </div>
    </details>
  );
}
