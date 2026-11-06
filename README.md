# Smart Sail Boat

A journal of sailing, vessel projects, cleanup and refits, onboard technology,
and lessons learned on the water. Built from the reusable Pressly Astro template.

The permanent website is **https://smartsailboat.com**, with stories at
`/stories/{slug}/`. The publication is being staged while production DNS is
unavailable; the welcome story requires review before publication.

Follow the [end-to-end setup runbook](docs/SETUP_RUNBOOK.md) for template use,
repository and hosting configuration, Pressly registration, media connections,
verification, and the remaining DNS cutover. The [launch values](docs/SMARTSAILBOAT.md)
and [general setup reference](docs/PRESSLY_SETUP.md) provide supporting detail.

## Local development

Use Node 22.12 or later.

```sh
npm ci
npm run dev
npm run check:setup
npm test
npm run build
```

`site.config.json` controls identity, canonical URLs, colors, logo, repository and
channel defaults. `npm run pressly:setup` prints an inactive operator proposal;
it does not create or enable provider resources.

## Publishing contract

Pressly uses `pressly_smartsailboat` and company code `SSB`. The shared Release
Registry owns article content and lifecycle. n8n writes published Markdown to
`src/content/news/` and cover images to `public/images/news/`; pushes to `main`
trigger the hosting build. Update articles through Pressly, since a later sync
can replace direct edits to generated content.

The site includes responsive article pages, archive search and topic filters,
controlled YouTube embeds, RSS, sitemap, canonical metadata, and a static
Docker/nginx deployment. Examples stay outside the production content collection.

Media projects, image profiles, approvals and integration receipts belong to
Pressly's media registry. Business and vessel Master Logs retain their separate
authority. See the [publishing protocol](docs/company-protocol.md) for public
content boundaries. Credentials and private operational evidence never belong
in this repository.
