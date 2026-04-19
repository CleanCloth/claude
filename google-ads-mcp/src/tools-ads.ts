import { z } from "zod";
import { server, ads, cid, ok, optCid } from "./shared.js";

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

server.tool("update_rsa", "Replace the active responsive search ad in an ad group: create a new RSA, then pause the existing active RSA(s) as a backup.", {
  customer_id: optCid,
  ad_group_id: z.string(),
  headlines: z.array(z.string()).min(3).max(15).describe("3-15 headlines (max 30 chars each)."),
  descriptions: z.array(z.string()).min(2).max(4).describe("2-4 descriptions (max 90 chars each)."),
  final_url: z.string().url().optional().describe("Landing page URL. If omitted, inherits from the existing active RSA."),
}, async ({ customer_id, ad_group_id, headlines, descriptions, final_url }) => {
  const c = cid(customer_id);

  const badHeadlines = headlines.filter((h) => h.length > 30);
  if (badHeadlines.length) throw new Error(`Headlines exceed 30 chars: ${JSON.stringify(badHeadlines)}`);
  const badDescs = descriptions.filter((d) => d.length > 90);
  if (badDescs.length) throw new Error(`Descriptions exceed 90 chars: ${JSON.stringify(badDescs)}`);

  const existing = (await ads.search(c, `SELECT ad_group_ad.resource_name, ad_group_ad.status, ad_group_ad.ad.final_urls FROM ad_group_ad WHERE ad_group.id = ${ad_group_id} AND ad_group_ad.ad.type = RESPONSIVE_SEARCH_AD AND ad_group_ad.status != REMOVED`)) as Array<{ adGroupAd: { resourceName: string; status: string; ad: { finalUrls?: string[] } } }>;
  const enabled = existing.filter((r) => r.adGroupAd.status === "ENABLED");

  const finalUrls = final_url
    ? [final_url]
    : enabled[0]?.adGroupAd.ad.finalUrls ?? existing[0]?.adGroupAd.ad.finalUrls;
  if (!finalUrls || finalUrls.length === 0) throw new Error("final_url is required (no existing RSA to inherit from).");

  const createResp = (await ads.mutate(c, "adGroupAds:mutate", {
    operations: [{
      create: {
        adGroup: `customers/${c}/adGroups/${ad_group_id}`,
        status: "ENABLED",
        ad: {
          responsiveSearchAd: {
            headlines: headlines.map((text) => ({ text })),
            descriptions: descriptions.map((text) => ({ text })),
          },
          finalUrls,
        },
      },
    }],
  })) as { results?: Array<{ resourceName: string }> };

  const newResourceName = createResp.results?.[0]?.resourceName;
  if (!newResourceName) throw new Error(`Create RSA returned no resource name: ${JSON.stringify(createResp)}`);

  let pauseResp: unknown = null;
  if (enabled.length > 0) {
    pauseResp = await ads.mutate(c, "adGroupAds:mutate", {
      operations: enabled.map((r) => ({
        update: { resourceName: r.adGroupAd.resourceName, status: "PAUSED" },
        updateMask: "status",
      })),
    });
  }

  return ok({
    confirmed: true,
    new_resource_name: newResourceName,
    paused_backups: enabled.map((r) => r.adGroupAd.resourceName),
    create_response: createResp,
    pause_response: pauseResp,
  });
});
