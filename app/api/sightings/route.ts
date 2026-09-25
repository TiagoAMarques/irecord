import { env } from "cloudflare:workers";
import { getDb } from "../../../db";
import { sightings } from "../../../db/schema";
import { requireSession } from "../../../lib/auth";

export async function POST(req: Request) {
  try {
    const auth = await requireSession(req);
    if (auth.response) return auth.response;
    const form = await req.formData();
    const numberValue = (key: string) => Number(form.get(key));
    const nMin = numberValue("nMin");
    const nMax = numberValue("nMax");
    const nOptim = numberValue("nOptim");
    if (!nMin || nMin > nOptim || nOptim > nMax) return Response.json({ error: "Group sizes must follow N min ≤ N optim ≤ N max." }, { status: 400 });
    const observerId = numberValue("observerId");
    const beaufortSeaState = numberValue("beaufortSeaState");
    const visibilityScale = numberValue("visibilityScale");
    const douglasSeaState = numberValue("douglasSeaState");
    const surveyCode = String(form.get("surveyCode") || "").trim();
    if (!surveyCode) return Response.json({ error: "Survey code is required." }, { status: 400 });
    if (beaufortSeaState < 1 || beaufortSeaState > 4 || visibilityScale < 0 || visibilityScale > 4 || douglasSeaState < 0 || douglasSeaState > 9) return Response.json({ error: "One or more environmental values are outside the permitted scale." }, { status: 400 });
    const selectedObserver = await env.DB?.prepare("SELECT id FROM observers WHERE id = ? AND active = 1").bind(observerId).first();
    if (!selectedObserver) return Response.json({ error: "Please select an active observer." }, { status: 400 });
    const photoKeys: string[] = [];
    for (const photo of form.getAll("photos")) {
      if (photo instanceof File && photo.size) {
        if (!env.BUCKET) throw new Error("Photo storage is unavailable");
        const key = `sightings/${crypto.randomUUID()}-${photo.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
        await env.BUCKET.put(key, photo.stream(), { httpMetadata: { contentType: photo.type } });
        photoKeys.push(key);
      }
    }
    const [row] = await getDb().insert(sightings).values({
      observerId, enteredByObserverId: auth.user!.id, speciesId: numberValue("speciesId"), distanceType: String(form.get("distanceType")), angle: numberValue("angle"),
      nMin, nMax, nOptim, response: String(form.get("response")), latitude: numberValue("latitude"), longitude: numberValue("longitude"), gpsAccuracy: numberValue("gpsAccuracy"),
      hasPhotos: form.get("hasPhotos") === "yes" || photoKeys.length > 0, photoKeys: JSON.stringify(photoKeys), platform: String(form.get("platform")).trim(), surveyCode, beaufortSeaState, visibilityScale, douglasSeaState,
      observedAt: String(form.get("observedAt")), comments: String(form.get("comments") || "").trim(),
    }).returning({ id: sightings.id });
    return Response.json(row, { status: 201 });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Could not save" }, { status: 500 });
  }
}
