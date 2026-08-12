// ct_shifts — corrected, drop-in handler for the CleanCloth Cloud Run MCP server
// (the /mcp/organisation endpoint in ~/Documents/cloudrun-mcp).
//
// WHY THIS REWRITE
// ----------------
// Live testing of the deployed tool showed that EVERY date range returned
// "(no data)" — including a full two-year window (2025-01-01 → 2026-12-31).
// A timezone / same-day-boundary bug can only drop shifts at the *edges* of a
// range; it can never empty a 24-month span. So the root cause is not the date
// math — it is one (or both) of:
//
//   1. The Connecteam response is read from the wrong path, so the handler
//      returns undefined/[] no matter what. Connecteam nests the array under
//      `data.shifts`, and paging is sometimes a top-level sibling, sometimes
//      under `data`. A single hard-coded path silently yields nothing.
//   2. The upstream call is failing (401/403 bad key, 400 bad params) and the
//      error is being swallowed, then rendered as "(no data)".
//
// This version fixes both: it THROWS on any non-2xx (so a real failure can
// never again masquerade as an empty result), parses the array with
// fallbacks, sends Unix-seconds params (what Connecteam requires), expands a
// date-only endDate to end-of-day so same-day queries work, and ALWAYS returns
// a structured object with a debug block — never undefined.
//
// Uses global fetch + Intl only, so the SAME file works on Cloud Run (Node 18+)
// and on the Cloudflare Workers build.
//
// Backward compatibility: the input field names `startDate` / `endDate` are
// kept (Control-Center and the ChatGPT connector already call the tool with
// those), but they now accept either a date (`2026-08-12`) or a full ISO
// timestamp (`2026-08-12T14:30:00+02:00`).

const CONNECTEAM_BASE = "https://api.connecteam.com";
const BUSINESS_TZ = "Europe/Copenhagen";
const PAGE_SIZE = 100; // Connecteam paging size; we paginate to reach `limit`.

// --- Connecteam HTTP client -------------------------------------------------
// The API key must be provided via env (Cloud Run) or the Worker binding.
function connecteamApiKey(): string {
  // globalThis covers both Node (process.env) and Workers (env binding pattern).
  const key =
    (globalThis as any)?.process?.env?.CONNECTEAM_API_KEY ??
    (globalThis as any)?.CONNECTEAM_API_KEY;
  if (!key) throw new Error("CONNECTEAM_API_KEY is not configured");
  return key;
}

async function connecteamGet(
  path: string,
  query: Record<string, string | number | undefined>,
): Promise<any> {
  const url = new URL(path, CONNECTEAM_BASE);
  for (const [k, v] of Object.entries(query)) {
    if (v !== undefined && v !== null) url.searchParams.set(k, String(v));
  }

  const res = await fetch(url.toString(), {
    method: "GET",
    headers: {
      "X-API-KEY": connecteamApiKey(),
      accept: "application/json",
    },
  });

  const text = await res.text();

  // NEVER swallow a non-2xx. A swallowed 401/403/400 is exactly what was being
  // rendered as "(no data)". Surface it loudly instead.
  if (!res.ok) {
    throw new Error(
      `Connecteam ${res.status} ${res.statusText} on ${path} — ${text.slice(0, 500)}`,
    );
  }

  try {
    return text ? JSON.parse(text) : {};
  } catch {
    throw new Error(
      `Connecteam returned non-JSON on ${path} — ${text.slice(0, 200)}`,
    );
  }
}

// --- Timezone-correct date -> Unix seconds ----------------------------------
// Interprets a wall-clock string in the given IANA timezone, DST-aware, using
// only Intl (no external date library — Workers-safe).
function zoneOffsetMs(instant: Date, timeZone: string): number {
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const p = Object.fromEntries(
    dtf.formatToParts(instant).map((x) => [x.type, x.value]),
  ) as Record<string, string>;
  const asUTC = Date.UTC(
    Number(p.year),
    Number(p.month) - 1,
    Number(p.day),
    Number(p.hour),
    Number(p.minute),
    Number(p.second),
  );
  return asUTC - instant.getTime();
}

