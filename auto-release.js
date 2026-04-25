// Auto-update Mac/Windows download links to the latest matching release on
// teale-ai/teale-mono. Mac releases tag as `mac-v*` (asset Teale.dmg);
// Windows tag as `teale-v*` (asset Teale.exe). The pinned URLs in the HTML
// stay as the no-JS / API-failure fallback.
(async () => {
  try {
    const res = await fetch('https://api.github.com/repos/teale-ai/teale-mono/releases?per_page=20');
    if (!res.ok) return;
    const releases = await res.json();
    const mac = releases.find(r => r.tag_name && r.tag_name.startsWith('mac-v'));
    const win = releases.find(r => r.tag_name && r.tag_name.startsWith('teale-v'));
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
