#!/usr/bin/env node
// Local configuration report only. This command never contacts Pressly or a provider.
import { site } from '../src/lib/site.mjs';
const expectedRoute = site.companyCode === 'SSB' ? '/stories/' : '/news/';
if (site.routePrefix !== expectedRoute) {
  throw new Error(`The installed Pressly CLI uses ${expectedRoute} for ${site.companyCode}. Align routePrefix or implement and deploy an explicit route-contract change first.`);
}
const placeholders = Object.entries(site).filter(([key, value]) =>
  ['companyName', 'companyCode', 'siteUrl', 'githubOwner', 'githubRepo', 'slackChannel'].includes(key)
  && (!value || /example|replace|your[-_ ]|change[-_ ]?me/i.test(value))
).map(([key]) => key);
console.log(JSON.stringify({
  source: 'site.config.json',
  purpose: 'Operator setup proposal; no live resources have been created or verified.',
  placeholders,
  channelRegistry: {
    Company: site.companyName,
    'Channel Name': site.slackChannel,
    'Company Code': site.companyCode,
    'Site URL': site.siteUrl,
    'GitHub Repo': site.githubRepo,
    'GitHub Owner': site.githubOwner,
    'Active?': 'no',
    Notes: 'Activate only after the repository, deployment, protocol and publishing checks pass.',
  },
  settings: {
    Company: site.companyName,
    Boilerplate: site.description,
    'Default Contact Name': '',
    'Default Contact Email': '',
    'Default Contact Phone': '',
    'Logo Path': site.logoPath || '',
    'Site Base URL': site.siteUrl,
  },
  mediaNewsroomProposal: {
    enabled: false,
    siteUrl: site.siteUrl,
    routePrefix: site.routePrefix,
    embedProviders: ['youtube'],
  },
  publishingContract: {
    collection: 'news',
    markdownDirectory: 'src/content/news/',
    coverDirectory: 'public/images/news/',
    articleUrl: `${site.siteUrl}${site.routePrefix}{permanent-slug}/`,
    releaseAuthority: 'Pressly Master Release Log / Release Registry',
    mediaAuthority: 'Pressly central media database',
  },
  manualChecks: [
    'Confirm repository ownership, branch and n8n write access.',
    'Deploy and verify the intended public HTTPS origin.',
    'Register the exact Slack channel in the Channel Registry; configure its bot access separately.',
    'Install a reviewed company-protocols/<Company Code>.md and canonical link mapping.',
    'Configure Settings and durable media upload credentials outside this repository.',
    'Verify the n8n sync destination and automatic hosting deployment after content commits.',
    'Enable the article registry only when ready; publish one explicitly approved production article.',
    'If video delivery is required, configure the media company, exact channel/user grants, provider accounts and company-bound publisher credentials through its operator workflow.',
    'Enable media newsroom delivery only after the public renderer and article pipeline are verified.',
  ],
}, null, 2));
