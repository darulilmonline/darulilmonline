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

async function aiVideo(request, env) {
  try {
    // ১) শুধু লগইন করা admin
    const auth = request.headers.get("Authorization") || "";
    if (!auth.startsWith("Bearer ")) return json({ error: "লগইন প্রয়োজন" }, 401);
    const who = await fetch(SB + "/auth/v1/user", { headers: { apikey: PK, Authorization: auth } });
    if (!who.ok) return json({ error: "অনুমতি নেই — admin-এ আবার লগইন করুন" }, 401);
    if (!env.GEMINI_API_KEY) return json({ error: "Cloudflare-এ GEMINI_API_KEY সেট করা হয়নি" }, 500);

    // ২) YouTube লিংক যাচাই
    const { url } = await request.json();
    const m = String(url || "").match(/(?:youtu\.be\/|v=|embed\/|shorts\/|live\/)([\w-]{11})/);
    if (!m) return json({ error: "এটা সঠিক YouTube লিংক নয়" }, 400);
    const yt = "https://www.youtube.com/watch?v=" + m[1];

    // ৩) Gemini-কে পাঠানো
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
    if (!r.ok) return json({ error: "Gemini: " + ((d.error && d.error.message) || r.status) }, 502);

    const cand = (d.candidates || [])[0] || {};
    const text = ((cand.content && cand.content.parts) || []).map(p => p.text || "").join("");
    if (!text) return json({ error: "Gemini কোনো লেখা দেয়নি (" + (cand.finishReason || "অজানা কারণ") + ")। ভিডিওটি Public কি না দেখুন।" }, 502);
    let out;
    try { out = JSON.parse(text); }
    catch (_) { const a = text.indexOf("{"), b = text.lastIndexOf("}"); out = JSON.parse(text.slice(a, b + 1)); }

    return json({ ok: true, model, finish: cand.finishReason || "", ...out });
  } catch (e) {
    return json({ error: String((e && e.message) || e) }, 500);
  }
}

// পরিষ্কার লিংকগুলো (যেমন /learn/noorani) সঠিক পেজে পাঠানো
const REWRITES = [
  [/^\/learn\/[^/]+\/?$/, "/learn"],
  [/^\/c\/[^/]+\/?$/, "/course"],
  [/^\/library\/\d+\/?$/, "/item"]
];

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/api/ai-video") {
      if (request.method === "POST") return aiVideo(request, env);
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
