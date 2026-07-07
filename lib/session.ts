import { cookies } from "next/headers";

export type UserId = "jj" | "stefan";

export const USERS: Record<UserId, { id: UserId; name: string }> = {
  jj: { id: "jj", name: "JJ" },
  stefan: { id: "stefan", name: "Stefan" },
};

export const OTHER_USER: Record<UserId, UserId> = {
  jj: "stefan",
  stefan: "jj",
};

export const SESSION_COOKIE = "lab_session";

function getSecret(): Uint8Array {
  // Falls back to a baked-in constant when SESSION_SECRET is unset.
  // Fine for this two-person tool's threat model: with no passphrase
  // gate the cookie only selects a seat, it doesn't protect anything.
  const secret =
    process.env.SESSION_SECRET ?? "structure-lab-default-secret-two-seats";
  return new TextEncoder().encode(secret);
}

async function hmacKey(): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    getSecret() as BufferSource,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

function toHex(buf: ArrayBuffer): string {
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/** "jj.<hmac-hex>" — value is tamper-evident, not encrypted (nothing secret in it). */
export async function signSession(userId: UserId): Promise<string> {
  const key = await hmacKey();
  const sig = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(userId) as BufferSource,
  );
  return `${userId}.${toHex(sig)}`;
}

export async function verifySession(
  value: string | undefined,
): Promise<UserId | null> {
  if (!value) return null;
  const dot = value.indexOf(".");
  if (dot === -1) return null;
  const userId = value.slice(0, dot);
  if (userId !== "jj" && userId !== "stefan") return null;
  const expected = await signSession(userId);
  // Constant-time-ish compare: both strings are fixed-length hex of equal size.
  if (expected.length !== value.length) return null;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) {
    diff |= expected.charCodeAt(i) ^ value.charCodeAt(i);
  }
  return diff === 0 ? userId : null;
}

/** Server Components / Server Actions: current user or null. */
export async function getCurrentUser(): Promise<{
  id: UserId;
  name: string;
} | null> {
  const store = await cookies();
  const userId = await verifySession(store.get(SESSION_COOKIE)?.value);
  return userId ? USERS[userId] : null;
}

/** Server Actions that mutate data call this; throws instead of redirecting. */
export async function requireUser(): Promise<{ id: UserId; name: string }> {
  const user = await getCurrentUser();
  if (!user) throw new Error("Not authenticated");
  return user;
}
