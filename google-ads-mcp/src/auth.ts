#!/usr/bin/env node

/**
 * Google Ads API authentication helper.
 *
 * Required environment variables:
 *   GOOGLE_ADS_DEVELOPER_TOKEN  – Developer token from your Google Ads Manager account
 *   GOOGLE_ADS_CLIENT_ID        – OAuth 2.0 client ID (from Google Cloud Console)
 *   GOOGLE_ADS_CLIENT_SECRET    – OAuth 2.0 client secret
 *   GOOGLE_ADS_REFRESH_TOKEN    – OAuth 2.0 refresh token
 *
 * Optional:
 *   GOOGLE_ADS_CUSTOMER_ID      – Default customer ID (10 digits, no hyphens)
 *   GOOGLE_ADS_LOGIN_CUSTOMER_ID – Manager account ID when using manager accounts
 */

export interface GoogleAdsCredentials {
  developerToken: string;
  clientId: string;
  clientSecret: string;
  refreshToken: string;
  customerId?: string;
  loginCustomerId?: string;
}

export function loadCredentials(): GoogleAdsCredentials {
  const developerToken = process.env.GOOGLE_ADS_DEVELOPER_TOKEN;
  const clientId = process.env.GOOGLE_ADS_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_ADS_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_ADS_REFRESH_TOKEN;

  const missing: string[] = [];
  if (!developerToken) missing.push("GOOGLE_ADS_DEVELOPER_TOKEN");
  if (!clientId) missing.push("GOOGLE_ADS_CLIENT_ID");
  if (!clientSecret) missing.push("GOOGLE_ADS_CLIENT_SECRET");
  if (!refreshToken) missing.push("GOOGLE_ADS_REFRESH_TOKEN");

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}.\n` +
        `See README.md for setup instructions.`
    );
  }

  return {
    developerToken: developerToken!,
    clientId: clientId!,
    clientSecret: clientSecret!,
    refreshToken: refreshToken!,
    customerId: process.env.GOOGLE_ADS_CUSTOMER_ID?.replace(/-/g, ""),
    loginCustomerId: process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID?.replace(/-/g, ""),
  };
}

/** Exchange the refresh token for a fresh access token. */
export async function getAccessToken(creds: GoogleAdsCredentials): Promise<string> {
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: creds.clientId,
      client_secret: creds.clientSecret,
      refresh_token: creds.refreshToken,
      grant_type: "refresh_token",
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Failed to refresh access token: ${response.status} ${body}`);
  }

  const data = (await response.json()) as { access_token: string };
  return data.access_token;
}
