// All public content lives in /public/data/*.json.
// Vite serves the /public folder at the site root, so this just becomes a fetch.

const BASE = import.meta.env.BASE_URL || "./";

export async function loadData(name) {
  const res = await fetch(`${BASE}data/${name}.json`);
  if (!res.ok) return [];
  return res.json();
}

export function assetUrl(p) {
  if (!p) return "";
  if (p.startsWith("http")) return p;
  // Stored paths from the admin look like "uploads/abc.jpg"
  return `${BASE}${p.replace(/^\//, "")}`;
}
