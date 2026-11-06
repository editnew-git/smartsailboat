import assert from 'node:assert/strict';
import { test } from 'node:test';
import { cp, mkdir, mkdtemp, readFile, readdir, rm, symlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = fileURLToPath(new URL('../', import.meta.url));
const fixture = (slug, draft = false) => `---\ntitle: "Fixture & story"\ndate: "2026-01-02"\nslug: "${slug}"\nimage: "/images/news/placeholder.jpg"\nexcerpt: "A fixture <with> an & excerpt."\ntags: ["systems"]\ndraft: ${draft}\n---\n\nA published fixture.\n\n[Pressly video](https://www.youtube.com/watch?v=aB0_-Cd1234&start=90 "A fixture video")\n`;

test('isolated build preserves permanent paths, hides drafts, and produces canonical feeds and embeds', { timeout: 120000 }, async () => {
  const before = await readdir(join(root, 'src/content/news'));
  const directory = await mkdtemp(join(tmpdir(), 'pressly-site-test-'));
  try {
    await cp(root, directory, { recursive: true, filter: source => !/(?:^|\/)(node_modules|dist|\.astro|\.git)(?:\/|$)/.test(source) });
    await symlink(join(root, 'node_modules'), join(directory, 'node_modules'), 'dir');
    const config = JSON.parse(await readFile(join(directory, 'site.config.json'), 'utf8'));
    config.siteUrl = 'https://journal.example.test';
    config.routePrefix = '/stories/';
    config.companyCode = 'SSB';
    await writeFile(join(directory, 'site.config.json'), JSON.stringify(config));
    await mkdir(join(directory, 'src/content/news'), { recursive: true });
    await writeFile(join(directory, 'src/content/news/source-file-name.md'), fixture('permanent-public-slug') + '\n<script>alert("BUILD_SCRIPT_PROBE")</script>\n<img src="https://images.example.test/photo.jpg" onerror="BUILD_EVENT_PROBE()">\n<a href="javascript:BUILD_LINK_PROBE()">Unsafe</a>\n<iframe src="https://iframe.wwds.co/?campId=14280&orientation=portrait" title="Safe SAM layout"></iframe>\n');
    await writeFile(join(directory, 'src/content/news/private.md'), fixture('private-draft', true));
    const build = spawnSync(process.execPath, [join(root, 'node_modules/astro/bin/astro.mjs'), 'build'], { cwd: directory, encoding: 'utf8', timeout: 90000 });
    assert.equal(build.status, 0, build.stdout + build.stderr);
    const html = await readFile(join(directory, 'dist/stories/permanent-public-slug/index.html'), 'utf8');
    assert.match(html, /rel="canonical" href="https:\/\/journal\.example\.test\/stories\/permanent-public-slug\/"/);
    assert.match(html, /youtube-nocookie\.com\/embed\/aB0_-Cd1234\?start=90/);
    assert.match(html, /<figcaption>A fixture video<\/figcaption>/);
    assert.doesNotMatch(html, /BUILD_SCRIPT_PROBE|BUILD_EVENT_PROBE|BUILD_LINK_PROBE|onerror=/);
    assert.match(html, /iframe\.wwds\.co\/\?campId=14280&#x26;orientation=portrait|iframe\.wwds\.co\/\?campId=14280&amp;orientation=portrait/);
    assert.match(html, /sam-embed-portrait/);
    assert.doesNotMatch(html, /src="\/images\/news\/placeholder\.jpg"/);
    assert.doesNotMatch(html, /href="https:\/\/example\.com\//);
    await assert.rejects(readFile(join(directory, 'dist/stories/private-draft/index.html')));
    await assert.rejects(readFile(join(directory, 'dist/stories/source-file-name/index.html')));
    const sitemap = await readFile(join(directory, 'dist/sitemap.xml'), 'utf8');
    const rss = await readFile(join(directory, 'dist/rss.xml'), 'utf8');
    const index = await readFile(join(directory, 'dist/stories/index.html'), 'utf8');
    assert.match(sitemap, /https:\/\/journal\.example\.test\/stories\/permanent-public-slug\//);
    assert.match(rss, /Fixture &amp; story/);
    assert.match(rss, /&lt;with&gt; an &amp; excerpt/);
    assert.match(index, /permanent-public-slug/);
    for (const text of [sitemap, rss, index]) assert.doesNotMatch(text, /private-draft|source-file-name/);
    assert.match(await readFile(join(directory, 'dist/robots.txt'), 'utf8'), /Sitemap: https:\/\/journal\.example\.test\/sitemap\.xml/);
    assert.match(await readFile(join(directory, 'dist/404.html'), 'utf8'), /name="robots" content="noindex"/);
    assert.deepEqual(await readdir(join(root, 'src/content/news')), before);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
