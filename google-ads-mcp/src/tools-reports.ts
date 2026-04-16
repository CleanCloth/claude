import { z } from "zod";
import { server, ads, cid, ok, optCid, dateRange } from "./index.js";

// ===================== REPORTS =====================

server.tool("get_campaign_report", "Campaign performance: impressions, clicks, cost, conversions, CTR.", {
  customer_id: optCid,
  date_range: dateRange,
  campaign_status: z.enum(["ENABLED","PAUSED","REMOVED","ALL"]).default("ALL"),
}, async ({ customer_id, date_range, campaign_status }) => {
  const c = cid(customer_id);
  let q = `SELECT campaign.id, campaign.name, campaign.status, campaign.advertising_channel_type, campaign_budget.amount_micros, metrics.impressions, metrics.clicks, metrics.cost_micros, metrics.conversions, metrics.ctr, metrics.average_cpc, metrics.conversion_rate, metrics.cost_per_conversion FROM campaign WHERE segments.date DURING ${date_range}`;
  if (campaign_status !== "ALL") q += ` AND campaign.status = '${campaign_status}'`;
  q += " ORDER BY metrics.cost_micros DESC";
  return ok(await ads.search(c, q));
});

server.tool("get_ad_group_report", "Ad group performance.", {
  customer_id: optCid,
  campaign_id: z.string().optional(),
  date_range: dateRange,
}, async ({ customer_id, campaign_id, date_range }) => {
  const c = cid(customer_id);
  let q = `SELECT ad_group.id, ad_group.name, ad_group.status, campaign.name, metrics.impressions, metrics.clicks, metrics.cost_micros, metrics.conversions, metrics.ctr, metrics.average_cpc FROM ad_group WHERE segments.date DURING ${date_range}`;
  if (campaign_id) q += ` AND campaign.id = ${campaign_id}`;
  q += " ORDER BY metrics.cost_micros DESC";
  return ok(await ads.search(c, q));
});

server.tool("get_keyword_report", "Keyword performance.", {
  customer_id: optCid,
  campaign_id: z.string().optional(),
  date_range: dateRange,
  limit: z.number().int().positive().default(100),
}, async ({ customer_id, campaign_id, date_range, limit }) => {
  const c = cid(customer_id);
  let q = `SELECT ad_group_criterion.keyword.text, ad_group_criterion.keyword.match_type, ad_group_criterion.status, ad_group_criterion.quality_info.quality_score, ad_group.name, campaign.name, metrics.impressions, metrics.clicks, metrics.cost_micros, metrics.conversions, metrics.ctr, metrics.average_cpc FROM keyword_view WHERE segments.date DURING ${date_range}`;
  if (campaign_id) q += ` AND campaign.id = ${campaign_id}`;
  q += ` ORDER BY metrics.impressions DESC LIMIT ${limit}`;
  return ok(await ads.search(c, q));
});

server.tool("get_search_terms_report", "Actual search queries triggering your ads.", {
  customer_id: optCid,
  campaign_id: z.string().optional(),
  date_range: dateRange,
  limit: z.number().int().positive().default(100),
}, async ({ customer_id, campaign_id, date_range, limit }) => {
  const c = cid(customer_id);
  let q = `SELECT search_term_view.search_term, search_term_view.status, campaign.name, ad_group.name, metrics.impressions, metrics.clicks, metrics.cost_micros, metrics.conversions FROM search_term_view WHERE segments.date DURING ${date_range}`;
  if (campaign_id) q += ` AND campaign.id = ${campaign_id}`;
  q += ` ORDER BY metrics.impressions DESC LIMIT ${limit}`;
  return ok(await ads.search(c, q));
});

