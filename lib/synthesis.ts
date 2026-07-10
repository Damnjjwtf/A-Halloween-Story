import { readFile } from "node:fs/promises";
import path from "node:path";
import Anthropic from "@anthropic-ai/sdk";
import { db } from "@/lib/db";
import { SECTIONS } from "@/content/workbook";
import { FAMILY_LABEL, getSystem } from "@/content/library";
import { getTone, isToneId, TONE_TYPE_LABEL } from "@/content/tone";
import { USERS, type UserId } from "@/lib/session";

// PRD §7: model pinned by the PRD, overridable without a deploy.
const MODEL = process.env.ANTHROPIC_MODEL ?? "claude-sonnet-4-6";
const CANDIDATE_COUNT = 4;

// Appended after the template so JJ can iterate on prompts/synthesis.txt
// freely while the app keeps a machine-readable envelope to parse.
const OUTPUT_ENVELOPE = `
FORMAT: Respond with a single JSON object and nothing else — no markdown fences,
no preamble. Shape:
{"candidates": [{"name": "...", "engine": "...", "tonalEngine": "...",
"clockBorder": "...", "beatMap": "...", "failureMode": "...", "derivation": "...",
"noveltyCheck": "..."}]}
"tonalEngine" is one sentence: which tone management system (T-card) governs
register movement, keyed to which structural feature. Name the mechanism of
interaction, not the mood.
"beatMap" is one string with numbered stations separated by newlines.
"derivation" cites question IDs and system numbers, e.g. "JJ 4.1, Stefan 2.2; No. 23 × No. 29; T14 × No. 21".
`;

export type ParsedCandidate = {
  name: string;
  engine: string;
  tonalEngine: string;
  clockBorder: string;
  beatMap: string;
  failureMode: string;
  derivation: string;
  noveltyCheck: string;
};

function answersBlock(
  answers: { userId: string; questionId: string; text: string }[],
  userId: UserId,
): string {
  const mine = new Map(
    answers.filter((a) => a.userId === userId).map((a) => [a.questionId, a.text]),
  );
  const lines: string[] = [];
  for (const section of SECTIONS) {
    for (const q of section.questions) {
      const text = mine.get(q.id);
      if (text) lines.push(`Q${q.id} — ${q.prompt}\n${USERS[userId].name}: ${text}`);
    }
  }
  return lines.join("\n\n") || "(no answers yet)";
}

function whoBySystem(
  stars: { userId: string; systemId: number }[],
): Map<number, string[]> {
  const by = new Map<number, string[]>();
  for (const s of stars) {
    const list = by.get(s.systemId) ?? [];
    list.push(USERS[s.userId as UserId].name);
    by.set(s.systemId, list);
  }
  return by;
}

function structureStarsBlock(
  stars: { userId: string; systemId: number }[],
): string {
  const by = whoBySystem(stars);
  const lines: string[] = [];
  for (const [id, who] of [...by.entries()].sort((a, b) => a[0] - b[0])) {
    if (isToneId(id)) continue;
    const sys = getSystem(id);
    if (!sys) continue;
    lines.push(
      `No. ${sys.id} — ${sys.name} [${FAMILY_LABEL[sys.family]}] (starred by ${who.join(" + ")})\n` +
        `Mechanism: ${sys.mechanism}\nEngineers: ${sys.engineers}\n` +
        `Example: ${sys.example}\nFails when: ${sys.failsWhen}`,
    );
  }
  return lines.join("\n\n") || "(nothing starred yet)";
}

function toneStarsBlock(
  stars: { userId: string; systemId: number }[],
): string {
  const by = whoBySystem(stars);
  const lines: string[] = [];
  for (const [id, who] of [...by.entries()].sort((a, b) => a[0] - b[0])) {
    if (!isToneId(id)) continue;
    const t = getTone(id);
    if (!t) continue;
    lines.push(
      `${t.code} — ${t.name} [${TONE_TYPE_LABEL[t.type]}] (starred by ${who.join(" + ")})\n` +
        `Mechanism: ${t.mechanism}\nEngineers: ${t.engineers}\n` +
        `Example: ${t.example}\nFails when: ${t.failsWhen}`,
    );
  }
  return lines.join("\n\n") || "(no tone cards starred yet)";
}

// Section 9–10 answers, with the 9.3 kill-rule flagged as a hard constraint.
function toneConstraintsBlock(
  answers: { userId: string; questionId: string; text: string }[],
): string {
  const lines: string[] = [];
  for (const uid of ["jj", "stefan"] as UserId[]) {
    const mine = new Map(
      answers.filter((a) => a.userId === uid).map((a) => [a.questionId, a.text]),
    );
    for (const q of ["9.1", "9.2", "9.3", "9.4", "10.1", "10.2", "10.4"]) {
      const text = mine.get(q);
      if (!text) continue;
      const flag = q === "9.3" ? " [HARD CONSTRAINT — tonal kill-rule]" : "";
      lines.push(`Q${q}${flag}\n${USERS[uid].name}: ${text}`);
    }
  }
  return lines.join("\n\n") || "(no tone answers yet)";
}

