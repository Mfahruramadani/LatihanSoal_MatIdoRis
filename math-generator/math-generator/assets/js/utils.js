export function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
export function choose(items) {
  return items[Math.floor(Math.random() * items.length)];
}
export function gcd(a, b) {
  a = Math.abs(a); b = Math.abs(b);
  while (b) [a, b] = [b, a % b];
  return a || 1;
}
export function shuffle(items) {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
export function formatTime(seconds) {
  const m = Math.floor(seconds / 60).toString().padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}
export function normalizeText(value) {
  return String(value ?? "").trim().replace(/\s+/g, "").replace(/,/g, ".").toLowerCase();
}
export function parseFraction(value) {
  const t = String(value ?? "").trim().replace(/[−–—]/g, "-").replace(/%$/, "").replace(/,/g, ".");
  let m = t.match(/^(-?)(\d+)\s+(\d+)\/(\d+)$/); // pecahan campuran: 2 3/4
  if (m) return m[4] === "0" ? null : (m[1] ? -1 : 1) * (Number(m[2]) + m[3] / m[4]);
  const raw = t.replace(/\s/g, "");
  if (/^-?\d+\/\d+$/.test(raw)) { const [n, d] = raw.split("/").map(Number); return d === 0 ? null : n / d; }
  if (/^-?\d+(\.\d+)?$/.test(raw)) return Number(raw);
  return null;
}

// ---- Tambahan v3 ----
export function fmtScaled(N, k) { // integer N dengan k desimal -> teks (koma desimal)
  const neg = N < 0; let s = String(Math.abs(N));
  if (k > 0) { s = s.padStart(k + 1, "0"); const f = s.slice(-k).replace(/0+$/, ""); s = s.slice(0, -k) + (f ? "," + f : ""); }
  return (neg ? "-" : "") + s;
}
export function sup(n) { return String(n).replace(/\d/g, d => "⁰¹²³⁴⁵⁶⁷⁸⁹"[d]); }
export function primeFactors(n) {
  const f = []; for (let p = 2; p * p <= n; p++) while (n % p === 0) { f.push(p); n /= p; }
  if (n > 1) f.push(n); return f;
}
export function parseFactors(value) {
  const out = [];
  for (const t of String(value ?? "").toLowerCase().replace(/\s/g, "").split(/[×x*·]/)) {
    const m = t.match(/^(\d+)(?:\^(\d+))?$/); if (!m) return null;
    for (let i = 0; i < Number(m[2] ?? 1); i++) out.push(Number(m[1]));
  }
  return out.sort((a, b) => a - b);
}

export function normWord(value) { // huruf saja: abaikan spasi, tanda hubung, huruf besar
  return String(value ?? "").toLowerCase().replace(/[^a-z]/g, "");
}

// ---- Format pilihan ganda & bank soal (v6) ----
export function mc(prompt, answer, wrong, explanation) {
  const w = shuffle([...new Set(wrong.map(String))].filter(x => x !== String(answer))).slice(0, 3);
  return { kind: "choice", prompt, answer: String(answer), choices: shuffle([String(answer), ...w]), explanation };
}
export function mcNum(prompt, ans, explanation, f = String) {
  const b = Math.max(1, Math.round(Math.abs(ans) / 10));
  const c = [ans + 1, ans - 1, ans + 10, ans - 10, ans * 2, Math.round(ans / 2), -ans, ans + b, ans - b, ans + 2];
  const ok = [...new Set(c)].filter(x => x !== ans && (ans < 0 || x >= 0));
  return mc(prompt, f(ans), shuffle(ok).slice(0, 3).map(f), explanation);
}
// baris: "tingkat|soal|jawaban|salah1~salah2~salah3|pembahasan"
export const bank = lines => lines.map(l => { const [lv, prompt, answer, wrong, expl] = l.split("|"); return { lv: +lv, prompt, answer, wrong: wrong.split("~"), expl }; });
export function pickBank(items, d) {
  const r = { easy: [1], medium: [1, 2], hard: [2, 3] }[d] || [1, 2, 3];
  const pool = items.filter(i => r.includes(i.lv));
  return choose(pool.length ? pool : items);
}
export const mcItem = it => mc(it.prompt, it.answer, it.wrong, it.expl);

// ---- v8: hash string -> bilangan (cyrb53), dipakai untuk riwayat soal ----
export function hash53(str, seed = 0) {
  let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
  for (let i = 0; i < str.length; i++) { const ch = str.charCodeAt(i); h1 = Math.imul(h1 ^ ch, 2654435761); h2 = Math.imul(h2 ^ ch, 1597334677); }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(36);
}
// pilihan ganda dengan jumlah pilihan salah yang dijamin cukup (isi dari cadangan bila kurang)
export function mc4(prompt, answer, wrong, spare, explanation) {
  const pool = [...new Set([...wrong, ...shuffle(spare)].map(String))].filter(x => x !== String(answer));
  return mc(prompt, answer, [...wrong.map(String).filter(x => x !== String(answer)), ...pool], explanation);
}
