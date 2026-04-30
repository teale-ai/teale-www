// Auto-update Mac/Windows/Linux download links to the newest matching release on
// teale-ai/teale-mono. Pick releases by asset name instead of tag prefix so
// link updates survive tag naming changes. The pinned URLs in the HTML stay as
// the no-JS / API-failure fallback.
(async () => {
  try {
    const res = await fetch('https://api.github.com/repos/teale-ai/teale-mono/releases?per_page=20');
    if (!res.ok) return;
    const releases = await res.json();
    const newestReleaseWithAsset = (assetName) => releases
      .filter(r => r.tag_name && Array.isArray(r.assets) && r.assets.some(a => a.name === assetName))
      .sort((a, b) => new Date(b.published_at || 0) - new Date(a.published_at || 0))[0];

    [
      ['mac', 'Teale.dmg'],
      ['win', 'Teale.exe'],
      ['linux', 'Teale-linux-x86_64.tar.gz'],
    ].forEach(([platform, assetName]) => {
      const release = newestReleaseWithAsset(assetName);
      if (!release) return;
      const url = `https://github.com/teale-ai/teale-mono/releases/download/${release.tag_name}/${assetName}`;
      document.querySelectorAll(`a[data-platform="${platform}"]`).forEach(el => { el.href = url; });
    });
  } catch (e) {
    // Network error or rate limit — keep the pinned fallback URL.
  }
})();
