import "server-only";
import { cookies } from "next/headers";
import type { NextRequest } from "next/server";

export interface Session {
  email: string;
}

const SESSION_COOKIE = "ct_session";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export async function setSession(session: Session): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, Buffer.from(JSON.stringify(session)).toString("base64"), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function getSession(): Promise<Session | null> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(SESSION_COOKIE)?.value;
  if (!raw) return null;
  try {
    return JSON.parse(Buffer.from(raw, "base64").toString("utf8")) as Session;
  } catch {
    return null;
  }
}

export async function clearSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

/** Read the session directly from a request (for Edge middleware). */
export function getSessionCookie(request: NextRequest): Session | null {
  const raw = request.cookies.get(SESSION_COOKIE)?.value;
  if (!raw) return null;
  try {
    return JSON.parse(Buffer.from(raw, "base64").toString("utf8")) as Session;
  } catch {
    return null;
  }
}
