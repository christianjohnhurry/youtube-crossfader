const ID_RE = /^[A-Za-z0-9_-]{11}$/;
const YOUTUBE_HOSTS = new Set([
  "youtube.com",
  "www.youtube.com",
  "m.youtube.com",
  "music.youtube.com",
]);

/**
 * Extract an 11-character YouTube video ID from user input.
 * Accepts watch?v=, youtu.be/, shorts/ URLs and bare video IDs.
 * Returns null if no valid ID is found.
 */
export function parseVideoId(input) {
  if (typeof input !== "string") return null;
  const text = input.trim();
  if (ID_RE.test(text)) return text;

  let url;
  try {
    url = new URL(/^[a-z][a-z0-9+.-]*:\/\//i.test(text) ? text : `https://${text}`);
  } catch {
    return null;
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") return null;

  const host = url.hostname.toLowerCase();
  let candidate = null;
  if (host === "youtu.be") {
    candidate = url.pathname.split("/")[1];
  } else if (YOUTUBE_HOSTS.has(host)) {
    const parts = url.pathname.split("/").filter(Boolean);
    if (parts[0] === "watch") candidate = url.searchParams.get("v");
    else if (parts[0] === "shorts") candidate = parts[1];
  }
  return candidate && ID_RE.test(candidate) ? candidate : null;
}
