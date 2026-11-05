/* দারুল ইলম অনলাইন — সনদ (PDF/প্রিন্ট) — v35 */
window.dioCert = function (c) {
  var w = window.open("", "_blank");
  if (!w) { alert("পপআপ আটকানো আছে — ব্রাউজারে এই সাইটের জন্য পপআপ চালু করুন।"); return; }
  var esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (x) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[x]; }); };
  var bn = function (s) { return String(s).replace(/\d/g, function (d) { return "০১২৩৪৫৬৭৮৯"[d]; }); };
  var dt = new Date(c.date || Date.now());
  var greg = dt.toLocaleDateString("bn-BD", { day: "numeric", month: "long", year: "numeric" });
  var hij = ""; try { var pp = new Intl.DateTimeFormat("bn-BD-u-ca-islamic", { day: "numeric", month: "long", year: "numeric" }).formatToParts(dt); var g = function (t) { var x = pp.find(function (o) { return o.type === t; }); return x ? x.value : ""; }; hij = g("day") + " " + g("month") + " " + g("year") + " হিজরি"; } catch (e) {}
  var url = "https://darulilmonline.com/verify?c=" + encodeURIComponent(c.code);
  var free = c.kind === "free";
  var title = free ? "স্ব-অধ্যয়ন সমাপনী সনদ" : "কোর্স সমাপনী সনদ";
  var line = free
    ? "দারুল ইলম অনলাইনের ফ্রি কোর্সের সব পাঠ অধ্যয়ন শেষে অনলাইন চূড়ান্ত পরীক্ষায় <b>" + bn(c.score) + "%</b> নম্বর পেয়ে উত্তীর্ণ হয়েছেন"
    : "দারুল ইলম অনলাইনে শিক্ষকের তত্ত্বাবধানে নিয়মিত ক্লাসের মাধ্যমে কোর্সটি সফলতার সাথে সম্পন্ন করেছেন" + (c.grade ? " — ফলাফল: <b>" + esc(c.grade) + "</b>" : "");
  var LOGO = '<svg viewBox="0 0 64 64" width="64" height="64"><circle cx="32" cy="32" r="31" fill="#0B3D4A"/><path d="M18 36h28v3H18z" fill="#F1D27A"/><path d="M20 36a12 12 0 0 1 24 0z" fill="#F1D27A"/><path d="M32 22l-1.5-5h3z" fill="#F1D27A"/><circle cx="32" cy="14" r="2" fill="#F1D27A"/><path d="M20 44l12 3 12-3v6l-12 3-12-3z" fill="#FBF7EE"/></svg>';
  var corner = '<svg viewBox="0 0 100 100"><path d="M4 4h60M4 4v60" stroke="#C9A13B" stroke-width="3" fill="none"/><path d="M14 14h36M14 14v36" stroke="#C9A13B" stroke-width="1.5" fill="none"/><circle cx="14" cy="14" r="5" fill="#C9A13B"/><path d="M30 4c4 8 4 18-6 26M4 30c8 4 18 4 26-6" stroke="#0A7A55" stroke-width="1.5" fill="none"/></svg>';
  var html = '<!doctype html><html lang="bn"><head><meta charset="utf-8"><title>' + esc(title) + " — " + esc(c.name) + '</title>' +
    '<link href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&family=Amiri:wght@400;700&display=swap" rel="stylesheet">' +
    '<script src="https://cdnjs.cloudflare.com/ajax/libs/qrcode-generator/1.4.4/qrcode.min.js"><\/script>' +
    '<style>@page{size:A4 landscape;margin:0}*{box-sizing:border-box;-webkit-print-color-adjust:exact;print-color-adjust:exact}' +
    'body{margin:0;font-family:"Hind Siliguri",sans-serif;color:#1C2427;background:#e9ece8}' +
    '.pg{width:297mm;height:210mm;margin:0 auto;padding:9mm;background:#fff;position:relative;overflow:hidden}' +
    '.fr{position:absolute;inset:9mm;border:2.5px solid #0B3D4A;border-radius:6px}.fr2{position:absolute;inset:12mm;border:1px solid #C9A13B;border-radius:4px}' +
    '.bg{position:absolute;inset:12mm;background:radial-gradient(60% 70% at 50% 45%,rgba(241,210,122,.13),transparent 70%),repeating-linear-gradient(45deg,rgba(11,61,74,.025) 0 2px,transparent 2px 14px)}' +
    '.cn{position:absolute;width:30mm;height:30mm}.cn svg{width:100%;height:100%}.tl{top:13mm;left:13mm}.tr{top:13mm;right:13mm;transform:scaleX(-1)}.bl{bottom:13mm;left:13mm;transform:scaleY(-1)}.br{bottom:13mm;right:13mm;transform:scale(-1)}' +
    '.in{position:relative;height:100%;display:flex;flex-direction:column;align-items:center;text-align:center;padding:14mm 30mm 12mm}' +
    '.hd{display:flex;align-items:center;gap:12px}.hd b{font-size:20pt;color:#0B3D4A;display:block;line-height:1.1}.hd small{color:#A8862A;font-size:10pt}' +
    '.ar{font-family:Amiri,serif;color:#A8862A;font-size:16pt;margin:4mm 0 1mm}' +
    '.ti{font-size:30pt;font-weight:700;color:#0A5A4A;margin:1mm 0 0;letter-spacing:.5px}' +
    '.ti2{font-family:Amiri,serif;font-size:15pt;color:#0B3D4A;margin-bottom:4mm}' +
    '.sm{font-size:12.5pt;color:#4A5558}' +
    '.nm{font-size:30pt;font-weight:700;color:#111;margin:2mm 0 1mm;padding:0 12mm 2mm;border-bottom:2px solid #C9A13B;min-width:150mm}' +
    '.co{font-size:19pt;font-weight:700;color:#0B3D4A;margin:3mm 0 1mm}' +
    '.ln{font-size:12.5pt;color:#3E4A4E;max-width:200mm;line-height:1.7}.ln b{color:#0A5A4A}' +
    '.ft{margin-top:auto;width:100%;display:grid;grid-template-columns:1fr auto 1fr;align-items:end;gap:10mm}' +
    '.sg{text-align:center;font-size:10.5pt;color:#4A5558}.sg i{display:block;border-top:1.5px solid #0B3D4A;margin:0 8mm 2mm;height:12mm}' +
    '.qr{text-align:center}.qr div{width:28mm;height:28mm;margin:0 auto;padding:1.5mm;background:#fff;border:1px solid #E6DCC8;border-radius:4px}.qr svg{width:100%;height:100%}' +
    '.qr small{display:block;font-size:8pt;color:#6B767B;margin-top:1mm}.qr b{font-size:9pt;color:#0B3D4A;letter-spacing:.5px}' +
    '.dt{font-size:11pt;color:#4A5558;margin-top:3mm}' +
    '.seal{position:absolute;right:30mm;top:30mm;width:30mm;height:30mm;border-radius:50%;background:radial-gradient(circle,#F3D27A,#C9A13B);display:grid;place-items:center;color:#2A1F05;font-weight:700;font-size:9pt;box-shadow:0 0 0 3px #fff,0 0 0 5px #C9A13B;transform:rotate(-12deg);text-align:center;line-height:1.3}' +
    '.bar{position:sticky;top:0;background:#fff;padding:10px 16px;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #ddd;z-index:5}.bar button{font:inherit;font-weight:700;padding:10px 18px;border-radius:12px;border:0;background:#F6B91A;cursor:pointer}' +
    '@media print{.bar{display:none}body{background:#fff}}@media screen{.pg{margin:16px auto;box-shadow:0 10px 40px rgba(0,0,0,.15)}}</style></head><body>' +
    '<div class="bar"><span>প্রিন্ট উইন্ডোতে Layout: Landscape, “Save as PDF” বেছে নিন</span><button onclick="print()">PDF হিসেবে সেভ / প্রিন্ট</button></div>' +
    '<div class="pg"><div class="bg"></div><div class="fr"></div><div class="fr2"></div>' +
    '<div class="cn tl">' + corner + '</div><div class="cn tr">' + corner + '</div><div class="cn bl">' + corner + '</div><div class="cn br">' + corner + '</div>' +
    '<div class="seal">দারুল ইলম<br>অনলাইন<br>✦</div>' +
    '<div class="in"><div class="hd">' + LOGO + '<div style="text-align:left"><b>দারুল ইলম অনলাইন</b><small>ঘরে বসে দ্বীন শিক্ষা · darulilmonline.com</small></div></div>' +
    '<div class="ar">بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ</div>' +
    '<div class="ti">' + esc(title) + '</div><div class="ti2">' + (free ? "شَهَادَةُ إِتْمَامِ الدِّرَاسَةِ الذَّاتِيَّةِ" : "شَهَادَةُ إِتْمَامِ الدَّوْرَةِ") + '</div>' +
    '<div class="sm">এই মর্মে প্রত্যয়ন করা যাচ্ছে যে</div><div class="nm">' + esc(c.name) + '</div>' +
    '<div class="co">' + esc(c.course_title || c.course) + '</div>' +
    '<div class="ln">' + line + '। আল্লাহ তাঁর জ্ঞানে বরকত দিন এবং এই শিক্ষাকে তাঁর জন্য কল্যাণকর করুন।</div>' +
    '<div class="dt">প্রদানের তারিখ: ' + greg + (hij ? ' · ' + hij : '') + '</div>' +
    '<div class="ft"><div class="sg"><i></i>' + (free ? "পরীক্ষা নিয়ন্ত্রক" : "শিক্ষক") + '</div>' +
    '<div class="qr"><div id="qr"></div><small>যাচাই করতে স্ক্যান করুন</small><b>' + esc(c.code) + '</b></div>' +
    '<div class="sg"><i></i>পরিচালক, দারুল ইলম অনলাইন</div></div></div></div>' +
    '<script>try{var q=qrcode(0,"M");q.addData(' + JSON.stringify(url) + ');q.make();document.getElementById("qr").innerHTML=q.createSvgTag({cellSize:3,margin:0,scalable:true});}catch(e){}' +
    '(document.fonts?document.fonts.ready:Promise.resolve()).then(function(){setTimeout(function(){print()},600)});<\/script></body></html>';
  w.document.write(html); w.document.close();
};
