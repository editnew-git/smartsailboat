import { existsSync } from 'node:fs';
import { site, validateSite } from '../src/lib/site.mjs';

try {
  validateSite(site, { production: process.argv.includes('--production') });
  if (site.logoPath && !existsSync(new URL(`../public${site.logoPath}`, import.meta.url))) {
    throw new Error(`Configured logo is missing from public${site.logoPath}.`);
  }
  console.log(`Site configuration valid: ${site.siteName} (${site.siteUrl}); story route ${site.routePrefix}{slug}/.`);
  if (process.argv.includes('--production')) console.log('Local configuration is ready. External Pressly, GitHub, hosting, and DNS connections still require verification.');
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
