# Set up a new Pressly publication

This is an operator checklist for a new publication. Building this repository does
not create provider resources or register a company with Pressly. Complete each
step against the intended account and keep the resulting immutable resource IDs
in your private operations records.

## 1. Configure the local copy

Edit `site.config.json`. Set the public HTTPS origin without a path or trailing
slash, company name/code, exact Slack channel name, GitHub owner/repository and
visual identity. Company names must match exactly across Pressly's registries.
Use `/stories/` for `SSB`, `/news/` for other company codes, matching the current
Pressly CLI. Changing that contract requires coordinated CLI/site changes.

The site accepts the shared `news` collection in `src/content/news/`. Published
Markdown uses `title`, `date`, permanent `slug`, `image`, `excerpt`, `tags` and
`draft`; supporting `subheadline` and `location` remain optional. Keep generated
article filenames and slugs stable. Drafts are excluded from listings, article
routes, RSS and sitemap. Examples belong outside the content collection.

Run `npm run pressly:setup` to print the exact proposed registry values. Fill the
public contact details and approved boilerplate before entering Settings. An empty
contact field means no contact was supplied, not permission to invent one.

## 2. Create the GitHub repository

Create the chosen repository, normally with `main` as its default branch. Push
the source and lockfile after the local tests and build pass. Do not include
`node_modules`, `dist`, `.astro`, credentials, `.env`, raw footage, transcripts,
private evidence or backup files.

Give the existing n8n GitHub connection write access to this exact repository.
Give the hosting GitHub integration read/build access. These are separate grants.
If branch protection requires pull requests, either provide the publishing bot's
reviewed bypass or adapt the sync workflow; a rule that blocks content commits
will stop publishing. Verify the actual credential and branch used by n8n.

## 3. Configure hosting

The supplied multi-stage Dockerfile installs locked dependencies, builds Astro,
and serves `dist` with nginx. The nginx configuration serves nested static paths
and a real 404; it does not turn missing articles into a successful homepage.

For Dokploy, create one application from the selected GitHub repository/branch,
choose the Dockerfile build with repository root as context, set the domain's
container port to `80`, and enable automatic deployments for changes on `main`.
Do not mount a persistent volume over the built web root. For another static
host, build with `npm ci && npm run build` and publish `dist`.

Check a deployment on a temporary preview hostname before moving production DNS.
Keep previews out of search indexes using the host's access/indexing controls.
The production `siteUrl` controls canonical links and feeds even in a preview.

## 4. Configure DNS and HTTPS

At the authoritative DNS provider, point the intended hostname to the hosting
target. On the existing VPS, use the verified VPS IPv4 address in an A record;
only add AAAA if the entire hosting route supports that IPv6 address. Remove
conflicting records for that exact hostname. Keep unrelated mail/TXT records.

For an apex such as `example.com`, configure `@` for the apex and choose whether
`www.example.com` redirects to it. For a subdomain, configure only that host.
Register every served/redirected host with the edge and hosting router so TLS
certificates and the intended application match.

This installation places Caddy in front of Dokploy/Traefik. Confirm the exact
hostname is routed at both layers and follow the installed certificate ownership
model; do not add a second conflicting public listener. The old site's DNS target
does not establish that a new apex domain has been routed or certified.

Verify HTTPS, the canonical host, `/`, the configured article archive, an article
deep link and a missing-page 404. Redirect the alternate host to the selected
canonical host. Decide explicitly whether a retired hostname should redirect or
be removed; removing it alone breaks its old links.

## 5. Register the company in Pressly

Use the existing Pressly Master Release Log, unless a separately reviewed
architecture change establishes another authority. It has three required tabs:

| Tab | Setup |
| --- | --- |
| Channel Registry | Company; exact Channel Name; Company Code; Site URL; GitHub Repo; GitHub Owner; Active?; Notes |
| Settings | Company; Boilerplate; Default Contact Name; Default Contact Email; Default Contact Phone; Logo Path; Site Base URL |
| Release Registry | Existing shared 25-column article schema; start this company's new publication without importing old releases |

The local setup report supplies proposed rows. Use an operator-supported setup
workflow or review the exact entries in the spreadsheet's administrator interface.
Ordinary Pressly chat has no company-provisioning authority. Keep `Active?` at
`no` during setup, and set it to `yes` only when the dependencies are ready.
Do not rename headers or add a second article database to make the site work.

