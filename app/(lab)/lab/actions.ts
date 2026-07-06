"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/session";
import { runSynthesis } from "@/lib/synthesis";

export async function runTheLab(): Promise<void> {
  await requireUser();
  const { runId } = await runSynthesis();
  revalidatePath("/lab");
  redirect(`/lab?dealt=${runId}`);
}

export async function castVote(
  candidateId: string,
  verdict: "keep" | "kill" | "mutate",
  note: string,
): Promise<void> {
  const user = await requireUser();
  const candidate = await db.candidate.findUnique({
    where: { id: candidateId },
  });
  if (!candidate) return;

  await db.vote.upsert({
    where: {
      userId_candidateId: { userId: user.id, candidateId },
    },
    update: { verdict, note },
    create: { userId: user.id, candidateId, verdict, note },
  });
  revalidatePath("/lab");
}
