import { BillyClient } from "../client/BillyClient.js";
import { getOrganization } from "../resources/organization.js";
import { BillyApiError } from "../client/types.js";

export async function ping(token: string): Promise<number> {
  const client = new BillyClient({ token });
  try {
    const org = await getOrganization(client);
    console.log("✓ Billy API reachable");
    console.log(`  Organization: ${org.name}`);
    console.log(`  CVR:          ${org.registrationNo ?? "(not set)"}`);
    console.log(`  Currency:     ${org.baseCurrencyId ?? "(unknown)"}`);
    console.log(`  Country:      ${org.countryId ?? "(unknown)"}`);
    console.log(`  Locale:       ${org.locale ?? "(unknown)"}`);
    console.log(`  Org ID:       ${org.id}`);
    return 0;
  } catch (err) {
    if (err instanceof BillyApiError) {
      console.error(`✗ Billy API error ${err.status}: ${err.message}`);
      if (err.body) console.error(JSON.stringify(err.body, null, 2));
    } else if (err instanceof Error) {
      console.error(`✗ ${err.message}`);
    } else {
      console.error("✗ Unknown error", err);
    }
    return 1;
  }
}
