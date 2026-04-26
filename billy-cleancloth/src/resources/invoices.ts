import { z } from "zod";
import type { BillyClient } from "../client/BillyClient.js";

// Billy v2 invoice line. Some numeric fields come back as strings on certain
// endpoints (e.g. quantity), so each is `number | string`. Helpers in
// util/money.ts normalise for display.
export const InvoiceLineSchema = z
  .object({
    id: z.string().optional(),
    productId: z.string().nullable().optional(),
    description: z.string().nullable().optional(),
    quantity: z.union([z.number(), z.string()]).optional(),
    unitPrice: z.union([z.number(), z.string()]).optional(),
    amount: z.union([z.number(), z.string()]).optional(),
    taxRateId: z.string().nullable().optional(),
    accountId: z.string().nullable().optional(),
  })
  .passthrough();

export type InvoiceLine = z.infer<typeof InvoiceLineSchema>;

export const InvoiceSchema = z
  .object({
    id: z.string(),
    organizationId: z.string().optional(),
    state: z.string().optional(),
    invoiceNo: z.union([z.string(), z.number()]).nullable().optional(),
    contactId: z.string().nullable().optional(),
    entryDate: z.string().optional(),
    paymentDate: z.string().nullable().optional(),
    dueDate: z.string().nullable().optional(),
    currencyId: z.string().optional(),
    amount: z.union([z.number(), z.string()]).optional(),
    taxAmount: z.union([z.number(), z.string()]).optional(),
    balance: z.union([z.number(), z.string()]).optional(),
    isPaid: z.boolean().optional(),
    sentState: z.string().nullable().optional(),
    lines: z.array(InvoiceLineSchema).optional(),
  })
  .passthrough();

export type Invoice = z.infer<typeof InvoiceSchema>;

const InvoiceListResponseSchema = z.object({
  invoices: z.array(InvoiceSchema),
  meta: z.unknown().optional(),
});

const InvoiceSingleResponseSchema = z.object({
  invoice: InvoiceSchema,
});

export interface ListInvoicesOptions {
  page?: number;
  pageSize?: number;
  state?: string;
  isPaid?: boolean;
  contactId?: string;
  // Billy filters dates with the period syntax e.g. "dates:2024-01-01...2024-12-31".
  // Adjust if discover proves a different shape works.
  entryDatePeriod?: string;
  // Free-form additional filters. Useful while we're still figuring out which
  // params Billy supports without breaking the typed surface.
  extra?: Record<string, string | number | boolean | undefined>;
}

export async function listInvoices(
  client: BillyClient,
  opts: ListInvoicesOptions = {},
): Promise<{ invoices: Invoice[]; meta: unknown }> {
  const { extra, ...rest } = opts;
  const raw = await client.get("/invoices", { query: { ...rest, ...extra } });
  const parsed = InvoiceListResponseSchema.parse(raw);
  return { invoices: parsed.invoices, meta: parsed.meta };
}

export async function getInvoice(client: BillyClient, id: string): Promise<Invoice> {
  const raw = await client.get(`/invoices/${id}`);
  return InvoiceSingleResponseSchema.parse(raw).invoice;
}
