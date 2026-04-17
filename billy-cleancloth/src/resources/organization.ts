import { z } from "zod";
import type { BillyClient } from "../client/BillyClient.js";

// Permissive schema — Billy returns many fields we don't care about yet.
// Extend as we rely on more of them.
export const OrganizationSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    registrationNo: z.string().nullable().optional(),
    baseCurrencyId: z.string().optional(),
    countryId: z.string().optional(),
    locale: z.string().optional(),
    email: z.string().nullable().optional(),
  })
  .passthrough();

export type Organization = z.infer<typeof OrganizationSchema>;

const OrganizationResponseSchema = z.object({
  organization: OrganizationSchema,
});

export async function getOrganization(client: BillyClient): Promise<Organization> {
  const raw = await client.get("/organization");
  return OrganizationResponseSchema.parse(raw).organization;
}
