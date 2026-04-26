# billy-cleancloth

TypeScript CLI that talks to the [Billy](https://www.billy.dk/api/) API for
CleanCloth Rengøring. Built for daily/weekly operational bookkeeping — not a
replacement for the revisor.

## Setup

```sh
cd billy-cleancloth
pnpm install
cp .env.example .env
# edit .env and paste the Billy access token for CleanCloth
```

## Running

Commands are invoked through `pnpm billy <command>`. Exit code is `0` on
success, `1` on any error.

### `ping`

```sh
pnpm billy ping
```

Sanity check — fetches `/v2/organization` and prints name, CVR, currency.

### `discover`

```sh
pnpm billy discover
```

Probes every relevant Billy resource (accounts, taxRates, products, contacts,
bankAccounts, daybooks, plus 5-row samples of invoices/bills/bankPayments)
and writes the raw JSON to `data/discovery.json`. Endpoint failures are
recorded per-probe; the run never aborts on a single failure. Share that
file back so we can hard-code account IDs and VAT rulesets for later
automations.

### `invoices:list`

```sh
pnpm billy invoices:list --from 2025-01-01 --to 2025-04-30 --unpaid
```

Filters: `--from`, `--to` (entryDate range), `--paid`, `--unpaid`, `--state`,
`--page`, `--page-size`. Output is a `da-DK` formatted table with invoice no,
date, contact, amount, balance, paid status, and state.

## Ground rules baked in

- Every mutation (POST/PUT/DELETE) is appended to `logs/mutations.log` as JSONL.
- Write commands default to dry-run; `--execute` required to actually hit the API.
- `da-DK` locale for display, DKK currency, ISO dates in storage.
- `.env`, `logs/`, and `data/` are gitignored.

## Status

MVP shipped: `ping`, `discover`, `invoices:list`. Next batch (bank reconciliation,
VAT period summary, BookingKoala sync) is gated on reviewing `data/discovery.json`
output to lock in the right account IDs.
