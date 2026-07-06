import { db } from "@/lib/db";
import { SECTIONS } from "@/content/workbook";
import type { UserId } from "@/lib/session";

export type SectionProgress = {
  sectionId: string;
  answered: number;
  total: number;
};

/**
 * Per-section answered/total counts for one user. Question 7.1 counts
 * as answered once the user has starred 4+ Library systems.
 * User-agnostic on purpose — Compare calls this for both users.
 */
export async function computeProgress(
  userId: UserId,
): Promise<Map<string, SectionProgress>> {
  const [rows, starCount] = await Promise.all([
    db.answer.findMany({
      where: { userId, NOT: { text: "" } },
      select: { questionId: true },
    }),
    db.star.count({ where: { userId } }),
  ]);
  const answeredIds = new Set(rows.map((r) => r.questionId));

  const out = new Map<string, SectionProgress>();
  for (const section of SECTIONS) {
    const answered = section.questions.filter((q) =>
      q.id === "7.1" ? starCount >= 4 : answeredIds.has(q.id),
    ).length;
    out.set(section.id, {
      sectionId: section.id,
      answered,
      total: section.questions.length,
    });
  }
  return out;
}
