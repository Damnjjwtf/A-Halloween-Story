import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How it works — Structure Lab",
  description:
    "Structure Lab turns structural-invention research into a synthesis engine: two workbooks, a library of story systems, and a pairing lab that hybridizes them into candidate structures.",
};

const STEPS: { tag: string; title: string; body: string }[] = [
  {
    tag: "01",
    title: "Two workbooks",
    body: "Both collaborators answer the same set of structural questions independently. Where the answers diverge is treated as design tension to resolve — not a disagreement to settle.",
  },
  {
    tag: "02",
    title: "A library of systems",
    body: "Thirty story-structure systems and twenty tone-management cards, each with its mechanism, who engineered it, an example, and how it fails. You star the ones worth building with.",
  },
  {
    tag: "03",
    title: "The pairing lab",
    body: "The engine loads both workbooks and the starred systems into a morphological box, then hybridizes across families into candidate structures — each with a beat-map, its tonal engine, and a predicted failure mode.",
  },
  {
    tag: "04",
    title: "Judge together",
    body: "Keep, kill, or mutate each candidate, leave notes, and thread a discussion under it. Deal a curveball to force one random constraint into a run. Export the whole session, or share a single candidate on a read-only link.",
  },
];

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <header className="mb-12 border-b border-hairline pb-8">
        <p className="mb-3 font-mono text-xs tracking-widest text-ink-soft uppercase">
          How it works
        </p>
        <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">
          Structure Lab
        </h1>
        <p className="mt-4 max-w-xl font-sans text-[15px] leading-relaxed text-ink-soft">
          A structural invention workbook for the film{" "}
          <span className="italic">A Halloween Story</span>. It exists to{" "}
          <span className="text-ink">invent</span> story structure rather than
          collect it — a two-person instrument, not a mood board.
        </p>
      </header>

      <ol className="flex flex-col gap-8">
        {STEPS.map((s) => (
          <li key={s.tag} className="flex gap-5">
            <span className="font-mono text-sm text-signal">{s.tag}</span>
            <div>
              <h2 className="font-display text-xl font-semibold tracking-tight">
                {s.title}
              </h2>
              <p className="mt-1.5 font-sans text-[15px] leading-relaxed text-ink-soft">
                {s.body}
              </p>
            </div>
          </li>
        ))}
      </ol>

      <section className="mt-12 border-t border-hairline pt-8">
        <h2 className="mb-2 font-mono text-xs tracking-widest text-ink-soft uppercase">
          The bias
        </h2>
        <p className="max-w-xl font-sans text-[15px] leading-relaxed text-ink-soft">
          Every candidate ships with the one thing structure work usually
          hides: the specific way it dies in execution. The Lab prefers an
          honest recombination — labeled as such — over an inflated claim of
          invention.
        </p>
      </section>

      <footer className="mt-14 flex items-center justify-between border-t border-hairline pt-6">
        <Link
          href="/gate"
          className="border border-ink px-5 py-2.5 font-mono text-sm tracking-wide transition-colors duration-150 hover:bg-ink hover:text-paper"
        >
          Enter the Lab
        </Link>
        <p className="font-mono text-[11px] tracking-widest text-ink-faint uppercase">
          Private · two seats
        </p>
      </footer>
    </main>
  );
}
