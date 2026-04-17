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

Commands are invoked through `pnpm billy <command>`:

```sh
pnpm billy ping
```

Expected output on success:

```
✓ Billy API reachable
  Organization: CleanCloth Rengøring
  CVR:          xxxxxxxx
  Currency:     DKK
  Country:      DK
  Locale:       da_DK
  Org ID:       <uuid>
```

Exit code is `0` on success, `1` on any error.

## Ground rules baked in

- Every mutation (POST/PUT/DELETE) is appended to `logs/mutations.log` as JSONL.
- Write commands will default to dry-run once they exist; `--execute` required
  to actually hit the API.
- Amounts are integers (øre); `src/util/money.ts` handles conversion + `da-DK`
  formatting.
- `.env` and `logs/` are gitignored.

## Status

MVP step 1/5: scaffold + `ping`. Next steps (`discover`, resources, `invoices:list`)
land after `ping` is confirmed working.
