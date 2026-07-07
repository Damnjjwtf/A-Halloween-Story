import { GateForm } from "@/components/gate-form";

// Read GATE_PASSPHRASE at request time, not build time, so locking or
// unlocking the gate is an env-var change + redeploy, no code edit.
export const dynamic = "force-dynamic";

export default function GatePage() {
  return (
    <main className="flex min-h-dvh items-center justify-center p-6">
      <div className="relative w-full max-w-sm p-8">
        {/* Specimen-sheet registration marks */}
        <span
          aria-hidden
          className="absolute top-0 left-0 h-4 w-4 border-t border-l border-ink"
        />
        <span
          aria-hidden
          className="absolute top-0 right-0 h-4 w-4 border-t border-r border-ink"
        />
        <span
          aria-hidden
          className="absolute bottom-0 left-0 h-4 w-4 border-b border-l border-ink"
        />
        <span
          aria-hidden
          className="absolute right-0 bottom-0 h-4 w-4 border-r border-b border-ink"
        />

        <header className="mb-10">
          <p className="mb-2 font-mono text-xs tracking-widest text-ink-soft uppercase">
            No. 001 — Private instrument
          </p>
          <h1 className="font-display text-5xl font-semibold tracking-tight">
            Structure Lab
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-ink-soft">
            A structural invention workbook for{" "}
            <em>A Halloween Story</em>. Two seats, period.
          </p>
        </header>
        <GateForm passphraseRequired={Boolean(process.env.GATE_PASSPHRASE)} />
      </div>
    </main>
  );
}
