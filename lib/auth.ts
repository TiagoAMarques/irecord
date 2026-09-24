import { env } from "cloudflare:workers";

export type AppUser = { id: number; name: string; username: string; isAdmin: boolean };

export function usernameFor(name: string) {
  return name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z]/g, "");
}

export function loginCodeFor(name: string) {
  const username = usernameFor(name);
  const sum = [...username].reduce((total, letter) => total + letter.charCodeAt(0) - 96, 0);
  return `${username}${String(sum).padStart(4, "0")}`;
}

async function hashToken(token: string) {
  const bytes = new TextEncoder().encode(token);
  const hash = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(hash)].map((value) => value.toString(16).padStart(2, "0")).join("");
}

export async function getSessionUser(request: Request): Promise<AppUser | null> {
  if (!env.DB) return null;
  const token = request.headers.get("cookie")?.match(/(?:^|;\s*)irecord_session=([^;]+)/)?.[1];
  if (!token) return null;
  const tokenHash = await hashToken(decodeURIComponent(token));
  const row = await env.DB.prepare("SELECT o.id, o.name, o.is_admin FROM auth_sessions s JOIN observers o ON o.id = s.observer_id WHERE s.token_hash = ? AND s.expires_at > ? AND o.active = 1 LIMIT 1")
    .bind(tokenHash, new Date().toISOString()).first<{ id: number; name: string; is_admin: number }>();
  return row ? { id: row.id, name: row.name, username: usernameFor(row.name), isAdmin: Boolean(row.is_admin) } : null;
}

export async function requireSession(request: Request) {
  const user = await getSessionUser(request);
  if (!user) return { user: null, response: Response.json({ error: "Sign in required" }, { status: 401 }) };
  return { user, response: null };
}

export async function createSession(observerId: number) {
  if (!env.DB) throw new Error("Database binding is unavailable");
  const token = crypto.randomUUID() + crypto.randomUUID();
  const tokenHash = await hashToken(token);
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
  await env.DB.prepare("INSERT INTO auth_sessions (token_hash, observer_id, expires_at) VALUES (?, ?, ?)").bind(tokenHash, observerId, expiresAt).run();
  return { token, expiresAt };
}

export async function deleteSession(request: Request) {
  if (!env.DB) return;
  const token = request.headers.get("cookie")?.match(/(?:^|;\s*)irecord_session=([^;]+)/)?.[1];
  if (token) await env.DB.prepare("DELETE FROM auth_sessions WHERE token_hash = ?").bind(await hashToken(decodeURIComponent(token))).run();
}