export async function buildSynthesisInput(curveball = ""): Promise<{
  prompt: string;
  snapshot: Record<string, string>;
}> {
  const [answers, stars, template] = await Promise.all([
    db.answer.findMany({ where: { NOT: { text: "" } } }),
    db.star.findMany(),
    readFile(path.join(process.cwd(), "prompts", "synthesis.txt"), "utf8"),
  ]);

  // Mutation notes: mutate votes on the most recent run's candidates.
  const lastRun = await db.run.findFirst({
    orderBy: { createdAt: "desc" },
    include: { candidates: { include: { votes: true } } },
  });
  const mutationNotes: string[] = [];
  if (lastRun) {
    for (const c of lastRun.candidates) {
      for (const v of c.votes) {
        if (v.verdict === "mutate" && v.note) {
          mutationNotes.push(
            `${USERS[v.userId as UserId].name} on "${c.name}": ${v.note}`,
          );
        }
      }
    }
  }

  const jj = answersBlock(answers, "jj");
  const stefan = answersBlock(answers, "stefan");
  const starred = structureStarsBlock(stars);
  const toneStarred = toneStarsBlock(stars);
  const toneConstraints = toneConstraintsBlock(answers);
  const mutations = mutationNotes.join("\n") || "(none)";

  const prompt =
    template
      .replaceAll("{{JJ_ANSWERS}}", jj)
      .replaceAll("{{STEFAN_ANSWERS}}", stefan)
      .replaceAll("{{STARRED_SYSTEMS_WITH_CARDS}}", starred)
      .replaceAll("{{STARRED_TONE_WITH_CARDS}}", toneStarred)
      .replaceAll("{{TONE_CONSTRAINTS}}", toneConstraints)
      .replaceAll("{{OPTIONAL_MUTATION_NOTES}}", mutations)
      .replaceAll("{{OBLIQUE_STRATEGY}}", curveball || "(none)")
      .replaceAll("{{N}}", String(CANDIDATE_COUNT)) + OUTPUT_ENVELOPE;

  return {
    prompt,
    snapshot: {
      model: MODEL,
      jjAnswers: jj,
      stefanAnswers: stefan,
      starredSystems: starred,
      starredTone: toneStarred,
      toneConstraints,
      mutationNotes: mutations,
      curveball: curveball || "(none)",
      template,
    },
  };
}

export function parseCandidates(raw: string): ParsedCandidate[] {
  // Tolerate accidental markdown fences despite the envelope instruction.
  const stripped = raw.replace(/^```(?:json)?\s*/m, "").replace(/```\s*$/m, "");
  const start = stripped.indexOf("{");
  const end = stripped.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("No JSON object in output");
  const parsed = JSON.parse(stripped.slice(start, end + 1)) as {
    candidates?: Partial<ParsedCandidate>[];
  };
  if (!Array.isArray(parsed.candidates) || parsed.candidates.length === 0) {
    throw new Error("No candidates array in output");
  }
  return parsed.candidates.map((c, i) => ({
    name: c.name?.trim() || `Untitled ${i + 1}`,
    engine: c.engine?.trim() ?? "",
    tonalEngine: c.tonalEngine?.trim() ?? "",
    clockBorder: c.clockBorder?.trim() ?? "",
    beatMap: c.beatMap?.trim() ?? "",
    failureMode: c.failureMode?.trim() ?? "",
    derivation: c.derivation?.trim() ?? "",
    noveltyCheck: c.noveltyCheck?.trim() ?? "",
  }));
}

export async function runSynthesis(
  curveball = "",
): Promise<{ runId: string; error: string }> {
  // Bound a dealt curveball — it rides into the prompt as a hard constraint.
  const curve = curveball.slice(0, 400).trim();

  // Defense in depth: the Run button is disabled with an empty tray, but a
  // synthesis with nothing starred has no ingredients — skip the API call and
  // record a clear reason rather than burning a request on an empty box.
  const starCount = await db.star.count();
  if (starCount === 0) {
    const run = await db.run.create({
      data: {
        inputSnapshot: { note: "no starred systems" },
        rawOutput: "",
        error: "Nothing starred — star systems in the Library before running.",
        curveball: curve,
      },
    });
    return { runId: run.id, error: run.error };
  }

  const { prompt, snapshot } = await buildSynthesisInput(curve);

  const client = new Anthropic(); // reads ANTHROPIC_API_KEY / ANTHROPIC_BASE_URL

  let raw = "";
  let error = "";
  let candidates: ParsedCandidate[] = [];
  try {
    const message = await client.messages.create({
      model: MODEL,
      max_tokens: 8192,
      messages: [{ role: "user", content: prompt }],
    });
    raw = message.content
      .filter((b) => b.type === "text")
      .map((b) => b.text)
      .join("\n");
    candidates = parseCandidates(raw);
  } catch (e) {
    error = e instanceof Error ? e.message : String(e);
  }

  const run = await db.run.create({
    data: {
      inputSnapshot: snapshot,
      rawOutput: raw,
      error,
      curveball: curve,
      candidates: {
        create: candidates.map((c) => ({
          name: c.name,
          engineSummary: c.engine,
          tonalEngine: c.tonalEngine,
          clockBorder: c.clockBorder,
          beatMap: c.beatMap,
          failureMode: c.failureMode,
          noveltyCheck: c.noveltyCheck,
          sourceAnswers: c.derivation ? [c.derivation] : [],
        })),
      },
    },
  });

  return { runId: run.id, error };
}
