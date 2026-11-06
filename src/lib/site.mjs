import configuration from '../../site.config.json' with { type: 'json' };
import { existsSync } from 'node:fs';
import { join } from 'node:path';

export function validateSite(config, { production = false } = {}) {
  for (const key of ['siteName', 'companyName', 'companyCode', 'siteUrl', 'description', 'language', 'githubOwner', 'githubRepo', 'slackChannel']) {
    if (typeof config[key] !== 'string' || !config[key].trim()) throw new Error(`site.config.json: ${key} must be a non-empty string.`);
  }
  if (!/^[A-Z0-9]+$/.test(config.companyCode) && !(config.companyCode === 'CHANGE_ME' && !production)) {
    throw new Error('site.config.json: companyCode must contain uppercase letters and digits only.');
  }
  const url = new URL(config.siteUrl);
  if (!['/news/', '/stories/'].includes(config.routePrefix)) throw new Error('site.config.json: routePrefix must be /news/ or /stories/.');
  if (url.protocol !== 'https:' || url.username || url.password || url.pathname !== '/' || url.search || url.hash) {
    throw new Error('site.config.json: siteUrl must be a public HTTPS origin without a path, query, or credentials.');
  }
  if (!/^[a-z]{2,3}(?:-[A-Za-z0-9]+)*$/.test(config.language)) throw new Error('site.config.json: language must be a language tag such as en or en-CA.');
  for (const key of ['ink', 'accent', 'paper']) {
    if (!/^#[0-9a-f]{6}$/i.test(config.colors?.[key] ?? '')) throw new Error(`site.config.json: colors.${key} must be a six-digit hex color.`);
  }
  if (typeof config.logoPath !== 'string' || (config.logoPath && (!config.logoPath.startsWith('/') || config.logoPath.startsWith('//') || config.logoPath.includes('..')))) {
    throw new Error('site.config.json: logoPath must be empty or a root-relative public image path.');
  }
  if (production && (url.hostname === 'example.com' || Object.values(config).some(value => typeof value === 'string' && /CHANGE_ME|Your Company/.test(value)))) {
    throw new Error('Production setup is incomplete: replace the example domain, company, repository, and channel placeholders.');
  }
  return Object.freeze({ ...config, siteUrl: url.origin });
}

export const site = validateSite(configuration);
export const storyPath = slug => `${site.routePrefix}${slug}/`;
export const absoluteUrl = path => new URL(path, site.siteUrl).href;
export const escapeXml = value => String(value).replace(/[<>&"']/g, char => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&apos;' })[char]);

export function publicImage(value) {
  if (typeof value !== 'string' || !value.trim()) return undefined;
  if (value.startsWith('/') && !value.startsWith('//') && !value.includes('..')) return value;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && !url.username && !url.password ? url.href : undefined;
  } catch { return undefined; }
}

// n8n can emit a placeholder path when no cover exists. Keep that case visual
// without creating a broken image; files in public/ are checked at build time.
export function availableImage(value) {
  const image = publicImage(value);
  if (image?.startsWith('/') && !existsSync(join(process.cwd(), 'public', image))) return undefined;
  return image;
}