server.tool("get_ad_report", "Individual ad performance.", {
  customer_id: optCid,
  campaign_id: z.string().optional(),
  date_range: dateRange,
}, async ({ customer_id, campaign_id, date_range }) => {
  const c = cid(customer_id);
  let q = `SELECT ad_group_ad.ad.id, ad_group_ad.ad.type, ad_group_ad.ad.responsive_search_ad.headlines, ad_group_ad.ad.responsive_search_ad.descriptions, ad_group_ad.ad.final_urls, ad_group_ad.status, ad_group.name, campaign.name, metrics.impressions, metrics.clicks, metrics.cost_micros, metrics.conversions, metrics.ctr FROM ad_group_ad WHERE segments.date DURING ${date_range}`;
  if (campaign_id) q += ` AND campaign.id = ${campaign_id}`;
  q += " ORDER BY metrics.impressions DESC LIMIT 50";
  return ok(await ads.search(c, q));
});

server.tool("get_change_history", "Audit log of account changes.", {
  customer_id: optCid,
  date_range: z.enum(["LAST_7_DAYS","LAST_14_DAYS","LAST_30_DAYS"]).default("LAST_7_DAYS"),
  limit: z.number().int().positive().default(25),
}, async ({ customer_id, date_range, limit }) => {
  const c = cid(customer_id);
  return ok(await ads.search(c, `SELECT change_event.change_date_time, change_event.change_resource_type, change_event.change_resource_name, change_event.resource_change_operation, change_event.changed_fields, change_event.user_email FROM change_event WHERE change_event.change_date_time DURING ${date_range} ORDER BY change_event.change_date_time DESC LIMIT ${limit}`));
});

server.tool("get_geo_report", "Performance broken down by geographic location.", {
  customer_id: optCid,
  campaign_id: z.string().optional(),
  date_range: dateRange,
  limit: z.number().int().positive().default(50),
}, async ({ customer_id, campaign_id, date_range, limit }) => {
  const c = cid(customer_id);
  let q = `SELECT geographic_view.country_criterion_id, geographic_view.location_type, campaign.name, metrics.impressions, metrics.clicks, metrics.cost_micros, metrics.conversions FROM geographic_view WHERE segments.date DURING ${date_range}`;
  if (campaign_id) q += ` AND campaign.id = ${campaign_id}`;
  q += ` ORDER BY metrics.impressions DESC LIMIT ${limit}`;
  return ok(await ads.search(c, q));
});

server.tool("get_device_report", "Performance by device type.", {
  customer_id: optCid,
  campaign_id: z.string().optional(),
  date_range: dateRange,
}, async ({ customer_id, campaign_id, date_range }) => {
  const c = cid(customer_id);
  let q = `SELECT segments.device, campaign.name, metrics.impressions, metrics.clicks, metrics.cost_micros, metrics.conversions, metrics.ctr FROM campaign WHERE segments.date DURING ${date_range}`;
  if (campaign_id) q += ` AND campaign.id = ${campaign_id}`;
  return ok(await ads.search(c, q));
});

server.tool("get_age_gender_report", "Performance by age and gender demographics.", {
  customer_id: optCid,
  campaign_id: z.string().optional(),
  date_range: dateRange,
}, async ({ customer_id, campaign_id, date_range }) => {
  const c = cid(customer_id);
  let q = `SELECT ad_group_criterion.age_range.type, ad_group_criterion.gender.type, campaign.name, ad_group.name, metrics.impressions, metrics.clicks, metrics.cost_micros, metrics.conversions FROM gender_view WHERE segments.date DURING ${date_range}`;
  if (campaign_id) q += ` AND campaign.id = ${campaign_id}`;
  return ok(await ads.search(c, q));
});

server.tool("get_placement_report", "Performance by placement (Display/Video campaigns).", {
  customer_id: optCid,
  campaign_id: z.string().optional(),
  date_range: dateRange,
  limit: z.number().int().positive().default(50),
}, async ({ customer_id, campaign_id, date_range, limit }) => {
  const c = cid(customer_id);
  let q = `SELECT detail_placement_view.display_name, detail_placement_view.target_url, detail_placement_view.placement_type, campaign.name, metrics.impressions, metrics.clicks, metrics.cost_micros, metrics.conversions FROM detail_placement_view WHERE segments.date DURING ${date_range}`;
  if (campaign_id) q += ` AND campaign.id = ${campaign_id}`;
  q += ` ORDER BY metrics.impressions DESC LIMIT ${limit}`;
  return ok(await ads.search(c, q));
});
