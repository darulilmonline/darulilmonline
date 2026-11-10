/* দারুল ইলম অনলাইন — অফলাইন সার্ভিস ওয়ার্কার — v48 */
const V = "dio-v48";
const PAGES = V + "-pages", DATA = "dio-data", STATIC = V + "-static", FONTS = "dio-fonts";
const SHELL = ["/", "/courses", "/learn", "/library", "/apps", "/guide-parent", "/guide-teacher", "/offline", "/search", "/cert.js",
  "/favicon.svg", "/favicon.png", "/apple-touch-icon.png", "/icon-192.png", "/icon-512.png", "/manifest.webmanifest"];
const SB = "https://nlylwrbxejjxnfljcztv.supabase.co";

self.addEventListener("install", e => {
  e.waitUntil(caches.open(PAGES).then(c => Promise.all(SHELL.map(u => c.add(new Request(u, { cache: "reload" })).catch(() => {})))).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith("dio-v") && !k.startsWith(V)).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

const NOCACHE = /^\/(admin|api\/|m\/)/;
function shellFor(path) {
  if (path.startsWith("/learn")) return "/learn";
  if (path.startsWith("/c/")) return "/course";
  if (path.startsWith("/library/")) return "/item";
  return null;
}
async function pageNet(req) {
  const url = new URL(req.url), c = await caches.open(PAGES);
  try {
    const res = await fetch(req);
    if (res.ok && res.type === "basic") c.put(url.pathname, res.clone());
    return res;
  } catch (_) {
    return (await c.match(url.pathname, { ignoreSearch: true, ignoreVary: true }))
      || (shellFor(url.pathname) && await c.match(shellFor(url.pathname), { ignoreVary: true }))
      || (await c.match("/offline", { ignoreVary: true }))
      || new Response("অফলাইন", { status: 503, headers: { "Content-Type": "text/plain; charset=utf-8" } });
  }
}
async function dataNet(req) {
  const c = await caches.open(DATA);
  try {
    const res = await fetch(req);
    if (res.ok) c.put(req.url, res.clone());
    return res;
  } catch (_) {
    const hit = await c.match(req.url, { ignoreVary: true });
    if (hit) return hit;
    throw _;
  }
}
async function cacheFirst(req, name) {
  const c = await caches.open(name), hit = await c.match(req, { ignoreVary: true });
  if (hit) return hit;
  const res = await fetch(req);
  if (res.ok || res.type === "opaque") c.put(req, res.clone());
  return res;
}
async function swr(req) {
  const c = await caches.open(STATIC), hit = await c.match(req, { ignoreVary: true });
  const net = fetch(req).then(res => { if (res.ok) c.put(req, res.clone()); return res; }).catch(() => hit);
  return hit || net;
}

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin === location.origin) {
    if (NOCACHE.test(url.pathname) || url.pathname === "/sw.js") return;
    const isPage = req.mode === "navigate" || (req.headers.get("accept") || "").includes("text/html") || !/\.[a-z0-9]+$/i.test(url.pathname);
    e.respondWith(isPage ? pageNet(req) : swr(req));
    return;
  }
  if (url.origin === SB && url.pathname.startsWith("/rest/v1/") && !url.pathname.startsWith("/rest/v1/rpc/")) { e.respondWith(dataNet(req)); return; }
  if (url.host === "fonts.googleapis.com" || url.host === "fonts.gstatic.com" || url.host === "cdnjs.cloudflare.com") { e.respondWith(cacheFirst(req, FONTS)); return; }
});
