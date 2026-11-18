import { randInt, choose, fmtScaled as f } from "../utils.js";

const roundTo = (n, p) => Math.floor((n + p / 2) / p) * p;
const NAME = { 10: "puluhan", 100: "ratusan", 1000: "ribuan" };

export function generateRounding(subtype, difficulty) {
  const t = subtype === "mixed" ? choose(["round", "estimate"]) : subtype;
  if (t === "round") {
    if (difficulty === "hard") {
      const N = randInt(1001, 99999), dec = choose([1, 0]);
      const r = dec ? Math.floor((N + 5) / 10) : Math.floor((N + 50) / 100);
      return { prompt: `Bulatkan ${f(N, 2)} ke ${dec ? "satu desimal" : "bilangan bulat"} terdekat.`, answer: f(r, dec),
        explanation: `Lihat angka setelah tempat pembulatan: ≥ 5 dibulatkan ke atas, < 5 ke bawah. Hasil: ${f(r, dec)}.` };
    }
    const p = difficulty === "easy" ? choose([10, 100]) : choose([10, 100, 1000]);
    const n = difficulty === "easy" ? randInt(11, 999) : randInt(1001, 99999);
    return { prompt: `Bulatkan ${n} ke ${NAME[p]} terdekat.`, answer: String(roundTo(n, p)),
      explanation: `Lihat angka di kanan tempat ${NAME[p]}: ≥ 5 dibulatkan ke atas, < 5 ke bawah. Hasil: ${roundTo(n, p)}.` };
  }
  const p = difficulty === "medium" ? 100 : 10, s = difficulty === "hard" ? "×" : choose(["+", "−"]);
  let a = difficulty === "medium" ? randInt(101, 999) : randInt(11, 99), b = difficulty === "medium" ? randInt(101, 999) : randInt(11, 99);
  if (s === "−" && b > a) [a, b] = [b, a];
  const ra = roundTo(a, p), rb = roundTo(b, p), r = s === "+" ? ra + rb : s === "−" ? ra - rb : ra * rb;
  return { prompt: `Taksir ${a} ${s} ${b} dengan membulatkan tiap bilangan ke ${NAME[p]} terdekat.`, answer: String(r),
    explanation: `${a} ≈ ${ra} dan ${b} ≈ ${rb}, sehingga ${ra} ${s} ${rb} = ${r}.` };
}
