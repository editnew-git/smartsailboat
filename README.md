# Smart Sailboat — fresh Pressly site

This is a new, empty publication configured for **https://smartsailboat.com**.
It contains the approved Smart Sail Boat logo and new site defaults, with no old
Deck articles, vessel profiles, release IDs, deployment IDs or GitHub remote.
The proposed new repository is `editnew-git/smartsailboat`; it has not been created
on GitHub. The intended channel is `pressly_smartsailboat`. Both remain setup
choices until you register the new publication.

Start with [the Smart Sailboat setup notes](docs/SMARTSAILBOAT.md), then follow the
complete Pressly setup guide below. The apex domain's existing website and DNS
must be intentionally cut over when you are ready to launch.

A fresh static publication site for the existing Pressly → Release Log → n8n →
GitHub workflow. It includes an article archive, search and topic filters, responsive
article pages, controlled YouTube embeds, canonical metadata, RSS, sitemap and a
static Docker deployment. There are no published sample articles or live credentials.

## Start locally

Use the Node version required by `package.json`.

```sh
npm ci
npm run dev
```

Edit `site.config.json` for the identity, HTTPS origin, colors, optional logo,
repository and Slack channel. These are local defaults, not proof of live setup.
Keep the site's public content directory empty until Pressly publishes content.

```sh
npm run pressly:setup
npm test
npm run build
npm run preview
```

`pressly:setup` prints proposed Channel Registry, Settings and optional media values.
It does not create, register, publish or enable anything. The registry proposal is
inactive until the operator completes the setup checks.

## Connect Pressly

Follow [the complete setup guide](docs/PRESSLY_SETUP.md), in order. It covers the
repository, hosting, root domain or subdomain, Slack access, shared Release Log,
n8n synchronization, durable images, optional video delivery, and acceptance checks.

The shared internal collection must remain `src/content/news/`. The public route
is configured separately. The installed Pressly CLI returns `/stories/{slug}/`
for company code `SSB` and `/news/{slug}` for other companies; the site accepts the
corresponding route and canonicalizes it with a trailing slash.

`examples/` contains reference material outside the public content collection.
Do not copy a sample into production as an approved article.

## Ownership

The Pressly Release Registry owns articles and lifecycle state. n8n materializes
approved content in this repository. Website source and presentation are maintained
here; editing a generated article here is not a durable editorial update because
the next sync can replace it. Media projects and approvals belong to Pressly's
central media database. Business/vessel Master Logs are separate authorities.

Nothing in this repository grants permission to publish private source material.
See [the company protocol example](docs/company-protocol.md) before registering a
new company. Build secrets and provider credentials belong on the appropriate
server, never in this repository or browser assets.
