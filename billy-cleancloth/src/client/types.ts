import { z } from "zod";

// Billy wraps list responses as { <resource>: [...], meta: {...} } and
// single-item responses as { <resource>: {...} }. Actual keys are resource
// specific (e.g. "invoices", "invoice", "organization"). These helpers keep
// the unwrapping logic in one place.

export const BillyMetaSchema = z
  .object({
    paging: z
      .object({
        page: z.number().optional(),
        pageSize: z.number().optional(),
        pageCount: z.number().optional(),
        total: z.number().optional(),
      })
      .partial()
      .optional(),
  })
  .partial()
  .passthrough();

export type BillyMeta = z.infer<typeof BillyMetaSchema>;

export interface BillyRequestOptions {
  query?: Record<string, string | number | boolean | undefined>;
  body?: unknown;
  // Signal for cancellation; passed through to fetch.
  signal?: AbortSignal;
}

export class BillyApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly endpoint: string,
    public readonly method: string,
    public readonly body: unknown,
    message: string,
  ) {
    super(message);
    this.name = "BillyApiError";
  }
}
