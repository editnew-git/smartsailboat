import assert from 'node:assert/strict';
import { test } from 'node:test';
import { site, validateSite, publicImage } from '../src/lib/site.mjs';

test('configuration rejects credentialed origins, path prefixes, unsafe logos and unsupported routes', () => {
  for (const siteUrl of ['https://user:pass@example.com', 'http://example.com', 'https://example.com/blog', 'https://example.com/?key=secret']) {
    assert.throws(() => validateSite({ ...site, siteUrl }));
  }
  assert.throws(() => validateSite({ ...site, routePrefix: '/other/' }));
  assert.throws(() => validateSite({ ...site, logoPath: '//evil.example/logo.svg' }));
  assert.throws(() => validateSite({ ...site, colors: { ...site.colors, accent: 'red;display:none' } }));
  assert.throws(() => validateSite({ ...site, companyName: 'Your Company' }, { production: true }));
  for (const companyCode of ['ssb', 'SS-B', 'SS_B', '../SSB', ' SSB', 'SSB ']) assert.throws(() => validateSite({ ...site, companyCode }));
  assert.equal(validateSite({ ...site, companyCode: 'SSB2' }).companyCode, 'SSB2');
  assert.equal(validateSite({ ...site, companyCode: 'CHANGE_ME' }).companyCode, 'CHANGE_ME');
  assert.throws(() => validateSite({ ...site, companyCode: 'CHANGE_ME' }, { production: true }));
});

test('image rendering accepts public site paths and HTTPS assets only', () => {
  assert.equal(publicImage('/images/news/cover.jpg'), '/images/news/cover.jpg');
  assert.equal(publicImage('https://images.example.test/cover.jpg'), 'https://images.example.test/cover.jpg');
  for (const value of ['//evil.example/img', 'data:image/svg+xml;base64,eA==', 'javascript:alert(1)', 'file:///private/photo.jpg', '/images/../secret']) assert.equal(publicImage(value), undefined);
});
