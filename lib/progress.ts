import { db } from "@/lib/db";
import { SECTIONS } from "@/content/workbook";
import { isToneId } from "@/content/tone";
import type { UserId } from "@/lib/session";

export type SectionProgress = {
  sectionId: string;
  answered: number;
  total: number;
};

/**
 * Per-section answered/total counts for one user. Star-prompt questions
 * count as answered once enough of the right kind are starred:
 * 7.1 = 4+ structure stars, 10.3 = 3+ tone stars.
 * User-agnostic on purpose — Compare calls this for both users.
 */
export async function computeProgress(
  userId: UserId,
): Promise<Map<string, SectionProgress>> {
  const [rows, stars] = await Promise.all([
    db.answer.findMany({
      where: { userId, NOT: { text: "" } },
      select: { questionId: true },
    }),
    db.star.findMany({ where: { userId }, select: { systemId: true } }),
  ]);
  const answeredIds = new Set(rows.map((r) => r.questionId));
  const structureStarCount = stars.filter((s) => !isToneId(s.systemId)).length;
  const toneStarCount = stars.filter((s) => isToneId(s.systemId)).length;

  const starAnswered = (starPrompt: "structure" | "tone") =>
    starPrompt === "tone" ? toneStarCount >= 3 : structureStarCount >= 4;

  const out = new Map<string, SectionProgress>();
  for (const section of SECTIONS) {
    const answered = section.questions.filter((q) =>
      q.starPrompt ? starAnswered(q.starPrompt) : answeredIds.has(q.id),
    ).length;
    out.set(section.id, {
      sectionId: section.id,
      answered,
      total: section.questions.length,
    });
  }
  return out;
}
