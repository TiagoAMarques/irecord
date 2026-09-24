import { env } from "cloudflare:workers";
import { createSession, loginCodeFor, usernameFor } from "../../../../lib/auth";

export async function POST(request: Request) {
  try {
    if (!env.DB) throw new Error("Database unavailable");
    const { username = "", code = "" } = await request.json() as { username?: string; code?: string };
    const rows = await env.DB.prepare("SELECT id, name, is_admin FROM observers WHERE active = 1").all<{ id: number; name: string; is_admin: number }>();
    const observer = rows.results.find((row) => usernameFor(row.name) === usernameFor(username) && loginCodeFor(row.name) === code.toLowerCase());
    if (!observer) return Response.json({ error: "Invalid username or login code." }, { status: 401 });
    const adminCount = await env.DB.prepare("SELECT COUNT(*) AS count FROM observers WHERE is_admin = 1").first<{ count: number }>();
    if (!adminCount?.count) await env.DB.prepare("UPDATE observers SET is_admin = 1 WHERE id = ?").bind(observer.id).run();
    const session = await createSession(observer.id);
    return Response.json({ ok: true }, { headers: { "Set-Cookie": `irecord_session=${encodeURIComponent(session.token)}; Path=/; HttpOnly; Secure; SameSite=Lax; Expires=${new Date(session.expiresAt).toUTCString()}` } });
  } catch (error) {
    console.error("iRecord login failed", error);
    return Response.json({ error: "Could not sign in." }, { status: 500 });
  }
}
