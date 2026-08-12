# Fix: `ct_shifts` always returns "(no data)"

This folder contains a corrected, drop-in `ct_shifts` handler for the CleanCloth
Cloud Run MCP server (`~/Documents/cloudrun-mcp`, the `/mcp/organisation`
endpoint). It is delivered here because that project is **local-only on your Mac
and was never pushed to GitHub**, so it could not be edited directly from the
remote session that produced this fix.

## What was proven

Running the live `ct_shifts` tool against scheduler **5115573** (`Job Scheduler`,
`Europe/Copenhagen`):

| Query | Result |
|-------|--------|
| `2026-08-12` → `2026-08-12` (same day) | `(no data)` |
| `2026-08-12` → `2026-08-13` | `(no data)` |
| `2026-08-01` → `2026-08-31` | `(no data)` |
| `2025-01-01` → `2026-12-31` (two years) | `(no data)` |

**A two-year window returning empty rules out the timezone / same-day-boundary
theory** — that class of bug can only drop shifts at the edges of a range, never
empty 24 months. The cause is therefore in the handler itself:

1. **Wrong response path** — Connecteam nests the array under `data.shifts`
   (paging is sometimes a top-level sibling, sometimes under `data`). A single
   hard-coded path silently returns nothing.
2. **Swallowed upstream error** — a failing call (401/403 bad API key, 400 bad
   params) caught and rendered as `(no data)` instead of surfacing.

## What the fix changes

- **Throws on any non-2xx** from Connecteam (status + body). A real failure can
  never again masquerade as an empty result — this is the single most important
  change; run it once and the tool will tell you if it's auth or params.
- **Response-path fallbacks:** `data.shifts ?? shifts ?? []`, paging from either
  location.
- **Unix-seconds params** (`startTime` / `endTime`) — what the Connecteam
  Scheduler API requires.
- **End-of-day expansion** for a date-only `endDate`, so `startDate === endDate`
  covers the whole day.
- **DST-correct** Copenhagen conversion using only `Intl` (Workers-safe).
- **Never returns `undefined`** — always `{ count, shifts, debug }`, with a
  `debug` block that makes an empty result self-explanatory.
- **Pagination** to reach `limit`.

Input field names `startDate` / `endDate` are **kept** (Control-Center and the
ChatGPT connector already call the tool with them). They now accept either a
date (`2026-08-12`) or a full ISO timestamp. This is deliberately *not* the
`start_datetime` rename ChatGPT suggested — renaming would break existing
callers, and the two-year-empty evidence shows the param name was never the bug.

## How to drop it in

1. Copy `ct_shifts.ts` into `~/Documents/cloudrun-mcp` (e.g. `src/tools/` or
   wherever the organisation tools live).
2. Wire it into the tool registration for the `/mcp/organisation` endpoint,
   replacing the current `ct_shifts` handler. The exported `ctShifts(args)`
   takes `{ schedulerId, startDate, endDate, limit? }` and returns the object
   the tool should respond with. Keep your existing JSON-schema for the tool's
   input (schedulerId: number, startDate: string, endDate: string,
   limit?: number).
3. Ensure `CONNECTEAM_API_KEY` is set in the Cloud Run service env (and the
   Workers binding for the Cloudflare build). The client reads it from
   `process.env.CONNECTEAM_API_KEY` (Node) or a global of the same name
   (Workers).
4. If your Connecteam client wrapper differs (base URL, auth header name), keep
   your wrapper and port just the parsing + error-throwing + date logic — the
   important parts are: throw on non-2xx, read `data.shifts`, send Unix seconds.

## Deploy

```bash
cd ~/Documents/cloudrun-mcp
gcloud run deploy cleancloth-mcp --source . --region europe-west1
```

(For the Cloudflare build, `wrangler deploy` as usual.)

## Verify (do these in order)

1. `ct_shifts` for scheduler `5115573`, `2026-08-12` → `2026-08-12`.
   - If it now **throws** with a Connecteam status → the real bug was auth/params;
     read the status (401/403 = API key, 400 = params) and fix the key/params.
   - If it returns `count > 0` → fixed.
   - If it returns `count: 0` with the `debug` block and the key is valid, the
     shifts genuinely are not under this scheduler's shift list — check whether
     they live under **jobs** instead (`ct_jobs`).
2. Test a full month (`2026-08-01` → `2026-08-31`) to confirm pagination.
3. Confirm the known Sabro/Søndergade shifts appear.
4. Once green, you can lower the temporary visibility of the thrown errors if
   you want, but keeping them surfaced is recommended.

## Also worth doing

`cloudrun-mcp` being local-only is a single point of failure (the deployed
service has no source backup, and no one but this Mac can fix it). Push it to a
private repo — e.g. `CleanCloth/cloudrun-mcp` — so it can be edited, reviewed,
and redeployed from anywhere.
