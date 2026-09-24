import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";
const args = process.argv.slice(2);
if (args.join(" ") !== "run build") process.exit(64);
const script = path.join(path.dirname(fileURLToPath(import.meta.url)), "run-framework.mjs");
const result = spawnSync(process.execPath, [script, "build"], { stdio: "inherit", env: process.env });
process.exit(result.status ?? 1);
