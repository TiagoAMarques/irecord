import { env } from "cloudflare:workers";
import { requireSession } from "../../../../lib/auth";

export async function POST(req: Request, context: { params: Promise<{ kind: string }> | { kind: string } }) {
  try {
    const auth = await requireSession(req);
    if (auth.response) return auth.response;
    if (!auth.user?.isAdmin) return Response.json({ error: "Administrator access is required." }, { status: 403 });
    if (!env.DB) throw new Error("Database binding is unavailable");
    const { kind } = await context.params;
    const payload = await req.json() as { name?: string; scientificName?: string; items?: string[] };

    if (kind === "observers" && payload.items?.length) {
      const names = [...new Set(payload.items.map((item) => item.trim()).filter(Boolean))];
      await env.DB.batch(names.map((name) =>
        env.DB!.prepare("INSERT OR IGNORE INTO observers (name, active) VALUES (?, 1)").bind(name)
      ));
      return Response.json({ ok: true, added: names.length }, { status: 201 });
    }

    const name = payload.name?.trim();
    if (!name) return Response.json({ error: "Name is required" }, { status: 400 });

    if (kind === "observers") {
      await env.DB.prepare("INSERT INTO observers (name, active) VALUES (?, 1)").bind(name).run();
    } else if (kind === "species") {
      await env.DB.prepare("INSERT INTO species (common_name, scientific_name, active) VALUES (?, ?, 1)")
        .bind(name, payload.scientificName?.trim() || "").run();
    } else {
      return Response.json({ error: "Unknown list" }, { status: 404 });
    }
    return Response.json({ ok: true }, { status: 201 });
  } catch (error) {
    console.error("iRecord reference write failed", error);
    const message = error instanceof Error ? error.message : "Could not add item";
    const friendly = message.includes("UNIQUE") ? "That name is already in the list." : message;
    return Response.json({ error: friendly }, { status: 500 });
  }
}
