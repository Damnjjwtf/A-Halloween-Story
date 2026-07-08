"use server";

import { db } from "@/lib/db";
import { requireUser } from "@/lib/session";
import { activeQuestionIds } from "@/content/workbook";

export type SaveResult = { ok: boolean; savedAt: string | null };

export async function saveAnswer(
  questionId: string,
  text: string,
): Promise<SaveResult> {
  const user = await requireUser();

  if (!activeQuestionIds().includes(questionId)) {
    return { ok: false, savedAt: null };
  }

  // Bound the stored answer — generous for prose, a ceiling against a
  // runaway paste (types are erased at the action boundary).
  const bounded = text.slice(0, 20000);

  const row = await db.answer.upsert({
    where: { userId_questionId: { userId: user.id, questionId } },
    update: { text: bounded },
    create: { userId: user.id, questionId, text: bounded },
  });

  return { ok: true, savedAt: row.updatedAt.toISOString() };
}
