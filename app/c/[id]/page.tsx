import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

async function getCandidate(id: string) {
  return db.candidate.findUnique({ where: { id } });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const c = await getCandidate(id);
  if (!c) return { title: "Structure Lab" };
  const title = `${c.name} — Structure Lab`;
  return {
    title,
    description: c.engineSummary,
    openGraph: {
      title,
      description: c.engineSummary,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: c.engineSummary,
    },
  };
}

export default async function SharedCandidate({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const c = await getCandidate(id);
  if (!c) notFound();

  const fields: { label: string; value: string; mono?: boolean }[] = [
    { label: "Engine", value: c.engineSummary },
    { label: "Tonal engine", value: c.tonalEngine },
    { label: "Clock & border", value: c.clockBorder },
    { label: "Beat-map sketch", value: c.beatMap, mono: true },
    { label: "Predicted failure mode", value: c.failureMode },
    { label: "Novelty check", value: c.noveltyCheck },
  ].filter((f) => f.value);

  return (
    <main className="flex min-h-dvh items-center justify-center p-6">
      <article className="relative w-full max-w-2xl border border-hairline bg-card p-8 sm:p-10">
        {/* Specimen-sheet registration marks */}
        {(
          [
            "top-0 left-0 border-t border-l",
            "top-0 right-0 border-t border-r",
            "bottom-0 left-0 border-b border-l",
            "right-0 bottom-0 border-r border-b",
          ] as const
        ).map((pos) => (
          <span
            key={pos}
            aria-hidden
            className={`absolute h-4 w-4 border-ink ${pos}`}
          />
        ))}

        <header className="mb-8 border-b border-hairline pb-6">
          <p className="mb-2 font-mono text-xs tracking-widest text-ink-soft uppercase">
            Structure Lab — candidate structure
          </p>
          <h1 className="font-display text-4xl font-semibold tracking-tight">
            {c.name}
          </h1>
        </header>

        <dl className="flex flex-col gap-5 font-mono text-sm leading-relaxed">
          {fields.map((f) => (
            <div key={f.label}>
              <dt className="mb-1 text-xs tracking-widest text-ink-faint uppercase">
                {f.label}
              </dt>
              <dd
                className={f.mono ? "whitespace-pre-wrap" : "font-sans text-[15px]"}
              >
                {f.value}
              </dd>
            </div>
          ))}
          {c.sourceAnswers.length ? (
            <div>
              <dt className="mb-1 text-xs tracking-widest text-ink-faint uppercase">
                Derivation
              </dt>
              <dd className="text-ink-soft">{c.sourceAnswers.join("; ")}</dd>
            </div>
          ) : null}
        </dl>

        <footer className="mt-10 flex items-baseline justify-between border-t border-hairline pt-4">
          <a
            href="/about"
            className="font-mono text-[11px] tracking-widest text-ink-faint uppercase underline-offset-2 hover:text-ink hover:underline"
          >
            A Halloween Story — how it works
          </a>
          <p className="font-mono text-[11px] tracking-widest text-ink-faint uppercase">
            Read-only
          </p>
        </footer>
      </article>
    </main>
  );
}
