"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/session";
import { getSystem } from "@/content/library";

export async function toggleStar(systemId: number): Promise<void> {
  const user = await requireUser();
  if (!getSystem(systemId)) return;

  const key = { userId: user.id, systemId };
  const existing = await db.star.findUnique({
    where: { userId_systemId: key },
  });
  if (existing) {
    await db.star.delete({ where: { userId_systemId: key } });
  } else {
    await db.star.create({ data: key });
  }
  revalidatePath("/library");
  revalidatePath("/workbook");
  revalidatePath("/lab");
}
