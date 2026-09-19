const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const links = Object.fromEntries(['mac', 'win', 'linux'].map(platform => [platform, [{ href: '' }]]));
const releases = [
  { tag_name: 'mac-v2026.09.19.0334', published_at: '2026-09-19T03:40:00Z', draft: false, prerelease: false,
    assets: [{ name: 'Teale.dmg', browser_download_url: 'https://example/mac.dmg' }] },
  { tag_name: 'mac-v2026.09.20.0000', published_at: '2026-09-20T00:00:00Z', draft: false, prerelease: false,
    assets: [{ name: 'Teale.exe', browser_download_url: 'https://example/wrong.exe' }] },
  { tag_name: 'teale-2026.09.19.1200', published_at: '2026-09-19T04:00:00Z', draft: false, prerelease: false,
    assets: [{ name: 'Teale.exe', browser_download_url: 'https://example/current.exe' }] },
  { tag_name: 'teale-2026.09.18.1200', published_at: '2026-09-18T04:00:00Z', draft: false, prerelease: false,
    assets: [{ name: 'Teale.exe', browser_download_url: 'https://example/old.exe' }] },
];

const context = {
  fetch: async () => ({ ok: true, json: async () => releases }),
  document: { querySelectorAll: selector => links[selector.match(/"([^"]+)"/)[1]] },
};
vm.runInNewContext(fs.readFileSync('auto-release.js', 'utf8'), context);
setImmediate(() => {
  assert.equal(links.mac[0].href, 'https://example/mac.dmg');
  assert.equal(links.win[0].href, 'https://example/current.exe');
  assert.equal(links.linux[0].href, '');
  console.log('auto-release platform discovery ok');
});
