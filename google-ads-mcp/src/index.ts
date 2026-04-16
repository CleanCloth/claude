#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { loadCredentials } from "./auth.js";
import { createGoogleAdsClient } from "./google-ads-client.js";

const creds = loadCredentials();
const ads = createGoogleAdsClient(creds);
const defaultCustomerId = creds.customerId;

function requireCustomerId(provided?: string): string {
  const id = provided ?? defaultCustomerId;
  if (!id) {
    throw new Error(
      "customer_id is required. Pass it as a parameter or set GOOGLE_ADS_CUSTOMER_ID."
    );
  }
  return id.replace(/-/g, "");
}

// ---------------------------------------------------------------------------
// MCP Server
// ---------------------------------------------------------------------------

const server = new McpServer({
  name: "google-ads-mcp",
  version: "1.0.0",
});

// ── List accessible customers ──────────────────────────────────────────────

server.tool(
  "list_accessible_customers",
  "List all Google Ads customer accounts accessible with the current credentials.",
  {},
  async () => {
    const customers = await ads.listAccessibleCustomers();
    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify(customers, null, 2),
        },
      ],
    };
  }
);

// ── GAQL Search ────────────────────────────────────────────────────────────

server.tool(
  "search",
  "Execute a Google Ads Query Language (GAQL) query. Use this for reporting, fetching campaigns, ad groups, ads, keywords, metrics, etc.",
  {
    query: z
      .string()
      .describe(
        'GAQL query string. Example: "SELECT campaign.id, campaign.name, metrics.impressions FROM campaign WHERE segments.date DURING LAST_30_DAYS"'
      ),
    customer_id: z
      .string()
      .optional()
      .describe("Google Ads customer ID (10 digits, no hyphens). Defaults to GOOGLE_ADS_CUSTOMER_ID env var."),
  },
  async ({ query, customer_id }) => {
    const cid = requireCustomerId(customer_id);
    const results = await ads.search(cid, query);
    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify(results, null, 2),
        },
      ],
    };
  }
);

// ── Get campaign performance report ────────────────────────────────────────

server.tool(
  "get_campaign_report",
  "Get a performance report for campaigns including impressions, clicks, cost, conversions, and CTR.",
  {
    customer_id: z.string().optional().describe("Google Ads customer ID."),
    date_range: z
      .enum([
        "TODAY",
        "YESTERDAY",
        "LAST_7_DAYS",
        "LAST_30_DAYS",
        "THIS_MONTH",
        "LAST_MONTH",
        "LAST_90_DAYS",
      ])
      .default("LAST_30_DAYS")
      .describe("Date range for the report."),
    campaign_status: z
      .enum(["ENABLED", "PAUSED", "REMOVED", "ALL"])
      .default("ALL")
      .describe("Filter by campaign status."),
  },
  async ({ customer_id, date_range, campaign_status }) => {
    const cid = requireCustomerId(customer_id);
    let query = `
      SELECT
        campaign.id,
        campaign.name,
        campaign.status,
        campaign.advertising_channel_type,
        campaign_budget.amount_micros,
        metrics.impressions,
        metrics.clicks,
        metrics.cost_micros,
        metrics.conversions,
        metrics.ctr,
        metrics.average_cpc
      FROM campaign
      WHERE segments.date DURING ${date_range}
    `;
    if (campaign_status !== "ALL") {
      query += ` AND campaign.status = '${campaign_status}'`;
    }
    query += " ORDER BY metrics.cost_micros DESC";
    const results = await ads.search(cid, query);
    return {
      content: [{ type: "text" as const, text: JSON.stringify(results, null, 2) }],
    };
  }
);

// ── Get ad group performance ───────────────────────────────────────────────

server.tool(
  "get_ad_group_report",
  "Get performance metrics broken down by ad group.",
  {
    customer_id: z.string().optional(),
    campaign_id: z.string().optional().describe("Filter to a specific campaign ID."),
    date_range: z
      .enum(["TODAY", "YESTERDAY", "LAST_7_DAYS", "LAST_30_DAYS", "THIS_MONTH", "LAST_MONTH"])
      .default("LAST_30_DAYS"),
  },
  async ({ customer_id, campaign_id, date_range }) => {
    const cid = requireCustomerId(customer_id);
    let query = `
      SELECT
        ad_group.id,
        ad_group.name,
        ad_group.status,
        campaign.name,
        metrics.impressions,
        metrics.clicks,
        metrics.cost_micros,
        metrics.conversions,
        metrics.ctr
      FROM ad_group
      WHERE segments.date DURING ${date_range}
    `;
    if (campaign_id) {
      query += ` AND campaign.id = ${campaign_id}`;
    }
    query += " ORDER BY metrics.cost_micros DESC";
    const results = await ads.search(cid, query);
    return {
      content: [{ type: "text" as const, text: JSON.stringify(results, null, 2) }],
    };
  }
);

