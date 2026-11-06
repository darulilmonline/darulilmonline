/* দারুল ইলম অনলাইন — তিন ভাষার নিরাপত্তা-সনদ — v41: সব তথ্য শুধু সার্ভার থেকে */
(function () {
var SB = "https://nlylwrbxejjxnfljcztv.supabase.co", SK = "sb_publishable_N2xa0vKr70Ou1S2zlieZTw_qVqrImfg";
var esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (x) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[x]; }); };
var bnD = function (s) { return String(s).replace(/\d/g, function (d) { return "০১২৩৪৫৬৭৮৯"[d]; }); };
var arD = function (s) { return String(s).replace(/\d/g, function (d) { return "٠١٢٣٤٥٦٧٨٩"[d]; }); };
var GR = [ [/মুমতায|ممتاز|excellent/i, "Excellent (Mumtaz)", "ممتاز"], [/জিদ্দান|جدا|very good/i, "Very Good (Jayyid Jiddan)", "جيد جدًّا"],
           [/জায়্যিদ|جيد|good/i, "Good (Jayyid)", "جيد"], [/মাকবুল|مقبول|pass/i, "Pass (Maqbul)", "مقبول"] ];
function grade(g, L) { if (!g || L === "bn") return g || ""; for (var i = 0; i < GR.length; i++) if (GR[i][0].test(g)) return L === "en" ? GR[i][1] : GR[i][2]; return g; }
function dates(d, L) {
  var loc = L === "bn" ? "bn-BD" : L === "en" ? "en-GB" : "ar-EG";
  var g = d.toLocaleDateString(loc, { day: "numeric", month: "long", year: "numeric" }), h = "";
  try { var pp = new Intl.DateTimeFormat(loc + "-u-ca-islamic", { day: "numeric", month: "long", year: "numeric" }).formatToParts(d);
    var f = function (t) { var x = pp.find(function (o) { return o.type === t; }); return x ? x.value : ""; };
    h = f("day") + " " + f("month") + " " + f("year") + (L === "bn" ? " হিজরি" : L === "en" ? " AH" : " هـ"); } catch (e) {}
  return [g, h];
}
var T = {
  bn: { brand: "দারুল ইলম অনলাইন", tag: "ঘরে বসে দ্বীন শিক্ষা · darulilmonline.com", tC: "কোর্স সমাপনী সনদ", tF: "স্ব-অধ্যয়ন সমাপনী সনদ",
        sub: function (f) { return f ? "شَهَادَةُ إِتْمَامِ الدِّرَاسَةِ الذَّاتِيَّةِ" : "شَهَادَةُ إِتْمَامِ الدَّوْرَةِ"; }, cert: "এই মর্মে প্রত্যয়ন করা যাচ্ছে যে",
        lineC: function (g) { return "দারুল ইলম অনলাইনে শিক্ষকের তত্ত্বাবধানে নিয়মিত ক্লাসের মাধ্যমে কোর্সটি সফলতার সাথে সম্পন্ন করেছেন" + (g ? " — ফলাফল: <b>" + esc(g) + "</b>" : ""); },
        lineF: function (s) { return "দারুল ইলম অনলাইনের ফ্রি কোর্সের সব পাঠ অধ্যয়ন শেষে অনলাইন চূড়ান্ত পরীক্ষায় <b>" + bnD(s) + "%</b> নম্বর পেয়ে উত্তীর্ণ হয়েছেন"; },
        dua: "। আল্লাহ তাঁর জ্ঞানে বরকত দিন এবং এই শিক্ষাকে তাঁর জন্য কল্যাণকর করুন।", date: "প্রদানের তারিখ: ", sT: "শিক্ষক", sF: "পরীক্ষা নিয়ন্ত্রক", dir: "পরিচালক, দারুল ইলম অনলাইন",
        scan: "যাচাই করতে স্ক্যান করুন", seal: "দারুল ইলম<br>অনলাইন<br>✦", font: "'Hind Siliguri',sans-serif", nameFont: "'Hind Siliguri',sans-serif" },
  en: { brand: "Darul Ilm Online", tag: "Islamic learning from home · darulilmonline.com", tC: "Certificate of Course Completion", tF: "Certificate of Self-Study Completion",
        sub: function (f) { return f ? "شَهَادَةُ إِتْمَامِ الدِّرَاسَةِ الذَّاتِيَّةِ" : "شَهَادَةُ إِتْمَامِ الدَّوْرَةِ"; }, cert: "This is to certify that",
        lineC: function (g) { return "has successfully completed this course through regular classes under the supervision of a teacher at Darul Ilm Online" + (g ? " — Result: <b>" + esc(g) + "</b>" : ""); },
        lineF: function (s) { return "has studied all lessons of this free course at Darul Ilm Online and passed the online final examination with a score of <b>" + s + "%</b>"; },
        dua: ". May Allah bless their knowledge and make it beneficial for them.", date: "Date of issue: ", sT: "Teacher", sF: "Examination Controller", dir: "Director, Darul Ilm Online",
        scan: "Scan to verify", seal: "DARUL ILM<br>ONLINE<br>✦", font: "'Cormorant Garamond','Hind Siliguri',serif", nameFont: "'Great Vibes','Cormorant Garamond',serif" },
  ar: { brand: "دار العلم أونلاين", tag: "تعلُّم الدين من البيت · darulilmonline.com", tC: "شهادة إتمام الدورة", tF: "شهادة إتمام الدراسة الذاتية",
        sub: function (f) { return f ? "Certificate of Self-Study Completion" : "Certificate of Course Completion"; }, cert: "نشهد بأنّ",
        lineC: function (g, fm) { return (fm ? "قد أتمّت" : "قد أتمّ") + " هذه الدورة بنجاح في دار العلم أونلاين من خلال الدروس المنتظمة تحت إشراف المعلّم" + (g ? " — بتقدير: <b>" + esc(g) + "</b>" : ""); },
        lineF: function (s, fm) { return (fm ? "قد درست" : "قد درس") + " جميع دروس هذه الدورة المجانية في دار العلم أونلاين، " + (fm ? "ونجحت" : "ونجح") + " في الاختبار النهائي الإلكتروني بنسبة <b>" + arD(s) + "٪</b>"; },
        dua: function (fm) { return ". بارك الله " + (fm ? "في علمها وجعله نافعًا لها." : "في علمه وجعله نافعًا له."); }, date: "تاريخ الإصدار: ", sT: "المعلّم", sF: "مراقب الاختبارات", dir: "مدير دار العلم أونلاين",
        scan: "امسح للتحقق", seal: "دار العلم<br>أونلاين<br>✦", font: "'Amiri',serif", nameFont: "'Amiri',serif" }
};
async function titles(c) {
  if (c.titles) return c.titles;
  try { var r = await fetch(SB + "/rest/v1/courses?select=content&slug=eq." + encodeURIComponent(c.course), { headers: { apikey: SK, Authorization: "Bearer " + SK } });
    var d = await r.json(); var ct = (d[0] || {}).content || {}; return { bn: (ct.bn || {}).t, en: (ct.en || {}).t, ar: (ct.ar || {}).t }; } catch (e) { return {}; }
}

