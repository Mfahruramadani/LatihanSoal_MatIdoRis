// Uji integrasi: menjalankan app.js ASLI di atas index.html dengan jsdom.
// Penggunaan: node harness.mjs <fase> ; fase "reload" membaca localStorage dari file.
import { JSDOM } from "jsdom";
import fs from "fs";
import { fileURLToPath } from "url";
const ROOT = fileURLToPath(new URL("..", import.meta.url)).replace(/\/$/, "");
const phase = process.argv[2] || "main", STORE = "./.integration-store.json";
const dom = new JSDOM(fs.readFileSync(ROOT + "/index.html", "utf8").replace(/<script[^>]*>[\s\S]*?<\/script>/g, ""), { url: "http://localhost/", pretendToBeVisual: true });
const w = dom.window;
if (phase === "reload" && fs.existsSync(STORE)) for (const [k, v] of Object.entries(JSON.parse(fs.readFileSync(STORE, "utf8")))) w.localStorage.setItem(k, v);
Object.assign(globalThis, { window: w, document: w.document, localStorage: w.localStorage, alert: () => {}, confirm: () => true, Event: w.Event });
const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
const results = []; const check = (name, cond, extra = "") => { results.push(cond); console.log((cond ? "PASS" : "FAIL") + "  " + name + (cond ? "" : "  -> " + extra)); };
const card = () => ({ level: $("#player-card .player-stat:nth-child(1) strong")?.textContent, title: $("#player-card .player-stat:nth-child(2) strong")?.textContent,
  xp: $("#player-card .player-stat:nth-child(3) strong")?.textContent, gems: $("#player-card .player-stat:nth-child(4) strong")?.textContent, bar: $("#player-card .progress-fill")?.style.width, meta: $("#player-card .progress-meta")?.textContent.replace(/\s+/g, " ").trim() });
const saved = () => JSON.parse(localStorage.getItem("mentallab-progress-v1") || "null");

// soal deterministik: pilihan ganda, jawaban benar selalu "A"
const { TOPICS } = await import(ROOT + "/assets/js/generator.js");
let n = 0; TOPICS.arithmetic.gen = () => ({ kind: "choice", prompt: `Soal uji ${++n}`, answer: "A", choices: ["A", "B", "C", "D"], explanation: "uji" });
await import(ROOT + "/assets/js/app.js");

function startSession(count = 10) {
  document.querySelector('[data-topic="arithmetic"]').click();
  $("#question-count").value = String(count); $("#time-limit").value = "0";
  $("#setup-form").dispatchEvent(new w.Event("submit", { cancelable: true, bubbles: true }));
}
const pick = (i, v) => { const r = $$("#sheet-container input[type=radio]").find(x => x.name === "q-" + i || x.name === "q" + i) ?? $$("#sheet-container input[type=radio]").filter(x => x.value === v)[i]; return r; };
function answer(i, value) { const radios = $$("#sheet-container article")[i].querySelectorAll("input[type=radio]"); const r = [...radios].find(x => x.value === value); r.checked = true; r.dispatchEvent(new w.Event("change", { bubbles: true })); }
const finish = () => $("#finish-button").click();
const reward = () => ({ shown: !$("#reward-panel").classList.contains("hidden"), head: $("#reward-panel h2")?.textContent, text: $("#reward-panel")?.textContent.replace(/\s+/g, " ") });

