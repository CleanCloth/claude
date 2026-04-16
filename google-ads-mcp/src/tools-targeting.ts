import { z } from "zod";
import { server, ads, cid, ok, optCid } from "./index.js";

// ===================== LOCATION TARGETING =====================

server.tool("set_campaign_location_targets", "Add location targets to a campaign (countries, regions, cities).", {
  customer_id: optCid,
  campaign_id: z.string(),
  location_ids: z.array(z.string()).min(1).describe("Geo target constant IDs. US=2840, UK=2826, Canada=2124, etc. Use search to find IDs."),
  negative: z.boolean().default(false).describe("Set true to exclude these locations."),
}, async ({ customer_id, campaign_id, location_ids, negative }) => {
  const c = cid(customer_id);
  const operations = location_ids.map((locId) => ({
    create: {
      campaign: `customers/${c}/campaigns/${campaign_id}`,
      negative,
      location: { geoTargetConstant: `geoTargetConstants/${locId}` },
    },
  }));
  return ok(await ads.mutate(c, "campaignCriteria:mutate", { operations }));
});

// ===================== LANGUAGE TARGETING =====================

server.tool("set_campaign_language_targets", "Set language targets for a campaign.", {
  customer_id: optCid,
  campaign_id: z.string(),
  language_ids: z.array(z.string()).min(1).describe("Language constant IDs. English=1000, Spanish=1003, French=1002, etc."),
}, async ({ customer_id, campaign_id, language_ids }) => {
  const c = cid(customer_id);
  const operations = language_ids.map((langId) => ({
    create: {
      campaign: `customers/${c}/campaigns/${campaign_id}`,
      language: { languageConstant: `languageConstants/${langId}` },
    },
  }));
  return ok(await ads.mutate(c, "campaignCriteria:mutate", { operations }));
});

// ===================== AUDIENCE TARGETING =====================

server.tool("add_audience_to_campaign", "Add an audience segment to a campaign for targeting or observation.", {
  customer_id: optCid,
  campaign_id: z.string(),
  audience_id: z.string().describe("User list or audience segment ID."),
  bid_modifier: z.number().optional().describe("Bid modifier (e.g. 1.2 = +20%)."),
}, async ({ customer_id, campaign_id, audience_id, bid_modifier }) => {
  const c = cid(customer_id);
  const criterion: Record<string, unknown> = {
    campaign: `customers/${c}/campaigns/${campaign_id}`,
    userList: { userList: `customers/${c}/userLists/${audience_id}` },
  };
  if (bid_modifier) criterion.bidModifier = bid_modifier;
  return ok(await ads.mutate(c, "campaignCriteria:mutate", { operations: [{ create: criterion }] }));
});

server.tool("add_audience_to_ad_group", "Add an audience to an ad group.", {
  customer_id: optCid,
  ad_group_id: z.string(),
  audience_id: z.string(),
  bid_modifier: z.number().optional(),
}, async ({ customer_id, ad_group_id, audience_id, bid_modifier }) => {
  const c = cid(customer_id);
  const criterion: Record<string, unknown> = {
    adGroup: `customers/${c}/adGroups/${ad_group_id}`,
    userList: { userList: `customers/${c}/userLists/${audience_id}` },
  };
  if (bid_modifier) criterion.bidModifier = bid_modifier;
  return ok(await ads.mutate(c, "adGroupCriteria:mutate", { operations: [{ create: criterion }] }));
});

// ===================== AD SCHEDULE =====================

server.tool("set_ad_schedule", "Set ad scheduling (day/time targeting) for a campaign.", {
  customer_id: optCid,
  campaign_id: z.string(),
  schedules: z.array(z.object({
    day: z.enum(["MONDAY","TUESDAY","WEDNESDAY","THURSDAY","FRIDAY","SATURDAY","SUNDAY"]),
    start_hour: z.number().int().min(0).max(23),
    start_minute: z.enum(["ZERO","FIFTEEN","THIRTY","FORTY_FIVE"]).default("ZERO"),
    end_hour: z.number().int().min(0).max(24),
    end_minute: z.enum(["ZERO","FIFTEEN","THIRTY","FORTY_FIVE"]).default("ZERO"),
    bid_modifier: z.number().optional(),
  })).min(1),
}, async ({ customer_id, campaign_id, schedules }) => {
  const c = cid(customer_id);
  const operations = schedules.map((s) => ({
    create: {
      campaign: `customers/${c}/campaigns/${campaign_id}`,
      adSchedule: {
        dayOfWeek: s.day,
        startHour: s.start_hour, startMinute: s.start_minute,
        endHour: s.end_hour, endMinute: s.end_minute,
      },
      ...(s.bid_modifier ? { bidModifier: s.bid_modifier } : {}),
    },
  }));
  return ok(await ads.mutate(c, "campaignCriteria:mutate", { operations }));
});

// ===================== DEVICE BID ADJUSTMENTS =====================

server.tool("set_device_bid_adjustment", "Set a bid adjustment for a device type on a campaign.", {
  customer_id: optCid,
  campaign_id: z.string(),
  device: z.enum(["MOBILE", "DESKTOP", "TABLET"]),
  bid_modifier: z.number().describe("Bid modifier. 1.0 = no change, 1.3 = +30%, 0 = exclude device."),
}, async ({ customer_id, campaign_id, device, bid_modifier }) => {
  const c = cid(customer_id);
  return ok(await ads.mutate(c, "campaignCriteria:mutate", {
    operations: [{
      create: {
        campaign: `customers/${c}/campaigns/${campaign_id}`,
        device: { type: device },
        bidModifier: bid_modifier,
      },
    }],
  }));
});