// ── Get keyword performance ────────────────────────────────────────────────

server.tool(
  "get_keyword_report",
  "Get performance metrics for keywords (ad group criteria).",
  {
    customer_id: z.string().optional(),
    campaign_id: z.string().optional(),
    date_range: z
      .enum(["TODAY", "YESTERDAY", "LAST_7_DAYS", "LAST_30_DAYS", "THIS_MONTH", "LAST_MONTH"])
      .default("LAST_30_DAYS"),
  },
  async ({ customer_id, campaign_id, date_range }) => {
    const cid = requireCustomerId(customer_id);
    let query = `
      SELECT
        ad_group_criterion.keyword.text,
        ad_group_criterion.keyword.match_type,
        ad_group_criterion.status,
        ad_group.name,
        campaign.name,
        metrics.impressions,
        metrics.clicks,
        metrics.cost_micros,
        metrics.conversions,
        metrics.ctr,
        metrics.average_cpc
      FROM keyword_view
      WHERE segments.date DURING ${date_range}
    `;
    if (campaign_id) {
      query += ` AND campaign.id = ${campaign_id}`;
    }
    query += " ORDER BY metrics.impressions DESC LIMIT 100";
    const results = await ads.search(cid, query);
    return {
      content: [{ type: "text" as const, text: JSON.stringify(results, null, 2) }],
    };
  }
);

// ── Get search terms report ────────────────────────────────────────────────

server.tool(
  "get_search_terms_report",
  "See which actual search queries triggered your ads.",
  {
    customer_id: z.string().optional(),
    campaign_id: z.string().optional(),
    date_range: z
      .enum(["TODAY", "YESTERDAY", "LAST_7_DAYS", "LAST_30_DAYS", "THIS_MONTH", "LAST_MONTH"])
      .default("LAST_30_DAYS"),
  },
  async ({ customer_id, campaign_id, date_range }) => {
    const cid = requireCustomerId(customer_id);
    let query = `
      SELECT
        search_term_view.search_term,
        search_term_view.status,
        campaign.name,
        ad_group.name,
        metrics.impressions,
        metrics.clicks,
        metrics.cost_micros,
        metrics.conversions
      FROM search_term_view
      WHERE segments.date DURING ${date_range}
    `;
    if (campaign_id) {
      query += ` AND campaign.id = ${campaign_id}`;
    }
    query += " ORDER BY metrics.impressions DESC LIMIT 100";
    const results = await ads.search(cid, query);
    return {
      content: [{ type: "text" as const, text: JSON.stringify(results, null, 2) }],
    };
  }
);

// ── Pause / Enable campaign ────────────────────────────────────────────────

server.tool(
  "update_campaign_status",
  "Pause or enable a campaign.",
  {
    customer_id: z.string().optional(),
    campaign_id: z.string().describe("The campaign ID to update."),
    status: z.enum(["ENABLED", "PAUSED"]).describe("New status for the campaign."),
  },
  async ({ customer_id, campaign_id, status }) => {
    const cid = requireCustomerId(customer_id);
    const result = await ads.mutateCampaigns(cid, [
      {
        update: {
          resourceName: `customers/${cid}/campaigns/${campaign_id}`,
          status,
        },
        updateMask: "status",
      },
    ]);
    return {
      content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }],
    };
  }
);

// ── Update campaign budget ─────────────────────────────────────────────────

