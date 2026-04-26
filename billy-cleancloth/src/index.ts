#!/usr/bin/env node
import "dotenv/config";
import { discover } from "./commands/discover.js";
import { invoicesList } from "./commands/invoices-list.js";
import { ping } from "./commands/ping.js";

const HELP = `billy — CleanCloth accounting automation

Usage:
  pnpm billy <command> [options]

Commands:
  ping              Verify the API token by fetching the organization.
  discover          Probe Billy resources and dump to data/discovery.json.
  invoices:list     List invoices (use --help for filters).
  help              Show this message.

Environment:
  BILLY_TOKEN       Required. Billy access token for CleanCloth.
`;

async function main(): Promise<number> {
  const command = process.argv[2] ?? "help";
  const args = process.argv.slice(3);

  if (command === "help" || command === "--help" || command === "-h") {
    console.log(HELP);
    return 0;
  }

  // Subcommand help shouldn't require a token.
  if (args.includes("--help") || args.includes("-h")) {
    return runCommand(command, "", args);
  }

  const token = process.env["BILLY_TOKEN"];
  if (!token) {
    console.error("Missing BILLY_TOKEN. Copy .env.example to .env and set it.");
    return 1;
  }

  return runCommand(command, token, args);
}

function runCommand(command: string, token: string, args: string[]): Promise<number> {
  switch (command) {
    case "ping":
      return ping(token);
    case "discover":
      return discover(token);
    case "invoices:list":
      return invoicesList(token, args);
    default:
      console.error(`Unknown command: ${command}`);
      console.error(HELP);
      return Promise.resolve(1);
  }
}

main().then(
  (code) => process.exit(code),
  (err) => {
    console.error(err);
    process.exit(1);
  },
);
