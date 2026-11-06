# Smart Sail Boat launch values

| Item | Value |
| --- | --- |
| Public site | `https://smartsailboat.com` |
| Staging preview | `https://ssb-preview.187.124.242.106.sslip.io` |
| Apex DNS target at cutover | A record `187.124.242.106` |
| Article archive | `/stories/` |
| Permanent article URL | `https://smartsailboat.com/stories/{slug}/` |
| Internal collection | `src/content/news/` |
| Company / code | `Smart Sail Boat` / `SSB` |
| Slack channel | `pressly_smartsailboat` |
| Article authority | Existing shared Pressly Master Release Log |
| Protocol | Pressly workspace `company-protocols/SSB.md` |
| Public repository | `editnew-git/smartsailboat` |
| Branch | `main` |
| Static output / container port | `dist` / `80` |
| Logo | `/images/brand/smart-sail-boat-logo.png` |
| Discovery | `/sitemap.xml`, `/rss.xml`, `/robots.txt` |

Use the [setup runbook](SETUP_RUNBOOK.md) for the sequence and verification gates.
This publication starts without the old articles or vessel-profile routes.
Original business records and source media remain in their owning systems.

Production DNS and welcome-story approval are separate launch gates. Site
configuration is not evidence that either is complete. Newsroom delivery remains
disabled until the canonical public site and first approved publication work.

At cutover, retain `www` as a CNAME to `smartsailboat.com` and preserve mail/TXT
records. The temporary preview is excluded from indexing and retains the apex
canonical URLs.
