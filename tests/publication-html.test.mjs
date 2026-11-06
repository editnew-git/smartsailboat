import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createMarkdownProcessor } from '@astrojs/markdown-remark';
import { publicationPlugins } from '../src/lib/publication-html.mjs';

const processor = await createMarkdownProcessor({ rehypePlugins: publicationPlugins });

test('publication HTML strips scripts, events, CSS, unsafe protocols and DOM clobbering', async () => {
  const { code } = await processor.render(`
<script>alert('SCRIPT_PROBE')</script>
<img src="https://images.example.test/photo.jpg" onerror="alert('EVENT_PROBE')" style="position:fixed;inset:0">
<a href="javascript:alert('LINK_PROBE')">Unsafe link</a>
<a href="java&#x73;cript:alert('ENTITY_PROBE')">Encoded link</a>
<img src="data:image/svg+xml;base64,PHN2Zz4=" />
<svg onload="alert('SVG_PROBE')"><script>alert('NESTED_PROBE')</script></svg>
<style>body { display: none; }</style>
<h2 id="location">Safe heading</h2>
`);
  assert.doesNotMatch(code, /<script|<style|<svg|onerror|onload|style=|javascript:|data:image|SCRIPT_PROBE|EVENT_PROBE|LINK_PROBE|ENTITY_PROBE|SVG_PROBE|NESTED_PROBE/);
  assert.match(code, /src="https:\/\/images\.example\.test\/photo\.jpg"/);
  assert.match(code, /id="user-content-location"/);
});

test('Markdown, safe HTML tables, and approved YouTube markers survive the safety pipeline', async () => {
  const { code } = await processor.render(`## What changed

**Approved** text and [a source](https://example.test/source).

<table><thead><tr><th>System</th></tr></thead><tbody><tr><td>Updated</td></tr></tbody></table>

[Pressly video](https://www.youtube.com/watch?v=aB0_-Cd1234&start=90 "A safe video")`);
  assert.match(code, /<h2[^>]*>What changed<\/h2>/);
  assert.match(code, /<strong>Approved<\/strong>/);
  assert.match(code, /<table>/);
  assert.match(code, /<td>Updated<\/td>/);
  assert.match(code, /class="pressly-video"/);
  assert.match(code, /class="pressly-video-player"/);
  assert.match(code, /youtube-nocookie\.com\/embed\/aB0_-Cd1234\?start=90/);
  assert.match(code, /<figcaption>A safe video<\/figcaption>/);
});

test('canonical SAM embeds survive while author-supplied iframe privileges are discarded', async () => {
  for (const orientation of ['', '&orientation=landscape', '&orientation=portrait']) {
    const { code } = await processor.render(`<iframe src="https://iframe.wwds.co/?campId=14280${orientation}" title="Layout" onload="alert(1)" srcdoc="&lt;script&gt;alert(1)&lt;/script&gt;" allow="camera; microphone; geolocation" allowfullscreen></iframe>`);
    assert.match(code, /iframe\.wwds\.co\/\?campId=14280/);
    assert.match(code, /title="Layout"/);
    assert.match(code, /loading="lazy"/);
    assert.doesNotMatch(code, /onload|srcdoc|camera|microphone|geolocation|alert/);
    if (orientation.endsWith('portrait')) assert.match(code, /sam-embed-portrait/);
  }
});

test('unapproved iframe destinations and malformed provider URLs stop publication builds', async context => {
  // Astro logs parse failures before rejecting; these failures are intentional.
  context.mock.method(console, 'error', () => {});
  for (const src of [
    'https://evil.example/embed', 'javascript:alert(1)', '//iframe.wwds.co/?campId=123',
    'https://iframe.wwds.co.evil.example/?campId=123', 'https://iframe.wwds.co@evil.example/?campId=123',
    'https://iframe.wwds.co/?campId=123&url=https://evil.example',
    'https://iframe.wwds.co/?campId=123&campId=456', 'https://iframe.wwds.co/?campId=123&orientation=invalid',
    'https://www.youtube-nocookie.com/embed/aB0_-Cd1234?autoplay=1',
    'https://www.youtube-nocookie.com/embed/aB0_-Cd1234?start=2147483648',
  ]) await assert.rejects(processor.render(`<iframe src="${src}"></iframe>`), /Unapproved publication iframe/, src);
});
