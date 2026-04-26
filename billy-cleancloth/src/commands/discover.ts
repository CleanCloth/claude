import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { BillyClient } from "../client/BillyClient.js";
import { BillyApiError } from "../client/types.js";

// One-shot reconnaissance: hit every GET endpoint we expect to exist on a
// Billy v2 organization and dump the raw JSON to data/discovery.json. This
// is the source-of-truth dump we use to figure out CleanCloth's chart of
// accounts, VAT rulesets, and product catalogue before writing automations
// that depend on specific IDs.
//
// Each probe runs independently. A 404/403 on one endpoint never aborts
// the rest — the failure is recorded so we can see which endpoints aren't
// available on this plan/permissions.

interface Probe {
  name: string;
  path: string;
  query?: Record<string, string | number | boolean | undefined>;
}

const PROBES: Probe[] = [
  { name: "organization", path: "/organization" },
  { name: "accounts", path: "/accounts", query: { pageSize: 1000 } },
  { name: "accountGroups", path: "/accountGroups", query: { pageSize: 200 } },
  { name: "taxRates", path: "/taxRates", query: { pageSize: 200 } },
  { name: "products", path: "/products", query: { pageSize: 500 } },
  { name: "productCategories", path: "/productCategories" },
  { name: "currencies", path: "/currencies", query: { pageSize: 50 } },
  { name: "paymentTerms", path: "/paymentTerms" },
  { name: "bankAccounts", path: "/bankAccounts" },
  { name: "daybooks", path: "/daybooks" },
  { name: "contacts", path: "/contacts", query: { pageSize: 25 } },
  { name: "contactPersons", path: "/contactPersons", query: { pageSize: 25 } },
  // Sample only — we don't want to slurp the entire ledger here. Discover
  // is about field shapes, not bulk data.
  { name: "invoices_sample", path: "/invoices", query: { pageSize: 5 } },
  { name: "bills_sample", path: "/bills", query: { pageSize: 5 } },
  { name: "bankPayments_sample", path: "/bankPayments", query: { pageSize: 5 } },
];

const OUT_PATH = resolve(process.cwd(), "data/discovery.json");

interface ProbeResult {
  ok: boolean;
  status?: number;
  error?: unknown;
  data?: unknown;
}

export async function discover(token: string): Promise<number> {
  const client = new BillyClient({ token });
  const results: Record<string, ProbeResult> = {};

  console.log("Discovering Billy resources for CleanCloth…");

  for (const probe of PROBES) {
    process.stdout.write(`  ${probe.name.padEnd(24)} `);
    try {
      const data = await client.get(probe.path, probe.query ? { query: probe.query } : {});
      results[probe.name] = { ok: true, data };
      const count = countItems(data, probe.name);
      console.log(count !== undefined ? `ok (${count} items)` : "ok");
    } catch (err) {
      if (err instanceof BillyApiError) {
        results[probe.name] = { ok: false, status: err.status, error: err.body };
        console.log(`failed (HTTP ${err.status})`);
      } else {
        const msg = err instanceof Error ? err.message : String(err);
        results[probe.name] = { ok: false, error: msg };
        console.log(`failed (${msg})`);
      }
    }
  }

  const dump = {
    generatedAt: new Date().toISOString(),
    baseUrl: "https://api.billyapp.com/v2",
    results,
  };

  await mkdir(dirname(OUT_PATH), { recursive: true });
  await writeFile(OUT_PATH, JSON.stringify(dump, null, 2), "utf8");

  console.log(`\nWrote ${OUT_PATH}`);
  console.log("Share that file back so we can hard-code account IDs and VAT rulesets.");
  return 0;
}

// Best-effort item count for human progress feedback. Billy wraps lists as
// { <resourceKey>: [...], meta }; the resourceKey is plural. We try to find
// the first array on the response.
function countItems(data: unknown, name: string): number | undefined {
  if (!data || typeof data !== "object") return undefined;
  for (const value of Object.values(data as Record<string, unknown>)) {
    if (Array.isArray(value)) return value.length;
  }
  void name;
  return undefined;
}
