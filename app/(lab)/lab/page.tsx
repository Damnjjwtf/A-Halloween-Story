import Link from "next/link";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { FAMILY_LABEL, getSystem } from "@/content/library";
import { getTone, isToneId, TONE_TYPE_LABEL } from "@/content/tone";
import { getCurrentUser, OTHER_USER, USERS } from "@/lib/session";
import { RunLabButton } from "@/components/run-lab-button";
import { VotePanel } from "@/components/vote-panel";

export default async function LabPage({
  searchParams,
}: {
  searchParams: Promise<{ dealt?: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/gate");
  const { dealt } = await searchParams;

  const partnerId = OTHER_USER[user.id];
  const [stars, runs] = await Promise.all([
    db.star.findMany(),
    db.run.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        candidates: { include: { votes: true } },
      },
    }),
  ]);

  const tray = [...new Set(stars.map((s) => s.systemId))]
    .sort((a, b) => a - b)
    .map((id) => {
      const tone = isToneId(id) ? getTone(id) : undefined;
      const sys = tone ? undefined : getSystem(id);
      const who = stars
        .filter((s) => s.systemId === id)
        .map((s) => USERS[s.userId as "jj" | "stefan"].name);
      if (tone) {
        return {
          id,
          label: `${tone.code} ${tone.name}`,
          title: `${TONE_TYPE_LABEL[tone.type]} — starred by ${who.join(" + ")}`,
        };
      }
      if (sys) {
        return {
          id,
          label: `No. ${String(sys.id).padStart(2, "0")} ${sys.name}`,
          title: `${FAMILY_LABEL[sys.family]} — starred by ${who.join(" + ")}`,
        };
      }
      return null;
    })
    .filter((t) => t !== null);

  const apiConfigured = Boolean(process.env.ANTHROPIC_API_KEY);

  return (
    <div>
      <header className="mb-6">
        <p className="mb-1 font-mono text-xs tracking-widest text-ink-soft uppercase">
          The Lab — morphological pairing engine
        </p>
        <h1 className="font-display text-3xl font-semibold tracking-tight">
          Synthesis
        </h1>
      </header>

      <section className="mb-8 border border-hairline bg-card p-4">
        <h2 className="mb-2 font-mono text-xs tracking-widest text-ink-soft uppercase">
          Ingredient tray — {tray.length} starred systems
        </h2>
        {tray.length ? (
          <ul className="flex flex-wrap gap-1.5">
            {tray.map((item) => (
              <li
                key={item.id}
                className="border border-hairline px-2 py-1 font-mono text-[11px]"
                title={item.title}
              >
                {item.label}
              </li>
            ))}
          </ul>
        ) : (
          <p className="font-mono text-xs text-ink-faint">
            Empty.{" "}
            <Link href="/library" className="underline hover:text-ink">
              Star systems in the Library
            </Link>{" "}
            before running.
          </p>
        )}
        <div className="mt-4 flex items-center gap-3">
          <RunLabButton disabled={tray.length === 0 || !apiConfigured} />
          {!apiConfigured ? (
            <p className="font-mono text-xs text-ink-soft">
              ANTHROPIC_API_KEY is not set — synthesis is disabled.
            </p>
          ) : (
            <p className="font-mono text-xs text-ink-faint">
              Sends both workbooks + the tray to the pairing engine. Mutation
              notes from the latest run ride along.
            </p>
          )}
        </div>
      </section>

      {runs.length === 0 ? (
        <p className="font-mono text-sm text-ink-faint">
          No runs yet. The board is clean.
        </p>
      ) : (
        <div className="flex flex-col gap-10">
          {runs.map((run, runIndex) => (
            <section key={run.id}>
              <div className="mb-3 flex items-baseline justify-between border-b border-hairline pb-2">
                <h2 className="font-mono text-xs tracking-widest text-ink-soft uppercase">
                  Run {String(runs.length - runIndex).padStart(2, "0")} —{" "}
                  {run.createdAt.toISOString().slice(0, 16).replace("T", " ")}{" "}
                  UTC
                </h2>
                <span className="font-mono text-[11px] text-ink-faint">
                  {run.candidates.length} candidates
                </span>
              </div>

              {run.error ? (
                <div className="border border-hairline bg-card p-4">
                  <p className="font-mono text-xs text-ink">
                    Run failed: {run.error}
                  </p>
                  {run.rawOutput ? (
                    <details className="mt-2">
                      <summary className="cursor-pointer font-mono text-[11px] text-ink-soft">
                        Raw output
                      </summary>
                      <pre className="mt-2 overflow-x-auto font-mono text-[11px] whitespace-pre-wrap text-ink-soft">
                        {run.rawOutput}
                      </pre>
                    </details>
                  ) : null}
                </div>
              ) : null}

              <div className="grid gap-4 lg:grid-cols-2">
                {run.candidates.map((c, i) => {
                  const mine = c.votes.find((v) => v.userId === user.id);
                  const theirs = c.votes.find((v) => v.userId === partnerId);
                  const dealtNow = dealt === run.id;
                  return (
                    <article
                      key={c.id}
                      className={`flex flex-col border border-hairline bg-card ${
                        dealtNow ? "animate-deal" : ""
                      }`}
                      style={
                        dealtNow ? { animationDelay: `${i * 120}ms` } : undefined
                      }
                    >
                      <div className="border-b border-hairline px-4 py-2.5">
                        <p className="font-mono text-[11px] tracking-widest text-ink-soft uppercase">
                          Candidate {String(i + 1).padStart(2, "0")}
                        </p>
                        <h3 className="font-display text-xl font-semibold tracking-tight">
                          {c.name}
                        </h3>
                      </div>
                      <dl className="flex flex-1 flex-col gap-3 px-4 py-3 font-mono text-xs leading-relaxed">
                        <div>
                          <dt className="tracking-widest text-ink-faint uppercase">
                            Engine
                          </dt>
                          <dd>{c.engineSummary}</dd>
                        </div>
                        {c.tonalEngine ? (
                          <div>
                            <dt className="tracking-widest text-ink-faint uppercase">
                              Tonal engine
                            </dt>
                            <dd>{c.tonalEngine}</dd>
                          </div>
                        ) : null}
                        {c.clockBorder ? (
                          <div>
                            <dt className="tracking-widest text-ink-faint uppercase">
                              Clock &amp; border
                            </dt>
                            <dd>{c.clockBorder}</dd>
                          </div>
                        ) : null}
                        <div>
                          <dt className="tracking-widest text-ink-faint uppercase">
                            Beat-map sketch
                          </dt>
                          <dd className="whitespace-pre-wrap">{c.beatMap}</dd>
                        </div>
                        <div>
                          <dt className="tracking-widest text-ink-faint uppercase">
                            Predicted failure mode
                          </dt>
                          <dd className="text-ink-soft">{c.failureMode}</dd>
                        </div>
                        {c.noveltyCheck ? (
                          <div>
                            <dt className="tracking-widest text-ink-faint uppercase">
                              Novelty check
                            </dt>
                            <dd className="text-ink-soft">{c.noveltyCheck}</dd>
                          </div>
                        ) : null}
                        {c.sourceAnswers.length ? (
                          <div>
                            <dt className="tracking-widest text-ink-faint uppercase">
                              Derivation
                            </dt>
                            <dd className="text-ink-soft">
                              {c.sourceAnswers.join("; ")}
                            </dd>
                          </div>
                        ) : null}
                      </dl>
                      <VotePanel
                        candidateId={c.id}
                        myVerdict={mine?.verdict ?? null}
                        myNote={mine?.note ?? ""}
                        partnerName={USERS[partnerId].name}
                        partnerVerdict={theirs?.verdict ?? null}
                        partnerNote={theirs?.note ?? ""}
                      />
                    </article>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
