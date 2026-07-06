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

**M1 — Skeleton** (this build): Gate, Workbook with per-question
autosave, seeded question bank, per-section progress.

Coming: M2 Compare + Library, M3 Lab synthesis runs, M4 Export.

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
2. Set `GATE_PASSPHRASE` and `SESSION_SECRET` env vars.
3. Run `npx prisma migrate deploy && npx prisma db seed` against the
   production database once.

## Layout

- `content/workbook.ts` — the question bank (Knowledge Doc §3), the
  editorial source of truth. Section 7 ships deferred until the Library
  exists (M2).
- `prisma/schema.prisma` — full M1–M4 data model; only `User` and
  `Answer` are live in M1.
- `lib/session.ts` — HMAC-signed cookie identity, two seats only.
- `proxy.ts` — route gate (Next 16's rename of middleware).
