"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { saveAnswer } from "@/app/workbook/actions";

type Status = "idle" | "dirty" | "saving" | "saved" | "error";

const STATUS_LABEL: Record<Status, string> = {
  idle: "",
  dirty: "Unsaved",
  saving: "Saving",
  saved: "Saved",
  error: "Save failed — retrying on next edit",
};

export function AutosaveTextarea({
  questionId,
  initialText,
}: {
  questionId: string;
  initialText: string;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Serialize saves: the latest text always wins, no out-of-order writes.
  const inflight = useRef<Promise<void>>(Promise.resolve());
  const lastSaved = useRef(initialText);
  const current = useRef(initialText);

  const flush = useCallback(() => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
    const text = current.current;
    if (text === lastSaved.current) return;
    setStatus("saving");
    inflight.current = inflight.current.then(async () => {
      try {
        const res = await saveAnswer(questionId, text);
        if (res.ok) {
          lastSaved.current = text;
          setStatus(current.current === text ? "saved" : "dirty");
        } else {
          setStatus("error");
        }
      } catch {
        setStatus("error");
      }
    });
  }, [questionId]);

  const onChange = (text: string) => {
    current.current = text;
    setStatus("dirty");
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(flush, 900);
  };

  // Flush on unmount / tab hide so a quick navigation doesn't drop text.
  useEffect(() => {
    const onHide = () => flush();
    document.addEventListener("visibilitychange", onHide);
    return () => {
      document.removeEventListener("visibilitychange", onHide);
      flush();
    };
  }, [flush]);

  return (
    <div className="flex flex-col gap-1.5">
      <textarea
        defaultValue={initialText}
        onChange={(e) => onChange(e.target.value)}
        onBlur={flush}
        rows={5}
        className="w-full resize-y border border-hairline bg-paper px-3 py-2.5 font-mono text-sm leading-relaxed placeholder:text-ink-faint"
        placeholder="—"
        aria-label={`Answer to question ${questionId}`}
      />
      <p
        aria-live="polite"
        className="h-4 text-right font-mono text-[11px] tracking-widest text-ink-faint uppercase"
      >
        {STATUS_LABEL[status]}
      </p>
    </div>
  );
}
