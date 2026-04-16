#!/usr/bin/env node

import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { server, ads, cid, ok, optCid } from "./shared.js";

// ===================== ACCOUNT =====================

server.tool("list_accessible_customers", "List all Google Ads accounts you can access.", {},
  async () => ok(await ads.listAccessibleCustomers()));

server.tool("get_account_info", "Get details about a Google Ads account (name, currency, timezone, etc.).", {
  customer_id: optCid,
}, async ({ customer_id }) => {
  const results = await ads.search(cid(customer_id), `SELECT customer.id, customer.descriptive_name, customer.currency_code, customer.time_zone, customer.manager, customer.auto_tagging_enabled, customer.tracking_url_template FROM customer LIMIT 1`);
  return ok(results);
});

server.tool("get_account_hierarchy", "Get manager → child account tree.", {
  customer_id: optCid,
}, async ({ customer_id }) => {
  const results = await ads.search(cid(customer_id), `SELECT customer_client.client_customer, customer_client.level, customer_client.manager, customer_client.descriptive_name, customer_client.currency_code, customer_client.time_zone, customer_client.id FROM customer_client ORDER BY customer_client.level ASC`);
  return ok(results);
});

// ===================== RAW GAQL =====================

server.tool("search", "Execute any GAQL query. Use for custom reporting or fetching any data.", {
  query: z.string().describe('GAQL query. Example: "SELECT campaign.id, campaign.name, metrics.clicks FROM campaign WHERE segments.date DURING LAST_30_DAYS"'),
  customer_id: optCid,
}, async ({ query, customer_id }) => ok(await ads.search(cid(customer_id), query)));

// ===================== RAW MUTATE =====================

server.tool("raw_mutate", "Execute a raw mutate call against any Google Ads API endpoint. Use this for any operation not covered by other tools.", {
  customer_id: optCid,
  endpoint: z.string().describe('API endpoint path after customers/{id}/, e.g. "campaigns:mutate", "adGroups:mutate", "assets:mutate"'),
  body: z.string().describe("JSON string of the request body including operations array."),
}, async ({ customer_id, endpoint, body }) => {
  const parsed = JSON.parse(body);
  return ok(await ads.mutate(cid(customer_id), endpoint, parsed));
});

// ===================== BUDGETS =====================

server.tool("create_budget", "Create a campaign budget.", {
  customer_id: optCid,
  name: z.string().describe("Budget name."),
  amount: z.number().positive().describe("Daily budget in account currency (e.g. 50.00 for $50)."),
  delivery_method: z.enum(["STANDARD", "ACCELERATED"]).default("STANDARD"),
  shared: z.boolean().default(false).describe("If true, budget can be shared across campaigns."),
}, async ({ customer_id, name, amount, delivery_method, shared }) => {
  const c = cid(customer_id);
  return ok(await ads.mutate(c, "campaignBudgets:mutate", {
    operations: [{ create: { name, amountMicros: String(Math.round(amount * 1_000_000)), deliveryMethod: delivery_method, explicitlyShared: shared } }],
  }));
});

server.tool("update_budget", "Update a campaign budget amount.", {
  customer_id: optCid,
  budget_id: z.string().describe("Campaign budget ID."),
  amount: z.number().positive().describe("New daily budget in account currency."),
}, async ({ customer_id, budget_id, amount }) => {
  const c = cid(customer_id);
  return ok(await ads.mutate(c, "campaignBudgets:mutate", {
    operations: [{ update: { resourceName: `customers/${c}/campaignBudgets/${budget_id}`, amountMicros: String(Math.round(amount * 1_000_000)) }, updateMask: "amount_micros" }],
  }));
});

// ===================== CAMPAIGNS =====================

