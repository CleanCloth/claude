import { BillyClient } from "../client/BillyClient.js";
import { BillyApiError } from "../client/types.js";
import { listContacts, type Contact } from "../resources/contacts.js";
import { listInvoices, type Invoice, type ListInvoicesOptions } from "../resources/invoices.js";

interface ParsedFlags {
  from?: string;
  to?: string;
  paid?: boolean;
  state?: string;
  pageSize: number;
  page: number;
}

const HELP = `Usage: pnpm billy invoices:list [flags]

Flags:
  --from YYYY-MM-DD       Filter by entryDate (inclusive lower bound).
  --to   YYYY-MM-DD       Filter by entryDate (inclusive upper bound).
  --paid                  Only paid invoices.
  --unpaid                Only unpaid invoices.
  --state <value>         Billy invoice state (draft|approved|cancelled…).
  --page-size <n>         Results per page (default 50).
  --page <n>              Page number (default 1).
  --help                  Show this message.
`;

export async function invoicesList(token: string, args: string[]): Promise<number> {
  if (args.includes("--help") || args.includes("-h")) {
    console.log(HELP);
    return 0;
  }

  let flags: ParsedFlags;
  try {
    flags = parseFlags(args);
  } catch (err) {
    console.error(err instanceof Error ? err.message : String(err));
    console.error(HELP);
    return 1;
  }

  const client = new BillyClient({ token });

  const opts: ListInvoicesOptions = {
    pageSize: flags.pageSize,
    page: flags.page,
  };
  if (flags.state) opts.state = flags.state;
  if (flags.paid !== undefined) opts.isPaid = flags.paid;
  if (flags.from || flags.to) {
    const from = flags.from ?? "1970-01-01";
    const to = flags.to ?? "9999-12-31";
    opts.entryDatePeriod = `dates:${from}...${to}`;
  }

  try {
    const [{ invoices, meta }, contactMap] = await Promise.all([
      listInvoices(client, opts),
      buildContactNameMap(client),
    ]);

    if (invoices.length === 0) {
      console.log("No invoices match those filters.");
      return 0;
    }

    printTable(invoices, contactMap);
    printMeta(meta, invoices.length);
    return 0;
  } catch (err) {
    if (err instanceof BillyApiError) {
      console.error(`✗ Billy API ${err.status}: ${err.message}`);
      if (err.body) console.error(JSON.stringify(err.body, null, 2));
    } else if (err instanceof Error) {
      console.error(`✗ ${err.message}`);
    } else {
      console.error("✗ Unknown error", err);
    }
    return 1;
  }
}

function parseFlags(args: string[]): ParsedFlags {
  const flags: ParsedFlags = { pageSize: 50, page: 1 };
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    switch (arg) {
      case "--from":
        flags.from = requireValue(args, ++i, "--from");
        break;
      case "--to":
        flags.to = requireValue(args, ++i, "--to");
        break;
      case "--paid":
        flags.paid = true;
        break;
      case "--unpaid":
        flags.paid = false;
        break;
      case "--state":
        flags.state = requireValue(args, ++i, "--state");
        break;
      case "--page-size":
        flags.pageSize = parsePositiveInt(args, ++i, "--page-size");
        break;
      case "--page":
        flags.page = parsePositiveInt(args, ++i, "--page");
        break;
      case "--help":
      case "-h":
        break;
      default:
        if (arg && arg.startsWith("--")) throw new Error(`Unknown flag: ${arg}`);
    }
  }
  return flags;
}

function requireValue(args: string[], idx: number, name: string): string {
  const v = args[idx];
  if (!v || v.startsWith("--")) throw new Error(`${name} requires a value`);
  return v;
}

function parsePositiveInt(args: string[], idx: number, name: string): number {
  const raw = requireValue(args, idx, name);
  const n = Number.parseInt(raw, 10);
  if (!Number.isFinite(n) || n < 1) throw new Error(`${name} must be a positive integer`);
  return n;
}

