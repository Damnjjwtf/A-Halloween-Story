export function ProgressTag({
  answered,
  total,
}: {
  answered: number;
  total: number;
}) {
  const done = total > 0 && answered === total;
  return (
    <span
      className={`font-mono text-xs tabular-nums ${
        done ? "text-ink" : "text-ink-soft"
      }`}
    >
      {String(answered).padStart(2, "0")}/{String(total).padStart(2, "0")}
    </span>
  );
}
