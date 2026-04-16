# Google Ads MCP Server

Full Google Ads account management via MCP. Works with **Claude Code**, **Claude Desktop**, and any MCP-compatible AI client.

**This is not read-only.** You can create campaigns, write ads, manage bids, add keywords, set targeting, track conversions — everything.

---

## Connect to Claude Code

After building (see [Setup](#setup)), add this to your Claude Code MCP config:

```bash
# Option 1: Add via CLI
claude mcp add google-ads -- node /absolute/path/to/google-ads-mcp/build/index.js

# Option 2: Add to .claude/settings.json (project-level) or ~/.claude/settings.json (global)
```

```json
{
  "mcpServers": {
    "google-ads": {
      "command": "node",
      "args": ["/absolute/path/to/google-ads-mcp/build/index.js"],
      "env": {
        "GOOGLE_ADS_DEVELOPER_TOKEN": "your-developer-token",
        "GOOGLE_ADS_CLIENT_ID": "your-client-id.apps.googleusercontent.com",
        "GOOGLE_ADS_CLIENT_SECRET": "your-client-secret",
        "GOOGLE_ADS_REFRESH_TOKEN": "your-refresh-token",
        "GOOGLE_ADS_CUSTOMER_ID": "1234567890",
        "GOOGLE_ADS_LOGIN_CUSTOMER_ID": "9876543210"
      }
    }
  }
}
```

## Connect to Claude Desktop

Add the same config block above to your `claude_desktop_config.json`:
- **macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

## Connect to Any MCP Client

This is a standard MCP server over **stdio**. Any client that speaks MCP can connect:

```bash
# Run directly
GOOGLE_ADS_DEVELOPER_TOKEN=xxx \
GOOGLE_ADS_CLIENT_ID=xxx \
GOOGLE_ADS_CLIENT_SECRET=xxx \
GOOGLE_ADS_REFRESH_TOKEN=xxx \
GOOGLE_ADS_CUSTOMER_ID=1234567890 \
node /path/to/google-ads-mcp/build/index.js
```

---

## Credentials You Need

| # | Variable | Where to get it |
|---|---|---|
| 1 | `GOOGLE_ADS_DEVELOPER_TOKEN` | [Google Ads Manager](https://ads.google.com) → Tools & Settings → API Center |
| 2 | `GOOGLE_ADS_CLIENT_ID` | [Google Cloud Console](https://console.cloud.google.com) → APIs → Credentials → OAuth 2.0 → Desktop app |
| 3 | `GOOGLE_ADS_CLIENT_SECRET` | Same as above |
| 4 | `GOOGLE_ADS_REFRESH_TOKEN` | OAuth2 flow (see below) |
| 5 | `GOOGLE_ADS_CUSTOMER_ID` | Your 10-digit account number (optional, can pass per-request) |
| 6 | `GOOGLE_ADS_LOGIN_CUSTOMER_ID` | Only needed for manager accounts accessing child accounts |

### Getting your Refresh Token

```bash
# 1. Open this URL in your browser (replace YOUR_CLIENT_ID):
# https://accounts.google.com/o/oauth2/auth?client_id=YOUR_CLIENT_ID&redirect_uri=urn:ietf:wg:oauth:2.0:oob&scope=https://www.googleapis.com/auth/adwords&response_type=code&access_type=offline

# 2. Authorize and copy the code

# 3. Exchange for refresh token:
curl -X POST https://oauth2.googleapis.com/token \
  -d "code=YOUR_AUTH_CODE" \
  -d "client_id=YOUR_CLIENT_ID" \
  -d "client_secret=YOUR_CLIENT_SECRET" \
  -d "redirect_uri=urn:ietf:wg:oauth:2.0:oob" \
  -d "grant_type=authorization_code"

# 4. Save the refresh_token from the response
```

### Test Account (Safe Sandbox)

The API is always live, but you can create a [Google Ads test account](https://ads.google.com/home/tools/manager-accounts/) — no real spend, no billing, instant developer token approval.

---

## Setup

```bash
cd google-ads-mcp
npm install
npm run build
```

---

## All 45 Tools

### Account
| Tool | What it does |
|---|---|
| `list_accessible_customers` | List all accounts you can access |
| `get_account_info` | Account name, currency, timezone, settings |
| `get_account_hierarchy` | Manager → child account tree |

### Campaigns
| Tool | What it does |
|---|---|
| `create_campaign` | Create a campaign (Search, Display, Shopping, Video, PMax, etc.) |
| `update_campaign` | Update any campaign field |
| `update_campaign_status` | Pause / enable / remove a campaign |
| `remove_campaign` | Permanently delete a campaign |

### Budgets
| Tool | What it does |
|---|---|
| `create_budget` | Create a daily budget |
| `update_budget` | Change a budget amount |

### Ad Groups
| Tool | What it does |
|---|---|
| `create_ad_group` | Create an ad group in a campaign |
| `update_ad_group` | Update ad group fields (name, bids, etc.) |
| `update_ad_group_status` | Pause / enable / remove an ad group |
| `remove_ad_group` | Delete an ad group |

### Ads
| Tool | What it does |
|---|---|
| `create_responsive_search_ad` | Create an RSA with headlines + descriptions |
| `update_ad_status` | Pause / enable / remove an ad |
| `remove_ad` | Delete an ad |

### Keywords
| Tool | What it does |
|---|---|
| `add_keywords` | Add keywords (exact, phrase, broad) with optional bids |
| `update_keyword_bid` | Change a keyword's CPC bid |
| `update_keyword_status` | Pause / enable / remove a keyword |
| `remove_keyword` | Delete a keyword |
| `add_negative_keywords_to_campaign` | Add campaign-level negative keywords |
| `add_negative_keywords_to_ad_group` | Add ad-group-level negative keywords |

### Extensions (Assets)
| Tool | What it does |
|---|---|
| `create_sitelink` | Create a sitelink extension |
| `create_callout` | Create a callout extension |
| `create_call_asset` | Create a phone call extension |
| `create_structured_snippet` | Create a structured snippet |
| `link_asset_to_campaign` | Attach an asset to a campaign |
| `link_asset_to_ad_group` | Attach an asset to an ad group |

### Targeting
| Tool | What it does |
|---|---|
| `set_campaign_location_targets` | Target/exclude countries, cities, regions |
| `set_campaign_language_targets` | Set language targeting |
| `add_audience_to_campaign` | Add audience segments to campaigns |
| `add_audience_to_ad_group` | Add audience segments to ad groups |
| `set_ad_schedule` | Set day/time scheduling |
| `set_device_bid_adjustment` | Adjust bids by device (mobile, desktop, tablet) |

### Conversions & Labels
| Tool | What it does |
|---|---|
| `create_conversion_action` | Create conversion tracking |
| `list_conversion_actions` | List all conversion actions |
| `update_conversion_action` | Update conversion action settings |
| `create_label` | Create organizational labels |
| `apply_label_to_campaign` | Tag a campaign with a label |
| `apply_label_to_ad_group` | Tag an ad group with a label |

### Reports
| Tool | What it does |
|---|---|
| `get_campaign_report` | Campaign performance metrics |
| `get_ad_group_report` | Ad group performance |
| `get_keyword_report` | Keyword performance + quality scores |
| `get_search_terms_report` | Actual queries triggering your ads |
| `get_ad_report` | Individual ad performance |
| `get_change_history` | Account audit log |
| `get_geo_report` | Performance by location |
| `get_device_report` | Performance by device |
| `get_age_gender_report` | Performance by demographics |
| `get_placement_report` | Performance by placement (Display/Video) |

### Advanced
| Tool | What it does |
|---|---|
| `search` | Run any custom GAQL query |
| `raw_mutate` | Execute any API mutate call directly |

---

## Example Prompts

```
"Create a Search campaign called 'Summer Sale' with a $50/day budget"
"Add 10 keywords to ad group 123456 with broad match"
"Show me which search terms are wasting money — high clicks, no conversions"
"Pause all campaigns spending more than $100/day with less than 1% CTR"
"Create a responsive search ad with 5 headlines and 3 descriptions"
"Set location targeting for US and Canada, exclude Alaska"
"What's my cost per conversion by campaign for the last 30 days?"
"Add sitelink extensions for our pricing and features pages"
```
