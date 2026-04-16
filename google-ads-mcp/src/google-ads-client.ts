import { GoogleAdsCredentials, getAccessToken } from "./auth.js";

const API_VERSION = "v19";
const BASE_URL = `https://googleads.googleapis.com/${API_VERSION}`;

export interface GoogleAdsClient {
  /** Execute a GAQL query against a customer account. */
  search(customerId: string, query: string): Promise<unknown[]>;
  /** List all customer accounts accessible with the current credentials. */
  listAccessibleCustomers(): Promise<string[]>;
  /** Get a single resource by resource name. */
  getResource(resourceName: string): Promise<unknown>;
  /** Mutate campaigns (create, update, pause, resume, remove). */
  mutateCampaigns(customerId: string, operations: unknown[]): Promise<unknown>;
  /** Mutate ad groups. */
  mutateAdGroups(customerId: string, operations: unknown[]): Promise<unknown>;
  /** Mutate ads. */
  mutateAds(customerId: string, operations: unknown[]): Promise<unknown>;
  /** Mutate keywords (ad group criteria). */
  mutateKeywords(customerId: string, operations: unknown[]): Promise<unknown>;
}

export function createGoogleAdsClient(creds: GoogleAdsCredentials): GoogleAdsClient {
  let cachedToken: string | null = null;
  let tokenExpiry = 0;

  async function getToken(): Promise<string> {
    if (cachedToken && Date.now() < tokenExpiry) return cachedToken;
    cachedToken = await getAccessToken(creds);
    tokenExpiry = Date.now() + 55 * 60 * 1000; // refresh 5 min before 1h expiry
    return cachedToken;
  }

  function headers(token: string): Record<string, string> {
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
    async search(customerId: string, query: string): Promise<unknown[]> {
      const token = await getToken();
      const url = `${BASE_URL}/customers/${customerId}/googleAds:searchStream`;
      const resp = await fetch(url, {
        method: "POST",
        headers: headers(token),
        body: JSON.stringify({ query }),
      });
      if (!resp.ok) {
        const body = await resp.text();
        throw new Error(`Google Ads search failed (${resp.status}): ${body}`);
      }
      const data = (await resp.json()) as { results?: unknown[] }[];
      return data.flatMap((batch) => batch.results ?? []);
    },

    async listAccessibleCustomers(): Promise<string[]> {
      const token = await getToken();
      const url = `${BASE_URL}/customers:listAccessibleCustomers`;
      const resp = await fetch(url, {
        method: "GET",
        headers: headers(token),
      });
      if (!resp.ok) {
        const body = await resp.text();
        throw new Error(`listAccessibleCustomers failed (${resp.status}): ${body}`);
      }
      const data = (await resp.json()) as { resourceNames: string[] };
      return data.resourceNames;
    },

    async getResource(resourceName: string): Promise<unknown> {
      const token = await getToken();
      const url = `${BASE_URL}/${resourceName}`;
      const resp = await fetch(url, {
        method: "GET",
        headers: headers(token),
      });
      if (!resp.ok) {
        const body = await resp.text();
        throw new Error(`getResource failed (${resp.status}): ${body}`);
      }
      return resp.json();
    },

    async mutateCampaigns(customerId: string, operations: unknown[]): Promise<unknown> {
      const token = await getToken();
      const url = `${BASE_URL}/customers/${customerId}/campaigns:mutate`;
      const resp = await fetch(url, {
        method: "POST",
        headers: headers(token),
        body: JSON.stringify({ operations }),
      });
      if (!resp.ok) {
        const body = await resp.text();
        throw new Error(`mutateCampaigns failed (${resp.status}): ${body}`);
      }
      return resp.json();
    },

    async mutateAdGroups(customerId: string, operations: unknown[]): Promise<unknown> {
      const token = await getToken();
      const url = `${BASE_URL}/customers/${customerId}/adGroups:mutate`;
      const resp = await fetch(url, {
        method: "POST",
        headers: headers(token),
        body: JSON.stringify({ operations }),
      });
      if (!resp.ok) {
        const body = await resp.text();
        throw new Error(`mutateAdGroups failed (${resp.status}): ${body}`);
      }
      return resp.json();
    },

    async mutateAds(customerId: string, operations: unknown[]): Promise<unknown> {
      const token = await getToken();
      const url = `${BASE_URL}/customers/${customerId}/adGroupAds:mutate`;
      const resp = await fetch(url, {
        method: "POST",
        headers: headers(token),
        body: JSON.stringify({ operations }),
      });
      if (!resp.ok) {
        const body = await resp.text();
        throw new Error(`mutateAds failed (${resp.status}): ${body}`);
      }
      return resp.json();
    },

    async mutateKeywords(customerId: string, operations: unknown[]): Promise<unknown> {
      const token = await getToken();
      const url = `${BASE_URL}/customers/${customerId}/adGroupCriteria:mutate`;
      const resp = await fetch(url, {
        method: "POST",
        headers: headers(token),
        body: JSON.stringify({ operations }),
      });
      if (!resp.ok) {
        const body = await resp.text();
        throw new Error(`mutateKeywords failed (${resp.status}): ${body}`);
      }
      return resp.json();
    },
  };
}
