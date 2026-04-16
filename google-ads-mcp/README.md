# Google Ads MCP Server

An MCP (Model Context Protocol) server that connects Claude to the Google Ads API. Manage campaigns, view performance reports, analyze keywords, and more — all through natural conversation.

## Live vs Sandbox

**This server connects to the LIVE Google Ads API.** There is no separate sandbox mode — the Google Ads API uses your **developer token's access level** to control what you can do:

| Token Level | What it means |
|---|---|
| **Test account** | You can create a [test manager account](https://ads.google.com/home/tools/manager-accounts/) that has no real ad spend. Safe for development. |
| **Basic access** | Live access, limited to 15,000 operations/day and 1,000 requests/day. |
| **Standard access** | Full production access. |

**Recommended for getting started:** Create a Google Ads **test account** first. This gives you a safe sandbox-like environment with no real money involved.

---

## Prerequisites

You need **4 credentials** to use this server:

### 1. Google Ads Developer Token

1. Sign in to your [Google Ads Manager account](https://ads.google.com)
2. Go to **Tools & Settings → Setup → API Center**
3. Your developer token is displayed there
4. For test accounts, it's approved immediately

### 2. OAuth 2.0 Client ID & Secret

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a project (or use an existing one)
3. Enable the **Google Ads API** under APIs & Services
4. Go to **Credentials → Create Credentials → OAuth client ID**
5. Application type: **Desktop app**
6. Note your **Client ID** and **Client Secret**

### 3. OAuth 2.0 Refresh Token

Generate a refresh token using the OAuth2 flow:

```bash
# 1. Open this URL in your browser (replace YOUR_CLIENT_ID):
https://accounts.google.com/o/oauth2/auth?client_id=YOUR_CLIENT_ID&redirect_uri=urn:ietf:wg:oauth:2.0:oob&scope=https://www.googleapis.com/auth/adwords&response_type=code&access_type=offline

# 2. Authorize and copy the authorization code

# 3. Exchange it for a refresh token:
curl -X POST https://oauth2.googleapis.com/token \
  -d "code=YOUR_AUTH_CODE" \
  -d "client_id=YOUR_CLIENT_ID" \
  -d "client_secret=YOUR_CLIENT_SECRET" \
  -d "redirect_uri=urn:ietf:wg:oauth:2.0:oob" \
  -d "grant_type=authorization_code"

# 4. The response contains your refresh_token — save it!
```

### 4. Customer ID

Your 10-digit Google Ads account number (visible in the top right of Google Ads UI). Remove the hyphens when using it.

---

## Setup

```bash
# Clone and install
cd google-ads-mcp
npm install

# Configure credentials
cp .env.example .env
# Edit .env with your actual credentials

# Build
npm run build
```

## Usage with Claude

Add this to your Claude MCP settings (e.g. `claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "google-ads": {
      "command": "node",
      "args": ["/path/to/google-ads-mcp/build/index.js"],
      "env": {
        "GOOGLE_ADS_DEVELOPER_TOKEN": "your-token",
        "GOOGLE_ADS_CLIENT_ID": "your-client-id",
        "GOOGLE_ADS_CLIENT_SECRET": "your-secret",
        "GOOGLE_ADS_REFRESH_TOKEN": "your-refresh-token",
        "GOOGLE_ADS_CUSTOMER_ID": "1234567890"
      }
    }
  }
}
```

## Available Tools

| Tool | Description |
|---|---|
| `list_accessible_customers` | List all accounts you can access |
| `search` | Run any GAQL query for custom reporting |
| `get_campaign_report` | Campaign performance with metrics |
| `get_ad_group_report` | Ad group level performance |
| `get_keyword_report` | Keyword performance metrics |
| `get_search_terms_report` | Actual search queries triggering ads |
| `get_ad_report` | Individual ad performance |
| `get_account_hierarchy` | Manager → child account tree |
| `get_change_history` | Audit log of account changes |
| `update_campaign_status` | Pause or enable campaigns |
| `update_campaign_budget` | Change daily budgets |

## Example Prompts

- "Show me my top 5 campaigns by spend this month"
- "Which keywords have the highest CPC in the last 30 days?"
- "What search terms are triggering my ads but not converting?"
- "Pause campaign 12345678"
- "Compare last month vs this month campaign performance"