function f2(n){return Math.round(n*100)/100;}
function guilloche(){ /* পুরো পাতা: ২৯৭ × ২১০ মিমি */
  var out='',i,j,t,x,y,d;
  for(i=0;i<34;i++){ d='M'; for(j=0;j<=120;j++){ x=12+j*(273/120); y=16+i*5.4+Math.sin(j/120*Math.PI*6+i*0.55)*2.2+Math.sin(j/120*Math.PI*17+i)*0.6; d+=(j?' L':'')+f2(x)+' '+f2(y);} out+='<path d="'+d+'"/>'; }
  var ros='';
  for(i=0;i<40;i++){ d='M'; var ph=i*Math.PI*2/40; for(j=0;j<=200;j++){ t=j/200*Math.PI*2; var r=30+9*Math.sin(7*t+ph)+3*Math.sin(19*t); x=148.5+r*Math.cos(t+ph/7); y=112+r*Math.sin(t+ph/7); d+=(j?' L':'')+f2(x)+' '+f2(y);} ros+='<path d="'+d+'Z"/>'; }
  return '<svg class="gl" viewBox="0 0 297 210" preserveAspectRatio="none"><g fill="none" stroke="#0A7A55" stroke-opacity=".07" stroke-width=".18">'+out+'</g><g fill="none" stroke="#C9A13B" stroke-opacity=".12" stroke-width=".15">'+ros+'</g></svg>';
}
function star8(cx,cy,r,fill,stroke,sw){ /* আট-কোণা তারকা (খাতাম) */
  var p=function(rot){var a=[];for(var k=0;k<4;k++){var t=rot+k*Math.PI/2;a.push(f2(cx+r*Math.cos(t))+','+f2(cy+r*Math.sin(t)));}return a.join(' ');};
  return '<polygon points="'+p(Math.PI/4)+'" fill="'+fill+'" stroke="'+stroke+'" stroke-width="'+sw+'"/><polygon points="'+p(0)+'" fill="'+fill+'" stroke="'+stroke+'" stroke-width="'+sw+'"/>';
}
function microFrame(code){
  var unit='DARUL ILM ONLINE \u2022 VERIFY AT DARULILMONLINE.COM/VERIFY \u2022 '+code+' \u2022 \u0627\u0644\u0639\u0644\u0645 \u2022 ', txt='';
  while(txt.length<1500) txt+=unit;
  return '<svg class="mf" viewBox="0 0 297 210"><defs><path id="mfp" d="M11 11 H286 V199 H11 Z"/></defs><text font-size="1.45" fill="#0B3D4A" fill-opacity=".75" letter-spacing=".05" font-family="Arial,sans-serif"><textPath href="#mfp">'+txt+'</textPath></text></svg>';
}
function rosette(L,code){
  var sc='',k,n=40;
  for(k=0;k<n;k++){var t=k*Math.PI*2/n;sc+='<circle cx="'+f2(50+44*Math.cos(t))+'" cy="'+f2(50+44*Math.sin(t))+'" r="5.2"/>';}
  var ring=(L==="ar"?"\u062f\u0627\u0631 \u0627\u0644\u0639\u0644\u0645 \u0623\u0648\u0646\u0644\u0627\u064a\u0646 \u2022 \u0634\u0647\u0627\u062f\u0629 \u0645\u0648\u062b\u0651\u0642\u0629 \u2022 ":L==="en"?"DARUL ILM ONLINE \u2022 VERIFIED CERTIFICATE \u2022 ":"\u09a6\u09be\u09b0\u09c1\u09b2 \u0987\u09b2\u09ae \u0985\u09a8\u09b2\u09be\u0987\u09a8 \u2022 \u09af\u09be\u099a\u09be\u0987\u09af\u09cb\u0997\u09cd\u09af \u09b8\u09a8\u09a6 \u2022 ");
  return '<svg viewBox="0 0 100 128" class="ros"><defs><radialGradient id="gf" cx="40%" cy="35%" r="70%"><stop offset="0" stop-color="#FFF1BF"/><stop offset=".45" stop-color="#E9C25A"/><stop offset="1" stop-color="#A8812A"/></radialGradient>'+
    '<linearGradient id="rb" x1="0" x2="1"><stop offset="0" stop-color="#0A5A4A"/><stop offset="1" stop-color="#0B3D4A"/></linearGradient><path id="rc" d="M50 50 m-31 0 a31 31 0 1 1 62 0 a31 31 0 1 1 -62 0"/></defs>'+
    '<path d="M34 86 L26 126 L37 118 L44 128 L50 92 Z" fill="url(#rb)"/><path d="M66 86 L74 126 L63 118 L56 128 L50 92 Z" fill="url(#rb)"/>'+
    '<g fill="url(#gf)">'+sc+'<circle cx="50" cy="50" r="44"/></g><circle cx="50" cy="50" r="38" fill="none" stroke="#7A5A14" stroke-width=".8"/>'+
    '<circle cx="50" cy="50" r="25" fill="none" stroke="#7A5A14" stroke-width=".6"/>'+
    '<text font-size="5.6" font-weight="700" fill="#4A350A" letter-spacing=".2" font-family="Hind Siliguri,Amiri,sans-serif"><textPath href="#rc">'+ring+ring+'</textPath></text>'+
    star8(50,50,15,"#F6DD8E","#7A5A14",.7)+'<circle cx="50" cy="50" r="6.5" fill="#0B3D4A"/><path d="M45.6 51.5h8.8v1h-8.8zM46.2 51.5a3.8 3.8 0 0 1 7.6 0z" fill="#F1D27A"/></svg>';
}
function cornerOrn(){
  return '<svg viewBox="0 0 100 100">'+star8(18,18,9,"none","#C9A13B",1.6)+star8(18,18,4.5,"#0A7A55","none",0)+
    '<path d="M4 4h70M4 4v70" stroke="#C9A13B" stroke-width="2.4" fill="none"/><path d="M32 18h40M18 32v40" stroke="#0A7A55" stroke-width="1" fill="none"/>'+
    '<circle cx="76" cy="4" r="2.4" fill="#C9A13B"/><circle cx="4" cy="76" r="2.4" fill="#C9A13B"/></svg>';
}
function watermark(){
  return '<svg class="wm" viewBox="0 0 200 200">'+star8(100,100,92,"none","#0B3D4A",1.2)+star8(100,100,78,"none","#C9A13B",.8)+star8(100,100,50,"none","#0B3D4A",.8)+'<circle cx="100" cy="100" r="30" fill="none" stroke="#C9A13B" stroke-width=".8"/></svg>';
}
function render(w, c, L, nm, fm, tt) {
  var t = T[L], free = c.kind === "free", rtl = L === "ar";
  var title = free ? t.tF : t.tC, dd = dates(new Date(c.date || Date.now()), L);
  var course = (tt && tt[L]) || c.course_title || (tt && tt.bn) || c.course;
  var g = grade(c.grade, L);
  var line = free ? t.lineF(c.score, fm) : t.lineC(g, fm);
  var dua = typeof t.dua === "function" ? t.dua(fm) : t.dua;
  var url = "https://darulilmonline.com/verify?c=" + encodeURIComponent(c.code);
  var LOGO = '<svg viewBox="0 0 64 64" width="64" height="64"><circle cx="32" cy="32" r="31" fill="#0B3D4A"/><path d="M18 36h28v3H18z" fill="#F1D27A"/><path d="M20 36a12 12 0 0 1 24 0z" fill="#F1D27A"/><path d="M32 22l-1.5-5h3z" fill="#F1D27A"/><circle cx="32" cy="14" r="2" fill="#F1D27A"/><path d="M20 44l12 3 12-3v6l-12 3-12-3z" fill="#FBF7EE"/></svg>';
  var corner = cornerOrn();
  var nmSize = L === "en" ? "40pt" : L === "ar" ? "32pt" : "30pt";
  var html = '<!doctype html><html lang="' + L + '" dir="' + (rtl ? "rtl" : "ltr") + '"><head><meta charset="utf-8"><title>' + esc(title) + " — " + esc(nm) + '</title>' +
    '<link href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&family=Amiri:wght@400;700&family=Cormorant+Garamond:wght@500;600;700&family=Great+Vibes&display=swap" rel="stylesheet">' +
    '<script src="https://cdnjs.cloudflare.com/ajax/libs/qrcode-generator/1.4.4/qrcode.min.js"><\/script>' +
    '<style>@page{size:A4 landscape;margin:0}*{box-sizing:border-box;-webkit-print-color-adjust:exact;print-color-adjust:exact}' +
    'body{margin:0;font-family:' + t.font + ';color:#1C2427;background:#e9ece8}' +
    '.pg{width:297mm;height:210mm;margin:0 auto;padding:9mm;background:#fff;position:relative;overflow:hidden}' +
    '.fr{position:absolute;inset:9mm;border:2.5px solid #0B3D4A;border-radius:6px}.fr2{position:absolute;inset:12mm;border:1px solid #C9A13B;border-radius:4px}.fr3{position:absolute;inset:13.2mm;border:.6px solid #0A7A55;border-radius:3px;opacity:.6}' +
    '.bg{position:absolute;inset:12mm;background:radial-gradient(60% 70% at 50% 45%,rgba(241,210,122,.13),transparent 70%),repeating-linear-gradient(45deg,rgba(11,61,74,.025) 0 2px,transparent 2px 14px)}' +
    '.gl,.mf{position:absolute;inset:0;width:297mm;height:210mm}.wm{position:absolute;left:50%;top:52%;width:120mm;height:120mm;transform:translate(-50%,-50%);opacity:.06}' +
    '.ros{position:absolute;' + (rtl ? "left" : "right") + ':19mm;top:17mm;width:30mm;height:38.4mm;filter:drop-shadow(0 1.5mm 1.5mm rgba(0,0,0,.18))}' +
    '.sec{display:block;font-size:7.5pt;color:#6B767B;margin-top:.5mm;letter-spacing:.3px;font-family:Arial,sans-serif;direction:ltr}' +
    '.cn{position:absolute;width:30mm;height:30mm}.cn svg{width:100%;height:100%}.tl{top:13mm;left:13mm}.tr{top:13mm;right:13mm;transform:scaleX(-1)}.bl{bottom:13mm;left:13mm;transform:scaleY(-1)}.br{bottom:13mm;right:13mm;transform:scale(-1)}' +
    '.in{position:relative;height:100%;display:flex;flex-direction:column;align-items:center;text-align:center;padding:14mm 42mm 12mm}' +
    '.hd{display:flex;align-items:center;gap:12px}.hd b{font-size:20pt;color:#0B3D4A;display:block;line-height:1.15}.hd small{color:#A8862A;font-size:10pt;font-family:"Hind Siliguri",sans-serif}' +
    '.ar{font-family:Amiri,serif;color:#A8862A;font-size:16pt;margin:4mm 0 1mm}' +
    '.ti{font-size:' + (L === "en" ? "32pt" : "30pt") + ';font-weight:700;color:#0A5A4A;margin:1mm 0 0;line-height:1.2}' +
    '.ti2{font-family:' + (L === "ar" ? "'Cormorant Garamond',serif" : "Amiri,serif") + ';font-size:15pt;color:#0B3D4A;margin-bottom:4mm}' +
    '.sm{font-size:13pt;color:#4A5558;font-style:' + (L === "en" ? "italic" : "normal") + '}' +
    '.nm{font-family:' + t.nameFont + ';font-size:' + nmSize + ';font-weight:700;color:#111;margin:1mm 0 1mm;padding:0 12mm 2mm;border-bottom:2px solid #C9A13B;min-width:150mm;line-height:1.3}' +
    '.co{font-size:19pt;font-weight:700;color:#0B3D4A;margin:3mm 0 1mm}' +
    '.ln{font-size:' + (L === "en" ? "14pt" : "12.5pt") + ';color:#3E4A4E;max-width:205mm;line-height:1.7}.ln b{color:#0A5A4A}' +
    '.dt{font-size:11pt;color:#4A5558;margin-top:3mm}' +
    '.ft{margin-top:auto;width:100%;display:grid;grid-template-columns:1fr auto 1fr;align-items:end;gap:10mm}' +
    '.sg{text-align:center;font-size:11pt;color:#4A5558}.sg i{display:block;border-top:1.5px solid #0B3D4A;margin:0 8mm 2mm;height:12mm}' +
    '.qr{text-align:center}.qr div{width:28mm;height:28mm;margin:0 auto;padding:1.5mm;background:#fff;border:1px solid #E6DCC8;border-radius:4px}.qr svg{width:100%;height:100%}' +
    '.qr small{display:block;font-size:8pt;color:#6B767B;margin-top:1mm}.qr b{font-size:9pt;color:#0B3D4A;letter-spacing:.5px;font-family:"Hind Siliguri",sans-serif}' +
    '.seal{position:absolute;' + (rtl ? "left" : "right") + ':30mm;top:30mm;width:30mm;height:30mm;border-radius:50%;background:radial-gradient(circle,#F3D27A,#C9A13B);display:grid;place-items:center;color:#2A1F05;font-weight:700;font-size:9pt;box-shadow:0 0 0 3px #fff,0 0 0 5px #C9A13B;transform:rotate(-12deg);text-align:center;line-height:1.3}' +
    '.bar{position:sticky;top:0;background:#fff;padding:10px 16px;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #ddd;z-index:5;font-family:"Hind Siliguri",sans-serif;direction:ltr}.bar button{font:inherit;font-weight:700;padding:10px 18px;border-radius:12px;border:0;background:#F6B91A;cursor:pointer}' +
    '@media print{.bar{display:none}body{background:#fff}}@media screen{.pg{margin:16px auto;box-shadow:0 10px 40px rgba(0,0,0,.15)}}</style></head><body>' +
    '<div class="bar"><span>প্রিন্ট উইন্ডোতে Layout: Landscape, “Save as PDF” বেছে নিন</span><button onclick="print()">PDF হিসেবে সেভ / প্রিন্ট</button></div>' +
    '<div class="pg"><div class="bg"></div>' + guilloche() + watermark() + '<div class="fr"></div><div class="fr2"></div><div class="fr3"></div>' + microFrame(c.code) +
    '<div class="cn tl">' + corner + '</div><div class="cn tr">' + corner + '</div><div class="cn bl">' + corner + '</div><div class="cn br">' + corner + '</div>' +
    rosette(L, c.code) +
    '<div class="in"><div class="hd">' + LOGO + '<div style="text-align:' + (rtl ? "right" : "left") + '"><b>' + t.brand + '</b><small>' + t.tag + '</small></div></div>' +
    '<div class="ar">بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ</div>' +
    '<div class="ti">' + esc(title) + '</div><div class="ti2">' + t.sub(free) + '</div>' +
    '<div class="sm">' + t.cert + '</div><div class="nm" dir="auto">' + esc(nm) + '</div>' +
    '<div class="co" dir="auto">' + esc(course) + '</div>' +
    '<div class="ln">' + line + dua + '</div>' +
    '<div class="dt">' + t.date + dd[0] + (dd[1] ? " · " + dd[1] : "") + '</div>' +
    '<div class="ft"><div class="sg"><i></i>' + (free ? t.sF : t.sT) + '</div>' +
    '<div class="qr"><div id="qr"></div><small>' + t.scan + '</small><b dir="ltr">' + esc(c.code) + '</b></div>' +
    '<div class="sg"><i></i>' + t.dir + '</div></div></div></div>' +
    '<script>try{var q=qrcode(0,"M");q.addData(' + JSON.stringify(url) + ');q.make();document.getElementById("qr").innerHTML=q.createSvgTag({cellSize:3,margin:0,scalable:true});}catch(e){}' +
    '(document.fonts?document.fonts.ready:Promise.resolve()).then(function(){setTimeout(function(){print()},700)});<\/script></body></html>';
  w.document.open(); w.document.write(html); w.document.close();
}
function pick(input) {
  var code = String((input && input.code) || input || "").trim().toUpperCase();
  if (!code) return;
  fetch(SB + "/rest/v1/rpc/cert_verify", { method: "POST", headers: { apikey: SK, Authorization: "Bearer " + SK, "Content-Type": "application/json" }, body: JSON.stringify({ p_code: code }) })
    .then(function (r) { return r.ok ? r.json() : null; })
    .then(function (d) {
      if (!d) { alert("এই নম্বরের কোনো সনদ পাওয়া যায়নি।"); return; }
      if (d.revoked) { alert("এই সনদটি বাতিল করা হয়েছে।"); return; }
      dialog(d);
    })
    .catch(function () { alert("এখন সনদ তৈরি করা যাচ্ছে না — ইন্টারনেট দেখে আবার চেষ্টা করুন।"); });
}
function dialog(d) {
  var old = document.getElementById("dioCP"); if (old) old.remove();
  var st = document.getElementById("dioCPs");
  if (!st) { st = document.createElement("style"); st.id = "dioCPs"; st.textContent =
    "#dioCP{position:fixed;inset:0;z-index:99;background:rgba(0,0,0,.5);display:grid;place-items:center;padding:16px;font-family:'Hind Siliguri',sans-serif}" +
    "#dioCP .b{width:min(460px,100%);background:#fff;color:#1C2427;border-radius:20px;overflow:hidden;box-shadow:0 30px 80px rgba(0,0,0,.3)}" +
    "#dioCP .h{padding:14px 18px;background:linear-gradient(135deg,#0B3D4A,#0A5A4A);color:#fff;border-bottom:4px solid #C9A13B;font-weight:700;font-size:17px}" +
    "#dioCP .c{padding:16px 18px;display:grid;gap:10px}" +
    "#dioCP .o{display:flex;align-items:center;gap:12px;width:100%;text-align:start;font:inherit;padding:12px 14px;border-radius:14px;border:1.5px solid #E2E6E2;background:#F7F8F6;cursor:pointer;color:#1C2427}" +
    "#dioCP .o.on{border-color:#0A7A55;background:#E8F6EF}#dioCP .o:disabled{opacity:.5;cursor:not-allowed}" +
    "#dioCP .o b{min-width:74px}#dioCP .o span{font-size:14px;color:#4A5558;overflow:hidden;text-overflow:ellipsis}" +
    "#dioCP .g{display:grid;grid-template-columns:1fr 1fr;gap:8px}#dioCP .g button{font:inherit;font-weight:700;padding:9px 6px;border-radius:12px;border:1.5px solid #E2E6E2;background:#F7F8F6;cursor:pointer;color:#1C2427}#dioCP .g button.on{border-color:#0A7A55;background:#E8F6EF}" +
    "#dioCP .n{font-size:13px;color:#6B767B;line-height:1.6}#dioCP .f{display:flex;gap:10px;justify-content:flex-end;padding:0 18px 16px}" +
    "#dioCP .f button{font:inherit;font-weight:700;padding:10px 18px;border-radius:12px;border:0;cursor:pointer}#dioCP .ok{background:#F6B91A}#dioCP .x{background:#EEF0EE}";
    document.head.appendChild(st); }
  var latin = /^[A-Za-z .'-]+$/.test(d.name || "");
  var N = { bn: d.name, en: d.name_en || (latin ? d.name : ""), ar: d.name_ar || "" };
  var L = "bn", fm = false, ov = document.createElement("div"); ov.id = "dioCP";
  var opt = function (k, lab) { return '<button type="button" class="o' + (k === "bn" ? " on" : "") + '" data-l="' + k + '"' + (N[k] ? "" : " disabled") + '><b>' + lab + '</b><span' + (k === "ar" ? ' dir="rtl"' : "") + '>' + (N[k] ? esc(N[k]) : "এই ভাষায় নাম জমা নেই") + '</span></button>'; };
  ov.innerHTML = '<div class="b" role="dialog" aria-modal="true"><div class="h">সনদের ভাষা বাছুন</div><div class="c">' +
    opt("bn", "বাংলা") + opt("en", "English") + opt("ar", "العربية") +
    '<div id="cpG" hidden><div class="n" style="margin-bottom:5px">আরবি বাক্যের জন্য</div><div class="g"><button type="button" data-g="m" class="on">ছেলে / পুরুষ</button><button type="button" data-g="f">মেয়ে / নারী</button></div></div>' +
    '<div class="n">নিরাপত্তার জন্য নাম শুধু দারুল ইলমের রেকর্ড থেকে আসে, বদলানো যায় না। কোনো ভাষায় নাম যোগ বা সংশোধন দরকার হলে WhatsApp-এ (01329-173444) সনদ নম্বরসহ জানান।</div>' +
    '</div><div class="f"><button type="button" class="x">বাতিল</button><button type="button" class="ok">সনদ তৈরি করুন</button></div></div>';
  document.body.appendChild(ov);
  var q = function (s) { return ov.querySelector(s); };
  ov.querySelectorAll("[data-l]").forEach(function (b) { b.onclick = function () { L = b.dataset.l; ov.querySelectorAll("[data-l]").forEach(function (x) { x.classList.toggle("on", x === b); }); q("#cpG").hidden = L !== "ar"; }; });
  ov.querySelectorAll("[data-g]").forEach(function (b) { b.onclick = function () { fm = b.dataset.g === "f"; ov.querySelectorAll("[data-g]").forEach(function (x) { x.classList.toggle("on", x === b); }); }; });
  q(".x").onclick = function () { ov.remove(); }; ov.onclick = function (e) { if (e.target === ov) ov.remove(); };
  q(".ok").onclick = function () {
    if (!N[L]) return;
    var w = window.open("", "_blank"); if (!w) { alert("পপআপ আটকানো আছে — ব্রাউজারে এই সাইটের জন্য পপআপ চালু করুন।"); return; }
    w.document.write('<p style="font-family:sans-serif;padding:20px">সনদ তৈরি হচ্ছে…</p>');
    ov.remove(); render(w, d, L, N[L], fm, d.titles || {});
  };
}
window.dioCert = pick;
})();
