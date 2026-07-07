"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE, signSession, type UserId } from "@/lib/session";

export type GateState = { error: string | null };

export async function enterLab(
  _prev: GateState,
  formData: FormData,
): Promise<GateState> {
  const passphrase = String(formData.get("passphrase") ?? "");
  const who = String(formData.get("who") ?? "");

  if (who !== "jj" && who !== "stefan") {
    return { error: "Pick a name." };
  }

  // No GATE_PASSPHRASE configured = open door: just pick a seat.
  // Set the env var (and redeploy) to lock the gate again.
  const expected = process.env.GATE_PASSPHRASE;
  if (expected && passphrase !== expected) {
    return { error: "Wrong passphrase." };
  }

  const store = await cookies();
  store.set(SESSION_COOKIE, await signSession(who as UserId), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 90, // 90 days
  });

  redirect("/workbook");
}
