# Smart Sailboat launch values

This copy starts a new publication at the apex domain. It has no old article
content or operational integration. The retained logo is an approved brand asset.

| Item | Intended value |
| --- | --- |
| Public site | `https://smartsailboat.com` |
| Article archive | `/stories/` |
| Permanent article URL | `https://smartsailboat.com/stories/{slug}/` |
| Internal collection | `src/content/news/` |
| Company / code | `Smart Sailboat` / `SSB` |
| Slack channel | `pressly_smartsailboat` |
| Proposed new repository | `editnew-git/smartsailboat` |
| Branch | `main` |
| Static output / container port | `dist` / `80` |
| Logo | `/images/brand/smart-sail-boat-logo.png` |
| Discovery | `/sitemap.xml`, `/rss.xml`, `/robots.txt` |

1. Review `site.config.json`; run `npm ci`, `npm test`, `npm run build` and
   `npm run pressly:setup`.
2. Create the new repository and connect a new Dokploy application using the
   supplied Dockerfile. Test it on a preview hostname.
3. Register the apex and chosen `www` redirect at the edge/hosting router.
   Update DNS only when the replacement is ready. Preserve email/TXT records.
4. Re-register SSB in the existing Pressly Channel Registry and Settings using
   the local setup report. Review/install `docs/company-protocol.md` as Pressly's
   `company-protocols/SSB.md`. Add the new canonical root link to its Link Map.
5. Verify n8n repository access and automatic deployment, activate article
   publishing, and publish one approved new story through Pressly.
6. Configure a fresh media company record only if desired. Original Drive media
   and the existing YouTube channel can be reconnected through the maintained
   operator workflow; website files do not carry credentials or active mappings.
7. Configure the optional media newsroom with the apex origin, `/stories/`,
   YouTube embed support and a company-bound publisher connection after the
   article pipeline is verified.

The local configuration intentionally does not recreate the old `smartsailboat-news`
repository or the retired `deck.smartsailboat.com` publishing destination. For the
complete procedure and acceptance checks, read [PRESSLY_SETUP.md](PRESSLY_SETUP.md).
