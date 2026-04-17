#!/usr/bin/env node
import "dotenv/config";
import { ping } from "./commands/ping.js";

const HELP = `billy — CleanCloth accounting automation

Usage:
  pnpm billy <command> [options]

Commands:
  ping              Verify the API token by fetching the organization.
  help              Show this message.

Environment:
  BILLY_TOKEN       Required. Billy access token for CleanCloth.
`;

async function main(): Promise<number> {
  const command = process.argv[2] ?? "help";

  if (command === "help" || command === "--help" || command === "-h") {
    console.log(HELP);
    return 0;
  }

  const token = process.env["BILLY_TOKEN"];
  if (!token) {
    console.error("Missing BILLY_TOKEN. Copy .env.example to .env and set it.");
    return 1;
  }

  switch (command) {
    case "ping":
      return ping(token);
    default:
      console.error(`Unknown command: ${command}`);
      console.error(HELP);
      return 1;
  }
}

main().then(
  (code) => process.exit(code),
  (err) => {
    console.error(err);
    process.exit(1);
  },
);
