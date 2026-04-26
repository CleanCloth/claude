import { z } from "zod";
import type { BillyClient } from "../client/BillyClient.js";

// Permissive schema — Billy returns many fields beyond what we surface today.
// `passthrough` keeps the unknown fields available on the parsed object so we
// can extend without breaking callers.
export const ContactSchema = z
  .object({
    id: z.string(),
    organizationId: z.string().optional(),
    name: z.string().nullable().optional(),
    contactNo: z.string().nullable().optional(),
    countryId: z.string().nullable().optional(),
    registrationNo: z.string().nullable().optional(),
    isCustomer: z.boolean().optional(),
    isSupplier: z.boolean().optional(),
    state: z.string().optional(),
    paymentTermsDays: z.number().nullable().optional(),
    email: z.string().nullable().optional(),
    phone: z.string().nullable().optional(),
  })
  .passthrough();

export type Contact = z.infer<typeof ContactSchema>;

const ContactListResponseSchema = z.object({
  contacts: z.array(ContactSchema),
  meta: z.unknown().optional(),
});

const ContactSingleResponseSchema = z.object({
  contact: ContactSchema,
});

export interface ListContactsOptions {
  page?: number;
  pageSize?: number;
  q?: string;
  isCustomer?: boolean;
  isSupplier?: boolean;
}

export async function listContacts(
  client: BillyClient,
  opts: ListContactsOptions = {},
): Promise<{ contacts: Contact[]; meta: unknown }> {
  const raw = await client.get("/contacts", { query: { ...opts } });
  const parsed = ContactListResponseSchema.parse(raw);
  return { contacts: parsed.contacts, meta: parsed.meta };
}

export async function getContact(client: BillyClient, id: string): Promise<Contact> {
  const raw = await client.get(`/contacts/${id}`);
  return ContactSingleResponseSchema.parse(raw).contact;
}
