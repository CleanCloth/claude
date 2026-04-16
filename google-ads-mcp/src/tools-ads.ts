import { z } from "zod";
import { server, ads, cid, ok, optCid } from "./index.js";

// ===================== ADS =====================

server.tool("create_responsive_search_ad", "Create a responsive search ad in an ad group.", {
  customer_id: optCid,
  ad_group_id: z.string(),
  headlines: z.array(z.string()).min(3).max(15).describe("3-15 headline texts (max 30 chars each)."),
  descriptions: z.array(z.string()).min(2).max(4).describe("2-4 description texts (max 90 chars each)."),
  final_urls: z.array(z.string()).min(1).describe("Landing page URLs."),
  path1: z.string().optional().describe("Display path 1 (max 15 chars)."),
  path2: z.string().optional().describe("Display path 2 (max 15 chars)."),
  status: z.enum(["ENABLED", "PAUSED"]).default("ENABLED"),
}, async ({ customer_id, ad_group_id, headlines, descriptions, final_urls, path1, path2, status }) => {
  const c = cid(customer_id);
  const ad: Record<string, unknown> = {
    responsiveSearchAd: {
      headlines: headlines.map((text) => ({ text })),
      descriptions: descriptions.map((text) => ({ text })),
      ...(path1 ? { path1 } : {}),
      ...(path2 ? { path2 } : {}),
    },
    finalUrls: final_urls,
  };
  return ok(await ads.mutate(c, "adGroupAds:mutate", {
    operations: [{ create: { adGroup: `customers/${c}/adGroups/${ad_group_id}`, status, ad } }],
  }));
});

server.tool("update_ad_status", "Pause, enable, or remove an ad.", {
  customer_id: optCid,
  ad_group_id: z.string(),
  ad_id: z.string(),
  status: z.enum(["ENABLED", "PAUSED", "REMOVED"]),
}, async ({ customer_id, ad_group_id, ad_id, status }) => {
  const c = cid(customer_id);
  return ok(await ads.mutate(c, "adGroupAds:mutate", {
    operations: [{ update: { resourceName: `customers/${c}/adGroupAds/${ad_group_id}~${ad_id}`, status }, updateMask: "status" }],
  }));
});

server.tool("remove_ad", "Remove an ad.", {
  customer_id: optCid,
  ad_group_id: z.string(),
  ad_id: z.string(),
}, async ({ customer_id, ad_group_id, ad_id }) => {
  const c = cid(customer_id);
  return ok(await ads.mutate(c, "adGroupAds:mutate", {
    operations: [{ remove: `customers/${c}/adGroupAds/${ad_group_id}~${ad_id}` }],
  }));
});
