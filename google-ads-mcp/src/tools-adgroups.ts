import { z } from "zod";
import { server, ads, cid, ok, optCid } from "./index.js";

// ===================== AD GROUPS =====================

server.tool("create_ad_group", "Create an ad group inside a campaign.", {
  customer_id: optCid,
  campaign_id: z.string(),
  name: z.string(),
  status: z.enum(["ENABLED", "PAUSED"]).default("ENABLED"),
  type: z.enum(["SEARCH_STANDARD", "DISPLAY_STANDARD", "SHOPPING_PRODUCT_ADS", "VIDEO_BUMPER", "VIDEO_TRUE_VIEW_IN_STREAM", "SMART_CAMPAIGN_ADS"]).default("SEARCH_STANDARD"),
  cpc_bid_micros: z.string().optional().describe("Default CPC bid in micros (e.g. '2000000' = $2.00)."),
}, async ({ customer_id, campaign_id, name, status, type, cpc_bid_micros }) => {
  const c = cid(customer_id);
  const adGroup: Record<string, unknown> = {
    name, status, type,
    campaign: `customers/${c}/campaigns/${campaign_id}`,
  };
  if (cpc_bid_micros) adGroup.cpcBidMicros = cpc_bid_micros;
  return ok(await ads.mutate(c, "adGroups:mutate", { operations: [{ create: adGroup }] }));
});

server.tool("update_ad_group", "Update ad group fields.", {
  customer_id: optCid,
  ad_group_id: z.string(),
  fields: z.string().describe('JSON of fields to update, e.g. {"name":"New Name","cpcBidMicros":"3000000"}'),
  update_mask: z.string().describe('Comma-separated field mask, e.g. "name,cpc_bid_micros"'),
}, async ({ customer_id, ad_group_id, fields, update_mask }) => {
  const c = cid(customer_id);
  const parsed = JSON.parse(fields);
  parsed.resourceName = `customers/${c}/adGroups/${ad_group_id}`;
  return ok(await ads.mutate(c, "adGroups:mutate", { operations: [{ update: parsed, updateMask: update_mask }] }));
});

server.tool("update_ad_group_status", "Pause, enable, or remove an ad group.", {
  customer_id: optCid,
  ad_group_id: z.string(),
  status: z.enum(["ENABLED", "PAUSED", "REMOVED"]),
}, async ({ customer_id, ad_group_id, status }) => {
  const c = cid(customer_id);
  return ok(await ads.mutate(c, "adGroups:mutate", {
    operations: [{ update: { resourceName: `customers/${c}/adGroups/${ad_group_id}`, status }, updateMask: "status" }],
  }));
});

server.tool("remove_ad_group", "Remove an ad group.", {
  customer_id: optCid,
  ad_group_id: z.string(),
}, async ({ customer_id, ad_group_id }) => {
  const c = cid(customer_id);
  return ok(await ads.mutate(c, "adGroups:mutate", { operations: [{ remove: `customers/${c}/adGroups/${ad_group_id}` }] }));
});
