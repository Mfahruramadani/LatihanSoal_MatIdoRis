import { randInt, choose, gcd } from "../utils.js";

const red = (n, d) => { const g = gcd(n, d); return { n: n / g, d: d / g }; };
const mixed = ({ n, d }) => d === 1 ? String(n) : n > d ? `${Math.floor(n / d)} ${n % d}/${d}` : `${n}/${d}`;
function rnd(maxD, maxW) { // pecahan campuran dengan sisa yang sudah sederhana
  let d, r; do { d = randInt(2, maxD); r = randInt(1, d - 1); } while (gcd(r, d) !== 1);
  const w = randInt(1, maxW); return { w, r, d, n: w * d + r };
}

export function generateMixedFraction(subtype, difficulty) {
  const maxD = difficulty === "easy" ? 6 : difficulty === "medium" ? 10 : 15, maxW = difficulty === "easy" ? 3 : 9;
  const t = subtype === "mixed" ? choose(["to_mixed", "to_improper", "add", "subtract"]) : subtype;
  const x = rnd(maxD, maxW), y = rnd(maxD, maxW), txt = m => `${m.w} ${m.r}/${m.d}`;
  if (t === "to_mixed") return { prompt: `Ubah ${x.n}/${x.d} menjadi pecahan campuran.`, answer: txt(x), answerValue: { n: x.n, d: x.d },
    explanation: `${x.n} ÷ ${x.d} = ${x.w} sisa ${x.r}, jadi ${txt(x)}.` };
  if (t === "to_improper") return { prompt: `Ubah ${txt(x)} menjadi pecahan biasa.`, answer: `${x.n}/${x.d}`, answerValue: { n: x.n, d: x.d },
    explanation: `(${x.w} × ${x.d} + ${x.r}) / ${x.d} = ${x.n}/${x.d}.` };
  let a = x, b = y, s = "+";
  if (t === "subtract") { s = "−"; if (a.n * b.d < b.n * a.d) [a, b] = [b, a]; }
  const r = red(s === "+" ? a.n * b.d + b.n * a.d : a.n * b.d - b.n * a.d, a.d * b.d);
  return { prompt: `${txt(a)} ${s} ${txt(b)} = ?  (campuran ditulis 2 3/4)`, answer: mixed(r), answerValue: r,
    explanation: `Ubah ke pecahan biasa: ${a.n}/${a.d} ${s} ${b.n}/${b.d}. Samakan penyebut, hitung, sederhanakan: ${mixed(r)}.` };
}
