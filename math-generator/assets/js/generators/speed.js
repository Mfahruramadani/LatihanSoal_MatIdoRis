import { randInt, choose, shuffle, mc, mcNum, fmtScaled } from "../utils.js";

const R = (d, e, m, h) => d === "easy" ? e : d === "medium" ? m : h;
const BASE = { calc: 10, maxmin: 9, symbol: 16, find: 12, compare: 7, diff: 10, change: 12 };
const timed = (q, kind, d) => ({ ...q, timeLimit: Math.round(BASE[kind] * R(d, 1.4, 1, .75)) });
const SYM = ["▲", "●", "■", "★", "◆", "✚", "⬟", "☾"];

function calc(d) {
  const a = R(d, randInt(2, 30), randInt(6, 12), randInt(11, 25)), b = R(d, randInt(2, 30), randInt(6, 12), randInt(3, 9)), c = randInt(2, 30);
  const t = choose(R(d, ["+", "−"], ["×", "+", "−"], ["×+", "(+)×", "×−"]));
  const x = t === "−" ? Math.max(a, b) : a, y = t === "−" ? Math.min(a, b) : b;
  const [e, r] = { "+": [`${a} + ${b}`, a + b], "−": [`${x} − ${y}`, x - y], "×": [`${a} × ${b}`, a * b], "×+": [`${a} × ${b} + ${c}`, a * b + c],
    "(+)×": [`(${a} + ${b}) × ${randInt(3, 9)}`, 0], "×−": [`${a} × ${b} − ${c}`, a * b - c] }[t];
  if (t === "(+)×") { const m = Number(e.split("× ")[1]); return timed({ prompt: `${e} = ?`, answer: String((a + b) * m), explanation: `(${a} + ${b}) × ${m} = ${a + b} × ${m} = ${(a + b) * m}.` }, "calc", d); }
  return timed({ prompt: `${e} = ?`, answer: String(r), explanation: `${e} = ${r}.` }, "calc", d);
}
function maxmin(d) {
  const n = R(d, 5, 6, 7), sc = R(d, 0, 0, 1), lo = R(d, 10, 100, -300), hi = R(d, 99, 999, 900), set = new Set();
  while (set.size < n) set.add(randInt(lo, hi));
  const v = [...set], s = [...v].sort((a, b) => a - b), f = x => fmtScaled(x, sc);
  const kind = choose(R(d, ["max", "min"], ["max", "min"], ["max", "min", "second"])), ans = kind === "max" ? s[n - 1] : kind === "min" ? s[0] : s[n - 2];
  const name = { max: "terbesar", min: "terkecil", second: "terbesar kedua" }[kind];
  return timed({ prompt: `Angka ${name} dari: ${v.map(f).join(" ; ")}`, answer: f(ans), explanation: `Urutan naik: ${s.map(f).join(" < ")}. Angka ${name} = ${f(ans)}.` }, "maxmin", d);
}
function symbol(d) {
  const n = R(d, 3, 4, 6), syms = shuffle(SYM).slice(0, n), codes = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, n), len = R(d, 3, 4, 5);
  const seq = Array.from({ length: len }, () => randInt(0, n - 1)), ans = seq.map(i => codes[i]).join("");
  return timed({ kind: "seq", prompt: `Kunci: ${syms.map((s, i) => `${s} = ${codes[i]}`).join("   ")}\nUbah menjadi angka: ${seq.map(i => syms[i]).join(" ")}`, answer: ans, explanation: `Cocokkan tiap simbol dengan kuncinya: ${seq.map(i => `${syms[i]}→${codes[i]}`).join(", ")}. Hasil: ${ans}.` }, "symbol", d);
}
function find(d) {
  const pool = R(d, "12345", "ABCDEFGH", "OQDGC0U"), len = R(d, 12, 20, 28), chars = Array.from({ length: len }, () => choose([...pool]));
  const target = choose(chars), cnt = chars.filter(c => c === target).length;
  return timed({ prompt: `Berapa kali “${target}” muncul?\n${chars.join(" ")}`, answer: String(cnt), explanation: `Huruf/angka “${target}” muncul ${cnt} kali.` }, "find", d);
}
function compare(d) {
  const mk = (n, dn, text) => ({ n, dn, text });
  let x, y;
  if (d === "easy") { do { const a = randInt(10, 99), b = randInt(10, 99); x = mk(a, 1, String(a)); y = mk(b, 1, String(b)); } while (x.n === y.n); }
  else if (d === "medium") { const a = randInt(1, 9), b = randInt(2, 10), s = randInt(1, 9) * 10 + randInt(0, 9); x = mk(a, b, `${a}/${b}`); y = mk(s, 100, fmtScaled(s, 2)); }
  else { const t = choose(["frac", "pow"]); if (t === "pow") { const a = randInt(2, 4), b = randInt(2, 5), c = randInt(2, 7), e = randInt(2, 3); x = mk(a ** b, 1, `${a}${"⁰¹²³⁴⁵⁶⁷⁸⁹"[b]}`); y = mk(c ** e, 1, `${c}${"⁰¹²³⁴⁵⁶⁷⁸⁹"[e]}`); }
    else { const a = randInt(3, 12), b = randInt(a + 1, 15), c = randInt(3, 12), e = randInt(c + 1, 15); x = mk(a, b, `${a}/${b}`); y = mk(c, e, `${c}/${e}`); } }
  const L = x.n * y.dn, Rr = y.n * x.dn, ans = L > Rr ? x.text : L < Rr ? y.text : "Sama besar";
  return timed(mc(`Manakah yang lebih besar: ${x.text} atau ${y.text}?`, ans, [x.text, y.text, "Sama besar"], L === Rr ? "Kedua nilai sama besar." : `Samakan penyebut atau hitung nilainya: ${x.text} ${L > Rr ? ">" : "<"} ${y.text}.`), "compare", d);
}
function diff(d) {
  const len = R(d, 6, 8, 10), A = Array.from({ length: len }, () => choose(SYM.slice(0, 5))), B = [...A], k = d === "hard" ? randInt(2, 3) : 1, pos = shuffle(A.map((_, i) => i)).slice(0, k).sort((a, b) => a - b);
  pos.forEach(i => { B[i] = choose(SYM.filter(s => s !== A[i])); });
  const show = `Baris A: ${A.join(" ")}\nBaris B: ${B.join(" ")}\n`;
  const ex = `Perbedaan ada pada posisi ${pos.map(i => i + 1).join(", ")}.`;
  if (k === 1) return timed(mc(`${show}Pada posisi ke berapa kedua baris berbeda?`, pos[0] + 1, A.map((_, i) => i + 1), ex), "diff", d);
  return timed(mcNum(`${show}Berapa banyak posisi yang berbeda?`, k, ex), "diff", d);
}
function change(d) {
  const len = R(d, 6, 7, 8), geo = d === "hard" && Math.random() < .5, a = randInt(1, 9), k = geo ? choose([2, 3]) : randInt(2, 9), s = Array.from({ length: len }, (_, i) => geo ? a * k ** i : a + i * k), b = randInt(2, len - 2), old = s[b];
  s[b] += choose([1, 2, 3, -1, -2]) * (geo ? 1 : 1);
  return timed(mc(`Deret: ${s.join(", ")}\nAngka manakah yang melanggar pola?`, s[b], s.filter((_, i) => i !== b), `Pola: ${geo ? `dikali ${k}` : `bertambah ${k}`}. Seharusnya ${old}, bukan ${s[b]}.`), "change", d);
}
export function generateSpeed(sub, d) {
  const t = sub === "mixed" ? choose(["calc", "maxmin", "symbol", "find", "compare", "diff", "change"]) : sub;
  return ({ calc, maxmin, symbol, find, compare, diff, change })[t](d);
}
