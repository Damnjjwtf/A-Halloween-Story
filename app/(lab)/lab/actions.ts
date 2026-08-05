"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/session";
import { runSynthesis } from "@/lib/synthesis";

export async function runTheLab(curveball = ""): Promise<void> {
  await requireUser();
  const { runId } = await runSynthesis(curveball);
  revalidatePath("/lab");
  redirect(`/lab?dealt=${runId}`);
}

const VERDICTS = ["keep", "kill", "mutate"] as const;

export async function castVote(
  candidateId: string,
  verdict: "keep" | "kill" | "mutate",
  note: string,
): Promise<void> {
  const user = await requireUser();
  // Types are erased at runtime — validate the enum and bound the note
  // before they reach the database.
  if (!VERDICTS.includes(verdict)) return;
  const trimmedNote = note.slice(0, 2000);

  const candidate = await db.candidate.findUnique({
    where: { id: candidateId },
    select: { id: true },
  });
  if (!candidate) return;

  await db.vote.upsert({
    where: {
      userId_candidateId: { userId: user.id, candidateId },
    },
    update: { verdict, note: trimmedNote },
    create: { userId: user.id, candidateId, verdict, note: trimmedNote },
  });
  revalidatePath("/lab");
}

export async function addComment(
  candidateId: string,
  body: string,
): Promise<{ ok: boolean }> {
  const user = await requireUser();
  const trimmed = body.trim().slice(0, 4000);
  if (!trimmed) return { ok: false };

  const candidate = await db.candidate.findUnique({
    where: { id: candidateId },
    select: { id: true },
  });
  if (!candidate) return { ok: false };

  await db.comment.create({
    data: { candidateId, userId: user.id, body: trimmed },
  });
  revalidatePath("/lab");
  return { ok: true };
}