async function buildContactNameMap(client: BillyClient): Promise<Map<string, string>> {
  const map = new Map<string, string>();
  try {
    const { contacts } = await listContacts(client, { pageSize: 1000 });
    for (const c of contacts) addContact(map, c);
  } catch {
    // Non-fatal: we'll just print contactIds.
  }
  return map;
}

function addContact(map: Map<string, string>, c: Contact): void {
  if (c.name) map.set(c.id, c.name);
}

const DATE_FMT = new Intl.DateTimeFormat("da-DK");

function formatDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso : DATE_FMT.format(d);
}

// Billy v2 invoice fields are decimal kroner in the JSON payload. The bookkeeping
// ledger uses øre integers; that surface lives behind different endpoints.
// If discover proves otherwise for invoices, swap to oreToDkk in util/money.ts.
function formatMoney(value: unknown, currency: string): string {
  if (value === undefined || value === null) return "—";
  const n = typeof value === "string" ? Number(value) : Number(value);
  if (!Number.isFinite(n)) return String(value);
  return new Intl.NumberFormat("da-DK", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);
}

function printTable(invoices: Invoice[], contacts: Map<string, string>): void {
  const rows = invoices.map((inv) => {
    const contact = inv.contactId ? (contacts.get(inv.contactId) ?? inv.contactId) : "—";
    const currency = inv.currencyId ?? "DKK";
    return {
      no: inv.invoiceNo != null ? String(inv.invoiceNo) : inv.id,
      date: formatDate(inv.entryDate),
      contact,
      amount: formatMoney(inv.amount, currency),
      balance: formatMoney(inv.balance, currency),
      paid: inv.isPaid ? "✓" : " ",
      state: inv.state ?? "—",
    };
  });

  const headers = {
    no: "INVOICE",
    date: "DATE",
    contact: "CONTACT",
    amount: "AMOUNT",
    balance: "BALANCE",
    paid: "PAID",
    state: "STATE",
  };

  const widths = {
    no: width(headers.no, rows.map((r) => r.no)),
    date: width(headers.date, rows.map((r) => r.date)),
    contact: Math.min(32, width(headers.contact, rows.map((r) => r.contact))),
    amount: width(headers.amount, rows.map((r) => r.amount)),
    balance: width(headers.balance, rows.map((r) => r.balance)),
    paid: width(headers.paid, rows.map((r) => r.paid)),
    state: width(headers.state, rows.map((r) => r.state)),
  };

  const line = (r: Record<keyof typeof widths, string>): string =>
    [
      r.no.padEnd(widths.no),
      r.date.padEnd(widths.date),
      truncate(r.contact, widths.contact).padEnd(widths.contact),
      r.amount.padStart(widths.amount),
      r.balance.padStart(widths.balance),
      r.paid.padEnd(widths.paid),
      r.state.padEnd(widths.state),
    ].join("  ");

  console.log(line(headers));
  console.log(line(Object.fromEntries(Object.keys(widths).map((k) => [k, "─".repeat(widths[k as keyof typeof widths])])) as Record<keyof typeof widths, string>));
  for (const r of rows) console.log(line(r));
}

function width(header: string, values: string[]): number {
  return Math.max(header.length, ...values.map((v) => v.length));
}

function truncate(s: string, max: number): string {
  return s.length <= max ? s : `${s.slice(0, max - 1)}…`;
}

function printMeta(meta: unknown, shown: number): void {
  if (!meta || typeof meta !== "object") {
    console.log(`\n${shown} invoice(s) shown.`);
    return;
  }
  const paging = (meta as { paging?: { page?: number; pageCount?: number; total?: number } }).paging;
  if (paging) {
    const parts: string[] = [`${shown} shown`];
    if (paging.total !== undefined) parts.push(`${paging.total} total`);
    if (paging.page !== undefined && paging.pageCount !== undefined) {
      parts.push(`page ${paging.page}/${paging.pageCount}`);
    }
    console.log(`\n${parts.join(" · ")}`);
  } else {
    console.log(`\n${shown} invoice(s) shown.`);
  }
}
