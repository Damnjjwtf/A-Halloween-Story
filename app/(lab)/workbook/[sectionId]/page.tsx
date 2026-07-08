import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getSection, SECTIONS } from "@/content/workbook";
import { getSystem } from "@/content/library";
import { getTone, isToneId } from "@/content/tone";
import { getCurrentUser } from "@/lib/session";
import { AutosaveTextarea } from "@/components/autosave-textarea";

export default async function SectionPage({
  params,
}: {
  params: Promise<{ sectionId: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/gate");

  const { sectionId } = await params;
  const section = getSection(sectionId);
  if (!section) notFound();

  const hasStarPrompt = section.questions.some((q) => q.starPrompt);
  const [answers, myStars] = await Promise.all([
    db.answer.findMany({
      where: {
        userId: user.id,
        questionId: { in: section.questions.map((q) => q.id) },
      },
    }),
    hasStarPrompt
      ? db.star.findMany({ where: { userId: user.id } })
      : Promise.resolve([]),
  ]);
  const byQuestion = new Map(answers.map((a) => [a.questionId, a.text]));

  // Split starred ids into structure (1–30) and tone (101–120) labels.
  const structureStars = myStars
    .filter((s) => !isToneId(s.systemId))
    .map((s) => getSystem(s.systemId))
    .filter((s) => s !== undefined)
    .sort((a, b) => a.id - b.id)
    .map((s) => ({ label: `No. ${String(s.id).padStart(2, "0")}`, name: s.name }));
  const toneStars = myStars
    .filter((s) => isToneId(s.systemId))
    .map((s) => getTone(s.systemId))
    .filter((t) => t !== undefined)
    .sort((a, b) => a.id - b.id)
    .map((t) => ({ label: t.code, name: t.name }));

  const i = SECTIONS.findIndex((s) => s.id === section.id);
  const prev = SECTIONS[i - 1];
  const next = SECTIONS[i + 1];

  return (
    <div>
      <header className="mb-8 border-b border-hairline pb-4">
        <p className="mb-1 font-mono text-xs tracking-widest text-ink-soft uppercase">
          Sec. {section.index} — {section.questions.length} questions
        </p>
        <h1 className="font-display text-3xl font-semibold tracking-tight">
          {section.title}
        </h1>
      </header>

      <ol className="flex flex-col gap-6">
        {section.questions.map((q) => (
          <li key={q.id} className="border border-hairline bg-card p-4 sm:p-5">
            <div className="mb-3 flex items-baseline gap-3">
              <span className="shrink-0 font-mono text-xs tracking-widest text-ink-soft uppercase">
                Q{q.id}
              </span>
            </div>
            <p className="mb-1 text-sm leading-relaxed font-medium">
              {q.prompt}
            </p>
            {q.helpText ? (
              <p className="mb-3 text-xs leading-relaxed text-ink-soft">
                {q.helpText}
              </p>
            ) : (
              <div className="mb-3" />
            )}
            {q.starPrompt ? (
              (() => {
                const stars =
                  q.starPrompt === "tone" ? toneStars : structureStars;
                const min = q.starPrompt === "tone" ? 3 : 4;
                const libHref =
                  q.starPrompt === "tone" ? "/library?tab=tone" : "/library";
                return (
                  <div className="border border-hairline bg-paper px-3 py-2.5">
                    {stars.length > 0 ? (
                      <ul className="flex flex-wrap gap-1.5">
                        {stars.map((s) => (
                          <li
                            key={s.label}
                            className="border border-hairline px-2 py-1 font-mono text-[11px]"
                          >
                            {s.label} {s.name}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="font-mono text-xs text-ink-faint">
                        Nothing starred yet.
                      </p>
                    )}
                    <p className="mt-2 font-mono text-[11px] tracking-wide text-ink-soft">
                      {stars.length}/{min} minimum —{" "}
                      <Link
                        href={libHref}
                        className="underline hover:text-ink"
                      >
                        open the Library
                      </Link>
                    </p>
                  </div>
                );
              })()
            ) : (
              <AutosaveTextarea
                questionId={q.id}
                initialText={byQuestion.get(q.id) ?? ""}
              />
            )}
          </li>
        ))}
      </ol>

      <nav className="mt-10 flex items-center justify-between gap-4">
        {prev ? (
          <Link
            href={`/workbook/${prev.id}`}
            className="border border-ink px-4 py-2.5 font-mono text-xs tracking-wide transition-colors duration-150 hover:bg-ink hover:text-paper"
          >
            ← Sec. {prev.index}
          </Link>
        ) : (
          <span />
        )}
        <Link
          href="/workbook"
          className="font-mono text-xs tracking-widest text-ink-soft uppercase hover:text-ink"
        >
          Index
        </Link>
        {next ? (
          <Link
            href={`/workbook/${next.id}`}
            className="border border-ink px-4 py-2.5 font-mono text-xs tracking-wide transition-colors duration-150 hover:bg-ink hover:text-paper"
          >
            Sec. {next.index} →
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </div>
  );
}