if (phase === "main") {
  let c = card();
  check("A. pemain baru: Level 1 / Novice / 0 XP / 0 Gemcrys", c.level === "1" && c.title === "Novice" && c.xp === "0" && c.gems === "0" && c.bar === "0%", JSON.stringify(c));
  check("A. tidak ada data tersimpan sebelum sesi selesai", saved() === null);

  startSession(10); for (let i = 0; i < 10; i++) answer(i, "A"); finish();
  let r = reward(), s = saved();
  check("B. sesi sempurna 10/10: +170 XP", r.shown && r.head === "+170 XP", r.head);
  check("B. notifikasi Level Up ke Level 2 + 10 Gemcrys", /LEVEL UP/.test(r.text) && /Naik ke Level 2/.test(r.text) && /\+10 Gemcrys/.test(r.text), r.text);
  check("B. data tersimpan: xp 170, level 2, gemcrys 10", s.xp === 170 && s.level === 2 && s.gemcrys === 10 && s.claimedLevels.join() === "2", JSON.stringify(s));
  check("B. halaman hasil lama tetap benar (skor 100)", $("#score-value").textContent === "100" && $("#correct-value").textContent === "10");

  finish(); finish(); finish();
  s = saved(); r = reward();
  check("C. klik ganda tombol periksa: XP/gemcrys tidak bertambah", s.xp === 170 && s.gemcrys === 10 && s.rewardedSessions.length === 1, JSON.stringify(s));
  check("C. panel reward tetap menampilkan reward sesi yang sama", r.shown && r.head === "+170 XP");

  $("#back-result-home").click(); c = card();
  check("C. kembali ke beranda: kartu progres terbarui (Level 2, 170 XP, 10 Gemcrys)", c.level === "2" && c.xp === "170" && c.gems === "10", JSON.stringify(c));

  // sesi campuran: 7 benar, 2 salah, 1 kosong -> 9*5 + 7*5 = 80 (tanpa bonus selesai/akurasi)
  startSession(10); for (let i = 0; i < 7; i++) answer(i, "A"); answer(7, "B"); answer(8, "C"); finish();
  r = reward(); s = saved();
  check("D. 7 benar, 2 salah, 1 kosong: +80 XP", r.head === "+80 XP", r.head + " | " + r.text);
  check("D. tanpa bonus penyelesaian dan akurasi", !/Semua soal dijawab/.test(r.text) && !/Akurasi/.test(r.text), r.text);
  check("D. total XP 250 -> Level 3 -> +10 Gemcrys (total 20)", s.xp === 250 && s.level === 3 && s.gemcrys === 20, JSON.stringify(s));

  // ulangi soal salah = sesi baru dengan ID baru
  $("#retry-wrong-button").click(); const retryCount = $$("#sheet-container article").length;
  check("D. 'ulangi soal salah' berisi 3 soal (2 salah + 1 kosong)", retryCount === 3, String(retryCount));
  for (let i = 0; i < 3; i++) answer(i, "A"); finish(); s = saved(); r = reward();
  check("D. sesi ulang yang diselesaikan = sesi baru: 3*5 + 3*5 + 20 + 50 = 100 XP", r.head === "+100 XP" && s.xp === 350, r.head + " " + (s && s.xp));

  // sesi tanpa satupun jawaban: 0 XP
  $("#back-result-home").click(); startSession(5); finish();
  r = reward(); s = saved();
  check("E. semua soal kosong: +0 XP, tidak ada bonus", r.head === "+0 XP" && s.xp === 350, r.head);

  // sesi ditinggalkan: dimulai, dijawab sebagian, lalu keluar ke beranda tanpa memeriksa
  $("#back-result-home").click(); startSession(10); for (let i = 0; i < 6; i++) answer(i, "A");
  const before = JSON.stringify(saved()); $("#back-home").click();
  check("F. sesi ditinggalkan (keluar ke beranda): tidak ada reward", JSON.stringify(saved()) === before);
  startSession(10); for (let i = 0; i < 10; i++) answer(i, "A");
  // 'membatalkan' dialog konfirmasi pada sesi belum lengkap = tidak selesai
  globalThis.confirm = () => false; startSession(10); answer(0, "A"); finish();
  check("F. batal pada konfirmasi 'masih ada soal belum dijawab': tidak ada reward", JSON.stringify(saved()) === before, JSON.stringify(saved()));
  globalThis.confirm = () => true;

  // batas waktu habis: selesai otomatis, hanya soal terjawab yang dihitung
  $("#back-home").click?.(); startSession(10);
  const opt = document.createElement("option"); opt.value = "0.02"; $("#time-limit").appendChild(opt); // ~1,2 detik
  document.querySelector('[data-topic="arithmetic"]').click(); $("#question-count").value = "10"; $("#time-limit").value = "0.02";
  $("#setup-form").dispatchEvent(new w.Event("submit", { cancelable: true, bubbles: true }));
  answer(0, "A"); answer(1, "A"); answer(2, "B");
  const xpBefore = saved().xp;
  await new Promise(res => setTimeout(res, 2600));
  s = saved(); r = reward();
  check("G. waktu habis: selesai otomatis, XP hanya untuk soal terjawab (3*5 + 2*5 = 25)", s.xp - xpBefore === 25 && /waktu habis/.test($("#result-topic").textContent), `delta=${s.xp - xpBefore} topic=${$("#result-topic").textContent}`);
  check("G. waktu habis tidak memberi bonus penyelesaian", !/Semua soal dijawab/.test(r.text), r.text);

  // ID sesi semua unik dan tercatat
  s = saved(); check("H. setiap sesi yang selesai tercatat sekali (ID unik)", new Set(s.rewardedSessions).size === s.rewardedSessions.length && s.rewardedSessions.length === 5, JSON.stringify(s.rewardedSessions.length));
  fs.writeFileSync(STORE, JSON.stringify(Object.fromEntries(Object.keys(localStorage).map(k => [k, localStorage.getItem(k)]))));
  console.log("STATE", JSON.stringify(card()));
} else {
  const c = card(), s = saved();
  check("R. setelah reload data tetap ada: kartu menunjukkan progres tersimpan", s && s.xp > 0 && c.xp === s.xp.toLocaleString("id-ID") && c.gems === String(s.gemcrys) && c.level === String(s.level), JSON.stringify({ c, s: s && { xp: s.xp, gemcrys: s.gemcrys } }));
  // buka lagi hasil sesi lama tidak mungkin diklaim ulang: sesi baru butuh ID baru, ID lama sudah tercatat
  const before = JSON.stringify(s); startSession(5); finish();
  check("R. setelah reload: sesi baru tetap diproses benar & tidak merusak data lama", saved().rewardedSessions.length === s.rewardedSessions.length + 1 && saved().xp === s.xp);
}
const failed = results.filter(x => !x).length; console.log(`\n${results.length - failed}/${results.length} lulus`); process.exit(failed ? 1 : 0);
