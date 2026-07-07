"use client";

import { useActionState, useState } from "react";
import { enterLab, type GateState } from "@/app/gate/actions";

const USERS = [
  { id: "jj", name: "JJ" },
  { id: "stefan", name: "Stefan" },
] as const;

export function GateForm({
  passphraseRequired,
}: {
  passphraseRequired: boolean;
}) {
  const [state, formAction, pending] = useActionState<GateState, FormData>(
    enterLab,
    { error: null },
  );
  const [who, setWho] = useState<string | null>(null);

  return (
    <form action={formAction} className="flex w-full flex-col gap-6">
      <fieldset className="flex flex-col gap-2">
        <legend className="mb-2 font-mono text-xs tracking-widest text-ink-soft uppercase">
          Operator
        </legend>
        <div className="grid grid-cols-2 gap-2">
          {USERS.map((u) => (
            <label
              key={u.id}
              className={`cursor-pointer border px-4 py-3 text-center font-mono text-sm transition-colors duration-150 ${
                who === u.id
                  ? "border-ink bg-ink text-paper"
                  : "border-hairline bg-card hover:border-ink"
              }`}
            >
              <input
                type="radio"
                name="who"
                value={u.id}
                checked={who === u.id}
                onChange={() => setWho(u.id)}
                className="sr-only"
              />
              {u.name}
            </label>
          ))}
        </div>
      </fieldset>

      {passphraseRequired ? (
        <div className="flex flex-col gap-2">
          <label
            htmlFor="passphrase"
            className="font-mono text-xs tracking-widest text-ink-soft uppercase"
          >
            Passphrase
          </label>
          <input
            id="passphrase"
            name="passphrase"
            type="password"
            autoComplete="current-password"
            required
            className="border border-hairline bg-card px-4 py-3 font-mono text-sm placeholder:text-ink-faint"
            placeholder="•••••••"
          />
        </div>
      ) : null}

      {state.error ? (
        <p role="alert" className="font-mono text-xs text-ink">
          {state.error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending || !who}
        className="border border-ink bg-transparent px-4 py-3 font-mono text-sm tracking-wide transition-colors duration-150 hover:bg-ink hover:text-paper disabled:opacity-50"
      >
        {pending ? "Checking" : "Enter the Lab"}
      </button>
    </form>
  );
}
