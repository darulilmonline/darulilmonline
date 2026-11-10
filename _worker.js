// দারুল ইলম অনলাইন — YouTube ভিডিও থেকে বাংলা লেখা ও সারাংশ (Gemini)
// Cloudflare Pages (_worker.js): POST /api/ai-video   body: {"url":"https://youtu.be/..."}
// বাকি সব ঠিকানা আগের মতো সাধারণ পেজ দেখায়।
// শুধু admin (Supabase-এ লগইন করা) ব্যবহার করতে পারে। Gemini চাবি থাকে Cloudflare-এর গোপন সেটিংয়ে (GEMINI_API_KEY)।

const SB = "https://nlylwrbxejjxnfljcztv.supabase.co";
const PK = "sb_publishable_N2xa0vKr70Ou1S2zlieZTw_qVqrImfg";

const PROMPT = `You are an expert transcriber and translator working for an Islamic education website in Bangladesh. Carefully listen to and watch this YouTube video.

1. Detect the main spoken language: "bn", "en", "ar", "ur" or "other".
2. Produce a COMPLETE and FAITHFUL Bangla (Bengali script) transcript of everything said, in order.
   - If the speech is Bangla, transcribe it accurately in standard Bangla spelling.
   - If it is English, Arabic, Urdu or any other language, translate it faithfully into clear, natural Bangla. Do not shorten or summarise in this part.
3. When Quran verses, hadith text, duas or Arabic phrases are recited, write the Arabic exactly in Arabic script, followed by its Bangla meaning in parentheses. Never invent, complete or "correct" a verse. If you are not certain of the exact words, write [অস্পষ্ট].
4. Do not add anything that is not said in the video. Mark unclear audio as [অস্পষ্ট]. Keep the speaker's meaning and Islamic terminology (e.g. নামাজ, তাজবীদ, মাখরাজ) as used in Bangladesh.
5. Split the transcript into segments of roughly 20–60 seconds. Each segment starts at its timestamp in MM:SS (or H:MM:SS for videos over an hour).
6. Write a concise Bangla summary of 4–7 sentences covering the main teaching of the video, and 3–6 short key takeaways in Bangla.

Return ONLY valid JSON, no markdown, in exactly this shape:
{"source_language":"bn","title_bn":"...","summary_bn":"...","key_points_bn":["...","..."],"transcript":[{"t":"00:00","text":"..."}]}`;

const json = (o, s = 200) =>
  new Response(JSON.stringify(o), { status: s, headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" } });

// Gemini দিয়ে ভিডিও থেকে লেখা তৈরি — সফল হলে ফলাফল, না হলে {error}
async function runAI(url, env) {
  const m = String(url || "").match(/(?:youtu\.be\/|v=|embed\/|shorts\/|live\/)([\w-]{11})/);
  if (!m) return { error: "এটা সঠিক YouTube লিংক নয়" };
  const yt = "https://www.youtube.com/watch?v=" + m[1];
  const model = env.GEMINI_MODEL || "gemini-flash-latest";
  const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
    method: "POST",
    headers: { "content-type": "application/json", "x-goog-api-key": env.GEMINI_API_KEY },
    body: JSON.stringify({
      contents: [{ parts: [{ file_data: { file_uri: yt } }, { text: PROMPT }] }],
      generationConfig: { responseMimeType: "application/json", temperature: 0.2, maxOutputTokens: 32768 }
    })
  });
  const d = await r.json().catch(() => ({}));
  if (!r.ok) return { error: "Gemini: " + ((d.error && d.error.message) || r.status) };
  const cand = (d.candidates || [])[0] || {};
  const text = ((cand.content && cand.content.parts) || []).map(p => p.text || "").join("");
  if (!text) return { error: "Gemini কোনো লেখা দেয়নি (" + (cand.finishReason || "অজানা কারণ") + ")। ভিডিওটি Public কি না দেখুন।" };
  let out;
  try { out = JSON.parse(text); }
  catch (_) {
    try { const a = text.indexOf("{"), b = text.lastIndexOf("}"); out = JSON.parse(text.slice(a, b + 1)); }
    catch (__) { return { error: "Gemini-এর লেখা অসম্পূর্ণ এসেছে (" + (cand.finishReason || "") + ")। ভিডিও খুব লম্বা হলে ছোট অংশে ভাগ করে চেষ্টা করুন।" }; }
  }
  return { ok: true, model, finish: cand.finishReason || "", ...out };
}

