import Link from "next/link";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { SECTIONS } from "@/content/workbook";
import { getSystem } from "@/content/library";
import { getTone, isToneId } from "@/content/tone";
import { getCurrentUser, OTHER_USER, USERS } from "@/lib/session";

type Chip = { id: number; label: string; name: string };

export default async function ComparePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/gate");

  const partnerId = OTHER_USER[user.id];
  const [answers, stars] = await Promise.all([
    db.answer.findMany({ where: { NOT: { text: "" } } }),
    db.star.findMany(),
  ]);

  const byUser = (userId: string) =>
    new Map(
      answers
        .filter((a) => a.userId === userId)
        .map((a) => [a.questionId, a.text]),
    );
  const mine = byUser(user.id);
  const theirs = byUser(partnerId);

  // Star chips for one user, filtered to structure (1–30) or tone (101–120).
  const chipsFor = (userId: string, kind: "structure" | "tone"): Chip[] =>
    stars
      .filter((s) => s.userId === userId)
      .filter((s) => (kind === "tone" ? isToneId(s.systemId) : !isToneId(s.systemId)))
      .map((s): Chip | null => {
        if (kind === "tone") {
          const t = getTone(s.systemId);
          return t ? { id: t.id, label: t.code, name: t.name } : null;
        }
        const sys = getSystem(s.systemId);
        return sys
          ? { id: sys.id, label: `No. ${String(sys.id).padStart(2, "0")}`, name: sys.name }
          : null;
      })
      .filter((c): c is Chip => c !== null)
      .sort((a, b) => a.id - b.id);

  const me = USERS[user.id].name;
  const them = USERS[partnerId].name;

  return (
    <div>
      <header className="mb-8">
        <p className="mb-1 font-mono text-xs tracking-widest text-ink-soft uppercase">
          Compare — divergence is signal, not error
        </p>
        <h1 className="font-display text-3xl font-semibold tracking-tight">
          {me} <span className="text-signal">/</span> {them}
        </h1>
      </header>

      <div className="flex flex-col gap-10">
        {SECTIONS.map((section) => (
          <section key={section.id}>
            <div className="mb-4 flex items-baseline gap-3 border-b border-hairline pb-2">
              <span className="font-mono text-xs tracking-widest text-ink-soft uppercase">
                Sec. {section.index}
              </span>
              <h2 className="font-display text-xl font-medium">
                {section.title}
              </h2>
            </div>

            <div className="flex flex-col gap-5">
              {section.questions.map((q) => {
                if (q.starPrompt) {
                  const kind = q.starPrompt;
                  const myChips = chipsFor(user.id, kind);
                  const theirChips = chipsFor(partnerId, kind);
                  const myIds = new Set(myChips.map((c) => c.id));
                  const theirIds = new Set(theirChips.map((c) => c.id));
                  return (
                    <div key={q.id}>
                      <p className="mb-2 font-mono text-xs tracking-widest text-ink-soft uppercase">
                        Q{q.id} — starred {kind === "tone" ? "tone" : "systems"}
                      </p>
                      <div className="grid gap-px border border-hairline bg-hairline sm:grid-cols-2">
                        {[
                          { label: me, list: myChips, other: theirIds },
                          { label: them, list: theirChips, other: myIds },
                        ].map(({ label, list, other }) => (
                          <div key={label} className="bg-card p-3">
                            <p className="mb-2 font-mono text-[11px] tracking-widest text-ink-faint uppercase">
                              {label}
                            </p>
                            {list.length ? (
                              <ul className="flex flex-wrap gap-1.5">
                                {list.map((c) => {
                                  const solo = !other.has(c.id);
                                  return (
                                    <li
                                      key={c.id}
                                      className={`border px-2 py-1 font-mono text-[11px] ${
                                        solo
                                          ? "border-signal text-signal"
                                          : "border-hairline"
                                      }`}
                                      title={
                                        solo ? `Only ${label}` : "Both starred"
                                      }
                                    >
                                      {c.label} {c.name}
                                    </li>
                                  );
                                })}
                              </ul>
                            ) : (
                              <p className="font-mono text-xs text-ink-faint">
                                No stars yet.
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                }

                const a = mine.get(q.id);
                const b = theirs.get(q.id);
                const bothAnswered = Boolean(a && b);
                const diverges = bothAnswered && a !== b;

                return (
                  <div key={q.id}>
                    <p className="mb-2 text-sm leading-relaxed">
                      <span className="mr-2 font-mono text-xs tracking-widest text-ink-soft uppercase">
                        Q{q.id}
                      </span>
                      {q.prompt}
                    </p>
                    <div
                      className={`grid gap-px bg-hairline sm:grid-cols-2 ${
                        diverges
                          ? "border-l-2 border-signal"
                          : "border border-hairline"
                      }`}
                    >
                      {[
                        { label: me, text: a },
                        { label: them, text: b },
                      ].map(({ label, text }) => (
                        <div key={label} className="bg-card p-3">
                          <p className="mb-1.5 font-mono text-[11px] tracking-widest text-ink-faint uppercase">
                            {label}
                          </p>
                          {text ? (
                            <p className="font-mono text-xs leading-relaxed whitespace-pre-wrap">
                              {text}
                            </p>
                          ) : (
                            <p className="font-mono text-xs text-ink-faint">
                              Unanswered.
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      <p className="mt-10 border-t border-hairline pt-4 font-mono text-[11px] tracking-wide text-ink-soft">
        <span className="text-signal">▌</span> marks live divergence — both
        answered, answers differ. Refresh to pull your partner&apos;s latest.{" "}
        <Link href="/workbook" className="underline hover:text-ink">
          Back to workbook
        </Link>
      </p>
    </div>
  );
}
