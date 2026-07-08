"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { saveAnswer } from "@/app/(lab)/workbook/actions";
import { useDictation } from "@/lib/use-dictation";

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
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

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

  const registerChange = useCallback(
    (text: string) => {
      current.current = text;
      setStatus("dirty");
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(flush, 900);
    },
    [flush],
  );

  const onChange = (text: string) => registerChange(text);

  // Dictation appends finalized speech to the textarea, then saves like typing.
  const appendSpeech = useCallback(
    (chunk: string) => {
      const el = textareaRef.current;
      if (!el) return;
      const base = el.value;
      const sep = base.length === 0 || /\s$/.test(base) ? "" : " ";
      el.value = base + sep + chunk.trim();
      registerChange(el.value);
    },
    [registerChange],
  );

  const { supported, listening, toggle } = useDictation(appendSpeech);

  const onChangeEvent = (text: string) => onChange(text);

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
        ref={textareaRef}
        defaultValue={initialText}
        onChange={(e) => onChangeEvent(e.target.value)}
        onBlur={flush}
        rows={5}
        className="w-full resize-y border border-hairline bg-paper px-3 py-2.5 font-mono text-sm leading-relaxed placeholder:text-ink-faint"
        placeholder="—"
        aria-label={`Answer to question ${questionId}`}
      />
      <div className="flex h-4 items-center justify-between">
        {supported ? (
          <button
            type="button"
            onClick={toggle}
            aria-pressed={listening}
            className={`border px-2 py-0.5 font-mono text-[11px] tracking-widest uppercase transition-colors duration-150 ${
              listening
                ? "border-ink bg-ink text-paper"
                : "border-hairline text-ink-soft hover:border-ink hover:text-ink"
            }`}
          >
            {listening ? "Listening — stop" : "Speak"}
          </button>
        ) : (
          <span />
        )}
        <p
          aria-live="polite"
          className="text-right font-mono text-[11px] tracking-widest text-ink-faint uppercase"
        >
          {STATUS_LABEL[status]}
        </p>
      </div>
    </div>
  );
}