server.tool(
  "update_campaign_budget",
  "Update the daily budget for a campaign budget resource.",
  {
    customer_id: z.string().optional(),
    budget_id: z.string().describe("The campaign budget ID to update."),
    daily_budget: z
      .number()
      .positive()
      .describe("New daily budget in account currency (e.g. 50.00 for $50)."),
  },
  async ({ customer_id, budget_id, daily_budget }) => {
    const cid = requireCustomerId(customer_id);
    const amountMicros = Math.round(daily_budget * 1_000_000).toString();
    const token = await (async () => {
      const { getAccessToken } = await import("./auth.js");
      return getAccessToken(creds);
    })();
    const url = `https://googleads.googleapis.com/v19/customers/${cid}/campaignBudgets:mutate`;
    const resp = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "developer-token": creds.developerToken,
        "Content-Type": "application/json",
        ...(creds.loginCustomerId ? { "login-customer-id": creds.loginCustomerId } : {}),
      },
      body: JSON.stringify({
        operations: [
          {
            update: {
              resourceName: `customers/${cid}/campaignBudgets/${budget_id}`,
              amountMicros,
            },
            updateMask: "amount_micros",
          },
        ],
      }),
    });
    if (!resp.ok) {
      const body = await resp.text();
      throw new Error(`updateCampaignBudget failed (${resp.status}): ${body}`);
    }
    const result = await resp.json();
    return {
      content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }],
    };
  }
);

// ── Get account hierarchy ──────────────────────────────────────────────────

server.tool(
  "get_account_hierarchy",
  "Get the account hierarchy (manager → child accounts) for a manager account.",
  {
    customer_id: z.string().optional().describe("Manager account customer ID."),
  },
  async ({ customer_id }) => {
    const cid = requireCustomerId(customer_id);
    const query = `
      SELECT
        customer_client.client_customer,
        customer_client.level,
        customer_client.manager,
        customer_client.descriptive_name,
        customer_client.currency_code,
        customer_client.time_zone,
        customer_client.id
      FROM customer_client
      ORDER BY customer_client.level ASC
    `;
    const results = await ads.search(cid, query);
    return {
      content: [{ type: "text" as const, text: JSON.stringify(results, null, 2) }],
    };
  }
);

// ── Get ad performance ─────────────────────────────────────────────────────

server.tool(
  "get_ad_report",
  "Get performance metrics at the individual ad level.",
  {
    customer_id: z.string().optional(),
    campaign_id: z.string().optional(),
    date_range: z
      .enum(["TODAY", "YESTERDAY", "LAST_7_DAYS", "LAST_30_DAYS", "THIS_MONTH", "LAST_MONTH"])
      .default("LAST_30_DAYS"),
  },
  async ({ customer_id, campaign_id, date_range }) => {
    const cid = requireCustomerId(customer_id);
    let query = `
      SELECT
        ad_group_ad.ad.id,
        ad_group_ad.ad.type,
        ad_group_ad.ad.responsive_search_ad.headlines,
        ad_group_ad.ad.responsive_search_ad.descriptions,
        ad_group_ad.status,
        ad_group.name,
        campaign.name,
        metrics.impressions,
        metrics.clicks,
        metrics.cost_micros,
        metrics.conversions,
        metrics.ctr
      FROM ad_group_ad
      WHERE segments.date DURING ${date_range}
    `;
    if (campaign_id) {
      query += ` AND campaign.id = ${campaign_id}`;
    }
    query += " ORDER BY metrics.impressions DESC LIMIT 50";
    const results = await ads.search(cid, query);
    return {
      content: [{ type: "text" as const, text: JSON.stringify(results, null, 2) }],
    };
  }
);

// ── Get change history ─────────────────────────────────────────────────────

server.tool(
  "get_change_history",
  "View recent changes made to the account (audit log).",
  {
    customer_id: z.string().optional(),
    date_range: z
      .enum(["LAST_7_DAYS", "LAST_14_DAYS", "LAST_30_DAYS"])
      .default("LAST_7_DAYS"),
    limit: z.number().int().positive().default(25),
  },
  async ({ customer_id, date_range, limit }) => {
    const cid = requireCustomerId(customer_id);
    const query = `
      SELECT
        change_event.change_date_time,
        change_event.change_resource_type,
        change_event.change_resource_name,
        change_event.resource_change_operation,
        change_event.changed_fields,
        change_event.user_email
      FROM change_event
      WHERE change_event.change_date_time DURING ${date_range}
      ORDER BY change_event.change_date_time DESC
      LIMIT ${limit}
    `;
    const results = await ads.search(cid, query);
    return {
      content: [{ type: "text" as const, text: JSON.stringify(results, null, 2) }],
    };
  }
);

// ---------------------------------------------------------------------------
// Start server
// ---------------------------------------------------------------------------

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Google Ads MCP server running on stdio");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
