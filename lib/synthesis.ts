import { readFile } from "node:fs/promises";
import path from "node:path";
import Anthropic from "@anthropic-ai/sdk";
import { db } from "@/lib/db";
import { SECTIONS } from "@/content/workbook";
import { FAMILY_LABEL, getSystem } from "@/content/library";
import { USERS, type UserId } from "@/lib/session";

// PRD §7: model pinned by the PRD, overridable without a deploy.
const MODEL = process.env.ANTHROPIC_MODEL ?? "claude-sonnet-4-6";
const CANDIDATE_COUNT = 4;

// Appended after the template so JJ can iterate on prompts/synthesis.txt
// freely while the app keeps a machine-readable envelope to parse.
const OUTPUT_ENVELOPE = `
FORMAT: Respond with a single JSON object and nothing else — no markdown fences,
no preamble. Shape:
{"candidates": [{"name": "...", "engine": "...", "clockBorder": "...",
"beatMap": "...", "failureMode": "...", "derivation": "...", "noveltyCheck": "..."}]}
"beatMap" is one string with numbered stations separated by newlines.
"derivation" cites question IDs and system numbers, e.g. "JJ 4.1, Stefan 2.2; No. 23 × No. 29".
`;

export type ParsedCandidate = {
  name: string;
  engine: string;
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

function starsBlock(stars: { userId: string; systemId: number }[]): string {
  const bySystem = new Map<number, string[]>();
  for (const s of stars) {
    const list = bySystem.get(s.systemId) ?? [];
    list.push(USERS[s.userId as UserId].name);
    bySystem.set(s.systemId, list);
  }
  const lines: string[] = [];
  for (const [systemId, who] of [...bySystem.entries()].sort((a, b) => a[0] - b[0])) {
    const sys = getSystem(systemId);
    if (!sys) continue;
    lines.push(
      `No. ${sys.id} — ${sys.name} [${FAMILY_LABEL[sys.family]}] (starred by ${who.join(" + ")})\n` +
        `Mechanism: ${sys.mechanism}\nEngineers: ${sys.engineers}\n` +
        `Example: ${sys.example}\nFails when: ${sys.failsWhen}`,
    );
  }
  return lines.join("\n\n") || "(nothing starred yet)";
}

export async function buildSynthesisInput(): Promise<{
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
  const starred = starsBlock(stars);
  const mutations = mutationNotes.join("\n") || "(none)";

  const prompt =
    template
      .replaceAll("{{JJ_ANSWERS}}", jj)
      .replaceAll("{{STEFAN_ANSWERS}}", stefan)
      .replaceAll("{{STARRED_SYSTEMS_WITH_CARDS}}", starred)
      .replaceAll("{{OPTIONAL_MUTATION_NOTES}}", mutations)
      .replaceAll("{{N}}", String(CANDIDATE_COUNT)) + OUTPUT_ENVELOPE;

  return {
    prompt,
    snapshot: {
      model: MODEL,
      jjAnswers: jj,
      stefanAnswers: stefan,
      starredSystems: starred,
      mutationNotes: mutations,
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
    clockBorder: c.clockBorder?.trim() ?? "",
    beatMap: c.beatMap?.trim() ?? "",
    failureMode: c.failureMode?.trim() ?? "",
    derivation: c.derivation?.trim() ?? "",
    noveltyCheck: c.noveltyCheck?.trim() ?? "",
  }));
}

export async function runSynthesis(): Promise<{ runId: string; error: string }> {
  const { prompt, snapshot } = await buildSynthesisInput();

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
      candidates: {
        create: candidates.map((c) => ({
          name: c.name,
          engineSummary: c.engine,
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
