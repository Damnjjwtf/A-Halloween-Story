import { db } from "@/lib/db";
import { SECTIONS } from "@/content/workbook";
import { FAMILY_LABEL, getSystem } from "@/content/library";
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
      if (q.id === "7.1") {
        out.push("_Answered via Library stars — see Starred ingredients._\n");
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

  out.push("## Starred ingredients\n");
  const starIds = [...new Set(stars.map((s) => s.systemId))].sort(
    (a, b) => a - b,
  );
  if (starIds.length === 0) out.push("_Nothing starred._\n");
  for (const id of starIds) {
    const sys = getSystem(id);
    if (!sys) continue;
    const who = stars
      .filter((s) => s.systemId === id)
      .map((s) => USERS[s.userId as UserId].name)
      .join(" + ");
    out.push(
      `- **No. ${String(sys.id).padStart(2, "0")} ${sys.name}** [${FAMILY_LABEL[sys.family]}] — starred by ${who}. ${sys.mechanism}`,
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