server.tool("create_campaign", "Create a new campaign.", {
  customer_id: optCid,
  name: z.string(),
  budget_id: z.string().describe("Campaign budget ID to attach."),
  channel: z.enum(["SEARCH", "DISPLAY", "SHOPPING", "VIDEO", "PERFORMANCE_MAX", "LOCAL", "SMART", "DISCOVERY"]).default("SEARCH"),
  status: z.enum(["ENABLED", "PAUSED"]).default("PAUSED"),
  bidding_strategy_type: z.enum(["MANUAL_CPC", "MAXIMIZE_CLICKS", "MAXIMIZE_CONVERSIONS", "MAXIMIZE_CONVERSION_VALUE", "TARGET_CPA", "TARGET_ROAS", "TARGET_SPEND"]).default("MANUAL_CPC"),
  target_cpa_micros: z.string().optional().describe("Target CPA in micros if using TARGET_CPA."),
  target_roas: z.number().optional().describe("Target ROAS if using TARGET_ROAS (e.g. 4.0 = 400%)."),
  network_settings: z.object({
    target_google_search: z.boolean().default(true),
    target_search_network: z.boolean().default(true),
    target_content_network: z.boolean().default(false),
  }).optional(),
  start_date: z.string().optional().describe("YYYY-MM-DD"),
  end_date: z.string().optional().describe("YYYY-MM-DD"),
}, async ({ customer_id, name, budget_id, channel, status, bidding_strategy_type, target_cpa_micros, target_roas, network_settings, start_date, end_date }) => {
  const c = cid(customer_id);
  const campaign: Record<string, unknown> = {
    name, status,
    advertisingChannelType: channel,
    campaignBudget: `customers/${c}/campaignBudgets/${budget_id}`,
  };
  if (bidding_strategy_type === "MANUAL_CPC") campaign.manualCpc = { enhancedCpcEnabled: false };
  else if (bidding_strategy_type === "MAXIMIZE_CLICKS") campaign.maximizeClicks = {};
  else if (bidding_strategy_type === "MAXIMIZE_CONVERSIONS") campaign.maximizeConversions = {};
  else if (bidding_strategy_type === "MAXIMIZE_CONVERSION_VALUE") campaign.maximizeConversionValue = {};
  else if (bidding_strategy_type === "TARGET_CPA") campaign.targetCpa = { targetCpaMicros: target_cpa_micros };
  else if (bidding_strategy_type === "TARGET_ROAS") campaign.targetRoas = { targetRoas: target_roas };
  else if (bidding_strategy_type === "TARGET_SPEND") campaign.targetSpend = {};
  if (network_settings) campaign.networkSettings = { targetGoogleSearch: network_settings.target_google_search, targetSearchNetwork: network_settings.target_search_network, targetContentNetwork: network_settings.target_content_network };
  if (start_date) campaign.startDate = start_date.replace(/-/g, "");
  if (end_date) campaign.endDate = end_date.replace(/-/g, "");
  return ok(await ads.mutate(c, "campaigns:mutate", { operations: [{ create: campaign }] }));
});

server.tool("update_campaign_status", "Pause, enable, or remove a campaign.", {
  customer_id: optCid,
  campaign_id: z.string(),
  status: z.enum(["ENABLED", "PAUSED", "REMOVED"]),
}, async ({ customer_id, campaign_id, status }) => {
  const c = cid(customer_id);
  return ok(await ads.mutate(c, "campaigns:mutate", {
    operations: [{ update: { resourceName: `customers/${c}/campaigns/${campaign_id}`, status }, updateMask: "status" }],
  }));
});

server.tool("update_campaign", "Update campaign fields (name, bidding, dates, network settings).", {
  customer_id: optCid,
  campaign_id: z.string(),
  fields: z.string().describe('JSON of fields to update, e.g. {"name":"New Name","status":"PAUSED"}'),
  update_mask: z.string().describe('Comma-separated field mask, e.g. "name,status"'),
}, async ({ customer_id, campaign_id, fields, update_mask }) => {
  const c = cid(customer_id);
  const parsed = JSON.parse(fields);
  parsed.resourceName = `customers/${c}/campaigns/${campaign_id}`;
  return ok(await ads.mutate(c, "campaigns:mutate", {
    operations: [{ update: parsed, updateMask: update_mask }],
  }));
});

server.tool("remove_campaign", "Permanently remove a campaign.", {
  customer_id: optCid,
  campaign_id: z.string(),
}, async ({ customer_id, campaign_id }) => {
  const c = cid(customer_id);
  return ok(await ads.mutate(c, "campaigns:mutate", {
    operations: [{ remove: `customers/${c}/campaigns/${campaign_id}` }],
  }));
});

// ── Load all tool modules ──────────────────────────────────────────────────
import "./tools-adgroups.js";
import "./tools-ads.js";
import "./tools-keywords.js";
import "./tools-extensions.js";
import "./tools-targeting.js";
import "./tools-conversions.js";
import "./tools-reports.js";

// ── Start server ───────────────────────────────────────────────────────────
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Google Ads MCP server v2.0.0 running on stdio");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