function wallClockToUnixSeconds(wall: string, timeZone: string): number {
  // Treat `wall` as if it were UTC, then subtract the zone offset that applies
  // at that instant to get the true UTC epoch.
  const guess = new Date(wall + "Z");
  if (Number.isNaN(guess.getTime())) {
    throw new Error(`Invalid date/time: ${wall}`);
  }
  const offset = zoneOffsetMs(guess, timeZone);
  return Math.floor((guess.getTime() - offset) / 1000);
}

function toUnixSeconds(input: string, endOfDay: boolean): number {
  const s = String(input).trim();
  const hasTime = s.includes("T");
  const hasZone = /([zZ]|[+-]\d{2}:?\d{2})$/.test(s);

  // A full ISO timestamp that already carries a zone/Z — trust it verbatim.
  if (hasTime && hasZone) {
    const ms = Date.parse(s);
    if (Number.isNaN(ms)) throw new Error(`Invalid datetime: ${input}`);
    return Math.floor(ms / 1000);
  }

  // Otherwise interpret as Copenhagen wall-clock. Date-only endDate expands to
  // end-of-day so that startDate === endDate covers the whole day (this is what
  // made same-day queries fail before).
  const wall = hasTime ? s : `${s}T${endOfDay ? "23:59:59" : "00:00:00"}`;
  return wallClockToUnixSeconds(wall, BUSINESS_TZ);
}

// --- The handler ------------------------------------------------------------
export interface CtShiftsArgs {
  schedulerId: number;
  startDate: string; // date (YYYY-MM-DD) or full ISO timestamp
  endDate: string; // date (YYYY-MM-DD) or full ISO timestamp
  limit?: number;
}

export async function ctShifts(args: CtShiftsArgs) {
  const { schedulerId, startDate, endDate } = args;
  const limit = args.limit ?? 500;

  if (schedulerId == null) throw new Error("schedulerId is required");

  const startTime = toUnixSeconds(startDate, /* endOfDay */ false);
  const endTime = toUnixSeconds(endDate, /* endOfDay */ true);
  if (!Number.isFinite(startTime) || !Number.isFinite(endTime)) {
    throw new Error("Invalid startDate or endDate");
  }
  if (endTime < startTime) {
    throw new Error(
      `endDate (${endDate}) resolves before startDate (${startDate})`,
    );
  }

  const shifts: any[] = [];
  let offset = 0;

  // Paginate until the page is short, we've reached the reported total, or we
  // hit the caller's limit.
  while (true) {
    const body = await connecteamGet(
      `/scheduler/v1/schedulers/${schedulerId}/shifts`,
      { startTime, endTime, limit: PAGE_SIZE, offset },
    );

    // Response-path fallbacks: Connecteam nests under `data.shifts`; keep the
    // bare `shifts` fallback in case a proxy/version flattens it.
    const page: any[] = body?.data?.shifts ?? body?.shifts ?? [];
    shifts.push(...page);

    const total: number | undefined =
      body?.paging?.total ?? body?.data?.paging?.total;

    offset += page.length;

    if (page.length < PAGE_SIZE) break; // last (short) page
    if (typeof total === "number" && offset >= total) break;
    if (shifts.length >= limit) break; // caller's cap
    if (page.length === 0) break; // safety against non-advancing paging
  }

  const trimmed = shifts.slice(0, limit);

  // ALWAYS return a structured object — never undefined, even when empty. The
  // debug block makes an empty result self-explanatory (you can see the exact
  // window that was queried).
  return {
    schedulerId,
    startTime,
    endTime,
    count: trimmed.length,
    shifts: trimmed,
    debug: {
      schedulerId,
      startTime,
      endTime,
      requestedRange: { startDate, endDate },
      timezone: BUSINESS_TZ,
    },
  };
}
