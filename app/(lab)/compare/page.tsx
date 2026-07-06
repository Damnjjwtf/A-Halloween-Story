import Link from "next/link";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { SECTIONS } from "@/content/workbook";
import { getSystem } from "@/content/library";
import { getCurrentUser, OTHER_USER, USERS } from "@/lib/session";

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

  const starsFor = (userId: string) =>
    stars
      .filter((s) => s.userId === userId)
      .map((s) => getSystem(s.systemId))
      .filter((s) => s !== undefined)
      .sort((a, b) => a.id - b.id);
  const myStars = starsFor(user.id);
  const theirStars = starsFor(partnerId);
  const myStarIds = new Set(myStars.map((s) => s.id));
  const theirStarIds = new Set(theirStars.map((s) => s.id));

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
                if (q.id === "7.1") {
                  return (
                    <div key={q.id}>
                      <p className="mb-2 font-mono text-xs tracking-widest text-ink-soft uppercase">
                        Q7.1 — starred systems
                      </p>
                      <div className="grid gap-px border border-hairline bg-hairline sm:grid-cols-2">
                        {[
                          { label: me, list: myStars, other: theirStarIds },
                          { label: them, list: theirStars, other: myStarIds },
                        ].map(({ label, list, other }) => (
                          <div key={label} className="bg-card p-3">
                            <p className="mb-2 font-mono text-[11px] tracking-widest text-ink-faint uppercase">
                              {label}
                            </p>
                            {list.length ? (
                              <ul className="flex flex-wrap gap-1.5">
                                {list.map((s) => {
                                  const solo = !other.has(s.id);
                                  return (
                                    <li
                                      key={s.id}
                                      className={`border px-2 py-1 font-mono text-[11px] ${
                                        solo
                                          ? "border-signal text-signal"
                                          : "border-hairline"
                                      }`}
                                      title={
                                        solo ? `Only ${label}` : "Both starred"
                                      }
                                    >
                                      No. {String(s.id).padStart(2, "0")}{" "}
                                      {s.name}
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
