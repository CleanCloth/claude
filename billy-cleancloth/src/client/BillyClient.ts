import { BillyApiError, type BillyRequestOptions } from "./types.js";
import { logMutation } from "../util/logger.js";

const DEFAULT_BASE_URL = "https://api.billyapp.com/v2";
const MAX_RETRIES = 4;
const RETRY_BASE_MS = 500;

type Method = "GET" | "POST" | "PUT" | "DELETE";

export interface BillyClientOptions {
  token: string;
  baseUrl?: string;
  // When true, write methods (POST/PUT/DELETE) throw instead of sending.
  // Wire this from the CLI's --execute flag so dry-run is the default.
  dryRun?: boolean;
  // Injected for tests.
  fetchImpl?: typeof fetch;
}

export class BillyClient {
  private readonly token: string;
  private readonly baseUrl: string;
  private readonly dryRun: boolean;
  private readonly fetchImpl: typeof fetch;

  constructor(opts: BillyClientOptions) {
    if (!opts.token) throw new Error("BillyClient requires a token");
    this.token = opts.token;
    this.baseUrl = (opts.baseUrl ?? DEFAULT_BASE_URL).replace(/\/$/, "");
    this.dryRun = opts.dryRun ?? false;
    this.fetchImpl = opts.fetchImpl ?? fetch;
  }

  get(path: string, options: BillyRequestOptions = {}): Promise<unknown> {
    return this.request("GET", path, options);
  }

  post(path: string, options: BillyRequestOptions = {}): Promise<unknown> {
    return this.request("POST", path, options);
  }

  put(path: string, options: BillyRequestOptions = {}): Promise<unknown> {
    return this.request("PUT", path, options);
  }

  delete(path: string, options: BillyRequestOptions = {}): Promise<unknown> {
    return this.request("DELETE", path, options);
  }

  private async request(
    method: Method,
    path: string,
    options: BillyRequestOptions,
  ): Promise<unknown> {
    const url = this.buildUrl(path, options.query);
    const isMutation = method !== "GET";

    if (isMutation && this.dryRun) {
      const msg = `[dry-run] ${method} ${url} — pass --execute to perform this write`;
      console.warn(msg);
      await logMutation({
        timestamp: new Date().toISOString(),
        method,
        url,
        payload: options.body,
        response: { dryRun: true },
      });
      return { dryRun: true };
    }

    const headers: Record<string, string> = {
      "X-Access-Token": this.token,
      Accept: "application/json",
    };
    if (options.body !== undefined) headers["Content-Type"] = "application/json";

    const init: RequestInit = { method, headers };
    if (options.body !== undefined) init.body = JSON.stringify(options.body);
    if (options.signal) init.signal = options.signal;

    let lastErr: unknown;
    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      try {
        const res = await this.fetchImpl(url, init);

        // Honour Retry-After on 429/503.
        if (res.status === 429 || (res.status >= 500 && res.status < 600)) {
          if (attempt < MAX_RETRIES) {
            const retryAfter = Number(res.headers.get("retry-after"));
            const delay = Number.isFinite(retryAfter) && retryAfter > 0
              ? retryAfter * 1000
              : RETRY_BASE_MS * 2 ** attempt;
            await sleep(delay);
            continue;
          }
        }

        const text = await res.text();
        const parsed = text.length > 0 ? safeJsonParse(text) : undefined;

        if (!res.ok) {
          throw new BillyApiError(
            res.status,
            path,
            method,
            parsed ?? text,
            `Billy API ${method} ${path} failed: ${res.status} ${res.statusText}`,
          );
        }

        if (isMutation) {
          await logMutation({
            timestamp: new Date().toISOString(),
            method,
            url,
            payload: options.body,
            response: parsed,
          });
        }

        return parsed;
      } catch (err) {
        lastErr = err;
        if (err instanceof BillyApiError) throw err;
        if (attempt >= MAX_RETRIES) break;
        await sleep(RETRY_BASE_MS * 2 ** attempt);
      }
    }
    throw lastErr instanceof Error ? lastErr : new Error(String(lastErr));
  }

  private buildUrl(
    path: string,
    query: BillyRequestOptions["query"],
  ): string {
    const normalised = path.startsWith("/") ? path : `/${path}`;
    const url = new URL(`${this.baseUrl}${normalised}`);
    if (query) {
      for (const [key, value] of Object.entries(query)) {
        if (value === undefined) continue;
        url.searchParams.set(key, String(value));
      }
    }
    return url.toString();
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function safeJsonParse(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}
