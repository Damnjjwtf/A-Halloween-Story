import { db } from "@/lib/db";
import { SECTIONS } from "@/content/workbook";
import type { UserId } from "@/lib/session";

export type SectionProgress = {
  sectionId: string;
  answered: number;
  total: number;
};

/**
 * Per-section answered/total counts for one user. Deferred sections
 * report total 0. User-agnostic on purpose — M2 Compare calls this
 * for both users.
 */
export async function computeProgress(
  userId: UserId,
): Promise<Map<string, SectionProgress>> {
  const rows = await db.answer.findMany({
    where: { userId, NOT: { text: "" } },
    select: { questionId: true },
  });
  const answeredIds = new Set(rows.map((r) => r.questionId));

  const out = new Map<string, SectionProgress>();
  for (const section of SECTIONS) {
    if (section.deferred) {
      out.set(section.id, { sectionId: section.id, answered: 0, total: 0 });
      continue;
    }
    const answered = section.questions.filter((q) =>
      answeredIds.has(q.id),
    ).length;
    out.set(section.id, {
      sectionId: section.id,
      answered,
      total: section.questions.length,
    });
  }
  return out;
}
