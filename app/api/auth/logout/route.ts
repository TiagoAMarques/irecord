import { deleteSession } from "../../../../lib/auth";
export async function POST(request: Request) { await deleteSession(request); return Response.json({ ok: true }, { headers: { "Set-Cookie": "irecord_session=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0" } }); }
