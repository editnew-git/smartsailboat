# Smart Sail Boat: template to publication

This guide records the setup procedure for a fresh Smart Sail Boat publication.
It starts with using an existing template. Private provider IDs, approval receipts,
source-record citations, credential locations and detailed verification evidence
belong in the operator's private implementation record.

## 1. Establish the starting point

For a replacement publication, first back up and retire only its old website,
repository, deployment, publishing registrations and media configuration. Disable
company writers and verify no in-flight deliveries before removing registrations.
Preserve business/vessel records, original Drive media and the YouTube channel.
Keep reset evidence privately; do not restore an entire shared database or
spreadsheet over another company's newer work.

This installation begins after that reset. The retired `deck` destination is not
reused. The permanent origin is `https://smartsailboat.com`.

## 2. Use the existing Astro template

Create a new project directory from the reusable `pressly-template`, excluding
its `.git`, `node_modules`, `dist`, `.astro`, environment files and runtime data.
Initialize independent version control. For this publication the existing
`smartsailboat` checkout is already that template instance; do not overwrite it.

Set `site.config.json` to the [launch values](SMARTSAILBOAT.md), retain the approved
logo and configure the public description and colors. Keep `src/content/news/`
as the internal collection even though public articles use `/stories/`.

```sh
npm ci
npm run check:setup
npm test
npm run build
npm run pressly:setup
```

The setup report proposes inactive Channel Registry and Settings rows. It is
neither a live registration nor proof of connectivity. Preserve the lockfile;
do not commit dependencies, build output, private drafts or credentials.

## 3. Create and connect the repository

Create the public GitHub repository `editnew-git/smartsailboat` with branch `main`,
then push the reviewed website source. Configure the existing n8n GitHub
connection for content writes and Dokploy's GitHub integration for source reads.
Check both integrations independently.

## 4. Deploy the preview

Create one Smart Sail Boat application in the existing Newsroom production
environment. Select the repository and `main`, the supplied Dockerfile,
repository-root context, container port `80`, and automatic deployment on push.
Do not mount a volume over the generated web root.

In this installation Caddy terminates public HTTPS and proxies to Traefik.
Configure the preview application domain as internal HTTP with no second TLS
certificate owner. Add only the preview hostname at Caddy, with
`X-Robots-Tag: noindex, nofollow`. Keep `smartsailboat.com` in Astro's canonical
configuration. A preview hostname is not the production URL.

Verify HTTPS, `/`, `/stories/`, the logo, RSS, sitemap, robots and a missing-page
404. Test published/draft fixtures and video rendering locally without committing
sample articles. Check the actual deployment result and commit, not just build
submission.

## 5. Register Pressly

Use the existing shared Pressly Master Release Log; do not create another article
database. Install the reviewed SSB protocol and add the root site to the canonical
Link Map. Leave unverified public contact fields empty.

Prepare a private JSON file containing `spreadsheetId`, `channelRegistry`, and
`settings`, taking the latter two objects from `npm run pressly:setup`.
Run the maintained operator command from the Pressly workspace:

```sh
npm run --silent pressly:operator -- preview --action provision \
  --config /PRIVATE/ssb-registration.json --backup-dir /PRIVATE/new-plan-directory
npm run --silent pressly:operator -- apply \
  --plan /PRIVATE/new-plan-directory/plan.json --token RETURNED_TOKEN
```

Review exact company/channel/repository values before apply. Provision creates an
inactive registration. The command rejects conflicts and partial registrations,
preserves other companies, and verifies its writes. Reuse the original plan to
reconcile an uncertain result; never create duplicates blindly.

After preview and repository readiness, use the same preview/apply procedure with
`--action enable` and a new plan directory. Verify:

```sh
npm run --silent pressly -- context --channel pressly_smartsailboat
```

The returned company, code, repository, protocol, Settings and canonical URL must
match the launch values. Enabling context permits drafting; it does not approve
publication. Keep the welcome story in Draft while DNS is pending.

## 6. Verify the shared n8n writer

Use the existing Pressly Sync and Main workflows. The sync polls the shared log;
Main resolves the active company and repository. For SSB blogs, omit an empty
Media Contact footer and display only supplied contact fields. Preserve other
companies' output and the shared frontmatter/content paths.

Test formatting with synthetic data; do not execute the production workflow as a
test against unrelated releases. Publish the reviewed workflow version and verify
that its active version matches. n8n owns sync status, commit, hash and final image
path fields. Never fill those fields manually to make a delivery appear complete.

## 7. Connect images and video

Through the installed media administration CLI, back up protected state and
preview/apply a disabled schema-compatible SSB record. Bind the exact Slack
channel, existing authorized people, private Drive root, YouTube account and
company-specific publisher connection. Reuse original media without moving or
publishing it. Verify Drive ancestry/access after the company record exists.

Restore only the company's verified YouTube credential privately and create a
fresh publisher environment through `setup-publisher-env`. Import the approved
logo with `image-asset-import`; use returned asset IDs rather than guessed paths.
Configure automatic private cover preparation, source-photo preference, Poppins,
deep blue `#013650`, accent blue `#00A1DD`, and exact-logo preservation. Newsroom
covers have no headline by default; thumbnails/posters do. Generated illustrations
require disclosure.

Validate the module and company before enabling images/video. Verify tool access,
provider identity and readiness separately from actual generation or publishing.
Only YouTube publishing is currently implemented; downloadable highlights do not
imply Shorts uploading or other social-network integrations.

While DNS is pending, keep the live newsroom configuration disabled. Its schema
requires `siteUrl: null` and `embedProviders: []` when disabled; retain `/stories/`
and record the future apex/YouTube values in a private activation proposal.

## 8. Prepare the first story

Refresh the business Master Log and select only public context about the
publication's purpose. Do not import private operational evidence or claim that
planned vessel work has been completed. Search Pressly before creating the
welcome story, run import dry-run, create one Draft, and validate it. Present the
exact text for approval; an approved draft still requires publication intent.

Source uploads and image previews do not authorize publication. A real video
package requires its original requester's revision-bound review-button approval.

## 9. Complete DNS and launch

When the DNS provider is available, change only the apex A record to the verified
hosting IPv4 address. Preserve `www` pointing to the apex and all unrelated
mail/TXT records. Lower TTL if available and allow existing cached TTLs to expire.
Add apex HTTPS routing and a `www` redirect preserving the request path. Check
authoritative and public DNS, certificate issuance and the correct application.

After DNS verification and explicit approval of the welcome story, publish with
Pressly. Observe each checkpoint: release lifecycle, n8n content/image commit,
hosting deployment, public article, RSS and sitemap. Do not bypass a failed sync
with a manual content commit. Retry only the unfinished effect using its original
record or operation identity.

Enable newsroom delivery through a reviewed media configuration with
`siteUrl: "https://smartsailboat.com"`, `routePrefix: "/stories/"`, and
`embedProviders: ["youtube"]`. Verify the first requested, approved video/article
package separately. Remove the preview route after production checks pass.

## 10. Maintain and recover

Update generated stories through Pressly. Inspect release sync errors, workflow
executions, deployment status and media jobs when delivery stops. Preserve the
last successful source/deployment and private receipts. Roll back presentation
using a known good site revision; do not replace shared operational state with a
stale backup. Disable only SSB when isolating an SSB failure.

Keep the private implementation record current with completed steps, outstanding
DNS/content gates, actual verification results and retry instructions. Do not
label authentication, deployment submission or configuration as proof that a
public article/video has been delivered. Knowledge chat remains separate work.
