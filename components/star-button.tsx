"use client";

import { useOptimistic, useTransition } from "react";
import { toggleStar } from "@/app/(lab)/library/actions";

export function StarButton({
  systemId,
  starred,
}: {
  systemId: number;
  starred: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const [optimistic, setOptimistic] = useOptimistic(starred);

  return (
    <button
      type="button"
      aria-pressed={optimistic}
      disabled={isPending}
      onClick={() =>
        startTransition(async () => {
          setOptimistic(!optimistic);
          await toggleStar(systemId);
        })
      }
      className={`border px-3 py-1.5 font-mono text-xs tracking-wide transition-colors duration-150 ${
        optimistic
          ? "border-ink bg-ink text-paper"
          : "border-hairline bg-transparent hover:border-ink"
      }`}
    >
      {optimistic ? "Starred" : "Star"}
    </button>
  );
}
