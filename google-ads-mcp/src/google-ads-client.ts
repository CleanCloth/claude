import { GoogleAdsCredentials, getAccessToken } from "./auth.js";

const API_VERSION = "v19";
const BASE_URL = `https://googleads.googleapis.com/${API_VERSION}`;

export interface GoogleAdsClient {
  /** Run a GAQL query. */
  search(customerId: string, query: string): Promise<unknown[]>;
  /** List all accessible customer accounts. */
  listAccessibleCustomers(): Promise<string[]>;
  /** Generic mutate — works for any resource endpoint. */
  mutate(customerId: string, endpoint: string, body: Record<string, unknown>): Promise<unknown>;
  /** Generic GET for any resource path. */
  get(path: string): Promise<unknown>;
}

export function createGoogleAdsClient(creds: GoogleAdsCredentials): GoogleAdsClient {
  let cachedToken: string | null = null;
  let tokenExpiry = 0;

  async function getToken(): Promise<string> {
    if (cachedToken && Date.now() < tokenExpiry) return cachedToken;
    cachedToken = await getAccessToken(creds);
    tokenExpiry = Date.now() + 55 * 60 * 1000;
    return cachedToken;
  }

  function makeHeaders(token: string): Record<string, string> {
    const h: Record<string, string> = {
      Authorization: `Bearer ${token}`,
      "developer-token": creds.developerToken,
      "Content-Type": "application/json",
    };
    if (creds.loginCustomerId) {
      h["login-customer-id"] = creds.loginCustomerId;
    }
    return h;
  }

  return {
    async search(customerId, query) {
      const token = await getToken();
      const resp = await fetch(
        `${BASE_URL}/customers/${customerId}/googleAds:searchStream`,
        { method: "POST", headers: makeHeaders(token), body: JSON.stringify({ query }) }
      );
      if (!resp.ok) throw new Error(`search failed (${resp.status}): ${await resp.text()}`);
      const data = (await resp.json()) as { results?: unknown[] }[];
      return data.flatMap((b) => b.results ?? []);
    },

    async listAccessibleCustomers() {
      const token = await getToken();
      const resp = await fetch(
        `${BASE_URL}/customers:listAccessibleCustomers`,
        { method: "GET", headers: makeHeaders(token) }
      );
      if (!resp.ok) throw new Error(`listAccessibleCustomers failed (${resp.status}): ${await resp.text()}`);
      return ((await resp.json()) as { resourceNames: string[] }).resourceNames;
    },

    async mutate(customerId, endpoint, body) {
      const token = await getToken();
      const resp = await fetch(
        `${BASE_URL}/customers/${customerId}/${endpoint}`,
        { method: "POST", headers: makeHeaders(token), body: JSON.stringify(body) }
      );
      if (!resp.ok) throw new Error(`mutate ${endpoint} failed (${resp.status}): ${await resp.text()}`);
      return resp.json();
    },

    async get(path) {
      const token = await getToken();
      const resp = await fetch(
        `${BASE_URL}/${path}`,
        { method: "GET", headers: makeHeaders(token) }
      );
      if (!resp.ok) throw new Error(`GET ${path} failed (${resp.status}): ${await resp.text()}`);
      return resp.json();
    },
  };
}
