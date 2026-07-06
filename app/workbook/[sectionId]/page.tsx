import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getSection, SECTIONS } from "@/content/workbook";
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
  if (!section || section.deferred) notFound();

  const answers = await db.answer.findMany({
    where: {
      userId: user.id,
      questionId: { in: section.questions.map((q) => q.id) },
    },
  });
  const byQuestion = new Map(answers.map((a) => [a.questionId, a.text]));

  const i = SECTIONS.findIndex((s) => s.id === section.id);
  const prev = SECTIONS.slice(0, i).filter((s) => !s.deferred).at(-1);
  const next = SECTIONS.slice(i + 1).find((s) => !s.deferred);

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
            <AutosaveTextarea
              questionId={q.id}
              initialText={byQuestion.get(q.id) ?? ""}
            />
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