Install the reviewed company protocol as
`workspace-pressly/company-protocols/<Company Code>.md`. Add approved canonical
links to the maintained Link Map. The protocol controls allowed public content,
required tags, tone and evidence selection; it cannot bypass publication approval.

Create or reuse the intended Slack channel, invite the correct Pressly app and
verify its exact channel access. Article context currently matches the channel
name; media access separately uses immutable channel and actor IDs. Renaming a
channel requires updating all applicable mappings.

From the Pressly workspace, verify:

```sh
npm run --silent pressly -- context --channel YOUR_EXACT_CHANNEL
```

Check the returned company, company code, protocol path, site URL, repository,
owner and Settings result. Preserve Pressly's existing runtime tool policy and
intentional `skills: []`; a website does not need a new persistent agent.

## 6. Verify n8n synchronization

Check the existing shared Pressly sync rather than creating a competing writer.
Verify its Google connection can access the Release Log and its GitHub connection
can write the selected repository and branch. Confirm company filtering and the
Channel Registry lookup, generated frontmatter, image persistence and content
paths against this template.

Pressly owns `Status`. n8n owns `Synced Status`, `Last Updated`, `Last Synced
Commit`, `Image Path` and `Synced Hash`; `Sync Error` carries diagnostics. Never
manually mark a release synced to hide a failed delivery.

Confirm an n8n content commit triggers the hosting build. Treat Sheet mutation,
Git commit, deployment success and a working public URL as separate checkpoints.
Configure monitoring and the documented retry path for failed syncs/builds.

For a replacement repository, do not assume unchanged Published rows will be
replayed automatically: synchronization hashes may skip them. A deliberate fresh
start uses fresh releases; importing old releases requires a separate reviewed
backfill. Never reset a shared workflow or another company's records.

## 7. Configure images and optional video projects

Durable article uploads use Pressly's server-side media connection. Required
values such as `PRESSLY_MEDIA_BASE_URL` and `PRESSLY_MEDIA_TOKEN` stay in the
protected runtime environment. A cover's Source Image URL is intake; n8n writes
the final `/images/news/{slug}.jpg` path. Inline images use durable public URLs.
Supply a real approved logo and configure the company's branded image profile
through the maintained image administration workflow if automatic covers are wanted.

Video projects are optional and require a separate central media company record:
exact Slack channel/actor grants, a company-scoped private Drive folder, an
implemented platform connection (currently YouTube), protected editorial
references, and a company-bound publisher credential if articles are requested.
The initial record must match the installed media schema; follow its current
migration and preview/apply instructions instead of copying an old profile.

Only after the article pipeline and renderer work, enable the media newsroom
with the correct `siteUrl`, `routePrefix` and `embedProviders: ["youtube"]`.
`npm run pressly:setup` prints an inactive proposal. Website configuration cannot
enable this capability, and enabling it does not automatically select an article
for every video project.

Use Pressly's maintained `video-embed` preview/apply workflow. It writes the
controlled `[Pressly video]` Markdown marker. The included renderer supports
canonical YouTube IDs and bounded start times with a responsive privacy-enhanced
player. Raw Drive previews and arbitrary video iframe HTML are not substitutes.
The original requester must approve the exact media review package through the
trusted button before public delivery. Test-only footage remains private.

## 8. Accept and launch

Run `npm test` and `npm run build`. The fixture build tests use temporary content
and must leave the real collection empty. Verify search/filter behavior, mobile
layout, keyboard focus, cover alt text, long titles and article formatting.

Use a real, explicitly approved first article to check the whole chain: Draft
stays private; publication creates exactly one file and page; images and video
load; title/body edits keep the same URL; repeated delivery creates no duplicate;
unpublishing removes the page and feed entries. Match the synced commit with the
successful hosting deployment and read the public URL back.

Check `/robots.txt`, `/sitemap.xml`, `/rss.xml`, canonical/social metadata and
alternate-host redirects. Submit the production sitemap through the site's search
console account. Document the last known-good deployment and how to roll back.

Browser knowledge chat, analytics, newsletters and advertising are separate
integrations. If chat is added, index only approved public material, cite sources,
remove unpublished pages from retrieval, keep credentials server-side and apply
request limits. None of these are required for the basic Pressly article pipeline.
