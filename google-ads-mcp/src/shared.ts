import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { loadCredentials } from "./auth.js";
import { createGoogleAdsClient } from "./google-ads-client.js";

export const creds = loadCredentials();
export const ads = createGoogleAdsClient(creds);
const defaultCustomerId = creds.customerId;

export function cid(provided?: string): string {
  const id = provided ?? defaultCustomerId;
  if (!id) throw new Error("customer_id required. Pass it or set GOOGLE_ADS_CUSTOMER_ID.");
  return id.replace(/-/g, "");
}

export function ok(data: unknown) {
  return { content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }] };
}

export const server = new McpServer({ name: "google-ads-mcp", version: "2.0.0" });

export const optCid = z.string().optional().describe("Google Ads customer ID (10 digits, no hyphens).");
export const dateRange = z.enum(["TODAY","YESTERDAY","LAST_7_DAYS","LAST_30_DAYS","THIS_MONTH","LAST_MONTH","LAST_90_DAYS"]).default("LAST_30_DAYS");
