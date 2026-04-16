import { z } from "zod";
import { server, ads, cid, ok, optCid } from "./index.js";

// ===================== SITELINK EXTENSIONS =====================

server.tool("create_sitelink", "Create a sitelink asset.", {
  customer_id: optCid,
  link_text: z.string().max(25).describe("Sitelink text."),
  final_urls: z.array(z.string()).min(1),
  description1: z.string().max(35).optional(),
  description2: z.string().max(35).optional(),
}, async ({ customer_id, link_text, final_urls, description1, description2 }) => {
  const c = cid(customer_id);
  return ok(await ads.mutate(c, "assets:mutate", {
    operations: [{
      create: {
        type: "SITELINK",
        sitelinkAsset: {
          linkText: link_text,
          ...(description1 ? { description1 } : {}),
          ...(description2 ? { description2 } : {}),
        },
        finalUrls: final_urls,
      },
    }],
  }));
});

// ===================== CALLOUT EXTENSIONS =====================

server.tool("create_callout", "Create a callout asset.", {
  customer_id: optCid,
  callout_text: z.string().max(25).describe("Callout text."),
}, async ({ customer_id, callout_text }) => {
  const c = cid(customer_id);
  return ok(await ads.mutate(c, "assets:mutate", {
    operations: [{ create: { type: "CALLOUT", calloutAsset: { calloutText: callout_text } } }],
  }));
});

// ===================== CALL EXTENSIONS =====================

server.tool("create_call_asset", "Create a call (phone number) asset.", {
  customer_id: optCid,
  country_code: z.string().length(2).describe("Two-letter country code (e.g. US)."),
  phone_number: z.string().describe("Phone number."),
}, async ({ customer_id, country_code, phone_number }) => {
  const c = cid(customer_id);
  return ok(await ads.mutate(c, "assets:mutate", {
    operations: [{ create: { type: "CALL", callAsset: { countryCode: country_code, phoneNumber: phone_number } } }],
  }));
});

// ===================== STRUCTURED SNIPPET =====================

server.tool("create_structured_snippet", "Create a structured snippet asset.", {
  customer_id: optCid,
  header: z.enum(["Amenities","Brands","Courses","Degree programs","Destinations","Featured hotels","Insurance coverage","Models","Neighborhoods","Service catalog","Shows","Styles","Types"]),
  values: z.array(z.string()).min(3).describe("At least 3 values for the snippet."),
}, async ({ customer_id, header, values }) => {
  const c = cid(customer_id);
  return ok(await ads.mutate(c, "assets:mutate", {
    operations: [{ create: { type: "STRUCTURED_SNIPPET", structuredSnippetAsset: { header, values } } }],
  }));
});

// ===================== LINK ASSETS TO CAMPAIGN/AD GROUP =====================

server.tool("link_asset_to_campaign", "Link an asset (sitelink, callout, call, etc.) to a campaign.", {
  customer_id: optCid,
  campaign_id: z.string(),
  asset_id: z.string().describe("Asset resource ID."),
  field_type: z.enum(["SITELINK", "CALLOUT", "CALL", "STRUCTURED_SNIPPET", "PROMOTION", "PRICE", "IMAGE"]),
}, async ({ customer_id, campaign_id, asset_id, field_type }) => {
  const c = cid(customer_id);
  return ok(await ads.mutate(c, "campaignAssets:mutate", {
    operations: [{ create: { campaign: `customers/${c}/campaigns/${campaign_id}`, asset: `customers/${c}/assets/${asset_id}`, fieldType: field_type } }],
  }));
});

server.tool("link_asset_to_ad_group", "Link an asset to an ad group.", {
  customer_id: optCid,
  ad_group_id: z.string(),
  asset_id: z.string(),
  field_type: z.enum(["SITELINK", "CALLOUT", "CALL", "STRUCTURED_SNIPPET", "PROMOTION", "PRICE", "IMAGE"]),
}, async ({ customer_id, ad_group_id, asset_id, field_type }) => {
  const c = cid(customer_id);
  return ok(await ads.mutate(c, "adGroupAssets:mutate", {
    operations: [{ create: { adGroup: `customers/${c}/adGroups/${ad_group_id}`, asset: `customers/${c}/assets/${asset_id}`, fieldType: field_type } }],
  }));
});
