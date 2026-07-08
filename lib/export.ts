import { db } from "@/lib/db";
import { SECTIONS } from "@/content/workbook";
import { FAMILY_LABEL, getSystem } from "@/content/library";
import { getTone, isToneId, TONE_TYPE_LABEL } from "@/content/tone";
import { USERS, type UserId } from "@/lib/session";

/** Full session dump as markdown — the thing that gets pasted back into
    Claude chat for deeper development. */
export async function buildExport(): Promise<string> {
  const [answers, stars, runs] = await Promise.all([
    db.answer.findMany({ where: { NOT: { text: "" } } }),
    db.star.findMany(),
    db.run.findMany({
      orderBy: { createdAt: "asc" },
      include: { candidates: { include: { votes: true } } },
    }),
  ]);

  const byUser = (userId: UserId) =>
    new Map(
      answers
        .filter((a) => a.userId === userId)
        .map((a) => [a.questionId, a.text]),
    );
  const jj = byUser("jj");
  const stefan = byUser("stefan");

  const out: string[] = [];
  out.push("# Structure Lab — session export");
  out.push(
    `\nExported ${new Date().toISOString()} · A Halloween Story — structural invention workbook\n`,
  );

  out.push("## Workbook answers\n");
  for (const section of SECTIONS) {
    out.push(`### Sec. ${section.index} — ${section.title}\n`);
    for (const q of section.questions) {
      out.push(`**Q${q.id}** ${q.prompt}\n`);
      if (q.starPrompt) {
        out.push(
          `_Answered via Library stars — see Starred ${q.starPrompt === "tone" ? "tone" : "ingredients"}._\n`,
        );
        continue;
      }
      const a = jj.get(q.id);
      const b = stefan.get(q.id);
      out.push(`- **JJ:** ${a ? a.replaceAll("\n", "\n  ") : "_unanswered_"}`);
      out.push(
        `- **Stefan:** ${b ? b.replaceAll("\n", "\n  ") : "_unanswered_"}\n`,
      );
    }
  }

  const starIds = [...new Set(stars.map((s) => s.systemId))].sort(
    (a, b) => a - b,
  );
  const whoFor = (id: number) =>
    stars
      .filter((s) => s.systemId === id)
      .map((s) => USERS[s.userId as UserId].name)
      .join(" + ");

  out.push("## Starred ingredients (structure)\n");
  const structureIds = starIds.filter((id) => !isToneId(id));
  if (structureIds.length === 0) out.push("_Nothing starred._\n");
  for (const id of structureIds) {
    const sys = getSystem(id);
    if (!sys) continue;
    out.push(
      `- **No. ${String(sys.id).padStart(2, "0")} ${sys.name}** [${FAMILY_LABEL[sys.family]}] — starred by ${whoFor(id)}. ${sys.mechanism}`,
    );
  }
  out.push("");

  out.push("## Starred tone\n");
  const toneIds = starIds.filter((id) => isToneId(id));
  if (toneIds.length === 0) out.push("_Nothing starred._\n");
  for (const id of toneIds) {
    const t = getTone(id);
    if (!t) continue;
    out.push(
      `- **${t.code} ${t.name}** [${TONE_TYPE_LABEL[t.type]}] — starred by ${whoFor(id)}. ${t.mechanism}`,
    );
  }
  out.push("");

  out.push("## Synthesis runs\n");
  if (runs.length === 0) out.push("_No runs yet._\n");
  runs.forEach((run, i) => {
    out.push(
      `### Run ${String(i + 1).padStart(2, "0")} — ${run.createdAt.toISOString()}\n`,
    );
    if (run.error) {
      out.push(`_Run failed: ${run.error}_\n`);
    }
    for (const c of run.candidates) {
      out.push(`#### ${c.name}\n`);
      out.push(`- **Engine:** ${c.engineSummary}`);
      if (c.tonalEngine) out.push(`- **Tonal engine:** ${c.tonalEngine}`);
      if (c.clockBorder) out.push(`- **Clock & border:** ${c.clockBorder}`);
      out.push(`- **Beat-map:**\n\n\`\`\`\n${c.beatMap}\n\`\`\`\n`);
      out.push(`- **Predicted failure mode:** ${c.failureMode}`);
      if (c.noveltyCheck) out.push(`- **Novelty check:** ${c.noveltyCheck}`);
      if (c.sourceAnswers.length)
        out.push(`- **Derivation:** ${c.sourceAnswers.join("; ")}`);
      for (const v of c.votes) {
        out.push(
          `- **${USERS[v.userId as UserId].name} verdict:** ${v.verdict}${v.note ? ` — ${v.note}` : ""}`,
        );
      }
      out.push("");
    }
  });

  return out.join("\n");
}
