import { appendFile, mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";

// Single mutation log, JSONL. Append-only so it can be tailed and grepped.
// Location is relative to the project root (cwd when the CLI runs).
const LOG_PATH = resolve(process.cwd(), "logs/mutations.log");

export interface MutationLogEntry {
  timestamp: string;
  method: string;
  url: string;
  payload: unknown;
  response: unknown;
}

let dirEnsured = false;

export async function logMutation(entry: MutationLogEntry): Promise<void> {
  if (!dirEnsured) {
    await mkdir(dirname(LOG_PATH), { recursive: true });
    dirEnsured = true;
  }
  await appendFile(LOG_PATH, `${JSON.stringify(entry)}\n`, "utf8");
}
