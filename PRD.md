# Structure Lab — Product & Technical Handoff

**Status:** Live, in active use. This document describes the system as built, not as originally
spec'd — treat it as ground truth for continuing development, not the historical plan.

**Repo:** `Damnjjwtf/A-Halloween-Story` · **Live branch:** `main` · **Stack:** Next.js 16 (App
Router) + TypeScript (strict) + Tailwind v4 + Prisma 7 / PostgreSQL + Anthropic API.

---

## 1. What this is

Structure Lab is a **private, two-person structural-invention workbook** for a film project
called *A Halloween Story* (present-day Chicago under martial law; Halloween is canceled in the
inner city under a pretense of public safety, still alive in the suburbs; ensemble
coming-of-age). The two users are **JJ** and **Stefan** — hardcoded seats, not a general auth
system.

The app is **not** a mood board or reference collector. It exists to turn structural-invention
research into a working synthesis engine: both collaborators answer the same structured
questions independently, star reference systems from a curated library, and an AI "pairing
engine" hybridizes their answers + starred systems into concrete candidate story structures —
each with a mechanism, a predicted failure mode, and an honest novelty check (it's told to admit
recombination rather than inflate originality claims).

It also functions as a **portfolio piece** for the builder — a creative-technologist project.
The design register is deliberately "specimen board / MSCHF-Are.na," not generic AI-app slop:
cool off-white paper background, near-black ink, one reserved signal-violet accent color used
sparingly (focus rings, divergence/curveball markers), monospace instrument voice (IBM Plex
Mono) for data/IDs/status, Bricolage Grotesque for display type, hairline borders, zero rounded
corners, zero shadows, motion reserved for exactly two moments (candidates "dealt" onto the
board after a run; an indeterminate progress sweep while a run is in flight).

---

## 2. User model & auth

Two fixed users, defined in `lib/session.ts`:

```ts
export type UserId = "jj" | "stefan";
export const USERS: Record<UserId, { id: UserId; name: string }> = {
  jj: { id: "jj", name: "JJ" },
  stefan: { id: "stefan", name: "Stefan" },
};
```

**Auth is intentionally minimal** — this is two trusted people, not a general public app:

- `/gate` is a name-picker. If `GATE_PASSPHRASE` is set in the environment, it also requires that
  shared passphrase; if unset, the gate just asks "who are you" with no password (an explicit,
  deliberate product decision after going back and forth — see §8).
- On success, an HttpOnly/Secure/SameSite=Lax cookie is set holding the userId, **HMAC-signed via
  Web Crypto** (not `node:crypto` — the proxy/middleware runs on the Edge runtime, which lacks
  it). Signing-key preference order: `SESSION_SECRET` → `GATE_PASSPHRASE` → a baked-in constant
  (only reached when the gate is fully open, where the cookie merely selects a seat and protects
  nothing).
- `proxy.ts` (Next 16 renamed `middleware.ts` → `proxy.ts`) gates every route except: `/gate`
  itself, `/c/[id]` (public read-only candidate share pages), `/about` (public marketing page),
  and the generated OG image routes (so link unfurls work for logged-out viewers).
- Server Actions independently re-verify the session (`requireUser()` in `lib/session.ts`) as
  defense in depth — never trust that middleware ran.

**Do not over-build auth here.** This is not meant to become a multi-tenant system. If asked to
"add real accounts," push back and confirm that's actually wanted — it isn't the product.

---

## 3. Data model (`prisma/schema.prisma`)

Postgres via Prisma 7 with the `@prisma/adapter-pg` driver adapter (Prisma 7 removed the
`url` field from the datasource block in the schema file itself — the connection string is
supplied at runtime via `prisma.config.ts` + the adapter, not schema-embedded).

```
User        — id ("jj"|"stefan"), name
Answer      — (userId, questionId) unique; questionId is a string natural key into
              content/workbook.ts (e.g. "4.1"), not a DB-seeded question table
Star        — (userId, systemId) composite PK; systemId indexes into content/library.ts
              (1–30, structure systems) or content/tone.ts (101–120, tone cards)
Run         — one synthesis call; stores the full inputSnapshot (JSON), rawOutput,
              error (non-empty = failed/unparseable run), curveball (dealt Oblique
              strategy text, if any)
Candidate   — belongs to a Run; name, engineSummary, tonalEngine, clockBorder, beatMap,
              failureMode, noveltyCheck, sourceAnswers (derivation citations)
Vote        — (userId, candidateId) composite PK; verdict enum (keep|kill|mutate) + note
Comment     — threaded reply under a candidate; candidateId, userId, body, createdAt
```

