// Auto-update Mac/Windows download links to the newest matching release on
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

    const mac = newestReleaseWithAsset('Teale.dmg');
    const win = newestReleaseWithAsset('Teale.exe');
    if (mac) {
      const url = `https://github.com/teale-ai/teale-mono/releases/download/${mac.tag_name}/Teale.dmg`;
      document.querySelectorAll('a[data-platform="mac"]').forEach(el => { el.href = url; });
    }
    if (win) {
      const url = `https://github.com/teale-ai/teale-mono/releases/download/${win.tag_name}/Teale.exe`;
      document.querySelectorAll('a[data-platform="win"]').forEach(el => { el.href = url; });
    }
  } catch (e) {
    // Network error or rate limit — keep the pinned fallback URL.
  }
})();