async function aiVideo(request, env, ctx) {
  // ১) শুধু লগইন করা admin
  const auth = request.headers.get("Authorization") || "";
  if (!auth.startsWith("Bearer ")) return json({ error: "লগইন প্রয়োজন" }, 401);
  const who = await fetch(SB + "/auth/v1/user", { headers: { apikey: PK, Authorization: auth } });
  if (!who.ok) return json({ error: "অনুমতি নেই — admin-এ আবার লগইন করুন" }, 401);
  if (!env.GEMINI_API_KEY) return json({ error: "Cloudflare-এ GEMINI_API_KEY সেট করা হয়নি" }, 500);
  let url;
  try { ({ url } = await request.json()); } catch (_) { return json({ error: "ভুল অনুরোধ" }, 400); }

  // ২) সাথে সাথে উত্তর শুরু, Gemini কাজ করার সময় প্রতি ১০ সেকেন্ডে একটা ফাঁকা অক্ষর পাঠানো
  //    (Cloudflare ১০০ সেকেন্ড চুপ থাকলে সংযোগ কেটে দেয় — তাই এই ব্যবস্থা)
  const { readable, writable } = new TransformStream();
  const w = writable.getWriter(), enc = new TextEncoder();
  w.write(enc.encode(" ")).catch(() => {});
  const beat = setInterval(() => { w.write(enc.encode(" ")).catch(() => {}); }, 10000);
  const job = (async () => {
    let result;
    try { result = await runAI(url, env); }
    catch (e) { result = { error: String((e && e.message) || e) }; }
    clearInterval(beat);
    try { await w.write(enc.encode(JSON.stringify(result))); await w.close(); } catch (_) {}
  })();
  if (ctx && ctx.waitUntil) ctx.waitUntil(job);
  return new Response(readable, { status: 200, headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store", "x-accel-buffering": "no" } });
}

// পরিষ্কার লিংকগুলো (যেমন /learn/noorani) সঠিক পেজে পাঠানো

/* ===== Cloudflare R2 — ফাইল রাখা ও দেখানো (v48) =====
   Pages → Settings → Bindings → R2 bucket: নাম (Variable name) অবশ্যই MEDIA_R2 */
const ADMIN_EMAILS = ["darulilmonline.com@gmail.com"];
async function r2Admin(request, env) {
  const h = request.headers.get("Authorization") || "";
  if (!h.startsWith("Bearer ")) return null;
  const r = await fetch(SB + "/auth/v1/user", { headers: { apikey: PK, Authorization: h } });
  if (!r.ok) return null;
  const u = await r.json().catch(() => null);
  const allow = (env.ADMIN_EMAILS ? String(env.ADMIN_EMAILS).split(",") : ADMIN_EMAILS).map(x => x.trim().toLowerCase());
  return u && u.email && allow.includes(String(u.email).toLowerCase()) ? u : null;
}
function safeKey(k) {
  k = String(k || "").replace(/^\/+/, "");
  if (!k || k.length > 300 || k.includes("..") || !/^[\w\-./]+$/.test(k)) return null;
  return k;
}
async function r2Api(request, env, url) {
  if (!env.MEDIA_R2) return json({ ok: false, ready: false, error: "R2 এখনো যুক্ত হয়নি" }, 200);
  const p = url.pathname.slice("/api/r2/".length), q = url.searchParams;
  if (p === "status") return json({ ok: true, ready: true });
  if (!(await r2Admin(request, env))) return json({ error: "অনুমতি নেই — admin হিসেবে লগইন করুন" }, 401);
  if (p === "usage") {
    let size = 0, count = 0, cursor;
    do { const l = await env.MEDIA_R2.list({ cursor, limit: 1000 }); for (const o of l.objects) { size += o.size; count++; } cursor = l.truncated ? l.cursor : null; } while (cursor);
    return json({ ok: true, size, count });
  }
  if (p === "mpu/create" && request.method === "POST") {
    const b = await request.json().catch(() => ({}));
    const key = safeKey(b.key); if (!key) return json({ error: "ফাইলের নাম ঠিক নয়" }, 400);
    const up = await env.MEDIA_R2.createMultipartUpload(key, { httpMetadata: { contentType: b.type || "application/octet-stream", cacheControl: "public, max-age=31536000, immutable" } });
    return json({ ok: true, key, uploadId: up.uploadId });
  }
  if (p === "mpu/part" && request.method === "PUT") {
    const key = safeKey(q.get("key")), id = q.get("uploadId"), n = parseInt(q.get("part"), 10);
    if (!key || !id || !(n >= 1 && n <= 10000) || !request.body) return json({ error: "ভুল অনুরোধ" }, 400);
    const part = await env.MEDIA_R2.resumeMultipartUpload(key, id).uploadPart(n, request.body);
    return json({ ok: true, partNumber: part.partNumber, etag: part.etag });
  }
  if (p === "mpu/complete" && request.method === "POST") {
    const b = await request.json().catch(() => ({}));
    const key = safeKey(b.key); if (!key || !b.uploadId || !Array.isArray(b.parts)) return json({ error: "ভুল অনুরোধ" }, 400);
    await env.MEDIA_R2.resumeMultipartUpload(key, b.uploadId).complete(b.parts);
    return json({ ok: true, key, url: url.origin + "/m/" + key });
  }
  if (p === "mpu/abort" && request.method === "POST") {
    const b = await request.json().catch(() => ({}));
    const key = safeKey(b.key); if (key && b.uploadId) { try { await env.MEDIA_R2.resumeMultipartUpload(key, b.uploadId).abort(); } catch (_) {} }
    return json({ ok: true });
  }
  if (p === "obj" && request.method === "DELETE") {
    const key = safeKey(q.get("key")); if (!key) return json({ error: "ভুল অনুরোধ" }, 400);
    await env.MEDIA_R2.delete(key); return json({ ok: true });
  }
  return json({ error: "Not Found" }, 404);
}
async function r2Serve(request, env, url) {
  if (!env.MEDIA_R2) return new Response("Not found", { status: 404 });
  const key = safeKey(decodeURIComponent(url.pathname.slice(3)));
  if (!key) return new Response("Not found", { status: 404 });
  if (request.method !== "GET" && request.method !== "HEAD") return new Response(null, { status: 405 });
  const range = request.headers.get("range");
  const obj = request.method === "HEAD" ? await env.MEDIA_R2.head(key) : await env.MEDIA_R2.get(key, range ? { range: request.headers } : {});
  if (!obj) return new Response("Not found", { status: 404 });
  const h = new Headers();
  obj.writeHttpMetadata(h);
  h.set("etag", obj.httpEtag); h.set("accept-ranges", "bytes");
  if (!h.has("cache-control")) h.set("cache-control", "public, max-age=31536000, immutable");
  if (request.method === "HEAD") { h.set("content-length", String(obj.size)); return new Response(null, { headers: h }); }
  if (range && obj.range) {
    const off = obj.range.offset ?? (obj.range.suffix ? obj.size - obj.range.suffix : 0);
    const len = obj.range.length ?? (obj.size - off);
    h.set("content-range", `bytes ${off}-${off + len - 1}/${obj.size}`); h.set("content-length", String(len));
    return new Response(obj.body, { status: 206, headers: h });
  }
  h.set("content-length", String(obj.size));
  return new Response(obj.body, { headers: h });
}

const REWRITES = [
  [/^\/learn\/[^/]+\/?$/, "/learn"],
  [/^\/c\/[^/]+\/?$/, "/course"],
  [/^\/library\/\d+\/?$/, "/item"]
];

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (url.pathname.startsWith("/api/r2/")) return r2Api(request, env, url);
    if (url.pathname.startsWith("/m/")) return r2Serve(request, env, url);
    if (url.pathname === "/api/ai-video") {
      if (request.method === "POST") return aiVideo(request, env, ctx);
      if (request.method === "GET") return json({ ok: true, ready: !!env.GEMINI_API_KEY });
      return json({ error: "Method Not Allowed" }, 405);
    }
    for (const [re, target] of REWRITES) {
      if (re.test(url.pathname)) {
        const u = new URL(target, url); u.search = url.search;
        const res = await env.ASSETS.fetch(new Request(u, request));
        return new Response(res.body, res);
      }
    }
    return env.ASSETS.fetch(request);
  }
};
