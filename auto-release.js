// Resolve each platform to the newest published release that actually carries
// its asset. This intentionally does not use GitHub /releases/latest: that
// redirect follows one repository-wide release and can point Windows users at
// a macOS-only build. Pinned HTML links remain the no-JS/API-failure fallback.
(async () => {
  const RELEASES_API = 'https://api.github.com/repos/teale-ai/teale-mono/releases?per_page=50';
  const platforms = [
    ['mac', 'Teale.dmg', /^mac-v/],
    ['win', 'Teale.exe', /^teale-/],
    ['linux', 'Teale-linux-x86_64.tar.gz', /^teale-/],
  ];

  try {
    const res = await fetch(RELEASES_API, {
      headers: { Accept: 'application/vnd.github+json' },
    });
    if (!res.ok) return;
    const releases = await res.json();
    if (!Array.isArray(releases)) return;

    const newestAsset = (assetName, tagPattern) => releases
      .filter(release => !release.draft && !release.prerelease &&
        typeof release.tag_name === 'string' && tagPattern.test(release.tag_name) &&
        Array.isArray(release.assets))
      .sort((a, b) => new Date(b.published_at || 0) - new Date(a.published_at || 0))
      .flatMap(release => release.assets
        .filter(asset => asset.name === assetName && typeof asset.browser_download_url === 'string')
        .map(asset => ({ release, asset })))[0];

    platforms.forEach(([platform, assetName, tagPattern]) => {
      const match = newestAsset(assetName, tagPattern);
      if (!match) return;
      document.querySelectorAll(`a[data-platform="${platform}"]`)
        .forEach(link => { link.href = match.asset.browser_download_url; });
    });
  } catch (_) {
    // Network errors and rate limits keep the pinned fallback links intact.
  }
})();
