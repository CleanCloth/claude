import { z } from "zod";
import { server, ads, cid, ok, optCid } from "./shared.js";

// ===================== CONVERSION ACTIONS =====================

server.tool("create_conversion_action", "Create a conversion tracking action.", {
  customer_id: optCid,
  name: z.string(),
  category: z.enum(["DEFAULT","PAGE_VIEW","PURCHASE","SIGNUP","LEAD","DOWNLOAD","ADD_TO_CART","BEGIN_CHECKOUT","SUBSCRIBE_PAID","PHONE_CALL_LEAD","IMPORTED_LEAD","SUBMIT_LEAD_FORM","BOOK_APPOINTMENT","REQUEST_QUOTE","GET_DIRECTIONS","OUTBOUND_CLICK","CONTACT","ENGAGEMENT","STORE_VISIT","STORE_SALE"]).default("DEFAULT"),
  type: z.enum(["WEBPAGE","UPLOAD_CLICKS","UPLOAD_CALLS","IMPORT"]).default("WEBPAGE"),
  value: z.number().optional().describe("Default conversion value."),
  always_use_default_value: z.boolean().default(false),
  counting_type: z.enum(["ONE_PER_CLICK","MANY_PER_CLICK"]).default("ONE_PER_CLICK"),
}, async ({ customer_id, name, category, type, value, always_use_default_value, counting_type }) => {
  const c = cid(customer_id);
  const action: Record<string, unknown> = {
    name, category, type, countingType: counting_type,
    status: "ENABLED",
  };
  if (value !== undefined) {
    action.valueSettings = {
      defaultValue: value,
      alwaysUseDefaultValue: always_use_default_value,
    };
  }
  return ok(await ads.mutate(c, "conversionActions:mutate", { operations: [{ create: action }] }));
});

server.tool("list_conversion_actions", "List all conversion actions.", {
  customer_id: optCid,
}, async ({ customer_id }) => {
  const c = cid(customer_id);
  return ok(await ads.search(c, `SELECT conversion_action.id, conversion_action.name, conversion_action.status, conversion_action.type, conversion_action.category, conversion_action.tag_snippets FROM conversion_action ORDER BY conversion_action.name`));
});

server.tool("update_conversion_action", "Update a conversion action.", {
  customer_id: optCid,
  conversion_action_id: z.string(),
  fields: z.string().describe('JSON fields to update, e.g. {"status":"DISABLED","name":"New Name"}'),
  update_mask: z.string().describe('Comma-separated mask, e.g. "status,name"'),
}, async ({ customer_id, conversion_action_id, fields, update_mask }) => {
  const c = cid(customer_id);
  const parsed = JSON.parse(fields);
  parsed.resourceName = `customers/${c}/conversionActions/${conversion_action_id}`;
  return ok(await ads.mutate(c, "conversionActions:mutate", { operations: [{ update: parsed, updateMask: update_mask }] }));
});

// ===================== LABELS =====================

server.tool("create_label", "Create a label for organizing campaigns/ad groups/ads.", {
  customer_id: optCid,
  name: z.string(),
  description: z.string().optional(),
  background_color: z.string().optional().describe("Hex color, e.g. #FF0000"),
}, async ({ customer_id, name, description, background_color }) => {
  const c = cid(customer_id);
  const label: Record<string, unknown> = { name };
  if (description) label.description = description;
  if (background_color) label.backgroundColor = background_color;
  return ok(await ads.mutate(c, "labels:mutate", { operations: [{ create: label }] }));
});

server.tool("apply_label_to_campaign", "Apply a label to a campaign.", {
  customer_id: optCid,
  campaign_id: z.string(),
  label_id: z.string(),
}, async ({ customer_id, campaign_id, label_id }) => {
  const c = cid(customer_id);
  return ok(await ads.mutate(c, "campaignLabels:mutate", {
    operations: [{ create: { campaign: `customers/${c}/campaigns/${campaign_id}`, label: `customers/${c}/labels/${label_id}` } }],
  }));
});

server.tool("apply_label_to_ad_group", "Apply a label to an ad group.", {
  customer_id: optCid,
  ad_group_id: z.string(),
  label_id: z.string(),
}, async ({ customer_id, ad_group_id, label_id }) => {
  const c = cid(customer_id);
  return ok(await ads.mutate(c, "adGroupLabels:mutate", {
    operations: [{ create: { adGroup: `customers/${c}/adGroups/${ad_group_id}`, label: `customers/${c}/labels/${label_id}` } }],
  }));
});
