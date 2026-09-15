# Structure Lab

A two-person structural invention workbook for *A Halloween Story* —
present-day Chicago under martial law, Halloween canceled in the inner
city, still alive in the suburbs.

JJ and Stefan answer a designed sequence of workbook questions
independently, compare answers, select structural ingredients from a
30-system library, and run an AI pairing engine that synthesizes
candidate hybrid structures. This repo is the instrument, not the story:
the Lab generates **structures**, never scenes.

## Status

All four milestones are built:

- **M1 — Skeleton**: Gate, Workbook with per-question autosave, seeded
  question bank, per-section progress.
- **M2 — Two-player**: Compare view (divergence rendered in the one
  signal color), Library of 34 catalogued systems with starring;
  Section 7 answers via stars.
- **M3 — The Lab**: synthesis runs against the Anthropic API (prompt
  template in `prompts/synthesis.txt` — edit it freely), candidate
  cards with keep/kill/mutate votes and notes, mutation notes feed the
  next run, full run history preserved.
- **M4 — Export**: one-click markdown dump of answers, stars, runs,
  votes. Copy or download.
- **Share**: each candidate has a **Share** button that copies a public,
  read-only link (`/c/<id>`) showing just that one structure as a clean
  specimen card — no login, no votes, no workbench. For sending a single
  synthesized structure to a collaborator or a portfolio.

## Stack

Next.js 16 (App Router) · TypeScript · Tailwind v4 · Prisma 7 +
Postgres · deployed on Vercel.

## Run it

```bash
cp .env.example .env   # fill in DATABASE_URL, GATE_PASSPHRASE, SESSION_SECRET
npm install
npm run db:migrate     # apply schema
npm run db:seed        # create the two users (jj, stefan)
npm run dev
```

Visit `/gate`, pick your name, enter the passphrase.

## Deploying (Vercel)

1. Create a Vercel Postgres (Neon) database; set `DATABASE_URL` to the
   pooled connection string.
2. Set `GATE_PASSPHRASE`, `SESSION_SECRET`, and `ANTHROPIC_API_KEY`
   env vars.
3. Run `npx prisma migrate deploy && npx prisma db seed` against the
   production database once.

## Layout

- `content/workbook.ts` — the question bank (Knowledge Doc §3), the
  editorial source of truth. Question 7.1 is answered by starring in
  the Library.
- `content/library.ts` — the 30-system Structure Library (Knowledge
  Doc §1), verbatim.
- `prompts/synthesis.txt` — the pairing-engine prompt (Knowledge Doc
  §4). Loaded from file at run time; iterate on it without touching
  code. The app appends a JSON output envelope for parsing.
- `prisma/schema.prisma` — the full data model.
- `lib/session.ts` — HMAC-signed cookie identity, two seats only.
- `lib/synthesis.ts` — builds the prompt, calls the API, stores the
  run with its full input snapshot for reproducibility.
- `proxy.ts` — route gate (Next 16's rename of middleware).
