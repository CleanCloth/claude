import { z } from "zod";
import { server, ads, cid, ok, optCid } from "./index.js";

// ===================== KEYWORDS =====================

server.tool("add_keywords", "Add keywords to an ad group.", {
  customer_id: optCid,
  ad_group_id: z.string(),
  keywords: z.array(z.object({
    text: z.string().describe("Keyword text."),
    match_type: z.enum(["EXACT", "PHRASE", "BROAD"]).default("BROAD"),
    cpc_bid_micros: z.string().optional().describe("Keyword-level CPC bid in micros."),
  })).min(1).describe("Keywords to add."),
}, async ({ customer_id, ad_group_id, keywords }) => {
  const c = cid(customer_id);
  const operations = keywords.map((kw) => ({
    create: {
      adGroup: `customers/${c}/adGroups/${ad_group_id}`,
      status: "ENABLED",
      keyword: { text: kw.text, matchType: kw.match_type },
      ...(kw.cpc_bid_micros ? { cpcBidMicros: kw.cpc_bid_micros } : {}),
    },
  }));
  return ok(await ads.mutate(c, "adGroupCriteria:mutate", { operations }));
});

server.tool("update_keyword_bid", "Update the CPC bid for a keyword.", {
  customer_id: optCid,
  ad_group_id: z.string(),
  criterion_id: z.string().describe("The keyword criterion ID."),
  cpc_bid_micros: z.string().describe("New CPC bid in micros."),
}, async ({ customer_id, ad_group_id, criterion_id, cpc_bid_micros }) => {
  const c = cid(customer_id);
  return ok(await ads.mutate(c, "adGroupCriteria:mutate", {
    operations: [{ update: { resourceName: `customers/${c}/adGroupCriteria/${ad_group_id}~${criterion_id}`, cpcBidMicros: cpc_bid_micros }, updateMask: "cpc_bid_micros" }],
  }));
});

server.tool("update_keyword_status", "Pause, enable, or remove a keyword.", {
  customer_id: optCid,
  ad_group_id: z.string(),
  criterion_id: z.string(),
  status: z.enum(["ENABLED", "PAUSED", "REMOVED"]),
}, async ({ customer_id, ad_group_id, criterion_id, status }) => {
  const c = cid(customer_id);
  return ok(await ads.mutate(c, "adGroupCriteria:mutate", {
    operations: [{ update: { resourceName: `customers/${c}/adGroupCriteria/${ad_group_id}~${criterion_id}`, status }, updateMask: "status" }],
  }));
});

server.tool("remove_keyword", "Remove a keyword.", {
  customer_id: optCid,
  ad_group_id: z.string(),
  criterion_id: z.string(),
}, async ({ customer_id, ad_group_id, criterion_id }) => {
  const c = cid(customer_id);
  return ok(await ads.mutate(c, "adGroupCriteria:mutate", {
    operations: [{ remove: `customers/${c}/adGroupCriteria/${ad_group_id}~${criterion_id}` }],
  }));
});

// ===================== NEGATIVE KEYWORDS =====================

server.tool("add_negative_keywords_to_campaign", "Add negative keywords at the campaign level.", {
  customer_id: optCid,
  campaign_id: z.string(),
  keywords: z.array(z.object({
    text: z.string(),
    match_type: z.enum(["EXACT", "PHRASE", "BROAD"]).default("BROAD"),
  })).min(1),
}, async ({ customer_id, campaign_id, keywords }) => {
  const c = cid(customer_id);
  const operations = keywords.map((kw) => ({
    create: {
      campaign: `customers/${c}/campaigns/${campaign_id}`,
      negative: true,
      keyword: { text: kw.text, matchType: kw.match_type },
    },
  }));
  return ok(await ads.mutate(c, "campaignCriteria:mutate", { operations }));
});

server.tool("add_negative_keywords_to_ad_group", "Add negative keywords at the ad group level.", {
  customer_id: optCid,
  ad_group_id: z.string(),
  keywords: z.array(z.object({
    text: z.string(),
    match_type: z.enum(["EXACT", "PHRASE", "BROAD"]).default("BROAD"),
  })).min(1),
}, async ({ customer_id, ad_group_id, keywords }) => {
  const c = cid(customer_id);
  const operations = keywords.map((kw) => ({
    create: {
      adGroup: `customers/${c}/adGroups/${ad_group_id}`,
      negative: true,
      keyword: { text: kw.text, matchType: kw.match_type },
    },
  }));
  return ok(await ads.mutate(c, "adGroupCriteria:mutate", { operations }));
});