Content (workbook questions, library systems, tone cards, the Oblique-strategy deck) lives in
**static TypeScript files under `content/`, not the database** — this is deliberate. It's fixed
editorial copy, versions cleanly in git, and needs no seed step to change. Only user-generated
data (answers, stars, runs, votes, comments) lives in Postgres.

Migrations are in `prisma/migrations/` and auto-apply on every Vercel build via
`scripts/migrate-if-db.mjs` (runs `prisma migrate deploy` only when `DATABASE_URL` is set, so
local/CI builds without a database don't fail).

---

## 4. The content system

### 4.1 Workbook (`content/workbook.ts`)
10 sections, verbatim from the project's Knowledge Doc, each with 2–4 free-text questions
answered independently by both users:

1. Novelty target
2. Reaction against
3. Emotional engineering
4. The clock and the border
5. Ensemble mechanics
6. Legibility budget
7. Ingredients *(answered by starring, not text — see below)*
8. Ontology
9. Tonal targets
10. Tone × structure interaction

Two questions are **star-prompts, not textareas** — `starPrompt: "structure" | "tone"` on the
`Question` type. Q7.1 requires 4–8 starred structure systems from the Library; Q10.3 requires
3–5 starred tone cards. `activeQuestionIds()` excludes these from plain-text answer flows.
Rendering them is a button-sized (44px min tap target — see §8 bug history) link into the
Library, plus a live count of what's starred so far.

### 4.2 Structure Library (`content/library.ts`)
30 story-structure systems (ids 1–30), each with: mechanism, engineers (who's used it), a real
example, and how it fails. Grouped into 8 families (Linear, Nonlinear/Temporal, Iterative,
Ensemble/Social, Spatial, POV/Epistemic, Modular/Participatory, Meta).

### 4.3 Tone Library (`content/tone.ts`)
20 tone cards (ids 101–120, displayed as T1–T20), added later as the "Tone Addendum." Split into
two types: **registers** (T1–T12, raw tonal material — e.g. "Amblin warmth," "Dread-comedy") and
**management systems** (T13–T20, engines for how registers move — e.g. "Whiplash-as-rhythm,"
"Tonal POV"). Each card has a hex `swatch` shown as a small color chip in the Library UI.
`isToneId(id)` distinguishes tone ids (≥100) from structure ids.

### 4.4 Oblique-strategy deck (`content/oblique.ts`)
20 short structural-provocation cards (unrelated to Brian Eno's actual deck beyond the naming
convention — these are written specifically for this film's fixed premise: the ritual clock, the
city/suburb border, the ensemble). `randomOblique()` picks one. See §5.3.

---

## 5. Core features (in build order — all shipped)

### 5.1 Workbook (`/workbook`, `/workbook/[sectionId]`)
Both users answer all 10 sections independently. `AutosaveTextarea` (`components/`) debounces
saves at 900ms, serializes writes so out-of-order saves can't clobber each other, flushes on
blur/tab-hide, and shows a live save-status label. Includes a **"Speak" voice-dictation button**
(`lib/use-dictation.ts`) using the browser-native Web Speech API — no backend, no API key, only
commits finalized speech chunks, gracefully hidden where unsupported (Safari/Chrome only).

### 5.2 Library (`/library`) + starring
Specimen-card grid of all 30 structure systems / 20 tone cards, filterable by family/type, with
a tab switch between Structure and Tone (`?tab=tone`). Star toggling is a Server Action with
race-safe upsert (handles concurrent P2002/P2025 from both users starring near-simultaneously).

### 5.3 The Lab (`/lab`) — the synthesis engine
The core feature. `lib/synthesis.ts`:
1. Builds a prompt from `prompts/synthesis.txt` (external file, not inline — meant to be
   iterated on without touching app code), interpolating: both users' full answer sets, starred
   structure systems (with full card detail), starred tone cards, Section 9–10 tone-constraint
   answers (with Q9.3 — the personal "tonal kill-rule" — flagged as a HARD CONSTRAINT), mutation
   notes carried forward from the previous run's `mutate`-verdict votes, and an optional
   **curveball** (see below).
2. Calls the Anthropic API (`@anthropic-ai/sdk`), model pinned via `ANTHROPIC_MODEL` env var
   (default `claude-sonnet-4-6`).
3. Parses a strict JSON envelope (tolerant of accidental markdown fences) into 4 candidates per
   run, each with: name, engine (the mechanism), tonalEngine (which T-card governs register
   movement and what triggers it), clockBorder (how it load-bears the ritual calendar + the
   city/suburb gradient), beatMap (6–10 structural stations), failureMode (the specific way it
   dies in execution), derivation (citations by question ID and system number), and noveltyCheck
   (nearest existing structure + the one honest point of departure — explicitly instructed not
   to inflate originality claims).
4. Stores the full `inputSnapshot` on the `Run` row so every run is reproducible/auditable.
5. Defense in depth: if nothing is starred, the run short-circuits with a clear stored error
   instead of burning an API call.

**Curveball:** a "Deal a curveball" button next to "Run the Lab" that picks one random card from
`content/oblique.ts` and injects it into that run as a **hard constraint every candidate must
obey** — a structural provocation on top of the fixed premise constraints. Stored on
`Run.curveball`, shown on the run's header and in the export.

**Progress meter:** since a synthesis call is a single ~30–60s request with no real completion
signal, `RunLabButton` shows an honest status panel while pending — an elapsed-second counter, a
rotating sequence of plausible stage labels, and an indeterminate sweep bar. It deliberately does
not fake a percentage.

Candidates render as cards with a **vote panel** (`keep` / `kill` / `mutate` + a note — the note
is what feeds back into the next run's mutation notes) and a **collapsible comment thread**
(`components/candidate-comments.tsx`, optimistic posting, `Comment` model) for back-and-forth
discussion beyond a single note.

### 5.4 Compare (`/compare`)
Side-by-side view of both users' answers per section, surfacing divergence (the app's stance:
divergence is design tension to resolve, not disagreement to paper over).

### 5.5 Export (`/export`)
`lib/export.ts` builds a full markdown session dump — every answer, every starred
system/tone-card, every run (with curveball, error state, and all candidates including votes and
comment threads) — with **Copy to clipboard** and **Download .md** buttons
(`components/export-tools.tsx`). Meant to be pasted back into an AI chat for deeper development
work (this is, not coincidentally, exactly how this document came to exist).

### 5.6 Public share links (`/c/[id]`)
Any candidate can be shared as a read-only, unauthenticated specimen-card page — bypasses the
gate entirely via `proxy.ts`. Has its own dynamically generated OG/Twitter preview image
(`app/c/[id]/opengraph-image.tsx`, via `next/og`) so shared links unfurl with the candidate's
actual name and engine summary, not a generic card.

### 5.7 About / how-it-works (`/about`)
Public page explaining the tool for anyone who lands on a shared link cold. Also public, also
has a root-level OG image (`app/opengraph-image.tsx`).

---

## 6. Design system (binding — don't drift from this without explicit sign-off)

- **Fonts:** Bricolage Grotesque (display, sparing — section heads, candidate names), IBM Plex
  Sans (body prose), IBM Plex Mono (instrument voice: question IDs, mechanisms, status labels,
  data). Loaded via `next/font/google` in `app/layout.tsx`, exposed as CSS variables consumed by
  Tailwind v4's `@theme inline` block in `app/globals.css`.
- **Color tokens** (`app/globals.css`): `--color-paper` (#f1f0eb, cool off-white — not cream),
  `--color-card` (#f7f6f2), `--color-ink` (#17181c, cool near-black — not warm brown-black),
  `--color-ink-soft` / `--color-ink-faint` (secondary text), `--color-hairline` (#c9c8c1,
  borders), `--color-signal` (#6321f4, saturated UV-violet — the **one** reserved accent).
  `--color-signal` appears in exactly a handful of deliberate places: the global focus ring,
  divergence/comparison highlighting, and the curveball UI. It must not become a general
  "brand color" — that's the whole point of reserving it.
- **Visual grammar:** hairline 1px borders, zero border-radius, zero shadows. Buttons are
  rectangular and ink-outlined; hover = full ink-fill invert ("stamp"). Specimen cards carry a
  monospace catalog-number tag (`Q4.1`, `No. 23`, `T14`).
- **Motion:** none beyond ~100–150ms hover/focus transitions, disabled entirely under
  `prefers-reduced-motion`. Real animation is reserved for exactly two moments: candidates
  "dealt" onto the board after a run (`.animate-deal`) and the indeterminate progress sweep
  during a run (`.animate-progress-sweep`).
- **Tap targets:** minimum 44px height on anything tappable — this was a real bug (see §8), don't
  regress it with small inline text links doing double duty as primary CTAs.

---

## 7. Environment & deployment

Hosted on Vercel, database is Neon Postgres via Vercel's Postgres integration.

| Env var | Required | Purpose |
|---|---|---|
| `DATABASE_URL` | Yes | Postgres connection string (pooled) |
| `ANTHROPIC_API_KEY` | Yes, for the Lab | Server-side only; Lab UI shows a clear "not configured" state without it, doesn't crash |
| `GATE_PASSPHRASE` | No | If set, gate requires this + a name pick. If unset, gate is name-only (open door for two trusted people) |
| `SESSION_SECRET` | No | HMAC signing key preference; falls back to `GATE_PASSPHRASE`, then a baked-in constant |
| `ANTHROPIC_MODEL` | No | Overrides the synthesis model (default `claude-sonnet-4-6`) |
| `NEXT_PUBLIC_SITE_URL` | No | Resolves OG image URLs against the real deployed origin; falls back to `VERCEL_URL`, then localhost |

Build command (`package.json`): `prisma generate && node scripts/migrate-if-db.mjs && next build`
— migrations auto-apply on every deploy when `DATABASE_URL` is present; skip quietly otherwise so
local builds without a DB still work.

**No CI pipeline configured** — verification has been manual: `next build` + `eslint` locally,
plus ad-hoc Playwright runs against a production build with a mock Anthropic endpoint before each
push. If this project grows, that's the first real gap to close.

---

## 8. History worth knowing (avoid re-litigating or re-breaking these)

- **Auth flip-flopped twice** before landing on the current "passphrase optional via env var
  presence" design — this was deliberate, not indecision-by-default. Don't re-propose a heavier
  auth system without being asked.
- **A real mobile bug**: the Section 7/10 "open the Library" star-prompt link was ~11px inline
  underlined text, well under the 44px iOS tap-target minimum — read as "the link is broken" on a
  phone even though it worked technically. Fixed by promoting it to a real button. Keep tap
  targets ≥44px on anything primary, especially on the workbook flow which is used heavily on
  mobile.
- **Prisma 7 breaking change**: the datasource `url` field was removed from schema syntax; this
  project uses `prisma.config.ts` + `@prisma/adapter-pg`'s `PrismaPg` adapter instead. Don't
  "fix" this back to inline schema URLs — it'll break the build.
- **Next.js 16 renamed `middleware.ts` → `proxy.ts`.** The gating logic lives there now.
- The database connection string was pasted in plaintext into a chat at one point during setup —
  it should be periodically rotated in Neon regardless of current status.

---

## 9. Open items / good next candidates

Roughly in order of likely value, not committed to:

1. **Pagination on `/lab`** — currently loads every run ever with all candidates, votes, and
   comments in one query. Fine at current volume; will need "latest N + load older" once run
   history grows.
2. **A CI pipeline** (build + lint + typecheck on push) — currently all manual.
3. Ideas discussed but not yet built, roughly ranked by the project owner's stated interest:
   streaming candidates in as they're generated (rather than one long wait even with the progress
   meter), prompt versioning stamped per run, a "verify this card" web-search fact-check on
   library claims, deep-research pulls on a starred system's real practitioner sources.

---

## 10. Where to look for what

| Need to change... | Look at |
|---|---|
| A workbook question | `content/workbook.ts` |
| A structure/tone card | `content/library.ts` / `content/tone.ts` |
| The synthesis prompt itself | `prompts/synthesis.txt` (not inline in code, by design) |
| How synthesis is called/parsed | `lib/synthesis.ts` |
| Auth / session logic | `lib/session.ts`, `proxy.ts` |
| DB schema | `prisma/schema.prisma` (+ migrate to generate a migration) |
| Design tokens | `app/globals.css` |
| Any page's route | `app/(lab)/<name>/page.tsx` for gated pages, `app/<name>/page.tsx` for public ones |
