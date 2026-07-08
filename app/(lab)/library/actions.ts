"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/session";
import { getSystem } from "@/content/library";
import { getTone } from "@/content/tone";

export async function toggleStar(systemId: number): Promise<void> {
  const user = await requireUser();
  // Structure ids (1–30) and tone ids (101–120) share the stars table.
  if (!getSystem(systemId) && !getTone(systemId)) return;

  const key = { userId: user.id, systemId };
  const existing = await db.star.findUnique({
    where: { userId_systemId: key },
  });
  try {
    if (existing) {
      await db.star.delete({ where: { userId_systemId: key } });
    } else {
      await db.star.create({ data: key });
    }
  } catch (e) {
    // Rapid double-clicks can race two toggles on the same (userId,
    // systemId) primary key: a duplicate create (P2002) or a delete of an
    // already-deleted row (P2025). Both mean the desired end state was
    // reached by the other call — safe to ignore. Rethrow anything else.
    const code = (e as { code?: string })?.code;
    if (code !== "P2002" && code !== "P2025") throw e;
  }
  revalidatePath("/library");
  revalidatePath("/workbook");
  revalidatePath("/lab");
}
